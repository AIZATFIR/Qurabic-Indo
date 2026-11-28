import { NextRequest, NextResponse } from 'next/server';
import { getTajAlArusDatabase } from '@/lib/lexicon/taj-al-arus-database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_RESULTS = 12;
const MAX_OFFSET = 100_000;

function key(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[\u0640\s]/g, '');
}

function candidates(value: string): string[] {
  const canonical = key(value).replace(/[أإآٱ]/g, 'ا').replace(/[ؤئ]/g, 'ء').replace(/ى/g, 'ي');
  return [...new Set([canonical, canonical.replace(/ء/g, 'ا'), canonical.replace(/ا/g, 'ء')])];
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  const rawOffset = request.nextUrl.searchParams.get('offset') || '0';
  const offset = Number(rawOffset);
  if (!query || query.length > 48 || !/^[\p{Script=Arabic}\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]+$/u.test(query)) {
    return NextResponse.json({ error: 'Provide an Arabic word or root.' }, { status: 400 });
  }
  if (!/^\d+$/.test(rawOffset) || !Number.isSafeInteger(offset) || offset > MAX_OFFSET) {
    return NextResponse.json({ error: 'Invalid result offset.' }, { status: 400 });
  }

  const formKeys = candidates(query);
  const exactRootKey = key(query);
  const rootKeys = [...new Set([exactRootKey, ...formKeys])];
  const rootPlaceholders = rootKeys.map(() => '?').join(',');
  const formPlaceholders = formKeys.map(() => '?').join(',');

  try {
    const db = getTajAlArusDatabase();
    const matchingRoots = `SELECT source_forms.root,
                   (SELECT count(*) FROM forms AS all_forms WHERE all_forms.root = source_forms.root) AS total_forms,
                   sum(CASE WHEN source_forms.root_key = ? THEN 1 ELSE 0 END) AS exact_root_matches,
                   sum(CASE WHEN source_forms.root_norm IN (${formPlaceholders}) THEN 1 ELSE 0 END) AS normalized_root_matches,
                   sum(CASE WHEN source_forms.unvowelword IN (${formPlaceholders}) THEN 1 ELSE 0 END) AS word_matches
            FROM forms AS source_forms
            WHERE source_forms.root_key IN (${rootPlaceholders})
               OR source_forms.root_norm IN (${formPlaceholders})
               OR source_forms.unvowelword IN (${formPlaceholders})
            GROUP BY source_forms.root`;
    const args = [exactRootKey, ...formKeys, ...formKeys, ...rootKeys, ...formKeys, ...formKeys];
    const [countResult, rows] = await Promise.all([
      db.execute({ sql: `SELECT count(*) AS count FROM (${matchingRoots})`, args }),
      db.execute({
        sql: `${matchingRoots} ORDER BY source_forms.root LIMIT ? OFFSET ?`,
        args: [...args, MAX_RESULTS, offset],
      }),
    ]);
    const total = Number(countResult.rows[0]?.count || 0);
    const results = rows.rows.map((row) => ({
      root: String(row.root || ''),
      totalForms: Number(row.total_forms || 0),
      matchType: Number(row.exact_root_matches || 0) > 0
        ? 'exact-root'
        : Number(row.normalized_root_matches || 0) > 0
          ? 'normalized-root'
          : 'word-form',
      wordMatches: Number(row.word_matches || 0),
    }));
    const hasMore = offset + results.length < total;
    const response = NextResponse.json({
      results,
      total,
      offset,
      hasMore,
      nextOffset: offset + results.length,
      truncated: hasMore,
    });
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
    return response;
  } catch {
    return NextResponse.json({ error: 'The root form index is temporarily unavailable.' }, { status: 503 });
  }
}
