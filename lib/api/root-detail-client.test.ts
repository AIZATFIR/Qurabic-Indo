import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchRootDetail } from './root-detail-client';

test('root detail requests cancel when the server does not respond', async () => {
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  let signal: AbortSignal | undefined;
  let timeoutDuration: number | undefined;
  globalThis.setTimeout = ((callback: TimerHandler, timeout?: number, ...args: unknown[]) => {
    if (timeout === 5_000) timeoutDuration = timeout;
    return originalSetTimeout(callback, timeout === 5_000 ? 0 : timeout, ...args);
  }) as typeof setTimeout;
  globalThis.fetch = async (_input, init) => new Promise((_, reject) => {
    signal = init?.signal as AbortSignal | undefined;
    signal?.addEventListener('abort', () => reject(new DOMException('Request aborted', 'AbortError')), { once: true });
  });

  try {
    await assert.rejects(fetchRootDetail('S-b-r'), { name: 'AbortError' });
    assert.equal(timeoutDuration, 5_000);
    assert.equal(signal?.aborted, true);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
  }
});
