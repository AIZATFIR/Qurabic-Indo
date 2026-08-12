import { RootWord } from '../types/morphology';

export const ROOT_DATABASE: RootWord[] = [
  {
    id: 's-b-r',
    rootArabic: 'ص ب ر',
    rootArabicJoined: 'صبر',
    rootLatin: 'sabar',
    titleIndo: 'Sabar / Ketabahan / Menahan Diri',
    titleEnglish: 'Patience / Steadfastness / Endure',
    meaningsIndonesian: [
      'Menahan jiwa dari kegelisahan dan rasa murka',
      'Ketabahan dan keteguhan dalam menghadapi ujian dan cobaan',
      'Pengangkatan beban dengan ketahanan moral yang kuat',
      'Ketaatan yang konsisten dalam menjalankan perintah Allah'
    ],
    etymologyNote: 'Secara linguistik dan etimologi klasik (sebagaimana dicatat oleh Ibnu Manzhur dalam Lisan al-Arab & Al-Khalil ibn Ahmad), kata asal "صَبَر" (sobaro) merujuk pada "batu yang sangat keras dan padat" (الصَّبْرَةُ - batu licin yang kokoh tak tergerus), serta jenis tanaman herbal yang rasanya sangat pahit namun kaya obat (lidah buaya/aloe). Dari akar ini melahirkan makna "menahan diri dengan kekokohan layaknya batu keras" di tengah pahitnya ujian hidup.',
    totalOccurrences: 103,
    verbsCount: 46,
    nounsCount: 57,
    tags: ['sabar', 'sabara', 'sobar', 'sobaro', 'batu', 'batu keras', 'tanaman pahit', 'tabah', 'menahan', 'patience', 'endure', 'steadfast', 'صبر', 'ص-ب-ر'],
    verbs: [
      {
        id: 'sbr-v1',
        arabic: 'صَبَرَ',
        transliteration: 'sabara',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi (Bentuk Lampau)',
        meaningIndo: 'Ia telah bersabar / menahan diri',
        frequency: 24
      },
      {
        id: 'sbr-v2',
        arabic: 'يَصْبِرُ',
        transliteration: 'yasbiru',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Mudhari\' (Bentuk Sekarang/Akan Datang)',
        meaningIndo: 'Ia sedang/akan bersabar',
        frequency: 12
      },
      {
        id: 'sbr-v3',
        arabic: 'اصْبِرْ',
        transliteration: 'isbir',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr (Kata Kerja Perintah)',
        meaningIndo: 'Bersabarlah kamu!',
        frequency: 19
      },
      {
        id: 'sbr-v4',
        arabic: 'صَابَرُوا',
        transliteration: 'saabaruu',
        type: 'verb',
        form: 'Form III',
        posTag: 'Fi\'il Madhi (Form III - Saling/Bersungguh)',
        meaningIndo: 'Mereka menguatkan kesabaran bersama-sama',
        frequency: 3
      },
      {
        id: 'sbr-v5',
        arabic: 'اصْطَبِرْ',
        transliteration: 'istabir',
        type: 'verb',
        form: 'Form VIII',
        posTag: 'Fi\'il Amr (Form VIII - Ketekunan Ekstra)',
        meaningIndo: 'Teguhkanlah kesabaranmu dengan sangat tekun!',
        frequency: 4
      }
    ],
    nouns: [
      {
        id: 'sbr-n1',
        arabic: 'صَبْرٌ',
        transliteration: 'sabrun',
        type: 'noun',
        posTag: 'Masdar (Kata Benda Abstrak)',
        meaningIndo: 'Kesabaran / Ketabahan jiwa',
        frequency: 15
      },
      {
        id: 'sbr-n2',
        arabic: 'صَابِرٌ',
        transliteration: 'saabirun',
        type: 'noun',
        posTag: 'Isim Fa\'il (Pelaku / Subjek)',
        meaningIndo: 'Orang yang bersabar',
        frequency: 8
      },
      {
        id: 'sbr-n3',
        arabic: 'الصَّابِرِينَ',
        transliteration: 'as-saabiriin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak (Orang-orang yang Sabar)',
        meaningIndo: 'Orang-orang yang senantiasa bersabar',
        frequency: 32
      },
      {
        id: 'sbr-n4',
        arabic: 'صَبُورٌ',
        transliteration: 'sabuurun',
        type: 'noun',
        posTag: 'Isim Mubalaghah (Sangat/Maha Penyabar)',
        meaningIndo: 'Maha / Sangat Penyabar',
        frequency: 4
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 153,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        verseIndo: 'Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Sungguh, Allah beserta orang-orang yang sabar.',
        matchedWordArabic: 'بِالصَّبْرِ',
        matchedWordIndo: 'dengan sabar',
        wordLocation: '2:153:4'
      },
      {
        surahNumber: 3,
        ayahNumber: 200,
        surahNameIndo: 'Ali \'Imran',
        surahNameArabic: 'آل عمران',
        verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا وَرَابِطُوا وَاتَّقُوا اللَّهَ لَعَلَّكُمْ تُفْلِحُونَ',
        verseIndo: 'Wahai orang-orang yang beriman! Bersabarlah kamu dan kuatkanlah kesabaranmu dan tetaplah bersiap-siap (di perbatasan negerimu) dan bertakwalah kepada Allah agar kamu beruntung.',
        matchedWordArabic: 'اصْبِرُوا وَصَابِرُوا',
        matchedWordIndo: 'Bersabarlah dan kuatkanlah kesabaranmu',
        wordLocation: '3:200:4'
      },
      {
        surahNumber: 103,
        ayahNumber: 3,
        surahNameIndo: 'Al-\'Asr',
        surahNameArabic: 'العصر',
        verseArabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        verseIndo: 'Kecuali orang-orang yang beriman dan mengerjakan kebajikan serta saling menasihati untuk kebenaran dan saling menasihati untuk kesabaran.',
        matchedWordArabic: 'بِالصَّبْرِ',
        matchedWordIndo: 'dengan kesabaran',
        wordLocation: '103:3:8'
      }
    ]
  },
  {
    id: 'k-t-b',
    rootArabic: 'ك ت ب',
    rootArabicJoined: 'كتب',
    rootLatin: 'kataba',
    titleIndo: 'Tulis / Kitab / Ketetapan Hukum',
    titleEnglish: 'Write / Book / Decree',
    meaningsIndonesian: [
      'Mengumpulkan huruf dan makna menjadi satu tulisan',
      'Mewajibkan atau menetapkan suatu hukum (Taklif)',
      'Kitab suci petunjuk wahyu',
      'Catatan takdir dan amal manusia'
    ],
    etymologyNote: 'Secara etimologi, asal kata "K-T-B" berarti "mengumpulkan sesuatu dengan jahitan atau ikatan" (الجمع والكتابة). Dari sini tulisan disebut kitab karena mengumpulkan huruf-huruf menjadi frasa dan makna yang terikat.',
    totalOccurrences: 319,
    verbsCount: 58,
    nounsCount: 261,
    tags: ['kataba', 'k-t-b', 'kitab', 'tulis', 'menulis', 'catat', 'hukum', 'takdir', 'write', 'book', 'decree', 'كتب', 'ك-ت-ب'],
    verbs: [
      {
        id: 'ktb-v1',
        arabic: 'كَتَبَ',
        transliteration: 'kataba',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah menulis / menetapkan',
        frequency: 56
      },
      {
        id: 'ktb-v2',
        arabic: 'يَكْتُبُونَ',
        transliteration: 'yaktubuuna',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Mudhari\' Jamak',
        meaningIndo: 'Mereka sedang menulis / mencatat',
        frequency: 18
      }
    ],
    nouns: [
      {
        id: 'ktb-n1',
        arabic: 'كِتَابٌ',
        transliteration: 'kitaabun',
        type: 'noun',
        posTag: 'Isim (Buku / Wahyu)',
        meaningIndo: 'Kitab / Buku / Ketetapan',
        frequency: 230
      },
      {
        id: 'ktb-n2',
        arabic: 'كِتَابَةً',
        transliteration: 'kitaabatan',
        type: 'noun',
        posTag: 'Masdar',
        meaningIndo: 'Penulisan / Pencatatan',
        frequency: 5
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 2,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        verseIndo: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.',
        matchedWordArabic: 'الْكِتَابُ',
        matchedWordIndo: 'Kitab (Al-Qur\'an)',
        wordLocation: '2:2:2'
      },
      {
        surahNumber: 2,
        ayahNumber: 183,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ',
        verseIndo: 'Wahai orang-orang yang beriman! Diwajibkan atas kamu berpuasa sebagaimana diwajibkan atas orang sebelum kamu agar kamu bertakwa.',
        matchedWordArabic: 'كُتِبَ',
        matchedWordIndo: 'diwajibkan/ditetapkan',
        wordLocation: '2:183:4'
      }
    ]
  },
  {
    id: 'a-l-m',
    rootArabic: 'ع ل م',
    rootArabicJoined: 'علم',
    rootLatin: 'alima',
    titleIndo: 'Ilmu / Pengetahuan / Tanda',
    titleEnglish: 'Knowledge / Learn / Sign',
    meaningsIndonesian: [
      'Mengetahui hakikat sesuatu secara jelas',
      'Ilmu pengetahuan dan wawasan kebenaran',
      'Tanda atau kejelasan penunjuk jalan',
      'Pengajaran dan pemahaman hikmah'
    ],
    etymologyNote: 'Akar kata "ع-ل-م" mencakup dua cabang utama: Ilmu (pengetahuan jelas tanpa keraguan) dan Alam/Alamat (tanda jejak yang membimbing).',
    totalOccurrences: 854,
    verbsCount: 382,
    nounsCount: 472,
    tags: ['alima', 'a-l-m', 'ilm', 'ilmu', 'tahu', 'mengetahui', 'pengetahuan', 'alam', 'knowledge', 'learn', 'علم', 'ع-ل-م'],
    verbs: [
      {
        id: 'alm-v1',
        arabic: 'عَلِمَ',
        transliteration: 'alima',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah mengetahui',
        frequency: 140
      },
      {
        id: 'alm-v2',
        arabic: 'عَلَّمَ',
        transliteration: 'allama',
        type: 'verb',
        form: 'Form II',
        posTag: 'Fi\'il Madhi (Form II - Mengajar/Mengajarkan)',
        meaningIndo: 'Ia telah mengajarkan',
        frequency: 42
      }
    ],
    nouns: [
      {
        id: 'alm-n1',
        arabic: 'عِلْمٌ',
        transliteration: 'ilmun',
        type: 'noun',
        posTag: 'Masdar (Ilmu/Pengetahuan)',
        meaningIndo: 'Ilmu pengetahuan',
        frequency: 105
      },
      {
        id: 'alm-n2',
        arabic: 'الْعَالَمِينَ',
        transliteration: 'al-aalamiin',
        type: 'noun',
        posTag: 'Isim Jamak (Semesta Alam)',
        meaningIndo: 'Semesta alam',
        frequency: 73
      },
      {
        id: 'alm-n3',
        arabic: 'عَلِيمٌ',
        transliteration: 'aliimun',
        type: 'noun',
        posTag: 'Isim Sifat / Asmaul Husna',
        meaningIndo: 'Maha Mengetahui',
        frequency: 162
      }
    ],
    occurrences: [
      {
        surahNumber: 96,
        ayahNumber: 4,
        surahNameIndo: 'Al-\'Alaq',
        surahNameArabic: 'العلق',
        verseArabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ',
        verseIndo: 'Yang mengajar (manusia) dengan pena.',
        matchedWordArabic: 'عَلَّمَ',
        matchedWordIndo: 'mengajar',
        wordLocation: '96:4:2'
      },
      {
        surahNumber: 1,
        ayahNumber: 2,
        surahNameIndo: 'Al-Fatihah',
        surahNameArabic: 'الفاتحة',
        verseArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        verseIndo: 'Segala puji bagi Allah, Tuhan seluruh alam.',
        matchedWordArabic: 'الْعَالَمِينَ',
        matchedWordIndo: 'seluruh alam',
        wordLocation: '1:2:4'
      }
    ]
  },
  {
    id: 'r-h-m',
    rootArabic: 'ر ح م',
    rootArabicJoined: 'رحم',
    rootLatin: 'rahima',
    titleIndo: 'Rahmah / Kasih Sayang / Rahim',
    titleEnglish: 'Mercy / Compassion / Womb',
    meaningsIndonesian: [
      'Kasih sayang yang mendalam dan tulus',
      'Kelembutan hati yang mendorong kebaikan',
      'Rahim ibu (hubungan kekerabatan/silaturahmi)',
      'Ampunan dan karunia keselamatan'
    ],
    etymologyNote: 'Akar "ر-ح-م" bermakna dasar kelembutan dan kasih yang mengayomi, bersumber dari nama Allah Ar-Rahman & Ar-Rahim serta rahim wanita yang menjadi tempat perlindungan janin.',
    totalOccurrences: 339,
    verbsCount: 65,
    nounsCount: 274,
    tags: ['rahima', 'r-h-m', 'rahmah', 'rahmat', 'kasih', 'sayang', 'rahim', 'mercy', 'compassion', 'رحم', 'ر-ح-م'],
    verbs: [
      {
        id: 'rhm-v1',
        arabic: 'رَحِمَ',
        transliteration: 'rahima',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia mengasihi / merahmati',
        frequency: 34
      },
      {
        id: 'rhm-v2',
        arabic: 'ارْحَمْنَا',
        transliteration: 'irhamnaa',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr (Doa)',
        meaningIndo: 'Rahmatilah kami!',
        frequency: 15
      }
    ],
    nouns: [
      {
        id: 'rhm-n1',
        arabic: 'رَحْمَةٌ',
        transliteration: 'rahmatun',
        type: 'noun',
        posTag: 'Masdar (Rahmat / Karunia)',
        meaningIndo: 'Rahmat / Kasih sayang',
        frequency: 114
      },
      {
        id: 'rhm-n2',
        arabic: 'الرَّحْمَٰنِ',
        transliteration: 'ar-rahmaan',
        type: 'noun',
        posTag: 'Asmaul Husna',
        meaningIndo: 'Maha Pengasih',
        frequency: 57
      },
      {
        id: 'rhm-n3',
        arabic: 'الرَّحِيمِ',
        transliteration: 'ar-rahiim',
        type: 'noun',
        posTag: 'Asmaul Husna',
        meaningIndo: 'Maha Penyayang',
        frequency: 115
      }
    ],
    occurrences: [
      {
        surahNumber: 1,
        ayahNumber: 1,
        surahNameIndo: 'Al-Fatihah',
        surahNameArabic: 'الفاتحة',
        verseArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        verseIndo: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        matchedWordArabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        matchedWordIndo: 'Maha Pengasih, Maha Penyayang',
        wordLocation: '1:1:3'
      }
    ]
  },
  {
    id: 'n-s-r',
    rootArabic: 'ن ص ر',
    rootArabicJoined: 'نصر',
    rootLatin: 'nasara',
    titleIndo: 'Nasr / Pertolongan / Kemenangan',
    titleEnglish: 'Help / Victory / Support',
    meaningsIndonesian: [
      'Memberikan pertolongan kepada yang membutuhkan',
      'Kemenangan atas kebatilan',
      'Penolong kebenaran (Ansar)'
    ],
    etymologyNote: 'Secara etimologi, "N-S-R" berarti menyelamatkan atau menguatkan seseorang yang berada dalam kesusahan.',
    totalOccurrences: 158,
    verbsCount: 92,
    nounsCount: 66,
    tags: ['nasara', 'n-s-r', 'nasr', 'tolong', 'pertolongan', 'menang', 'kemenangan', 'ansar', 'help', 'victory', 'نصر', 'ن-ص-ر'],
    verbs: [
      {
        id: 'nsr-v1',
        arabic: 'نَصَرَ',
        transliteration: 'nasara',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah menolong',
        frequency: 45
      },
      {
        id: 'nsr-v2',
        arabic: 'يَنصُرُكُمُ',
        transliteration: 'yansurukum',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Mudhari\'',
        meaningIndo: 'Ia menolong kamu',
        frequency: 20
      }
    ],
    nouns: [
      {
        id: 'nsr-n1',
        arabic: 'نَصْرٌ',
        transliteration: 'nasrun',
        type: 'noun',
        posTag: 'Masdar (Pertolongan / Kemenangan)',
        meaningIndo: 'Pertolongan / Kemenangan',
        frequency: 22
      },
      {
        id: 'nsr-n2',
        arabic: 'الأَنصَارِ',
        transliteration: 'al-ansaar',
        type: 'noun',
        posTag: 'Isim Jamak (Kaum Anshar)',
        meaningIndo: 'Kaum Penolong (Anshar)',
        frequency: 10
      }
    ],
    occurrences: [
      {
        surahNumber: 110,
        ayahNumber: 1,
        surahNameIndo: 'An-Nasr',
        surahNameArabic: 'النصر',
        verseArabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ',
        verseIndo: 'Apabila telah datang pertolongan Allah dan kemenangan,',
        matchedWordArabic: 'نَصْرُ',
        matchedWordIndo: 'pertolongan',
        wordLocation: '110:1:3'
      }
    ]
  }
];
