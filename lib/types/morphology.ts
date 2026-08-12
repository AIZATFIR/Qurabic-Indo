export interface WordSegment {
  wordIndex: number;
  arabic: string;
  transliteration: string;
  posTag: string;           // e.g. "N - Isim", "V - Fi'il", "P - Haraf", "PRON - Dhamir"
  posTagCode: 'N' | 'V' | 'P' | 'PRON';
  rootArabic?: string;       // e.g. "ص ل و"
  meaningIndo: string;
}

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
  wordSegments?: WordSegment[]; // Word-by-Word Interlinear Analysis ala Quranic Corpus
}

export interface RootWord {
  id: string;                 // e.g. "s-b-r"
  rootArabic: string;         // e.g. "ص ب ر"
  rootArabicJoined: string;   // e.g. "صبر"
  rootLatin: string;          // e.g. "sabar"
  titleIndo: string;          // e.g. "Sabar / Ketabahan / Menahan Diri"
  titleEnglish: string;       // e.g. "Patience / Steadfastness / Endure"
  meaningsIndonesian: string[];
  etymologyNote: string;      // E.g. Classical etymology "Kata sobaro secara etimologi merujuk pada batu yang sangat keras..."
  totalOccurrences: number;
  verbsCount: number;
  nounsCount: number;
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
  occurrences: VerseOccurrence[];
  tags: string[];             // Search tags (Latin, Indo, English, Arab)
}
