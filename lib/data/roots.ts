import { RootWord } from '../types/morphology';

export const ROOT_DATABASE: RootWord[] = [
  {
    id: 's-l-w',
    rootArabic: 'ص ل و',
    rootArabicJoined: 'صلوة',
    rootLatin: 'salat',
    titleIndo: 'Salat / Sholat / Doa / Keagungan',
    titleEnglish: 'Prayer / Worship / Blessing / Supplication',
    meaningsIndonesian: [
      'Ibadah Salat lima waktu dan ibadah khusus',
      'Doa permohonan kebaikan dan keberkahan',
      'Keagungan dan penghormatan (Salawat dari Allah & Malaikat)',
      'Hubungan langsung hamba dengan Sang Pencipta'
    ],
    etymologyNote: 'Secara etimologi dan linguistik klasik (Lisan al-Arab & Al-Mu\'jam), kata asal "ص-ل-و" bermakna dasar "hubungan yang mengikat dan meluruskan" (الصلة والإقبال). Dikatakan "Mushal-lii" pada pacuan kuda merujuk pada kuda kedua yang menempel persis di belakang kuda utama. Dari sini Salat bermakna hubungan intim yang menempel erat dan tak terputus antara hamba dengan Allah SWT.',
    totalOccurrences: 99,
    verbsCount: 16,
    nounsCount: 83,
    tags: ['salat', 'sholat', 'solat', 'shalat', 'shalaat', 'sholah', 's-l-w', 'salawat', 'selawat', 'doa', 'prayer', 'worship', 'صلوة', 'ص-ل-و'],
    verbs: [
      {
        id: 'slw-v1',
        arabic: 'صَلَّىٰ',
        transliteration: 'sallaa',
        type: 'verb',
        form: 'Form II',
        posTag: 'Fi\'il Madhi (Form II - Mendoakan / Bersalat)',
        meaningIndo: 'Ia telah melaksanakan salat / mendoakan',
        frequency: 12
      },
      {
        id: 'slw-v2',
        arabic: 'يُصَلُّونَ',
        transliteration: 'yusalluuna',
        type: 'verb',
        form: 'Form II',
        posTag: 'Fi\'il Mudhari\' Jamak',
        meaningIndo: 'Mereka melesaksanakan salat / berselawat',
        frequency: 4
      }
    ],
    nouns: [
      {
        id: 'slw-n1',
        arabic: 'الصَّلَاةَ',
        transliteration: 'as-salaah',
        type: 'noun',
        posTag: 'Isim (Ibadah Salat)',
        meaningIndo: 'Ibadah Salat / Doa suci',
        frequency: 67
      },
      {
        id: 'slw-n2',
        arabic: 'صَلَوَاتٌ',
        transliteration: 'salawaatun',
        type: 'noun',
        posTag: 'Isim Jamak (Salawat / Keberkahan)',
        meaningIndo: 'Salawat / Keberkahan doa',
        frequency: 5
      },
      {
        id: 'slw-n3',
        arabic: 'الْمُصَلِّينَ',
        transliteration: 'al-musalliin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak (Orang-orang yang Salat)',
        meaningIndo: 'Orang-orang yang melaksanakan salat',
        frequency: 5
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 45,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ',
        verseIndo: 'Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Dan (salat) itu sungguh berat, kecuali bagi orang-orang yang khusyuk.',
        matchedWordArabic: 'وَالصَّلَاةِ',
        matchedWordIndo: 'dan salat',
        wordLocation: '2:45:2',
        wordSegments: [
          { wordIndex: 1, arabic: 'وَاسْتَعِينُوا', transliteration: 'wasta\'iinuu', posTag: 'V - Fi\'il Amr', posTagCode: 'V', meaningIndo: 'Dan mohonlah pertolongan' },
          { wordIndex: 2, arabic: 'بِالصَّبْرِ', transliteration: 'bis-sabri', posTag: 'N - Isim (Majrur)', posTagCode: 'N', rootArabic: 'ص ب ر', meaningIndo: 'dengan sabar' },
          { wordIndex: 3, arabic: 'وَالصَّلَاةِ', transliteration: 'was-salaah', posTag: 'N - Isim (Salat)', posTagCode: 'N', rootArabic: 'ص ل و', meaningIndo: 'dan salat' }
        ]
      },
      {
        surahNumber: 2,
        ayahNumber: 238,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
        verseIndo: 'Peliharalah semua salat dan salat wustha (salat Asar). Dan berdirilah karena Allah (dalam salatmu) dengan khusyuk.',
        matchedWordArabic: 'الصَّلَوَاتِ وَالصَّلَاةِ',
        matchedWordIndo: 'semua salat dan salat wustha',
        wordLocation: '2:238:3',
        wordSegments: [
          { wordIndex: 1, arabic: 'حَافِظُوا', transliteration: 'haafizuu', posTag: 'V - Fi\'il Amr', posTagCode: 'V', meaningIndo: 'Peliharalah' },
          { wordIndex: 2, arabic: 'عَلَى', transliteration: '\'alaa', posTag: 'P - Haraf Jar', posTagCode: 'P', meaningIndo: 'atas' },
          { wordIndex: 3, arabic: 'الصَّلَوَاتِ', transliteration: 'as-salawaat', posTag: 'N - Isim Jamak', posTagCode: 'N', rootArabic: 'ص ل و', meaningIndo: 'semua salat' }
        ]
      }
    ]
  },
  {
    id: 'z-k-w',
    rootArabic: 'ز ك و',
    rootArabicJoined: 'زكاة',
    rootLatin: 'zakat',
    titleIndo: 'Zakat / Pertumbuhan / Pembersihan Jiwa',
    titleEnglish: 'Zakat / Purity / Growth / Charity',
    meaningsIndonesian: [
      'Pemberian zakat wajib penyuci harta',
      'Pertumbuhan dan keberkahan jiwa yang suci',
      'Pembersihan dari dosa dan keburukan'
    ],
    etymologyNote: 'Secara etimologi, "Z-K-W" bermakna dasar "bertambah, tumbuh subur, dan bersih suci" (النماوة والزكاء والطهارة). Harta yang dizakati diyakini tumbuh bersih dari keburukan.',
    totalOccurrences: 59,
    verbsCount: 27,
    nounsCount: 32,
    tags: ['zakat', 'zakah', 'jakat', 'z-k-w', 'suci', 'tumbuh', 'pembayaran', 'purity', 'charity', 'زكاة', 'ز-ك-و'],
    verbs: [
      {
        id: 'zkw-v1',
        arabic: 'زَكَّىٰ',
        transliteration: 'zakkaa',
        type: 'verb',
        form: 'Form II',
        posTag: 'Fi\'il Madhi (Form II - Menyucikan)',
        meaningIndo: 'Ia telah menyucikan',
        frequency: 9
      }
    ],
    nouns: [
      {
        id: 'zkw-n1',
        arabic: 'الزَّكَاةَ',
        transliteration: 'az-zakaah',
        type: 'noun',
        posTag: 'Isim (Zakat Wajib)',
        meaningIndo: 'Zakat wajib penyuci harta',
        frequency: 32
      },
      {
        id: 'zkw-n2',
        arabic: 'زَكِيَّةً',
        transliteration: 'zakiyyatan',
        type: 'noun',
        posTag: 'Isim Sifat (Suci/Bersih)',
        meaningIndo: 'Jiwa yang suci / bersih',
        frequency: 2
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 43,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
        verseIndo: 'Dan laksanakanlah salat, tunaikanlah zakat, dan rukuklah beserta orang-orang yang rukuk.',
        matchedWordArabic: 'الزَّكَاةَ',
        matchedWordIndo: 'zakat',
        wordLocation: '2:43:4'
      }
    ]
  },
  {
    id: 'w-q-y',
    rootArabic: 'و ق ي',
    rootArabicJoined: 'تقوى',
    rootLatin: 'taqwa',
    titleIndo: 'Taqwa / Takwa / Perlindungan Diri',
    titleEnglish: 'Taqwa / Piety / Protection / Guard',
    meaningsIndonesian: [
      'Memelihara diri dari azab Allah dengan menjalankan perintah-Nya',
      'Perlindungan dan perisai dari bahaya keburukan',
      'Ketaatan yang bersumber dari rasa takut dan hormat'
    ],
    etymologyNote: 'Secara etimologi, "W-Q-Y" bermakna dasar "membuat benteng/perisai pelindung antara dua hal" (الوقاية والحرص). Takwa adalah perisai pelindung amal yang menjaga hamba dari api neraka.',
    totalOccurrences: 258,
    verbsCount: 177,
    nounsCount: 81,
    tags: ['taqwa', 'takwa', 'taqwaa', 'w-q-y', 'pelihara', 'perisai', 'piety', 'guard', 'تقوى', 'و-ق-ي'],
    verbs: [
      {
        id: 'wqy-v1',
        arabic: 'اتَّقَىٰ',
        transliteration: 'ittaqaa',
        type: 'verb',
        form: 'Form VIII',
        posTag: 'Fi\'il Madhi (Form VIII - Bertakwa)',
        meaningIndo: 'Ia telah bertakwa / memelihara diri',
        frequency: 82
      },
      {
        id: 'wqy-v2',
        arabic: 'اتَّقُوا',
        transliteration: 'ittaquu',
        type: 'verb',
        form: 'Form VIII',
        posTag: 'Fi\'il Amr Jamak',
        meaningIndo: 'Bertakwalah kamu sekalian!',
        frequency: 79
      }
    ],
    nouns: [
      {
        id: 'wqy-n1',
        arabic: 'تَقْوَىٰ',
        transliteration: 'taqwaa',
        type: 'noun',
        posTag: 'Masdar (Ketaqwaan)',
        meaningIndo: 'Ketakwaan / Perisai jiwa',
        frequency: 17
      },
      {
        id: 'wqy-n2',
        arabic: 'الْمُتَّقِينَ',
        transliteration: 'al-muttaqiin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak',
        meaningIndo: 'Orang-orang yang bertakwa',
        frequency: 49
      }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 197,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ ۚ وَاتَّقُونِ يَا أُولِي الْأَلْبَابِ',
        verseIndo: 'Bawalah bekal, karena sesungguhnya sebaik-baik bekal adalah takwa. Dan bertakwalah kepada-Ku wahai orang-orang yang berakal!',
        matchedWordArabic: 'التَّقْوَىٰ',
        matchedWordIndo: 'takwa',
        wordLocation: '2:197:6'
      }
    ]
  },
  {
    id: 's-r-k',
    rootArabic: 'ش ر ك',
    rootArabicJoined: 'شرك',
    rootLatin: 'syirik',
    titleIndo: 'Syirik / Sekutu / Persekutuan',
    titleEnglish: 'Association / Partner / Polytheism',
    meaningsIndonesian: [
      'Menyamakan sesuatu selain Allah dalam ibadah',
      'Persekutuan atau kepemilikan bersama',
      'Dosa besar menyekutukan Allah'
    ],
    etymologyNote: 'Secara etimologi, "S-R-K" bermakna dasar "pembagian saham/persekutuan dua pihak atau lebih" (المشاركة). Syirik dalam aqidah berarti membagi ketuhanan Allah dengan makhluk.',
    totalOccurrences: 168,
    verbsCount: 38,
    nounsCount: 130,
    tags: ['syirik', 'shirk', 'sirk', 's-r-k', 'sekutu', 'mensekutukan', 'polytheism', 'شرك', 'ش-ر-ك'],
    verbs: [
      {
        id: 'srk-v1',
        arabic: 'أَشْرَكَ',
        transliteration: 'ashraka',
        type: 'verb',
        form: 'Form IV',
        posTag: 'Fi\'il Madhi (Menyertakan Sekutu)',
        meaningIndo: 'Ia telah menyekutukan Allah',
        frequency: 25
      }
    ],
    nouns: [
      {
        id: 'srk-n1',
        arabic: 'شِرْكٌ',
        transliteration: 'shirkun',
        type: 'noun',
        posTag: 'Masdar (Syirik)',
        meaningIndo: 'Perbuatan Syirik / Menyertakan sekutu',
        frequency: 5
      },
      {
        id: 'srk-n2',
        arabic: 'الْمُشْرِكِينَ',
        transliteration: 'al-mushrikiin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak',
        meaningIndo: 'Orang-orang musyrik',
        frequency: 45
      }
    ],
    occurrences: [
      {
        surahNumber: 4,
        ayahNumber: 48,
        surahNameIndo: 'An-Nisa\'',
        surahNameArabic: 'النساء',
        verseArabic: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ',
        verseIndo: 'Sesungguhnya Allah tidak akan mengampuni dosa syirik, dan Dia mengampuni segala dosa yang selain dari (syirik) itu bagi siapa yang Dia kehendaki.',
        matchedWordArabic: 'أَن يُشْرَكَ',
        matchedWordIndo: 'dosa syirik',
        wordLocation: '4:48:5'
      }
    ]
  },
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
        arabic: 'الصَّابِرِينَ',
        transliteration: 'as-saabiriin',
        type: 'noun',
        posTag: 'Isim Fa\'il Jamak (Orang-orang yang Sabar)',
        meaningIndo: 'Orang-orang yang senantiasa bersabar',
        frequency: 32
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
      'Tanda atau kejelasan penunjuk jalan'
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
      'Rahim ibu (hubungan kekerabatan/silaturahmi)'
    ],
    etymologyNote: 'Akar "ر-ح-م" bermakna dasar kelembutan dan kasih yang mengayomi, bersumber dari nama Allah Ar-Rahman & Ar-Rahim.',
    totalOccurrences: 339,
    verbsCount: 65,
    nounsCount: 274,
    tags: ['rahima', 'r-h-m', 'rahmah', 'rahmat', 'kasih', 'sayang', 'rahim', 'mercy', 'compassion', 'رحم', 'ر-ح-م'],
    verbs: [],
    nouns: [
      {
        id: 'rhm-n1',
        arabic: 'رَحْمَةٌ',
        transliteration: 'rahmatun',
        type: 'noun',
        posTag: 'Masdar (Rahmat / Karunia)',
        meaningIndo: 'Rahmat / Kasih sayang',
        frequency: 114
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
  }
];
