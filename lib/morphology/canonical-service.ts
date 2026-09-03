import { getQACAuthoritativeIndex } from './qac-parser';
import { ROOT_DATABASE } from '../data/roots';
import { getRootSemanticProfile } from '../data/root-semantics';
import { stripArabicHarakat, isQuranicParticle, findBestMatchingRoot } from '../search/root-search';
import { buckwalterToArabic } from './buckwalter';
import { getRootOccurrencesFromChunk } from './morphology-service';
import { CURATED_WORD_DICTIONARY } from '../search/word-dictionary';
import { VerseOccurrence, DerivativeWord } from '../types/morphology';
import { getLaneRootRecord, getLaneEntryForLemma, getLaneLemmaRecord } from '../lexicon/lane-loader';
import { LexicalLookupResult, LaneRootLexicon } from '../lexicon/types';

export interface WordDetailModel {
  identity: {
    coordinate?: string;
    arabic: string;
    transliteration?: string;
    cleanArabic: string;
  };
  lexical: {
    lemma?: string;
    lemmaArabic?: string;
    root?: string;
    rootArabic?: string;
    rootSlug?: string;
    coreMeaning?: string;
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
  translation: {
    primaryMeaning: string;
    meanings: string[];
    sourceCitation: string;
  };
  lexicon?: LexicalLookupResult;
  context?: {
    surahNumber?: number;
    ayahNumber?: number;
    wordIndex?: number;
    ayahArabic?: string;
    ayahIndo?: string;
  };
  corpus: {
    source: string;
    version: string;
    buckwalter?: string;
  };
  relatedOccurrences: VerseOccurrence[];
  relatedLemmas?: Array<{ lemmaArabic: string; lemmaBw: string; pos: string; count: number }>;
  totalRootOccurrences: number;
}

export interface RootDistributionStats {
  totalOccurrences: number;
  uniqueAyahs: number;
  uniqueSurahs: number;
  uniqueLemmas: number;
  uniqueForms: number;
  verbsCount: number;
  nounsCount: number;
  posDistribution: Array<{ pos: string; labelIndo: string; count: number }>;
  lemmaDistribution: Array<{ lemmaArabic: string; lemmaBw: string; pos: string; count: number }>;
  formDistribution: Array<{ formArabic: string; formBw: string; pos: string; count: number }>;
  surahDistribution: Array<{ surahNumber: number; count: number }>;
}

export interface RootDetailModel {
  id: string;
  rootArabic: string;
  rootArabicJoined: string;
  rootLatin: string;
  titleIndo: string;
  coreMeaning: string;
  contextualNote?: string;
  meaningsIndonesian: string[];
  statistics: RootDistributionStats;
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
  occurrences: VerseOccurrence[];
  lexicon?: LaneRootLexicon | null;
}

/**
 * Maps QAC POS and features to deterministic Indonesian grammatical categories
 */
function mapQACFeaturesToIndo(tag: string, rawFeatures: string): {
  pos: 'Isim' | "Fi'il" | 'Harf';
  posLabelIndo: string;
  verbType?: 'Madhi' | "Mudhari'" | 'Amr';
  verbForm?: string;
  nounType?: "Isim Fa'il" | "Isim Maf'ul" | 'Masdar' | 'Nomina';
  wazanOrForm?: string;
  grammaticalRole: string;
} {
  const isPerf = rawFeatures.includes('PERF');
  const isImpf = rawFeatures.includes('IMPF');
  const isImpv = rawFeatures.includes('IMPV');
  const isActPcpl = rawFeatures.includes('ACT|PCPL');
  const isPassPcpl = rawFeatures.includes('PASS|PCPL');
  const isVn = rawFeatures.includes('VN');
  
  const formMatch = rawFeatures.match(/\((I|II|III|IV|V|VI|VII|VIII|IX|X)\)/);
  const verbForm = formMatch ? `Form ${formMatch[1]}` : undefined;

  if (tag === 'V' || rawFeatures.includes('POS:V')) {
    const vType = isPerf ? 'Madhi' : isImpf ? "Mudhari'" : isImpv ? 'Amr' : undefined;
    const formLabel = verbForm ? ` ${verbForm}` : ' Form I (Mujarrad)';
    return {
      pos: "Fi'il",
      posLabelIndo: `Verba / Fi'il (${vType || 'Kata Kerja'})`,
      verbType: vType,
      verbForm: verbForm || 'Form I',
      wazanOrForm: `Fi'il ${vType || ''}${formLabel}`.trim(),
      grammaticalRole: `Fi'il ${vType || 'Kata Kerja'}${formLabel}`.trim()
    };
  }

  if (tag === 'N' || tag === 'PN' || tag === 'ADJ' || rawFeatures.includes('POS:N') || rawFeatures.includes('POS:ADJ')) {
    let nType: "Isim Fa'il" | "Isim Maf'ul" | 'Masdar' | 'Nomina' = 'Nomina';
    let role = 'Isim (Nomina / Kata Benda)';
    let wazan: string | undefined;

    if (isActPcpl) {
      nType = "Isim Fa'il";
      role = "Isim Fa'il (Pelaku / Partisipel Aktif)";
      wazan = "Wazan Isim Fa'il";
    } else if (isPassPcpl) {
      nType = "Isim Maf'ul";
      role = "Isim Maf'ul (Objek / Partisipel Pasif)";
      wazan = "Wazan Isim Maf'ul";
    } else if (isVn) {
      nType = 'Masdar';
      role = 'Isim Masdar (Kata Benda Verbal / Aksi)';
      wazan = 'Masdar (Verbal Noun)';
    } else if (tag === 'ADJ' || rawFeatures.includes('POS:ADJ')) {
      role = 'Isim Sifat / Adjektiva';
      wazan = 'Shifah Musyabbahah';
    }

    return {
      pos: 'Isim',
      posLabelIndo: `Nomina / Isim (${nType})`,
      nounType: nType,
      wazanOrForm: wazan,
      grammaticalRole: role
    };
  }

  // Harf / Particle
  let particleRole = 'Harf / Partikel (Kata Tugas)';
  if (tag === 'P' || rawFeatures.includes('POS:P')) particleRole = 'Harf Jarr (Preposisi)';
  else if (tag === 'CONJ' || rawFeatures.includes('POS:CONJ')) particleRole = 'Harf Athaf (Kata Hubung / Konjungsi)';
  else if (tag === 'SUB' || rawFeatures.includes('POS:SUB')) particleRole = 'Harf Syarat / Subordinating Conjunction';
  else if (tag === 'NEG' || rawFeatures.includes('POS:NEG')) particleRole = 'Harf Nafi (Partikel Negasi)';
  else if (tag === 'RES' || rawFeatures.includes('POS:RES')) particleRole = 'Harf Istitsna (Partikel Pengecualian)';
  else if (tag === 'DET' || rawFeatures.includes('POS:DET')) particleRole = 'Alif Lam Ma\'rifah (Determiner)';

  return {
    pos: 'Harf',
    posLabelIndo: 'Partikel / Harf',
    wazanOrForm: 'Mabni (Tetap)',
    grammaticalRole: particleRole
  };
}

/**
 * Resolves a single word token or coordinate into a complete canonical WordDetailModel
 */
export function getCanonicalWordDetail(
  tokenOrLocation: string,
  context?: {
    surahNumber?: number;
    ayahNumber?: number;
    wordIndex?: number;
    ayahArabic?: string;
    ayahIndo?: string;
  }
): WordDetailModel {
  const cleanInput = tokenOrLocation.trim();
  const cleanArabic = stripArabicHarakat(cleanInput);
  const qacIndex = getQACAuthoritativeIndex();

  // 1. Resolve QAC Record:
  // First check direct location coordinate (e.g. "10:24:9" or "10:24:9:2")
  let qacRecords = qacIndex.recordsByWordLocation.get(cleanInput);

  if (!qacRecords && cleanInput.split(':').length === 4) {
    const parts = cleanInput.split(':');
    const wordLoc = `${parts[0]}:${parts[1]}:${parts[2]}`;
    qacRecords = qacIndex.recordsByWordLocation.get(wordLoc);
  }

  // If not direct location, check if location provided in context
  if (!qacRecords && context?.surahNumber && context?.ayahNumber && context?.wordIndex) {
    const locKey = `${context.surahNumber}:${context.ayahNumber}:${context.wordIndex}`;
    qacRecords = qacIndex.recordsByWordLocation.get(locKey);
  }

  // If still not found, search in authoritative recordsByToken index
  if (!qacRecords) {
    qacRecords = qacIndex.recordsByToken.get(cleanArabic);
  }

  // 2. Identify Stem Segment & Extracted Features
  const stemRecord = qacRecords
    ? qacRecords.find(r => r.root || r.pos === 'V' || r.pos === 'N' || r.pos === 'ADJ') || qacRecords[0]
    : undefined;

  let rootBw = stemRecord?.root;
  let lemmaBw = stemRecord?.lemma;
  let tag = stemRecord?.tag || (isQuranicParticle(cleanArabic) ? 'P' : 'N');
  let rawFeatures = stemRecord?.rawFeatures || '';

  // 3. Resolve Root in ROOT_DATABASE (Strict, case-preserving Buckwalter matching)
  const isParticleInput = isQuranicParticle(cleanArabic);
  let matchedRoot = (rootBw && !isParticleInput)
    ? ROOT_DATABASE.find(r => r.id.replace(/-/g, '') === rootBw || r.id === rootBw)
    : undefined;

  if (!matchedRoot && !isParticleInput) {
    const curatedDict = CURATED_WORD_DICTIONARY[cleanArabic];
    const rSlug = curatedDict?.rootSlug;
    if (rSlug) {
      matchedRoot = ROOT_DATABASE.find(r => r.id === rSlug || r.id.replace(/-/g, '') === rSlug.replace(/-/g, ''));
      if (matchedRoot && !rootBw) {
        rootBw = matchedRoot.id.replace(/-/g, '');
      }
    }
  }

  // Fallback to fuzzy search ONLY if no authoritative QAC stem was found and word is not a particle
  if (!matchedRoot && !isParticleInput && !stemRecord) {
    matchedRoot = findBestMatchingRoot(cleanInput);
    if (matchedRoot && !rootBw) {
      rootBw = matchedRoot.id.replace(/-/g, '');
    }
  }

  const particleTags = ['P', 'CONJ', 'SUB', 'NEG', 'T', 'REM', 'AVR', 'EXP', 'ANS', 'INC', 'AMD', 'INTG', 'EXL', 'VOC', 'SUP', 'CERT', 'RET', 'PRP', 'SUR', 'ACC', 'RES', 'EQ', 'INT', 'CAUS'];
  const isParticle = isParticleInput || (!matchedRoot && particleTags.includes(tag));

  // 4. Morphological Analysis
  const morphInfo = isParticle
    ? {
        pos: 'Harf' as const,
        posLabelIndo: 'Partikel / Harf (Kata Tugas)',
        wazanOrForm: 'Mabni (Tetap)',
        grammaticalRole: 'Harf / Partikel dalam Kaidah Nahwu',
        isParticle: true
      }
    : (stemRecord ? mapQACFeaturesToIndo(tag, rawFeatures) : {
        pos: 'Isim' as const,
        posLabelIndo: 'Kosakata Terindeks',
        wazanOrForm: 'Bentuk Leksikal Standar',
        grammaticalRole: 'Analisis morfologi terhubung melalui indeks Al-Qur\'an',
        isParticle: false
      });

  // 5. Semantic & Lexical Resolution
  const curatedDict = CURATED_WORD_DICTIONARY[cleanArabic];
  const semanticProfile = matchedRoot ? getRootSemanticProfile(matchedRoot.id) : null;

  let primaryMeaning = curatedDict?.primaryMeaning;
  if (!primaryMeaning) {
    if (semanticProfile?.coreMeaning) {
      primaryMeaning = semanticProfile.coreMeaning;
    } else if (matchedRoot?.titleIndo && !matchedRoot.titleIndo.startsWith('Konsep & Turunan') && !matchedRoot.titleIndo.startsWith('Akar Kata')) {
      primaryMeaning = matchedRoot.titleIndo;
    } else if (isParticle) {
      primaryMeaning = 'Partikel / kata tugas (Harf)';
    }
  }

  let meanings = curatedDict?.meanings ||
    (isParticle
      ? [
          'Partikel / kata tugas (Harf) yang menghubungkan makna antar-kata dalam ayat',
          'Memiliki hukum i\'rab Mabni (bentuk harakat akhir tetap)'
        ]
      : (semanticProfile?.meaningsIndonesian || (primaryMeaning ? [primaryMeaning] : [])));

  // Occurrences
  const occurrences = matchedRoot
    ? (matchedRoot.occurrences && matchedRoot.occurrences.length > 0
        ? matchedRoot.occurrences
        : getRootOccurrencesFromChunk(matchedRoot.id))
    : [];

  // Compute related lemmas from the same root
  const rootRecords = (rootBw && !isParticle) ? (qacIndex.recordsByRoot.get(rootBw) || []) : [];
  const lemmaMap = new Map<string, { lemmaArabic: string; lemmaBw: string; pos: string; count: number }>();
  for (const rec of rootRecords) {
    if (rec.lemma) {
      const existing = lemmaMap.get(rec.lemma);
      if (existing) {
        existing.count++;
      } else {
        lemmaMap.set(rec.lemma, {
          lemmaBw: rec.lemma,
          lemmaArabic: rec.lemmaArabic || buckwalterToArabic(rec.lemma),
          pos: rec.pos === 'V' ? "Fi'il" : 'Isim',
          count: 1
        });
      }
    }
  }
  const relatedLemmas = Array.from(lemmaMap.values()).sort((a, b) => b.count - a.count).slice(0, 8);

  // 6. Lexicon Resolution (Lane's Arabic-English Lexicon)
  let lexiconResult: LexicalLookupResult;
  const lemmaArabic = lemmaBw ? buckwalterToArabic(lemmaBw) : undefined;

  // Step 1: Direct Lemma / Preposition / Headword match in Lane
  const laneLemma = getLaneLemmaRecord(lemmaBw, lemmaArabic || cleanInput || cleanArabic);

  if (laneLemma && laneLemma.senses && laneLemma.senses.length > 0) {
    lexiconResult = {
      hasLexicalData: true,
      source: "Lane's Arabic-English Lexicon",
      rootArabic: laneLemma.rootArabic || (rootBw ? buckwalterToArabic(rootBw) : undefined),
      rootBw: laneLemma.rootBw || rootBw,
      matchedLemmaArabic: laneLemma.headwordArabic,
      matchedLemmaBw: laneLemma.headwordBw,
      matchedForm: laneLemma.itype ? `Form ${laneLemma.itype}` : undefined,
      senses: laneLemma.senses,
      volume: laneLemma.volume,
      page: laneLemma.page,
      sourceCitation: `Edward William Lane, An Arabic-English Lexicon · Book I, Part ${laneLemma.volume}, p. ${laneLemma.page}`
    };
  } else if (rootBw && !isParticle) {
    // Step 2: Root & Form Match
    const laneRoot = getLaneRootRecord(rootBw);
    const verbForm = ('verbForm' in morphInfo ? morphInfo.verbForm : undefined) || morphInfo.wazanOrForm;
    const laneEntry = laneRoot ? getLaneEntryForLemma(rootBw, lemmaBw, verbForm, morphInfo.pos === "Fi'il" ? 'V' : 'N') : null;

    if (laneRoot && laneEntry && laneEntry.senses && laneEntry.senses.length > 0) {
      lexiconResult = {
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
    } else {
      lexiconResult = {
        hasLexicalData: false,
        source: "Lane's Arabic-English Lexicon",
        rootArabic: matchedRoot?.rootArabic || (rootBw ? buckwalterToArabic(rootBw).split('').join(' ') : undefined),
        rootBw,
        senses: [],
        sourceCitation: "Lane's Arabic-English Lexicon (Perseus Digital Library)",
        message: 'Makna leksikal belum tersedia.'
      };
    }
  } else {
    lexiconResult = {
      hasLexicalData: false,
      source: 'The Quranic Arabic Corpus v0.4',
      sourceCitation: 'The Quranic Arabic Corpus v0.4 (University of Leeds)',
      senses: [],
      message: isParticle ? 'Partikel / Harf (Tidak memiliki entri kamus terpisah)' : 'Makna leksikal belum tersedia.'
    };
  }

  return {
    identity: {
      coordinate: stemRecord ? stemRecord.wordLocationKey : (context?.surahNumber ? `${context.surahNumber}:${context.ayahNumber}:${context.wordIndex || 1}` : undefined),
      arabic: cleanInput,
      cleanArabic,
      transliteration: curatedDict?.rootLatin || matchedRoot?.rootLatin || undefined
    },
    lexical: {
      lemma: lemmaBw,
      lemmaArabic: lemmaBw ? buckwalterToArabic(lemmaBw) : undefined,
      root: isParticle ? undefined : rootBw,
      rootArabic: isParticle ? undefined : (matchedRoot?.rootArabic || (rootBw ? buckwalterToArabic(rootBw).split('').join(' ') : undefined)),
      rootSlug: isParticle ? undefined : matchedRoot?.id,
      coreMeaning: curatedDict?.rootExplanation || semanticProfile?.coreMeaning || matchedRoot?.coreMeaning
    },
    morphology: {
      ...morphInfo,
      wazanOrForm: curatedDict?.wazanOrForm || morphInfo.wazanOrForm,
      grammaticalRole: curatedDict?.grammaticalRole || morphInfo.grammaticalRole,
      rawTag: stemRecord?.rawTag,
      rawFeatures: stemRecord?.rawFeatures,
      isParticle
    },
    translation: {
      primaryMeaning: primaryMeaning || '',
      meanings,
      sourceCitation: 'The Quranic Arabic Corpus v0.4 (University of Leeds) & Mushaf Kemenag RI'
    },
    lexicon: lexiconResult,
    context: context ? {
      surahNumber: context.surahNumber,
      ayahNumber: context.ayahNumber,
      wordIndex: context.wordIndex,
      ayahArabic: context.ayahArabic,
      ayahIndo: context.ayahIndo
    } : undefined,
    corpus: {
      source: 'The Quranic Arabic Corpus',
      version: 'v0.4',
      buckwalter: stemRecord?.form
    },
    relatedOccurrences: occurrences.slice(0, 8),
    relatedLemmas,
    totalRootOccurrences: matchedRoot?.totalOccurrences || occurrences.length
  };
}

/**
 * Computes complete canonical RootDetailModel with deterministic distribution statistics
 */
export function getCanonicalRootDetail(slug: string): RootDetailModel | null {
  if (!slug) return null;
  const cleanSlug = slug.trim();
  const qacIndex = getQACAuthoritativeIndex();

  // Find root in ROOT_DATABASE (case-preserving match first, then case-insensitive fallback)
  const matchedRoot = ROOT_DATABASE.find(r => 
    r.id === cleanSlug ||
    r.id.replace(/-/g, '') === cleanSlug.replace(/-/g, '') ||
    r.id.toLowerCase() === cleanSlug.toLowerCase() ||
    r.id.replace(/-/g, '').toLowerCase() === cleanSlug.replace(/-/g, '').toLowerCase() ||
    r.rootLatin.toLowerCase() === cleanSlug.toLowerCase()
  );

  if (!matchedRoot) return null;

  // Exact case-sensitive Buckwalter root key for QAC recordsByRoot
  const rootBw = matchedRoot.id.replace(/-/g, '');
  const qacRecords = qacIndex.recordsByRoot.get(rootBw) || [];

  // Occurrences
  const occurrences = matchedRoot.occurrences && matchedRoot.occurrences.length > 0
    ? matchedRoot.occurrences
    : getRootOccurrencesFromChunk(matchedRoot.id) || [];

  // Calculate deterministic statistics
  const uniqueAyahsSet = new Set<string>();
  const uniqueSurahsSet = new Set<number>();
  const lemmaCountMap = new Map<string, { count: number; pos: string }>();
  const formCountMap = new Map<string, { count: number; pos: string }>();
  const surahCountMap = new Map<number, number>();
  const posCountMap = new Map<string, number>();

  let verbsCount = 0;
  let nounsCount = 0;

  for (const rec of qacRecords) {
    uniqueAyahsSet.add(rec.ayahLocationKey);
    uniqueSurahsSet.add(rec.surah);

    // Lemma distribution
    if (rec.lemma) {
      const current = lemmaCountMap.get(rec.lemma) || { count: 0, pos: rec.pos };
      current.count++;
      lemmaCountMap.set(rec.lemma, current);
    }

    // Form distribution
    if (rec.form) {
      const current = formCountMap.get(rec.form) || { count: 0, pos: rec.pos };
      current.count++;
      formCountMap.set(rec.form, current);
    }

    // Surah distribution
    surahCountMap.set(rec.surah, (surahCountMap.get(rec.surah) || 0) + 1);

    // POS distribution
    if (rec.pos === 'V') verbsCount++;
    else nounsCount++;
    posCountMap.set(rec.pos, (posCountMap.get(rec.pos) || 0) + 1);
  }

  // Build sorted distributions
  const lemmaDistribution = Array.from(lemmaCountMap.entries())
    .map(([lemBw, data]) => ({
      lemmaBw: lemBw,
      lemmaArabic: buckwalterToArabic(lemBw),
      pos: data.pos,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count);

  const formDistribution = Array.from(formCountMap.entries())
    .map(([fBw, data]) => ({
      formBw: fBw,
      formArabic: buckwalterToArabic(fBw),
      pos: data.pos,
      count: data.count
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const surahDistribution = Array.from(surahCountMap.entries())
    .map(([surahNumber, count]) => ({ surahNumber, count }))
    .sort((a, b) => b.count - a.count);

  const posDistribution = [
    { pos: 'V', labelIndo: 'Verba (Fi\'il)', count: verbsCount },
    { pos: 'N', labelIndo: 'Nomina (Isim & Masdar)', count: nounsCount }
  ].filter(p => p.count > 0);

  const semanticProfile = getRootSemanticProfile(matchedRoot.id);

  return {
    id: matchedRoot.id,
    rootArabic: matchedRoot.rootArabic,
    rootArabicJoined: matchedRoot.rootArabicJoined,
    rootLatin: matchedRoot.rootLatin,
    titleIndo: semanticProfile?.titleIndo || matchedRoot.titleIndo || `Akar Kata ${matchedRoot.rootArabic}`,
    coreMeaning: semanticProfile?.coreMeaning || matchedRoot.coreMeaning || 'Makna leksikal terindeks dalam Al-Qur\'an.',
    contextualNote: semanticProfile?.contextualNote || matchedRoot.contextualNote,
    meaningsIndonesian: semanticProfile?.meaningsIndonesian || matchedRoot.meaningsIndonesian || [matchedRoot.coreMeaning],
    statistics: {
      totalOccurrences: qacRecords.length || matchedRoot.totalOccurrences || occurrences.length,
      uniqueAyahs: uniqueAyahsSet.size || occurrences.length,
      uniqueSurahs: uniqueSurahsSet.size,
      uniqueLemmas: lemmaDistribution.length,
      uniqueForms: formCountMap.size,
      verbsCount: verbsCount || matchedRoot.verbsCount || matchedRoot.verbs.length,
      nounsCount: nounsCount || matchedRoot.nounsCount || matchedRoot.nouns.length,
      posDistribution,
      lemmaDistribution,
      formDistribution,
      surahDistribution
    },
    verbs: matchedRoot.verbs || [],
    nouns: matchedRoot.nouns || [],
    occurrences,
    lexicon: getLaneRootRecord(rootBw)
  };
}
