import type { FullAyahWBW, WBWWord } from '@/lib/api/quran-corpus-api';
import { getConsistentOfflineChapterRows, getContentRowsForChapter, getContentRowsForResource, getOfflineQuranPackage } from './quran-content-store';
import { SURAH_LIST } from '@/lib/data/surah-list';
import { searchOfflineTranslationRows } from './quran-translation-search';

function stringField(data: Record<string, unknown>, field: string): string {
  return typeof data[field] === 'string' ? data[field] as string : '';
}

function numberField(data: Record<string, unknown>, field: string): number {
  const value = data[field];
  return typeof value === 'number' && Number.isInteger(value) ? value : 0;
}

function cleanTranslation(value: string): string {
  return value.replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, '').trim();
}

/** Read one saved verse translation without loading its chapter words. */
export async function getOfflineQuranVerseTranslation(
  surahNumber: number,
  ayahNumber: number,
  language: 'id' | 'en',
): Promise<string | null> {
  if (typeof indexedDB === 'undefined') return null;
  const savedPackage = await getOfflineQuranPackage();
  if (!savedPackage || savedPackage.isConsistent === false) return null;

  const { packageState, translationRows } = await getConsistentOfflineChapterRows(
    surahNumber,
    language === 'en' ? 20 : 33,
  );
  if (!packageState || packageState.isConsistent === false) return null;
  const verseKey = `${surahNumber}:${ayahNumber}`;
  const row = translationRows.find((item) => stringField(item.data, 'verse_key') === verseKey);
  const translation = row ? cleanTranslation(stringField(row.data, 'text')) : '';
  return translation || null;
}

/** Read one chapter from a fully saved Quran text and translation package. */
export async function getOfflineQuranSurah(
  surahNumber: number,
  language: 'id' | 'en',
): Promise<FullAyahWBW[] | null> {
  if (typeof indexedDB === 'undefined') return null;
  const { packageState, coreRows, translationRows } = await getConsistentOfflineChapterRows(
    surahNumber,
    language === 'en' ? 20 : 33,
  );
  if (!packageState) return null;
  if (packageState.isConsistent === false) {
    throw new Error('The saved Quran pack needs a completed sync before offline reading.');
  }
  const verses = coreRows
    .filter((row) => row.recordType === 'verse')
    .sort((a, b) => numberField(a.data, 'verse_number') - numberField(b.data, 'verse_number'));
  const words = coreRows.filter((row) => row.recordType === 'word');
  const expectedVerses = SURAH_LIST[surahNumber - 1]?.ayahsCount;
  if (!expectedVerses || verses.length !== expectedVerses || words.length === 0) {
    throw new Error('The saved Quran text for this surah is incomplete.');
  }

  const translations = new Map<string, string>();
  for (const row of translationRows) {
    const verseKey = stringField(row.data, 'verse_key');
    const text = cleanTranslation(stringField(row.data, 'text'));
    if (verseKey && text) translations.set(verseKey, text);
  }

  const wordsByVerse = new Map<string, WBWWord[]>();
  for (const row of words) {
    const data = row.data;
    const verseKey = stringField(data, 'verse_key');
    const arabic = stringField(data, 'text_uthmani_tajweed')
      || stringField(data, 'text_imlaei')
      || stringField(data, 'text_indopak_nastaleeq')
      || stringField(data, 'text_indopak');
    if (!verseKey || !arabic) continue;

    const position = numberField(data, 'position');
    const verseWords = wordsByVerse.get(verseKey) || [];
    verseWords.push({
      id: numberField(data, 'id'),
      position,
      arabic,
      transliteration: '',
      meaningIndo: '',
      charType: stringField(data, 'char_type_name') === 'end' ? 'end' : 'word',
      location: stringField(data, 'location') || `${verseKey}:${position}`,
    });
    wordsByVerse.set(verseKey, verseWords);
  }

  return verses.map((row) => {
    const verseKey = stringField(row.data, 'verse_key') || `${surahNumber}:${numberField(row.data, 'verse_number')}`;
    const verseWords = (wordsByVerse.get(verseKey) || []).sort((a, b) => a.position - b.position);
    const translation = translations.get(verseKey);
    if (!stringField(row.data, 'text_uthmani') || !verseWords.length || !translation) {
      throw new Error('The saved Quran text or translation for this surah is incomplete.');
    }

    return {
      ayahNumber: numberField(row.data, 'verse_number'),
      verseKey,
      textArabic: stringField(row.data, 'text_uthmani'),
      textIndo: translation,
      words: verseWords,
    };
  });
}

/** Search the saved Kemenag or Saheeh snapshot; return null unless the full pack is intact. */
export async function searchOfflineQuranVerses(
  query: string,
  language: 'id' | 'en',
  page = 1,
  pageSize = 30,
): Promise<{
  results: Array<{
    surah: number;
    ayah: number;
    arabic: string;
    translationId?: string;
    translationEnglish?: string;
    surahName: string;
    surahNameEnglish: string;
  }>;
  page: number;
  hasMore: boolean;
  nextPage: number | null;
} | null> {
  if (typeof indexedDB === 'undefined') return null;
  const packageState = await getOfflineQuranPackage();
  const translationResourceId = language === 'en' ? 20 : 33;
  const requiredResources = packageState?.resourcesFilter.split(';') || [];
  const savedTranslationIds = new Set(
    (requiredResources.find((resource) => resource.startsWith('translations:'))?.split(':')[1] || '')
      .split(',')
      .filter(Boolean),
  );
  if (!packageState || packageState.isConsistent === false
    || !savedTranslationIds.has(String(translationResourceId))
    || !requiredResources.includes('quran_core:1')) return null;

  const translationRows = await getContentRowsForResource('translations', translationResourceId);
  const pageData = searchOfflineTranslationRows(translationRows, query, page, pageSize);
  if (!pageData) return null;

  const chapters = [...new Set(pageData.matches.map((match) => match.surah))];
  const arabicByKey = new Map<string, string>();
  for (let index = 0; index < chapters.length; index += 4) {
    const batch = chapters.slice(index, index + 4);
    const chapterRows = await Promise.all(batch.map(async (surahNumber) => {
      const meta = SURAH_LIST[surahNumber - 1];
      const rows = await getContentRowsForChapter('quran_core', 1, surahNumber);
      const verses = rows.filter((row) => row.recordType === 'verse');
      if (!meta || verses.length !== meta.ayahsCount) return null;
      return verses;
    }));
    if (chapterRows.some((rows) => rows === null)) return null;
    for (const verses of chapterRows) {
      for (const row of verses || []) {
        const key = typeof row.data.verse_key === 'string' ? row.data.verse_key : '';
        const arabic = stringField(row.data, 'text_uthmani');
        if (key && arabic) arabicByKey.set(key, arabic);
      }
    }
  }

  const results = pageData.matches.flatMap((match) => {
    const arabic = arabicByKey.get(match.key);
    const meta = SURAH_LIST[match.surah - 1];
    if (!arabic || !meta) return [];
    return [{
      surah: match.surah,
      ayah: match.ayah,
      arabic,
      ...(language === 'en' ? { translationEnglish: match.translation } : { translationId: match.translation }),
      surahName: meta.nameIndo,
      surahNameEnglish: meta.transliteration,
    }];
  });
  if (results.length !== pageData.matches.length) return null;
  return { results, page: pageData.page, hasMore: pageData.hasMore, nextPage: pageData.nextPage };
}
