import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchJsonWithTimeout } from './request';

test('upstream JSON fetch rejects a server that never responds', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => new Promise<Response>(() => {})) as typeof fetch;
  const started = Date.now();
  try {
    await assert.rejects(fetchJsonWithTimeout('https://example.test/data', {}, 25), /timed out/i);
    assert.ok(Date.now() - started < 500, 'request timeout stays bounded');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
