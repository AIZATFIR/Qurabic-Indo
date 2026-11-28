import { stripArabicHarakat } from './arabic-normalization';

/** Normalize common transliterations into the labels used by the root index. */
export function normalizePhoneticQuery(query: string): string {
  if (!query) return '';
  let normalized = query.trim().toLowerCase();
  const phoneticMap: Record<string, string> = {
    sholat: 'salat', solat: 'salat', shalat: 'salat', sholaat: 'salat', shalah: 'salat',
    selawat: 'salat', salawat: 'salat', 's-l-w': 'salat', 'ص-ل-و': 'salat',
    jakat: 'zakat', zakah: 'zakat', 'z-k-w': 'zakat', takwa: 'taqwa', taqwaa: 'taqwa',
    'w-q-y': 'taqwa', sirk: 'syirik', shirk: 'syirik', 's-r-k': 'syirik',
    dzikir: 'zikir', dhikr: 'zikir', 'z-k-r': 'zikir', tobat: 'taubat', taubah: 'taubat',
    't-w-b': 'taubat', koran: 'quran', 'qur\'an': 'quran', 'q-r-a': 'quran',
    sholeh: 'saleh', shaleh: 'saleh', salih: 'saleh', 's-l-h': 'saleh',
  };

  for (const [spelling, canonical] of Object.entries(phoneticMap)) {
    if (normalized === spelling || normalized.includes(spelling)) {
      normalized = normalized.replace(spelling, canonical);
    }
  }

  return stripArabicHarakat(normalized.replace(/[-_.\s]+/g, ''));
}
