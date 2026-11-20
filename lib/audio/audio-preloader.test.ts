import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextAudioPreloadUrl, getNextAudioPreloadUrls, preloadTranslationAudio } from './audio-preloader';

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

test('preloads both human and TTS candidates for the next Indonesian translation', () => {
  const candidates = getNextAudioPreloadUrls({ ...base, phase: 'arabic', translationVoiceMode: 'ai-fallback' });
  assert.equal(candidates.length, 2);
  assert.match(candidates[0], /AlQuran-terjemahan-indonesia.*001001\.mp3$/);
  assert.match(candidates[1], /audio_m4a\/001\/001001\.m4a/);
});

test('starts human and TTS warmups concurrently', async () => {
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
    assert.equal(requests.length, 2);
    assert.ok(requests.some((url) => url.includes('AlQuran-terjemahan-indonesia')));
    assert.ok(requests.some((url) => url.includes('quran-terjemahan-indonesia-audio-by-ayah')));
    for (const resolve of pendingResponses) resolve(new Response(new Blob(['audio']), { status: 200 }));
    await warmup;
  } finally {
    globalThis.fetch = originalFetch;
    if (originalWindow) Object.defineProperty(globalThis, 'window', { configurable: true, value: originalWindow });
    else delete (globalThis as unknown as { window?: Window }).window;
  }
});
