interface CachedToken {
  value: string;
  expiresAt: number;
}

export interface QuranFoundationRecitation {
  id: number;
  reciterName: string;
  style: string;
  name: string;
}

export interface QuranFoundationAyahAudio {
  verseKey: string;
  url: string;
}

let cachedToken: CachedToken | undefined;
let tokenRequest: Promise<string> | undefined;

function getConfiguration() {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const configuredEnvironment = process.env.QF_ENV;
  const environment = configuredEnvironment || (process.env.NODE_ENV === 'production' ? '' : 'prelive');
  const scopes = process.env.QF_AUDIO_SCOPES || 'content.audio.read';
  if (!clientId || !clientSecret || (environment !== 'prelive' && environment !== 'production')) {
    throw new Error('Quran Foundation audio is not configured.');
  }
  return { clientId, clientSecret, environment, scopes };
}

export function isQuranFoundationAudioApiConfigured(): boolean {
  try {
    getConfiguration();
    return true;
  } catch {
    return false;
  }
}

function timeoutSignal(milliseconds: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), milliseconds);
  return { signal: controller.signal, clear: () => clearTimeout(timeout) };
}

async function fetchQf(url: string, init: RequestInit): Promise<Response> {
  const timeout = timeoutSignal(8_000);
  try {
    return await fetch(url, { ...init, signal: timeout.signal, cache: 'no-store' });
  } catch {
    throw new Error('Quran Foundation audio is temporarily unavailable.');
  } finally {
    timeout.clear();
  }
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  if (!forceRefresh && tokenRequest) return tokenRequest;

  const { clientId, clientSecret, environment, scopes } = getConfiguration();
  const authHost = environment === 'production' ? 'https://oauth2.quran.foundation' : 'https://prelive-oauth2.quran.foundation';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'client_credentials', scope: scopes });

  tokenRequest = (async () => {
    const response = await fetchQf(`${authHost}/oauth2/token`, {
      method: 'POST',
      headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    if (!response.ok) throw new Error('Quran Foundation audio credentials or scope were rejected.');
    const payload = await response.json() as { access_token?: unknown; expires_in?: unknown };
    if (typeof payload.access_token !== 'string' || !payload.access_token || typeof payload.expires_in !== 'number') {
      throw new Error('Quran Foundation audio returned an invalid token.');
    }
    cachedToken = { value: payload.access_token, expiresAt: Date.now() + payload.expires_in * 1000 };
    return payload.access_token;
  })();

  try {
    return await tokenRequest;
  } finally {
    tokenRequest = undefined;
  }
}

async function requestQf(path: string): Promise<Response> {
  const { clientId, environment } = getConfiguration();
  const host = environment === 'production' ? 'https://apis.quran.foundation' : 'https://apis-prelive.quran.foundation';
  const url = `${host}/content/api/v4${path}`;
  const request = (refreshToken: boolean) => getAccessToken(refreshToken).then((token) => fetchQf(url, {
    headers: { 'x-auth-token': token, 'x-client-id': clientId, Accept: 'application/json' },
  }));
  let response = await request(false);
  if (response.status === 401) {
    cachedToken = undefined;
    response = await request(true);
  }
  if (!response.ok) throw new Error(`Quran Foundation audio request failed (${response.status}).`);
  return response;
}

export async function listQuranFoundationRecitations(language: 'en' | 'id'): Promise<QuranFoundationRecitation[]> {
  const params = new URLSearchParams({ language });
  const response = await requestQf(`/resources/recitations?${params}`);
  const payload = await response.json() as { recitations?: unknown };
  if (!Array.isArray(payload?.recitations)) throw new Error('Quran Foundation returned an invalid recitation list.');
  return payload.recitations.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as Record<string, unknown>;
    const translated = row.translated_name && typeof row.translated_name === 'object'
      ? (row.translated_name as Record<string, unknown>).name
      : undefined;
    if (!Number.isInteger(row.id) || typeof row.reciter_name !== 'string' || typeof row.style !== 'string') return [];
    return [{
      id: row.id as number,
      reciterName: row.reciter_name,
      style: row.style,
      name: typeof translated === 'string' && translated.trim() ? translated : row.reciter_name,
    }];
  });
}

export async function getQuranFoundationAyahAudio(recitationId: number, surahNumber: number): Promise<QuranFoundationAyahAudio[]> {
  if (!Number.isInteger(recitationId) || recitationId < 1 || recitationId > 10_000) throw new Error('Invalid recitation ID.');
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) throw new Error('Invalid surah number.');
  const params = new URLSearchParams({ chapter_number: String(surahNumber) });
  const response = await requestQf(`/quran/recitations/${recitationId}?${params}`);
  const payload = await response.json() as { audio_files?: unknown };
  if (!Array.isArray(payload?.audio_files)) throw new Error('Quran Foundation returned invalid recitation files.');
  return payload.audio_files.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as Record<string, unknown>;
    if (typeof row.verse_key !== 'string' || typeof row.url !== 'string') return [];
    let url: URL;
    try { url = new URL(row.url); } catch { return []; }
    if (url.protocol !== 'https:' || !['verses.quran.com', 'verses.quran.foundation', 'audio.qurancdn.com'].includes(url.hostname)) return [];
    if (!new RegExp(`^${surahNumber}:\\d+$`).test(row.verse_key)) return [];
    return [{ verseKey: row.verse_key, url: url.toString() }];
  });
}
