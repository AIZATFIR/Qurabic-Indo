import fs from 'fs';
import path from 'path';
import { getQACAuthoritativeIndex } from '../lib/morphology/qac-parser';
import { buckwalterToArabic } from '../lib/morphology/buckwalter';
import { DerivativeWord, VerseOccurrence, RootWord } from '../lib/types/morphology';
import { getRootSemanticProfile } from '../lib/data/root-semantics';

console.log('💎 BUILDING CLEAN RUNTIME CORPUS ENGINE WITH RICH TADABBUR SEMANTICS (1,642 ROOTS)...\n');

// Load authoritative QAC index
const index = getQACAuthoritativeIndex();
const allRootsBw = Array.from(index.recordsByRoot.keys());

const compactRootsSummary: RootWord[] = [];

// Specific common lemma meanings map in Indonesian
const COMMON_LEMMA_GLOSS: Record<string, string> = {
  'sam~aY`': 'Menamai / memberi nama (Form II)',
  'sam~aA\'': 'Langit / sesuatu yang tinggi / cakrawala',
  '{somi': 'Nama / sebutan / asma',
  'musam~FY': 'Ditetapkan / ditentukan batas waktunya',
  'xawof': 'Rasa takut / kekhawatiran / kegentaran',
  'xaAfa': 'Takut / merasa gentar (Form I)',
  'xaw~afa': 'Menakut-nakuti / memberi peringatan (Form II)',
  'xiyfah': 'Rasa takut / kekhawatiran yang mendalam',
  'xaA}if': 'Orang yang takut / dalam keadaan cemas',
  'Sabor': 'Sabar / ketabahan / menahan diri',
  'Sabara': 'Bersabar / tabah / menahan diri (Form I)',
  'SaAbir': 'Orang yang bersabar',
  'Salawoh': 'Shalat / ibadah penghubung / doa',
  'Sal~aY`': 'Mendirikan shalat / bershalawat / berdoa (Form II)',
  'muSal~FY': 'Tempat shalat / orang yang shalat',
  'raHiyom': 'Maha Penyayang / penuh kasih sayang',
  'raHoma`n': 'Maha Pengasih bagi seluruh alam',
  'raHomah': 'Rahmat / kasih sayang / anugerah',
  'raHima': 'Mengasihi / menyayangi (Form I)',
  'Hamod': 'Segala puji / sanjungan sempurna',
  'Hamida': 'Memuji / menyanjung (Form I)',
  'maHomuwd': 'Terpuji / kedudukan mulia',
  'kadar': 'Kekeruhan / kesusahan',
  'kazaba': 'Berdusta / berbohong (Form I)',
  'kaz~aba': 'Mendustakan / menganggap bohong (Form II)',
  'kiz~aAb': 'Pendustaan besar / kebohongan nyata',
  'kaAzib': 'Orang yang berdusta / pembohong',
  'kafara': 'Kafir / mengingkari / menutupi kebenaran (Form I)',
  'kaf~ara': 'Menghapus / menutupi dosa (Form II)',
  'kufor': 'Kekafiran / pengingkaran nikmat',
  'kaAfir': 'Orang yang kafir / mengingkari',
  'kaAfuwr': 'Kafur / wewangian penyejuk',
  '|mana': 'Beriman / percaya teguh (Form IV)',
  'Aamona': 'Rasa aman / ketenteraman',
  'mu\'omin': 'Orang yang beriman / mukmin',
  'Ealima': 'Mengetahui / berpengetahuan (Form I)',
  'Eal~ama': 'Mengajarkan / memberi pemahaman (Form II)',
  'Eilom': 'Ilmu / pengetahuan / wawasan',
  'EaAlim': 'Orang yang berilmu / alim / mengetahui yang gaib',
  'EaAlam': 'Alam semesta / ciptaan / tanda kebesaran',
  'EafaA': 'Memaafkan / menghapus kesalahan (Form I)',
  'EaAfiyah': 'Kesejahteraan / ampunan',
  'Eafuww': 'Maha Pemaaf / penghapus dosa',
  '{t~aqaY`': 'Bertakwa / memelihara diri (Form VIII)',
  'taqowaY`': 'Takwa / benteng ketaatan kepada Allah',
  'mut~aqiy': 'Orang yang bertakwa / muttaqin'
};

allRootsBw.forEach((rootBw) => {
  const segments = index.recordsByRoot.get(rootBw) || [];
  const rootArabicSpaced = buckwalterToArabic(rootBw).split('').join(' ');
  const rootArabicJoined = buckwalterToArabic(rootBw);
  const slugId = rootBw.split('').join('-');

  // Group by unique ayah for count
  const uniqueAyahsSet = new Set<string>();
  segments.forEach(seg => {
    uniqueAyahsSet.add(seg.ayahLocationKey);
  });

  // Group by Lemma & POS for verbs and nouns
  const lemmaMap = new Map<string, {
    lemmaBw: string;
    lemmaArabic: string;
    pos: string;
    frequency: number;
    form?: string;
    normalizedCategory: string;
    linguisticInterpretation?: string;
  }>();

  segments.forEach(s => {
    const lemKey = `${s.pos}:${s.lemma || s.form}`;
    if (!lemmaMap.has(lemKey)) {
      lemmaMap.set(lemKey, {
        lemmaBw: s.lemma || s.form,
        lemmaArabic: s.lemmaArabic || s.formArabic,
        pos: s.pos,
        frequency: 0,
        form: s.verbForm,
        normalizedCategory: s.normalizedCategory,
        linguisticInterpretation: s.linguisticInterpretation
      });
    }
    lemmaMap.get(lemKey)!.frequency++;
  });

  const verbs: DerivativeWord[] = [];
  const nouns: DerivativeWord[] = [];
  let verbsCount = 0;
  let nounsCount = 0;

  lemmaMap.forEach((lem) => {
    const customGloss = COMMON_LEMMA_GLOSS[lem.lemmaBw];
    if (lem.pos === 'V') {
      verbsCount += lem.frequency;
      verbs.push({
        id: `v-${rootBw}-${lem.lemmaBw}`,
        arabic: lem.lemmaArabic,
        transliteration: lem.lemmaBw,
        type: 'verb',
        form: lem.form || 'Form I',
        posTag: lem.linguisticInterpretation || 'Fi\'il',
        meaningIndo: customGloss || `Verba ${lem.form || 'Form I'} (${lem.lemmaArabic})`,
        frequency: lem.frequency,
        buckwalter: lem.lemmaBw,
        qacPos: 'V',
        qacFeatures: lem.normalizedCategory
      });
    } else if (lem.pos === 'N') {
      nounsCount += lem.frequency;
      nouns.push({
        id: `n-${rootBw}-${lem.lemmaBw}`,
        arabic: lem.lemmaArabic,
        transliteration: lem.lemmaBw,
        type: 'noun',
        posTag: lem.linguisticInterpretation || 'Isim',
        meaningIndo: customGloss || `Nomina (${lem.lemmaArabic})`,
        frequency: lem.frequency,
        buckwalter: lem.lemmaBw,
        qacPos: 'N',
        qacFeatures: lem.normalizedCategory
      });
    }
  });

  verbs.sort((a, b) => b.frequency - a.frequency);
  nouns.sort((a, b) => b.frequency - a.frequency);

  // Retrieve rich semantic profile
  const profile = getRootSemanticProfile(rootBw, rootArabicSpaced, segments.length, verbsCount, nounsCount);

  // Editorial search tags mapping
  const extraTags: string[] = [];
  if (rootBw === 'smw' || slugId === 's-m-w') extraTags.push('langit', 'nama', 'sama', 'asma', 'menamai', 'ketinggian');
  if (rootBw === 'Slw' || slugId === 'S-l-w') extraTags.push('salat', 'sholat', 'solat', 'shalat', 'doa', 'sembahyang', 'selawat');
  if (rootBw === 'wqy' || slugId === 'w-q-y') extraTags.push('takwa', 'taqwa', 'taqwaa', 'memelihara', 'berlindung');
  if (rootBw === 'zkw' || slugId === 'z-k-w') extraTags.push('zakat', 'jakat', 'zakah', 'bersih', 'suci', 'tumbuh');
  if (rootBw === 'Sbr' || slugId === 'S-b-r') extraTags.push('sabar', 'sabr', 'batu', 'ketabahan', 'menahan diri');
  if (rootBw === 'xwf' || slugId === 'x-w-f') extraTags.push('khauf', 'takut', 'khawatir', 'kegentaran');
  if (rootBw === 'rHm' || slugId === 'r-H-m') extraTags.push('rahmat', 'rahim', 'kasih', 'sayang');
  if (rootBw === 'Hmd' || slugId === 'H-m-d') extraTags.push('hamd', 'puji', 'alhamdulillah', 'pujian');
  if (rootBw === 'kfr' || slugId === 'k-f-r') extraTags.push('kafir', 'kufur', 'ingkar', 'menutup');
  if (rootBw === 'Amn' || slugId === 'A-m-n') extraTags.push('iman', 'aman', 'percaya', 'mukmin');
  if (rootBw === 'Elm' || slugId === 'E-l-m') extraTags.push('ilmu', 'alim', 'mengetahui', 'pengetahuan');
  if (rootBw === 'kZb' || rootBw === 'k*b') extraTags.push('dusta', 'bohong', 'kazib', 'mendustakan');
  if (rootBw === 'Efw') extraTags.push('maaf', 'ampun', 'memaafkan', 'afwan');

  const rootRecord: RootWord = {
    id: slugId,
    rootArabic: rootArabicSpaced,
    rootArabicJoined: rootArabicJoined,
    rootLatin: rootBw,
    titleIndo: profile.titleIndo,
    titleEnglish: `Root ${rootBw}`,
    coreMeaning: profile.coreMeaning,
    usagePatterns: profile.usagePatterns,
    contextualNote: profile.contextualNote,
    meaningsIndonesian: profile.meaningsIndonesian,
    etymologyNote: profile.coreMeaning,
    totalOccurrences: segments.length,
    verbsCount,
    nounsCount,
    verbs,
    nouns,
    occurrences: [], // Dynamically resolved on-demand to keep runtime bundle lightweight
    tags: [
      rootBw.toLowerCase(),
      rootBw,
      slugId.toLowerCase(),
      slugId,
      rootArabicJoined,
      rootArabicSpaced,
      ...extraTags
    ]
  };

  compactRootsSummary.push(rootRecord);
});

// Write compact metadata JSON
const compactJsonPath = path.join(process.cwd(), 'lib/data/roots-summary.json');
fs.writeFileSync(compactJsonPath, JSON.stringify(compactRootsSummary, null, 2), 'utf8');
console.log(`💾 Saved lib/data/roots-summary.json (${(fs.statSync(compactJsonPath).size / 1024).toFixed(1)} KB)`);
console.log(`🎉 1,642 Roots refreshed with rich Tadabbur semantics!`);
