import { NextRequest, NextResponse } from 'next/server';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { getQACAuthoritativeIndex } from '@/lib/morphology/qac-parser';
import { getCanonicalRootDetail } from '@/lib/morphology/canonical-service';
import { buckwalterToArabic } from '@/lib/morphology/buckwalter';
import wbwIndonesian from '@/lib/data/wbw-indonesian-glosses.json';
import wbwEnglish from '@/lib/data/wbw-english-glosses.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rootId = request.nextUrl.searchParams.get('root')?.trim() || '';
  if (!/^[a-zA-Z'`~><&}{*$^\-]{1,20}$/.test(rootId)) {
    return NextResponse.json({ error: 'A valid root identifier is required.' }, { status: 400 });
  }

  const matchedRoot = ROOT_DATABASE.find((item) => item.id.toLowerCase() === rootId.toLowerCase());
  if (!matchedRoot) return NextResponse.json({ error: 'Root not found.' }, { status: 404 });

  const root = getCanonicalRootDetail(matchedRoot.id);
  if (!root) return NextResponse.json({ error: 'Root data is not available.' }, { status: 404 });

  const meaningsIndo = wbwIndonesian.meanings as Record<string, string>;
  const meaningsEnglish = wbwEnglish.meanings as Record<string, string>;
  const records = getQACAuthoritativeIndex().recordsByRoot.get(matchedRoot.id.replace(/-/g, '')) || [];
  const lemmaSamples: Record<string, {
    coordinate: string;
    formArabic: string;
    verbForm?: string;
    meaningIndo?: string;
    meaningEnglish?: string;
  }> = {};

  for (const record of records) {
    if (!record.lemma) continue;
    const key = `${record.pos}:${record.lemma}`;
    if (lemmaSamples[key]) continue;
    lemmaSamples[key] = {
      coordinate: record.wordLocationKey,
      formArabic: record.formArabic || buckwalterToArabic(record.lemma),
      ...(record.verbForm ? { verbForm: record.verbForm } : {}),
      ...(meaningsIndo[record.wordLocationKey] ? { meaningIndo: meaningsIndo[record.wordLocationKey] } : {}),
      ...(meaningsEnglish[record.wordLocationKey] ? { meaningEnglish: meaningsEnglish[record.wordLocationKey] } : {}),
    };
  }

  if (!root.occurrences.length) {
    const verses = new Map<string, typeof root.occurrences[number]>();
    for (const record of records) {
      if (verses.has(record.ayahLocationKey)) continue;
      verses.set(record.ayahLocationKey, {
        surahNumber: record.surah,
        ayahNumber: record.ayah,
        surahNameIndo: '',
        surahNameArabic: '',
        verseArabic: '',
        verseIndo: '',
        matchedWordArabic: record.formArabic,
        matchedWordIndo: meaningsIndo[record.wordLocationKey] || '',
        wordLocation: record.wordLocationKey,
      });
    }
    root.occurrences = [...verses.values()];
  }

  const response = NextResponse.json({ root, lemmaSamples });
  response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  return response;
}
