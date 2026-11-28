import { NextRequest, NextResponse } from 'next/server';
import { getQurabicDb } from '@/lib/db/client';
import { getSurahByNumber } from '@/lib/data/surah-list';
import { requestQuranChapterTranslations } from '@/lib/quran-foundation/content-sync';
import { isQuranFoundationSearchConfigured, searchQuranFoundation } from '@/lib/quran-foundation/search';
import { isVercelWafRateLimitEnabled } from '@/lib/api/vercel-waf-rate-limit';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 30;
const CONTENT_PAGE_SIZE = 50;
const UPSTREAM_CONCURRENCY = 4;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 60;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

interface EnglishSearchMatch {
  surah: number;
  ayah: number;
  key: string;
}

interface EnglishVersePayload {
  verse_key?: string;
  translations?: Array<{ resource_id?: number; text?: string }>;
}

function isRateLimited(request: NextRequest): boolean {
  const now = Date.now();
  const key = request.headers.get('x-real-ip') || 'unknown-client';
  const current = requestWindows.get(key);
  if (!current || now - current.startedAt >= RATE_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    if (requestWindows.size > 2_000) {
      for (const [ip, window] of requestWindows) {
        if (now - window.startedAt >= RATE_WINDOW_MS) requestWindows.delete(ip);
      }
      while (requestWindows.size > 1_800) {
        const oldest = requestWindows.keys().next().value;
        if (oldest === undefined) break;
        requestWindows.delete(oldest);
      }
    }
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT;
}

function parseEnglishSearchMatches(rawResults: Array<{ key?: unknown }>): EnglishSearchMatch[] {
  const seen = new Set<string>();
  return rawResults.flatMap((item) => {
    const key = typeof item.key === 'string' ? item.key : '';
    const match = /^(\d{1,3}):(\d{1,3})$/.exec(key);
    if (!match || seen.has(key)) return [];
    const surah = Number(match[1]);
    const ayah = Number(match[2]);
    const meta = getSurahByNumber(surah);
    if (!meta || !Number.isInteger(ayah) || ayah < 1 || ayah > meta.ayahsCount) return [];
    seen.add(key);
    return [{ surah, ayah, key }];
  });
}

async function fetchSaheehTranslations(matches: EnglishSearchMatch[]): Promise<Map<string, string>> {
  const groups = new Map<string, { surah: number; page: number }>();
  for (const match of matches) {
    const page = Math.floor((match.ayah - 1) / CONTENT_PAGE_SIZE) + 1;
    groups.set(`${match.surah}:${page}`, { surah: match.surah, page });
  }
  const translations = new Map<string, string>();
  const pendingGroups = [...groups.values()];
  for (let index = 0; index < pendingGroups.length; index += UPSTREAM_CONCURRENCY) {
    const batch = pendingGroups.slice(index, index + UPSTREAM_CONCURRENCY);
    const responses = await Promise.all(batch.map(async (group) => {
      const response = await requestQuranChapterTranslations(group.surah, group.page);
      if (!response.ok) throw new Error('Saheeh International translation is unavailable.');
      const payload = await response.json() as { verses?: EnglishVersePayload[] };
      if (!Array.isArray(payload.verses)) throw new Error('Saheeh International translation response is invalid.');
      return payload.verses;
    }));
    for (const verses of responses) {
      for (const verse of verses) {
        if (typeof verse.verse_key !== 'string') continue;
        const raw = verse.translations?.find((entry) => Number(entry.resource_id) === 20)?.text;
        if (typeof raw === 'string' && raw.trim()) {
          translations.set(verse.verse_key, raw
            .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, '')
            .replace(/<[^>]*>/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&quot;/g, '"')
            .replace(/&#39;|&apos;/g, "'")
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim());
        }
      }
    }
  }
  return translations;
}

export async function GET(request: NextRequest) {
  if (isRateLimited(request)) {
    return NextResponse.json({ error: 'Search is temporarily rate limited.' }, { status: 429 });
  }
  const query = (request.nextUrl.searchParams.get('q') || '').trim();
  if (query.length < 2 || query.length > 80) return NextResponse.json({ results: [] });
  const language = request.nextUrl.searchParams.get('language') === 'en' ? 'en' : 'id';
  if (language === 'en' && !isVercelWafRateLimitEnabled()) {
    return NextResponse.json({
      error: 'English verse search is unavailable until edge rate limiting is configured.',
      code: 'EDGE_RATE_LIMIT_REQUIRED',
    }, { status: 503, headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  }
  const requestedPage = Number(request.nextUrl.searchParams.get('page') || '1');
  const page = Number.isInteger(requestedPage) ? Math.max(1, Math.min(requestedPage, 1000)) : 1;
  const pageSize = PAGE_SIZE;

  try {
    if (language === 'en') {
      if (!isQuranFoundationSearchConfigured()) {
        return NextResponse.json({
          error: 'English verse search is not configured.',
          code: 'ENGLISH_SEARCH_NOT_CONFIGURED',
        }, { status: 503 });
      }
      const data = await searchQuranFoundation(query, page, pageSize);
      const upstreamResults = data.result?.verses || [];
      const matches = parseEnglishSearchMatches(upstreamResults);
      const nextPageValue = data.pagination?.next_page;
      const nextPage = typeof nextPageValue === 'number' && Number.isInteger(nextPageValue) && nextPageValue > page
        ? nextPageValue
        : null;
      const hasMore = nextPage !== null || (upstreamResults.length === pageSize && nextPageValue === undefined);
      if (matches.length === 0) return NextResponse.json({ results: [], page, hasMore, nextPage: null });
      const translationByKey = await fetchSaheehTranslations(matches);
      if (matches.some((match) => !translationByKey.has(match.key))) {
        throw new Error('Saheeh International translations were incomplete.');
      }
      const predicates = matches.map(() => '(surah = ? AND ayah = ?)').join(' OR ');
      const args = matches.flatMap(({ surah, ayah }) => [surah, ayah]);
      const canonicalText = await getQurabicDb().execute({
        sql: `SELECT surah, ayah, arabic_uthmani FROM ayahs WHERE ${predicates}`,
        args,
      });
      const arabicByKey = new Map(canonicalText.rows.map((row) => [
        `${Number(row.surah)}:${Number(row.ayah)}`,
        String(row.arabic_uthmani || ''),
      ]));
      const results = matches.flatMap(({ surah, ayah, key }) => {
        const arabic = arabicByKey.get(`${surah}:${ayah}`);
        const meta = getSurahByNumber(surah);
        if (!arabic || !meta) return [];
        return [{
          surah,
          ayah,
          arabic,
          translationEnglish: translationByKey.get(key) || '',
          surahName: meta.nameIndo,
          surahNameEnglish: meta.transliteration,
        }];
      });
      return NextResponse.json({ results, page, hasMore, nextPage: hasMore ? nextPage || page + 1 : null });
    }

    const escaped = query.replace(/[\\%_]/g, '\\$&');
    const needle = `%${escaped}%`;
    const response = await getQurabicDb().execute({
      sql: `SELECT surah, ayah, arabic_uthmani, translation_id
            FROM ayahs
            WHERE arabic_uthmani LIKE ? ESCAPE '\\' OR translation_id LIKE ? ESCAPE '\\'
            ORDER BY surah, ayah LIMIT ? OFFSET ?`,
      args: [needle, needle, pageSize + 1, (page - 1) * pageSize],
    });
    const hasMore = response.rows.length > pageSize;
    const results = response.rows.slice(0, pageSize).map((row) => {
      const surah = Number(row.surah);
      const meta = getSurahByNumber(surah);
      return {
        surah,
        ayah: Number(row.ayah),
        arabic: String(row.arabic_uthmani || ''),
        translationId: String(row.translation_id || ''),
        surahName: meta?.nameIndo || `Surah ${surah}`,
        surahNameEnglish: meta?.transliteration || `Surah ${surah}`,
      };
    });
    return NextResponse.json({ results, page, hasMore, nextPage: hasMore ? page + 1 : null });
  } catch {
    return NextResponse.json({
      error: language === 'en' ? 'Verse search is unavailable.' : 'Pencarian ayat tidak tersedia.',
    }, { status: 500 });
  }
}
