import type { FullAyahWBW } from './quran-corpus-api';

export async function fetchSurahWithWBW(surah: number, language: 'id' | 'en' = 'id'): Promise<FullAyahWBW[]> {
  const response = await fetch(`/api/quran-reader/surah?surah=${surah}&language=${language}`);
  if (!response.ok) throw new Error('Surah data is unavailable.');
  const data = await response.json();
  return data.ayahs as FullAyahWBW[];
}

export async function fetchVerseWords(verseKey: string): Promise<import('../types/morphology').WordSegment[]> {
  const response = await fetch(`/api/quran-reader/words?verse=${encodeURIComponent(verseKey)}`);
  if (!response.ok) throw new Error('Verse word data is unavailable.');
  const data = await response.json();
  return data.words;
}
