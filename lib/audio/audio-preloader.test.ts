import test from 'node:test';
import assert from 'node:assert/strict';
import { getNextAudioPreloadUrl } from './audio-preloader';

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
