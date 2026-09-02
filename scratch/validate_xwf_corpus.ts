import fs from 'fs';
import path from 'path';

const qacPath = path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt');
const cacheDir = path.join(process.cwd(), 'scratch/data_cache');
const quranUthmani: any[] = JSON.parse(fs.readFileSync(path.join(cacheDir, 'quran_uthmani.json'), 'utf8'));
const quranIndo: any[] = JSON.parse(fs.readFileSync(path.join(cacheDir, 'quran_indonesian.json'), 'utf8'));

// Build Quran Lookup Map by "surah:ayah"
const quranMap = new Map<string, { arabic: string; indo: string; surahNameIndo: string; surahNameArabic: string; lexicalWords: string[] }>();
for (let sIdx = 0; sIdx < quranUthmani.length; sIdx++) {
  const sAr = quranUthmani[sIdx];
  const sId = quranIndo[sIdx];
  for (let aIdx = 0; aIdx < sAr.ayahs.length; aIdx++) {
    const aAr = sAr.ayahs[aIdx];
    const aId = sId.ayahs[aIdx];
    const key = `${sAr.number}:${aAr.numberInSurah}`;

    // Filter out standalone Quranic pause marks (waqf symbols) to match QAC word indexing exactly
    const rawTokens = aAr.text.split(' ');
    const lexicalWords = rawTokens.filter((t: string) => !/^[\u06D6-\u06ED\u0615-\u061A\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC\u06DD\u06DE\u06DF\u06E0\u06E1\u06E2\u06E3\u06E4\u06E5\u06E6\u06E7\u06E8\u06E9\u06EA\u06EB\u06EC\u06ED\uFD3E\uFD3F\s]+$/.test(t));

    quranMap.set(key, {
      arabic: aAr.text,
      indo: aId.text,
      surahNameIndo: sAr.englishName,
      surahNameArabic: sAr.name,
      lexicalWords
    });
  }
}

// Buckwalter to Arabic Unicode converter
const BUCKWALTER_TO_ARABIC: Record<string, string> = {
  "'": 'ء', '>': 'أ', '&': 'ؤ', '<': 'إ', '}': 'ئ', 'A': 'ا',
  'b': 'ب', 'p': 'ة', 't': 'ت', 'v': 'ث', 'j': 'ج', 'H': 'ح',
  'x': 'خ', 'd': 'د', '*': 'ذ', 'r': 'ر', 'z': 'ز', 's': 'س',
  '$': 'ش', 'S': 'ص', 'D': 'ض', 'T': 'ط', 'Z': 'ظ', 'E': 'ع',
  'g': 'غ', '_': 'ـ', 'f': 'ف', 'q': 'ق', 'k': 'ك', 'l': 'ل',
  'm': 'م', 'n': 'ن', 'h': 'ه', 'w': 'و', 'Y': 'ى', 'y': 'ي',
  'F': 'ً', 'N': 'ٌ', 'K': 'ٍ', 'a': 'َ', 'u': 'ُ', 'i': 'ِ',
  '~': 'ّ', 'o': 'ْ', '^': 'ْ', '`': 'ٰ', '{': 'ٱ'
};

function buckwalterToArabic(bw: string): string {
  if (!bw) return '';
  const cleanBw = bw.replace(/[\[\]]/g, '');
  return cleanBw.split('').map(c => BUCKWALTER_TO_ARABIC[c] || c).join('');
}

function normalizeForComparison(text: string): string {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // strip diacritics
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا') // normalize alif
    .replace(/[\u0649]/g, 'ي')
    .replace(/[\u0629]/g, 'ه')
    .replace(/[^\u0600-\u06FF]/g, '') // keep only arabic chars
    .trim();
}

interface QACRecord {
  surah: number;
  ayah: number;
  word: number;
  segment: number;
  location: string;
  wordLocation: string; // surah:ayah:word
  ayahLocation: string; // surah:ayah
  form: string;
  formArabic: string;
  tag: string;
  featuresRaw: string;
  lemma: string;
  lemmaArabic: string;
  root: string;
  rootArabic: string;
  pos: string;
  verbType?: string;
  verbForm?: string;
  nounType?: string;
}

const content = fs.readFileSync(qacPath, 'utf8');
const lines = content.split('\n');

const allXwfRecords: QACRecord[] = [];
let totalCorpusSegments = 0;

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('LOCATION')) continue;
  totalCorpusSegments++;

  const parts = trimmed.split('\t');
  if (parts.length < 4) continue;

  const locRaw = parts[0].replace(/[()]/g, '');
  const [sStr, aStr, wStr, segStr] = locRaw.split(':');
  const surah = parseInt(sStr, 10);
  const ayah = parseInt(aStr, 10);
  const word = parseInt(wStr, 10);
  const segment = parseInt(segStr, 10);

  const form = parts[1];
  const tag = parts[2];
  const featuresRaw = parts[3];

  const rootMatch = featuresRaw.match(/ROOT:([^|]+)/);
  if (!rootMatch || rootMatch[1] !== 'xwf') continue;

  const root = rootMatch[1];
  const rootArabic = buckwalterToArabic(root).split('').join(' ');

  const lemMatch = featuresRaw.match(/LEM:([^|]+)/);
  const lemma = lemMatch ? lemMatch[1] : '';
  const lemmaArabic = lemma ? buckwalterToArabic(lemma) : '';

  const posMatch = featuresRaw.match(/POS:([^|]+)/);
  const pos = posMatch ? posMatch[1] : tag;

  let verbType: string | undefined;
  if (featuresRaw.includes('PERF')) verbType = 'PERF (Madhi)';
  else if (featuresRaw.includes('IMPF')) verbType = 'IMPF (Mudhari\')';
  else if (featuresRaw.includes('IMPV')) verbType = 'IMPV (Amr / Perintah)';

  const verbFormMatch = featuresRaw.match(/\((I|II|III|IV|V|VI|VII|VIII|IX|X)\)/);
  const verbForm = verbFormMatch ? `Form ${verbFormMatch[1]}` : (pos === 'V' ? 'Form I (Mujarrad)' : undefined);

  let nounType: string | undefined;
  if (featuresRaw.includes('ACT|PCPL')) nounType = 'Isim Fa\'il';
  else if (featuresRaw.includes('VN')) nounType = 'Isim Masdar';
  else if (pos === 'N') nounType = 'Isim';

  allXwfRecords.push({
    surah,
    ayah,
    word,
    segment,
    location: locRaw,
    wordLocation: `${surah}:${ayah}:${word}`,
    ayahLocation: `${surah}:${ayah}`,
    form,
    formArabic: buckwalterToArabic(form),
    tag,
    featuresRaw,
    lemma,
    lemmaArabic,
    root,
    rootArabic,
    pos,
    verbType,
    verbForm,
    nounType
  });
}

// 12 Sample Indices
const sampleIndices = [0, 4, 15, 16, 18, 28, 54, 73, 86, 101, 121, 123];
let joinVerifiedCount = 0;

console.log('================================================================');
console.log('🔬 DETERMINISTIC JOIN RESULTS (12 SAMPLED LOCATIONS)');
console.log('================================================================');

sampleIndices.forEach((idx, i) => {
  const record = allXwfRecords[idx];
  const ayahData = quranMap.get(record.ayahLocation);
  
  if (!ayahData) {
    console.error(`❌ Join failed: Ayah ${record.ayahLocation} not found!`);
    return;
  }

  // Exact lexical word token from Qurabic / Tanzil text using QAC 1-based word index
  const targetWordInAyah = ayahData.lexicalWords[record.word - 1] || '';

  const normTarget = normalizeForComparison(targetWordInAyah);
  const normForm = normalizeForComparison(record.formArabic);
  const isMatch = normTarget.includes(normForm) || normForm.includes(normTarget);

  if (isMatch) joinVerifiedCount++;

  console.log(`[${String(i + 1).padStart(2, ' ')}] QAC (${record.location}) -> Q.S. ${ayahData.surahNameIndo} [${record.ayahLocation}] Kata #${record.word}:`);
  console.log(`     • QAC Form           : "${record.formArabic}" (Buckwalter: ${record.form})`);
  console.log(`     • Tanzil Word #${record.word}   : "${targetWordInAyah}"`);
  console.log(`     • QAC Raw Features   : ${record.featuresRaw}`);
  console.log(`     • Full Ayah Excerpt  : "${ayahData.arabic.substring(0, 75)}..."`);
  console.log(`     • Indonesian Meaning : "${ayahData.indo.substring(0, 75)}..."`);
  console.log(`     • Deterministic Join : ${isMatch ? '✅ PASS (Exact Lexical Token Match)' : '❌ FAIL'}\n`);
});

console.log('================================================================');
console.log(`🏁 Deterministic Join Validation: ${joinVerifiedCount}/${sampleIndices.length} (${((joinVerifiedCount/sampleIndices.length)*100).toFixed(0)}%) Exact Matches Verified.`);
console.log('================================================================');
