import { NextRequest, NextResponse } from 'next/server';
import { getQuranWordGlosses, type QuranWordGlossLanguage } from '@/lib/api/quran-word-glosses';
import { MAX_QURAN_WORD_GLOSS_LOCATIONS } from '@/lib/api/quran-word-gloss-limits';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const language = request.nextUrl.searchParams.get('language') === 'en' ? 'en' : 'id';
  const locations = (request.nextUrl.searchParams.get('locations') || '').split(',').filter(Boolean);
  if (locations.length < 1 || locations.length > MAX_QURAN_WORD_GLOSS_LOCATIONS || locations.some((value) => !/^\d{1,3}:\d{1,3}:\d{1,3}$/.test(value))) {
    return NextResponse.json({ error: `Provide 1 to ${MAX_QURAN_WORD_GLOSS_LOCATIONS} valid Quran word locations.` }, { status: 400 });
  }

  try {
    const { meanings, sources } = await getQuranWordGlosses(locations, language as QuranWordGlossLanguage);
    const response = NextResponse.json({ meanings, sources, language });
    const complete = Object.keys(meanings).length === new Set(locations).size;
    response.headers.set('Cache-Control', complete
      ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200'
      : 'public, max-age=60, s-maxage=300, stale-while-revalidate=120');
    return response;
  } catch {
    return NextResponse.json({ error: 'Word meanings are temporarily unavailable.' }, { status: 502 });
  }
}
