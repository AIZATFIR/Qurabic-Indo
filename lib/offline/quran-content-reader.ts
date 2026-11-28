import type { FullAyahWBW, WBWWord } from '@/lib/api/quran-corpus-api';
import { getConsistentOfflineChapterRows, getOfflineQuranPackage } from './quran-content-store';
import { SURAH_LIST } from '@/lib/data/surah-list';

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
