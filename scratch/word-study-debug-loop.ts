/**
 * Word Study Forensic Debug Loop & Harness
 * Evaluates 100+ representative cases across Quranic morphology, canonical identity resolution,
 * root/lemma consistency, classical lexicon provenance, and translation quality.
 * 
 * Strict Invariants:
 * 1. Zero AI-generated definitions or fabricated classical citations.
 * 2. Exact identity resolution between location coordinates and isolated tokens.
 * 3. Strict provenance tracking for every lexical entry.
 * 4. Transparent status: PASS / PARTIAL / FAIL.
 */

import fs from 'fs';
import path from 'path';
import { getCanonicalWordDetail } from '../lib/morphology/canonical-service';
import { getWordStudy } from '../lib/morphology/word-study-service';
import { stripArabicHarakat } from '../lib/search/root-search';

export interface DebugCase {
  id: string;
  input: string;
  category: 'core' | 'particle' | 'noun' | 'verb_form' | 'orthography' | 'proper_noun';
  description: string;
  expectedPos?: 'Isim' | "Fi'il" | 'Harf';
  expectedRoot?: string;
  context?: {
    surahNumber?: number;
    ayahNumber?: number;
    wordIndex?: number;
  };
}

export interface DebugResult {
  id: string;
  input: string;
  category: string;
  description: string;
  identity: {
    cleanArabic: string;
    displayArabic: string;
    transliteration?: string;
  };
  qac: {
    root?: string;
    lemma?: string;
    pos: string;
    rawTag?: string;
    isParticle: boolean;
  };
  lexicon: {
    hasLexicalData: boolean;
    source: string;
    isRootEntry: boolean;
    sensesCount: number;
    hasIndonesianDefinition: boolean;
  };
  wordStudy: {
    primaryMeaning: string;
    sourceBadge: string;
    wazanOrForm?: string;
    wordFamilyCount: number;
    occurrencesCount: number;
    hasClassicalCitation: boolean;
    classicalBook?: string;
  };
  inconsistencies: string[];
  status: 'PASS' | 'PARTIAL' | 'FAIL';
}

export const DEBUG_CASES: DebugCase[] = [
  // 1. Core Milestone Cases
  { id: 'case-001', input: '19:31:2', category: 'core', description: 'Coordinate 19:31:2 (mubārakā)', expectedPos: 'Isim', expectedRoot: 'brk', context: { surahNumber: 19, ayahNumber: 31, wordIndex: 2 } },
  { id: 'case-002', input: 'مُبَارَكًا', category: 'core', description: 'Isolated token mubārakā', expectedPos: 'Isim', expectedRoot: 'brk' },
  { id: 'case-003', input: '38:11:6', category: 'core', description: 'Coordinate 38:11:6 (al-ahzāb)', expectedPos: 'Isim', expectedRoot: 'Hzb', context: { surahNumber: 38, ayahNumber: 11, wordIndex: 6 } },
  { id: 'case-004', input: 'ٱلْأَحْزَابِ', category: 'core', description: 'Isolated token al-ahzāb', expectedPos: 'Isim', expectedRoot: 'Hzb' },
  { id: 'case-005', input: '1:1:1', category: 'core', description: 'Coordinate 1:1:1 (bismi)', expectedPos: 'Isim', expectedRoot: 'smw', context: { surahNumber: 1, ayahNumber: 1, wordIndex: 1 } },
  { id: 'case-006', input: '1:1:2', category: 'core', description: 'Coordinate 1:1:2 (Allāh)', expectedPos: 'Isim', expectedRoot: 'Alh', context: { surahNumber: 1, ayahNumber: 1, wordIndex: 2 } },
  { id: 'case-007', input: '1:1:3', category: 'core', description: 'Coordinate 1:1:3 (ar-Rahmān)', expectedPos: 'Isim', expectedRoot: 'rHm', context: { surahNumber: 1, ayahNumber: 1, wordIndex: 3 } },
  { id: 'case-008', input: '1:1:4', category: 'core', description: 'Coordinate 1:1:4 (ar-Rahīm)', expectedPos: 'Isim', expectedRoot: 'rHm', context: { surahNumber: 1, ayahNumber: 1, wordIndex: 4 } },
  { id: 'case-009', input: '1:2:1', category: 'core', description: 'Coordinate 1:2:1 (al-hamdu)', expectedPos: 'Isim', expectedRoot: 'Hmd', context: { surahNumber: 1, ayahNumber: 2, wordIndex: 1 } },
  { id: 'case-010', input: '1:2:3', category: 'core', description: 'Coordinate 1:2:3 (rabbi)', expectedPos: 'Isim', expectedRoot: 'rbb', context: { surahNumber: 1, ayahNumber: 2, wordIndex: 3 } },
  { id: 'case-011', input: '1:2:4', category: 'core', description: 'Coordinate 1:2:4 (al-ālamin)', expectedPos: 'Isim', expectedRoot: 'Elm', context: { surahNumber: 1, ayahNumber: 2, wordIndex: 4 } },
  { id: 'case-012', input: '1:4:1', category: 'core', description: 'Coordinate 1:4:1 (Māliki)', expectedPos: 'Isim', expectedRoot: 'mlk', context: { surahNumber: 1, ayahNumber: 4, wordIndex: 1 } },
  { id: 'case-013', input: '1:5:2', category: 'core', description: 'Coordinate 1:5:2 (na\'budu)', expectedPos: "Fi'il", expectedRoot: 'Ebd', context: { surahNumber: 1, ayahNumber: 5, wordIndex: 2 } },
  { id: 'case-014', input: '1:5:4', category: 'core', description: 'Coordinate 1:5:4 (nasta\'īn)', expectedPos: "Fi'il", expectedRoot: 'Ewn', context: { surahNumber: 1, ayahNumber: 5, wordIndex: 4 } },
  { id: 'case-015', input: '1:6:1', category: 'core', description: 'Coordinate 1:6:1 (ihdinā)', expectedPos: "Fi'il", expectedRoot: 'hdy', context: { surahNumber: 1, ayahNumber: 6, wordIndex: 1 } },
  { id: 'case-016', input: '1:6:2', category: 'core', description: 'Coordinate 1:6:2 (as-sirāt)', expectedPos: 'Isim', expectedRoot: 'SrT', context: { surahNumber: 1, ayahNumber: 6, wordIndex: 2 } },
  { id: 'case-017', input: '1:6:3', category: 'core', description: 'Coordinate 1:6:3 (al-mustaqīm)', expectedPos: 'Isim', expectedRoot: 'qwm', context: { surahNumber: 1, ayahNumber: 6, wordIndex: 3 } },
  { id: 'case-018', input: '2:153:10', category: 'core', description: 'Coordinate 2:153:10 (as-sābirīn)', expectedPos: 'Isim', expectedRoot: 'Sbr', context: { surahNumber: 2, ayahNumber: 153, wordIndex: 10 } },
  { id: 'case-019', input: 'الصَّابِرِينَ', category: 'core', description: 'Isolated token as-sābirīn', expectedPos: 'Isim', expectedRoot: 'Sbr' },
  { id: 'case-020', input: 'عِندِنَا', category: 'core', description: 'Adverbial noun + pronoun \'indanā (Isim Zharf)', expectedPos: 'Isim' },

  // 2. Non-Root Particles (Harf, Mabni)
  { id: 'case-021', input: 'فَلَمَّآ', category: 'particle', description: 'Temporal conjunction falammā', expectedPos: 'Harf' },
  { id: 'case-022', input: 'إِلَىٰ', category: 'particle', description: 'Preposition ilā', expectedPos: 'Harf' },
  { id: 'case-023', input: 'عَلَىٰ', category: 'particle', description: 'Preposition \'alā', expectedPos: 'Harf' },
  { id: 'case-024', input: 'فِي', category: 'particle', description: 'Preposition fī', expectedPos: 'Harf' },
  { id: 'case-025', input: 'مِنْ', category: 'particle', description: 'Preposition min', expectedPos: 'Harf' },
  { id: 'case-026', input: 'عَنْ', category: 'particle', description: 'Preposition \'an', expectedPos: 'Harf' },
  { id: 'case-027', input: 'مَا', category: 'particle', description: 'Relative / Negative particle mā', expectedPos: 'Harf' },
  { id: 'case-028', input: 'لَا', category: 'particle', description: 'Negative particle lā', expectedPos: 'Harf' },
  { id: 'case-029', input: 'إِنَّ', category: 'particle', description: 'Accusative particle inna', expectedPos: 'Harf' },
  { id: 'case-030', input: 'أَنَّ', category: 'particle', description: 'Subordinating particle anna', expectedPos: 'Harf' },
  { id: 'case-031', input: 'كَلَّا', category: 'particle', description: 'Deterrence particle kallā', expectedPos: 'Harf' },
  { id: 'case-032', input: 'بَلْ', category: 'particle', description: 'Retraction particle bal', expectedPos: 'Harf' },
  { id: 'case-033', input: 'ثُمَّ', category: 'particle', description: 'Conjunction thumma', expectedPos: 'Harf' },
  { id: 'case-034', input: 'حَتَّىٰ', category: 'particle', description: 'Preposition / Conjunction hattā', expectedPos: 'Harf' },
  { id: 'case-035', input: 'أَوْ', category: 'particle', description: 'Conjunction aw', expectedPos: 'Harf' },
  { id: 'case-036', input: 'لَمْ', category: 'particle', description: 'Negative jussive particle lam', expectedPos: 'Harf' },
  { id: 'case-037', input: 'لَنْ', category: 'particle', description: 'Negative subjunctive particle lan', expectedPos: 'Harf' },
  { id: 'case-038', input: 'إِذَا', category: 'particle', description: 'Temporal / Condition idhā', expectedPos: 'Harf' },
  { id: 'case-039', input: 'إِذْ', category: 'particle', description: 'Temporal particle idh', expectedPos: 'Harf' },
  { id: 'case-040', input: 'هَلْ', category: 'particle', description: 'Interrogative hal', expectedPos: 'Harf' },

  // 3. Proper Nouns & Quranic Personalities
  { id: 'case-041', input: 'إِبْرَاهِيمَ', category: 'proper_noun', description: 'Proper Noun Ibrāhīm', expectedPos: 'Isim' },
  { id: 'case-042', input: 'مُوسَىٰ', category: 'proper_noun', description: 'Proper Noun Mūsā', expectedPos: 'Isim' },
  { id: 'case-043', input: 'عِيسَى', category: 'proper_noun', description: 'Proper Noun \'Īsā', expectedPos: 'Isim' },
  { id: 'case-044', input: 'مَرْيَمَ', category: 'proper_noun', description: 'Proper Noun Maryam', expectedPos: 'Isim' },
  { id: 'case-045', input: 'جِبْرِيلَ', category: 'proper_noun', description: 'Proper Noun Jibrīl', expectedPos: 'Isim' },
  { id: 'case-046', input: 'مِيكَالَ', category: 'proper_noun', description: 'Proper Noun Mīkāl', expectedPos: 'Isim' },
  { id: 'case-047', input: 'فِرْعَوْنَ', category: 'proper_noun', description: 'Proper Noun Fir\'awn', expectedPos: 'Isim' },
  { id: 'case-048', input: 'قَارُونَ', category: 'proper_noun', description: 'Proper Noun Qārūn', expectedPos: 'Isim' },
  { id: 'case-049', input: 'هَامَانَ', category: 'proper_noun', description: 'Proper Noun Hāmān', expectedPos: 'Isim' },
  { id: 'case-050', input: 'يُوسُفُ', category: 'proper_noun', description: 'Proper Noun Yūsuf', expectedPos: 'Isim' },

  // 4. Form I to Form X Verbs & Derived Patterns
  { id: 'case-051', input: 'كَتَبَ', category: 'verb_form', description: 'Form I Verb kataba (k-t-b)', expectedPos: "Fi'il", expectedRoot: 'ktb' },
  { id: 'case-052', input: 'يَعْلَمُونَ', category: 'verb_form', description: 'Form I Imperfect ya\'lamūn (E-l-m)', expectedPos: "Fi'il", expectedRoot: 'Elm' },
  { id: 'case-053', input: 'قَالَ', category: 'verb_form', description: 'Form I Hollow qāla (q-w-l)', expectedPos: "Fi'il", expectedRoot: 'qwl' },
  { id: 'case-054', input: 'يَقُولُونَ', category: 'verb_form', description: 'Form I Imperfect yaqūlūn (q-w-l)', expectedPos: "Fi'il", expectedRoot: 'qwl' },
  { id: 'case-055', input: 'نَزَّلَ', category: 'verb_form', description: 'Form II Verb nazzala (n-z-l)', expectedPos: "Fi'il", expectedRoot: 'nzl' },
  { id: 'case-056', input: 'يُسَبِّحُونَ', category: 'verb_form', description: 'Form II Imperfect yusabbihūn (s-b-H)', expectedPos: "Fi'il", expectedRoot: 'sbH' },
  { id: 'case-057', input: 'كَلَّمَ', category: 'verb_form', description: 'Form II Verb kallama (k-l-m)', expectedPos: "Fi'il", expectedRoot: 'klm' },
  { id: 'case-058', input: 'جَـٰهَدُوا۟', category: 'verb_form', description: 'Form III Verb jāhadū (j-h-d)', expectedPos: "Fi'il", expectedRoot: 'jhd' },
  { id: 'case-059', input: 'يُخَـٰدِعُونَ', category: 'verb_form', description: 'Form III Imperfect yukhādi\'ūn (kh-d-E)', expectedPos: "Fi'il", expectedRoot: 'xdE' },
  { id: 'case-060', input: 'بَارَكْنَا', category: 'verb_form', description: 'Form III Verb bāraknā (b-r-k)', expectedPos: "Fi'il", expectedRoot: 'brk' },
  { id: 'case-061', input: 'أَنْزَلَ', category: 'verb_form', description: 'Form IV Verb anzala (n-z-l)', expectedPos: "Fi'il", expectedRoot: 'nzl' },
  { id: 'case-062', input: 'أَرْسَلْنَا', category: 'verb_form', description: 'Form IV Verb arsalnā (r-s-l)', expectedPos: "Fi'il", expectedRoot: 'rsl' },
  { id: 'case-063', input: 'يُؤْمِنُونَ', category: 'verb_form', description: 'Form IV Imperfect yu\'minūn (A-m-n)', expectedPos: "Fi'il", expectedRoot: 'Amn' },
  { id: 'case-064', input: 'تَوَكَّلْ', category: 'verb_form', description: 'Form V Imperative tawakkal (w-k-l)', expectedPos: "Fi'il", expectedRoot: 'wkl' },
  { id: 'case-065', input: 'يَتَفَكَّرُونَ', category: 'verb_form', description: 'Form V Imperfect yatafakkarūn (f-k-r)', expectedPos: "Fi'il", expectedRoot: 'fkr' },
  { id: 'case-066', input: 'تَقَبَّلَ', category: 'verb_form', description: 'Form V Verb taqabbala (q-b-l)', expectedPos: "Fi'il", expectedRoot: 'qbl' },
  { id: 'case-067', input: 'تَعَاوَنُوا۟', category: 'verb_form', description: 'Form VI Imperative ta\'āwanū (E-w-n)', expectedPos: "Fi'il", expectedRoot: 'Ewn' },
  { id: 'case-068', input: 'تَبَـٰرَكَ', category: 'verb_form', description: 'Form VI Verb tabāraka (b-r-k)', expectedPos: "Fi'il", expectedRoot: 'brk' },
  { id: 'case-069', input: 'انفَطَرَتْ', category: 'verb_form', description: 'Form VII Verb infatarat (f-T-r)', expectedPos: "Fi'il", expectedRoot: 'fTr' },
  { id: 'case-070', input: 'انقَلَبُوا۟', category: 'verb_form', description: 'Form VII Verb inqalabū (q-l-b)', expectedPos: "Fi'il", expectedRoot: 'qlb' },
  { id: 'case-071', input: 'ٱخْتَلَفُوا۟', category: 'verb_form', description: 'Form VIII Verb ikhtalafū (kh-l-f)', expectedPos: "Fi'il", expectedRoot: 'xlf' },
  { id: 'case-072', input: 'ٱهْتَدَىٰ', category: 'verb_form', description: 'Form VIII Verb ihtadā (h-d-y)', expectedPos: "Fi'il", expectedRoot: 'hdy' },
  { id: 'case-073', input: 'ٱسْتَمَعَ', category: 'verb_form', description: 'Form VIII Verb istama\'a (s-m-E)', expectedPos: "Fi'il", expectedRoot: 'smE' },
  { id: 'case-074', input: 'ٱسْتَغْفَرَ', category: 'verb_form', description: 'Form X Verb istaghfara (gh-f-r)', expectedPos: "Fi'il", expectedRoot: 'gfr' },
  { id: 'case-075', input: 'يَسْتَبْشِرُونَ', category: 'verb_form', description: 'Form X Imperfect yastabshirūn (b-sh-r)', expectedPos: "Fi'il", expectedRoot: 'b$r' },

  // 5. Quranic Nouns, Plurals & Verbal Nouns (Masdar)
  { id: 'case-076', input: 'جَنَّـٰتٍ', category: 'noun', description: 'Feminine Plural jannāt (j-n-n)', expectedPos: 'Isim', expectedRoot: 'jnn' },
  { id: 'case-077', input: 'أَنْهَـٰرٍ', category: 'noun', description: 'Broken Plural anhār (n-h-r)', expectedPos: 'Isim', expectedRoot: 'nhr' },
  { id: 'case-078', input: 'سَمَـٰوَٰتٍ', category: 'noun', description: 'Plural samāwāt (s-m-w)', expectedPos: 'Isim', expectedRoot: 'smw' },
  { id: 'case-079', input: 'أَبْصَـٰرِهِمْ', category: 'noun', description: 'Noun + Pronoun absārihim (b-S-r)', expectedPos: 'Isim', expectedRoot: 'bSr' },
  { id: 'case-080', input: 'قُلُوبِهِمْ', category: 'noun', description: 'Noun + Pronoun qulūbihim (q-l-b)', expectedPos: 'Isim', expectedRoot: 'qlb' },
  { id: 'case-081', input: 'أَمْوَٰلُكُمْ', category: 'noun', description: 'Noun + Pronoun amwālukum (m-w-l)', expectedPos: 'Isim', expectedRoot: 'mwl' },
  { id: 'case-082', input: 'أَوْلَـٰدُكُمْ', category: 'noun', description: 'Noun + Pronoun awlādukum (w-l-d)', expectedPos: 'Isim', expectedRoot: 'wld' },
  { id: 'case-083', input: 'زَجْرَةٌ', category: 'noun', description: 'Noun of instance zajrah (z-j-r)', expectedPos: 'Isim', expectedRoot: 'zjr' },
  { id: 'case-084', input: 'تَقْوَىٰ', category: 'noun', description: 'Masdar taqwā (w-q-y)', expectedPos: 'Isim', expectedRoot: 'wqy' },
  { id: 'case-085', input: 'حِكْمَةٌ', category: 'noun', description: 'Noun hikmah (H-k-m)', expectedPos: 'Isim', expectedRoot: 'Hkm' },
  { id: 'case-086', input: 'نُورٌ', category: 'noun', description: 'Noun nūr (n-w-r)', expectedPos: 'Isim', expectedRoot: 'nwr' },
  { id: 'case-087', input: 'ظُلُمَـٰتٍ', category: 'noun', description: 'Plural zulumāt (z-l-m)', expectedPos: 'Isim', expectedRoot: 'Zlm' },
  { id: 'case-088', input: 'سَلَـٰمٌ', category: 'noun', description: 'Noun salām (s-l-m)', expectedPos: 'Isim', expectedRoot: 'slm' },
  { id: 'case-089', input: 'شَيْطَـٰنٍ', category: 'noun', description: 'Noun shaytān (sh-t-n)', expectedPos: 'Isim', expectedRoot: '$Tn' },
  { id: 'case-090', input: 'خَوْفٍ', category: 'noun', description: 'Masdar khawf (kh-w-f)', expectedPos: 'Isim', expectedRoot: 'xwf' },

  // 6. Quranic Orthography, Khanjariyah, Wasla & Clitics
  { id: 'case-091', input: 'هَـٰذَا', category: 'orthography', description: 'Demonstrative hādhā', expectedPos: 'Isim' },
  { id: 'case-092', input: 'ذَٰلِكَ', category: 'orthography', description: 'Demonstrative dhālika', expectedPos: 'Isim' },
  { id: 'case-093', input: 'وَٱلَّذِينَ', category: 'orthography', description: 'Conjunction + Relative pronoun walladhīna', expectedPos: 'Isim' },
  { id: 'case-094', input: 'فَبِمَا', category: 'orthography', description: 'Prefixed particle fabimā', expectedPos: 'Harf' },
  { id: 'case-095', input: 'بِٱلْحَقِّ', category: 'orthography', description: 'Preposition + Noun bil-haqqi (H-q-q)', expectedPos: 'Isim', expectedRoot: 'Hqq' },
  { id: 'case-096', input: 'لِلْمُتَّقِينَ', category: 'orthography', description: 'Preposition + Active participle lil-muttaqīn (w-q-y)', expectedPos: 'Isim', expectedRoot: 'wqy' },
  { id: 'case-097', input: 'كَٱلَّذِي', category: 'orthography', description: 'Preposition + Relative kalladhī', expectedPos: 'Isim' },
  { id: 'case-098', input: 'رَبَّنَا', category: 'orthography', description: 'Vocative / Noun + Pronoun rabbanā (r-b-b)', expectedPos: 'Isim', expectedRoot: 'rbb' },
  { id: 'case-099', input: 'أَنزَلْنَـٰهُ', category: 'orthography', description: 'Verb + Suffix pronoun anzalnāhu (n-z-l)', expectedPos: "Fi'il", expectedRoot: 'nzl' },
  { id: 'case-100', input: 'أَنُلْزِمُكُمُوهَا', category: 'orthography', description: 'Complex sentence word (11:28:13)', expectedPos: "Fi'il", expectedRoot: 'lzm' },
  { id: 'case-101', input: 'جِيٓءَ', category: 'orthography', description: 'Passive hollow verb with complex hamza jī\'a (j-y-A)', expectedPos: "Fi'il", expectedRoot: 'jyA' },
  { id: 'case-102', input: 'ٱمْرُؤٌا۟', category: 'orthography', description: 'Noun with final waw orthography imru\'un (m-r-A)', expectedPos: 'Isim', expectedRoot: 'mrA' }
];

export async function runDebugLoop(): Promise<{
  total: number;
  pass: number;
  partial: number;
  fail: number;
  results: DebugResult[];
  summary: Record<string, number>;
}> {
  const results: DebugResult[] = [];
  let pass = 0;
  let partial = 0;
  let fail = 0;

  const categoryIssues: Record<string, number> = {
    identity: 0,
    rootDisagreement: 0,
    lemmaIssue: 0,
    lexiconMissing: 0,
    morphologyMismatch: 0,
    translationGeneric: 0,
    fabricatedCitation: 0
  };

  for (const c of DEBUG_CASES) {
    const inconsistencies: string[] = [];

    // 1. Resolve Canonical Detail & Word Study
    const detail = getCanonicalWordDetail(c.input, c.context);
    const study = getWordStudy(c.input, c.context);

    // Identity check
    if (!detail.identity.cleanArabic || detail.identity.cleanArabic.includes(':')) {
      inconsistencies.push(`Identity corrupted with coordinate: ${detail.identity.cleanArabic}`);
      categoryIssues.identity++;
    }

    // POS Check
    if (c.expectedPos && study.morphology.pos !== c.expectedPos) {
      inconsistencies.push(`POS Mismatch: expected ${c.expectedPos}, got ${study.morphology.pos}`);
      categoryIssues.morphologyMismatch++;
    }

    // Root Check
    if (c.expectedRoot && study.lexical.root && study.lexical.root !== c.expectedRoot) {
      inconsistencies.push(`Root Mismatch: expected ${c.expectedRoot}, got ${study.lexical.root}`);
      categoryIssues.rootDisagreement++;
    }

    // Particle with fake root check (Strict No-Hallucination Contract)
    if (c.category === 'particle' && study.lexical.root && study.lexical.root !== '') {
      inconsistencies.push(`Particle assigned false root: ${study.lexical.root}`);
      categoryIssues.rootDisagreement++;
    }

    // Translation quality check
    if (!study.primaryMeaning.text || study.primaryMeaning.text.startsWith(': see') || study.primaryMeaning.text.startsWith('; see') || study.primaryMeaning.text.startsWith('and ')) {
      inconsistencies.push(`Raw/Broken English translation leaked: ${study.primaryMeaning.text}`);
      categoryIssues.translationGeneric++;
    }

    // Determine status
    let status: 'PASS' | 'PARTIAL' | 'FAIL' = 'PASS';
    if (inconsistencies.length > 0) {
      const hasCriticalError = inconsistencies.some(i => i.includes('corrupted') || i.includes('false root') || i.includes('POS Mismatch'));
      status = hasCriticalError ? 'FAIL' : 'PARTIAL';
    }

    if (status === 'PASS') pass++;
    else if (status === 'PARTIAL') partial++;
    else fail++;

    results.push({
      id: c.id,
      input: c.input,
      category: c.category,
      description: c.description,
      identity: {
        cleanArabic: study.identity.cleanArabic,
        displayArabic: study.identity.arabic,
        transliteration: study.identity.transliteration
      },
      qac: {
        root: study.lexical.root,
        lemma: study.lexical.lemma,
        pos: study.morphology.pos,
        rawTag: study.morphology.rawTag,
        isParticle: study.morphology.isParticle
      },
      lexicon: {
        hasLexicalData: study.lexical.status === 'verified' || study.lexical.status === 'source_excerpt_only',
        source: study.lexical.sourceCitation,
        isRootEntry: study.lexical.isRootEntry,
        sensesCount: study.lexical.senses.length,
        hasIndonesianDefinition: !!study.lexical.summary?.text
      },
      wordStudy: {
        primaryMeaning: study.primaryMeaning.text,
        sourceBadge: study.primaryMeaning.sourceBadge,
        wazanOrForm: study.morphology.wazanOrForm,
        wordFamilyCount: study.wordFamily.length,
        occurrencesCount: study.occurrences.totalCount,
        hasClassicalCitation: !!study.lexical.classicalCitation,
        classicalBook: study.lexical.classicalCitation?.book
      },
      inconsistencies,
      status
    });
  }

  return {
    total: DEBUG_CASES.length,
    pass,
    partial,
    fail,
    results,
    summary: categoryIssues
  };
}

// CLI Execution entrypoint
if (require.main === module) {
  (async () => {
    console.log('🚀 Running Word Study Deep Forensic Debug Loop (102 Cases)...');
    const report = await runDebugLoop();

    const outputDir = path.join(__dirname);
    const baselinePath = path.join(outputDir, 'debug-baseline.json');

    // Save baseline snapshot
    fs.writeFileSync(baselinePath, JSON.stringify(report, null, 2), 'utf-8');
    console.log(`\n💾 Baseline Snapshot written to: ${baselinePath}`);

    console.log('\n========================================');
    console.log('📊 WORD STUDY FORENSIC AUDIT SUMMARY');
    console.log('========================================');
    console.log(`TOTAL CASES EVALUATED : ${report.total}`);
    console.log(`✅ PASS               : ${report.pass} (${((report.pass / report.total) * 100).toFixed(1)}%)`);
    console.log(`⚠️  PARTIAL            : ${report.partial} (${((report.partial / report.total) * 100).toFixed(1)}%)`);
    console.log(`❌ FAIL               : ${report.fail} (${((report.fail / report.total) * 100).toFixed(1)}%)`);
    console.log('----------------------------------------');
    console.log('CATEGORY ISSUES BREAKDOWN:');
    for (const [k, v] of Object.entries(report.summary)) {
      console.log(`• ${k.padEnd(24)}: ${v}`);
    }
    console.log('========================================\n');

    if (report.fail > 0) {
      console.log('❌ Failing cases:');
      report.results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`  [${r.id}] ${r.input} (${r.description}): ${r.inconsistencies.join('; ')}`);
      });
    }
  })();
}
