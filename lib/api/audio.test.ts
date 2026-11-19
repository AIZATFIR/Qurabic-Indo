import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AVAILABLE_QARIS, DEFAULT_TRANSLATION_VOICE_MODE, TRANSLATION_VOICE_OPTIONS, AUDIO_STARTUP_TIMEOUT_MS, getAudioCandidateUrls, getAyahAudioUrl, getTranslationAudioCandidateUrls, getNextAudioTrack, getFirstAudioTrack, isHumanTranslationAvailable, isTranslationAudioAvailable } from './audio';

test('recitation URLs identify the requested verse and real reciter', () => {
  assert.match(getAyahAudioUrl(18, 10), /018010\.mp3$/);
  assert.ok(getAudioCandidateUrls(18, 10).some(url => url.includes('everyayah.com')));
  assert.ok(AVAILABLE_QARIS.some(qari => qari.id === 'yasser_dossary'));
});

test('human recordings stay first, with an explicitly selected AI fallback and legacy safety', () => {
  assert.equal(DEFAULT_TRANSLATION_VOICE_MODE, 'ai-fallback');
  assert.equal(getTranslationAudioCandidateUrls(3, 1, undefined, DEFAULT_TRANSLATION_VOICE_MODE, 'id').length, 1);
  assert.equal(getTranslationAudioCandidateUrls(1, 1, undefined, DEFAULT_TRANSLATION_VOICE_MODE, 'id')[0].startsWith('https://archive.org/'), true);
  assert.match(getTranslationAudioCandidateUrls(3, 1, undefined, DEFAULT_TRANSLATION_VOICE_MODE, 'id')[0], /audio_m4a\/003\/003001\.m4a/);
  assert.deepEqual(TRANSLATION_VOICE_OPTIONS.map(option => option.id), ['human', 'ai-fallback', 'off']);
  assert.deepEqual(getTranslationAudioCandidateUrls(18, 1, undefined, 'human'), []);
  const aiOnly = getTranslationAudioCandidateUrls(18, 1, undefined, 'ai-fallback', 'id');
  assert.equal(aiOnly.length, 1);
  assert.match(aiOnly[0], /huggingface\.co\/datasets\/insanalamin\/quran-terjemahan-indonesia-audio-by-ayah\/resolve\/main\/audio_m4a\/018\/018001\.m4a/);
  const humanThenAi = getTranslationAudioCandidateUrls(1, 1, undefined, 'ai-fallback', 'id');
  assert.ok(humanThenAi[0].startsWith('https://archive.org/'));
  assert.match(humanThenAi[1], /audio_m4a\/001\/001001\.m4a/);
  assert.equal(isHumanTranslationAvailable(41, 'id', 1), false, 'known missing archive file should not delay handsfree playback');
  assert.equal(getTranslationAudioCandidateUrls(41, 1, undefined, 'ai-fallback', 'id').length, 1);
  assert.equal(isTranslationAudioAvailable(18, 'id', 'ai-fallback'), true);
  assert.deepEqual(getTranslationAudioCandidateUrls(1, 1, undefined, 'off'), []);
  assert.equal(isTranslationAudioAvailable(1, 'id', 'off'), false);
  assert.deepEqual(getTranslationAudioCandidateUrls(18, 1, undefined, 'ai-fallback', 'en').length, 1);
  const legacyCandidates = getTranslationAudioCandidateUrls(1, 1, 'Dengan nama Allah', 'tts' as any);
  assert.ok(legacyCandidates.every(url => url.startsWith('https://archive.org/')));
  assert.ok(getTranslationAudioCandidateUrls(1, 1).every(url => !url.includes('/api/')));
});

test('handsfree translation follows the selected interface language', () => {
  assert.equal(isHumanTranslationAvailable(18, 'en'), true);
  assert.equal(isHumanTranslationAvailable(18, 'id'), false);
  assert.match(getTranslationAudioCandidateUrls(18, 1, undefined, 'human', 'en')[0], /English\/Sahih_Intnl_Ibrahim_Walk_192kbps\/018001\.mp3$/);
  assert.match(getTranslationAudioCandidateUrls(1, 1, undefined, 'human', 'id')[0], /archive\.org\/download\/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab\/001001\.mp3$/);
  assert.deepEqual(getFirstAudioTrack(18, 5, 'reverse', 'en'), { ayahNumber: 5, phase: 'translation' });
  assert.deepEqual(getNextAudioTrack({ ...base, surahNumber: 18, ayahNumber: 5, totalAyahs: 110, phase: 'arabic', handsfreeMode: 'normal', translationLanguage: 'en' }), { ayahNumber: 5, phase: 'translation' });
});

test('reverse handsfree starts Arabic on Al-Kahf when Indonesian recording is missing', () => {
  assert.deepEqual(getFirstAudioTrack(18, 5, 'reverse'), { ayahNumber: 5, phase: 'arabic' });
  assert.deepEqual(getFirstAudioTrack(18, 5, 'reverse', 'id', 'off'), { ayahNumber: 5, phase: 'arabic' });
  assert.deepEqual(getFirstAudioTrack(18, 5, 'reverse', 'id', 'ai-fallback'), { ayahNumber: 5, phase: 'translation' });
  assert.deepEqual(getFirstAudioTrack(69, 38, 'reverse'), { ayahNumber: 38, phase: 'arabic' });
  assert.deepEqual(getTranslationAudioCandidateUrls(69, 38), []);
  assert.equal(AUDIO_STARTUP_TIMEOUT_MS.translation, 4000, 'Failed translation audio advances after four seconds');
  assert.equal(AUDIO_STARTUP_TIMEOUT_MS.translationFallback, 2500, 'A stalled human Indonesian recording falls back to TTS within 2.5 seconds');
  assert.deepEqual(getNextAudioTrack({ surahNumber: 18, ayahNumber: 5, phase: 'arabic', totalAyahs: 110, handsfreeMode: 'reverse', repeatMode: 'off', autoNext: true }), { ayahNumber: 6, phase: 'arabic' });
});

const base = { surahNumber: 1, ayahNumber: 2, totalAyahs: 7, handsfreeMode: 'normal' as const, repeatMode: 'off' as const, autoNext: true };
test('normal handsfree plays translation then advances; reverse plays same-verse Arabic', () => {
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'arabic' }), { ayahNumber: 2, phase: 'translation' });
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'translation' }), { ayahNumber: 3, phase: 'arabic' });
  assert.deepEqual(getNextAudioTrack({ ...base, phase: 'translation', handsfreeMode: 'reverse' }), { ayahNumber: 2, phase: 'arabic' });
  assert.deepEqual(getNextAudioTrack({ ...base, surahNumber: 18, ayahNumber: 5, totalAyahs: 110, phase: 'arabic', translationVoiceMode: 'ai-fallback' }), { ayahNumber: 5, phase: 'translation' });
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
