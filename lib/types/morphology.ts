export interface DerivativeWord {
  id: string;
  arabic: string;            // e.g. "صَبَرَ"
  transliteration: string;   // e.g. "sabara"
  type: 'verb' | 'noun' | 'adjective' | 'particle';
  form?: string;             // e.g. "Form I", "Form III", "Form VIII"
  posTag: string;            // e.g. "Fi'il Madhi", "Isim Fa'il", "Masdar"
  meaningIndo: string;       // e.g. "Bersabar / Menahan Diri"
  frequency: number;         // Occurrence count in Quran
}

export interface VerseOccurrence {
  surahNumber: number;
  ayahNumber: number;
  surahNameIndo: string;
  surahNameArabic: string;
  verseArabic: string;
  verseIndo: string;
  matchedWordArabic: string;
  matchedWordIndo: string;
  wordLocation: string;       // e.g. "2:153:4" (Surah:Ayah:Word)
}

export interface RootWord {
  id: string;                 // e.g. "s-b-r"
  rootArabic: string;         // e.g. "ص ب ر"
  rootArabicJoined: string;   // e.g. "صبر"
  rootLatin: string;          // e.g. "sabar"
  titleIndo: string;          // e.g. "Sabar / Ketabahan / Menahan Diri"
  titleEnglish: string;       // e.g. "Patience / Endure / Steadfastness"
  meaningsIndonesian: string[];
  etymologyNote: string;      // E.g. Classical etymology "Kata sobaro secara etimologi merujuk pada batu yang sangat keras atau tanaman pahit..."
  totalOccurrences: number;
  verbsCount: number;
  nounsCount: number;
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
  occurrences: VerseOccurrence[];
  tags: string[];             // Search tags (Latin, Indo, English, Arab)
}
