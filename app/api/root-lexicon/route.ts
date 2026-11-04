import { NextRequest, NextResponse } from 'next/server';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { getLaneRootRecord } from '@/lib/lexicon/lane-loader';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rootId = request.nextUrl.searchParams.get('root')?.trim() || '';
  if (!/^[a-zA-Z'`~><&}{*$^\-]{1,20}$/.test(rootId)) {
    return NextResponse.json({ error: 'A valid root identifier is required.' }, { status: 400 });
  }

  const root = ROOT_DATABASE.find((item) => item.id.toLowerCase() === rootId.toLowerCase());
  if (!root) return NextResponse.json({ error: 'Root not found.' }, { status: 404 });

  const lexicon = getLaneRootRecord(root.id.replace(/-/g, ''));
  if (!lexicon?.entries?.length) {
    return NextResponse.json({ error: 'No indexed Lane entry for this root.' }, { status: 404 });
  }

  const response = NextResponse.json({ lexicon });
  response.headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
  return response;
}
