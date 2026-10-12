export interface QuizQuestion {
  id: string;
  category: 'akar' | 'sharaf' | 'kosakata' | 'balaghah';
  questionText: string;
  arabicWord: string;
  transliteration: string;
  verseRef: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  rootSlug?: string;
}

export interface MorphologyFlashcard {
  id: string;
  arabicWord: string;
  transliteration: string;
  wazanForm: string;
  rootSlug: string;
  rootArabic: string;
  meaningIndo: string;
  faedahSharaf: string;
  verseContext: { verseRef: string; textArabic: string; translationIndo: string };
}

export const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'akar',
    questionText: 'Manakah akar kata (جَذْر) dari kata Al-Qur\'an berikut?',
    arabicWord: 'وَاسْتَغْفِرْ',
    transliteration: 'Wa-staghfir',
    verseRef: 'QS. 110:3',
    options: ['غ - ف - ر (g-f-r)', 'س - ت - غ (s-t-g)', 'ف - ق - ر (f-q-r)', 'و - س - ت (w-s-t)'],
    correctAnswerIndex: 0,
    explanation: 'Kata وَاسْتَغْفِرْ berada pada Wazan Form X (اِسْتَغْفَرَ / Bab Istif\'al). Huruf awalan alif, sin, dan ta adalah imbuhan (ziyādah), sehingga akar kata aslinya adalah غ-ف-ر (Memaafkan / Menutupi dosa).',
    rootSlug: 'g-f-r'
  },
  {
    id: 'q2',
    category: 'akar',
    questionText: 'Tentukan akar kata dari kata sifat berikut:',
    arabicWord: 'وَالصَّابِرِينَ',
    transliteration: 'Wa-ṣ-ṣābirīn',
    verseRef: 'QS. 2:153',
    options: ['ص - ب - ر (s-b-r)', 'ص - ب - ح (s-b-h)', 'ب - ر - ر (b-r-r)', 'ص - ا - ب (s-A-b)'],
    correctAnswerIndex: 0,
    explanation: 'وَالصَّابِرِينَ adalah bentuk jamak dari Isim Fa\'il (صَابِرٌ). Huruf Alif setelah Sha adalah imbuhan Isim Fa\'il, sehingga akar kata dasarnya adalah ص-ب-ر (Sabar / Menahan diri).',
    rootSlug: 's-b-r'
  },
  {
    id: 'q3',
    category: 'sharaf',
    questionText: 'Apakah jenis kata (Sighat / Wazan) dari kata Al-Qur\'an ini?',
    arabicWord: 'كُتِبَ',
    transliteration: 'Kutiba',
    verseRef: 'QS. 2:183',
    options: [
      'Fi\'il Madhi Majhul (Kata Kerja Lampau Pasif)',
      'Fi\'il Mudhari\' Ma\'lum (Kata Kerja Sekarang Aktif)',
      'Fi\'il Amr (Kata Kerja Perintah)',
      'Isim Fa\'il (Kata Benda Pelaku)'
    ],
    correctAnswerIndex: 0,
    explanation: 'كُتِبَ mengikuti wazan فُعِلَ (Majhul/Pasif), yang berarti "telah diwajibkan / telah ditetapkan".',
    rootSlug: 'k-t-b'
  },
  {
    id: 'q4',
    category: 'sharaf',
    questionText: 'Manakah wazan Sharaf dari kata kerja perintah ini?',
    arabicWord: 'اصْطَبِرْ',
    transliteration: 'Iṣṭabir',
    verseRef: 'QS. 19:65',
    options: [
      'Form VIII (Bab Ifti\'al — اِفْتَعَلَ)',
      'Form I (Tsulatsi Mujarrad — فَعَلَ)',
      'Form II (Bab Taf\'il — فَعَّلَ)',
      'Form IV (Bab If\'al — أَفْعَلَ)'
    ],
    correctAnswerIndex: 0,
    explanation: 'اصْطَبِرْ berasal dari wazan اِفْتَعَلَ (Form VIII). Terjadi proses asimilasi morfologis (Ibdal) di mana ta\' (ت) berubah menjadi tha\' (ط) setelah sha\' (ص) untuk kemudahan pelafalan.',
    rootSlug: 's-b-r'
  },
  {
    id: 'q5',
    category: 'balaghah',
    questionText: 'Apakah perbedaan Balaghah antara Khawf (خَوْف) dan Khasyyah (خَشْيَة)?',
    arabicWord: 'إِنَّمَا يَخْشَى اللَّهَ',
    transliteration: 'Innamā yakhsyā Allāh',
    verseRef: 'QS. 35:28',
    options: [
      'Khasyyah adalah takut yang didasari oleh ilmu & keagungan, sedangkan Khawf adalah takut umum.',
      'Khawf khusus untuk hari kiamat, Khasyyah khusus untuk dunia.',
      'Khasyyah dan Khawf memiliki arti yang 100% persis sama tanpa beda nuansa.',
      'Khawf didasari oleh rasa cinta, Khasyyah didasari rasa benci.'
    ],
    correctAnswerIndex: 0,
    explanation: 'Para mufassir dan ahli linguistik Al-Qur\'an menjelaskan bahwa Khasyyah adalah rasa takut yang lahir dari pengenalan (ma\'rifah) dan rasa hormat agung atas keilmuan, sehingga hanya ulama yang merasakan Khasyyah.',
    rootSlug: 'x-$-y'
  },
  {
    id: 'q6',
    category: 'kosakata',
    questionText: 'Apakah arti terjemahan dari kata Al-Qur\'an berikut?',
    arabicWord: 'الْعَالَمِينَ',
    transliteration: 'Al-\'Ālamīn',
    verseRef: 'QS. 1:2',
    options: ['Semesta Alam / Seluruh Makhluk', 'Para Malaikat', 'Orang-orang Beriman', 'Hari Pembalasan'],
    correctAnswerIndex: 0,
    explanation: 'الْعَالَمِينَ adalah bentuk jamak muzakkar salim dari عَالَم (alam/segalanya selain Allah), merujuk pada seluruh semesta alam dan makhluk-Nya.',
    rootSlug: 'E-l-m'
  },
  {
    id: 'q7',
    category: 'kosakata',
    questionText: 'Manakah arti kata Al-Qur\'an ini dalam konteks QS. 2:255?',
    arabicWord: 'الْقَيُّومُ',
    transliteration: 'Al-Qayyūm',
    verseRef: 'QS. 2:255',
    options: [
      'Maha Berdiri Sendiri & Terus Menerus Mengurus Makhluk-Nya',
      'Maha Pengampun Segala Dosa',
      'Maha Mendengar Ucapan Hamba',
      'Maha Mengawasi Malam dan Siang'
    ],
    correctAnswerIndex: 0,
    explanation: 'الْقَيُّومُ adalah bentuk Isim Mubalaghah dari akar ق-و-م (Berdiri/Tegak), merujuk pada Dzat Allah yang Maha Mandiri dan tiada henti mengurus seluruh makhluk.',
    rootSlug: 'q-w-m'
  }
];

export const FLASHCARD_BANK: MorphologyFlashcard[] = [
  {
    id: 'fc1',
    arabicWord: 'اصْطَبِرْ',
    transliteration: 'Iṣṭabir',
    wazanForm: 'Form VIII (Bab Ifti\'al — اِفْتَعَلَ)',
    rootSlug: 's-b-r',
    rootArabic: 'ص - ب - ر',
    meaningIndo: 'Berteguhlah & bersabarlah secara ekstra keras',
    faedahSharaf: 'Fa\'idah Iktisab & Mujahadah: Menggambarkan perjuangan ekstra keras jiwa untuk terus konsisten bersabar.',
    verseContext: {
      verseRef: 'QS. 19:65',
      textArabic: 'فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ',
      translationIndo: 'Maka sembahlah Dia dan berteguhlah (bersabarlah secara ekstra) dalam beribadah kepada-Nya.'
    }
  },
  {
    id: 'fc2',
    arabicWord: 'عَلَّمَ',
    transliteration: '\'Allama',
    wazanForm: 'Form II (Bab Taf\'il — فَعَّلَ)',
    rootSlug: 'E-l-m',
    rootArabic: 'ع - ل - م',
    meaningIndo: 'Mengajarkan secara intensif dan bertahap',
    faedahSharaf: 'Fa\'idah Ta\'diyah & Taktsir: Mentransitifkan kata "mengetahui" menjadi mentransfer pengetahuan secara bertahap.',
    verseContext: {
      verseRef: 'QS. 96:4',
      textArabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ',
      translationIndo: 'Yang mengajarkan (manusia) dengan pena.'
    }
  },
  {
    id: 'fc3',
    arabicWord: 'وَاسْتَغْفِرْ',
    transliteration: 'Wa-staghfir',
    wazanForm: 'Form X (Bab Istif\'al — اسْتَفْعَلَ)',
    rootSlug: 'g-f-r',
    rootArabic: 'غ - ف - ر',
    meaningIndo: 'Dan mohonlah ampunan dengan bersungguh-sungguh',
    faedahSharaf: 'Fa\'idah Thalab: Memohon atau meminta ampunan dosa dengan kesungguhan kerendahan hati.',
    verseContext: {
      verseRef: 'QS. 110:3',
      textArabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ',
      translationIndo: 'Maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampun kepada-Nya.'
    }
  },
  {
    id: 'fc4',
    arabicWord: 'خَشْيَةٌ',
    transliteration: 'Khasyyah',
    wazanForm: 'Masdar (Form I)',
    rootSlug: 'x-$-y',
    rootArabic: 'خ - ش - ي',
    meaningIndo: 'Rasa takut yang berlandaskan ilmu & keagungan',
    faedahSharaf: 'Bedah Balaghah: Khasyyah mensyaratkan ma\'rifah (ilmu mendalam), berbeda dengan khawf (takut naluri fisik).',
    verseContext: {
      verseRef: 'QS. 35:28',
      textArabic: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
      translationIndo: 'Di antara hamba-hamba Allah yang takut (khasyyah) kepada-Nya hanyalah para ulama.'
    }
  }
];
