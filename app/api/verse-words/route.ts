import { NextRequest, NextResponse } from 'next/server';
import { getQuranVerseWordTokens, type QuranWordGlossLanguage } from '@/lib/api/quran-word-glosses';
import { getSurahByNumber } from '@/lib/data/surah-list';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const surah = Number(params.get('surah'));
  const ayah = Number(params.get('ayah'));
  const language: QuranWordGlossLanguage = params.get('language') === 'en' ? 'en' : 'id';
  const surahMeta = getSurahByNumber(surah);
  if (!surahMeta || !Number.isInteger(ayah) || ayah < 1 || ayah > surahMeta.ayahsCount) {
    return NextResponse.json({ error: 'Provide a valid Quran verse.' }, { status: 400 });
  }

  try {
    const tokens = await getQuranVerseWordTokens(`${surah}:${ayah}`, language);
    if (tokens.length === 0) return NextResponse.json({ error: 'Word data is unavailable.' }, { status: 502 });
    const response = NextResponse.json({ tokens, language, source: 'Quran.com Word-by-Word · API v4' });
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
    return response;
  } catch {
    return NextResponse.json({ error: 'Word meanings are temporarily unavailable.' }, { status: 502 });
  }
}
