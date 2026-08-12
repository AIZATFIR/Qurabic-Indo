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
  },
  {
    id: 'q-w-l',
    rootArabic: 'ق و ل',
    rootArabicJoined: 'قول',
    rootLatin: 'qawala',
    titleIndo: 'Qaul / Perkataan / Firman',
    titleEnglish: 'Speech / Say / Word / Decree',
    meaningsIndonesian: [
      'Mengucapkan kata atau kalimat dengan jelas',
      'Firman Allah dan wahyu petunjuk',
      'Pendapat, janji, dan tegasan kebenaran'
    ],
    etymologyNote: 'Akar "Q-W-L" merujuk pada segala ucapan atau perkataan yang keluar dari mulut dan membawa makna.',
    totalOccurrences: 1722,
    verbsCount: 1618,
    nounsCount: 104,
    tags: ['qala', 'qawala', 'q-w-l', 'qaul', 'kata', 'berkata', 'perkataan', 'firman', 'say', 'speech', 'قول', 'ق-و-ل'],
    verbs: [
      {
        id: 'qwl-v1',
        arabic: 'قَالَ',
        transliteration: 'qaala',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah berkata',
        frequency: 529
      },
      {
        id: 'qwl-v2',
        arabic: 'يَقُولُ',
        transliteration: 'yaquulu',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Mudhari\'',
        meaningIndo: 'Ia sedang/akan berkata',
        frequency: 312
      },
      {
        id: 'qwl-v3',
        arabic: 'قُلْ',
        transliteration: 'qul',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr',
        meaningIndo: 'Katakanlah (wahai Muhammad)!',
        frequency: 332
      }
    ],
    nouns: [
      {
        id: 'qwl-n1',
        arabic: 'قَوْلٌ',
        transliteration: 'qaulun',
        type: 'noun',
        posTag: 'Masdar (Perkataan/Firman)',
        meaningIndo: 'Perkataan / Firman',
        frequency: 91
      },
      {
        id: 'qwl-n2',
        arabic: 'قِيلَ',
        transliteration: 'qiila',
        type: 'verb',
        posTag: 'Fi\'il Majhul (Pasif)',
        meaningIndo: 'Dikatakan / Ditegaskan',
        frequency: 49
      }
    ],
    occurrences: [
      {
        surahNumber: 112,
        ayahNumber: 1,
        surahNameIndo: 'Al-Ikhlas',
        surahNameArabic: 'الإخلاص',
        verseArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        verseIndo: 'Katakanlah (Muhammad), "Dialah Allah, Yang Maha Esa."',
        matchedWordArabic: 'قُلْ',
        matchedWordIndo: 'Katakanlah',
        wordLocation: '112:1:1'
      }
    ]
  },
  {
    id: 'h-k-m',
    rootArabic: 'ح ك م',
    rootArabicJoined: 'حكم',
    rootLatin: 'hakama',
    titleIndo: 'Hikmah / Hukum / Kebijaksanaan',
    titleEnglish: 'Judge / Wisdom / Rule',
    meaningsIndonesian: [
      'Mencegah dari kezaliman dan kerusakan',
      'Keadilan dan penetapan hukum syariat',
      'Kebijaksanaan tinggi (Hikmah)',
      'Kekuasaan dan pemerintahan'
    ],
    etymologyNote: 'Secara etimologi, "H-K-M" bermakna dasar "menahan/mencegah dari keburukan" (المنع من الظلم). Tali kekang kuda disebut Hakamah karena menahan kuda dari keliaran.',
    totalOccurrences: 210,
    verbsCount: 91,
    nounsCount: 119,
    tags: ['hakama', 'h-k-m', 'hukum', 'hikmah', 'adil', 'kebijaksanaan', 'judge', 'wisdom', 'حكم', 'ح-ك-م'],
    verbs: [
      {
        id: 'hkm-v1',
        arabic: 'حَكَمَ',
        transliteration: 'hakama',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah memutuskan hukum',
        frequency: 46
      },
      {
        id: 'hkm-v2',
        arabic: 'يَحْكُمُ',
        transliteration: 'yahkumu',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Mudhari\'',
        meaningIndo: 'Ia memutuskan perkara',
        frequency: 38
      }
    ],
    nouns: [
      {
        id: 'hkm-n1',
        arabic: 'حُكْمٌ',
        transliteration: 'hukmun',
        type: 'noun',
        posTag: 'Masdar (Ketetapan Hukum)',
        meaningIndo: 'Hukum / Ketetapan',
        frequency: 30
      },
      {
        id: 'hkm-n2',
        arabic: 'حِكْمَةٌ',
        transliteration: 'hikmatun',
        type: 'noun',
        posTag: 'Isim (Kebijaksanaan)',
        meaningIndo: 'Hikmah / Kebijaksanaan mendalam',
        frequency: 20
      },
      {
        id: 'hkm-n3',
        arabic: 'حَكِيمٌ',
        transliteration: 'hakiimun',
        type: 'noun',
        posTag: 'Asmaul Husna',
        meaningIndo: 'Maha Bijaksana',
        frequency: 97
      }
    ],
    occurrences: [
      {
        surahNumber: 5,
        ayahNumber: 50,
        surahNameIndo: 'Al-Ma\'idah',
        surahNameArabic: 'المائدة',
        verseArabic: 'أَفَحُكْمَ الْجَاهِلِيَّةِ يَبْغُونَ ۚ وَمَنْ أَحْسَنُ مِنَ اللَّهِ حُكْمًا لِّقَوْمٍ يُوقِنُونَ',
        verseIndo: 'Apakah hukum Jahiliah yang mereka kehendaki? Hukum siapakah yang lebih baik daripada hukum Allah bagi orang-orang yang meyakini?',
        matchedWordArabic: 'أَفَحُكْمَ ... حُكْمًا',
        matchedWordIndo: 'hukum Jahiliah ... hukum Allah',
        wordLocation: '5:50:2'
      }
    ]
  },
  {
    id: 'g-f-r',
    rootArabic: 'غ ف ر',
    rootArabicJoined: 'غفر',
    rootLatin: 'ghafara',
    titleIndo: 'Maghfirah / Ampunan / Perlindungan',
    titleEnglish: 'Forgive / Cover / Pardon',
    meaningsIndonesian: [
      'Menutupi dosa dan melindunginya dari siksaan',
      'Pengampunan dan penghapusan kesalahan',
      'Perlindungan dari pengaruh buruk ma\'siat'
    ],
    etymologyNote: 'Secara etimologi, "G-F-R" berarti "menutupi dan melindungi" (الستر والصيانة). Helm besi perang disebut Mighfar (الْمِغْفَر) karena menutupi dan melindungi kepala prajurit.',
    totalOccurrences: 234,
    verbsCount: 96,
    nounsCount: 138,
    tags: ['ghafara', 'g-f-r', 'ampun', 'ampunan', 'maghfirah', 'ghafur', 'ghaffar', 'forgive', 'pardon', 'غفر', 'غ-ف-ر'],
    verbs: [
      {
        id: 'gfr-v1',
        arabic: 'غَفَرَ',
        transliteration: 'ghafara',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah mengampuni',
        frequency: 38
      },
      {
        id: 'gfr-v2',
        arabic: 'اسْتَغْفِرُوا',
        transliteration: 'istaghfiruu',
        type: 'verb',
        form: 'Form X',
        posTag: 'Fi\'il Amr (Form X - Mohon Ampun)',
        meaningIndo: 'Mohonlah ampunan kamu!',
        frequency: 42
      }
    ],
    nouns: [
      {
        id: 'gfr-n1',
        arabic: 'مَغْفِرَةٌ',
        transliteration: 'maghfiratun',
        type: 'noun',
        posTag: 'Masdar (Ampunan)',
        meaningIndo: 'Ampunan Allah',
        frequency: 28
      },
      {
        id: 'gfr-n2',
        arabic: 'غَفُورٌ',
        transliteration: 'ghafuurun',
        type: 'noun',
        posTag: 'Asmaul Husna',
        meaningIndo: 'Maha Pengampun',
        frequency: 91
      }
    ],
    occurrences: [
      {
        surahNumber: 3,
        ayahNumber: 133,
        surahNameIndo: 'Ali \'Imran',
        surahNameArabic: 'آل عمران',
        verseArabic: 'وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ عَرْضُهَا السَّمَاوَاتُ وَالْأَرْضُ أُعِدَّتْ لِلْمُتَّقِينَ',
        verseIndo: 'Dan bersegeralah kamu mencari ampunan dari Tuhanmu dan mendapatkan surga yang luasnya seluas langit dan bumi yang disediakan bagi orang-orang yang bertakwa.',
        matchedWordArabic: 'مَغْفِرَةٍ',
        matchedWordIndo: 'ampunan',
        wordLocation: '3:133:3'
      }
    ]
  },
  {
    id: 's-k-r',
    rootArabic: 'ش ك ر',
    rootArabicJoined: 'شكر',
    rootLatin: 'shakara',
    titleIndo: 'Syukur / Terima Kasih / Pujian',
    titleEnglish: 'Thank / Gratitude / Appreciate',
    meaningsIndonesian: [
      'Mengakui dan memuji nikmat yang diberikan',
      'Menggunakan nikmat Allah pada jalan ketaatan',
      'Rasa terima kasih yang mendalam'
    ],
    etymologyNote: 'Secara etimologi, "S-K-R" bermakna "memenuhkan dan menampilkan kebaikan nikmat" (الامتلاء والظهور). Dikatakan Dabbah Syakuur jika unta tampak gemuk penuh gizi walau makan sedikit rumput.',
    totalOccurrences: 75,
    verbsCount: 49,
    nounsCount: 26,
    tags: ['shakara', 'syukur', 's-k-r', 'terima kasih', 'puji', 'nikmat', 'thank', 'gratitude', 'شكر', 'ش-ك-ر'],
    verbs: [
      {
        id: 'skr-v1',
        arabic: 'شَكَرَ',
        transliteration: 'shakara',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia bersyukur',
        frequency: 18
      },
      {
        id: 'skr-v2',
        arabic: 'اشْكُرُوا',
        transliteration: 'ishkuruu',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr',
        meaningIndo: 'Bersyukurlah kamu!',
        frequency: 14
      }
    ],
    nouns: [
      {
        id: 'skr-n1',
        arabic: 'شُكْرًا',
        transliteration: 'shukran',
        type: 'noun',
        posTag: 'Masdar (Rasa Syukur)',
        meaningIndo: 'Rasa syukur / Terima kasih',
        frequency: 6
      },
      {
        id: 'skr-n2',
        arabic: 'شَاكِرٌ',
        transliteration: 'shaakirun',
        type: 'noun',
        posTag: 'Isim Fa\'il',
        meaningIndo: 'Orang yang bersyukur / Menghargai',
        frequency: 12
      },
      {
        id: 'skr-n3',
        arabic: 'شَكُورٌ',
        transliteration: 'shakuurun',
        type: 'noun',
        posTag: 'Asmaul Husna / Isim Mubalaghah',
        meaningIndo: 'Maha Mensyukuri / Menghargai ketaatan',
        frequency: 10
      }
    ],
    occurrences: [
      {
        surahNumber: 14,
        ayahNumber: 7,
        surahNameIndo: 'Ibrahim',
        surahNameArabic: 'إبراهيم',
        verseArabic: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ',
        verseIndo: 'Dan (ingatlah) ketika Tuhanmu memaklumkan, "Sesungguhnya jika kamu bersyukur, niscaya Aku akan menambah (nikmat) kepadamu, tetapi jika kamu mengingkari (nikmat-Ku), maka sungguh, azab-Ku sangat berat."',
        matchedWordArabic: 'شَكَرْتُمْ',
        matchedWordIndo: 'jika kamu bersyukur',
        wordLocation: '14:7:4'
      }
    ]
  },
  {
    id: 'h-d-y',
    rootArabic: 'ه د ي',
    rootArabicJoined: 'هدي',
    rootLatin: 'hadaya',
    titleIndo: 'Hidayah / Petunjuk / Bimbingan',
    titleEnglish: 'Guide / Guidance / Gift',
    meaningsIndonesian: [
      'Bimbingan dan petunjuk jalan kebenaran',
      'Pemberian hadiah atau karunia yang menuntun',
      'Kejelasan jalur menuju keselamatan'
    ],
    etymologyNote: 'Akar "H-D-Y" bermakna dasar "menuntun dengan kelembutan menuju tujuan yang dituju" (الرشاد والتقدم باللطف). Hadyu juga merujuk pada hadiah penyembelihan kurban.',
    totalOccurrences: 316,
    verbsCount: 161,
    nounsCount: 155,
    tags: ['hadaya', 'hidayah', 'h-d-y', 'petunjuk', 'bimbingan', 'guide', 'guidance', 'هدي', 'ه-د-ي'],
    verbs: [
      {
        id: 'hdy-v1',
        arabic: 'هَدَىٰ',
        transliteration: 'hadaa',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah memberi petunjuk',
        frequency: 72
      },
      {
        id: 'hdy-v2',
        arabic: 'اهْدِنَا',
        transliteration: 'ihdinaa',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr (Doa)',
        meaningIndo: 'Bimbinglah kami!',
        frequency: 10
      }
    ],
    nouns: [
      {
        id: 'hdy-n1',
        arabic: 'هُدًى',
        transliteration: 'hudan',
        type: 'noun',
        posTag: 'Masdar (Petunjuk/Hidayah)',
        meaningIndo: 'Petunjuk jalan lurus',
        frequency: 85
      },
      {
        id: 'hdy-n2',
        arabic: 'الْمُهْتَدِينَ',
        transliteration: 'al-muhtadiin',
        type: 'noun',
        posTag: 'Isim Fa\'il (Yang Mendapat Hidayah)',
        meaningIndo: 'Orang-orang yang mendapat petunjuk',
        frequency: 24
      }
    ],
    occurrences: [
      {
        surahNumber: 1,
        ayahNumber: 6,
        surahNameIndo: 'Al-Fatihah',
        surahNameArabic: 'الفاتحة',
        verseArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        verseIndo: 'Tunjukilah kami jalan yang lurus.',
        matchedWordArabic: 'اهْدِنَا',
        matchedWordIndo: 'Tunjukilah kami',
        wordLocation: '1:6:1'
      }
    ]
  },
  {
    id: 'n-w-r',
    rootArabic: 'ن و ر',
    rootArabicJoined: 'نور',
    rootLatin: 'nawara',
    titleIndo: 'Nur / Cahaya / Penerang',
    titleEnglish: 'Light / Illumination / Radiance',
    meaningsIndonesian: [
      'Cahaya yang menerangi kegelapan',
      'Petunjuk wahyu Al-Qur\'an dan keimanan',
      'Kejelasan yang menghilangkan keraguan'
    ],
    etymologyNote: 'Secara etimologi, "N-W-R" bermakna kecemerlangan yang tampak dan menyingkap hal-hal yang tersembunyi dalam kegelapan.',
    totalOccurrences: 194,
    verbsCount: 12,
    nounsCount: 182,
    tags: ['nawara', 'nur', 'n-w-r', 'cahaya', 'penerang', 'light', 'illumination', 'نور', 'ن-و-ر'],
    verbs: [
      {
        id: 'nwr-v1',
        arabic: 'أَنَارَ',
        transliteration: 'anaara',
        type: 'verb',
        form: 'Form IV',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia menerangi',
        frequency: 4
      }
    ],
    nouns: [
      {
        id: 'nwr-n1',
        arabic: 'نُورٌ',
        transliteration: 'nuurun',
        type: 'noun',
        posTag: 'Isim (Cahaya)',
        meaningIndo: 'Cahaya / Penerang',
        frequency: 43
      },
      {
        id: 'nwr-n2',
        arabic: 'مُنِيرٌ',
        transliteration: 'muniirun',
        type: 'noun',
        posTag: 'Isim Fa\'il (Yang Menerangi)',
        meaningIndo: 'Yang memberi cahaya terang',
        frequency: 6
      }
    ],
    occurrences: [
      {
        surahNumber: 24,
        ayahNumber: 35,
        surahNameIndo: 'An-Nur',
        surahNameArabic: 'النور',
        verseArabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ',
        verseIndo: 'Allah (Pemberi) cahaya (kepada) langit dan bumi.',
        matchedWordArabic: 'نُورُ',
        matchedWordIndo: 'Pemberi cahaya',
        wordLocation: '24:35:2'
      }
    ]
  },
  {
    id: 'h-q-q',
    rootArabic: 'ح ق ق',
    rootArabicJoined: 'حقق',
    rootLatin: 'haqqa',
    titleIndo: 'Haq / Kebenaran / Kepastian',
    titleEnglish: 'Truth / Right / Reality',
    meaningsIndonesian: [
      'Kebenaran sejati yang tidak ada keraguan padanya',
      'Hak dan kewajiban yang pasti',
      'Ketetapan takdir yang pasti terjadi'
    ],
    etymologyNote: 'Akar "H-Q-Q" bermakna dasar "kesesuaian yang kokoh dan tepat" (الثبات والوجوب). Sesuatu dikatakan Haq jika pasti, kokoh, dan sesuai kenyataan.',
    totalOccurrences: 287,
    verbsCount: 39,
    nounsCount: 248,
    tags: ['haqqa', 'haq', 'h-q-q', 'kebenaran', 'hak', 'pasti', 'truth', 'right', 'حق', 'ح-ق-ق'],
    verbs: [
      {
        id: 'hqq-v1',
        arabic: 'حَقَّ',
        transliteration: 'haqqa',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah pasti / terbukti benar',
        frequency: 24
      }
    ],
    nouns: [
      {
        id: 'hqq-n1',
        arabic: 'حَقٌّ',
        transliteration: 'haqqun',
        type: 'noun',
        posTag: 'Isim (Kebenaran/Hak)',
        meaningIndo: 'Kebenaran / Hak yang pasti',
        frequency: 247
      },
      {
        id: 'hqq-n2',
        arabic: 'الْحَاقَّةُ',
        transliteration: 'al-haaqqah',
        type: 'noun',
        posTag: 'Isim (Hari Kiamat)',
        meaningIndo: 'Hari Kiamat (Kejadian yang pasti terjadi)',
        frequency: 3
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 147,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'الْحَقُّ مِن رَّبِّكَ فَلَا تَكُونَنَّ مِنَ الْمُمْتَرِينَ',
        verseIndo: 'Kebenaran itu dari Tuhanmu, maka jangan sekali-kali engkau termasuk orang-orang yang ragu.',
        matchedWordArabic: 'الْحَقُّ',
        matchedWordIndo: 'Kebenaran itu',
        wordLocation: '2:147:1'
      }
    ]
  },
  {
    id: 's-l-m',
    rootArabic: 'س ل م',
    rootArabicJoined: 'سلم',
    rootLatin: 'salima',
    titleIndo: 'Salam / Keselamatan / Kedamaian / Islam',
    titleEnglish: 'Peace / Safety / Islam / Submission',
    meaningsIndonesian: [
      'Terbebas dari cacat, penyakit, dan bahaya',
      'Keselamatan dan kedamaian jiwa',
      'Penyerahan diri secara total kepada Allah (Islam)'
    ],
    etymologyNote: 'Secara etimologi, "S-L-M" bermakna "keselamatan dari cela dan bahaya" (Bebas cela / Sejahtera). Dari sini melahirkan kata Islam (berserah diri demi keselamatan).',
    totalOccurrences: 140,
    verbsCount: 42,
    nounsCount: 98,
    tags: ['salima', 'salam', 's-l-m', 'islam', 'selamat', 'damai', 'penyerahan', 'peace', 'safety', 'سلم', 'س-ل-م'],
    verbs: [
      {
        id: 'slm-v1',
        arabic: 'أَسْلَمَ',
        transliteration: 'aslama',
        type: 'verb',
        form: 'Form IV',
        posTag: 'Fi\'il Madhi (Form IV - Berserah Diri)',
        meaningIndo: 'Ia telah berserah diri / berislam',
        frequency: 22
      }
    ],
    nouns: [
      {
        id: 'slm-n1',
        arabic: 'سَلَامٌ',
        transliteration: 'salaamun',
        type: 'noun',
        posTag: 'Isim (Kedamaian/Salam)',
        meaningIndo: 'Keselamatan / Kedamaian',
        frequency: 42
      },
      {
        id: 'slm-n2',
        arabic: 'الإِسْلَامُ',
        transliteration: 'al-islaam',
        type: 'noun',
        posTag: 'Masdar (Agama Islam)',
        meaningIndo: 'Agama Islam / Penyerahan diri',
        frequency: 6
      },
      {
        id: 'slm-n3',
        arabic: 'مُسْلِمٌ',
        transliteration: 'muslimun',
        type: 'noun',
        posTag: 'Isim Fa\'il (Orang Muslim)',
        meaningIndo: 'Orang yang berserah diri (Muslim)',
        frequency: 42
      }
    ],
    occurrences: [
      {
        surahNumber: 3,
        ayahNumber: 19,
        surahNameIndo: 'Ali \'Imran',
        surahNameArabic: 'آل عمران',
        verseArabic: 'إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ',
        verseIndo: 'Sesungguhnya agama di sisi Allah ialah Islam.',
        matchedWordArabic: 'الْإِسْلَامُ',
        matchedWordIndo: 'Islam',
        wordLocation: '3:19:5'
      }
    ]
  },
  {
    id: 'k-l-q',
    rootArabic: 'خ ل ق',
    rootArabicJoined: 'خلق',
    rootLatin: 'khalaqa',
    titleIndo: 'Khaliq / Penciptaan / Akhlak',
    titleEnglish: 'Create / Creation / Character',
    meaningsIndonesian: [
      'Menciptakan dari tidak ada menjadi ada secara takdir yang tepat',
      'Bentuk watak atau tabiat jiwa (Akhlak)',
      'Makhluk ciptaan alam semesta'
    ],
    etymologyNote: 'Secara etimologi, "K-L-Q" bermakna "mengukur dengan cermat dan membentuk sesuatu dengan proporsi yang sempurna" (التقدير المستقيم).',
    totalOccurrences: 261,
    verbsCount: 184,
    nounsCount: 77,
    tags: ['khalaqa', 'k-l-q', 'cipta', 'pencipta', 'khaliq', 'akhlak', 'makhluk', 'create', 'creation', 'خلق', 'خ-ل-ق'],
    verbs: [
      {
        id: 'klq-v1',
        arabic: 'خَلَقَ',
        transliteration: 'khalaqa',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah menciptakan',
        frequency: 147
      }
    ],
    nouns: [
      {
        id: 'klq-n1',
        arabic: 'خَلْقٌ',
        transliteration: 'khalqun',
        type: 'noun',
        posTag: 'Masdar (Penciptaan/Ciptaan)',
        meaningIndo: 'Penciptaan / Makhluk ciptaan',
        frequency: 52
      },
      {
        id: 'klq-n2',
        arabic: 'الْخَالِقُ',
        transliteration: 'al-khaaliq',
        type: 'noun',
        posTag: 'Asmaul Husna',
        meaningIndo: 'Maha Pencipta',
        frequency: 8
      },
      {
        id: 'klq-n3',
        arabic: 'خُلُقٌ',
        transliteration: 'khuluqun',
        type: 'noun',
        posTag: 'Isim (Akhlak / Budi Pekerti)',
        meaningIndo: 'Akhlak / Budi pekerti',
        frequency: 2
      }
    ],
    occurrences: [
      {
        surahNumber: 96,
        ayahNumber: 1,
        surahNameIndo: 'Al-\'Alaq',
        surahNameArabic: 'العلق',
        verseArabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        verseIndo: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.',
        matchedWordArabic: 'خَلَقَ',
        matchedWordIndo: 'menciptakan',
        wordLocation: '96:1:4'
      }
    ]
  },
  {
    id: 'a-l-h',
    rootArabic: 'ا ل ه',
    rootArabicJoined: 'اله',
    rootLatin: 'alaha',
    titleIndo: 'Ilah / Ketuhanan / Allah',
    titleEnglish: 'God / Deity / Worshiped One',
    meaningsIndonesian: [
      'Satu-satunya Sesembahan Yang Berhak Disembah (Allah)',
      'Ketuhanan dan keagungan ibadah',
      'Pusat perlindungan jiwa'
    ],
    etymologyNote: 'Secara etimologi, "A-L-H" merujuk pada "seseorang yang dipuja, dicintai, dan dijadikan tempat perlindungan jiwa saat mengalami rasa takut atau rindu" (الْمَأْلُوهُ - Yang Dicintai dan Dipuja). Nama Allah (الله) berasal dari akar ini.',
    totalOccurrences: 2851,
    verbsCount: 0,
    nounsCount: 2851,
    tags: ['allah', 'ilah', 'a-l-h', 'tuhan', 'ketuhanan', 'god', 'deity', 'اله', 'ا-ل-ه'],
    verbs: [],
    nouns: [
      {
        id: 'alh-n1',
        arabic: 'اللَّهُ',
        transliteration: 'allahu',
        type: 'noun',
        posTag: 'Lafdzul Jalalah (Nama Allah)',
        meaningIndo: 'Allah (Tuhan Yang Maha Esa)',
        frequency: 2699
      },
      {
        id: 'alh-n2',
        arabic: 'إِلَٰهٌ',
        transliteration: 'ilaahun',
        type: 'noun',
        posTag: 'Isim (Tuhan/Sesembahan)',
        meaningIndo: 'Tuhan / Sesembahan',
        frequency: 147
      }
    ],
    occurrences: [
      {
        surahNumber: 112,
        ayahNumber: 2,
        surahNameIndo: 'Al-Ikhlas',
        surahNameArabic: 'الإخلاص',
        verseArabic: 'اللَّهُ الصَّمَدُ',
        verseIndo: 'Allah tempat meminta segala sesuatu.',
        matchedWordArabic: 'اللَّهُ',
        matchedWordIndo: 'Allah',
        wordLocation: '112:2:1'
      }
    ]
  },
  {
    id: 't-w-b',
    rootArabic: 'ت و ب',
    rootArabicJoined: 'توب',
    rootLatin: 'tawaba',
    titleIndo: 'Taubat / Kembali Kepada Allah / Pengampunan',
    titleEnglish: 'Repentance / Return / Accept Repentance',
    meaningsIndonesian: [
      'Kembali dari perbuatan dosa menuju ketaatan',
      'Penerimaan ampunan Allah atas hamba-Nya (At-Tawwab)',
      'Penyesalan yang tulus dan perbaikan amal'
    ],
    etymologyNote: 'Secara etimologi, "T-W-B" bermakna "kembali" (الرجوع). Taubat hamba berarti kembali kepada ketaatan; Taubat Allah berarti Allah kembali menganugerahkan rahmat kepada hamba-Nya.',
    totalOccurrences: 87,
    verbsCount: 72,
    nounsCount: 15,
    tags: ['tawaba', 'taubat', 't-w-b', 'tuba', 'kembali', 'ampun', 'repent', 'return', 'توب', 'ت-و-ب'],
    verbs: [
      {
        id: 'twb-v1',
        arabic: 'تَابَ',
        transliteration: 'taaba',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah bertaubat / kembali',
        frequency: 44
      },
      {
        id: 'twb-v2',
        arabic: 'تُوبُوا',
        transliteration: 'tuubuu',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr',
        meaningIndo: 'Bertaubatlah kamu sekalian!',
        frequency: 11
      }
    ],
    nouns: [
      {
        id: 'twb-n1',
        arabic: 'تَوْبَةً',
        transliteration: 'taubatan',
        type: 'noun',
        posTag: 'Masdar (Taubat)',
        meaningIndo: 'Taubat / Penyesalan tulus',
        frequency: 10
      },
      {
        id: 'twb-n2',
        arabic: 'التَّوَّابُ',
        transliteration: 'at-tawwaab',
        type: 'noun',
        posTag: 'Asmaul Husna',
        meaningIndo: 'Maha Penerima Taubat',
        frequency: 11
      }
    ],
    occurrences: [
      {
        surahNumber: 66,
        ayahNumber: 8,
        surahNameIndo: 'At-Tahrim',
        surahNameArabic: 'التحريم',
        verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا',
        verseIndo: 'Wahai orang-orang yang beriman! Bertaubatlah kepada Allah dengan taubat yang semurni-murninya (nasuha).',
        matchedWordArabic: 'تُوبُوا ... تَوْبَةً',
        matchedWordIndo: 'Bertaubatlah ... taubat',
        wordLocation: '66:8:4'
      }
    ]
  },
  {
    id: 'z-k-r',
    rootArabic: 'ذ ك ر',
    rootArabicJoined: 'ذكر',
    rootLatin: 'dhakara',
    titleIndo: 'Zikir / Ingatan / Peringatan / Kemuliaan',
    titleEnglish: 'Remember / Mention / Reminder / Honor',
    meaningsIndonesian: [
      'Mengingat Allah dengan hati dan lisan',
      'Peringatan Al-Qur\'an dan pelajaran hikmah',
      'Kemuliaan dan kehormatan nama baik'
    ],
    etymologyNote: 'Akar "Z-K-R" mencakup dua aspek: Menjaga ingatan di dalam hati dan mengucapkan dengan lisan agar tidak lupa.',
    totalOccurrences: 292,
    verbsCount: 167,
    nounsCount: 125,
    tags: ['dhakara', 'zikir', 'z-k-r', 'ingat', 'peringatan', 'remember', 'mention', 'ذكر', 'ذ-ك-ر'],
    verbs: [
      {
        id: 'zkr-v1',
        arabic: 'ذَكَرَ',
        transliteration: 'dhakara',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah mengingat / menyebut',
        frequency: 68
      },
      {
        id: 'zkr-v2',
        arabic: 'اذْكُرُوا',
        transliteration: 'idhkuuruu',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr',
        meaningIndo: 'Ingatlah kamu sekalian!',
        frequency: 45
      }
    ],
    nouns: [
      {
        id: 'zkr-n1',
        arabic: 'ذِكْرٌ',
        transliteration: 'dhikrun',
        type: 'noun',
        posTag: 'Masdar (Zikir/Peringatan)',
        meaningIndo: 'Peringatan / Zikir / Kemuliaan',
        frequency: 76
      },
      {
        id: 'zkr-n2',
        arabic: 'تَذْكِرَةٌ',
        transliteration: 'tadhkiratun',
        type: 'noun',
        posTag: 'Isim (Pelajaran Peringatan)',
        meaningIndo: 'Pelajaran / Peringatan',
        frequency: 9
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 152,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
        verseIndo: 'Maka ingatlah kepada-Ku, Niscaya Aku ingat kepadamu. Bersyukurlah kepada-Ku, dan janganlah kamu mengingkari (nikmat-Ku).',
        matchedWordArabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
        matchedWordIndo: 'Maka ingatlah kepada-Ku, Niscaya Aku ingat kepadamu',
        wordLocation: '2:152:1'
      }
    ]
  },
  {
    id: 's-d-q',
    rootArabic: 'ص د ق',
    rootArabicJoined: 'صدق',
    rootLatin: 'sadaqa',
    titleIndo: 'Shiddiq / Kejujuran / Sedekah / Kebenaran',
    titleEnglish: 'Truthful / Sincerity / Charity',
    meaningsIndonesian: [
      'Kesesuaian ucapan dan perbuatan dengan kenyataan',
      'Kejujuran jiwa dan kebenaran janji',
      'Sedekah sebagai bukti ketulusan iman (Sadaqah)'
    ],
    etymologyNote: 'Secara etimologi, "S-D-Q" berarti "kekuatan dan keteguhan ucapan yang jujur tanpa kebohongan". Sedekah disebut Sadaqah karena menjadi bukti jujurnya keimanan seseorang.',
    totalOccurrences: 155,
    verbsCount: 86,
    nounsCount: 69,
    tags: ['sadaqa', 'shiddiq', 's-d-q', 'jujur', 'sedekah', 'kebenaran', 'truthful', 'charity', 'صدق', 'ص-د-ق'],
    verbs: [
      {
        id: 'sdq-v1',
        arabic: 'صَدَقَ',
        transliteration: 'sadaqa',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah berkata benar / menepati',
        frequency: 40
      },
      {
        id: 'sdq-v2',
        arabic: 'صَدَّقَ',
        transliteration: 'saddaqaa',
        type: 'verb',
        form: 'Form II',
        posTag: 'Fi\'il Madhi (Form II - Membenarkan)',
        meaningIndo: 'Ia telah membenarkan',
        frequency: 20
      }
    ],
    nouns: [
      {
        id: 'sdq-n1',
        arabic: 'صِدْقٌ',
        transliteration: 'sidqun',
        type: 'noun',
        posTag: 'Masdar (Kejujuran)',
        meaningIndo: 'Kejujuran / Kebenaran',
        frequency: 27
      },
      {
        id: 'sdq-n2',
        arabic: 'الصَّادِقِينَ',
        transliteration: 'as-saadiqiin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak',
        meaningIndo: 'Orang-orang yang jujur/benar',
        frequency: 28
      },
      {
        id: 'sdq-n3',
        arabic: 'صَدَقَةٌ',
        transliteration: 'sadaqatun',
        type: 'noun',
        posTag: 'Isim (Sedekah)',
        meaningIndo: 'Sedekah / Derma ketulusan',
        frequency: 12
      }
    ],
    occurrences: [
      {
        surahNumber: 9,
        ayahNumber: 119,
        surahNameIndo: 'At-Tawbah',
        surahNameArabic: 'التوبة',
        verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ وَكُونُوا مَعَ الصَّادِقِينَ',
        verseIndo: 'Wahai orang-orang yang beriman! Bertakwalah kepada Allah, dan bersamalah kamu dengan orang-orang yang jujur.',
        matchedWordArabic: 'الصَّادِقِينَ',
        matchedWordIndo: 'orang-orang yang jujur',
        wordLocation: '9:119:8'
      }
    ]
  },
  {
    id: 'a-b-d',
    rootArabic: 'ع ب د',
    rootArabicJoined: 'عبد',
    rootLatin: 'abada',
    titleIndo: 'Ibadah / Hamba / Pengabdian',
    titleEnglish: 'Worship / Servant / Slave',
    meaningsIndonesian: [
      'Ketundukan jiwa dengan rasa cinta dan keagungan',
      'Pengabdian hamba kepada Sang Pencipta',
      'Pelaksanaan syariat dengan ketulusan'
    ],
    etymologyNote: 'Secara etimologi, "A-B-D" bermakna "kelembutan dan ketundukan" (الذلة والخضوع). Jalan yang sudah diratakan dan mudah dilalui disebut Tareeq Mu\'abbad.',
    totalOccurrences: 275,
    verbsCount: 143,
    nounsCount: 132,
    tags: ['abada', 'ibadah', 'a-b-d', 'hamba', 'abdi', 'menyembah', 'worship', 'servant', 'عبد', 'ع-ب-د'],
    verbs: [
      {
        id: 'abd-v1',
        arabic: 'عَبَدَ',
        transliteration: 'abada',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah menyembah / mengabdi',
        frequency: 38
      },
      {
        id: 'abd-v2',
        arabic: 'نَعْبُدُ',
        transliteration: 'na\'budu',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Mudhari\' (Kami Menyembah)',
        meaningIndo: 'Kami menyembah',
        frequency: 25
      }
    ],
    nouns: [
      {
        id: 'abd-n1',
        arabic: 'عَبْدٌ',
        transliteration: 'abdun',
        type: 'noun',
        posTag: 'Isim (Hamba)',
        meaningIndo: 'Hamba / Abdi',
        frequency: 122
      },
      {
        id: 'abd-n2',
        arabic: 'عِبَادَةً',
        transliteration: 'ibaadatan',
        type: 'noun',
        posTag: 'Masdar (Ibadah)',
        meaningIndo: 'Ibadah / Pengabdian',
        frequency: 10
      }
    ],
    occurrences: [
      {
        surahNumber: 1,
        ayahNumber: 5,
        surahNameIndo: 'Al-Fatihah',
        surahNameArabic: 'الفاتحة',
        verseArabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        verseIndo: 'Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami mohon pertolongan.',
        matchedWordArabic: 'نَعْبُدُ',
        matchedWordIndo: 'kami menyembah',
        wordLocation: '1:5:2'
      }
    ]
  },
  {
    id: 'a-m-n',
    rootArabic: 'ا م ن',
    rootArabicJoined: 'امن',
    rootLatin: 'amana',
    titleIndo: 'Iman / Keamanan / Kepercayaan / Amanah',
    titleEnglish: 'Faith / Belief / Security / Trust',
    meaningsIndonesian: [
      'Pembenaran jiwa yang melahirkan ketenangan dan kepastian',
      'Keamanan dari rasa takut dan bahaya',
      'Amanah tanggung jawab ketaatan'
    ],
    etymologyNote: 'Akar "A-M-N" merujuk pada ketenangan jiwa dan hilangnya rasa takut (طمأنينة النفس وزوال الخوف). Dari sini kata Iman bermakna memberi keamanan jiwa melalui kepercayaan teguh pada Allah.',
    totalOccurrences: 879,
    verbsCount: 537,
    nounsCount: 342,
    tags: ['amana', 'iman', 'a-m-n', 'percaya', 'aman', 'amanah', 'faith', 'belief', 'security', 'امن', 'ا-م-ن'],
    verbs: [
      {
        id: 'amn-v1',
        arabic: 'آمَنَ',
        transliteration: 'aamana',
        type: 'verb',
        form: 'Form IV',
        posTag: 'Fi\'il Madhi (Beriman)',
        meaningIndo: 'Ia telah beriman',
        frequency: 258
      },
      {
        id: 'amn-v2',
        arabic: 'يُؤْمِنُونَ',
        transliteration: 'yu\'minuuna',
        type: 'verb',
        form: 'Form IV',
        posTag: 'Fi\'il Mudhari\' Jamak',
        meaningIndo: 'Mereka beriman',
        frequency: 180
      }
    ],
    nouns: [
      {
        id: 'amn-n1',
        arabic: 'إِيمَانٌ',
        transliteration: 'iimaanun',
        type: 'noun',
        posTag: 'Masdar (Iman/Kepercayaan)',
        meaningIndo: 'Keimanan / Keyakinan',
        frequency: 45
      },
      {
        id: 'amn-n2',
        arabic: 'الْمُؤْمِنِينَ',
        transliteration: 'al-mu\'miniin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak',
        meaningIndo: 'Orang-orang yang beriman',
        frequency: 180
      },
      {
        id: 'amn-n3',
        arabic: 'أَمْنٌ',
        transliteration: 'amnun',
        type: 'noun',
        posTag: 'Isim (Rasa Aman)',
        meaningIndo: 'Rasa aman / Ketenteraman',
        frequency: 20
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 3,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ',
        verseIndo: '(yaitu) mereka yang beriman kepada yang gaib, melaksanakan salat, dan menginfakkan sebagian rezeki yang Kami berikan kepada mereka,',
        matchedWordArabic: 'يُؤْمِنُونَ',
        matchedWordIndo: 'beriman',
        wordLocation: '2:3:2'
      }
    ]
  },
  {
    id: 'q-r-a',
    rootArabic: 'ق ر ا',
    rootArabicJoined: 'قرا',
    rootLatin: 'qaraa',
    titleIndo: 'Qur\'an / Membaca / Menghimpun',
    titleEnglish: 'Read / Recite / Quran / Gather',
    meaningsIndonesian: [
      'Membaca dan menelaah dengan cermat',
      'Menghimpun huruf dan makna wahyu Allah',
      'Kitab suci Al-Qur\'an al-Karim'
    ],
    etymologyNote: 'Secara etimologi, "Q-R-A" berarti "menghimpun dan mengumpulkan" (الجمع الضم). Membaca disebut Qira\'ah karena menghimpun huruf-huruf menjadi kata dan kalimat.',
    totalOccurrences: 88,
    verbsCount: 18,
    nounsCount: 70,
    tags: ['qaraa', 'quran', 'q-r-a', 'baca', 'membaca', 'mengaji', 'recite', 'read', 'قرا', 'ق-ر-ا'],
    verbs: [
      {
        id: 'qra-v1',
        arabic: 'قَرَأَ',
        transliteration: 'qara\'a',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Madhi',
        meaningIndo: 'Ia telah membaca',
        frequency: 5
      },
      {
        id: 'qra-v2',
        arabic: 'اقْرَأْ',
        transliteration: 'iqra\'',
        type: 'verb',
        form: 'Form I',
        posTag: 'Fi\'il Amr (Wahyu Pertama)',
        meaningIndo: 'Bacalah!',
        frequency: 3
      }
    ],
    nouns: [
      {
        id: 'qra-n1',
        arabic: 'الْقُرْآنُ',
        transliteration: 'al-qur\'aan',
        type: 'noun',
        posTag: 'Isim Alam (Al-Qur\'an)',
        meaningIndo: 'Al-Qur\'an (Bacaan Utama Suci)',
        frequency: 68
      },
      {
        id: 'qra-n2',
        arabic: 'قُرْآنًا',
        transliteration: 'qur\'aanan',
        type: 'noun',
        posTag: 'Masdar',
        meaningIndo: 'Bacaan yang terhimpun',
        frequency: 10
      }
    ],
    occurrences: [
      {
        surahNumber: 96,
        ayahNumber: 1,
        surahNameIndo: 'Al-\'Alaq',
        surahNameArabic: 'العلق',
        verseArabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        verseIndo: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.',
        matchedWordArabic: 'اقْرَأْ',
        matchedWordIndo: 'Bacalah',
        wordLocation: '96:1:1'
      }
    ]
  }
];
