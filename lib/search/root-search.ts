import { RootWord } from '../types/morphology';
import { ROOT_DATABASE } from '../data/roots';

// Removes Arabic diacritics / harakat for accurate searching
export function stripArabicHarakat(text: string): string {
  return text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');
}

// Maps Indonesian phonetic spellings to canonical root search tags
export function normalizePhoneticQuery(query: string): string {
  if (!query) return '';
  let q = query.trim().toLowerCase();

  // Phonetic map for common Indonesian Islamic spellings
  const phoneticMap: Record<string, string> = {
    // Salat / Sholat variations
    sholat: 'salat',
    solat: 'salat',
    shalat: 'salat',
    sholaat: 'salat',
    shalah: 'salat',
    selawat: 'salat',
    salawat: 'salat',
    's-l-w': 'salat',
    'ص-ل-و': 'salat',

    // Zakat variations
    jakat: 'zakat',
    zakah: 'zakat',
    'z-k-w': 'zakat',

    // Takwa variations
    takwa: 'taqwa',
    taqwaa: 'taqwa',
    'w-q-y': 'taqwa',

    // Syirik variations
    sirk: 'syirik',
    shirk: 'syirik',
    's-r-k': 'syirik',

    // Dzikir variations
    dzikir: 'zikir',
    dhikr: 'zikir',
    'z-k-r': 'zikir',

    // Tobat / Taubat variations
    tobat: 'taubat',
    taubah: 'taubat',
    't-w-b': 'taubat',

    // Quran variations
    koran: 'quran',
    'qur\'an': 'quran',
    'q-r-a': 'quran',

    // Saleh / Sholeh variations
    sholeh: 'saleh',
    shaleh: 'saleh',
    salih: 'saleh',
    's-l-h': 'saleh'
  };

  // Replace recognized phonetic words
  Object.keys(phoneticMap).forEach((key) => {
    if (q === key || q.includes(key)) {
      q = q.replace(key, phoneticMap[key]);
    }
  });

  // Normalize hyphenated root representations e.g. "s-b-r" or "ص-ب-ر"
  q = q.replace(/[-_.\s]+/g, '');
  q = stripArabicHarakat(q);

  return q;
}

export function searchRoots(query: string): RootWord[] {
  const rawCleaned = query.trim().toLowerCase();
  const normalized = normalizePhoneticQuery(query);
  
  if (!rawCleaned) return ROOT_DATABASE;

  return ROOT_DATABASE.filter((root) => {
    // 1. Direct ID / Slug match (e.g. "s-b-r", "s-l-w")
    const idClean = root.id.replace(/-/g, '');
    if (idClean.includes(normalized) || idClean.includes(rawCleaned)) return true;

    // 2. Arabic root match (e.g. "صلوة", "ص ل و")
    const arabicJoinedClean = stripArabicHarakat(root.rootArabicJoined);
    const arabicSpacedClean = stripArabicHarakat(root.rootArabic.replace(/\s+/g, ''));
    if (arabicJoinedClean.includes(normalized) || arabicSpacedClean.includes(normalized) || arabicJoinedClean.includes(rawCleaned)) return true;

    // 3. Latin root match (e.g. "salat", "sabar", "kataba")
    if (root.rootLatin.toLowerCase().includes(normalized) || root.rootLatin.toLowerCase().includes(rawCleaned)) return true;

    // 4. Indonesian & English title match
    if (root.titleIndo.toLowerCase().includes(normalized) || root.titleIndo.toLowerCase().includes(rawCleaned)) return true;
    if (root.titleEnglish.toLowerCase().includes(normalized) || root.titleEnglish.toLowerCase().includes(rawCleaned)) return true;

    // 5. Tag & Etymology match (e.g. "sholat", "solat", "batu", "tulis")
    const tagMatch = root.tags.some(tag => {
      const cleanTag = tag.toLowerCase().replace(/[-_.\s]+/g, '');
      return cleanTag.includes(normalized) || cleanTag.includes(rawCleaned) || tag.toLowerCase().includes(rawCleaned);
    });
    if (tagMatch) return true;

    // 6. Meanings match
    const meaningMatch = root.meaningsIndonesian.some(m => m.toLowerCase().includes(normalized) || m.toLowerCase().includes(rawCleaned));
    if (meaningMatch) return true;

    if (root.etymologyNote.toLowerCase().includes(normalized) || root.etymologyNote.toLowerCase().includes(rawCleaned)) return true;

    // 7. Derivatives match (Verbs & Nouns)
    const verbMatch = root.verbs.some(v => 
      v.transliteration.toLowerCase().includes(normalized) || 
      v.meaningIndo.toLowerCase().includes(normalized) ||
      v.meaningIndo.toLowerCase().includes(rawCleaned) ||
      stripArabicHarakat(v.arabic).includes(normalized)
    );
    if (verbMatch) return true;

    const nounMatch = root.nouns.some(n => 
      n.transliteration.toLowerCase().includes(normalized) || 
      n.meaningIndo.toLowerCase().includes(normalized) ||
      n.meaningIndo.toLowerCase().includes(rawCleaned) ||
      stripArabicHarakat(n.arabic).includes(normalized)
    );
    if (nounMatch) return true;

    return false;
  });
}

export function getRootBySlug(slug: string): RootWord | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  const normalizedSlug = normalizePhoneticQuery(slug);

  return ROOT_DATABASE.find(r => 
    r.id.toLowerCase() === cleanSlug || 
    r.rootLatin.toLowerCase() === cleanSlug ||
    r.rootLatin.toLowerCase() === normalizedSlug ||
    r.rootArabicJoined === cleanSlug ||
    r.id.replace(/-/g, '') === cleanSlug.replace(/-/g, '')
  );
}
