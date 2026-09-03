/**
 * Qurabic Lexicon Acquisition Pipeline - Normalization Layer
 * Codename: Lexicon Harvest
 */

import { buckwalterToArabic } from '../../lib/morphology/buckwalter';

export function normalizeArabicKey(text: string): string {
  if (!text) return '';
  let t = text.replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  t = t.replace(/[أإآٱٲٳ]/g, 'ا');
  t = t.replace(/[ىئ]/g, 'ي');
  t = t.replace(/ة/g, 'ه');
  return t.trim();
}

export function getVolumeForPage(page: number): number {
  if (page <= 368) return 1;
  if (page <= 838) return 2;
  if (page <= 1260) return 3;
  if (page <= 1758) return 4;
  if (page <= 2220) return 5;
  if (page <= 2476) return 6;
  if (page <= 2748) return 7;
  return 8;
}

export function getRootKeyVariants(rootBw: string): string[] {
  const clean = rootBw.trim().replace(/-/g, '');
  const variants: string[] = [clean];

  // 1. Weak letter Alif Maqsura (QAC 'y' -> Lane 'Y')
  if (clean.endsWith('y')) {
    variants.push(clean.slice(0, -1) + 'Y');
    variants.push(clean.slice(0, -1) + 'w');
  }

  // 2. Geminate ungeminated (QAC 'Dmm' -> Lane 'Dm', 'gll' -> 'gl')
  if (clean.length === 3 && clean[1] === clean[2]) {
    variants.push(clean.slice(0, 2));
  }

  // 3. Hamza variants (QAC 'A' -> Lane 'A^')
  if (clean.includes('A')) {
    variants.push(clean.replace(/A/g, 'A^'));
  }

  return variants;
}

export function normalizeVerbFormToNumber(verbForm?: string): string | null {
  if (!verbForm) return null;
  const upper = verbForm.toUpperCase().trim();
  if (upper.includes('VIII')) return '8';
  if (upper.includes('VII')) return '7';
  if (upper.includes('VI')) return '6';
  if (upper.includes('IV')) return '4';
  if (upper.includes('IX')) return '9';
  if (upper.includes('X')) return '10';
  if (upper.includes('V')) return '5';
  if (upper.includes('III')) return '3';
  if (upper.includes('II')) return '2';
  if (upper.includes('I')) return '1';

  const digits = verbForm.replace(/[^0-9]/g, '');
  return digits || null;
}
