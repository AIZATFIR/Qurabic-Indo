import test from 'node:test';
import assert from 'node:assert/strict';
import { cacheAudioForOffline, getCachedAudioUrl, getNextAudioPreloadUrl, getNextAudioPreloadUrls, getStoredAudioUrl, preloadNextAudioTrack, preloadTranslationAudio } from './audio-preloader';

const base = {
  surahNumber: 1,
  currentAyah: 1,
  totalAyahs: 7,
  handsfreeMode: 'normal' as const,
  repeatMode: 'off' as const,
  autoNext: true,
  qariId: 'alafasy',
  translationLanguage: 'id' as const,
};
const qfAudioUrl = 'https://verses.quran.com/Alafasy/mp3/001001.mp3';

test('preloader fetches only the immediate next track in handsfree sequence', () => {
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'arabic' }) || '', /AlQuran-terjemahan-indonesia.*001001\.mp3$/);
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'translation' }) || '', /verses\.quran\.com.*001002\.mp3$/);
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'arabic', surahNumber: 18, currentAyah: 1, totalAyahs: 110 }) || '', /verses\.quran\.com.*018002\.mp3$/);
});

test('warms only the preferred human source', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const requests: string[] = [];
  const pendingResponses: Array<(response: Response) => void> = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { caches: { open: async () => ({ match: async () => undefined, put: async () => undefined }) } },
  });
  globalThis.fetch = async (input) => {
    requests.push(String(input));
    return new Promise((resolve) => pendingResponses.push(resolve));
  };

  try {
    const warmup = preloadTranslationAudio(1, 1, undefined, 'human', 'id');
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(requests.length, 1);
    assert.ok(requests[0].includes('AlQuran-terjemahan-indonesia'));
    for (const resolve of pendingResponses) resolve(new Response(new Blob(['audio']), { status: 200 }));
    await warmup;
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    else delete (globalThis as unknown as { window?: Window }).window;
  }
});

test('stores a downloaded recitation in persistent Cache Storage without a memory Blob copy', async () => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  const saved: string[] = [];
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { caches: { open: async () => ({ match: async () => undefined, put: async (url: string) => { saved.push(url); } }) } },
  });
  globalThis.fetch = async () => new Response(new Blob(['audio']), { status: 200 });

  try {
    await cacheAudioForOffline(qfAudioUrl);
    assert.deepEqual(saved, [qfAudioUrl]);
    assert.equal(getCachedAudioUrl(qfAudioUrl), undefined);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    else delete (globalThis as unknown as { window?: Window }).window;
  }
});

test('reads a saved recitation from persistent storage when playback needs it', async () => {
  const originalWindow = globalThis.window;
  const url = qfAudioUrl;
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { caches: { open: async () => ({ match: async () => new Response(new Blob(['audio']), { status: 200 }) }) } },
  });

  try {
    const storedUrl = await getStoredAudioUrl(url);
    assert.match(storedUrl || '', /^blob:/);
    assert.equal(getCachedAudioUrl(url), storedUrl);
  } finally {
    globalThis.URL.revokeObjectURL(getCachedAudioUrl(url) || '');
    if (originalWindow) Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    else delete (globalThis as unknown as { window?: Window }).window;
  }
});
