import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AVAILABLE_QARIS, TRANSLATION_VOICE_OPTIONS, getAudioCandidateUrls, getAyahAudioUrl, getTranslationAudioCandidateUrls, getNextAudioTrack, getFirstAudioTrack } from './audio';

test('recitation URLs identify the requested verse and real reciter', () => {
  assert.match(getAyahAudioUrl(18, 10), /018010\.mp3$/);
  assert.ok(getAudioCandidateUrls(18, 10).some(url => url.includes('everyayah.com')));
  assert.ok(AVAILABLE_QARIS.some(qari => qari.id === 'yasser_dossary'));
});

test('translation audio is human only, including legacy saved TTS preferences', () => {
  assert.deepEqual(TRANSLATION_VOICE_OPTIONS.map(option => option.id), ['human', 'off']);
  assert.deepEqual(getTranslationAudioCandidateUrls(18, 1, undefined, 'human'), []);
  assert.deepEqual(getTranslationAudioCandidateUrls(1, 1, undefined, 'off'), []);
  const legacyCandidates = getTranslationAudioCandidateUrls(1, 1, 'Dengan nama Allah', 'tts' as any);
  assert.ok(legacyCandidates.every(url => url.startsWith('https://archive.org/')));
  assert.ok(getTranslationAudioCandidateUrls(1, 1).every(url => !url.includes('/api/')));
});

test('reverse handsfree starts Arabic on Al-Kahf when Indonesian recording is missing', () => {
  assert.deepEqual(getFirstAudioTrack(18, 5, 'reverse'), { ayahNumber: 5, phase: 'arabic' });
  assert.deepEqual(getNextAudioTrack({ surahNumber: 18, ayahNumber: 5, phase: 'arabic', totalAyahs: 110, handsfreeMode: 'reverse', repeatMode: 'off', autoNext: true }), { ayahNumber: 6, phase: 'arabic' });
});

const base = { surahNumber: 1, ayahNumber: 2, totalAyahs: 7, handsfreeMode: 'normal' as const, repeatMode: 'off' as const, autoNext: true };
test('normal handsfree plays translation then advances; reverse plays same-verse Arabic', () => {
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'arabic' }), { ayahNumber: 2, phase: 'translation' });
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'translation' }), { ayahNumber: 3, phase: 'arabic' });
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'translation', handsfreeMode: 'reverse' }), { ayahNumber: 2, phase: 'arabic' });
});
test('auto-next off finishes current verse including translation and then stops', () => {
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'arabic', autoNext: false }), { ayahNumber: 2, phase: 'translation' });
  assert.equal(getNextAudioTrack({ ...base, phase: 'translation', autoNext: false }), null);
  assert.equal(getNextAudioTrack({ ...base, phase: 'arabic', handsfreeMode: 'off', autoNext: false }), null);
});
test('repeat completes both phases and respects surah boundaries', () => {
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'translation', repeatMode: 'ayah' }), { ayahNumber: 2, phase: 'arabic' });
  assert.deepEqual(getNextAudioTrack({ ...base, ayahNumber: 7, phase: 'translation', repeatMode: 'surah' }), { ayahNumber: 1, phase: 'arabic' });
  assert.equal(getNextAudioTrack({ ...base, ayahNumber: 7, phase: 'translation' }), null);
});
