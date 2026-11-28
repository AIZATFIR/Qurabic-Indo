import { NextRequest, NextResponse } from 'next/server';
import { getQurabicDb } from '@/lib/db/client';
import { getSurahByNumber, SURAH_LIST } from '@/lib/data/surah-list';
import { getQuranVerseWordTokens } from '@/lib/api/quran-word-glosses';
import { buckwalterToArabic } from '@/lib/morphology/buckwalter';
import { extractArabicRootLetters, findBestMatchingRoot, inferGrammarRole } from '@/lib/search/root-search';
import { cleanGlossToIndonesian } from '@/lib/search/word-dictionary';

export const dynamic = 'force-dynamic';

interface RandomWordRow {
  id: number;
  position: number;
  arabic: string;
  transliteration?: string;
  audioUrl: string;
  charType: 'word';
  location: string;
  rootLetters?: string;
  posTag?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const surahParam = searchParams.get('surah');
    const ayahParam = searchParams.get('ayah');

    const db = getQurabicDb();
    let surahNum: number;
    let ayahNum: number;
    let verseArabic: string = '';
    let verseIndo: string = '';

    if (surahParam && ayahParam) {
      surahNum = parseInt(surahParam, 10);
      ayahNum = parseInt(ayahParam, 10);
      const res = await db.execute({
        sql: 'SELECT * FROM ayahs WHERE surah = ? AND ayah = ? LIMIT 1',
        args: [surahNum, ayahNum],
      });
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Ayat tidak ditemukan' }, { status: 404 });
      }
      const row = res.rows[0];
      verseArabic = String(row.arabic_uthmani || '');
      verseIndo = String(row.translation_id || '');
    } else {
      // Pick random from SQLite
      const res = await db.execute({
        sql: 'SELECT * FROM ayahs ORDER BY RANDOM() LIMIT 1',
        args: [],
      });
      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Database kosong' }, { status: 500 });
      }
      const row = res.rows[0];
      surahNum = Number(row.surah);
      ayahNum = Number(row.ayah);
      verseArabic = String(row.arabic_uthmani || '');
      verseIndo = String(row.translation_id || '');
    }

    const surahMeta = getSurahByNumber(surahNum) || SURAH_LIST[0];
    const surahNameIndo = surahMeta.nameIndo || `Surah Ke-${surahNum}`;
    const surahNameArabic = surahMeta.nameArabic || '';

    // Keep Quran text and morphology from the local corpus; request word meanings by verse.
    const padSurah = String(surahNum).padStart(3, '0');
    const verseKey = `${surahNum}:${ayahNum}`;
    const wordsRes = await db.execute({
      sql: 'SELECT id, word_num, arabic FROM words WHERE surah = ? AND ayah = ? ORDER BY word_num ASC',
      args: [surahNum, ayahNum],
    });
    let rawWords: RandomWordRow[] = wordsRes.rows.map((row) => {
      const wordNum = Number(row.word_num);
      const sourceWord = String(row.arabic || '');
      const padAyah = String(ayahNum).padStart(3, '0');
      const padWord = String(wordNum).padStart(3, '0');
      return {
        id: Number(row.id),
        position: wordNum,
        arabic: /[\u0600-\u06FF]/.test(sourceWord) ? sourceWord : buckwalterToArabic(sourceWord),
        transliteration: '',
        audioUrl: `https://audio.qurancdn.com/wbw/${padSurah}_${padAyah}_${padWord}.mp3`,
        charType: 'word' as const,
        location: `${verseKey}:${wordNum}`,
        rootLetters: row.root ? String(row.root) : undefined,
        posTag: row.pos ? String(row.pos) : undefined,
      };
    });
    const [tokensIndo, tokensEnglish] = await Promise.all([
      getQuranVerseWordTokens(verseKey, 'id').catch(() => []),
      getQuranVerseWordTokens(verseKey, 'en').catch(() => []),
    ]);
    const meaningsIndo: Record<string, string> = {};
    const meaningsEnglish: Record<string, string> = {};
    const transliterations: Record<string, string> = {};
    const arabicWords: Record<string, string> = {};
    const baseTokens = tokensIndo.length ? tokensIndo : tokensEnglish;
    for (const token of tokensIndo) {
      meaningsIndo[token.location] = token.meaning;
      transliterations[token.location] = token.transliteration;
    }
    for (const token of tokensEnglish) {
      meaningsEnglish[token.location] = token.meaning;
      arabicWords[token.location] = token.arabic;
      if (!transliterations[token.location]) transliterations[token.location] = token.transliteration;
    }
    for (const token of tokensIndo) arabicWords[token.location] = token.arabic || arabicWords[token.location] || '';
    if (rawWords.length === 0) {
      rawWords = baseTokens.map((token, index) => ({
        id: index + 1,
        position: Number(token.location.split(':')[2]) || index + 1,
        arabic: token.arabic,
        transliteration: token.transliteration,
        audioUrl: `https://audio.qurancdn.com/wbw/${String(surahNum).padStart(3, '0')}_${String(ayahNum).padStart(3, '0')}_${String(Number(token.location.split(':')[2]) || index + 1).padStart(3, '0')}.mp3`,
        charType: 'word' as const,
        location: token.location,
      }));
    } else {
      rawWords = rawWords.map((word) => ({
        ...word,
        arabic: arabicWords[word.location] || word.arabic,
        transliteration: transliterations[word.location] || word.transliteration,
      }));
    }
    const words = rawWords.map((word) => {
      const meaningIndo = cleanGlossToIndonesian(meaningsIndo[word.location] || '');
      const matchedRoot = findBestMatchingRoot(word.arabic);
      const grammar = inferGrammarRole(word.arabic);
      return {
        ...word,
        meaningIndo,
        meaningEnglish: meaningsEnglish[word.location] || '',
        rootLetters: matchedRoot?.rootArabic || extractArabicRootLetters(word.arabic),
        rootSlug: matchedRoot?.id,
        posTag: grammar.posCategory,
        posDetail: grammar.posDetail,
      };
    });

    return NextResponse.json({
      surahNumber: surahNum,
      surahNameIndo,
      surahNameArabic,
      ayahNumber: ayahNum,
      verseArabic: verseArabic.replace(/^\ufeff/, ''),
      verseIndo,
      words,
    });
  } catch (error: any) {
    console.error('Error in /api/ayah-random:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
