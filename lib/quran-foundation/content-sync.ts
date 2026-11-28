const RESOURCE_FILTER = 'quran_core:1;translations:20,33;recitations:7';
const PAGE_SIZE = '100';
const FETCH_TIMEOUT_MS = 15_000;

type QfEnvironment = 'prelive' | 'production';
type SyncOperation = 'bootstrap' | 'sync' | 'snapshot';

interface TokenPayload {
  access_token?: unknown;
  expires_in?: unknown;
}

interface CachedToken {
  value: string;
  expiresAt: number;
}

export class ContentSyncError extends Error {
  constructor(message: string, readonly status: number, readonly code: string) {
    super(message);
    this.name = 'ContentSyncError';
  }
}

let cachedToken: CachedToken | undefined;
let tokenRequest: Promise<string> | undefined;

function getConfiguration() {
  const clientId = process.env.QF_CLIENT_ID;
  const clientSecret = process.env.QF_CLIENT_SECRET;
  const configuredEnvironment = process.env.QF_ENV;
  const environment = configuredEnvironment || (process.env.NODE_ENV === 'production' ? '' : 'prelive');
  const scopes = process.env.QF_CONTENT_SCOPES || 'content.sync.read content.quran.read content.translations.read';

  if (!clientId || !clientSecret || (environment !== 'prelive' && environment !== 'production')) {
    throw new ContentSyncError('Offline Quran sync is not configured.', 503, 'content_sync_unavailable');
  }

  return { clientId, clientSecret, environment: environment as QfEnvironment, scopes };
}

function urlsFor(environment: QfEnvironment) {
  return environment === 'production'
    ? { auth: 'https://oauth2.quran.foundation', api: 'https://apis.quran.foundation/content' }
    : { auth: 'https://prelive-oauth2.quran.foundation', api: 'https://apis-prelive.quran.foundation/content' };
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal, cache: 'no-store' });
  } catch {
    throw new ContentSyncError('Quran content service could not be reached.', 502, 'content_sync_upstream_unavailable');
  } finally {
    clearTimeout(timeout);
  }
}

async function getAccessToken(forceRefresh = false): Promise<string> {
  if (!forceRefresh && cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  if (!forceRefresh && tokenRequest) return tokenRequest;

  const { clientId, clientSecret, environment, scopes } = getConfiguration();
  const { auth } = urlsFor(environment);
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = new URLSearchParams({ grant_type: 'client_credentials', scope: scopes });

  tokenRequest = (async () => {
    const response = await fetchWithTimeout(`${auth}/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!response.ok) throw new ContentSyncError('Quran content credentials were rejected.', 503, 'content_sync_auth_failed');

    let payload: TokenPayload;
    try {
      payload = await response.json() as TokenPayload;
    } catch {
      throw new ContentSyncError('Quran content service returned an invalid token response.', 502, 'content_sync_invalid_response');
    }

    if (typeof payload.access_token !== 'string' || !payload.access_token || typeof payload.expires_in !== 'number') {
      throw new ContentSyncError('Quran content service returned an invalid token response.', 502, 'content_sync_invalid_response');
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

function getApprovedUpstreamPath(operation: SyncOperation, params: URLSearchParams): string {
  if (operation === 'bootstrap') {
    const query = new URLSearchParams({ bootstrap: 'true', resources: RESOURCE_FILTER, per_page: PAGE_SIZE });
    return `/api/v4/resources/sync?${query.toString()}`;
  }

  if (operation === 'sync') {
    const cursor = params.get('cursor');
    if (cursor) {
      if (!/^\/api\/v4\/resources\/sync\?cursor=[A-Za-z0-9%._~!$&'()*+,;=:@/?-]{1,4096}$/.test(cursor)) {
        throw new ContentSyncError('Invalid Quran sync cursor.', 400, 'invalid_content_sync_cursor');
      }
      return cursor;
    }

    const syncToken = params.get('sync_token') || '';
    if (!syncToken || syncToken.length > 4096) {
      throw new ContentSyncError('A valid Quran sync token is required.', 400, 'invalid_content_sync_token');
    }
    const query = new URLSearchParams({ sync_token: syncToken, resources: RESOURCE_FILTER, per_page: PAGE_SIZE });
    return `/api/v4/resources/sync?${query.toString()}`;
  }

  const snapshotPath = params.get('snapshot_path') || '';
  if (!/^\/api\/v4\/resources\/snapshots\/(?:quran_core\/1|translations\/(?:20|33)|recitations\/7)$/.test(snapshotPath)) {
    throw new ContentSyncError('This Quran resource is not enabled for offline sync.', 400, 'invalid_content_sync_resource');
  }
  return snapshotPath;
}

export async function requestQuranContentSync(operationValue: string, params: URLSearchParams): Promise<Response> {
  if (operationValue !== 'bootstrap' && operationValue !== 'sync' && operationValue !== 'snapshot') {
    throw new ContentSyncError('Unsupported Quran sync operation.', 400, 'invalid_content_sync_operation');
  }

  const operation = operationValue as SyncOperation;
  const { clientId, environment } = getConfiguration();
  const { api } = urlsFor(environment);
  const path = getApprovedUpstreamPath(operation, params);
  const apiBase = `${api}/`;
  const url = new URL(path.replace(/^\//, ''), apiBase);
  if (url.origin !== new URL(apiBase).origin || !url.pathname.startsWith('/content/api/v4/resources/')) {
    throw new ContentSyncError('Invalid Quran content resource path.', 400, 'invalid_content_sync_path');
  }

  return requestAuthenticatedContentUrl(url.toString(), clientId);
}

async function requestAuthenticatedContentUrl(url: string, clientId: string): Promise<Response> {
  const request = async (refreshToken: boolean) => {
    const token = await getAccessToken(refreshToken);
    return fetchWithTimeout(url, {
      headers: {
        'x-auth-token': token,
        'x-client-id': clientId,
        Accept: 'application/json',
      },
    });
  };
  const response = await request(false);
  if (response.ok) return response;
  if (response.status === 401) {
    cachedToken = undefined;
    const retry = await request(true);
    if (retry.ok) return retry;
  }
  throw new ContentSyncError('Quran content sync failed. Try again when connected.', 502, 'content_sync_upstream_failed');
}

export async function requestQuranChapterTranslations(surah: number, page: number): Promise<Response> {
  if (!Number.isInteger(surah) || surah < 1 || surah > 114 || !Number.isInteger(page) || page < 1 || page > 20) {
    throw new ContentSyncError('Invalid Quran translation page.', 400, 'invalid_content_translation_page');
  }
  const { clientId, environment } = getConfiguration();
  const { api } = urlsFor(environment);
  const params = new URLSearchParams({ translations: '20', per_page: '50', page: String(page) });
  const apiBase = `${api}/`;
  const path = `/api/v4/verses/by_chapter/${surah}?${params.toString()}`;
  const url = new URL(path.replace(/^\//, ''), apiBase);
  if (url.origin !== new URL(apiBase).origin || !url.pathname.startsWith('/content/api/v4/verses/by_chapter/')) {
    throw new ContentSyncError('Invalid Quran translation path.', 400, 'invalid_content_translation_path');
  }
  return requestAuthenticatedContentUrl(url.toString(), clientId);
}
