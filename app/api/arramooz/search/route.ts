import { NextRequest, NextResponse } from 'next/server';
import { getArramoozDatabase } from '@/lib/lexicon/arramooz-database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const ROOT_LIMIT = 8;
const FORM_LIMIT = 300;
const ROOT_PAGE_SIZE = 60;
const ARABIC_MARKS = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g;

function normalize(value: string): string {
  return value.replace(ARABIC_MARKS, '').replace(/\s+/g, '').trim();
}

function rootVariants(value: string): string[] {
  const clean = normalize(value);
  return [...new Set([
    clean,
    clean.replace(/[أإآٱ]/g, 'ء'),
    clean.replace(/[أإآٱ]/g, 'ا'),
    clean.replace(/ء/g, 'ا'),
  ].filter(Boolean))];
}

function definition(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.trim().replace(/^"+|"+$/g, '').trim();
  return !cleaned || cleaned === ':لا شرح' || cleaned === 'لا شرح' ? undefined : cleaned;
}

async function findRoots(query: string, exactRoot: boolean, offset: number) {
  const db = getArramoozDatabase();
  const candidates = rootVariants(query);
  if (exactRoot) {
    const rows = await db.execute({
      sql: `SELECT root FROM nouns WHERE root IN (${candidates.map(() => '?').join(',')})
            UNION SELECT root FROM verbs WHERE root IN (${candidates.map(() => '?').join(',')}) ORDER BY root`,
      args: [...candidates, ...candidates],
    });
    const roots = rows.rows.flatMap((row) => typeof row.root === 'string' && row.root ? [row.root] : []);
    return { roots, total: roots.length, hasMore: false, nextOffset: null };
  }

  const term = normalize(query);
  const formCandidates = [...new Set([term, term.replace(/[أإآٱ]/g, 'ء'), term.replace(/[أإآٱ]/g, 'ا'), term.replace(/ء/g, 'ا')])];
  const clauses = `root IN (${candidates.map(() => '?').join(',')}) OR ${formCandidates.map(() => 'instr(vocalized, ?) > 0 OR instr(unvocalized, ?) > 0 OR instr(normalized, ?) > 0').join(' OR ')}`;
  const formArgs = formCandidates.flatMap((candidate) => [candidate, candidate, candidate]);
  const matchingRoots = `SELECT root FROM nouns WHERE ${clauses}
                         UNION SELECT root FROM verbs WHERE ${clauses}`;
  const args = [...candidates, ...formArgs, ...candidates, ...formArgs];
  const [count, rows] = await Promise.all([
    db.execute({ sql: `SELECT count(*) AS count FROM (${matchingRoots}) WHERE root IS NOT NULL AND root != ''`, args }),
    db.execute({
      sql: `SELECT root FROM (${matchingRoots}) WHERE root IS NOT NULL AND root != '' ORDER BY root LIMIT ? OFFSET ?`,
      args: [...args, ROOT_LIMIT, offset],
    }),
  ]);
  const total = Number(count.rows[0]?.count || 0);
  const roots = rows.rows.flatMap((row) => typeof row.root === 'string' && row.root ? [row.root] : []);
  return { roots, total, hasMore: offset + roots.length < total, nextOffset: offset + roots.length };
}

async function loadRoot(root: string, offset = 0, paginate = false) {
  const db = getArramoozDatabase();
  const limit = paginate ? ROOT_PAGE_SIZE : FORM_LIMIT;
  const [nounCount, verbCount, forms] = await Promise.all([
    db.execute({ sql: 'SELECT count(*) AS count FROM nouns WHERE root = ?', args: [root] }),
    db.execute({ sql: 'SELECT count(*) AS count FROM verbs WHERE root = ?', args: [root] }),
    db.execute({
      sql: `SELECT id AS sourceId, vocalized AS arabic, unvocalized, 'noun' AS pos, wordtype AS wordType, wazn, definition
            FROM nouns WHERE root = ?
            UNION ALL
            SELECT id AS sourceId, vocalized AS arabic, unvocalized, 'verb' AS pos, 'فعل' AS wordType, NULL AS wazn, NULL AS definition
            FROM verbs WHERE root = ?
            ORDER BY pos, arabic, sourceId LIMIT ? OFFSET ?`,
      args: [root, root, limit, offset],
    }),
  ]);
  const total = Number(nounCount.rows[0]?.count || 0) + Number(verbCount.rows[0]?.count || 0);
  const page = forms.rows.slice(0, limit);
  return {
    root,
    total,
    truncated: offset + page.length < total,
    hasMore: offset + page.length < total,
    offset,
    forms: page.map((row) => ({
      arabic: String(row.arabic || ''),
      unvocalized: String(row.unvocalized || ''),
      pos: row.pos === 'verb' ? 'verb' : 'noun',
      wordType: typeof row.wordType === 'string' ? row.wordType : undefined,
      wazn: typeof row.wazn === 'string' ? row.wazn : undefined,
      definition: definition(row.definition),
    })),
  };
}

export async function GET(request: NextRequest) {
  const root = request.nextUrl.searchParams.get('root')?.trim() || '';
  const query = request.nextUrl.searchParams.get('q')?.trim() || '';
  const exactRoot = Boolean(root);
  const term = exactRoot ? root : query;
  const offsetParam = Number(request.nextUrl.searchParams.get('offset') || 0);
  const offset = Number.isSafeInteger(offsetParam) && offsetParam >= 0 ? Math.min(offsetParam, 1_000_000) : 0;
  const paginateForms = exactRoot && request.nextUrl.searchParams.has('offset');
  if (normalize(term).length < 2 || term.length > 48 || !/^[\p{Script=Arabic}\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]+$/u.test(term)) {
    return NextResponse.json({ groups: [] });
  }

  try {
    const rootPage = await findRoots(term, exactRoot, exactRoot ? 0 : offset);
    const groups = await Promise.all(rootPage.roots.map((item) => loadRoot(item, paginateForms ? offset : 0, paginateForms)));
    return NextResponse.json({
      source: 'Arramooz Arabic Morphological Dictionary',
      groups,
      totalRoots: rootPage.total,
      hasMoreRoots: rootPage.hasMore,
      nextRootOffset: rootPage.nextOffset,
    }, {
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=86400, stale-while-revalidate=43200' },
    });
  } catch {
    return NextResponse.json({ error: 'Arramooz search is unavailable.' }, { status: 503 });
  }
}
