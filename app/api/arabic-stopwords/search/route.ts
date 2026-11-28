import { NextRequest, NextResponse } from 'next/server';
import { getArabicStopwordsDatabase } from '@/lib/lexicon/arabic-stopwords-database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const GROUP_LIMIT = 6;
const FORM_PAGE_SIZE = 60;
const ARABIC_MARKS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

function normalize(value: string): string {
  return value.normalize('NFKC').replace(ARABIC_MARKS, '').replace(/\s+/g, '').trim();
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  const requestedLemma = request.nextUrl.searchParams.get('lemma')?.trim() || '';
  const offsetParam = Number(request.nextUrl.searchParams.get('offset') || 0);
  const offset = Number.isSafeInteger(offsetParam) && offsetParam >= 0 ? Math.min(offsetParam, 100_000) : 0;
  const term = normalize(query);
  if (!term || term.length > 48 || !/^[\p{Script=Arabic}]+$/u.test(term)) {
    return NextResponse.json({ groups: [] });
  }

  try {
    const db = getArabicStopwordsDatabase();
    const lemmaRows = requestedLemma
      ? await db.execute({
          sql: 'SELECT DISTINCT original FROM forms WHERE normalized_word = ? AND original = ? AND type = ? LIMIT 1',
          args: [term, requestedLemma, 'حرف'],
        })
      : await db.execute({
          sql: 'SELECT DISTINCT original FROM forms WHERE normalized_word = ? AND type = ? ORDER BY original LIMIT ' + GROUP_LIMIT,
          args: [term, 'حرف'],
        });
    const lemmas = lemmaRows.rows.flatMap((row) => typeof row.original === 'string' && row.original ? [row.original] : []);
    const groups = await Promise.all(lemmas.map(async (lemma) => {
      const [countResult, formResult] = await Promise.all([
        db.execute({ sql: 'SELECT count(*) AS count FROM forms WHERE original = ? AND type = ?', args: [lemma, 'حرف'] }),
        db.execute({
          sql: 'SELECT word, vocalized, category, original, procletic, stem, encletic, tags FROM forms WHERE original = ? AND type = ? ORDER BY category, word, vocalized, rowid LIMIT ? OFFSET ?',
          args: [lemma, 'حرف', FORM_PAGE_SIZE, offset],
        }),
      ]);
      const total = Number(countResult.rows[0]?.count || 0);
      const forms = formResult.rows;
      const hasMore = offset + forms.length < total;
      return {
        lemma,
        total,
        offset,
        hasMore,
        truncated: hasMore,
        forms: forms.map((row) => ({
          word: String(row.word || ''),
          vocalized: String(row.vocalized || ''),
          category: String(row.category || ''),
          procletic: String(row.procletic || ''),
          stem: String(row.stem || ''),
          encletic: String(row.encletic || ''),
          tags: String(row.tags || ''),
        })),
      };
    }));

    return NextResponse.json({ source: 'Arabic Stop Words 0.9', groups }, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=43200' },
    });
  } catch {
    return NextResponse.json({ error: 'Arabic stopword analysis is unavailable.' }, { status: 503 });
  }
}
