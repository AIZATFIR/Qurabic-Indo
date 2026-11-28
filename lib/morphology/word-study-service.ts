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
 * 4. No generated lexical definitions: AI-assisted particle notes stay labeled and separate from sourced lexicon entries.
 */

import { WordStudyViewModel, WordFamilyItem, SyntaxAnalysis, LexicalStatus } from '../lexicon/types';
import { resolveCanonicalWordDetail, CanonicalWordContext, WordDetailModel } from './canonical-service';
import { getQACRecordsByRoot } from './qac-parser';
import { SOURCES_REGISTRY } from '../data/sources';
import { buckwalterToArabic } from './buckwalter';
import { stripArabicHarakat } from '../search/root-search';
import { transliterateArabic, isRawBuckwalterRoot } from './transliteration';
import { getRootOccurrencesFromChunk } from './morphology-service';
import { getQuranicParticleEnglishMeaning, getQuranicParticleInfo } from './particles-dictionary';
import { getQabasLemmaId } from '../lexicon/qabas-lemma-lookup';

const GENERIC_LEXICAL_LABEL = /^(?:kata (?:dalam|al-qur|kerja|benda)|bentuk kata|konsep & turunan|kosakata al-qur|nomina(?:\s|\()|verba(?:\s|\()|fi['’]il(?:\s|\()|isim(?:\s|\()|harf(?:\s|\())/i;

function makeParticleMeaningNote(category: string | undefined, meaningId: string, meaningEn: string | undefined) {
  const notes: Record<string, { id: string; en: string }> = {
    'Harf Jarr': {
      id: 'Menghubungkan nomina dengan bagian lain kalimat; hubungan tepatnya mengikuti konteks.',
      en: 'A preposition links a following noun to the rest of the sentence; the exact relation depends on context.',
    },
    'Harf Athaf': {
      id: 'Menghubungkan kata atau klausa; hubungan seperti penyertaan atau urutan ditentukan konteks.',
      en: 'A conjunction joins words or clauses; relations such as addition or sequence depend on context.',
    },
    'Harf Taukid': {
      id: 'Memberi penegasan pada pernyataan; kekuatan penegasannya mengikuti pemakaian.',
      en: 'Adds emphasis to a statement; the strength of that emphasis depends on its use.',
    },
    'Harf Nafi': {
      id: 'Meniadakan makna tertentu; unsur yang dinegasikan bergantung pada susunan kalimat.',
      en: 'Negates part of a statement; what is negated depends on the sentence structure.',
    },
    'Harf Nahyi': {
      id: 'Menyatakan larangan dalam susunan tertentu; kata kerja dan sasarannya menentukan cakupannya.',
      en: 'Marks a prohibition in particular constructions; the verb and its subject determine its scope.',
    },
    'Harf Syarat': {
      id: 'Memperkenalkan syarat; jawaban atau akibat syarat dapat muncul pada bagian lain kalimat.',
      en: 'Introduces a condition; its consequence may appear elsewhere in the sentence.',
    },
    'Harf Istitsna': {
      id: 'Mengecualikan sesuatu dari pernyataan sebelumnya; batas pengecualian mengikuti konteks.',
      en: 'Marks an exception to an earlier statement; the scope of the exception depends on context.',
    },
    'Harf Istifham': {
      id: 'Membentuk pertanyaan; dalam konteks tertentu pertanyaan dapat berfungsi retoris.',
      en: 'Forms a question; in some contexts the question may be rhetorical.',
    },
    'Harf Nida': {
      id: 'Mengawali seruan kepada pihak yang dipanggil.',
      en: 'Introduces a direct address to the person or group being called.',
    },
    'Harf Jawaban': {
      id: 'Menandai jawaban atau tanggapan; maknanya bergantung pada ujaran sebelumnya.',
      en: 'Marks a reply or response; its meaning depends on the preceding statement.',
    },
    "Harf Rad'in": {
      id: 'Menolak atau membantah pernyataan sebelumnya dengan penegasan.',
      en: 'Rejects or rebukes a preceding statement emphatically.',
    },
    'Harf Mashdariyyah': {
      id: 'Menghubungkan klausa yang dapat dipahami sebagai suatu tindakan atau keadaan.',
      en: 'Introduces a clause that can function as an action or state in the sentence.',
    },
    'Harf Tanfis': {
      id: 'Menandai waktu mendatang pada kata kerja yang mengikutinya.',
      en: 'Marks future time on the verb that follows it.',
    },
  };
  return notes[category || ''] || {
    id: `Padanan ringkas: ${meaningId}. Fungsi tepatnya mengikuti susunan ayat.`,
    en: `Common gloss: ${meaningEn || 'Quranic particle'}. Its precise function depends on the verse structure.`,
  };
}

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
  context?: CanonicalWordContext,
  resolvedDetail?: WordDetailModel
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
  const detail = resolvedDetail || resolveCanonicalWordDetail(particleEntry?.location || tokenOrLocation, context);
  const particleInfo = detail.morphology.isParticle
    ? getQuranicParticleInfo(detail.identity.cleanArabic || standalone, detail.morphology.rawTag)
    : null;
  const rootBw = detail.lexical.root;

  // 2. Build Word Family (Keluarga Kata) from actual QAC corpus records
  const wordFamily: WordFamilyItem[] = [];
  if (rootBw && !detail.morphology.isParticle) {
    const records = getQACRecordsByRoot(rootBw);
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
      .sort((a, b) => b.count - a.count);

    for (const item of sortedItems) {
      wordFamily.push({
        arabic: item.arabic,
        buckwalter: item.bw,
        lemmaArabic: item.lemmaAr,
        pos: item.pos,
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

  // Runtime Quran.com word glosses are loaded by the view for the active locale.
  const legacyGloss = detail.translation.primaryMeaning?.trim() || '';
  const hasUnrecordedLegacyGloss = !detail.morphology.isParticle
    && Boolean(legacyGloss)
    && !GENERIC_LEXICAL_LABEL.test(legacyGloss)
    && detail.translation.sourceCitation.startsWith('Qurabic ');
  const primaryText = particleEntry?.id
    || particleInfo?.primaryMeaning
    || (detail.morphology.isParticle ? detail.translation.primaryMeaning : '')
    || (hasUnrecordedLegacyGloss ? legacyGloss : '')
    || 'Makna kata belum tersedia';
  const primaryEnglish = particleEntry?.en || getQuranicParticleEnglishMeaning(detail.identity.cleanArabic || standalone, detail.morphology.rawTag);
  const particleMeaningNote = particleInfo?.meaningNote || (particleInfo && detail.morphology.isParticle
    ? makeParticleMeaningNote(particleInfo?.particleCategory, primaryText, primaryEnglish)
    : undefined);
  const isEditorialParticleGlossId = Boolean(particleEntry || particleInfo);
  const isEditorialParticleGlossEn = Boolean(particleEntry || particleInfo);
  const hasEditorialParticleGloss = isEditorialParticleGlossId || isEditorialParticleGlossEn;
  const hasUnverifiedEditorialWordGloss = hasUnrecordedLegacyGloss && primaryText === legacyGloss;

  // 6. Build Syntactic Breakdown
  const syntax = parseSyntacticFeatures(detail.morphology.rawTag, detail.morphology.rawFeatures);

  const provenance = [SOURCES_REGISTRY.quranText, SOURCES_REGISTRY.morphology, SOURCES_REGISTRY.translation];
  if (hasEditorialParticleGloss) provenance.push(SOURCES_REGISTRY.particleGloss);
  if (hasUnverifiedEditorialWordGloss) provenance.push(SOURCES_REGISTRY.editorialWordGloss);
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
      qabasLemmaId: getQabasLemmaId(detail.identity.coordinate),
      arabic: particleEntry ? tokenOrLocation : detail.identity.arabic,
      cleanArabic: particleEntry ? standalone : detail.identity.cleanArabic,
      transliteration: (detail.identity.transliteration && !isRawBuckwalterRoot(detail.identity.transliteration))
        ? detail.identity.transliteration
        : transliterateArabic(detail.identity.arabic)
    },
    primaryMeaning: {
      text: primaryText,
      source: isEditorialParticleGlossId ? SOURCES_REGISTRY.particleGloss.name : hasUnverifiedEditorialWordGloss ? SOURCES_REGISTRY.editorialWordGloss.name : 'Sumber terjemahan per kata belum tersedia',
      sourceBadge: isEditorialParticleGlossId ? 'Catatan berbantuan AI · belum ditelaah' : hasUnverifiedEditorialWordGloss ? 'Qurabic · sumber/telaah tidak tercatat' : 'Sumber belum tersedia',
      sourceId: isEditorialParticleGlossId ? SOURCES_REGISTRY.particleGloss.id : hasUnverifiedEditorialWordGloss ? SOURCES_REGISTRY.editorialWordGloss.id : undefined,
      textEnglish: primaryEnglish,
      sourceEnglish: isEditorialParticleGlossEn ? SOURCES_REGISTRY.particleGloss.nameEnglish : hasUnverifiedEditorialWordGloss && primaryEnglish ? SOURCES_REGISTRY.editorialWordGloss.nameEnglish : 'Word-by-word source unavailable',
      sourceBadgeEnglish: isEditorialParticleGlossEn ? 'AI-assisted · unreviewed' : hasUnverifiedEditorialWordGloss && primaryEnglish ? 'Qurabic · provenance unrecorded' : hasUnverifiedEditorialWordGloss ? 'English meaning unavailable' : 'Source unavailable',
      sourceIdEnglish: isEditorialParticleGlossEn ? SOURCES_REGISTRY.particleGloss.id : hasUnverifiedEditorialWordGloss && primaryEnglish ? SOURCES_REGISTRY.editorialWordGloss.id : undefined,
      isEditorialSummary: isEditorialParticleGlossId || isEditorialParticleGlossEn || hasUnverifiedEditorialWordGloss
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
      meanings: [primaryText],
      particleMeaning: particleMeaningNote,
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
