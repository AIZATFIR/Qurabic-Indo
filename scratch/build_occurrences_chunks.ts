import fs from 'fs';
import path from 'path';
import { getQACAuthoritativeIndex } from '../lib/morphology/qac-parser';
import { buckwalterToArabic } from '../lib/morphology/buckwalter';
import { VerseOccurrence } from '../lib/types/morphology';
import { NormalizedMorphologyRecord } from '../lib/morphology/types';
import { SURAH_LIST } from '../lib/data/surah-list';

console.log('⚡ GENERATING OCCURRENCE CHUNKS WITH OFFICIAL INDONESIAN SURAH NAMES (1,642 ROOTS)...\n');

const cacheDir = path.join(process.cwd(), 'scratch/data_cache');
const uthmaniPath = path.join(cacheDir, 'quran_uthmani.json');
const indoPath = path.join(cacheDir, 'quran_indonesian.json');

const quranUthmani = JSON.parse(fs.readFileSync(uthmaniPath, 'utf8'));
const quranIndo = JSON.parse(fs.readFileSync(indoPath, 'utf8'));

interface QuranAyahData {
  surahNumber: number;
  ayahNumber: number;
  surahNameIndo: string;
  surahNameArabic: string;
  textArabic: string;
  textIndo: string;
  lexicalWords: string[];
}

const quranMap = new Map<string, QuranAyahData>();

for (let sIdx = 0; sIdx < quranUthmani.length; sIdx++) {
  const sAr = quranUthmani[sIdx];
  const sId = quranIndo[sIdx];
  const surahMeta = SURAH_LIST[sAr.number - 1];
  const surahNameIndo = surahMeta?.nameIndo || sAr.englishName;
  const surahNameArabic = surahMeta?.nameArabic || sAr.name;

  for (let aIdx = 0; aIdx < sAr.ayahs.length; aIdx++) {
    const aAr = sAr.ayahs[aIdx];
    const aId = sId.ayahs[aIdx];
    const key = `${sAr.number}:${aAr.numberInSurah}`;

    const rawTokens = aAr.text.split(' ');
    const lexicalWords = rawTokens.filter(
      (t: string) =>
        !/^[\u06D6-\u06ED\u0615-\u061A\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC\u06DD\u06DE\u06DF\u06E0\u06E1\u06E2\u06E3\u06E4\u06E5\u06E6\u06E7\u06E8\u06E9\u06EA\u06EB\u06EC\u06ED\uFD3E\uFD3F\s]+$/.test(
          t
        )
    );

    quranMap.set(key, {
      surahNumber: sAr.number,
      ayahNumber: aAr.numberInSurah,
      surahNameIndo,
      surahNameArabic,
      textArabic: aAr.text,
      textIndo: aId.text,
      lexicalWords
    });
  }
}

// Load authoritative QAC index
const index = getQACAuthoritativeIndex();
const allRootsBw = Array.from(index.recordsByRoot.keys());

const occurrencesDir = path.join(process.cwd(), 'lib/data/occurrences');
if (!fs.existsSync(occurrencesDir)) {
  fs.mkdirSync(occurrencesDir, { recursive: true });
}

allRootsBw.forEach((rootBw) => {
  const segments = index.recordsByRoot.get(rootBw) || [];
  const rootArabicJoined = buckwalterToArabic(rootBw);
  const slugId = rootBw.split('').join('-');

  // Group by unique ayah for occurrence list
  const uniqueAyahsMap = new Map<string, NormalizedMorphologyRecord[]>();

  segments.forEach(seg => {
    if (!uniqueAyahsMap.has(seg.ayahLocationKey)) {
      uniqueAyahsMap.set(seg.ayahLocationKey, []);
    }
    uniqueAyahsMap.get(seg.ayahLocationKey)!.push(seg);
  });

  // Deterministic coordinate join to Quran text
  const occurrences: VerseOccurrence[] = [];
  uniqueAyahsMap.forEach((segList, ayahKey) => {
    const ayahData = quranMap.get(ayahKey);
    if (!ayahData) return;

    const primarySeg = segList[0];
    const targetWord = ayahData.lexicalWords[primarySeg.word - 1] || primarySeg.formArabic;

    occurrences.push({
      surahNumber: ayahData.surahNumber,
      ayahNumber: ayahData.ayahNumber,
      surahNameIndo: ayahData.surahNameIndo,
      surahNameArabic: ayahData.surahNameArabic,
      verseArabic: ayahData.textArabic,
      verseIndo: ayahData.textIndo,
      matchedWordArabic: targetWord,
      matchedWordIndo: `Konteks akar ${rootArabicJoined}`,
      wordLocation: primarySeg.wordLocationKey
    });
  });

  const filePath = path.join(occurrencesDir, `${slugId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(occurrences), 'utf8');
});

console.log(`✅ Refreshed 1,642 occurrence chunks with official Indonesian surah names!`);
