import { RootWord } from '../types/morphology';

export const ROOT_DATABASE: RootWord[] = [
  // 1. Salat / Sholat (ص-ل-و)
  {
    id: 's-l-w',
    rootArabic: 'ص ل و',
    rootArabicJoined: 'صلوة',
    rootLatin: 'salat',
    titleIndo: 'Salat / Sholat / Doa / Keagungan',
    titleEnglish: 'Prayer / Worship / Supplication',
    meaningsIndonesian: ['Ibadah Salat lima waktu', 'Doa permohonan kebaikan', 'Keagungan dan penghormatan', 'Hubungan langsung hamba dengan Allah'],
    etymologyNote: 'Secara etimologi, "ص-ل-و" bermakna dasar "hubungan yang mengikat erat dan tak terputus" (الصلة والإقبال).',
    totalOccurrences: 99,
    verbsCount: 16,
    nounsCount: 83,
    tags: ['salat', 'sholat', 'solat', 'shalat', 's-l-w', 'صلوة', 'ص-ل-و'],
    verbs: [{ id: 'slw-v1', arabic: 'صَلَّىٰ', transliteration: 'sallaa', type: 'verb', form: 'Form II', posTag: 'Fi\'il Madhi', meaningIndo: 'Melaksanakan salat', frequency: 12 }],
    nouns: [{ id: 'slw-n1', arabic: 'الصَّلَاةَ', transliteration: 'as-salaah', type: 'noun', posTag: 'Isim', meaningIndo: 'Ibadah Salat', frequency: 67 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 45, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', verseIndo: 'Dan mohonlah pertolongan (kepada Allah) dengan sabar dan salat.', matchedWordArabic: 'وَالصَّلَاةِ', matchedWordIndo: 'dan salat', wordLocation: '2:45:2' }]
  },

  // 2. Zakat (ز-ك-و)
  {
    id: 'z-k-w',
    rootArabic: 'ز ك و',
    rootArabicJoined: 'زكاة',
    rootLatin: 'zakat',
    titleIndo: 'Zakat / Pertumbuhan / Pembersihan Jiwa',
    titleEnglish: 'Zakat / Purity / Growth',
    meaningsIndonesian: ['Pemberian zakat penyuci harta', 'Pertumbuhan keberkahan jiwa', 'Pembersihan dari dosa'],
    etymologyNote: 'Secara etimologi, "Z-K-W" bermakna dasar "bertambah, tumbuh subur, dan bersih suci".',
    totalOccurrences: 59,
    verbsCount: 27,
    nounsCount: 32,
    tags: ['zakat', 'zakah', 'jakat', 'z-k-w', 'زكاة', 'ز-ك-و'],
    verbs: [{ id: 'zkw-v1', arabic: 'زَكَّىٰ', transliteration: 'zakkaa', type: 'verb', form: 'Form II', posTag: 'Fi\'il Madhi', meaningIndo: 'Menyucikan', frequency: 9 }],
    nouns: [{ id: 'zkw-n1', arabic: 'الزَّكَاةَ', transliteration: 'az-zakaah', type: 'noun', posTag: 'Isim', meaningIndo: 'Zakat wajib', frequency: 32 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 43, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ', verseIndo: 'Dan laksanakanlah salat, tunaikanlah zakat.', matchedWordArabic: 'الزَّكَاةَ', matchedWordIndo: 'zakat', wordLocation: '2:43:4' }]
  },

  // 3. Taqwa / Takwa (و-ق-ي)
  {
    id: 'w-q-y',
    rootArabic: 'و ق ي',
    rootArabicJoined: 'تقوى',
    rootLatin: 'taqwa',
    titleIndo: 'Taqwa / Takwa / Perisai Diri',
    titleEnglish: 'Taqwa / Piety / Guard',
    meaningsIndonesian: ['Memelihara diri dari azab Allah', 'Perlisai pelindung jiwa', 'Ketaatan penuh hormat'],
    etymologyNote: 'Secara etimologi, "W-Q-Y" bermakna dasar "membuat perisai pelindung antara dua hal".',
    totalOccurrences: 258,
    verbsCount: 177,
    nounsCount: 81,
    tags: ['taqwa', 'takwa', 'taqwaa', 'w-q-y', 'تقوى', 'و-ق-ي'],
    verbs: [{ id: 'wqy-v1', arabic: 'اتَّقَىٰ', transliteration: 'ittaqaa', type: 'verb', form: 'Form VIII', posTag: 'Fi\'il Madhi', meaningIndo: 'Bertakwa', frequency: 82 }],
    nouns: [{ id: 'wqy-n1', arabic: 'تَقْوَىٰ', transliteration: 'taqwaa', type: 'noun', posTag: 'Masdar', meaningIndo: 'Ketakwaan', frequency: 17 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 197, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ', verseIndo: 'Bawalah bekal, karena sesungguhnya sebaik-baik bekal adalah takwa.', matchedWordArabic: 'التَّقْوَىٰ', matchedWordIndo: 'takwa', wordLocation: '2:197:6' }]
  },

  // 4. Sabar (ص-ب-ر)
  {
    id: 's-b-r',
    rootArabic: 'ص ب ر',
    rootArabicJoined: 'صبر',
    rootLatin: 'sabar',
    titleIndo: 'Sabar / Ketabahan / Menahan Diri',
    titleEnglish: 'Patience / Steadfastness',
    meaningsIndonesian: ['Menahan jiwa dari kegelisahan', 'Ketabahan menghadapi ujian', 'Ketahanan moral yang kuat'],
    etymologyNote: 'Kata asal "صَبَر" (sobaro) merujuk pada batu yang sangat keras dan padat serta lidah buaya yang pahit.',
    totalOccurrences: 103,
    verbsCount: 46,
    nounsCount: 57,
    tags: ['sabar', 'sobar', 'sobaro', 'batu', 's-b-r', 'صبر', 'ص-ب-ر'],
    verbs: [{ id: 'sbr-v1', arabic: 'صَبَرَ', transliteration: 'sabara', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Bersabar', frequency: 24 }],
    nouns: [{ id: 'sbr-n1', arabic: 'صَبْرٌ', transliteration: 'sabrun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Kesabaran', frequency: 15 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 153, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', verseIndo: 'Wahai orang-orang yang beriman! Mohonlah pertolongan dengan sabar dan salat.', matchedWordArabic: 'بِالصَّبْرِ', matchedWordIndo: 'dengan sabar', wordLocation: '2:153:4' }]
  },

  // 5. Kitab / Tulis (ك-ت-ب)
  {
    id: 'k-t-b',
    rootArabic: 'ك ت ب',
    rootArabicJoined: 'كتب',
    rootLatin: 'kataba',
    titleIndo: 'Tulis / Kitab / Ketetapan Hukum',
    titleEnglish: 'Write / Book / Decree',
    meaningsIndonesian: ['Mengumpulkan huruf menjadi tulisan', 'Ketetapan hukum taklif', 'Kitab wahyu Al-Qur\'an'],
    etymologyNote: 'Bermakna dasar mengumpulkan sesuatu dengan ikatan.',
    totalOccurrences: 319,
    verbsCount: 58,
    nounsCount: 261,
    tags: ['kataba', 'kitab', 'tulis', 'k-t-b', 'كتب', 'ك-ت-ب'],
    verbs: [{ id: 'ktb-v1', arabic: 'كَتَبَ', transliteration: 'kataba', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Menulis / menetapkan', frequency: 56 }],
    nouns: [{ id: 'ktb-n1', arabic: 'كِتَابٌ', transliteration: 'kitaabun', type: 'noun', posTag: 'Isim', meaningIndo: 'Kitab', frequency: 230 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 2, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ', verseIndo: 'Kitab (Al-Qur\'an) ini tidak ada keraguan padanya.', matchedWordArabic: 'الْكِتَابُ', matchedWordIndo: 'Kitab', wordLocation: '2:2:2' }]
  },

  // 6. Ilmu (ع-ل-م)
  {
    id: 'a-l-m',
    rootArabic: 'ع ل م',
    rootArabicJoined: 'علم',
    rootLatin: 'alima',
    titleIndo: 'Ilmu / Pengetahuan / Alam',
    titleEnglish: 'Knowledge / Learn / World',
    meaningsIndonesian: ['Mengetahui hakikat kebenaran', 'Ilmu wawasan', 'Alam semesta dan tanda'],
    etymologyNote: 'Mencakup ilmu (pengetahuan) dan alam (tanda penunjuk).',
    totalOccurrences: 854,
    verbsCount: 382,
    nounsCount: 472,
    tags: ['alima', 'ilm', 'ilmu', 'alam', 'a-l-m', 'علم', 'ع-ل-م'],
    verbs: [{ id: 'alm-v1', arabic: 'عَلِمَ', transliteration: 'alima', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Mengetahui', frequency: 140 }],
    nouns: [{ id: 'alm-n1', arabic: 'عِلْمٌ', transliteration: 'ilmun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Ilmu', frequency: 105 }],
    occurrences: [{ surahNumber: 96, ayahNumber: 4, surahNameIndo: 'Al-\'Alaq', surahNameArabic: 'العلق', verseArabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ', verseIndo: 'Yang mengajar dengan pena.', matchedWordArabic: 'عَلَّمَ', matchedWordIndo: 'mengajar', wordLocation: '96:4:2' }]
  },

  // 7. Rahmah (ر-ح-م)
  {
    id: 'r-h-m',
    rootArabic: 'ر ح م',
    rootArabicJoined: 'رحم',
    rootLatin: 'rahima',
    titleIndo: 'Rahmah / Kasih Sayang / Rahim',
    titleEnglish: 'Mercy / Compassion',
    meaningsIndonesian: ['Kasih sayang yang tulus', 'Kelembutan mengayomi', 'Rahim kekerabatan'],
    etymologyNote: 'Bermakna dasar kelembutan dan kasih yang mengayomi.',
    totalOccurrences: 339,
    verbsCount: 65,
    nounsCount: 274,
    tags: ['rahima', 'rahmah', 'kasih', 'sayang', 'r-h-m', 'رحم', 'ر-ح-م'],
    verbs: [],
    nouns: [{ id: 'rhm-n1', arabic: 'رَحْمَةٌ', transliteration: 'rahmatun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Kasih sayang', frequency: 114 }],
    occurrences: [{ surahNumber: 1, ayahNumber: 1, surahNameIndo: 'Al-Fatihah', surahNameArabic: 'الفاتحة', verseArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', verseIndo: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.', matchedWordArabic: 'الرَّحْمَٰنِ الرَّحِيمِ', matchedWordIndo: 'Maha Pengasih', wordLocation: '1:1:3' }]
  },

  // 8. Nasr (ن-ص-ر)
  {
    id: 'n-s-r',
    rootArabic: 'ن ص ر',
    rootArabicJoined: 'نصر',
    rootLatin: 'nasara',
    titleIndo: 'Nasr / Pertolongan / Kemenangan',
    titleEnglish: 'Help / Victory',
    meaningsIndonesian: ['Pertolongan pada kesusahan', 'Kemenangan kebenaran', 'Kaum Anshar'],
    etymologyNote: 'Bermakna dasar menyelamatkan dan menguatkan yang lemah.',
    totalOccurrences: 158,
    verbsCount: 92,
    nounsCount: 66,
    tags: ['nasara', 'nasr', 'pertolongan', 'n-s-r', 'نصر', 'ن-ص-ر'],
    verbs: [{ id: 'nsr-v1', arabic: 'نَصَرَ', transliteration: 'nasara', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Menolong', frequency: 45 }],
    nouns: [{ id: 'nsr-n1', arabic: 'نَصْرٌ', transliteration: 'nasrun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Pertolongan', frequency: 22 }],
    occurrences: [{ surahNumber: 110, ayahNumber: 1, surahNameIndo: 'An-Nasr', surahNameArabic: 'النصر', verseArabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', verseIndo: 'Apabila telah datang pertolongan Allah dan kemenangan.', matchedWordArabic: 'نَصْرُ', matchedWordIndo: 'pertolongan', wordLocation: '110:1:3' }]
  },

  // 9. Qaul (ق-و-ل)
  {
    id: 'q-w-l',
    rootArabic: 'ق و ل',
    rootArabicJoined: 'قول',
    rootLatin: 'qawala',
    titleIndo: 'Qaul / Perkataan / Firman',
    titleEnglish: 'Speech / Say',
    meaningsIndonesian: ['Ucapan bermakna', 'Firman wahyu Allah', 'Tegasan kebenaran'],
    etymologyNote: 'Segala ucapan yang keluar dari lisan.',
    totalOccurrences: 1722,
    verbsCount: 1618,
    nounsCount: 104,
    tags: ['qala', 'qawala', 'qaul', 'kata', 'q-w-l', 'قول', 'ق-و-ل'],
    verbs: [{ id: 'qwl-v1', arabic: 'قَالَ', transliteration: 'qaala', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Berkata', frequency: 529 }],
    nouns: [{ id: 'qwl-n1', arabic: 'قَوْلٌ', transliteration: 'qaulun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Perkataan', frequency: 91 }],
    occurrences: [{ surahNumber: 112, ayahNumber: 1, surahNameIndo: 'Al-Ikhlas', surahNameArabic: 'الإخلاص', verseArabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', verseIndo: 'Katakanlah (Muhammad), Dialah Allah Yang Maha Esa.', matchedWordArabic: 'قُلْ', matchedWordIndo: 'Katakanlah', wordLocation: '112:1:1' }]
  },

  // 10. Hukum & Hikmah (ح-ك-م)
  {
    id: 'h-k-m',
    rootArabic: 'ح ك م',
    rootArabicJoined: 'حكم',
    rootLatin: 'hakama',
    titleIndo: 'Hikmah / Hukum / Kebijaksanaan',
    titleEnglish: 'Wisdom / Judge',
    meaningsIndonesian: ['Mencegah kezaliman', 'Penetapan hukum syariat', 'Kebijaksanaan tinggi'],
    etymologyNote: 'Bermakna dasar menahan/mencegah dari keburukan.',
    totalOccurrences: 210,
    verbsCount: 91,
    nounsCount: 119,
    tags: ['hakama', 'hukum', 'hikmah', 'h-k-m', 'حكم', 'ح-ك-م'],
    verbs: [{ id: 'hkm-v1', arabic: 'حَكَمَ', transliteration: 'hakama', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Memutuskan hukum', frequency: 46 }],
    nouns: [{ id: 'hkm-n1', arabic: 'حُكْمٌ', transliteration: 'hukmun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Hukum', frequency: 30 }],
    occurrences: [{ surahNumber: 5, ayahNumber: 50, surahNameIndo: 'Al-Ma\'idah', surahNameArabic: 'المائدة', verseArabic: 'أَفَحُكْمَ الْجَاهِلِيَّةِ يَبْغُونَ', verseIndo: 'Apakah hukum Jahiliah yang mereka kehendaki?', matchedWordArabic: 'أَفَحُكْمَ', matchedWordIndo: 'hukum', wordLocation: '5:50:2' }]
  },

  // 11. Ghafur & Ampunan (غ-ف-ر)
  {
    id: 'g-f-r',
    rootArabic: 'غ ف ر',
    rootArabicJoined: 'غفر',
    rootLatin: 'ghafara',
    titleIndo: 'Maghfirah / Ampunan / Perlindungan',
    titleEnglish: 'Forgive / Cover',
    meaningsIndonesian: ['Menutupi dosa dan siksa', 'Penghapusan kesalahan', 'Perlindungan ma\'siat'],
    etymologyNote: 'Menutupi dan melindungi (seperti Mighfar / helm perang besi).',
    totalOccurrences: 234,
    verbsCount: 96,
    nounsCount: 138,
    tags: ['ghafara', 'ampun', 'maghfirah', 'g-f-r', 'غفر', 'غ-ف-ر'],
    verbs: [{ id: 'gfr-v1', arabic: 'غَفَرَ', transliteration: 'ghafara', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Mengampuni', frequency: 38 }],
    nouns: [{ id: 'gfr-n1', arabic: 'مَغْفِرَةٌ', transliteration: 'maghfiratun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Ampunan', frequency: 28 }],
    occurrences: [{ surahNumber: 3, ayahNumber: 133, surahNameIndo: 'Ali \'Imran', surahNameArabic: 'آل عمران', verseArabic: 'وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ', verseIndo: 'Bersegeralah mencari ampunan Tuhanmu.', matchedWordArabic: 'مَغْفِرَةٍ', matchedWordIndo: 'ampunan', wordLocation: '3:133:3' }]
  },

  // 12. Syukur (ش-ك-ر)
  {
    id: 's-k-r',
    rootArabic: 'ش ك ر',
    rootArabicJoined: 'شكر',
    rootLatin: 'shakara',
    titleIndo: 'Syukur / Terima Kasih / Pujian',
    titleEnglish: 'Thank / Gratitude',
    meaningsIndonesian: ['Mengakui nikmat Allah', 'Menggunakan nikmat pada ketaatan', 'Terima kasih tulus'],
    etymologyNote: 'Memenuhkan dan menampilkan kebaikan nikmat.',
    totalOccurrences: 75,
    verbsCount: 49,
    nounsCount: 26,
    tags: ['shakara', 'syukur', 's-k-r', 'شكر', 'ش-ك-ر'],
    verbs: [{ id: 'skr-v1', arabic: 'شَكَرَ', transliteration: 'shakara', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Bersyukur', frequency: 18 }],
    nouns: [{ id: 'skr-n1', arabic: 'شُكْرًا', transliteration: 'shukran', type: 'noun', posTag: 'Masdar', meaningIndo: 'Rasa syukur', frequency: 6 }],
    occurrences: [{ surahNumber: 14, ayahNumber: 7, surahNameIndo: 'Ibrahim', surahNameArabic: 'إبراهيم', verseArabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', verseIndo: 'Jika kamu bersyukur, niscaya Aku tambah nikmat kepadamu.', matchedWordArabic: 'شَكَرْتُمْ', matchedWordIndo: 'jika kamu bersyukur', wordLocation: '14:7:4' }]
  },

  // 13. Hidayah (ه-د-ي)
  {
    id: 'h-d-y',
    rootArabic: 'ه د ي',
    rootArabicJoined: 'هدي',
    rootLatin: 'hadaya',
    titleIndo: 'Hidayah / Petunjuk / Bimbingan',
    titleEnglish: 'Guide / Guidance',
    meaningsIndonesian: ['Bimbingan ke jalan lurus', 'Karunia yang menuntun', 'Kejelasan petunjuk'],
    etymologyNote: 'Menuntun dengan kelembutan menuju tujuan.',
    totalOccurrences: 316,
    verbsCount: 161,
    nounsCount: 155,
    tags: ['hadaya', 'hidayah', 'petunjuk', 'h-d-y', 'هدي', 'ه-د-ي'],
    verbs: [{ id: 'hdy-v1', arabic: 'هَدَىٰ', transliteration: 'hadaa', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Memberi petunjuk', frequency: 72 }],
    nouns: [{ id: 'hdy-n1', arabic: 'هُدًى', transliteration: 'hudan', type: 'noun', posTag: 'Masdar', meaningIndo: 'Petunjuk', frequency: 85 }],
    occurrences: [{ surahNumber: 1, ayahNumber: 6, surahNameIndo: 'Al-Fatihah', surahNameArabic: 'الفاتحة', verseArabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', verseIndo: 'Tunjukilah kami jalan yang lurus.', matchedWordArabic: 'اهْدِنَا', matchedWordIndo: 'Tunjukilah kami', wordLocation: '1:6:1' }]
  },

  // 14. Nur & Cahaya (ن-و-ر)
  {
    id: 'n-w-r',
    rootArabic: 'ن و ر',
    rootArabicJoined: 'نور',
    rootLatin: 'nawara',
    titleIndo: 'Nur / Cahaya / Penerang',
    titleEnglish: 'Light / Illumination',
    meaningsIndonesian: ['Cahaya menerangi kegelapan', 'Petunjuk wahyu Al-Qur\'an', 'Kejelasan iman'],
    etymologyNote: 'Kecemerlangan yang menyingkap hal tersembunyi.',
    totalOccurrences: 194,
    verbsCount: 12,
    nounsCount: 182,
    tags: ['nawara', 'nur', 'cahaya', 'n-w-r', 'نور', 'ن-و-ر'],
    verbs: [],
    nouns: [{ id: 'nwr-n1', arabic: 'نُورٌ', transliteration: 'nuurun', type: 'noun', posTag: 'Isim', meaningIndo: 'Cahaya', frequency: 43 }],
    occurrences: [{ surahNumber: 24, ayahNumber: 35, surahNameIndo: 'An-Nur', surahNameArabic: 'النور', verseArabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', verseIndo: 'Allah (Pemberi) cahaya langit dan bumi.', matchedWordArabic: 'نُورُ', matchedWordIndo: 'Pemberi cahaya', wordLocation: '24:35:2' }]
  },

  // 15. Haq (ح-ق-ق)
  {
    id: 'h-q-q',
    rootArabic: 'ح ق ق',
    rootArabicJoined: 'حقق',
    rootLatin: 'haqqa',
    titleIndo: 'Haq / Kebenaran / Kepastian',
    titleEnglish: 'Truth / Right',
    meaningsIndonesian: ['Kebenaran sejati tanpa ragu', 'Hak dan kewajiban pasti', 'Ketetapan nyata'],
    etymologyNote: 'Kesesuaian yang kokoh dan tepat.',
    totalOccurrences: 287,
    verbsCount: 39,
    nounsCount: 248,
    tags: ['haqqa', 'haq', 'kebenaran', 'h-q-q', 'حق', 'ح-ق-ق'],
    verbs: [],
    nouns: [{ id: 'hqq-n1', arabic: 'حَقٌّ', transliteration: 'haqqun', type: 'noun', posTag: 'Isim', meaningIndo: 'Kebenaran', frequency: 247 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 147, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'الْحَقُّ مِن رَّبِّكَ', verseIndo: 'Kebenaran itu dari Tuhanmu.', matchedWordArabic: 'الْحَقُّ', matchedWordIndo: 'Kebenaran', wordLocation: '2:147:1' }]
  },

  // 16. Salam & Islam (س-ل-م)
  {
    id: 's-l-m',
    rootArabic: 'س ل م',
    rootArabicJoined: 'سلم',
    rootLatin: 'salima',
    titleIndo: 'Salam / Keselamatan / Kedamaian / Islam',
    titleEnglish: 'Peace / Safety / Islam',
    meaningsIndonesian: ['Terbebas dari bahaya', 'Kedamaian jiwa', 'Penyerahan diri total (Islam)'],
    etymologyNote: 'Bermakna dasar keselamatan dari cela dan bahaya.',
    totalOccurrences: 140,
    verbsCount: 42,
    nounsCount: 98,
    tags: ['salima', 'salam', 'islam', 's-l-m', 'سلم', 'س-ل-م'],
    verbs: [{ id: 'slm-v1', arabic: 'أَسْلَمَ', transliteration: 'aslama', type: 'verb', form: 'Form IV', posTag: 'Fi\'il Madhi', meaningIndo: 'Berserah diri / berislam', frequency: 22 }],
    nouns: [{ id: 'slm-n1', arabic: 'الإِسْلَامُ', transliteration: 'al-islaam', type: 'noun', posTag: 'Masdar', meaningIndo: 'Agama Islam', frequency: 6 }],
    occurrences: [{ surahNumber: 3, ayahNumber: 19, surahNameIndo: 'Ali \'Imran', surahNameArabic: 'آل عمران', verseArabic: 'إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ', verseIndo: 'Sesungguhnya agama di sisi Allah ialah Islam.', matchedWordArabic: 'الْإِسْلَامُ', matchedWordIndo: 'Islam', wordLocation: '3:19:5' }]
  },

  // 17. Khaliq & Cipta (خ-ل-ق)
  {
    id: 'k-l-q',
    rootArabic: 'خ ل ق',
    rootArabicJoined: 'خلق',
    rootLatin: 'khalaqa',
    titleIndo: 'Khaliq / Penciptaan / Akhlak',
    titleEnglish: 'Create / Creation / Character',
    meaningsIndonesian: ['Menciptakan dari tidak ada', 'Watak jiwa (Akhlak)', 'Makhluk semesta'],
    etymologyNote: 'Mengukur cermat dan membentuk proporsi sempurna.',
    totalOccurrences: 261,
    verbsCount: 184,
    nounsCount: 77,
    tags: ['khalaqa', 'cipta', 'khaliq', 'akhlak', 'k-l-q', 'خلق', 'خ-ل-ق'],
    verbs: [{ id: 'klq-v1', arabic: 'خَلَقَ', transliteration: 'khalaqa', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Menciptakan', frequency: 147 }],
    nouns: [{ id: 'klq-n1', arabic: 'خَلْقٌ', transliteration: 'khalqun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Penciptaan', frequency: 52 }],
    occurrences: [{ surahNumber: 96, ayahNumber: 1, surahNameIndo: 'Al-\'Alaq', surahNameArabic: 'العلق', verseArabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', verseIndo: 'Bacalah dengan nama Tuhanmu yang menciptakan.', matchedWordArabic: 'خَلَقَ', matchedWordIndo: 'menciptakan', wordLocation: '96:1:4' }]
  },

  // 18. Ilah & Allah (ا-ل-ه)
  {
    id: 'a-l-h',
    rootArabic: 'ا ل ه',
    rootArabicJoined: 'إله',
    rootLatin: 'alaha',
    titleIndo: 'Ilah / Ketuhanan / Allah',
    titleEnglish: 'God / Allah',
    meaningsIndonesian: ['Satu-satunya Sesembahan Hakiki', 'Pusat keagungan ibadah', 'Tempat perlindungan rindu'],
    etymologyNote: 'Seseorang yang dipuja, dicintai, dan dijadikan perlindungan jiwa.',
    totalOccurrences: 2851,
    verbsCount: 0,
    nounsCount: 2851,
    tags: ['allah', 'ilah', 'tuhan', 'a-l-h', 'إله', 'ا-ل-ه'],
    verbs: [],
    nouns: [{ id: 'alh-n1', arabic: 'اللَّهُ', transliteration: 'allahu', type: 'noun', posTag: 'Lafdzul Jalalah', meaningIndo: 'Allah SWT', frequency: 2699 }],
    occurrences: [{ surahNumber: 112, ayahNumber: 2, surahNameIndo: 'Al-Ikhlas', surahNameArabic: 'الإخلاص', verseArabic: 'اللَّهُ الصَّمَدُ', verseIndo: 'Allah tempat meminta segala sesuatu.', matchedWordArabic: 'اللَّهُ', matchedWordIndo: 'Allah', wordLocation: '112:2:1' }]
  },

  // 19. Taubat (ت-و-ب)
  {
    id: 't-w-b',
    rootArabic: 'ت و ب',
    rootArabicJoined: 'توب',
    rootLatin: 'tawaba',
    titleIndo: 'Taubat / Kembali Kepada Allah',
    titleEnglish: 'Repentance / Return',
    meaningsIndonesian: ['Kembali dari dosa ke ketaatan', 'Penerimaan ampunan Allah', 'Penyesalan tulus'],
    etymologyNote: 'Bermakna dasar kembali (الرجوع).',
    totalOccurrences: 87,
    verbsCount: 72,
    nounsCount: 15,
    tags: ['tawaba', 'taubat', 'tobat', 't-w-b', 'توب', 'ت-و-ب'],
    verbs: [{ id: 'twb-v1', arabic: 'تَابَ', transliteration: 'taaba', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Bertaubat', frequency: 44 }],
    nouns: [{ id: 'twb-n1', arabic: 'تَوْبَةً', transliteration: 'taubatan', type: 'noun', posTag: 'Masdar', meaningIndo: 'Taubat', frequency: 10 }],
    occurrences: [{ surahNumber: 66, ayahNumber: 8, surahNameIndo: 'At-Tahrim', surahNameArabic: 'التحريم', verseArabic: 'تُوبُوا إِلَى اللَّهِ تَوْبَةً نَّصُوحًا', verseIndo: 'Bertaubatlah kepada Allah dengan taubat nasuha.', matchedWordArabic: 'تُوبُوا', matchedWordIndo: 'Bertaubatlah', wordLocation: '66:8:4' }]
  },

  // 20. Zikir (ذ-ك-ر)
  {
    id: 'z-k-r',
    rootArabic: 'ذ ك ر',
    rootArabicJoined: 'ذكر',
    rootLatin: 'dhakara',
    titleIndo: 'Zikir / Ingatan / Peringatan',
    titleEnglish: 'Remember / Mention',
    meaningsIndonesian: ['Mengingat Allah di hati & lisan', 'Peringatan Al-Qur\'an', 'Kemuliaan nama baik'],
    etymologyNote: 'Menjaga ingatan di hati dan mengucapkannya dengan lisan.',
    totalOccurrences: 292,
    verbsCount: 167,
    nounsCount: 125,
    tags: ['dhakara', 'zikir', 'ingat', 'z-k-r', 'ذكر', 'ذ-ك-ر'],
    verbs: [{ id: 'zkr-v1', arabic: 'ذَكَرَ', transliteration: 'dhakara', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Mengingat', frequency: 68 }],
    nouns: [{ id: 'zkr-n1', arabic: 'ذِكْرٌ', transliteration: 'dhikrun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Zikir / Peringatan', frequency: 76 }],
    occurrences: [{ surahNumber: 2, ayahNumber: 152, surahNameIndo: 'Al-Baqarah', surahNameArabic: 'البقرة', verseArabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ', verseIndo: 'Ingatlah kepada-Ku, Niscaya Aku ingat kepadamu.', matchedWordArabic: 'فَاذْكُرُونِي', matchedWordIndo: 'Ingatlah kepada-Ku', wordLocation: '2:152:1' }]
  }
];
