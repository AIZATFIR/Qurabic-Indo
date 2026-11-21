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

    const originalSetTimeout = globalThis.setTimeout;
    let timeoutDuration: number | undefined;
    let aborted = false;
    globalThis.setTimeout = ((callback: TimerHandler, timeout?: number, ...args: unknown[]) => {
      if (timeout === 8_000) timeoutDuration = timeout;
      return originalSetTimeout(callback, timeout === 8_000 ? 0 : timeout, ...args);
    }) as typeof setTimeout;
    globalThis.fetch = async (_input, init) => new Promise((_, reject) => {
      init?.signal?.addEventListener('abort', () => {
        aborted = true;
        reject(new DOMException('Request aborted', 'AbortError'));
      }, { once: true });
    });
    try {
      await assert.rejects(loadWordDetail('/api/word-detail?location=1%3A1%3A1'), { name: 'AbortError' });
      assert.equal(timeoutDuration, 8_000, 'stalled entry requests fail visibly after eight seconds');
      assert.equal(aborted, true, 'timeout aborts the pending fetch');
    } finally {
      globalThis.setTimeout = originalSetTimeout;
    }
    console.log('Passed: word-detail URL, hover deduplication, and response reuse.');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

void main();
