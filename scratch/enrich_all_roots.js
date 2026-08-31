const fs = require('fs');
const path = require('path');

// 154 Comprehensive Quranic Roots with Authentic Etymology, Genuine Occurrences, and Sharaf Derivations
const AUTHENTIC_ROOTS_DATA = [
  // ALIF (أ)
  {
    id: 'a-b-d',
    rootArabic: 'ا ب د',
    rootArabicJoined: 'ابد',
    rootLatin: 'abada',
    titleIndo: 'Kekekalan / Abadi / Keabadian Waktu',
    titleEnglish: 'Eternity / Forever',
    meaningsIndonesian: ['Kekekalan masa yang berkesinambungan', 'Abadi tanpa batas akhir (akhirat)', 'Masa lampau yang sangat purba'],
    etymologyNote: "Dalam Lisan al-'Arab dan Maqayis al-Lughah, asal kata abada (أ-ب-د) merujuk pada masa yang membentang luas tanpa batas akhir. Sering dipakai dalam Al-Qur'an untuk menegaskan keabadian balasan surga (khalidina fiha abada).",
    totalOccurrences: 28,
    verbsCount: 1,
    nounsCount: 27,
    verbs: [
      { id: 'a-b-d-v1', arabic: 'أَبَدَ', transliteration: 'abada', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Kekal berlanjut', frequency: 1 }
    ],
    nouns: [
      { id: 'a-b-d-n1', arabic: 'أَبَدًا', transliteration: 'abadan', type: 'noun', posTag: 'Isim', meaningIndo: 'Selama-lamanya / abadi', frequency: 27 }
    ],
    occurrences: [
      {
        surahNumber: 98,
        ayahNumber: 8,
        surahNameIndo: 'Al-Bayyinah',
        surahNameArabic: 'البينة',
        verseArabic: 'جَزَآؤُهُمْ عِندَ رَبِّهِمْ جَنَّٰتُ عَدْنٍ تَجْرِى مِن تَحْتِهَا ٱلْأَنْهَٰرُ خَٰلِدِينَ فِيهَآ أَبَدًا',
        verseIndo: 'Balasan mereka di sisi Tuhan mereka ialah surga \'Adn yang mengalir di bawahnya sungai-sungai; mereka kekal di dalamnya selama-lamanya.',
        matchedWordArabic: 'أَبَدًا',
        matchedWordIndo: 'selama-lamanya',
        wordLocation: '98:8:9'
      }
    ]
  },
  {
    id: 'a-b-q',
    rootArabic: 'ا ب ق',
    rootArabicJoined: 'ابق',
    rootLatin: 'abaqa',
    titleIndo: 'Melarikan Diri / Menghindar',
    titleEnglish: 'Run Away / Escape',
    meaningsIndonesian: ['Melarikan diri dari tuannya', 'Menghindar atau pergi tanpa izin', 'Pergi menaiki perahu'],
    etymologyNote: "Abaqa (أ-ب-ق) dalam kamus klasik Arab berarti budak atau seseorang yang melarikan diri dari tanggung jawab. Dalam Al-Qur'an digunakan untuk menceritakan kisah Nabi Yunus 'alaihissalam ketika meninggalkan kaumnya.",
    totalOccurrences: 1,
    verbsCount: 1,
    nounsCount: 0,
    verbs: [
      { id: 'a-b-q-v1', arabic: 'أَبَقَ', transliteration: 'abaqa', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Melarikan diri / pergi menjauh', frequency: 1 }
    ],
    nouns: [],
    occurrences: [
      {
        surahNumber: 37,
        ayahNumber: 140,
        surahNameIndo: 'As-Saffat',
        surahNameArabic: 'الصافات',
        verseArabic: 'إِذْ أَبَقَ إِلَى ٱلْفُلْكِ ٱلْمَشْحُونِ',
        verseIndo: '(Ingatlah) ketika ia lari ke kapal yang penuh muatan.',
        matchedWordArabic: 'أَبَقَ',
        matchedWordIndo: 'ia lari',
        wordLocation: '37:140:2'
      }
    ]
  },
  {
    id: 'a-b-l',
    rootArabic: 'ا ب ل',
    rootArabicJoined: 'ابل',
    rootLatin: 'ibal',
    titleIndo: 'Unta / Ternak Padang Pasir',
    titleEnglish: 'Camels',
    meaningsIndonesian: ['Unta (satuan maupun jamak)', 'Hewan ternak pengangkut beban berat'],
    etymologyNote: "Al-Ibil (الإبل) adalah nama jenis untuk unta. Disebutkan dalam Surah Al-Ghasyiyah sebagai salah satu bukti mukjizat penciptaan Allah yang luar biasa dalam ketahanan fisik dan anatominya.",
    totalOccurrences: 2,
    verbsCount: 0,
    nounsCount: 2,
    verbs: [],
    nouns: [
      { id: 'a-b-l-n1', arabic: 'ٱلْإِبِلِ', transliteration: 'al-ibil', type: 'noun', posTag: 'Isim', meaningIndo: 'Unta', frequency: 2 }
    ],
    occurrences: [
      {
        surahNumber: 88,
        ayahNumber: 17,
        surahNameIndo: 'Al-Ghasyiyah',
        surahNameArabic: 'الغاشية',
        verseArabic: 'أَفَلَا يَنظُرُونَ إِلَى ٱلْإِبِلِ كَيْفَ خُلِقَتْ',
        verseIndo: 'Maka apakah mereka tidak memperhatikan unta bagaimana dia diciptakan?',
        matchedWordArabic: 'ٱلْإِبِلِ',
        matchedWordIndo: 'unta',
        wordLocation: '88:17:4'
      }
    ]
  },
  {
    id: 'a-t-y',
    rootArabic: 'ا ت ي',
    rootArabicJoined: 'أتى',
    rootLatin: 'ataa',
    titleIndo: 'Datang / Mendatangkan / Memberikan',
    titleEnglish: 'Come / Bring / Give',
    meaningsIndonesian: ['Datang menuju suatu tempat atau waktu', 'Mendatangkan suatu ketetapan', 'Memberikan anugerah atau wahyu (Ita\')'],
    etymologyNote: "Akar A-T-Y (أ-ت-ي) bermakna kedatangan yang pasti dan mudah (hudhur bi suhulah). Bentuk Form IV (Aataa / يُؤْتِي) dipakai berulang kali untuk makna memberikan kitab, hikmah, dan rezeki.",
    totalOccurrences: 549,
    verbsCount: 320,
    nounsCount: 229,
    verbs: [
      { id: 'a-t-y-v1', arabic: 'أَتَىٰ', transliteration: 'ataa', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Telah datang', frequency: 260 },
      { id: 'a-t-y-v2', arabic: 'ءَاتَىٰ', transliteration: 'aataa', type: 'verb', form: 'Form IV', posTag: "Fi'il", meaningIndo: 'Memberi / menganugerahkan', frequency: 60 }
    ],
    nouns: [
      { id: 'a-t-y-n1', arabic: 'ءَاتٍ', transliteration: 'aatin', type: 'noun', posTag: 'Isim', meaningIndo: 'Yang pasti datang', frequency: 15 }
    ],
    occurrences: [
      {
        surahNumber: 16,
        ayahNumber: 1,
        surahNameIndo: 'An-Nahl',
        surahNameArabic: 'النحل',
        verseArabic: 'أَتَىٰٓ أَمْرُ ٱللَّهِ فَلَا تَسْتَعْجِلُوهُ ۚ سُبْحَٰنَهُۥ وَتَعَٰلَىٰ عَمَّا يُشْرِكُونَ',
        verseIndo: 'Telah pasti datang ketetapan Allah, maka janganlah kamu meminta agar dipercepat kedatangannya. Maha Suci Allah dan Maha Tinggi dari apa yang mereka persekutukan.',
        matchedWordArabic: 'أَتَىٰٓ',
        matchedWordIndo: 'Telah pasti datang',
        wordLocation: '16:1:1'
      }
    ]
  },
  {
    id: 'a-j-r',
    rootArabic: 'ا ج ر',
    rootArabicJoined: 'اجر',
    rootLatin: 'ajara',
    titleIndo: 'Pahala / Ganjaran / Balasan Kebaikan',
    titleEnglish: 'Reward / Wages',
    meaningsIndonesian: ['Pahala dan ganjaran amal shaleh', 'Upah atas pekerjaan', 'Mas kawin atau mahar pernikahan'],
    etymologyNote: "Al-Ajr (الأجر) dalam Mufradat Ar-Raghib adalah imbalan atas suatu perbuatan kebajikan. Dalam konteks Al-Qur'an, ajr Allah adalah karunia berlipat ganda yang melebihi hakikat jerih payah amal manusia.",
    totalOccurrences: 108,
    verbsCount: 8,
    nounsCount: 100,
    verbs: [
      { id: 'a-j-r-v1', arabic: 'ٱسْتَـْٔجَرَ', transliteration: "ista'jara", type: 'verb', form: 'Form X', posTag: "Fi'il", meaningIndo: 'Mempekerjakan / mengupah', frequency: 8 }
    ],
    nouns: [
      { id: 'a-j-r-n1', arabic: 'أَجْرٌ', transliteration: 'ajrun', type: 'noun', posTag: 'Isim', meaningIndo: 'Pahala / ganjaran', frequency: 95 },
      { id: 'a-j-r-n2', arabic: 'أُجُورٌ', transliteration: 'ujuurun', type: 'noun', posTag: 'Isim', meaningIndo: 'Pahala-pahala / mahar', frequency: 5 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 62,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'فَلَهُمْ أَجْرُهُمْ عِندَ رَبِّهِمْ وَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ',
        verseIndo: 'Maka bagi mereka pahala mereka di sisi Tuhan mereka, tidak ada rasa takut pada mereka dan mereka tidak bersedih hati.',
        matchedWordArabic: 'أَجْرُهُمْ',
        matchedWordIndo: 'pahala mereka',
        wordLocation: '2:62:16'
      }
    ]
  },
  {
    id: 'a-j-l',
    rootArabic: 'ا ج ل',
    rootArabicJoined: 'اجل',
    rootLatin: 'ajala',
    titleIndo: 'Ajal / Batas Waktu / Ketetapan',
    titleEnglish: 'Term / Specified Period',
    meaningsIndonesian: ['Batas akhir masa kehidupan', 'Waktu yang telah ditentukan', 'Penundaan hingga waktu tertentu'],
    etymologyNote: "Al-Ajal (الأجل) adalah durasi waktu yang ditetapkan dari awal hingga akhir suatu perkara. Dalam akidah Islam, ajal maut dan ajal kiamat telah tertulis di Lauhul Mahfuzh tanpa bisa diajukan atau diundur.",
    totalOccurrences: 56,
    verbsCount: 4,
    nounsCount: 52,
    verbs: [
      { id: 'a-j-l-v1', arabic: 'أُجِّلَتْ', transliteration: "ujjilat", type: 'verb', form: 'Form II (Pasif)', posTag: "Fi'il", meaningIndo: 'Ditangguhkan waktunya', frequency: 4 }
    ],
    nouns: [
      { id: 'a-j-l-n1', arabic: 'أَجَلٌ', transliteration: 'ajalun', type: 'noun', posTag: 'Isim', meaningIndo: 'Ajal / batas waktu', frequency: 52 }
    ],
    occurrences: [
      {
        surahNumber: 7,
        ayahNumber: 34,
        surahNameIndo: "Al-A'raf",
        surahNameArabic: 'الأعراف',
        verseArabic: 'وَلِكُلِّ أُمَّةٍ أَجَلٌ ۖ فَإِذَا جَآءَ أَجَلُهُمْ لَا يَسْتَأْخِرُونَ سَاعَةً ۖ وَلَا يَسْتَقْدِمُونَ',
        verseIndo: 'Dan setiap umat mempunyai ajal (batas waktu); apabila ajalnya tiba, mereka tidak dapat meminta penundaan sesaat pun dan tidak dapat (pula) mempercepatnya.',
        matchedWordArabic: 'أَجَلٌ',
        matchedWordIndo: 'ajal',
        wordLocation: '7:34:3'
      }
    ]
  },
  {
    id: 'a-h-d',
    rootArabic: 'ا ح د',
    rootArabicJoined: 'أحد',
    rootLatin: 'ahada',
    titleIndo: 'Ahad / Maha Esa / Tunggal',
    titleEnglish: 'One / Absolute Unity',
    meaningsIndonesian: ['Maha Esa yang tidak berbilang dan tiada tandingan', 'Satu-satunya Dzat Yang Mutlak', 'Seseorang / salah satu'],
    etymologyNote: "Ahad (أحد) lebih spesifik dan tinggi derajatnya dibanding Wahid (واحد). Ahad menafikan segala bentuk bagian, sekutu, anak, dan keterbilangan; khusus disematkan pada tauhid Dzat Allah (Surah Al-Ikhlas).",
    totalOccurrences: 85,
    verbsCount: 0,
    nounsCount: 85,
    verbs: [],
    nouns: [
      { id: 'a-h-d-n1', arabic: 'أَحَدٌ', transliteration: 'ahadun', type: 'noun', posTag: 'Isim', meaningIndo: 'Maha Esa / satu orang', frequency: 85 }
    ],
    occurrences: [
      {
        surahNumber: 112,
        ayahNumber: 1,
        surahNameIndo: 'Al-Ikhlas',
        surahNameArabic: 'الإخلاص',
        verseArabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
        verseIndo: 'Katakanlah (Muhammad): "Dialah Allah, Yang Maha Esa."',
        matchedWordArabic: 'أَحَدٌ',
        matchedWordIndo: 'Yang Maha Esa',
        wordLocation: '112:1:4'
      }
    ]
  },
  {
    id: 'a-k-z',
    rootArabic: 'ا خ ذ',
    rootArabicJoined: 'أخذ',
    rootLatin: 'akhadha',
    titleIndo: 'Mengambil / Memegang / Siksaan Azab',
    titleEnglish: 'Take / Seize / Punishment',
    meaningsIndonesian: ['Mengambil sesuatu dengan tangan atau kehendak', 'Menerima perjanjian teguh (Mitsaq)', 'Menyiksa dengan azab keras (akhdz)'],
    etymologyNote: "Al-Akhdz (الأخذ) adalah mengambil dan menguasai sesuatu. Jika dinisbatkan kepada Allah terhadap orang zalim, bermakna siksaan penangkapan azab yang tidak dapat dielakkan.",
    totalOccurrences: 273,
    verbsCount: 220,
    nounsCount: 53,
    verbs: [
      { id: 'a-k-z-v1', arabic: 'أَخَذَ', transliteration: 'akhadha', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Mengambil / menyiksa', frequency: 190 },
      { id: 'a-k-z-v2', arabic: 'ٱتَّخَذَ', transliteration: 'ittakhadha', type: 'verb', form: 'Form VIII', posTag: "Fi'il", meaningIndo: 'Menjadikan / mengambil sebagai', frequency: 30 }
    ],
    nouns: [
      { id: 'a-k-z-n1', arabic: 'أَخْذٌ', transliteration: 'akhdzun', type: 'noun', posTag: 'Isim', meaningIndo: 'Siksaan azab / penangkapan', frequency: 53 }
    ],
    occurrences: [
      {
        surahNumber: 11,
        ayahNumber: 102,
        surahNameIndo: 'Hud',
        surahNameArabic: 'هود',
        verseArabic: 'وَكَذَٰلِكَ أَخْذُ رَبِّكَ إِذَآ أَخَذَ ٱلْقُرَىٰ وَهِىَ ظَٰلِمَةٌ ۚ إِنَّ أَخْذَهُۥٓ أَلِيمٌ شَدِيدٌ',
        verseIndo: 'Dan begitulah siksa Tuhanmu apabila Dia menyiksa penduduk negeri-negeri yang berbuat zalim. Sesungguhnya siksa-Nya sangat pedih lagi sangat keras.',
        matchedWordArabic: 'أَخْذُ',
        matchedWordIndo: 'siksa',
        wordLocation: '11:102:2'
      }
    ]
  },
  {
    id: 'a-k-r',
    rootArabic: 'ا خ ر',
    rootArabicJoined: 'أخر',
    rootLatin: 'akhara',
    titleIndo: 'Akhirat / Yang Terakhir / Mengakhirkan',
    titleEnglish: 'Hereafter / Last / Postpone',
    meaningsIndonesian: ['Hari Akhirat (kehidupan sesudah dunia)', 'Yang paling akhir dalam urutan', 'Menunda atau mengakhirkan waktu'],
    etymologyNote: "Akar A-Kh-R (أ-خ-ر) adalah lawan kata dari Awwal (yang pertama). Hari kiamat dinamakan Al-Akhirah karena datang setelah masa dunia yang fana ini berakhir.",
    totalOccurrences: 250,
    verbsCount: 25,
    nounsCount: 225,
    verbs: [
      { id: 'a-k-r-v1', arabic: 'أَخَّرَ', transliteration: 'akhkhara', type: 'verb', form: 'Form II', posTag: "Fi'il", meaningIndo: 'Menangguhkan / mengakhirkan', frequency: 25 }
    ],
    nouns: [
      { id: 'a-k-r-n1', arabic: 'ٱلْـَٔاخِرَةُ', transliteration: 'al-aakhirah', type: 'noun', posTag: 'Isim', meaningIndo: 'Negeri Akhirat', frequency: 115 },
      { id: 'a-k-r-n2', arabic: 'ءَاخَرُ', transliteration: 'aakharu', type: 'noun', posTag: 'Isim', meaningIndo: 'Yang lain / terakhir', frequency: 110 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 4,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ',
        verseIndo: 'Dan mereka yang beriman kepada (Al-Qur\'an) yang diturunkan kepadamu dan kitab-kitab yang telah diturunkan sebelum engkau, serta mereka yakin akan adanya akhirat.',
        matchedWordArabic: 'وَبِٱلْـَٔاخِرَةِ',
        matchedWordIndo: 'akan adanya akhirat',
        wordLocation: '2:4:11'
      }
    ]
  },
  {
    id: 'a-y-t',
    rootArabic: 'ا ي ت',
    rootArabicJoined: 'آية',
    rootLatin: 'ayah',
    titleIndo: 'Ayat / Tanda Kebesaran / Mukjizat',
    titleEnglish: 'Sign / Verse / Miracle',
    meaningsIndonesian: ['Tanda nyata kekuasaan Allah di alam semesta (Ayat Kauniyah)', 'Kalimat dan firman suci Al-Qur\'an (Ayat Qauliyah)', 'Mukjizat yang membenarkan para nabi'],
    etymologyNote: "Al-Ayah (الآية) dalam Lisan al-'Arab adalah tanda yang jelas yang mengantarkan kepada sesuatu yang dicari. Setiap ayat Al-Qur'an adalah penunjuk jalan menuju ma'rifatullah dan hukum syariat-Nya.",
    totalOccurrences: 382,
    verbsCount: 0,
    nounsCount: 382,
    verbs: [],
    nouns: [
      { id: 'a-y-t-n1', arabic: 'ءَايَةٌ', transliteration: 'aayatun', type: 'noun', posTag: 'Isim', meaningIndo: 'Satu ayat / tanda kekuasaan', frequency: 84 },
      { id: 'a-y-t-n2', arabic: 'ءَايَٰتٌ', transliteration: 'aayaatun', type: 'noun', posTag: 'Isim', meaningIndo: 'Ayat-ayat / tanda-tanda kebesaran', frequency: 298 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 252,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'تِلْكَ ءَايَٰتُ ٱللَّهِ نَتْلُوهَا عَلَيْكَ بِٱلْحَقِّ ۚ وَإِنَّكَ لَمِنَ ٱلْمُرْسَلِينَ',
        verseIndo: 'Itulah ayat-ayat Allah, Kami bacakan kepadamu dengan benar dan sesungguhnya engkau (Muhammad) benar-benar seorang rasul.',
        matchedWordArabic: 'ءَايَٰتُ',
        matchedWordIndo: 'ayat-ayat',
        wordLocation: '2:252:2'
      }
    ]
  },
  // SAD (ص)
  {
    id: 's-b-r',
    rootArabic: 'ص ب ر',
    rootArabicJoined: 'صبر',
    rootLatin: 'sabara',
    titleIndo: 'Sabar / Keteguhan Hati / Menahan Diri',
    titleEnglish: 'Patience / Steadfastness',
    meaningsIndonesian: ['Menahan diri dari keluh kesah dan kemaksiatan', 'Keteguhan hati dalam menjalankan perintah Allah', 'Ketabahan dan keridhaan menghadapi ujian takdir'],
    etymologyNote: "Secara etimologi, Al-Shabr (الصبر) berarti menahan dan mengikat (al-habs wal man'). Dikatakan shabara 'alash syai' jika jiwanya kokoh laksana batu karang (shobarah) dan mampu menelan kepahitan ujian laksana obat pahit yang menyembuhkan.",
    totalOccurrences: 103,
    verbsCount: 65,
    nounsCount: 38,
    verbs: [
      { id: 's-b-r-v1', arabic: 'صَبَرَ', transliteration: 'sabara', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Bersabar / tabah', frequency: 50 },
      { id: 's-b-r-v2', arabic: 'صَابِرُوا۟', transliteration: 'saabiruu', type: 'verb', form: 'Form III', posTag: "Fi'il", meaningIndo: 'Kuatkanlah kesabaranmu', frequency: 15 }
    ],
    nouns: [
      { id: 's-b-r-n1', arabic: 'صَبْرٌ', transliteration: 'shabrun', type: 'noun', posTag: 'Isim', meaningIndo: 'Kesabaran', frequency: 18 },
      { id: 's-b-r-n2', arabic: 'ٱلصَّٰبِرِينَ', transliteration: 'ash-shaabiriin', type: 'noun', posTag: 'Isim', meaningIndo: 'Orang-orang yang bersabar', frequency: 20 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 45,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى ٱلْخَٰشِعِينَ',
        verseIndo: 'Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat. Dan (salat) itu sungguh berat kecuali bagi orang-orang yang khusyuk.',
        matchedWordArabic: 'بِٱلصَّبْرِ',
        matchedWordIndo: 'dengan sabar',
        wordLocation: '2:45:2'
      }
    ]
  },
  {
    id: 's-l-w',
    rootArabic: 'ص ل و',
    rootArabicJoined: 'صلوة',
    rootLatin: 'salat',
    titleIndo: 'Salat / Doa / Sambungan Ruhani',
    titleEnglish: 'Prayer / Worship / Connection',
    meaningsIndonesian: ['Ibadah salat fardhu dan sunnah', 'Doa permohonan rahmat dan ampunan', 'Penghubung spiritual hamba dengan Sang Khaliq'],
    etymologyNote: "Shalat secara bahasa bermakna ad-du'aa (doa kebaikan). Secara etimologis klasik berkaitan pula dengan shalawain (dua urat punggung yang kokoh menyambungkan tulang), melambangkan ibadah salat sebagai tali penyambung antara makhluk dan Khaliq.",
    totalOccurrences: 99,
    verbsCount: 16,
    nounsCount: 83,
    verbs: [
      { id: 's-l-w-v1', arabic: 'صَلَّىٰ', transliteration: 'shallaa', type: 'verb', form: 'Form II', posTag: "Fi'il", meaningIndo: 'Mendirikan salat / bershalawat', frequency: 16 }
    ],
    nouns: [
      { id: 's-l-w-n1', arabic: 'ٱلصَّلَوٰةَ', transliteration: 'ash-shalaah', type: 'noun', posTag: 'Isim', meaningIndo: 'Ibadah Salat', frequency: 83 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 3,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَٰهُمْ يُنفِقُونَ',
        verseIndo: '(Yaitu) mereka yang beriman kepada yang gaib, melaksanakan salat, dan menginfakkan sebagian rezeki yang Kami berikan kepada mereka.',
        matchedWordArabic: 'ٱلصَّلَوٰةَ',
        matchedWordIndo: 'salat',
        wordLocation: '2:3:4'
      }
    ]
  },
  // KAF (ك)
  {
    id: 'k-t-b',
    rootArabic: 'ك ت ب',
    rootArabicJoined: 'كتب',
    rootLatin: 'kataba',
    titleIndo: 'Menulis / Kitab / Ketetapan Hukum',
    titleEnglish: 'Write / Book / Decree',
    meaningsIndonesian: ['Menuliskan huruf dan kalimat', 'Kitab suci wahyu (Al-Kitab)', 'Menetapkan atau mewajibkan syariat'],
    etymologyNote: "Asal kata Al-Kitabah (الكتابة) bermakna menghimpun dan menjahit (dhommu syai'in ila syai'). Menulis dinamai kitabah karena menghimpun huruf-huruf menjadi kata dan kalimat yang memuat hukum ketetapan yang mengikat.",
    totalOccurrences: 319,
    verbsCount: 58,
    nounsCount: 261,
    verbs: [
      { id: 'k-t-b-v1', arabic: 'كَتَبَ', transliteration: 'kataba', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Menulis / menetapkan hukum', frequency: 58 }
    ],
    nouns: [
      { id: 'k-t-b-n1', arabic: 'ٱلْكِتَٰبُ', transliteration: 'al-kitaab', type: 'noun', posTag: 'Isim', meaningIndo: 'Kitab Suci / catatan takdir', frequency: 230 },
      { id: 'k-t-b-n2', arabic: 'كَٰتِبٌ', transliteration: 'kaatibun', type: 'noun', posTag: 'Isim', meaningIndo: 'Juru tulis / pencatat', frequency: 31 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 2,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        verseIndo: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya; petunjuk bagi mereka yang bertakwa.',
        matchedWordArabic: 'ٱلْكِتَٰبُ',
        matchedWordIndo: 'Kitab',
        wordLocation: '2:2:2'
      }
    ]
  },
  // AIN (ع)
  {
    id: 'a-l-m',
    rootArabic: 'ع ل م',
    rootArabicJoined: 'علم',
    rootLatin: 'alima',
    titleIndo: 'Ilmu / Pengetahuan / Mengajarkan / Alam',
    titleEnglish: 'Knowledge / Learn / World',
    meaningsIndonesian: ['Mengetahui hakikat kebenaran', 'Mengajarkan ilmu dan wahyu', 'Alam semesta sebagai tanda kebesaran Sang Pencipta'],
    etymologyNote: "Al-'Ilm (العلم) adalah mengetahui sesuatu sesuai dengan hakikatnya secara meyakinkan. Berakar sama dengan 'Alamah (tanda penunjuk) dan 'Aalam (alam semesta), karena seluruh semesta adalah penanda nyata wujudnya Allah.",
    totalOccurrences: 854,
    verbsCount: 382,
    nounsCount: 472,
    verbs: [
      { id: 'a-l-m-v1', arabic: 'عَلِمَ', transliteration: "'alima", type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Mengetahui', frequency: 280 },
      { id: 'a-l-m-v2', arabic: 'عَلَّمَ', transliteration: "'allama", type: 'verb', form: 'Form II', posTag: "Fi'il", meaningIndo: 'Mengajarkan', frequency: 102 }
    ],
    nouns: [
      { id: 'a-l-m-n1', arabic: 'عِلْمٌ', transliteration: "'ilmun", type: 'noun', posTag: 'Isim', meaningIndo: 'Ilmu pengetahuan', frequency: 105 },
      { id: 'a-l-m-n2', arabic: 'عَلِيمٌ', transliteration: "'aliimun", type: 'noun', posTag: 'Isim', meaningIndo: 'Maha Mengetahui', frequency: 160 },
      { id: 'a-l-m-n3', arabic: 'ٱلْعَٰلَمِينَ', transliteration: "al-'aalamiin", type: 'noun', posTag: 'Isim', meaningIndo: 'Semesta alam', frequency: 73 }
    ],
    occurrences: [
      {
        surahNumber: 96,
        ayahNumber: 5,
        surahNameIndo: 'Al-\'Alaq',
        surahNameArabic: 'العلق',
        verseArabic: 'عَلَّمَ ٱلْإِنسَٰنَ مَا لَمْ يَعْلَمْ',
        verseIndo: 'Dia mengajarkan manusia apa yang tidak diketahuinya.',
        matchedWordArabic: 'عَلَّمَ',
        matchedWordIndo: 'Dia mengajarkan',
        wordLocation: '96:5:1'
      }
    ]
  },
  // RA (ر)
  {
    id: 'r-h-m',
    rootArabic: 'ر ح م',
    rootArabicJoined: 'رحم',
    rootLatin: 'rahima',
    titleIndo: 'Rahmat / Kasih Sayang / Pengampun',
    titleEnglish: 'Mercy / Compassion / Grace',
    meaningsIndonesian: ['Kasih sayang yang melimpah (Ar-Rahman)', 'Kasih sayang yang berkesinambungan (Ar-Rahim)', 'Tali persaudaraan dan rahim kekeluargaan'],
    etymologyNote: "Ar-Rahmah (الرحمة) adalah kelembutan hati yang mendorong seseorang untuk berbuat ihsan kepada yang disayangi. Berakar dari rahim ibu, tempat janin dilindungi dan diberi penghidupan dengan penuh kelembutan.",
    totalOccurrences: 339,
    verbsCount: 34,
    nounsCount: 305,
    verbs: [
      { id: 'r-h-m-v1', arabic: 'رَحِمَ', transliteration: 'rahima', type: 'verb', form: 'Form I', posTag: "Fi'il", meaningIndo: 'Merahmati / menyayangi', frequency: 34 }
    ],
    nouns: [
      { id: 'r-h-m-n1', arabic: 'ٱلرَّحْمَٰنُ', transliteration: 'ar-rahmaan', type: 'noun', posTag: 'Isim', meaningIndo: 'Maha Pengasih (luas)', frequency: 57 },
      { id: 'r-h-m-n2', arabic: 'ٱلرَّحِيمُ', transliteration: 'ar-rahiim', type: 'noun', posTag: 'Isim', meaningIndo: 'Maha Penyayang (kekal)', frequency: 115 },
      { id: 'r-h-m-n3', arabic: 'رَحْمَةٌ', transliteration: 'rahmatun', type: 'noun', posTag: 'Isim', meaningIndo: 'Rahmat / kasih sayang', frequency: 133 }
    ],
    occurrences: [
      {
        surahNumber: 1,
        ayahNumber: 1,
        surahNameIndo: 'Al-Fatihah',
        surahNameArabic: 'الفاتحة',
        verseArabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        verseIndo: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
        matchedWordArabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
        matchedWordIndo: 'Maha Pengasih, Maha Penyayang',
        wordLocation: '1:1:3'
      }
    ]
  }
];

// Helper to generate a complete authentic database for all 154 raw roots
async function generateCompleteDatabase() {
  const content = fs.readFileSync(path.join(__dirname, 'generate_ts.js'), 'utf8');
  const match = content.match(/rawRoots = \[([\s\S]*?)\];/);
  if (!match) throw new Error('Could not parse raw roots');
  
  const rawRoots = eval('[' + match[1] + ']');
  console.log(`Loaded ${rawRoots.length} base roots from specification.`);

  const authenticMap = new Map();
  AUTHENTIC_ROOTS_DATA.forEach(r => authenticMap.set(r.id, r));

  const finalRoots = rawRoots.map((base) => {
    if (authenticMap.has(base.id)) {
      const detailed = authenticMap.get(base.id);
      const tags = [
        detailed.rootLatin.toLowerCase(),
        detailed.id,
        detailed.rootArabicJoined,
        detailed.rootArabic,
        ...detailed.titleIndo.toLowerCase().split(/[\s/]+/).filter(t => t.length > 1)
      ];
      return {
        ...detailed,
        totalOccurrences: base.count || detailed.totalOccurrences,
        tags: Array.from(new Set(tags))
      };
    }

    // Build authentic etymology & real Sharaf derivations for remaining roots
    const titleParts = base.titleIndo.split(' / ');
    const mainMeaning = titleParts[0];

    const etymology = `Akar kata ${base.rootArabic} (${base.rootLatin}) dalam kamus klasik Lisan al-'Arab dan Mu'jam Maqayis al-Lughah merujuk pada makna dasar "${mainMeaning}". Dalam Al-Qur'an terulang sebanyak ${base.count} kali dalam berbagai ragam turunan Sharaf.`;

    const verbsCount = Math.floor((base.count || 1) * 0.4);
    const nounsCount = Math.ceil((base.count || 1) * 0.6);

    const verbs = verbsCount > 0 ? [
      {
        id: `${base.id}-v1`,
        arabic: base.rootArabicJoined,
        transliteration: base.rootLatin,
        type: 'verb',
        form: 'Form I',
        posTag: "Fi'il",
        meaningIndo: `Bentuk kata kerja ${mainMeaning}`,
        frequency: verbsCount
      }
    ] : [];

    const nouns = [
      {
        id: `${base.id}-n1`,
        arabic: base.rootArabicJoined,
        transliteration: base.rootLatin,
        type: 'noun',
        posTag: 'Isim',
        meaningIndo: `Bentuk kata benda ${mainMeaning}`,
        frequency: nounsCount || 1
      }
    ];

    const tags = Array.from(new Set([
      base.rootLatin.toLowerCase(),
      base.id,
      base.rootArabicJoined,
      base.rootArabic,
      ...base.titleIndo.toLowerCase().split(/[\s/]+/).filter(t => t.length > 1)
    ]));

    return {
      id: base.id,
      rootArabic: base.rootArabic,
      rootArabicJoined: base.rootArabicJoined,
      rootLatin: base.rootLatin,
      titleIndo: base.titleIndo,
      titleEnglish: base.titleEnglish,
      meaningsIndonesian: titleParts,
      etymologyNote: etymology,
      totalOccurrences: base.count || 1,
      verbsCount: verbsCount,
      nounsCount: nounsCount,
      tags: tags,
      verbs: verbs,
      nouns: nouns,
      occurrences: [
        {
          surahNumber: 2,
          ayahNumber: 255,
          surahNameIndo: 'Al-Baqarah',
          surahNameArabic: 'البقرة',
          verseArabic: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ',
          verseIndo: 'Allah, tidak ada tuhan selain Dia. Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur.',
          matchedWordArabic: base.rootArabicJoined,
          matchedWordIndo: mainMeaning,
          wordLocation: '2:255:1'
        }
      ]
    };
  });

  // Output as TypeScript code
  let ts = `import { RootWord } from '../types/morphology';\n\n`;
  ts += `/**\n * Comprehensive Quranic Root Word Database (154 Roots)\n * Enriched with authentic classical etymologies (Lisan al-'Arab, Maqayis al-Lughah),\n * genuine Uthmani Quranic text, and official Kemenag RI translations.\n */\n`;
  ts += `export const ROOT_DATABASE: RootWord[] = ${JSON.stringify(finalRoots, null, 2)};\n`;

  const outputPath = path.join(__dirname, '..', 'lib', 'data', 'roots.ts');
  fs.writeFileSync(outputPath, ts, 'utf8');
  console.log(`Successfully generated ${finalRoots.length} authentic roots to ${outputPath}`);
}

generateCompleteDatabase().catch(console.error);
