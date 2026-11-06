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

import { WordStudyViewModel, WordFamilyItem, SyntaxAnalysis, LexicalStatus } from '../lexicon/types';
import { resolveCanonicalWordDetail, CanonicalWordContext } from './canonical-service';
import { getQACAuthoritativeIndex } from './qac-parser';
import { SOURCES_REGISTRY } from '../data/sources';
import { buckwalterToArabic } from './buckwalter';
import { stripArabicHarakat } from '../search/root-search';
import { transliterateArabic, isRawBuckwalterRoot } from './transliteration';
import { getRootOccurrencesFromChunk } from './morphology-service';
import { getLaneRootRecord } from '../lexicon/lane-loader';
import wbwIndonesianGlosses from '../data/wbw-indonesian-glosses.json';
import wbwEnglishGlosses from '../data/wbw-english-glosses.json';

const WBW_ID = wbwIndonesianGlosses.meanings as Record<string, string>;
const WBW_EN = wbwEnglishGlosses.meanings as Record<string, string>;
const wordLocation = (coordinate?: string) => coordinate?.split(':').slice(0, 3).join(':') || '';

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

    // Parse person, gender, and number precisely using delimited token boundaries
    const pgnMatch = rawFeatures.match(/(?:^|[|+:\s])(1S|1P|2MS|2FS|2MD|2MP|2FP|3MS|3FS|3MD|3FD|3MP|3FP|MS|FS|MD|FD|MP|FP)(?:[|+:\s]|$)/);
    if (pgnMatch) {
      const tag = pgnMatch[1];
      switch (tag) {
        case '1S':
          features.push('Subjek: Dhamir Ana (Orang Pertama Tunggal / Aku)');
          features.push('Jumlah: Mufrad (Tunggal)');
          break;
        case '1P':
          features.push('Subjek: Dhamir Nahnu (Orang Pertama Jamak / Kami)');
          features.push('Gender: Musytarak (Laki-laki & Perempuan)');
          features.push('Jumlah: Jamak (Plural)');
          break;
        case '2MS':
          features.push('Subjek: Dhamir Anta (Orang Kedua Tunggal Pria)');
          features.push('Gender: Mudzakkar (Laki-laki)');
          features.push('Jumlah: Mufrad (Tunggal)');
          break;
        case '2FS':
          features.push('Subjek: Dhamir Anti (Orang Kedua Tunggal Wanita)');
          features.push('Gender: Mu\'annats (Perempuan)');
          features.push('Jumlah: Mufrad (Tunggal)');
          break;
        case '2MD':
          features.push('Subjek: Dhamir Antuma (Orang Kedua Dual)');
          features.push('Jumlah: Mutsanna (Dual)');
          break;
        case '2MP':
          features.push('Subjek: Dhamir Antum (Orang Kedua Jamak Pria)');
          features.push('Gender: Mudzakkar (Laki-laki)');
          features.push('Jumlah: Jamak (Plural)');
          break;
        case '2FP':
          features.push('Subjek: Dhamir Antunna (Orang Kedua Jamak Wanita)');
          features.push('Gender: Mu\'annats (Perempuan)');
          features.push('Jumlah: Jamak (Plural)');
          break;
        case '3MS':
        case 'MS':
          features.push('Gender: Mudzakkar (Laki-laki)');
          features.push('Jumlah: Mufrad (Tunggal)');
          break;
        case '3FS':
        case 'FS':
          features.push('Gender: Mu\'annats (Perempuan)');
          features.push('Jumlah: Mufrad (Tunggal)');
          break;
        case '3MD':
        case 'MD':
          features.push('Gender: Mudzakkar (Laki-laki)');
          features.push('Jumlah: Mutsanna (Dual)');
          break;
        case '3FD':
        case 'FD':
          features.push('Gender: Mu\'annats (Perempuan)');
          features.push('Jumlah: Mutsanna (Dual)');
          break;
        case '3MP':
        case 'MP':
          features.push('Gender: Mudzakkar (Laki-laki)');
          features.push('Jumlah: Jamak (Plural)');
          break;
        case '3FP':
        case 'FP':
          features.push('Gender: Mu\'annats (Perempuan)');
          features.push('Jumlah: Jamak (Plural)');
          break;
      }
    } else {
      // Discrete fallback checking delimited single letters
      if (/(?:^|[|+:\s])M(?:[|+:\s]|$)/.test(rawFeatures)) {
        features.push('Gender: Mudzakkar (Laki-laki)');
      } else if (/(?:^|[|+:\s])F(?:[|+:\s]|$)/.test(rawFeatures)) {
        features.push('Gender: Mu\'annats (Perempuan)');
      }
      if (/(?:^|[|+:\s])S(?:[|+:\s]|$)/.test(rawFeatures)) {
        features.push('Jumlah: Mufrad (Tunggal)');
      } else if (/(?:^|[|+:\s])D(?:[|+:\s]|$)/.test(rawFeatures)) {
        features.push('Jumlah: Mutsanna (Dual)');
      } else if (/(?:^|[|+:\s])P(?:[|+:\s]|$)/.test(rawFeatures)) {
        features.push('Jumlah: Jamak (Plural)');
      }
    }
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
  const standalone = !/\d+:\d+/.test(tokenOrLocation) && !context?.wordIndex
    ? tokenOrLocation.replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/ى/g, 'ي').trim()
    : '';
  const particleEntry = (standalone === 'كلا' && /[ٌٍُِ]/.test(tokenOrLocation)) ? undefined : ({
    'و': { id: 'Dan', en: 'and', location: undefined },
    'في': { id: 'Di dalam', en: 'in', location: '2:10:1' },
    'كلا': { id: 'Sekali-kali tidak', en: 'Nay!', location: '78:4:1' },
  } as Record<string, { id: string; en: string; location?: string }>)[standalone];
  const detail = resolveCanonicalWordDetail(particleEntry?.location || tokenOrLocation, context);
  const qacIndex = getQACAuthoritativeIndex();
  const rootBw = detail.lexical.root;
  const laneRoot = rootBw && !detail.morphology.isParticle ? getLaneRootRecord(rootBw) : null;
  const laneRootSense = laneRoot?.entries
    .flatMap((entry) => entry.senses.map((sense) => ({ entry, sense })))
    .find(({ sense }) => Boolean(sense.englishText || sense.text));
  const laneRootRawText = laneRootSense?.sense.englishText || laneRootSense?.sense.text || '';
  // Lane often places a concise English gloss in square brackets inside the
  // fuller transliterated entry. Prefer that authentic excerpt for readability.
  const laneRootReadableExcerpt = laneRootRawText.match(/\[\s*([^\]]{30,})\]/)?.[1]?.trim() || laneRootRawText;

  // 2. Build Word Family (Keluarga Kata) from actual QAC corpus records
  const wordFamily: WordFamilyItem[] = [];
  if (rootBw && !detail.morphology.isParticle) {
    const records = qacIndex.recordsByRoot.get(rootBw) || [];
    const grouped = new Map<string, { arabic: string; bw: string; lemmaAr: string; lemmaBw: string; pos: 'Isim' | "Fi'il" | 'Harf'; count: number; sampleLoc?: string }>();

    for (const rec of records) {
      let rawAr = (rec.formArabic || buckwalterToArabic(rec.form)).replace(/^[\u0651\u0640]+/, '').trim();
      const withAlif = rawAr.replace(/\u0670/g, '\u0627');
      const cleanStem = withAlif
        .replace(/[\u064B\u064C\u064D]?[\u0627\u0649]$/, '')
        .replace(/[\u064B-\u0652]+$/, '')
        .replace(/[\u0653\u0640]/g, '');
      const bareNorm = stripArabicHarakat(cleanStem);
      const pos: 'Isim' | "Fi'il" = rec.pos === 'V' ? "Fi'il" : 'Isim';
      const cleanLemma = stripArabicHarakat((rec.lemmaArabic || rec.lemma || '').replace(/\u0670/g, '\u0627'));
      const key = `${bareNorm}_${pos}_${cleanLemma}`;

      const existing = grouped.get(key);
      if (existing) {
        existing.count++;
        // Prefer shorter un-suffixed forms as representative display
        if (rawAr.length < existing.arabic.length && !rawAr.endsWith('ا')) {
          existing.arabic = rawAr;
        }
      } else {
        grouped.set(key, {
          arabic: rawAr,
          bw: rec.form,
          lemmaAr: rec.lemmaArabic || (rec.lemma ? buckwalterToArabic(rec.lemma) : ''),
          lemmaBw: rec.lemma || '',
          pos,
          count: 1,
          sampleLoc: rec.locationKey
        });
      }
    }

    const sortedItems = Array.from(grouped.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 12);

    for (const item of sortedItems) {
      const meaning = WBW_ID[wordLocation(item.sampleLoc)] ||
        'Makna belum tersedia';

      wordFamily.push({
        arabic: item.arabic,
        buckwalter: item.bw,
        lemmaArabic: item.lemmaAr,
        pos: item.pos,
        meaningIndo: meaning,
        meaningEnglish: WBW_EN[wordLocation(item.sampleLoc)],
        count: item.count,
        sampleCoordinate: item.sampleLoc
      });
    }

  }

  // 3. Determine Lexical Status
  let lexicalStatus: LexicalStatus = 'not_found';
  const lex = particleEntry ? undefined : detail.lexicon;
  if (lex?.hasLexicalData && lex.senses && lex.senses.length > 0) {
    lexicalStatus = 'verified';
  } else if (lex?.hasLexicalData) {
    lexicalStatus = 'source_excerpt_only';
  } else if (detail.morphology.isParticle) {
    lexicalStatus = 'not_applicable';
  } else {
    lexicalStatus = 'not_indexed';
  }

  // Only bundled, location-matched translations carry word-meaning provenance.
  // Caller-supplied display text and root commentary are not lexical evidence.
  const location = wordLocation(detail.identity.coordinate);
  const primaryText = particleEntry?.id || WBW_ID[location] || 'Makna kata belum tersedia';
  const primaryEnglish = particleEntry?.en || WBW_EN[location];

  // 6. Build Syntactic Breakdown
  const syntax = parseSyntacticFeatures(detail.morphology.rawTag, detail.morphology.rawFeatures);

  const provenance = [SOURCES_REGISTRY.quranText, SOURCES_REGISTRY.morphology,
    SOURCES_REGISTRY.translation, SOURCES_REGISTRY.wordTranslation];
  if (lex?.hasLexicalData) provenance.push(SOURCES_REGISTRY.laneLexicon);

  const effectiveOccItems = detail.relatedOccurrences.length > 0
    ? detail.relatedOccurrences
    : (!detail.morphology.isParticle && (detail.lexical.rootSlug || detail.lexical.root)
        ? getRootOccurrencesFromChunk(detail.lexical.rootSlug || detail.lexical.root || '')
        : []);

  const totalOccCount = detail.totalRootOccurrences || effectiveOccItems.length;

  const resolvedContext = { ...(detail.context || {}) };
  if ((!resolvedContext.ayahArabic || !resolvedContext.ayahIndo) && resolvedContext.surahNumber && resolvedContext.ayahNumber) {
    const matched = effectiveOccItems.find(o => o.surahNumber === resolvedContext.surahNumber && o.ayahNumber === resolvedContext.ayahNumber);
    if (matched) {
      if (!resolvedContext.ayahArabic) resolvedContext.ayahArabic = matched.verseArabic;
      if (!resolvedContext.ayahIndo) resolvedContext.ayahIndo = matched.verseIndo;
      if (!resolvedContext.surahNameIndo) resolvedContext.surahNameIndo = matched.surahNameIndo;
    }
  }

  return {
    identity: {
      coordinate: detail.identity.coordinate,
      arabic: particleEntry ? tokenOrLocation : detail.identity.arabic,
      cleanArabic: particleEntry ? standalone : detail.identity.cleanArabic,
      transliteration: (detail.identity.transliteration && !isRawBuckwalterRoot(detail.identity.transliteration))
        ? detail.identity.transliteration
        : transliterateArabic(detail.identity.arabic)
    },
    primaryMeaning: {
      text: primaryText,
      source: particleEntry ? SOURCES_REGISTRY.morphology.name : SOURCES_REGISTRY.wordTranslation.name,
      sourceBadge: particleEntry ? 'QAC · label Indonesia' : 'Quran.com · Indonesia',
      sourceId: particleEntry ? 'quranic-arabic-corpus' : 'quran-com-wbw',
      textEnglish: primaryEnglish,
      sourceEnglish: particleEntry ? SOURCES_REGISTRY.morphology.name : SOURCES_REGISTRY.wordTranslation.name,
      sourceBadgeEnglish: particleEntry ? 'QAC · English' : 'Quran.com · English',
      sourceIdEnglish: particleEntry ? 'quranic-arabic-corpus' : 'quran-com-wbw',
      isEditorialSummary: !!particleEntry
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
      summary: undefined,
      senses: lex?.senses || [],
      isRootEntry: !!lex?.isRootEntry,
      sourceCitation: lex?.sourceCitation || "Lane's Arabic-English Lexicon",
      volume: lex?.volume,
      page: lex?.page,
      rootExcerpt: laneRootSense ? {
        text: laneRootReadableExcerpt,
        volume: laneRootSense.sense.citation?.volume || laneRootSense.entry.volume,
        page: laneRootSense.sense.citation?.page || laneRootSense.entry.page,
      } : undefined,
      meanings: [primaryText],
    },
    wordFamily,
    occurrences: {
      totalCount: totalOccCount,
      items: effectiveOccItems
    },
    syntax,
    provenance,
    context: resolvedContext,
    linguisticExplanation: undefined,
    grammarDerivation: undefined
  };
}
