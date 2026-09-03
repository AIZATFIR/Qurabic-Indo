import { RootWord } from '../types/morphology';
import { ROOT_DATABASE } from '../data/roots';
import { isAuthoritativePilotRoot, getAuthoritativePilotRootWord, getRootOccurrencesFromChunk } from '../morphology/morphology-service';

// Removes all Arabic diacritics, harakat, maddah, tatweel, and normalizes Alif & Ya variants
export function stripArabicHarakat(text: string): string {
  if (!text) return '';
  let norm = text.replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\uFD3E\uFD3F]/g, '');
  // Normalize all Alif variants (Wasla \u0671, Hamza Above \u0623, Hamza Below \u0625, Madda Above \u0622) to bare Alif \u0627
  norm = norm.replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675]/g, '\u0627');
  // Normalize Alif Maksura \u0649 to Ya \u064A
  norm = norm.replace(/\u0649/g, '\u064A');
  return norm.trim();
}

// Normalized set of Quranic particles, conjunctions, and prepositions (Non-root words)
export const QURANIC_PARTICLES = new Set([
  'فلما', 'لما', 'فما', 'وما', 'ما', 'فلا', 'ولا', 'لا', 'ان', 'فان', 'وان', 'الا', 'فالا',
  'ثم', 'حتي', 'الي', 'علي', 'في', 'من', 'عن', 'مع', 'كلا', 'اذا', 'اذ',
  'فاذا', 'واذ', 'كيف', 'اين', 'متي', 'اني', 'اي', 'ايها', 'يا', 'بل', 'لو', 'لولا',
  'لوما', 'لكن', 'لكنما', 'انما', 'كانما', 'حيث', 'حيثما', 'منذ', 'مذ', 'لدن', 'لدي',
  'عسي', 'ليس', 'بلي', 'نعم', 'اجل', 'اي', 'ها', 'هاهنا', 'هاذا', 'هذا', 'هذه', 'هؤلاء', 'ذلك',
  'تلك', 'اولئك', 'الذي', 'التي', 'الذين', 'اللاتي', 'اللواتي', 'اللائي', 'او', 'ام',
  'و', 'ف', 'ب', 'ك', 'ل', 'لن', 'لم', 'قد', 'لقد', 'سوف', 'س', 'هل', 'فهل', 'وهل',
  'لعل', 'فلعل', 'ولعل', 'كي', 'لكي', 'لكيلا',
  'وعن', 'فعن', 'وفي', 'ففي', 'ومن', 'فمن', 'والي', 'فالي', 'وعلي', 'فعلي', 'ومع', 'فمع'
]);

export function isQuranicParticle(text: string): boolean {
  if (!text) return false;
  const clean = stripArabicHarakat(text);
  if (QURANIC_PARTICLES.has(clean)) return true;
  // Strip single-letter prefixes (wa-, fa-, bi-, li-, ka-)
  if (clean.length > 2 && /^[وفبلك]/.test(clean)) {
    const remainder = clean.substring(1);
    if (QURANIC_PARTICLES.has(remainder)) return true;
  }
  return false;
}

// Maps Indonesian phonetic spellings to canonical root search tags
export function normalizePhoneticQuery(query: string): string {
  if (!query) return '';
  let q = query.trim().toLowerCase();

  const phoneticMap: Record<string, string> = {
    sholat: 'salat',
    solat: 'salat',
    shalat: 'salat',
    sholaat: 'salat',
    shalah: 'salat',
    selawat: 'salat',
    salawat: 'salat',
    's-l-w': 'salat',
    'ص-ل-و': 'salat',
    jakat: 'zakat',
    zakah: 'zakat',
    'z-k-w': 'zakat',
    takwa: 'taqwa',
    taqwaa: 'taqwa',
    'w-q-y': 'taqwa',
    sirk: 'syirik',
    shirk: 'syirik',
    's-r-k': 'syirik',
    dzikir: 'zikir',
    dhikr: 'zikir',
    'z-k-r': 'zikir',
    tobat: 'taubat',
    taubah: 'taubat',
    't-w-b': 'taubat',
    koran: 'quran',
    'qur\'an': 'quran',
    'q-r-a': 'quran',
    sholeh: 'saleh',
    shaleh: 'saleh',
    salih: 'saleh',
    's-l-h': 'saleh'
  };

  Object.keys(phoneticMap).forEach((key) => {
    if (q === key || q.includes(key)) {
      q = q.replace(key, phoneticMap[key]);
    }
  });

  q = q.replace(/[-_.\s]+/g, '');
  q = stripArabicHarakat(q);
  return q;
}

export function searchRoots(query: string): RootWord[] {
  const rawCleaned = query.trim().toLowerCase();
  const normalized = normalizePhoneticQuery(query);
  
  if (!rawCleaned) return ROOT_DATABASE;

  return ROOT_DATABASE.filter((root) => {
    const idClean = root.id.toLowerCase().replace(/-/g, '');
    if (idClean === normalized || idClean === rawCleaned) return true;

    const arabicJoinedClean = stripArabicHarakat(root.rootArabicJoined);
    const arabicSpacedClean = stripArabicHarakat(root.rootArabic.replace(/\s+/g, ''));
    if (arabicJoinedClean === normalized || arabicSpacedClean === normalized || arabicJoinedClean === rawCleaned) return true;

    if (root.rootLatin.toLowerCase() === normalized || root.rootLatin.toLowerCase() === rawCleaned) return true;

    if (root.titleIndo.toLowerCase().includes(normalized) || root.titleIndo.toLowerCase().includes(rawCleaned)) return true;

    const tagMatch = root.tags.some(tag => {
      const cleanTag = tag.toLowerCase().replace(/[-_.\s]+/g, '');
      return cleanTag === normalized || cleanTag === rawCleaned || tag.toLowerCase() === rawCleaned;
    });
    if (tagMatch) return true;

    const meaningMatch = root.meaningsIndonesian.some(m => m.toLowerCase().includes(normalized) || m.toLowerCase().includes(rawCleaned));
    if (meaningMatch) return true;

    return false;
  });
}

export function getRootBySlug(slug: string): RootWord | undefined {
  if (!slug) return undefined;
  const cleanSlug = slug.toLowerCase().trim();
  const normalizedSlug = normalizePhoneticQuery(slug);

  // 1. Authoritative QAC Pilot Resolver
  if (isAuthoritativePilotRoot(cleanSlug) || isAuthoritativePilotRoot(normalizedSlug)) {
    const authPilot = getAuthoritativePilotRootWord(cleanSlug) || getAuthoritativePilotRootWord(normalizedSlug);
    if (authPilot) {
      if (!authPilot.occurrences || authPilot.occurrences.length === 0) {
        authPilot.occurrences = getRootOccurrencesFromChunk('x-w-f') || [];
      }
      return authPilot;
    }
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

  // Always load full occurrences list from chunk if empty
  if (!root.occurrences || root.occurrences.length === 0) {
    const occs = getRootOccurrencesFromChunk(root.id) || getRootOccurrencesFromChunk(cleanSlug);
    return {
      ...root,
      occurrences: occs || []
    };
  }

  return root;
}

/**
 * Extracts Arabic root letters only for valid root words (Returns empty string for particles)
 */
export function extractArabicRootLetters(arabic: string): string {
  if (!arabic) return '';
  if (isQuranicParticle(arabic)) return '';
  const clean = stripArabicHarakat(arabic);

  let processed = clean.replace(/^(وال|فال|بال|كال|لل|ال)/, '');
  processed = processed.replace(/^[وفبلكس]/, '');
  processed = processed.replace(/(هما|كما|هم|كم|هن|كن|تم|تن|نا|ها|ني|يه|يا|ي|ه)$/, '');
  processed = processed.replace(/(ون|ين|ان|ات|ة|وا|تم|تمو)$/, '');

  if (processed.length < 3) return '';
  const letters = processed.split('').filter(c => /[\u0600-\u06FF]/.test(c)).slice(0, 4);
  return letters.length >= 3 ? letters.join(' ') : '';
}

/**
 * Finds the exact matching RootWord from database.
 * STRICT DATA INTEGRITY: Exact matching only, NO substring/fuzzy inference.
 */
export function findBestMatchingRoot(wordArabic: string, meaningIndo?: string): RootWord | undefined {
  if (!wordArabic) return undefined;
  if (isQuranicParticle(wordArabic)) {
    return undefined;
  }
  const clean = stripArabicHarakat(wordArabic);

  // 1. Direct exact match on joined root
  for (const root of ROOT_DATABASE) {
    const rootClean = stripArabicHarakat(root.rootArabicJoined);
    if (clean === rootClean) {
      return root;
    }
  }

  // 2. Exact match through derivative verbs or nouns
  for (const root of ROOT_DATABASE) {
    const matchedVerb = root.verbs.some(v => {
      const vClean = stripArabicHarakat(v.arabic);
      return clean === vClean;
    });
    if (matchedVerb) return root;

    const matchedNoun = root.nouns.some(n => {
      const nClean = stripArabicHarakat(n.arabic);
      return clean === nClean;
    });
    if (matchedNoun) return root;
  }

  return undefined;
}

/**
 * Infers grammatical Part of Speech (POS) strictly.
 * Recognizes Harf/Particles accurately and prevents fake Isim classification.
 */
export function inferGrammarRole(wordArabic: string, meaningIndo?: string): {
  posCategory: 'Isim' | "Fi'il" | 'Harf';
  posDetail: string;
  wazanOrPattern?: string;
} {
  if (isQuranicParticle(wordArabic)) {
    return {
      posCategory: 'Harf',
      posDetail: 'Harf / Partikel (Kaidah Nahwu)',
      wazanOrPattern: 'Mabni (Tetap)'
    };
  }

  const clean = stripArabicHarakat(wordArabic);

  if (clean.length <= 2 && !['رب', 'اب', 'يد', 'دم', 'اخ', 'فم'].includes(clean)) {
    return {
      posCategory: 'Harf',
      posDetail: 'Harf / Partikel (Kaidah Nahwu)',
      wazanOrPattern: 'Mabni (Tetap)'
    };
  }

  // Verb checks
  if (
    clean.startsWith('ي') || clean.startsWith('ت') || clean.startsWith('ن') ||
    clean.startsWith('است') || clean.endsWith('وا') || clean.endsWith('تم')
  ) {
    if (clean.startsWith('ي') || clean.startsWith('ت') || clean.startsWith('ن')) {
      return {
        posCategory: "Fi'il",
        posDetail: "Fi'il Mudhari' (Sedang / Akan Datang)",
        wazanOrPattern: undefined
      };
    }
    if (clean.startsWith('اهْدِ') || clean.startsWith('اقْرَأْ') || clean.startsWith('قُلْ')) {
      return {
        posCategory: "Fi'il",
        posDetail: "Fi'il Amr (Perintah)",
        wazanOrPattern: undefined
      };
    }
    return {
      posCategory: "Fi'il",
      posDetail: "Fi'il (Kata Kerja)",
      wazanOrPattern: undefined
    };
  }

  // Noun / Isim checks
  if (clean.startsWith('ال') || clean.endsWith('ون') || clean.endsWith('ين') || clean.endsWith('ات') || clean.endsWith('ة')) {
    if (clean.startsWith('الم') || clean.startsWith('م')) {
      return {
        posCategory: 'Isim',
        posDetail: "Isim Fa'il / Isim Maf'ul (Pelaku atau Objek)",
        wazanOrPattern: undefined
      };
    }
    return {
      posCategory: 'Isim',
      posDetail: 'Isim (Kata Benda / Sifat)',
      wazanOrPattern: undefined
    };
  }

  return {
    posCategory: 'Isim',
    posDetail: 'Isim (Kata Benda / Istilah)',
    wazanOrPattern: undefined
  };
}
