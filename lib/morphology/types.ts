import { DerivativeWord, VerseOccurrence } from '../types/morphology';

/**
 * ==============================================================================
 * QURABIC MORPHOLOGY DATA ARCHITECTURE & SEMANTIC CONTRACT
 * ==============================================================================
 * 
 * This contract establishes a strict four-layer boundary to guarantee data lineage
 * and prevent conflation between raw computational corpus annotations, normalized
 * facts, traditional Arabic grammatical interpretations, and full Mushaf presentation.
 * 
 * ------------------------------------------------------------------------------
 * LAYER 1: RAW QAC FACT (Immutable source from corpus.quran.com v0.4)
 * - Exact verbatim strings from lib/quranic-corpus-morphology-0.4.txt
 * - Represents morphological segments (stems/prefixes/suffixes), NOT full verse words.
 * - e.g. location "(2:38:13:1)", form "xawofN", tag "N", features "STEM|POS:N|..."
 * 
 * LAYER 2: NORMALIZED FACT (Deterministic computation from Layer 1)
 * - Lossless Buckwalter-to-Arabic conversions (formArabic, rootArabic, lemmaArabic)
 * - Resolved Part-of-Speech and deterministic syntactic categories
 * - Key coordinates: locationKey (s:a:w:seg), wordLocationKey (s:a:w), ayahLocationKey (s:a)
 * - formArabic is ONLY a segment representation, NOT authoritative full Mushaf text.
 * 
 * LAYER 3: DERIVED INTERPRETATION (Qurabic Traditional Grammatical Inference)
 * - Explicitly non-authoritative traditional linguistic labels (e.g. "Fi'il Madhi", "Isim Fa'il", "Masdar").
 * - Must ALWAYS carry derivation evidence ("sourceEvidence") and derivation status.
 * - Must NEVER be represented as raw QAC facts.
 * 
 * LAYER 4: MUSHAF PRESENTATION (Consumer & Reader Layer)
 * - Full Arabic verse text from Mushaf Standar Indonesia / Tanzil Uthmani.
 * - Authoritative coordinate join: QAC (s:a:w) -> Mushaf Token at 1-based index w.
 * - e.g. QAC stem "taxaAfu" -> Full Mushaf Token "تَخَافُوهُمْ" (coordinate join, NOT string equality).
 * ==============================================================================
 */

/**
 * Layer 1: Raw QAC Corpus Record
 */
export interface RawQACRecord {
  location: string;       // e.g. "(1:1:1:1)"
  form: string;           // e.g. "bi", "xawofN"
  tag: string;            // e.g. "P", "N", "V"
  features: string;       // e.g. "STEM|POS:N|LEM:xawof|ROOT:xwf|M|INDEF|NOM"
}

/**
 * Layer 3: Explicit Traditional Linguistic Interpretation Contract
 */
export interface LinguisticInterpretationContract {
  label: string;                     // Traditional label e.g. "Isim Fa'il", "Fi'il Mudhari' Form II (Fa''ala)"
  sourceEvidence: string;            // Direct rule evidence e.g. "QAC POS:V + IMPF + (II)", "QAC ACT|PCPL"
  layer: 'interpretation';           // Explicit boundary tag
  derivation: 'derived' | 'deterministic'; // Non-authoritative derivation status
}

/**
 * Layer 2: Normalized Morphological Record with Layer 3 Traceability
 */
export interface NormalizedMorphologyRecord {
  // Layer 1 Raw Pass-Through
  surah: number;
  ayah: number;
  word: number;
  segment: number;
  locationKey: string;     // "surah:ayah:word:segment" (e.g. "2:38:13:1")
  wordLocationKey: string; // "surah:ayah:word" (e.g. "2:38:13")
  ayahLocationKey: string; // "surah:ayah" (e.g. "2:38")
  form: string;            // Buckwalter segment representation e.g. "xawofN"
  tag: string;             // Raw POS tag
  rawTag: string;          // Verbatim raw tag
  rawFeatures: string;     // Verbatim raw features string

  // Layer 2 Normalized Facts (Deterministic)
  pos: string;             // Resolved POS (V, N, PN, ADJ, P, PRON, etc.)
  root?: string;           // Buckwalter root e.g. "xwf"
  rootArabic?: string;     // Spaced Arabic root e.g. "خ و ف"
  lemma?: string;          // Buckwalter lemma e.g. "xawof"
  lemmaArabic?: string;    // Arabic lemma e.g. "خَوْف"
  formArabic: string;      // Buckwalter-to-Arabic segment representation e.g. "خَوْفٌ"
  verbType?: 'PERF' | 'IMPF' | 'IMPV';
  verbForm?: string;       // "Form I", "Form II", "Form IV", etc.
  nounType?: 'ACT_PCPL' | 'PASS_PCPL' | 'VN' | 'NOUN';
  normalizedCategory: string; // Internal normalized category e.g. "Verb + Form I + IMPF"

  // Layer 3 Traditional Interpretation
  linguisticInterpretation?: string; // Legacy string shorthand for UI compatibility
  interpretationContract?: LinguisticInterpretationContract; // Full explicit interpretation metadata
}

/**
 * Authoritative Root Morphology Data Model
 */
export interface AuthoritativeRootMorphology {
  rootBw: string;
  rootArabic: string;
  totalSegments: number;       // Total QAC morphological stem segments
  uniqueWordLocations: number; // Total unique word locations (surah:ayah:word)
  uniqueAyahs: number;         // Total unique ayahs containing this root
  verbsCount: number;          // Total verb segment tokens
  nounsCount: number;          // Total noun/nominal segment tokens
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
    interpretationContract?: LinguisticInterpretationContract;
  }>;
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
  occurrences: VerseOccurrence[];
}
