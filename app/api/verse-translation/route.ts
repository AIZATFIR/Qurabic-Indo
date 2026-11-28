import { NextRequest, NextResponse } from 'next/server';
import { getSurahByNumber } from '@/lib/data/surah-list';
import { fetchJsonWithTimeout } from '@/lib/api/request';

export const dynamic = 'force-dynamic';

const TRANSLATION_RESOURCE_ID = 20;
const VERSE_PAGE_SIZE = 50;
const MAX_BATCH_KEYS = 20;
const MAX_UPSTREAM_CONCURRENCY = 4;
const MAX_BODY_BYTES = 2_048;

type VerseTranslation = { resource_id?: number; text?: string };
type VersePayload = { verse_key?: string; translations?: VerseTranslation[] };
type ParsedVerseKey = { key: string; surah: number; ayah: number };
type VerseGroup = { surah: number; page: number; keys: string[] };

function cleanTranslation(value: string): string {
  return value
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseVerseKey(value: unknown): ParsedVerseKey | null {
  if (typeof value !== 'string' || !/^\d{1,3}:\d{1,3}$/.test(value)) return null;
  const [surah, ayah] = value.split(':').map(Number);
  const surahMeta = getSurahByNumber(surah);
  if (!surahMeta || !Number.isInteger(ayah) || ayah < 1 || ayah > surahMeta.ayahsCount) return null;
  if (value !== `${surah}:${ayah}`) return null;
  return { key: value, surah, ayah };
}

async function fetchChapterPage(surah: number, page: number): Promise<VersePayload[]> {
  const params = new URLSearchParams({
    translations: String(TRANSLATION_RESOURCE_ID),
    per_page: String(VERSE_PAGE_SIZE),
    page: String(page),
  });
  const { response, data } = await fetchJsonWithTimeout<any>(
    `https://api.quran.com/api/v4/verses/by_chapter/${surah}?${params.toString()}`,
    { next: { revalidate: 86_400 } },
    6_000,
  );
  if (!response.ok || !Array.isArray(data?.verses)) throw new Error('Translation source unavailable.');
  return data.verses as VersePayload[];
}

async function readLimitedBody(request: NextRequest): Promise<string | null> {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let body = '';
  let bytes = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(chunk.value, { stream: true });
  }
  return body + decoder.decode();
}

export async function GET(request: NextRequest) {
  const surah = Number(request.nextUrl.searchParams.get('surah'));
  const ayah = Number(request.nextUrl.searchParams.get('ayah'));
  const parsed = parseVerseKey(`${surah}:${ayah}`);
  if (!parsed) return NextResponse.json({ error: 'Verse not found.' }, { status: 404 });

  try {
    const params = new URLSearchParams({ translations: String(TRANSLATION_RESOURCE_ID) });
    const { response, data } = await fetchJsonWithTimeout<any>(
      `https://api.quran.com/api/v4/verses/by_key/${parsed.key}?${params.toString()}`,
      { next: { revalidate: 86_400 } },
      6_000,
    );
    if (!response.ok) throw new Error('Translation source unavailable.');

    const raw = Array.isArray(data?.verse?.translations)
      ? data.verse.translations.find((item: VerseTranslation) => Number(item.resource_id) === TRANSLATION_RESOURCE_ID)?.text
      : undefined;
    const translation = typeof raw === 'string' ? cleanTranslation(raw) : '';
    if (!translation) return NextResponse.json({ error: 'Saheeh International translation unavailable.' }, { status: 404 });

    const result = NextResponse.json({
      verseKey: parsed.key,
      translation,
      source: 'Saheeh International · Quran.com',
    });
    result.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=43200');
    return result;
  } catch {
    return NextResponse.json({ error: 'Verse translation is temporarily unavailable.' }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  const rawBody = await readLimitedBody(request);
  if (rawBody === null) return NextResponse.json({ error: 'Request is too large or invalid.' }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Request is invalid.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Request is invalid.' }, { status: 400 });
  }

  const keys = (body as { verseKeys?: unknown }).verseKeys;
  if (!Array.isArray(keys) || keys.length < 1 || keys.length > MAX_BATCH_KEYS) {
    return NextResponse.json({ error: `Provide 1 to ${MAX_BATCH_KEYS} verse keys.` }, { status: 400 });
  }
  const parsedKeys = keys.map(parseVerseKey);
  if (parsedKeys.some((key) => key === null)) {
    return NextResponse.json({ error: 'One or more verse keys are invalid.' }, { status: 400 });
  }

  const uniqueKeys = [...new Map((parsedKeys as ParsedVerseKey[]).map((item) => [item.key, item])).values()];
  const groups = new Map<string, VerseGroup>();
  for (const item of uniqueKeys) {
    const page = Math.floor((item.ayah - 1) / VERSE_PAGE_SIZE) + 1;
    const groupId = `${item.surah}:${page}`;
    const group = groups.get(groupId) || { surah: item.surah, page, keys: [] };
    group.keys.push(item.key);
    groups.set(groupId, group);
  }

  const translations: Record<string, string> = {};
  const failed = new Set<string>();
  const unavailable = new Set<string>();
  const results: Array<{ group: VerseGroup; verses: VersePayload[] | null }> = [];
  const groupList = [...groups.values()];
  for (let index = 0; index < groupList.length; index += MAX_UPSTREAM_CONCURRENCY) {
    const chunk = groupList.slice(index, index + MAX_UPSTREAM_CONCURRENCY);
    const chunkResults = await Promise.all(chunk.map(async (group) => {
      try {
        const verses = await fetchChapterPage(group.surah, group.page);
        return { group, verses };
      } catch {
        return { group, verses: null };
      }
    }));
    results.push(...chunkResults);
  }

  for (const { group, verses } of results) {
    if (!verses) {
      group.keys.forEach((key) => failed.add(key));
      continue;
    }
    for (const key of group.keys) {
      const verse = verses.find((item) => item.verse_key === key);
      const rawTranslation = verse?.translations?.find((item) => Number(item.resource_id) === TRANSLATION_RESOURCE_ID)?.text;
      const translation = typeof rawTranslation === 'string' ? cleanTranslation(rawTranslation) : '';
      if (translation) translations[key] = translation;
      else unavailable.add(key);
    }
  }

  return NextResponse.json({
    translations,
    unavailable: [...unavailable],
    failed: [...failed],
    source: 'Saheeh International · Quran.com',
  }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
}
