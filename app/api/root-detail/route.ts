import { NextRequest, NextResponse } from 'next/server';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { getQACRecordsByRoot } from '@/lib/morphology/qac-parser';
import { getCanonicalRootDetail } from '@/lib/morphology/canonical-service';
import { buckwalterToArabic } from '@/lib/morphology/buckwalter';
import { getQabasLemmaId } from '@/lib/lexicon/qabas-lemma-lookup';

export const revalidate = 86_400;

export async function GET(request: NextRequest) {
  const rootId = request.nextUrl.searchParams.get('root')?.trim() || '';
  if (!/^[a-zA-Z'`~><&}{*$^\-]{1,20}$/.test(rootId)) {
    return NextResponse.json({ error: 'A valid root identifier is required.' }, { status: 400 });
  }

  const matchedRoot = ROOT_DATABASE.find((item) => item.id.toLowerCase() === rootId.toLowerCase());
  if (!matchedRoot) return NextResponse.json({ error: 'Root not found.' }, { status: 404 });

  const root = getCanonicalRootDetail(matchedRoot.id, { includeOccurrences: false });
  if (!root) return NextResponse.json({ error: 'Root data is not available.' }, { status: 404 });

  const records = getQACRecordsByRoot(matchedRoot.id.replace(/-/g, ''));
  const lemmaSamples: Record<string, {
    coordinate: string;
    formArabic: string;
    verbForm?: string;
    meaningIndo?: string;
    meaningEnglish?: string;
    qabasLemmaId?: string;
  }> = {};

  for (const record of records) {
    if (!record.lemma) continue;
    const key = `${record.pos}:${record.lemma}`;
    if (lemmaSamples[key]) continue;
    const qabasLemmaId = getQabasLemmaId(record.wordLocationKey);
    lemmaSamples[key] = {
      coordinate: record.wordLocationKey,
      formArabic: record.formArabic || buckwalterToArabic(record.lemma),
      ...(record.verbForm ? { verbForm: record.verbForm } : {}),
      ...(qabasLemmaId ? { qabasLemmaId } : {}),
    };
  }

  const response = NextResponse.json({ root, lemmaSamples });
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=86400, stale-while-revalidate=43200');
  return response;
}
