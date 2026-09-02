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
    const idClean = root.id.toLowerCase().replace(/-/g, '');
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

import { isAuthoritativePilotRoot, getAuthoritativePilotRootWord, getRootOccurrencesFromChunk } from '../morphology/morphology-service';

export function getRootBySlug(slug: string): RootWord | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  const normalizedSlug = normalizePhoneticQuery(slug);

  // 1. Authoritative QAC Pilot Resolver
  if (isAuthoritativePilotRoot(cleanSlug) || isAuthoritativePilotRoot(normalizedSlug)) {
    const authPilot = getAuthoritativePilotRootWord(cleanSlug) || getAuthoritativePilotRootWord(normalizedSlug);
    if (authPilot) return authPilot;
  }

  // 2. Lookup in ROOT_DATABASE
  const root = ROOT_DATABASE.find(r => 
    r.id.toLowerCase() === cleanSlug || 
    r.rootLatin.toLowerCase() === cleanSlug ||
    r.rootLatin.toLowerCase() === normalizedSlug ||
    r.rootArabicJoined === cleanSlug ||
    r.id.replace(/-/g, '') === cleanSlug.replace(/-/g, '')
  );

  if (!root) return undefined;

  // Ensure full occurrences list is loaded for detail page
  if (!root.occurrences || root.occurrences.length === 0) {
    const occs = getRootOccurrencesFromChunk(root.id) || getRootOccurrencesFromChunk(cleanSlug);
    return {
      ...root,
      occurrences: occs
    };
  }

  return root;
}

/**
 * Extracts and formats Arabic root letters spaced apart (e.g. "ز ج ر" or "ص ب ر")
 */
export function extractArabicRootLetters(arabic: string): string {
  if (!arabic) return '';
  let clean = stripArabicHarakat(arabic).trim();
  clean = clean.replace(/^[\u0621\u0622\u0623\u0625\u0671]/, 'ا');
  // Remove common prefixes
  clean = clean.replace(/^(وال|فال|بال|كال|لل|ال)/, '');
  clean = clean.replace(/^[وفبلكس]/, '');
  // Remove common suffixes
  clean = clean.replace(/(هما|كما|هم|كم|هن|كن|تم|تن|نا|ها|ني|يه|يا|ي|ه)$/, '');
  clean = clean.replace(/(ون|ين|ان|ات|ة|وا|تم|تمو)$/, '');
  
  if (clean.length > 3 && clean.startsWith('است')) clean = clean.substring(3);
  if (clean.length > 3 && (clean.startsWith('م') || clean.startsWith('ت') || clean.startsWith('ي') || clean.startsWith('ن') || clean.startsWith('ا'))) {
    clean = clean.substring(1);
  }
  if (clean.length > 3 && clean.endsWith('ة')) clean = clean.slice(0, -1);
  if (clean.length > 3 && clean.includes('ا')) clean = clean.replace('ا', '');

  const letters = clean.split('').filter(c => /[\u0600-\u06FF]/.test(c)).slice(0, 4);
  return letters.join(' ');
}

/**
 * Finds the best matching RootWord from local database for any Quran word
 */
export function findBestMatchingRoot(wordArabic: string, meaningIndo?: string): RootWord | undefined {
  if (!wordArabic) return undefined;
  const clean = stripArabicHarakat(wordArabic).trim();

  // 1. Direct match on joined root or spaced root
  for (const root of ROOT_DATABASE) {
    const rootClean = stripArabicHarakat(root.rootArabicJoined);
    if (clean === rootClean || clean.includes(rootClean)) {
      return root;
    }
  }

  // 2. Match through derivative words in database
  for (const root of ROOT_DATABASE) {
    const matchedVerb = root.verbs.some(v => {
      const vClean = stripArabicHarakat(v.arabic);
      return clean.includes(vClean) || vClean.includes(clean);
    });
    if (matchedVerb) return root;

    const matchedNoun = root.nouns.some(n => {
      const nClean = stripArabicHarakat(n.arabic);
      return clean.includes(nClean) || nClean.includes(clean);
    });
    if (matchedNoun) return root;
  }

  // 3. Fallback search via searchRoots
  const searchResults = searchRoots(clean);
  if (searchResults.length > 0) {
    return searchResults[0];
  }

  // 4. Match via meaning if provided
  if (meaningIndo) {
    const meaningResults = searchRoots(meaningIndo);
    if (meaningResults.length > 0) {
      return meaningResults[0];
    }
  }

  return undefined;
}

/**
 * Infers grammatical Part of Speech (POS) and brief morphological role
 */
export function inferGrammarRole(wordArabic: string, meaningIndo?: string): {
  posCategory: 'Isim' | "Fi'il" | 'Harf';
  posDetail: string;
  wazanOrPattern?: string;
} {
  const clean = stripArabicHarakat(wordArabic).trim();
  const harfList = ['في', 'من', 'إلى', 'على', 'عن', 'حتى', 'مع', 'إن', 'أن', 'لكن', 'ليت', 'لعل', 'لا', 'ما', 'لم', 'لن', 'بل', 'ثم', 'أو', 'أم', 'و', 'ف', 'ب', 'ك', 'ل'];

  if (harfList.includes(clean) || (clean.length <= 2 && !clean.includes('رب') && !clean.includes('أب') && !clean.includes('يد'))) {
    return {
      posCategory: 'Harf',
      posDetail: 'Harf (Partikel / Kata Sambung)',
      wazanOrPattern: 'Mabni (Tetap)'
    };
  }

  // Verb checks (starts with ya, ta, na, a or has verb suffixes or past patterns)
  if (
    clean.startsWith('ي') || clean.startsWith('ت') || clean.startsWith('ن') ||
    clean.startsWith('است') || clean.endsWith('وا') || clean.endsWith('تم') ||
    (meaningIndo && /^(ber|meng|ter|hendak|agar|jangan|kami|aku|mereka)/i.test(meaningIndo))
  ) {
    if (clean.startsWith('ي') || clean.startsWith('ت') || clean.startsWith('ن')) {
      return {
        posCategory: "Fi'il",
        posDetail: "Fi'il Mudhari' (Sedang / Akan Datang)",
        wazanOrPattern: 'Bentuk Mudhari\''
      };
    }
    if (clean.startsWith('اهْدِ') || clean.startsWith('اقْرَأْ') || clean.startsWith('قُلْ')) {
      return {
        posCategory: "Fi'il",
        posDetail: "Fi'il Amr (Perintah)",
        wazanOrPattern: 'Thalab / Perintah'
      };
    }
    return {
      posCategory: "Fi'il",
      posDetail: "Fi'il (Kata Kerja)",
      wazanOrPattern: 'Tashrif Sharaf'
    };
  }

  // Default to Noun / Isim
  if (clean.startsWith('ال') || clean.endsWith('ون') || clean.endsWith('ين') || clean.endsWith('ات') || clean.endsWith('ة')) {
    if (clean.startsWith('الْمُ') || clean.startsWith('مُ')) {
      return {
        posCategory: 'Isim',
        posDetail: "Isim Fa'il / Isim Maf'ul (Pelaku atau Objek)",
        wazanOrPattern: 'Wazan Mufa\'il / Maf\'ul'
      };
    }
    return {
      posCategory: 'Isim',
      posDetail: 'Isim (Kata Benda / Sifat)',
      wazanOrPattern: 'Ma\'rifah / Nakirah'
    };
  }

  return {
    posCategory: 'Isim',
    posDetail: 'Isim (Kata Benda / Istilah)',
    wazanOrPattern: 'Morfologi Arab'
  };
}

