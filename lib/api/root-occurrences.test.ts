import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchRootOccurrences } from './root-occurrences';

test('loads full verse context for a root from its public occurrence asset', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify([{
      surahNumber: 2,
      ayahNumber: 45,
      surahNameIndo: 'Al-Baqarah',
      surahNameArabic: 'البقرة',
      verseArabic: 'وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ',
      verseIndo: 'Jadikanlah sabar dan salat sebagai penolongmu.',
      matchedWordArabic: 'بِٱلصَّبْرِ',
      matchedWordIndo: 'dengan sabar',
      wordLocation: '2:45:2',
    }]), { status: 200 });
  };

  try {
    const occurrences = await fetchRootOccurrences('S-b-r');
    assert.equal(requestedUrl, '/data/occurrences/S-b-r.json');
    assert.equal(occurrences.length, 1);
    assert.match(occurrences[0].verseIndo, /Jadikanlah sabar/);
    assert.match(occurrences[0].verseArabic, /بِٱلصَّبْرِ/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rejects unavailable root occurrence assets so the UI can show its empty state', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 404 });

  try {
    await assert.rejects(fetchRootOccurrences('missing-root'), /Root occurrences unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('aborts a stalled root occurrence download', async () => {
  const originalFetch = globalThis.fetch;
  const originalSetTimeout = globalThis.setTimeout;
  let signal: AbortSignal | undefined;
  let timeoutDuration: number | undefined;
  globalThis.setTimeout = ((callback: TimerHandler, timeout?: number, ...args: unknown[]) =>
    { if (timeout === 12_000) timeoutDuration = timeout; return originalSetTimeout(callback, timeout === 12_000 ? 0 : timeout, ...args); }) as typeof setTimeout;
  globalThis.fetch = async (_input, init) => new Promise((_, reject) => {
    signal = init?.signal as AbortSignal | undefined;
    signal?.addEventListener('abort', () => reject(new DOMException('Request aborted', 'AbortError')), { once: true });
  });

  try {
    await assert.rejects(fetchRootOccurrences('S-b-r'), { name: 'AbortError' });
    assert.equal(signal?.aborted, true, 'the occurrence request is cancelled when it stalls');
    assert.equal(timeoutDuration, 12_000, 'root occurrence requests allow cold asset reads up to twelve seconds');
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.setTimeout = originalSetTimeout;
  }
});
