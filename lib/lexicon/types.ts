/**
 * Types and Contracts for Qurabic Lexical Ingestion Layer
 * Sourced strictly from authoritative classical lexicons (Lane's Arabic-English Lexicon).
 * Invariant: Zero AI-generated definitions or fabricated dictionary citations.
 */

export interface LexicalSenseCitation {
  volume: number;
  page: number;
  entryId: string;
  itype?: string;
}

export interface LexicalSense {
  senseIndex: number;
  text: string;
  source: "Lane's Arabic-English Lexicon";
  citation: LexicalSenseCitation;
}

export interface LaneEntryRecord {
  entryId: string;
  rootArabic: string;
  rootBw: string;
  headwordArabic: string;
  headwordBw: string;
  bareword?: string;
  itype?: string; // Form 1-10
  pos?: string;
  volume: number;
  page: number;
  definition?: string;
  sourceDefinition?: string;
  indonesianDefinition?: string;
  translationMethod?: 'classical_source' | 'derived';
  senses: LexicalSense[];
  rawSourceText?: string;
  isRootEntry?: boolean;
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
  definition?: string;
  sourceDefinition?: string;
  indonesianDefinition?: string;
  translationMethod?: 'classical_source' | 'derived';
  isRootEntry?: boolean;
  senses: LexicalSense[];
  volume?: number;
  page?: number;
  sourceCitation: string;
  message?: string;
}
