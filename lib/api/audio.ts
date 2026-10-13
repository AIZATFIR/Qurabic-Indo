/**
 * Quran Recitation Audio Source Abstraction
 * Provides per-ayah audio URLs using the authoritative standard CDN (Mishary Rashid Al-Afasy)
 */

export interface AyahAudioMeta {
  surahNumber: number;
  ayahNumber: number;
  audioUrl: string;
  reciter: string;
}

/**
 * Returns formatted 3-digit padded numbers, e.g. (1 -> "001", 255 -> "255")
 */
export function padDigits(num: number, targetLength: number = 3): string {
  return String(num).padStart(targetLength, '0');
}

/**
 * Returns clean Ayah key e.g. "1:1" or "2:255"
 */
export function getFormattedAyahKey(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

/**
 * Resolves authoritative recitation audio URL for a specific Surah & Ayah
 * Uses high-availability Quran.com CDN (BunnyCDN SG/ID) with instant edge caching & CORS support
 */
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`;
}

/**
 * Returns ordered candidate audio CDN URLs for multi-source fallback resilience
 */
export function getAudioCandidateUrls(surahNumber: number, ayahNumber: number): string[] {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return [
    `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`,
    `https://audio.qurancdn.com/Alafasy/mp3/${s}${a}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`,
    `https://equran.nos.wjv-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/${s}${a}.mp3`,
  ];
}

/**
 * Optional fallback URL resolver in case of network issues
 */
export function getFallbackAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return `https://audio.qurancdn.com/Alafasy/mp3/${s}${a}.mp3`;
}

/**
 * Resolves human-recorded Indonesian translation audio URLs from high-availability Archive.org mirror
 */
export function getHumanTranslationAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return `https://archive.org/download/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab/${s}${a}.mp3`;
}

/**
 * Resolves streaming TTS audio endpoint for Indonesian translation
 */
export function getTranslationTtsAudioUrl(text?: string, surahNumber?: number, ayahNumber?: number): string {
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  if (surahNumber) params.set('surah', String(surahNumber));
  if (ayahNumber) params.set('ayah', String(ayahNumber));
  return `/api/audio-translation?${params.toString()}`;
}

/**
 * Returns prioritized candidate list for Indonesian translation audio:
 * 1. Human recording from Archive.org
 * 2. High-availability streaming TTS API route
 */
export function getTranslationAudioCandidateUrls(
  surahNumber: number,
  ayahNumber: number,
  translationText?: string
): string[] {
  const humanUrl = getHumanTranslationAudioUrl(surahNumber, ayahNumber);
  const ttsUrl = getTranslationTtsAudioUrl(translationText, surahNumber, ayahNumber);
  return [humanUrl, ttsUrl];
}
