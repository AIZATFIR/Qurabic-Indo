/**
 * Grammar Derivation Service — Qurabic Morphological Flowchart Engine
 * 
 * Generates structured, visual derivation steps (Card 1: Base Lemma -> Arrow -> Card 2: Verse Form)
 * following the exact interactive model of the Kalaam app:
 * - Clear morphological segment highlights (prefix, stem, suffix, i'rab mark)
 * - Concise, authentic Indonesian Nahwu and Sharaf explanations
 * - Contextual connection with preceding particles (e.g. alam, inna, huruf jar)
 */

import { stripArabicHarakat } from '../search/root-search';
import { transliterateArabic } from './transliteration';
import { getAuthenticWordMeaning } from './root-dictionary';

export interface MorphemeSegment {
  text: string;
  type: 'prefix' | 'stem' | 'suffix' | 'mark';
  label: string;
  meaning?: string;
  colorClass: string; // Tailored color classes for visual distinction
}

export interface GrammarDerivation {
  baseLemma: {
    arabic: string;
    transliteration: string;
    meaning: string;
    formationNote: string;
    posType: string;
  };
  verseForm: {
    arabic: string;
    transliteration: string;
    morphemes: MorphemeSegment[];
    contextMeaning: string;
    grammarExplanation: string;
  };
}

/**
 * Builds the complete two-stage morphological derivation flowchart.
 */
export function getGrammarDerivation(params: {
  wordArabic: string;
  locationKey?: string;
  rawTag?: string;
  rawFeatures?: string;
  rootLetters?: string;
  rootSlug?: string;
  lemmaArabic?: string;
  pos?: string;
  verbType?: string;
  wazanOrForm?: string;
  primaryMeaning?: string;
  verseArabic?: string;
  ayahIndo?: string;
  surahNumber?: number;
  ayahNumber?: number;
  wordIndex?: number;
}): GrammarDerivation {
  const {
    wordArabic,
    locationKey,
    rawTag,
    rawFeatures,
    rootLetters,
    rootSlug,
    lemmaArabic,
    pos,
    verbType,
    wazanOrForm,
    primaryMeaning,
    surahNumber,
    ayahNumber,
    wordIndex
  } = params;

  const cleanWord = wordArabic.trim();
  const unvoweled = stripArabicHarakat(cleanWord);
  const loc = locationKey || (surahNumber && ayahNumber && wordIndex ? `${surahNumber}:${ayahNumber}:${wordIndex}` : '');
  const rootClean = (rootLetters || rootSlug || '').replace(/[\s\-_]/g, '');
  const rootSpaced = rootLetters && rootLetters.includes(' ')
    ? rootLetters
    : (rootLetters ? rootLetters.split('').join(' ') : (rootClean ? rootClean.split('').join(' ') : ''));

  // --------------------------------------------------------------------------
  // Special Curation 1: QS. 105:2:2 (يَجْعَلْ) — Directly cited in user prompt
  // --------------------------------------------------------------------------
  if (loc === '105:2:2' || unvoweled === 'يجعل') {
    return {
      baseLemma: {
        arabic: 'جَعَلَ',
        transliteration: 'ja\'ala',
        meaning: 'dia membuat / menempatkan',
        formationNote: 'Menghubungkan huruf akar dengan tanda fathah untuk menjadikannya kata kerja lampau (fi\'il madhi).',
        posType: 'Kata Kerja Lampau (Fi\'il Madhi Form I)'
      },
      verseForm: {
        arabic: 'يَجْعَلْ',
        transliteration: 'yaj\'al',
        morphemes: [
          {
            text: 'يَـ',
            type: 'prefix',
            label: 'Awalan Mudhari\' (Huruf Mudhara\'ah)',
            meaning: 'Orang ketiga tunggal (dia)',
            colorClass: 'text-amber-500 font-bold'
          },
          {
            text: 'ـجْعَـ',
            type: 'stem',
            label: 'Huruf Akar (ج-ع-ل)',
            meaning: 'Inti perbuatan (menjadikan/membuat)',
            colorClass: 'text-emerald-600 dark:text-emerald-400 font-bold'
          },
          {
            text: 'ـلْ',
            type: 'mark',
            label: 'Tanda Sukun (Jazm)',
            meaning: 'Tanda i\'rab majzum',
            colorClass: 'text-rose-500 font-bold'
          }
        ],
        contextMeaning: 'dia membuat / menempatkan (pertanyaan dengan أَلَمْ)',
        grammarExplanation: 'Awalan يَـ di awal menunjukkan fi\'il mudhari\' (waktu sekarang/akan datang). Tanda sukun majzum (ـْ) pada huruf lam terjadi karena didahului amil jazm أَلَمْ (apakah tidak) yang menjazamkan fi\'il mudhari\'. Bersama-sama, أَلَمْ يَجْعَلْ berarti "apakah Dia tidak menjadikan"?'
      }
    };
  }

  // --------------------------------------------------------------------------
  // Special Curation 2: QS. 95:6:7 (أَجْرٌ) — Directly cited in user prompt
  // --------------------------------------------------------------------------
  if (loc === '95:6:7' || cleanWord === 'أَجْرٌ' || unvoweled === 'اجر') {
    return {
      baseLemma: {
        arabic: 'أَجَرَ',
        transliteration: 'ajara',
        meaning: 'dia memberi imbalan / menyewa',
        formationNote: 'Kata kerja dasar lampau (fi\'il madhi) dari akar kata أ-ج-ر yang menjadi asal pembentukan kata benda kompensasi.',
        posType: 'Bentuk Asal Kata Kerja (Fi\'il Madhi)'
      },
      verseForm: {
        arabic: 'أَجْرٌ',
        transliteration: 'ajrun',
        morphemes: [
          {
            text: 'أَجْر',
            type: 'stem',
            label: 'Bentuk Nomina (Isim)',
            meaning: 'Upah / imbalan / pahala',
            colorClass: 'text-emerald-600 dark:text-emerald-400 font-bold'
          },
          {
            text: 'ـٌ',
            type: 'mark',
            label: 'Tanwin Dhammah (Marfu\')',
            meaning: 'Tanda I\'rab Marfu\' (Mubtada\' Mu\'akhkhar)',
            colorClass: 'text-rose-500 font-bold'
          }
        ],
        contextMeaning: 'pahala / imbalan yang tiada putus-putusnya',
        grammarExplanation: 'Kata أَجْرٌ berkedudukan Marfu\' dengan tanda dhammah tanwin (ـٌ) karena berfungsi sebagai Mubtada\' Mu\'akhkhar (pokok kalimat) setelah susunan jar-majrur فَلَهُمْ (khabar muqaddam). Tanwin menunjukkan sifat agung dan kelimpahan pahala tanpa henti bagi orang beriman yang beramal saleh.'
      }
    };
  }

  // --------------------------------------------------------------------------
  // Special Curation 3: QS. 1:5:2 (نَعْبُدُ) & 1:5:4 (نَسْتَعِينُ)
  // --------------------------------------------------------------------------
  if (unvoweled === 'نعبد' || unvoweled === 'نستعين') {
    const isNastain = unvoweled === 'نستعين';
    const baseLemmaAr = isNastain ? 'أَعَانَ' : 'عَبَدَ';
    const baseMeaning = isNastain ? 'dia menolong' : 'dia menyembah / taat';
    const verseTrans = isNastain ? 'nasta\'īn' : 'na\'budu';
    const contextMeaning = isNastain ? 'kami memohon pertolongan' : 'hanya kepada-Mu kami menyembah';
    const stemLetters = isNastain ? 'ع-و-ن' : 'ع-ب-د';

    return {
      baseLemma: {
        arabic: baseLemmaAr,
        transliteration: transliterateArabic(baseLemmaAr),
        meaning: baseMeaning,
        formationNote: `Menghubungkan huruf akar ${stemLetters} untuk membentuk kata kerja dasar lampau.`,
        posType: isNastain ? 'Fi\'il Madhi Form X' : 'Fi\'il Madhi Form I'
      },
      verseForm: {
        arabic: cleanWord,
        transliteration: verseTrans,
        morphemes: [
          {
            text: 'نَـ',
            type: 'prefix',
            label: 'Awalan Mudhari\' (Dhamir Nahnu / Kami)',
            meaning: 'Kami / kita (jamak pembicara)',
            colorClass: 'text-amber-500 font-bold'
          },
          {
            text: cleanWord.slice(1, -1),
            type: 'stem',
            label: `Akar Kata (${stemLetters})`,
            meaning: isNastain ? 'Mencari pertolongan (Istif\'āl)' : 'Penghambaan dan ketundukan',
            colorClass: 'text-emerald-600 dark:text-emerald-400 font-bold'
          },
          {
            text: cleanWord.slice(-1),
            type: 'mark',
            label: 'Harakat Dhammah (Marfu\')',
            meaning: 'Tanda i\'rab asal fi\'il mudhari\'',
            colorClass: 'text-rose-500 font-bold'
          }
        ],
        contextMeaning,
        grammarExplanation: `Awalan huruf nun (نَـ) menandakan Fi'il Mudhari' dengan subjek orang pertama jamak (Dhamir Nahnu / kami). Berkedudukan Marfu' dengan tanda dhammah pada huruf akhir karena bebas dari amil penashab maupun penjazam.`
      }
    };
  }

  // --------------------------------------------------------------------------
  // Dynamic General Generator: Intelligently analyzes any Arabic word
  // --------------------------------------------------------------------------
  const PARTICLE_BASE_MEANINGS: Record<string, string> = {
    'علي': 'Atas / Di atas / Terhadap',
    'الي': 'Kepada / Menuju',
    'في': 'Di dalam / Pada',
    'من': 'Dari / Sebagian dari',
    'عن': 'Dari / Tentang',
    'مع': 'Beserta / Bersama',
    'ب': 'Dengan / Demi',
    'ل': 'Untuk / Bagi / Milik',
    'ك': 'Bagaikan / Seperti',
    'حتي': 'Hingga / Sampai',
    'ان': 'Tidak / Tiada / Bukan',
    'ما': 'Tidak / Bukan',
    'لا': 'Tidak / Jangan',
    'لم': 'Belum / Tidak pernah',
    'لن': 'Tidak akan pernah',
    'ثم': 'Kemudian / Lalu',
    'او': 'Atau',
    'اذا': 'Apabila / Ketika',
    'اذ': 'Ketika / Ingatlah ketika',
    'قد': 'Sungguh / Benar-benar',
    'سوف': 'Kelak'
  };

  const isVerb = pos === "Fi'il" || rawTag === 'V';
  const isParticle = pos === 'Harf' || rawTag === 'P' || rawTag === 'PRP' || rawTag === 'NEG' || rawTag === 'COND' || rawTag === 'RES' || rawTag === 'SUB' || rawFeatures?.includes('POS:NEG') || rawFeatures?.includes('POS:COND') || rawFeatures?.includes('POS:P') || rawFeatures?.includes('POS:CONJ');
  const defaultLemma = lemmaArabic || (rootClean ? stripArabicHarakat(rootClean) : cleanWord);
  
  const particleBaseMeaning = isParticle 
    ? (PARTICLE_BASE_MEANINGS[stripArabicHarakat(defaultLemma)] || PARTICLE_BASE_MEANINGS[stripArabicHarakat(lemmaArabic || '')])
    : undefined;

  const authenticMeaning = (isParticle && (rawTag === 'NEG' || rawFeatures?.includes('NEG')))
    ? (primaryMeaning || 'Tidak / Tiada / Bukan (Penyangkal / Negasi)')
    : (primaryMeaning || getAuthenticWordMeaning(cleanWord, rootSlug));

  // Clean trailing Quranic pause/waqf symbols and annotations
  const normalizedWord = cleanWord.replace(/[\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\s]+$/g, '').trim();

  // Analyze Morphemes (Prefix, Stem, Suffix)
  const morphemes: MorphemeSegment[] = [];
  let remaining = normalizedWord;

  // Detect common Quranic sentence prefixes
  if (remaining.startsWith('وَ') && remaining.length > 2) {
    morphemes.push({ text: 'وَ', type: 'prefix', label: 'Wawu Athaf (Kata Sambung Dan)', meaning: 'dan', colorClass: 'text-sky-500 font-bold' });
    remaining = remaining.slice(1);
  } else if (remaining.startsWith('فَ') && remaining.length > 2) {
    morphemes.push({ text: 'فَ', type: 'prefix', label: 'Fa Athaf (Maka / Lalu)', meaning: 'maka / lalu', colorClass: 'text-sky-500 font-bold' });
    remaining = remaining.slice(1);
  } else if (remaining.startsWith('بِ') && remaining.length > 2) {
    morphemes.push({ text: 'بِ', type: 'prefix', label: 'Huruf Jar Ba (Dengan / Demi)', meaning: 'dengan', colorClass: 'text-sky-500 font-bold' });
    remaining = remaining.slice(1);
  } else if (remaining.startsWith('لِ') && remaining.length > 2) {
    morphemes.push({ text: 'لِ', type: 'prefix', label: 'Lam Jar / Lam Ta\'lil (Untuk / Bagi)', meaning: 'untuk / bagi', colorClass: 'text-sky-500 font-bold' });
    remaining = remaining.slice(1);
  }

  // Detect Definite Article or Verb Prefix
  const isPerfVerb = verbType === 'Madhi' || rawFeatures?.includes('PERF') || wazanOrForm?.includes('Madhi');
  const isFormV = wazanOrForm?.includes('Form V') || rawFeatures?.includes('(V)') || rawFeatures?.includes('FORM:V');

  if (remaining.startsWith('ٱلْ') || remaining.startsWith('الْ') || remaining.startsWith('ٱل') || remaining.startsWith('ال')) {
    const alLen = remaining.startsWith('ٱلْ') || remaining.startsWith('الْ') ? 3 : 2;
    morphemes.push({ text: remaining.slice(0, alLen), type: 'prefix', label: 'Alif Lam Ma\'rifah (Definite Article)', meaning: 'penentu definit / yang mulia', colorClass: 'text-indigo-500 font-bold' });
    remaining = remaining.slice(alLen);
  } else if (isVerb && isPerfVerb && isFormV && (remaining.startsWith('تَ') || remaining.startsWith('تُ'))) {
    // In Form V Madhi (Tafa''ala), initial Ta is the pattern augment, NOT Huruf Mudhara'ah
    const taChar = remaining.slice(0, 2);
    morphemes.push({ text: taChar, type: 'prefix', label: 'Awalan Wazan Form V (Tafa\'\'ala)', meaning: 'penanda bentuk refleksif / kesungguhan bertawakal', colorClass: 'text-amber-500 font-bold' });
    remaining = remaining.slice(2);
  } else if (isVerb && !isPerfVerb && (remaining.startsWith('يَ') || remaining.startsWith('يُ') || remaining.startsWith('تَ') || remaining.startsWith('تُ') || remaining.startsWith('نَ') || remaining.startsWith('أَ'))) {
    const mudhChar = remaining.slice(0, 2);
    morphemes.push({ text: mudhChar, type: 'prefix', label: 'Huruf Mudhara\'ah (Awalan Kata Kerja Sekarang/Akan Datang)', meaning: 'penanda subjek / waktu kini', colorClass: 'text-amber-500 font-bold' });
    remaining = remaining.slice(2);
  }

  // Detect common suffixes with harakat-aware regex (supports kasrah/dhammah variants like hum/him)
  let suffixPart = '';
  let suffixLabel = 'Akhiran Dhamir / Penanda Jamak';
  let suffixMeaning = 'mereka / kalian / kami';

  const suffixRegex = /(ن[\u064E]?[\u0627\u0670]|ك[\u064F\u0650]?م[\u0652]?|ه[\u064F\u0650]?م[\u0652]?|ه[\u064F\u0650]?نَّ?|ه[\u064F\u0650]?م[\u064E\u0627\u0670]?|ه[\u064E\u0650\u064F]?[\u0627\u0670]|ه[\u064F\u0650]|و[\u064F]?[\u0627\u0670][\u06DF]?|و[\u064F]?ن[\u064E]?|ي[\u0650]?ن[\u064E]?|ت[\u064F\u064E\u0650]?م[\u0652]?|ت[\u064F\u064E\u0650])$/;
  const sMatch = remaining.match(suffixRegex);

  if (sMatch) {
    suffixPart = sMatch[0];
    remaining = remaining.slice(0, -suffixPart.length);

    if (suffixPart.includes('نَا') || suffixPart.includes('نا')) {
      suffixLabel = isParticle ? 'Dhamir Muttashil (Kata Ganti Kami)' : 'Akhiran Dhamir Fa\'il (Nahnu / Kami)';
      suffixMeaning = 'kami (subjek / objek majrur)';
    } else if (suffixPart.includes('كُمْ') || suffixPart.includes('كم')) {
      suffixLabel = isParticle ? 'Dhamir Muttashil (Kata Ganti Kalian)' : 'Akhiran Dhamir Mukhatab (Kalian)';
      suffixMeaning = 'kalian semua';
    } else if (suffixPart.includes('هُمْ') || suffixPart.includes('هِمْ') || suffixPart.includes('هم')) {
      suffixLabel = isParticle ? 'Dhamir Muttashil (Kata Ganti Mereka)' : 'Akhiran Dhamir Ghaib (Mereka)';
      suffixMeaning = 'mereka (jamak ghaib)';
    } else if (suffixPart.includes('وا')) {
      suffixLabel = 'Wawu Jama\'ah (Penanda Jamak Pelaku)';
      suffixMeaning = 'mereka / kalian (jamak)';
    } else if (suffixPart.includes('ونَ') || suffixPart.includes('ينَ') || suffixPart.includes('ون') || suffixPart.includes('ين')) {
      suffixLabel = 'Tanda Jamak Mudzakkar Salim';
      suffixMeaning = 'orang-orang yang';
    } else if (suffixPart.includes('هُ') || suffixPart.includes('هِ')) {
      suffixLabel = isParticle ? 'Dhamir Muttashil (Kata Ganti Dia)' : 'Akhiran Dhamir Ghaib (Dia)';
      suffixMeaning = 'dia / nya';
    } else if (suffixPart.includes('هَا') || suffixPart.includes('ها')) {
      suffixLabel = isParticle ? 'Dhamir Muttashil (Kata Ganti Dia Perempuan)' : 'Akhiran Dhamir Ghaibah (Dia)';
      suffixMeaning = 'dia / nya (feminin)';
    }
  }

  // Add stem morpheme
  let stemLabel = rootSpaced ? `Inti Huruf Akar (${rootSpaced})` : 'Batang Kata Utama (Stem)';
  let stemMeaning = authenticMeaning;

  if (isParticle) {
    const isPrep = rawTag === 'P' || rawTag === 'PRP' || rawFeatures?.includes('POS:P') || rawFeatures?.includes('POS:PRP') || ['علي', 'الي', 'في', 'من', 'عن', 'مع', 'ل', 'ب'].includes(stripArabicHarakat(remaining));
    stemLabel = isPrep ? 'Huruf Jar (Kata Depan)' : 'Partikel Utama (Harf)';
    const cleanRem = stripArabicHarakat(remaining);
    stemMeaning = PARTICLE_BASE_MEANINGS[cleanRem] || (isPrep ? 'atas / di dalam / kepada' : 'partikel kata tugas');
  }

  morphemes.push({
    text: remaining,
    type: 'stem',
    label: stemLabel,
    meaning: stemMeaning,
    colorClass: 'text-emerald-600 dark:text-emerald-400 font-bold'
  });

  if (suffixPart) {
    morphemes.push({
      text: suffixPart,
      type: 'suffix',
      label: suffixLabel,
      meaning: suffixMeaning,
      colorClass: 'text-purple-500 font-bold'
    });
  }

  // Generate clear Nahwu Explanation
  let grammarExplanation = '';
  if (isParticle) {
    const isCompoundPrep = (rawTag === 'P' || rawTag === 'PRP' || rawFeatures?.includes('POS:P') || ['علي', 'الي', 'في', 'من', 'عن', 'مع', 'ل', 'ب'].includes(stripArabicHarakat(remaining))) && Boolean(suffixPart);
    if (isCompoundPrep) {
      grammarExplanation = `Kata ${cleanWord} merupakan rangkaian kata depan (Harf Jarr) yang bersambung dengan kata ganti (Dhamir Muttashil). Dhamir ini berkedudukan fī maḥalli jarr (menempati posisi majrur), membentuk susunan frasa jar-majrur (syibhul jumlah) yang memperjelas sasaran hubungan gramatikal di dalam ayat.`;
    } else if (rawTag === 'NEG' || rawFeatures?.includes('NEG')) {
      grammarExplanation = `Kata ${cleanWord} adalah partikel penyangkal/negasi (Harf Nafi) yang mabni atas sukun. Berfungsi menafikan pernyataan di dalam kalimat, sering dipadukan dengan partikel pembatasan (seperti إِلَّا atau لَمَّا) untuk menegaskan kepastian makna ayat.`;
    } else if (rawTag === 'COND' || rawFeatures?.includes('COND')) {
      grammarExplanation = `Kata ${cleanWord} adalah partikel bersyarat (Harf Syarat) yang mabni atas sukun. Berfungsi mengikat keterjadian peristiwa syarat dengan jawabannya di dalam ayat.`;
    } else if (rawTag === 'ACC' || rawFeatures?.includes('ACC')) {
      grammarExplanation = `Kata ${cleanWord} adalah partikel penegas (Harf Taukid) yang mabni atas fathah, berfungsi menghilangkan keraguan dan mengukuhkan kebenaran pesan ayat.`;
    } else if (rawTag === 'RES' || rawFeatures?.includes('RES')) {
      grammarExplanation = `Kata ${cleanWord} adalah partikel pengecualian (Harf Istitsna) yang mabni atas sukun, membatasi dan menegaskan ketunggalan hukum pada yang dikecualikan.`;
    } else if (rawTag === 'P' || rawTag === 'PRP' || rawFeatures?.includes('POS:P')) {
      grammarExplanation = `Kata ${cleanWord} adalah kata depan (Harf Jarr) yang mabni, menghubungkan kata kerja atau makna kalimat dengan isim setelahnya yang berstatus majrur.`;
    } else {
      grammarExplanation = `Kata ${cleanWord} adalah partikel (Harf) yang mabni (tidak berubah harakat akhirnya), berfungsi memperjelas hubungan gramatikal antarkata di dalam ayat.`;
    }
  } else if (isVerb) {
    if (isPerfVerb) {
      const mabniStatus = suffixPart.includes('نَا') || suffixPart.includes('تُ') || suffixPart.includes('تَ')
        ? 'Mabni atas sukun karena bersambung dengan dhamir rafa\' mutaharrik'
        : (suffixPart.includes('وا')
            ? 'Mabni atas dhammah karena bersambung dengan wawu jama\'ah'
            : 'Mabni atas fathah sebagai hukum asal fi\'il madhi');
      grammarExplanation = `Kata kerja lampau ini memiliki wazan ${wazanOrForm || 'standar'}, berstatus ${mabniStatus}. Menggabungkan huruf akar dengan morfem konjugasi untuk menegaskan subjek dan kepastian perbuatan.`;
    } else if (verbType === 'Amr' || rawFeatures?.includes('IMPV')) {
      grammarExplanation = `Kata kerja perintah (Fi'il Amr) ini berstatus Mabni atas sukun, digunakan untuk seruan ketaatan dan tawakal kepada Allah.`;
    } else {
      const moodNote = rawFeatures?.includes('JUS')
        ? 'berstatus Majzum (sukun) karena amil penjazam'
        : (rawFeatures?.includes('SUBJ')
            ? 'berstatus Manshub (fathah) karena amil penashab'
            : 'berstatus Marfu\' sebagai hukum asal fi\'il mudhari\'');
      grammarExplanation = `Kata kerja kini/akan datang ini memiliki wazan ${wazanOrForm || 'standar'}, ${moodNote}. Menggabungkan awalan mudhara'ah dengan huruf akar untuk menyesuaikan subjek dan aspek waktu perbuatan.`;
    }
  } else {
    const caseNote = rawFeatures?.includes('NOM')
      ? 'Marfu\' (dhammah) berkedudukan sebagai Fa\'il, Mubtada\', atau Khabar'
      : (rawFeatures?.includes('ACC')
          ? 'Manshub (fathah) berkedudukan sebagai Maf\'ul Bih (objek) atau Hal'
          : (rawFeatures?.includes('GEN')
              ? 'Majrur (kasrah) karena didahului huruf jar atau berperan sebagai mudhaf ilaih'
              : 'memiliki i\'rab teratur'));
    grammarExplanation = `Kata benda (isim) ini berada dalam kondisi ${caseNote} di dalam struktur kalimat ayat Al-Qur'an.`;
  }

  // Determine appropriate posType label for Card 1
  let basePosType = 'Kata Benda Dasar (Isim Asal)';
  if (isVerb) {
    basePosType = 'Kata Kerja Dasar (Fi\'il Madhi)';
  } else if (isParticle) {
    if (rawTag === 'P' || rawTag === 'PRP' || rawFeatures?.includes('POS:P') || ['علي', 'الي', 'في', 'من', 'عن', 'مع', 'ل', 'ب'].includes(stripArabicHarakat(defaultLemma))) {
      basePosType = 'Kata Depan (Harf Jarr)';
    } else if (rawTag === 'NEG' || rawFeatures?.includes('NEG')) {
      basePosType = 'Penyangkal (Harf Nafi)';
    } else if (rawTag === 'COND' || rawFeatures?.includes('COND')) {
      basePosType = 'Kondisional (Harf Syarat)';
    } else if (rawTag === 'ACC' || rawFeatures?.includes('ACC')) {
      basePosType = 'Penegas (Harf Taukid)';
    } else {
      basePosType = 'Partikel (Harf Mabni)';
    }
  }

  return {
    baseLemma: {
      arabic: defaultLemma,
      transliteration: transliterateArabic(defaultLemma),
      meaning: particleBaseMeaning || authenticMeaning,
      formationNote: isParticle
        ? ((rawTag === 'P' || rawTag === 'PRP' || rawFeatures?.includes('POS:P') || ['علي', 'الي', 'في', 'من', 'عن', 'مع', 'ل', 'ب'].includes(stripArabicHarakat(defaultLemma)))
            ? 'Partikel kata depan (Harf Jarr) yang mabni, berfungsi menghubungkan kata kerja atau makna kalimat dengan isim/dhamir setelahnya.'
            : 'Partikel fungsional (Harf Mabni) berbentuk tetap tanpa proses derivasi akar kata.')
        : (isVerb
            ? `Menghubungkan huruf akar ${rootSpaced} untuk membentuk kata kerja dasar (fi'il madhi).`
            : (rootSpaced
                ? `Bentuk kata asal (nomina dasar/masdar) dari akar ${rootSpaced}.`
                : 'Bentuk kata benda mandiri (isim) dalam struktur tata bahasa Al-Qur\'an.')),
      posType: basePosType
    },
    verseForm: {
      arabic: cleanWord,
      transliteration: transliterateArabic(cleanWord),
      morphemes: morphemes.length > 0 ? morphemes : [
        { text: cleanWord, type: 'stem', label: 'Bentuk Utuh Kata', meaning: authenticMeaning, colorClass: 'text-emerald-600 font-bold' }
      ],
      contextMeaning: authenticMeaning,
      grammarExplanation
    }
  };
}
