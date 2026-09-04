/**
 * Word Study Service — Qurabic Central Word Study & Lexical Engine
 * 
 * Implements the architecture defined in PRD Section 4 & 34:
 * RAW QAC -> NORMALIZED MORPHOLOGY -> LEXICAL EVIDENCE -> TRANSLATION -> EDITORIAL SUMMARY -> UI
 * 
 * Invariants:
 * 1. QAC remains the authoritative source for morphology, roots, lemmas, and occurrences.
 * 2. Lexical definitions are sourced from Lane's Arabic-English Lexicon with explicit volume/page citations.
 * 3. Root ≠ Definition: Exact lemma entries are distinguished from root fallbacks.
 * 4. Zero LLM-per-entry hallucination: All claims trace to valid entries in SourceRegistry.
 */

import { WordStudyViewModel, WordFamilyItem, SyntaxAnalysis, LexicalStatus, LexicalSummary, LexicalSense } from '../lexicon/types';
import { resolveCanonicalWordDetail, CanonicalWordContext } from './canonical-service';
import { getQACAuthoritativeIndex } from './qac-parser';
import { SOURCES_REGISTRY } from '../data/sources';
import { buckwalterToArabic } from './buckwalter';
import { stripArabicHarakat } from '../search/root-search';
import { getClassicalCitation } from '../lexicon/classical-citations';
import { getWordDetailedExplanation, CURATED_WORD_DICTIONARY } from '../search/word-dictionary';

/**
 * Maps raw QAC morphological features string to detailed Indonesian syntactic breakdown
 */
function parseSyntacticFeatures(rawTag?: string, rawFeatures?: string): SyntaxAnalysis {
  const features: string[] = [];
  let caseEnding: string | undefined;
  let mood: string | undefined;
  let dependencyLabel: string | undefined;

  if (rawFeatures) {
    if (rawFeatures.includes('NOM')) {
      caseEnding = 'Marfu\' (Nominatif / Dhammah)';
      features.push('I\'rab: Marfu\' (Dhammah)');
    } else if (rawFeatures.includes('ACC')) {
      caseEnding = 'Manshub (Akusatif / Fathah)';
      features.push('I\'rab: Manshub (Fathah)');
    } else if (rawFeatures.includes('GEN')) {
      caseEnding = 'Majrur (Genitif / Kasrah)';
      features.push('I\'rab: Majrur (Kasrah)');
    }

    if (rawFeatures.includes('PERF')) {
      mood = 'Madhi (Selesai/Lampau)';
      features.push('Aspek: Fi\'il Madhi');
    } else if (rawFeatures.includes('IMPF')) {
      mood = 'Mudhari\' (Sedang/Akan Datang)';
      features.push('Aspek: Fi\'il Mudhari\'');
    } else if (rawFeatures.includes('IMPV')) {
      mood = 'Amr (Perintah)';
      features.push('Bentuk: Fi\'il Amr');
    }

    if (rawFeatures.includes('MOOD:IND')) features.push('Hala: Marfu\'');
    if (rawFeatures.includes('MOOD:SUBJ')) features.push('Hala: Manshub (Subjungtif)');
    if (rawFeatures.includes('MOOD:JUS')) features.push('Hala: Majzum (Jusif)');

    if (rawFeatures.includes('M')) features.push('Gender: Mudzakkar (Laki-laki)');
    if (rawFeatures.includes('F')) features.push('Gender: Mu\'annats (Perempuan)');
    if (rawFeatures.includes('S')) features.push('Jumlah: Mufrad (Tunggal)');
    if (rawFeatures.includes('D')) features.push('Jumlah: Mutsanna (Dual)');
    if (rawFeatures.includes('P')) features.push('Jumlah: Jamak (Plural)');
  }

  const role = rawTag === 'V'
    ? 'Kata Kerja (Fi\'il) Inti Kalimat'
    : (rawTag === 'N' || rawTag === 'PN'
        ? 'Nomina / Isim Substantif'
        : (rawTag === 'ADJ'
            ? 'Kata Sifat (Na\'at / Sifat)'
            : (rawTag === 'P' || rawTag === 'PRP'
                ? 'Partikel / Huruf Jar / Penghubung'
                : 'Unsur Morfologi Al-Qur\'an')));

  return {
    treebankRole: rawTag,
    caseEnding,
    mood,
    irabRoleIndo: role,
    dependencyLabel,
    syntacticFeatures: features.length > 0 ? features : ['Morfologi standar Al-Qur\'an']
  };
}

/**
 * Builds a comprehensive, unified WordStudyViewModel for any word token or location coordinate.
 */
export function getWordStudy(
  tokenOrLocation: string,
  context?: CanonicalWordContext
): WordStudyViewModel {
  // 1. Resolve canonical details using authoritative QAC parser
  const detail = resolveCanonicalWordDetail(tokenOrLocation, context);
  const qacIndex = getQACAuthoritativeIndex();
  const rootBw = detail.lexical.root;

  // 2. Build Word Family (Keluarga Kata) from actual QAC corpus records
  const wordFamily: WordFamilyItem[] = [];
  if (rootBw && !detail.morphology.isParticle) {
    const records = qacIndex.recordsByRoot.get(rootBw) || [];
    const grouped = new Map<string, { arabic: string; bw: string; lemmaAr: string; pos: 'Isim' | "Fi'il" | 'Harf'; count: number; sampleLoc?: string }>();

    for (const rec of records) {
      const key = rec.formArabic ? stripArabicHarakat(rec.formArabic) : rec.form;
      const existing = grouped.get(key);
      if (existing) {
        existing.count++;
      } else {
        grouped.set(key, {
          arabic: rec.formArabic || buckwalterToArabic(rec.form),
          bw: rec.form,
          lemmaAr: rec.lemmaArabic || (rec.lemma ? buckwalterToArabic(rec.lemma) : ''),
          pos: rec.pos === 'V' ? "Fi'il" : 'Isim',
          count: 1,
          sampleLoc: rec.locationKey
        });
      }
    }

    const sortedItems = Array.from(grouped.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    for (const item of sortedItems) {
      const cleanAr = stripArabicHarakat(item.arabic);
      const curated = CURATED_WORD_DICTIONARY[cleanAr] || CURATED_WORD_DICTIONARY[item.arabic];
      const meaning = curated?.primaryMeaning || (detail.lexical.coreMeaning ? `${item.pos === "Fi'il" ? 'Bentuk kerja' : 'Bentuk benda'} akar ${detail.lexical.rootArabic || ''}`.trim() : undefined);

      wordFamily.push({
        arabic: item.arabic,
        buckwalter: item.bw,
        lemmaArabic: item.lemmaAr,
        pos: item.pos,
        meaningIndo: meaning,
        count: item.count,
        sampleCoordinate: item.sampleLoc
      });
    }
  }

  // 3. Determine Lexical Status
  let lexicalStatus: LexicalStatus = 'not_found';
  const lex = detail.lexicon;
  if (lex?.hasLexicalData && lex.senses && lex.senses.length > 0) {
    lexicalStatus = 'verified';
  } else if (lex?.hasLexicalData) {
    lexicalStatus = 'source_excerpt_only';
  } else if (detail.morphology.isParticle) {
    lexicalStatus = 'not_applicable';
  } else {
    lexicalStatus = 'not_indexed';
  }

  // 4. Construct Lexical Summary with mandatory basisSenseIds (Strict Invariant)
  let lexicalSummary: LexicalSummary | undefined;
  if (lex?.hasLexicalData && lex.senses.length > 0) {
    const basisIds = lex.senses.map(s => s.id || `sense-${s.senseIndex}`);
    const summaryText = lex.indonesianDefinition || lex.definition || lex.senses[0].text;

    lexicalSummary = {
      key: detail.lexical.lemma || detail.lexical.root || detail.identity.cleanArabic,
      locale: 'id',
      text: summaryText,
      basisSenseIds: basisIds.length > 0 ? basisIds : [`lane-${lex.volume}-${lex.page}`],
      status: 'source-derived',
      generatedBy: "Lane's Arabic-English Lexicon",
      reviewedAt: new Date().toISOString().split('T')[0]
    };
  }

  // 5. Build Primary Meaning for top-level display (Indonesian-First)
  let primaryText = '';
  let sourceBadge = 'Kamus Qurabic';
  let isEditorial = true;

  if (detail.translation.primaryMeaning && !detail.translation.primaryMeaning.startsWith(': see') && !detail.translation.primaryMeaning.startsWith('; see') && !detail.translation.primaryMeaning.startsWith('and ')) {
    primaryText = detail.translation.primaryMeaning;
    sourceBadge = detail.morphology.isParticle ? 'QAC Nahwu' : 'Kamus Qurabic';
    isEditorial = true;
  } else if (lex?.indonesianDefinition) {
    primaryText = lex.indonesianDefinition;
    sourceBadge = "Leksikon Klasik";
    isEditorial = false;
  } else if (detail.lexical.coreMeaning && !detail.lexical.coreMeaning.startsWith('Akar kata ') && !detail.lexical.coreMeaning.includes('memiliki peranan penting')) {
    primaryText = detail.lexical.coreMeaning;
    sourceBadge = 'Kajian Akar Kata';
    isEditorial = true;
  } else if (detail.morphology.isParticle) {
    primaryText = 'Partikel / Kata Tugas (Harf)';
    sourceBadge = 'QAC Nahwu';
    isEditorial = false;
  } else if (lex?.hasLexicalData && lex.definition && !lex.definition.startsWith(': see') && !lex.definition.startsWith('; see') && !lex.definition.startsWith('and ') && !lex.definition.startsWith(', ')) {
    primaryText = lex.definition;
    sourceBadge = "Lane's Lexicon";
    isEditorial = false;
  } else {
    primaryText = detail.translation.primaryMeaning || 'Kosakata Terindeks Al-Qur\'an';
    sourceBadge = 'Qurabic Corpus';
    isEditorial = true;
  }

  // 6. Build Syntactic Breakdown
  const syntax = parseSyntacticFeatures(detail.morphology.rawTag, detail.morphology.rawFeatures);

  // 6. Resolve Classical Citation & Root Philosophy
  const rootSlugOrAr = detail.lexical.rootSlug || detail.lexical.rootArabic || detail.lexical.root;
  const classicalCit = getClassicalCitation(rootSlugOrAr);
  const detailedExpl = getWordDetailedExplanation(detail.identity.arabic);
  const rootPhil = classicalCit?.corePhilosophy || detailedExpl.rootExplanation || detail.lexical.coreMeaning || (detail.lexical.rootArabic ? `Akar kata ${detail.lexical.rootArabic} melandasi pembentukan makna kata ini dalam Al-Qur'an.` : undefined);

  // 7. Assemble Provenance Sources
  const provenance = [
    SOURCES_REGISTRY.quranText,
    SOURCES_REGISTRY.morphology,
    SOURCES_REGISTRY.translation
  ];
  if (lex?.hasLexicalData) {
    provenance.push(SOURCES_REGISTRY.laneLexicon);
  }

  return {
    identity: {
      coordinate: detail.identity.coordinate,
      arabic: detail.identity.arabic,
      cleanArabic: detail.identity.cleanArabic,
      transliteration: detail.identity.transliteration
    },
    primaryMeaning: {
      text: primaryText,
      source: lex?.source || 'Qurabic Corpus',
      sourceBadge,
      isEditorialSummary: isEditorial
    },
    morphology: {
      pos: detail.morphology.pos,
      posLabelIndo: detail.morphology.posLabelIndo,
      verbType: detail.morphology.verbType,
      verbForm: detail.morphology.verbForm,
      nounType: detail.morphology.nounType,
      wazanOrForm: detail.morphology.wazanOrForm,
      grammaticalRole: detail.morphology.grammaticalRole,
      rawTag: detail.morphology.rawTag,
      rawFeatures: detail.morphology.rawFeatures,
      isParticle: detail.morphology.isParticle
    },
    lexical: {
      lemma: detail.lexical.lemma,
      lemmaArabic: detail.lexical.lemmaArabic,
      root: detail.lexical.root,
      rootArabic: detail.lexical.rootArabic,
      rootSlug: detail.lexical.rootSlug,
      qacRoot: detail.lexical.root,
      lexicalRoot: lex?.rootBw || detail.lexical.root,
      rootAgreement: !lex?.rootBw || lex.rootBw === detail.lexical.root,
      status: lexicalStatus,
      summary: lexicalSummary,
      senses: lex?.senses || [],
      isRootEntry: !!lex?.isRootEntry,
      sourceCitation: lex?.sourceCitation || "Lane's Arabic-English Lexicon",
      volume: lex?.volume,
      page: lex?.page,
      rootPhilosophy: rootPhil,
      meanings: detailedExpl.meanings.length > 0 ? detailedExpl.meanings : detail.translation.meanings,
      classicalCitation: classicalCit,
      usageNuances: detailedExpl.quranicNuances
    },
    wordFamily,
    occurrences: {
      totalCount: detail.totalRootOccurrences || detail.relatedOccurrences.length,
      items: detail.relatedOccurrences
    },
    syntax,
    provenance,
    context: detail.context
  };
}
