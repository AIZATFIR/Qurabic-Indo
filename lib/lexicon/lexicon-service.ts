import { getCanonicalWordDetail, WordDetailModel } from '../morphology/canonical-service';
import { getLaneRootRecord, getLaneEntryForLemma } from './lane-loader';
import { LexicalLookupResult } from './types';

export interface LexiconEnrichedWordDetail extends WordDetailModel {
  lexicon: LexicalLookupResult;
}

/**
 * Resolves a Quranic word token or coordinate and joins it with authentic classical lexicon data.
 * 
 * Pipeline:
 * Coordinate (s:a:w) -> QAC Record -> (root, lemma, POS, verbForm) -> Lexicon Index (Lane) -> Lexical Entry
 * 
 * Invariants:
 * 1. Particles (Harf) never match roots or retrieve classical dictionary entries.
 * 2. Unindexed words return honest "Makna leksikal belum tersedia." with ZERO AI fabrications.
 * 3. Lexical data NEVER overrides QAC morphology.
 */
export function getLexiconEnrichedWordDetail(
  tokenOrLocation: string,
  context?: {
    surahNumber: number;
    ayahNumber: number;
    wordIndex?: number;
    ayahArabic?: string;
    ayahIndo?: string;
  }
): LexiconEnrichedWordDetail {
  // 1. Authoritative QAC Canonical Resolution
  const wordModel = getCanonicalWordDetail(tokenOrLocation, context);

  // 2. Particle Guardrail
  if (wordModel.morphology.isParticle || wordModel.morphology.pos === 'Harf' || !wordModel.lexical.root) {
    const particleResult: LexicalLookupResult = {
      hasLexicalData: false,
      source: "The Quranic Arabic Corpus v0.4",
      sourceCitation: "The Quranic Arabic Corpus v0.4 (University of Leeds)",
      senses: [],
      message: "Partikel / Harf (Tidak memiliki akar kata)"
    };

    return {
      ...wordModel,
      lexicon: particleResult
    };
  }

  // 3. Root-bearing token: Lookup in verified Lane's Lexicon index
  const rootBw = wordModel.lexical.root;
  const lemmaBw = wordModel.lexical.lemma;
  const verbForm = wordModel.morphology.verbForm || wordModel.morphology.wazanOrForm;
  const pos = wordModel.morphology.pos === "Fi'il" ? 'V' : 'N';

  const laneRoot = getLaneRootRecord(rootBw);
  const laneEntry = getLaneEntryForLemma(rootBw, lemmaBw, verbForm, pos);

  if (!laneRoot || !laneEntry) {
    const unindexedResult: LexicalLookupResult = {
      hasLexicalData: false,
      source: "Lane's Arabic-English Lexicon",
      rootArabic: wordModel.lexical.rootArabic,
      rootBw,
      senses: [],
      sourceCitation: "Lane's Arabic-English Lexicon (Perseus Digital Library)",
      message: "Makna leksikal belum tersedia."
    };

    return {
      ...wordModel,
      lexicon: unindexedResult
    };
  }

  // 4. Exact verified match retrieved
  const successResult: LexicalLookupResult = {
    hasLexicalData: true,
    source: "Lane's Arabic-English Lexicon",
    rootArabic: laneRoot.rootArabic,
    rootBw: laneRoot.rootBw,
    matchedLemmaArabic: laneEntry.headwordArabic,
    matchedLemmaBw: laneEntry.headwordBw,
    matchedForm: laneEntry.itype ? `Form ${laneEntry.itype}` : undefined,
    senses: laneEntry.senses,
    volume: laneEntry.volume,
    page: laneEntry.page,
    sourceCitation: laneRoot.sourceCitation
  };

  return {
    ...wordModel,
    lexicon: successResult
  };
}
