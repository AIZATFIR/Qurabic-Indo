/**
 * Types and Contracts for Qurabic Lexical Ingestion Layer
 * Sourced strictly from authoritative classical lexicons (Lane's Arabic-English Lexicon).
 * Invariant: Zero AI-generated definitions or fabricated dictionary citations.
 */

export interface LaneSense {
  senseIndex: number;
  definition: string;
  formOrWazan?: string;
  headwordArabic?: string;
  volume?: number;
  page?: number;
}

export interface LaneEntryRecord {
  sourceRecordId: string;
  rootArabic: string;
  rootBw: string;
  headwordArabic: string;
  headwordBw: string;
  itype?: string; // Form 1-10
  pos?: string;
  volume: number;
  page: number;
  senses: string[];
  rawSourceText?: string;
}

export interface LaneRootLexicon {
  rootArabic: string;
  rootBw: string;
  volume: number;
  page: number;
  overview?: string;
  entries: LaneEntryRecord[];
  sourceCitation: string;
}

export interface LexicalLookupResult {
  hasLexicalData: boolean;
  source: string;
  rootArabic?: string;
  rootBw?: string;
  matchedLemmaArabic?: string;
  matchedLemmaBw?: string;
  matchedForm?: string;
  senses: string[];
  volume?: number;
  page?: number;
  sourceCitation: string;
  message?: string;
}
