import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchSurahTafsir } from './tafsir-service';

test('missing tafsir never fabricates a verse commentary under Kemenag attribution', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(JSON.stringify({ '17': { tafsir: {} } }), { status: 200 });
  try { assert.equal(await fetchSurahTafsir(17), null); }
  finally { globalThis.fetch = originalFetch; }
});
