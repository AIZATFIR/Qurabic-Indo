import assert from 'node:assert/strict';
import { getWordDetailUrl, loadWordDetail, prefetchWordDetail } from './word-detail-client';

async function main() {
  const url = getWordDetailUrl({ word: 'ٱلْحَمْدُ', location: '114:6:6', surahNumber: 114, ayahNumber: 6, wordIndex: 6 });
  assert.equal(url, '/api/word-detail?location=114%3A6%3A6');

  const originalFetch = globalThis.fetch;
  let fetchCount = 0;
  globalThis.fetch = async () => {
    fetchCount++;
    await new Promise((resolve) => setTimeout(resolve, 20));
    return new Response(JSON.stringify({ data: { study: { identity: { arabic: 'ٱلْحَمْدُ' } } } }), { status: 200 });
  };

  try {
    prefetchWordDetail({ word: 'ٱلْحَمْدُ', location: '114:6:6' });
    const [first, second] = await Promise.all([loadWordDetail(url), loadWordDetail(url)]);
    assert.equal(fetchCount, 1, 'hover prefetch and modal loads should share one request');
    assert.deepEqual(first, second, 'cached word entry payload is reused');
    assert.equal(first.data?.study && (first.data.study as { identity: { arabic: string } }).identity.arabic, 'ٱلْحَمْدُ');
    console.log('Passed: word-detail URL, hover deduplication, and response reuse.');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

void main();
