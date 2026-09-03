/**
 * Buckwalter Transliteration & Arabic Unicode Bidirectional Normalizer
 */

export const BUCKWALTER_TO_ARABIC_MAP: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', 'A': 'ا',
  'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح',
  'x': 'خ', 'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س',
  '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع',
  'g': 'غ', '_': 'ـ', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل',
  'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'Y': 'ى', 'y': 'ي',
  'F': 'ً', 'N': 'ٌ', 'K': 'ٍ', 'a': 'َ', 'u': 'ُ', 'i': 'ِ',
  '~': 'ّ', 'o': 'ْ', '^': 'ْ', '`': 'ٰ', '{': 'ٱ'
};

export const ARABIC_TO_BUCKWALTER_MAP: Record<string, string> = Object.entries(
  BUCKWALTER_TO_ARABIC_MAP
).reduce((acc, [bw, ar]) => {
  acc[ar] = bw;
  return acc;
}, {} as Record<string, string>);

/**
 * Converts Buckwalter transliteration string to Arabic Unicode string
 */
export function buckwalterToArabic(bw: string): string {
  if (!bw) return '';
  // Strip QAC bracket markers and special annotation flags if any
  const cleanBw = bw.replace(/[\[\]@#:;]/g, '');
  return cleanBw
    .split('')
    .map((c) => BUCKWALTER_TO_ARABIC_MAP[c] || (/[a-zA-Z0-9]/.test(c) ? c : ''))
    .join('');
}

/**
 * Normalizes Arabic text for tolerant lexical matching
 */
export function normalizeArabicForComparison(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // strip diacritics
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا') // normalize alifs
    .replace(/[\u0649]/g, 'ي')
    .replace(/[\u0629]/g, 'ه')
    .replace(/[^\u0600-\u06FF]/g, '') // keep only arabic chars
    .trim();
}
