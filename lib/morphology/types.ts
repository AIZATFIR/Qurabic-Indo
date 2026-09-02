import { DerivativeWord, VerseOccurrence } from '../types/morphology';

/**
 * Raw QAC Corpus Record (Layer 1)
 */
export interface RawQACRecord {
  location: string;       // e.g. "(1:1:1:1)"
  form: string;           // e.g. "bi"
  tag: string;            // e.g. "P"
  features: string;       // e.g. "PREFIX|bi+"
}

/**
 * Normalized Morphological Record (Layer 2)
 * Deterministically derived from Raw QAC features without artificial interpretation
 */
export interface NormalizedMorphologyRecord {
  surah: number;
  ayah: number;
  word: number;
  segment: number;
  locationKey: string;     // "surah:ayah:word:segment" e.g. "2:38:13:1"
  wordLocationKey: string; // "surah:ayah:word" e.g. "2:38:13"
  ayahLocationKey: string; // "surah:ayah" e.g. "2:38"
  form: string;            // Buckwalter e.g. "xawofN"
  formArabic: string;      // Arabic Unicode e.g. "خَوْفٌ"
  tag: string;             // Raw POS tag
  pos: string;             // Resolved POS (V, N, PN, ADJ, P, PRON, etc.)
  root?: string;           // Buckwalter root e.g. "xwf"
  rootArabic?: string;     // Spaced Arabic root e.g. "خ و ف"
  lemma?: string;          // Buckwalter lemma e.g. "xawof"
  lemmaArabic?: string;    // Arabic lemma e.g. "خَوْف"
  verbType?: 'PERF' | 'IMPF' | 'IMPV';
  verbForm?: string;       // "Form I", "Form II", "Form IV", etc.
  nounType?: 'ACT_PCPL' | 'PASS_PCPL' | 'VN' | 'NOUN';
  rawTag: string;
  rawFeatures: string;
  normalizedCategory: string;        // Layer 2 Category
  linguisticInterpretation?: string; // Layer 3 Traditional Linguistic Label
}

/**
 * Authoritative Root Morphology Data Model
 */
export interface AuthoritativeRootMorphology {
  rootBw: string;
  rootArabic: string;
  totalSegments: number;
  uniqueWordLocations: number;
  uniqueAyahs: number;
  verbsCount: number;
  nounsCount: number;
  lemmas: Array<{
    lemmaBw: string;
    lemmaArabic: string;
    pos: string;
    frequency: number;
    form?: string;
    rawTag?: string;
    rawFeatures?: string;
    normalizedCategory?: string;
    linguisticInterpretation?: string;
  }>;
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
  occurrences: VerseOccurrence[];
}
