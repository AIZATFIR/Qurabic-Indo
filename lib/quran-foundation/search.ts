interface CachedToken {
  value: string;
  expiresAt: number;
}

export interface QuranFoundationSearchResponse {
  result?: {
    verses?: Array<{ key?: unknown; [key: string]: unknown }>;
  };
  pagination?: {
    current_page?: number;
    next_page?: number | null;
    total_pages?: number;
  };
}

let cachedToken: CachedToken | undefined;
let tokenRequest: Promise<string> | undefined;

function getConfiguration() {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const configuredEnvironment = process.env.QF_ENV;
  const environment = configuredEnvironment || (process.env.NODE_ENV === 'production' ? '' : 'prelive');
  const scopes = process.env.QF_SEARCH_SCOPES || 'search';
  if (!clientId || !clientSecret || (environment !== 'prelive' && environment !== 'production')) {
    throw new Error('Quran Foundation Search is not configured.');
  }
  return { clientId, clientSecret, environment, scopes };
}

export function isQuranFoundationSearchConfigured(): boolean {
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

async function fetchQuranFoundation(url: string, init: RequestInit): Promise<Response> {
  const timeout = timeoutSignal(8_000);
  try {
    return await fetch(url, { ...init, signal: timeout.signal, cache: 'no-store' });
  } catch {
    throw new Error('Quran Foundation Search is temporarily unavailable.');
  } finally {
    timeout.clear();
  }
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  if (!forceRefresh && tokenRequest) return tokenRequest;

  const { clientId, clientSecret, environment, scopes } = getConfiguration();
  const auth = environment === 'production'
    ? 'https://oauth2.quran.foundation'
    : 'https://prelive-oauth2.quran.foundation';
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'client_credentials', scope: scopes });

  tokenRequest = (async () => {
    const response = await fetchQuranFoundation(`${auth}/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!response.ok) throw new Error('Quran Foundation Search credentials or scope were rejected.');
    const payload = await response.json() as { access_token?: unknown; expires_in?: unknown };
    if (typeof payload.access_token !== 'string' || !payload.access_token || typeof payload.expires_in !== 'number') {
      throw new Error('Quran Foundation Search returned an invalid token.');
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

export async function searchQuranFoundation(
  query: string,
  page: number,
  size: number,
): Promise<QuranFoundationSearchResponse> {
  const { clientId, environment } = getConfiguration();
  const host = environment === 'production'
    ? 'https://apis.quran.foundation'
    : 'https://apis-prelive.quran.foundation';
  const params = new URLSearchParams({
    mode: 'advanced',
    query,
    page: String(page),
    size: String(size),
    translation_ids: '20',
    get_text: '1',
    highlight: '0',
  });
  const url = `${host}/search/api/v1/search?${params.toString()}`;

  const request = (refreshToken: boolean) => getAccessToken(refreshToken).then((token) => fetchQuranFoundation(url, {
    headers: { 'x-auth-token': token, 'x-client-id': clientId, Accept: 'application/json' },
  }));
  let response = await request(false);
  if (response.status === 401) {
    cachedToken = undefined;
    response = await request(true);
  }
  if (!response.ok) throw new Error('Quran Foundation Search request failed.');
  const payload = await response.json() as QuranFoundationSearchResponse;
  if (!payload || typeof payload !== 'object' || !Array.isArray(payload.result?.verses)) {
    throw new Error('Quran Foundation Search returned an invalid result.');
  }
  return payload;
}
