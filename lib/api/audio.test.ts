import {
  getAyahAudioUrl,
  getFormattedAyahKey,
  getAudioCandidateUrls,
  getHumanTranslationAudioUrl,
  getTranslationTtsAudioUrl,
  getTranslationAudioCandidateUrls,
} from './audio';
import { cleanTranslationForSpeech, isSpeechSynthesisSupported } from '../audio/speech-translation';

// Test suite for Quran Audio URL, Multi-CDN, and Tadarus Handsfree Abstraction
console.log('Running Quran Audio & Tadarus Handsfree Unit Tests...');

// Test 1: URL format for Al-Fatihah Ayah 1 (1:1 -> 001001.mp3)
const url1 = getAyahAudioUrl(1, 1);
if (!url1.includes('001001.mp3')) {
  throw new Error(`Expected 001001.mp3 in URL but got ${url1}`);
}
console.log('✅ Test 1 Passed: Al-Fatihah 1:1 generates correct padded URL (001001.mp3)');

// Test 2: URL format for Al-Baqarah Ayah 255 (2:255 -> 002255.mp3)
const url2 = getAyahAudioUrl(2, 255);
if (!url2.includes('002255.mp3')) {
  throw new Error(`Expected 002255.mp3 in URL but got ${url2}`);
}
console.log('✅ Test 2 Passed: Al-Baqarah 2:255 generates correct padded URL (002255.mp3)');

// Test 3: Formatting ayah key helper
const key = getFormattedAyahKey(114, 6);
if (key !== '114:6') {
  throw new Error(`Expected '114:6' but got ${key}`);
}
console.log('✅ Test 3 Passed: Ayah key formatting works accurately');

// Test 4: Candidate URLs for resilience with EveryAyah and EQuran CDN
const candidates = getAudioCandidateUrls(18, 1);
if (!Array.isArray(candidates) || candidates.length < 3) {
  throw new Error('Expected multiple candidate audio URLs for fallback');
}
if (!candidates[0].includes('verses.quran.com') || !candidates[0].includes('018001.mp3')) {
  throw new Error(`Expected primary candidate to be verses.quran.com 018001.mp3, got ${candidates[0]}`);
}
const hasEveryAyah = candidates.some((url) => url.includes('everyayah.com'));
if (!hasEveryAyah) {
  throw new Error('Candidate URLs must include EveryAyah CDN');
}
const hasEQuran = candidates.some((url) => url.includes('equran'));
if (!hasEQuran) {
  throw new Error('Candidate URLs must include EQuran CDN');
}
console.log('✅ Test 4 Passed: Multi-CDN candidate URLs generated including EveryAyah & EQuran CDN');

// Test 5: Speech Translation Text Cleaning
const dirtyText = '<p>(Yaitu) orang-orang yang beriman [1] kepada yang gaib (2) dan mendirikan salat.</p>';
const cleanedText = cleanTranslationForSpeech(dirtyText);
if (cleanedText.includes('<p>') || cleanedText.includes('</p>') || cleanedText.includes('[1]') || cleanedText.includes('(2)')) {
  throw new Error(`cleanTranslationForSpeech failed to remove artifacts: ${cleanedText}`);
}
if (!cleanedText.includes('orang-orang yang beriman') || !cleanedText.includes('mendirikan salat.')) {
  throw new Error(`cleanTranslationForSpeech stripped valid words: ${cleanedText}`);
}
console.log('✅ Test 5 Passed: Speech translation text cleaning correctly strips HTML tags and footnote references');

// Test 6: Speech Synthesis Environment Detection
const isSupported = isSpeechSynthesisSupported();
if (typeof isSupported !== 'boolean') {
  throw new Error('isSpeechSynthesisSupported must return boolean');
}
console.log(`✅ Test 6 Passed: isSpeechSynthesisSupported safely handles SSR environment (returned ${isSupported})`);

// Test 7: Empty / Null translation text handling
const emptyCleaned = cleanTranslationForSpeech('');
if (emptyCleaned !== '') {
  throw new Error(`Expected empty string for empty input, got '${emptyCleaned}'`);
}
console.log('✅ Test 7 Passed: Speech translation cleaning safely handles empty string');

// Test 8: Human Translation Audio URL Generator
const humanAudioUrl = getHumanTranslationAudioUrl(1, 1);
if (!humanAudioUrl.includes('001001.mp3') || !humanAudioUrl.includes('archive.org')) {
  throw new Error(`Expected archive.org 001001.mp3 URL, got ${humanAudioUrl}`);
}
console.log('✅ Test 8 Passed: Human translation audio generator creates padded 6-digit MP3 URL (001001.mp3)');

// Test 9: Translation TTS Stream API URL Generator
const ttsUrl = getTranslationTtsAudioUrl('Segala puji bagi Allah', 1, 2);
if (!ttsUrl.startsWith('/api/audio-translation') || !ttsUrl.includes('surah=1') || !ttsUrl.includes('ayah=2')) {
  throw new Error(`Expected /api/audio-translation endpoint with params, got ${ttsUrl}`);
}
console.log('✅ Test 9 Passed: Translation TTS audio generator creates clean API route URL');

// Test 10: Prioritized Translation Audio Candidate Chain
const translationCandidates = getTranslationAudioCandidateUrls(2, 255, 'Allah, tidak ada tuhan selain Dia');
if (!Array.isArray(translationCandidates) || translationCandidates.length < 2) {
  throw new Error('Expected at least 2 translation audio candidate sources');
}
if (!translationCandidates[0].includes('002255.mp3') || !translationCandidates[1].includes('/api/audio-translation')) {
  throw new Error(`Expected human audio as primary and TTS as secondary, got ${JSON.stringify(translationCandidates)}`);
}
console.log('✅ Test 10 Passed: Translation audio candidate chain prioritizes human recording with TTS fallback');

// Test 11: Audio Preloader cache lookup handles uncached items safely
import {
  getCachedAudioUrl,
  getCachedTranslationUrl,
  preloadUpcomingAyahs,
} from '../audio/audio-preloader';

const uncached = getCachedAudioUrl('https://verses.quran.com/Alafasy/mp3/001001.mp3');
if (uncached !== undefined) {
  throw new Error(`Expected undefined for initial uncached lookup, got ${uncached}`);
}
console.log('✅ Test 11 Passed: getCachedAudioUrl safely returns undefined for cold cache');

// Test 12: Translation cache lookup handles uncached candidates
const uncachedTrans = getCachedTranslationUrl(1, 1, 'Dengan nama Allah');
if (uncachedTrans !== undefined) {
  throw new Error(`Expected undefined for cold translation cache, got ${uncachedTrans}`);
}
console.log('✅ Test 12 Passed: getCachedTranslationUrl safely checks candidate list');

// Test 13: Preload upcoming ayahs runs cleanly without errors in SSR/Node
try {
  preloadUpcomingAyahs(1, 1, 7, () => 'Dengan nama Allah');
  console.log('✅ Test 13 Passed: preloadUpcomingAyahs runs safely in SSR/Node without exception');
} catch (err: any) {
  throw new Error(`preloadUpcomingAyahs failed in SSR: ${err?.message}`);
}

// Test 14: Multi-Qari support includes Yasser Al-Dossary
import { AVAILABLE_QARIS, TRANSLATION_VOICE_OPTIONS } from './audio';

const yasserCandidate = getAudioCandidateUrls(1, 1, 'yasser_dossary');
if (!yasserCandidate.some((url) => url.includes('Yasser_Ad-Dussary_128kbps/001001.mp3'))) {
  throw new Error(`Expected Yasser Dossary EveryAyah URL in candidates, got ${JSON.stringify(yasserCandidate)}`);
}
const hasYasser = AVAILABLE_QARIS.some((q) => q.id === 'yasser_dossary');
if (!hasYasser) {
  throw new Error('AVAILABLE_QARIS must contain yasser_dossary');
}
console.log('✅ Test 14 Passed: Yasser Al-Dossary audio URLs and metadata registered correctly');

// Test 15: Translation voice mode 'tts' prioritizes TTS API endpoint
const ttsModeCandidates = getTranslationAudioCandidateUrls(1, 1, 'Dengan nama Allah', 'tts');
if (!ttsModeCandidates[0].startsWith('/api/audio-translation')) {
  throw new Error(`Expected /api/audio-translation as primary candidate in 'tts' mode, got ${ttsModeCandidates[0]}`);
}
console.log('✅ Test 15 Passed: Translation mode "tts" prioritizes TTS streaming endpoint');

// Test 16: Translation voice mode 'off' disables translation audio candidates
const offModeCandidates = getTranslationAudioCandidateUrls(1, 1, 'Dengan nama Allah', 'off');
if (offModeCandidates.length !== 0) {
  throw new Error(`Expected 0 candidates in 'off' mode, got ${offModeCandidates.length}`);
}
const hasTranslationOptions = TRANSLATION_VOICE_OPTIONS.length >= 3;
if (!hasTranslationOptions) {
  throw new Error('TRANSLATION_VOICE_OPTIONS must include human, tts, and off');
}
console.log('✅ Test 16 Passed: Translation mode "off" cleanly returns empty candidate array');

console.log('🎉 ALL QURAN AUDIO & TADARUS HANDSFREE UNIT TESTS PASSED!');
