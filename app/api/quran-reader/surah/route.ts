import { NextRequest, NextResponse } from 'next/server';
import { fetchSurahWithWBW } from '@/lib/api/quran-corpus-api';
import { getSurahByNumber } from '@/lib/data/surah-list';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const surah = Number(params.get('surah'));
  const language = params.get('language') === 'en' ? 'en' : 'id';
  if (!getSurahByNumber(surah)) return NextResponse.json({ error: 'Provide a valid surah.' }, { status: 400 });

  try {
    const ayahs = await fetchSurahWithWBW(surah, language);
    if (ayahs.length === 0) return NextResponse.json({ error: 'Surah data is unavailable.' }, { status: 502 });
    const response = NextResponse.json({ ayahs, language });
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
    return response;
  } catch {
    return NextResponse.json({ error: 'Surah data is temporarily unavailable.' }, { status: 502 });
  }
}
