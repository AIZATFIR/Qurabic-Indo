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
 * Uses high-availability EveryAyah 128kbps CDN with CORS support
 */
export function getAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
}

/**
 * Optional fallback URL resolver in case of network issues
 */
export function getFallbackAyahAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return `https://verses.quran.com/Alafasy/mp3/${s}${a}.mp3`;
}
