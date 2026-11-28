/** Normalize Arabic text for comparison without changing its displayed form. */
export function stripArabicHarakat(text: string): string {
  if (!text) return '';
  let norm = text.replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\uFD3E\uFD3F]/g, '');
  norm = norm.replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675]/g, '\u0627');
  norm = norm.replace(/\u0649/g, '\u064A');
  return norm.trim();
}
