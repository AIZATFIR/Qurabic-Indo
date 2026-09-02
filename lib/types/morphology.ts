export interface WordSegment {
  wordIndex: number;
  arabic: string;
  transliteration: string;
  posTag: string;           // e.g. "N - Isim", "V - Fi'il", "P - Haraf", "PRON - Dhamir"
  posTagCode: 'N' | 'V' | 'P' | 'PRON';
  rootArabic?: string;       // e.g. "ص ل و"
  meaningIndo: string;
  wordLocation?: string;    // e.g. "2:153:4"
  lemma?: string;           // e.g. "sam~aA'"
  features?: string;        // e.g. "POS:N|ROOT:smw|LEM:sam~aA'"
}

export interface DerivativeWord {
  id: string;
  arabic: string;            // e.g. "سَمَّىٰ"
  transliteration: string;   // e.g. "samma"
  type: 'verb' | 'noun' | 'adjective' | 'particle';
  form?: string;             // e.g. "Form I", "Form II", "Form VIII"
  posTag: string;            // e.g. "Fi'il Madhi", "Isim Fa'il", "Masdar"
  meaningIndo: string;       // e.g. "Menamai / memberi nama"
  frequency: number;         // Occurrence count in Quran
  buckwalter?: string;       // e.g. "sam~aY`"
  qacPos?: string;           // e.g. "V"
  qacFeatures?: string;      // e.g. "ROOT:smw|LEM:sam~aY`"
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

export interface QuranicUsagePattern {
  title: string;              // e.g. "Langit / Sesuatu yang tinggi"
  description: string;        // e.g. "Digunakan untuk menunjuk sesuatu yang berada di atas atau memiliki sifat ketinggian."
  examples?: string[];        // e.g. ["السَّمَاء", "السَّمَاوَات"]
}

export interface RootWord {
  id: string;                 // e.g. "s-m-w"
  rootArabic: string;         // e.g. "س م و"
  rootArabicJoined: string;   // e.g. "سمو"
  rootLatin: string;          // e.g. "smw"
  titleIndo: string;          // e.g. "Tinggi / Langit / Nama / Menamai"
  titleEnglish: string;       // e.g. "High / Heaven / Name"
  coreMeaning?: string;       // e.g. "Akar س م و berkaitan dengan gagasan tinggi..."
  usagePatterns?: QuranicUsagePattern[]; // Contextual Quranic usage breakdown
  contextualNote?: string;    // Contextual note on lexical connection vs actual verse meaning
  meaningsIndonesian: string[];
  etymologyNote: string;      // Summary explanation
  totalOccurrences: number;
  verbsCount: number;
  nounsCount: number;
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
  occurrences: VerseOccurrence[];
  tags: string[];             // Search tags (Latin, Indo, English, Arab)
}
