import { NextRequest, NextResponse } from 'next/server';
import { getArramoozForms } from '@/lib/lexicon/arramooz';

export const revalidate = 86_400;
const RESPONSE_LIMIT = 120;

export async function GET(request: NextRequest) {
  const rootId = request.nextUrl.searchParams.get('root')?.trim() || '';
  if (!/^[a-zA-Z'`~><&}{*$^\-]{1,20}$/.test(rootId)) {
    return NextResponse.json({ error: 'A valid root identifier is required.' }, { status: 400 });
  }

  const forms = getArramoozForms(rootId);
  const response = NextResponse.json({
    source: 'Arramooz Arabic Morphological Dictionary',
    total: forms.length,
    truncated: forms.length > RESPONSE_LIMIT,
    forms: forms.slice(0, RESPONSE_LIMIT),
  });
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=86400, stale-while-revalidate=43200');
  return response;
}
