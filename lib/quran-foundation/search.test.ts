import assert from 'node:assert/strict';
import { searchQuranFoundation } from './search';

const environmentKeys = ['QF_CLIENT_ID', 'QF_CLIENT_SECRET', 'QF_ENV', 'QF_SEARCH_SCOPES'] as const;
const originalEnvironment = Object.fromEntries(environmentKeys.map((key) => [key, process.env[key]]));
const originalFetch = globalThis.fetch;
const requests: Array<{ url: URL; init: RequestInit }> = [];

async function main() {
  try {
    process.env.QF_CLIENT_ID = 'test-client-id';
    process.env.QF_CLIENT_SECRET = 'test-client-secret';
    process.env.QF_ENV = 'production';
    process.env.QF_SEARCH_SCOPES = 'search';
    globalThis.fetch = (async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const url = new URL(String(input));
      requests.push({ url, init });
      if (url.hostname === 'oauth2.quran.foundation') {
        return Response.json({ access_token: 'test-access-token', expires_in: 3600 });
      }
      return Response.json({
        pagination: { current_page: 2, next_page: 3, total_pages: 3 },
        result: { verses: [{ key: '2:255', name: 'Ayat al-Kursi' }] },
      });
    }) as typeof fetch;

    const result = await searchQuranFoundation('mercy', 2, 30);
    const tokenRequest = requests[0];
    const searchRequest = requests[1];
    const tokenBody = new URLSearchParams(String(tokenRequest.init.body));

    assert.equal(tokenRequest.url.pathname, '/oauth2/token');
    assert.equal(tokenBody.get('scope'), 'search');
    assert.equal(searchRequest.url.origin, 'https://apis.quran.foundation');
    assert.equal(searchRequest.url.pathname, '/search/api/v1/search');
    assert.equal(searchRequest.url.searchParams.get('mode'), 'advanced');
    assert.equal(searchRequest.url.searchParams.get('query'), 'mercy');
    assert.equal(searchRequest.url.searchParams.get('page'), '2');
    assert.equal(searchRequest.url.searchParams.get('size'), '30');
    assert.equal(searchRequest.url.searchParams.get('translation_ids'), '20');
    assert.equal((searchRequest.init.headers as Record<string, string>)['x-auth-token'], 'test-access-token');
    assert.equal(result.pagination?.next_page, 3);
    assert.equal(result.result?.verses?.[0].key, '2:255');
    process.stdout.write('Quran Foundation Search client contract passed.\n');
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of environmentKeys) {
      const value = originalEnvironment[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
