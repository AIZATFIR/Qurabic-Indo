import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET } from './route';

async function run() {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = (async () => new Response(JSON.stringify({
      verse: { words: [{ location: '18:3:2', translation: { text: 'didalamnya' } }] },
    }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch;

    const response = await GET(new NextRequest('https://qurabic.test/api/word-glosses?language=id&locations=18%3A3%3A2'));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'public, max-age=0, s-maxage=300, stale-while-revalidate=60');
    assert.equal((await response.json()).meanings['18:3:2'], 'di dalamnya');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
