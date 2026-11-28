import { SURAH_LIST } from '@/lib/data/surah-list';

export interface OfflineTranslationRow {
  recordType: string;
  data: Record<string, unknown>;
}

export interface OfflineTranslationMatch {
  surah: number;
  ayah: number;
  key: string;
  translation: string;
}

export interface OfflineTranslationSearchPage {
  matches: OfflineTranslationMatch[];
  page: number;
  hasMore: boolean;
  nextPage: number | null;
}

const TOTAL_QURAN_VERSES = 6_236;

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

function normalizeSearchText(value: string): string {
  return cleanTranslation(value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('en')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Search a complete, locally saved translation snapshot without network access. */
export function searchOfflineTranslationRows(
  rows: OfflineTranslationRow[],
  query: string,
  requestedPage = 1,
  pageSize = 30,
): OfflineTranslationSearchPage | null {
  const page = Number.isInteger(requestedPage) ? Math.max(1, requestedPage) : 1;
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) return null;

  const translations = new Map<string, OfflineTranslationMatch>();
  for (const row of rows) {
    if (row.recordType !== 'translation') continue;
    const key = typeof row.data.verse_key === 'string' ? row.data.verse_key : '';
    const match = /^(\d{1,3}):(\d{1,3})$/.exec(key);
    const surah = match ? Number(match[1]) : 0;
    const ayah = match ? Number(match[2]) : 0;
    const surahMeta = SURAH_LIST[surah - 1];
    const translation = typeof row.data.text === 'string' ? cleanTranslation(row.data.text) : '';
    if (!match || !surahMeta || ayah < 1 || ayah > surahMeta.ayahsCount || !translation) continue;
    if (translations.has(key)) return null;
    translations.set(key, { surah, ayah, key, translation });
  }

  // Incomplete or stale local data must not silently present partial search results.
  if (translations.size !== TOTAL_QURAN_VERSES) return null;
  const needle = normalizeSearchText(query);
  if (needle.length < 2) return { matches: [], page, hasMore: false, nextPage: null };

  const matches = [...translations.values()]
    .filter((entry) => normalizeSearchText(entry.translation).includes(needle))
    .sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
  const offset = (page - 1) * pageSize;
  const pageMatches = matches.slice(offset, offset + pageSize);
  const hasMore = offset + pageSize < matches.length;
  return {
    matches: pageMatches,
    page,
    hasMore,
    nextPage: hasMore ? page + 1 : null,
  };
}
