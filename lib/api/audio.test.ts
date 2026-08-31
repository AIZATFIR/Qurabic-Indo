import { describe, it, expect } from 'vitest';
import { getAyahAudioUrl, getFormattedAyahKey } from './audio';

// Test suite for Quran Audio URL and API abstraction
console.log('Running Quran Audio Abstraction Unit Tests...');

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

console.log('🎉 ALL QURAN AUDIO ABSTRACTION UNIT TESTS PASSED!');
