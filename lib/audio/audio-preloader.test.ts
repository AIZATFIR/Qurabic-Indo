import test from 'node:test';
import assert from 'node:assert/strict';
import { getCachedAudioUrl, getNextAudioPreloadUrl, getNextAudioPreloadUrls, preloadNextAudioTrack, preloadTranslationAudio } from './audio-preloader';

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

test('preloader fetches only the immediate next track in handsfree sequence', () => {
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'arabic' }) || '', /AlQuran-terjemahan-indonesia.*001001\.mp3$/);
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'translation' }) || '', /verses\.quran\.com.*001002\.mp3$/);
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'arabic', surahNumber: 18, currentAyah: 1, totalAyahs: 110 }) || '', /verses\.quran\.com.*018002\.mp3$/);
  assert.match(getNextAudioPreloadUrl({ ...base, phase: 'arabic', surahNumber: 18, currentAyah: 1, totalAyahs: 110, translationVoiceMode: 'ai-fallback' }) || '', /audio_m4a\/018\/018001\.m4a/);
});

test('keeps both the preferred recording and disclosed TTS fallback available for a slow next track', () => {
  const candidates = getNextAudioPreloadUrls({ ...base, phase: 'arabic', translationVoiceMode: 'ai-fallback' });
  assert.equal(candidates.length, 2);
  assert.match(candidates[0], /AlQuran-terjemahan-indonesia.*001001\.mp3$/);
  assert.match(candidates[1], /audio_m4a\/001\/001001\.m4a/);
});

test('warms TTS after a short wait only when the human source is still pending', async () => {
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
    preloadNextAudioTrack({ ...base, currentAyah: 2, phase: 'arabic', translationVoiceMode: 'ai-fallback' });
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(requests.length, 1);
    assert.ok(requests[0].includes('AlQuran-terjemahan-indonesia'));
    await new Promise((resolve) => setTimeout(resolve, 450));
    assert.equal(requests.length, 2);
    assert.ok(requests[1].includes('audio_m4a/001/001002.m4a'));
    for (const resolve of pendingResponses) resolve(new Response(new Blob(['audio']), { status: 200 }));
    await new Promise((resolve) => setImmediate(resolve));
    assert.ok(getCachedAudioUrl(requests[1]));
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    else delete (globalThis as unknown as { window?: Window }).window;
  }
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
    const warmup = preloadTranslationAudio(1, 1, undefined, 'ai-fallback', 'id');
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
