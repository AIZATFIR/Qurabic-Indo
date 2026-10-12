import { getAyahAudioUrl, getFormattedAyahKey, getAudioCandidateUrls } from './audio';
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

console.log('🎉 ALL QURAN AUDIO & TADARUS HANDSFREE UNIT TESTS PASSED!');
