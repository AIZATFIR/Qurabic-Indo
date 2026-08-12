import { RootWord, VerseOccurrence } from '../types/morphology';

// AlQuran Cloud Search API response types
export interface ApiSearchMatch {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string; // Arabic name
    englishName: string;
  };
  numberInSurah: number;
}

/**
 * Dynamically queries AlQuran Cloud API for any Arabic or Indonesian keyword/root
 * when a user searches for words beyond the pre-seeded static roots.
 */
export async function fetchLiveQuranOccurrences(query: string): Promise<VerseOccurrence[]> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://api.alquran.cloud/v1/search/${encoded}/all/ar`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) return [];

    const json = await res.json();
    if (json.code !== 200 || !json.data || !json.data.matches) return [];

    const matches: ApiSearchMatch[] = json.data.matches.slice(0, 10); // Take top 10 matches

    return matches.map((match) => ({
      surahNumber: match.surah.number,
      ayahNumber: match.numberInSurah,
      surahNameIndo: match.surah.englishName,
      surahNameArabic: match.surah.name,
      verseArabic: match.text,
      verseIndo: `Ayat ${match.numberInSurah} Surah ${match.surah.englishName}`,
      matchedWordArabic: query,
      matchedWordIndo: query,
      wordLocation: `${match.surah.number}:${match.numberInSurah}`
    }));
  } catch (err) {
    console.error('Error fetching live Quran occurrences:', err);
    return [];
  }
}
