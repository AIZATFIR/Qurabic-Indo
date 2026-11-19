import { NextRequest, NextResponse } from 'next/server';
import { getQurabicDb } from '@/lib/db/client';
import { getSurahByNumber, SURAH_LIST } from '@/lib/data/surah-list';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface WBWJsonItem {
  location: string;
  arabic: string;
  transliteration?: string;
  meaningIndo?: string;
  audioUrl?: string;
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

    // Load WBW words from local JSON chunk
    const padSurah = String(surahNum).padStart(3, '0');
    const wbwFilePath = path.join(process.cwd(), `lib/data/wbw/surah_${padSurah}.json`);
    const verseKey = `${surahNum}:${ayahNum}`;

    let words: any[] = [];

    if (fs.existsSync(wbwFilePath)) {
      try {
        const fileContent = fs.readFileSync(wbwFilePath, 'utf-8');
        const surahWbwData = JSON.parse(fileContent);
        const wbwList: WBWJsonItem[] = surahWbwData[verseKey] || [];

        words = wbwList.map((item, idx) => {
          const locParts = (item.location || `${verseKey}:${idx + 1}`).split(':');
          const pos = parseInt(locParts[2] || `${idx + 1}`, 10);
          const arabic = item.arabic || '';
          const padAyah = String(ayahNum).padStart(3, '0');
          const padWord = String(pos).padStart(3, '0');
          const audioUrl = `https://audio.qurancdn.com/wbw/${padSurah}_${padAyah}_${padWord}.mp3`;

          return {
            id: idx + 1,
            position: pos,
            arabic,
            transliteration: item.transliteration || '',
            meaningIndo: item.meaningIndo || '',
            audioUrl,
            charType: 'word',
            location: item.location || `${verseKey}:${pos}`,
          };
        });
      } catch (e) {
        console.error('Error parsing local WBW JSON:', e);
      }
    }

    // Fallback to SQLite words if WBW JSON empty
    if (words.length === 0) {
      const wordsRes = await db.execute({
        sql: 'SELECT * FROM words WHERE surah = ? AND ayah = ? ORDER BY word_num ASC',
        args: [surahNum, ayahNum],
      });
      words = wordsRes.rows.map((row) => {
        const wordNum = Number(row.word_num);
        const padAyah = String(ayahNum).padStart(3, '0');
        const padWord = String(wordNum).padStart(3, '0');
        return {
          id: Number(row.id),
          position: wordNum,
          arabic: String(row.arabic || ''),
          transliteration: '',
          meaningIndo: String(row.translation || ''),
          audioUrl: `https://audio.qurancdn.com/wbw/${padSurah}_${padAyah}_${padWord}.mp3`,
          charType: 'word',
          location: `${verseKey}:${wordNum}`,
          rootLetters: row.root ? String(row.root) : undefined,
          posTag: row.pos ? String(row.pos) : undefined,
        };
      });
    }

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
