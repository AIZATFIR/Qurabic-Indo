import { NextRequest, NextResponse } from 'next/server';
import { getTajAlArusDatabase } from '@/lib/lexicon/taj-al-arus-database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 40;
const MAX_OFFSET = 100_000;

function rootKey(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[\sـ]+/g, '').trim();
}

function normalizedRoot(value: string): string {
  return rootKey(value).replace(/[أإآٱ]/g, 'ا').replace(/[ؤئ]/g, 'ء').replace(/ى/g, 'ي');
}

function normalizedCandidates(value: string): string[] {
  const root = normalizedRoot(value);
  return [...new Set([root, root.replace(/ء/g, 'ا'), root.replace(/ا/g, 'ء')])];
}

function isArabicRoot(value: string): boolean {
  return /^[\p{Script=Arabic}\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]+$/u.test(value);
}

export async function GET(request: NextRequest) {
  const rawRoot = request.nextUrl.searchParams.get('root')?.trim() || '';
  const queryRoot = rootKey(rawRoot);
  const rawOffset = request.nextUrl.searchParams.get('offset') || '0';
  const offset = Number(rawOffset);

  if (queryRoot.length < 2 || queryRoot.length > 8 || !isArabicRoot(rawRoot)) {
    return NextResponse.json({ error: 'Provide an Arabic root.' }, { status: 400 });
  }
  if (!/^\d+$/.test(rawOffset) || !Number.isSafeInteger(offset) || offset < 0 || offset > MAX_OFFSET) {
    return NextResponse.json({ error: 'Invalid result offset.' }, { status: 400 });
  }

  try {
    const db = getTajAlArusDatabase();
    const exact = await db.execute({
      sql: 'SELECT DISTINCT root FROM forms WHERE root_key = ? ORDER BY root LIMIT 2',
      args: [queryRoot],
    });
    let sourceRoot = exact.rows.length === 1 && typeof exact.rows[0].root === 'string'
      ? exact.rows[0].root
      : null;
    let matchType: 'exact' | 'normalized' | null = sourceRoot ? 'exact' : null;
    let ambiguous = exact.rows.length > 1;

    if (!sourceRoot && !ambiguous) {
      const candidates = normalizedCandidates(rawRoot);
      const normalized = await db.execute({
        sql: `SELECT DISTINCT root FROM forms WHERE root_norm IN (${candidates.map(() => '?').join(',')}) ORDER BY root LIMIT 2`,
        args: candidates,
      });
      if (normalized.rows.length === 1 && typeof normalized.rows[0].root === 'string') {
        sourceRoot = normalized.rows[0].root;
        matchType = 'normalized';
      } else {
        ambiguous = normalized.rows.length > 1;
      }
    }

    if (!sourceRoot) {
      const response = NextResponse.json({ sourceRoot: null, matchType: null, ambiguous, total: 0, offset, hasMore: false, forms: [] });
      response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
      return response;
    }

    const [countResult, formResult] = await Promise.all([
      db.execute({ sql: 'SELECT count(*) AS count FROM forms WHERE root = ?', args: [sourceRoot] }),
      db.execute({
        sql: 'SELECT source_id, word, unvowelword, nonormstem FROM forms WHERE root = ? ORDER BY source_id LIMIT ? OFFSET ?',
        args: [sourceRoot, PAGE_SIZE, offset],
      }),
    ]);
    const total = Number(countResult.rows[0]?.count || 0);
    const forms = formResult.rows.map((row) => ({
      sourceId: Number(row.source_id),
      word: String(row.word || ''),
      unvowelword: String(row.unvowelword || ''),
      stem: String(row.nonormstem || ''),
    }));
    const response = NextResponse.json({
      source: 'Arabic Roots and Derivatives · Tāj al-ʿArūs',
      sourceRoot,
      matchType,
      ambiguous: false,
      total,
      offset,
      hasMore: offset + forms.length < total,
      forms,
    });
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
    return response;
  } catch {
    return NextResponse.json({ error: 'The root form index is temporarily unavailable.' }, { status: 503 });
  }
}
