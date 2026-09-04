/**
 * Types and Contracts for Qurabic Lexical Ingestion & Word Study Layer
 * Sourced strictly from authoritative classical lexicons and Quranic Arabic Corpus v0.4.
 * Invariants:
 * 1. Zero AI-generated definitions or fabricated dictionary citations.
 * 2. Strict provenance tracking: every lexical summary requires valid basisSenseIds.
 * 3. Clear distinction between exact lemma definitions vs root fallbacks (Root ≠ Definition).
 */

import { VerseOccurrence } from '../types/morphology';

export type LexicalStatus =
  | 'verified'              // Verified classical entry with discrete structured senses
  | 'source_excerpt_only'   // Verified source excerpt from classical lexicon
  | 'not_found'             // Word not found in classical lexicon
  | 'not_indexed'           // Headword not yet indexed in dictionary
  | 'not_applicable'        // Particle/Harf with fixed mabni grammar (no triliteral root entry)
  | 'translation_missing'   // English source exists, Indonesian translation pending review
  | 'parser_unverified';    // Raw source text requires structural review

export interface SourceRegistry {
  id: string;
  name: string;
  edition?: string;
  language: 'ar' | 'en' | 'id';
  url?: string;
  license?: string;
  retrievalDate?: string;
  contentHash?: string;
  description?: string;
}

export interface LexicalSenseCitation {
  volume: number;
  page: number;
  entryId: string;
  itype?: string;
}

export interface LexicalTranslation {
  id: string;
  sourceSenseId: string;
  locale: 'id' | 'en';
  text: string;
  method: 'human' | 'machine' | 'editorial' | 'classical_source';
  provider?: string;
  version?: string;
  reviewed?: boolean;
  createdAt?: string;
}

export interface LexicalSense {
  id?: string;
  entryId?: string;
  senseIndex: number;
  text: string;
  englishText?: string;
  arabicText?: string;
  gloss?: string;
  source: string;
  citation: LexicalSenseCitation;
  translations?: LexicalTranslation[];
}

export interface LexiconEntry {
  id?: string;
  sourceId?: string;
  headwordArabic: string;
  headwordBuckwalter?: string;
  normalizedHeadword?: string;
  bareword?: string;
  rootArabic?: string;
  rootBuckwalter?: string;
  itype?: string;
  pos?: string;
  volume: number;
  page: number;
  entryUrl?: string;
  originalText?: string;
  definition?: string;
  sourceDefinition?: string;
  indonesianDefinition?: string;
  translationMethod?: 'classical_source' | 'derived';
  isRootEntry?: boolean;
  senses: LexicalSense[];
  sourceHash?: string;
}

export interface WordLexiconLink {
  qacLemma?: string;
  qacRoot?: string;
  lexiconEntryId: string;
  matchType: 'exactLemma' | 'exactHeadword' | 'root' | 'form' | 'manual';
  confidence: 'deterministic' | 'reviewed';
  evidence?: string;
}

export interface LexicalSummary {
  key: string;
  locale: 'id' | 'en';
  text: string;
  basisSenseIds: string[];
  status: 'source-derived' | 'editorial-reviewed';
  generatedBy?: string;
  reviewedAt?: string;
}

export interface LaneEntryRecord extends LexiconEntry {
  entryId: string;
  rootArabic: string;
  rootBw: string;
  headwordBw: string;
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
  status?: LexicalStatus;
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
  summary?: LexicalSummary;
  message?: string;
}

export interface WordFamilyItem {
  arabic: string;
  buckwalter: string;
  lemmaArabic: string;
  pos: 'Isim' | "Fi'il" | 'Harf';
  posDetail?: string;
  wazanOrForm?: string;
  count: number;
  sampleCoordinate?: string;
}

export interface SyntaxAnalysis {
  treebankRole?: string;
  caseEnding?: string;
  mood?: string;
  irabRoleIndo: string;
  dependencyLabel?: string;
  syntacticFeatures: string[];
}

export interface WordStudyViewModel {
  identity: {
    coordinate?: string;
    arabic: string;
    cleanArabic: string;
    transliteration?: string;
  };
  primaryMeaning: {
    text: string;
    source: string;
    sourceBadge: string;
    isEditorialSummary?: boolean;
  };
  morphology: {
    pos: 'Isim' | "Fi'il" | 'Harf';
    posLabelIndo: string;
    verbType?: 'Madhi' | "Mudhari'" | 'Amr';
    verbForm?: string;
    nounType?: "Isim Fa'il" | "Isim Maf'ul" | 'Masdar' | 'Nomina';
    wazanOrForm?: string;
    grammaticalRole: string;
    rawTag?: string;
    rawFeatures?: string;
    isParticle: boolean;
  };
  lexical: {
    lemma?: string;
    lemmaArabic?: string;
    root?: string;
    rootArabic?: string;
    rootSlug?: string;
    qacRoot?: string;
    lexicalRoot?: string;
    rootAgreement: boolean;
    status: LexicalStatus;
    summary?: LexicalSummary;
    senses: LexicalSense[];
    isRootEntry: boolean;
    sourceCitation: string;
    volume?: number;
    page?: number;
    rootPhilosophy?: string;
    meanings?: string[];
    classicalCitation?: {
      book: string;
      bookArabic?: string;
      author: string;
      authorArabic?: string;
      volumePage?: string;
      originalArabic?: string;
      indonesianQuote: string;
      corePhilosophy?: string;
    };
    usageNuances?: string[];
  };
  wordFamily: WordFamilyItem[];
  occurrences: {
    totalCount: number;
    items: VerseOccurrence[];
  };
  syntax: SyntaxAnalysis;
  provenance: SourceRegistry[];
  context?: {
    surahNumber?: number;
    ayahNumber?: number;
    wordIndex?: number;
    ayahArabic?: string;
    ayahIndo?: string;
  };
}
