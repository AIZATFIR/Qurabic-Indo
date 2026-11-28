import { NextRequest, NextResponse } from 'next/server';
import { fetchVerseWords } from '@/lib/api/quran-corpus-api';
import { getSurahByNumber } from '@/lib/data/surah-list';

export async function GET(request: NextRequest) {
  const verse = request.nextUrl.searchParams.get('verse') || '';
  const match = /^(\d{1,3}):(\d{1,3})$/.exec(verse);
  const surah = match ? Number(match[1]) : 0;
  const ayah = match ? Number(match[2]) : 0;
  const surahMeta = getSurahByNumber(surah);
  if (!surahMeta || ayah < 1 || ayah > surahMeta.ayahsCount) {
    return NextResponse.json({ error: 'Provide a valid Quran verse.' }, { status: 400 });
  }

  try {
    const words = await fetchVerseWords(verse);
    if (words.length === 0) return NextResponse.json({ error: 'Verse word data is unavailable.' }, { status: 502 });
    const response = NextResponse.json({ words });
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
    return response;
  } catch {
    return NextResponse.json({ error: 'Verse word data is temporarily unavailable.' }, { status: 502 });
  }
}
