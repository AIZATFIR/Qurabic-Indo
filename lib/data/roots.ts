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
      { id: 'slw-v1', arabic: 'صَلَّىٰ', transliteration: 'sallaa', type: 'verb', form: 'Form II', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah melaksanakan salat / mendoakan', frequency: 12 },
      { id: 'slw-v2', arabic: 'يُصَلُّونَ', transliteration: 'yusalluuna', type: 'verb', form: 'Form II', posTag: 'Fi\'il Mudhari\' Jamak', meaningIndo: 'Mereka melaksanakan salat / berselawat', frequency: 4 }
    ],
    nouns: [
      { id: 'slw-n1', arabic: 'الصَّلَاةَ', transliteration: 'as-salaah', type: 'noun', posTag: 'Isim (Ibadah Salat)', meaningIndo: 'Ibadah Salat / Doa suci', frequency: 67 },
      { id: 'slw-n2', arabic: 'صَلَوَاتٌ', transliteration: 'salawaatun', type: 'noun', posTag: 'Isim Jamak', meaningIndo: 'Salawat / Keberkahan doa', frequency: 5 }
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
      { id: 'zkw-v1', arabic: 'زَكَّىٰ', transliteration: 'zakkaa', type: 'verb', form: 'Form II', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah menyucikan', frequency: 9 }
    ],
    nouns: [
      { id: 'zkw-n1', arabic: 'الزَّكَاةَ', transliteration: 'az-zakaah', type: 'noun', posTag: 'Isim (Zakat Wajib)', meaningIndo: 'Zakat wajib penyuci harta', frequency: 32 }
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
    etymologyNote: 'Secara etimologi, "W-Q-Y" bermakna dasar "membuat benteng/perisai pelindung antara dua hal" (الوقاية والحرص). Takwa adalah perisai pelindung amal.',
    totalOccurrences: 258,
    verbsCount: 177,
    nounsCount: 81,
    tags: ['taqwa', 'takwa', 'taqwaa', 'w-q-y', 'pelihara', 'perisai', 'piety', 'guard', 'تقوى', 'و-ق-ي'],
    verbs: [
      { id: 'wqy-v1', arabic: 'اتَّقَىٰ', transliteration: 'ittaqaa', type: 'verb', form: 'Form VIII', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah bertakwa / memelihara diri', frequency: 82 }
    ],
    nouns: [
      { id: 'wqy-n1', arabic: 'تَقْوَىٰ', transliteration: 'taqwaa', type: 'noun', posTag: 'Masdar (Ketaqwaan)', meaningIndo: 'Ketakwaan / Perisai jiwa', frequency: 17 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 197,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ ۚ وَاتَّقُونِ يَا أُولِي الْأَلْبَابِ',
        verseIndo: 'Bawalah bekal, karena sesungguhnya sebaik-baik bekal adalah takwa.',
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
    etymologyNote: 'Secara etimologi, "S-R-K" bermakna dasar "pembagian saham/persekutuan dua pihak atau lebih" (المشاركة).',
    totalOccurrences: 168,
    verbsCount: 38,
    nounsCount: 130,
    tags: ['syirik', 'shirk', 'sirk', 's-r-k', 'sekutu', 'mensekutukan', 'polytheism', 'شرك', 'ش-ر-ك'],
    verbs: [
      { id: 'srk-v1', arabic: 'أَشْرَكَ', transliteration: 'ashraka', type: 'verb', form: 'Form IV', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah menyekutukan Allah', frequency: 25 }
    ],
    nouns: [
      { id: 'srk-n1', arabic: 'شِرْكٌ', transliteration: 'shirkun', type: 'noun', posTag: 'Masdar (Syirik)', meaningIndo: 'Perbuatan Syirik / Menyertakan sekutu', frequency: 5 }
    ],
    occurrences: [
      {
        surahNumber: 4,
        ayahNumber: 48,
        surahNameIndo: 'An-Nisa\'',
        surahNameArabic: 'النساء',
        verseArabic: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ',
        verseIndo: 'Sesungguhnya Allah tidak akan mengampuni dosa syirik, dan Dia mengampuni segala dosa selain syirik.',
        matchedWordArabic: 'أَن يُشْرَكَ',
        matchedWordIndo: 'dosa syirik',
        wordLocation: '4:48:5'
      }
    ]
  },
  {
    id: 'h-m-d',
    rootArabic: 'ح م د',
    rootArabicJoined: 'حمد',
    rootLatin: 'hamd',
    titleIndo: 'Hamd / Pujian / Syukur Sanjungan',
    titleEnglish: 'Praise / Thanks / Commendation',
    meaningsIndonesian: [
      'Memuji dan mengagungkan kebaikan Allah dengan rasa cinta',
      'Pujian sempurna yang menjadi hak khusus Allah (Alhamdulillah)',
      'Nama terpuji (Muhammad / Ahmad)'
    ],
    etymologyNote: 'Secara etimologi, "H-M-D" merujuk pada "pujian tulus yang disampaikan dengan penuh penghormatan dan kecintaan atas kebaikan kurnia" (الثناء بالجميل الاختياري على جهة التعظيم).',
    totalOccurrences: 63,
    verbsCount: 15,
    nounsCount: 48,
    tags: ['hamd', 'puji', 'pujian', 'alhamdulillah', 'muhammad', 'ahmad', 'h-m-d', 'praise', 'thanks', 'حمد', 'ح-م-د'],
    verbs: [
      { id: 'hmd-v1', arabic: 'حَمِدَ', transliteration: 'hamida', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah memuji', frequency: 4 }
    ],
    nouns: [
      { id: 'hmd-n1', arabic: 'الْحَمْدُ', transliteration: 'al-hamdu', type: 'noun', posTag: 'Masdar (Pujian Sempurna)', meaningIndo: 'Segala Pujian', frequency: 38 },
      { id: 'hmd-n2', arabic: 'مُحَمَّدٌ', transliteration: 'muhammadun', type: 'noun', posTag: 'Isim Alam (Nabi Muhammad)', meaningIndo: 'Nabi Muhammad (Yang Terpuji)', frequency: 4 }
    ],
    occurrences: [
      {
        surahNumber: 1,
        ayahNumber: 2,
        surahNameIndo: 'Al-Fatihah',
        surahNameArabic: 'الفاتحة',
        verseArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        verseIndo: 'Segala puji bagi Allah, Tuhan seluruh alam.',
        matchedWordArabic: 'الْحَمْدُ',
        matchedWordIndo: 'Segala puji',
        wordLocation: '1:2:1'
      }
    ]
  },
  {
    id: 's-l-h',
    rootArabic: 'ص ل ح',
    rootArabicJoined: 'صلح',
    rootLatin: 'saleh',
    titleIndo: 'Saleh / Kesalehan / Kebaikan / Perdamaian',
    titleEnglish: 'Righteous / Good / Peace / Virtue',
    meaningsIndonesian: [
      'Keadaan yang baik, lurus, dan terbebas dari kerusakan',
      'Amal kebajikan yang membawa kemaslahatan (Amal Saleh)',
      'Perdamaian dan perbaikan hubungan antarmanusia'
    ],
    etymologyNote: 'Secara etimologi, "S-L-H" bermakna "kebaikan, kelayakan, dan ketiadaan kerusakan" (ضد الفساد). Amal saleh adalah amal yang layak dan bermanfaat.',
    totalOccurrences: 180,
    verbsCount: 42,
    nounsCount: 138,
    tags: ['saleh', 'sholeh', 'shaleh', 'salih', 's-l-h', 'baik', 'kebajikan', 'damai', 'maslahat', 'righteous', 'good', 'صلح', 'ص-ل-ح'],
    verbs: [
      { id: 'slh-v1', arabic: 'أَصْلَحَ', transliteration: 'aslaha', type: 'verb', form: 'Form IV', posTag: 'Fi\'il Madhi (Memperbaiki)', meaningIndo: 'Ia telah memperbaiki / berbuat baik', frequency: 28 }
    ],
    nouns: [
      { id: 'slh-n1', arabic: 'صَالِحًا', transliteration: 'saalihan', type: 'noun', posTag: 'Isim Fa\'il (Amal Saleh)', meaningIndo: 'Kebajikan / Perbuatan saleh', frequency: 72 },
      { id: 'slh-n2', arabic: 'الصَّالِحَاتِ', transliteration: 'as-saalihaat', type: 'noun', posTag: 'Isim Jamak', meaningIndo: 'Kebajikan-kebajikan (Amal saleh)', frequency: 62 }
    ],
    occurrences: [
      {
        surahNumber: 103,
        ayahNumber: 3,
        surahNameIndo: 'Al-\'Asr',
        surahNameArabic: 'العصر',
        verseArabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ',
        verseIndo: 'Kecuali orang-orang yang beriman dan mengerjakan kebajikan...',
        matchedWordArabic: 'الصَّالِحَاتِ',
        matchedWordIndo: 'kebajikan',
        wordLocation: '103:3:4'
      }
    ]
  },
  {
    id: 's-h-d',
    rootArabic: 'ش ه د',
    rootArabicJoined: 'شهد',
    rootLatin: 'syahadat',
    titleIndo: 'Syahadat / Kesaksian / Persaksian / Hadir',
    titleEnglish: 'Witness / Testimony / Martyrdom / Presence',
    meaningsIndonesian: [
      'Pernyataan kesaksian keimanan (Syahadatayn)',
      'Kehadiran secara langsung menyaksikan peristiwa',
      'Mati syahid membela kebenaran di jalan Allah'
    ],
    etymologyNote: 'Secara etimologi, "S-H-D" bermakna "kehadiran dengan mata kepala atau ilmu yakin yang jelas" (الحضور مع المشاهدة العلمية). Syahadat adalah pengakuan yakin.',
    totalOccurrences: 160,
    verbsCount: 62,
    nounsCount: 98,
    tags: ['syahadat', 'saksi', 'persaksian', 'syahid', 's-h-d', 'witness', 'testimony', 'شهد', 'ش-ه-د'],
    verbs: [
      { id: 'shd-v1', arabic: 'شَهِدَ', transliteration: 'shahida', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah bersaksi / menyaksikan', frequency: 32 }
    ],
    nouns: [
      { id: 'shd-n1', arabic: 'شَهَادَةً', transliteration: 'shahaadatan', type: 'noun', posTag: 'Masdar (Kesaksian)', meaningIndo: 'Kesaksian / Syahadat', frequency: 28 },
      { id: 'shd-n2', arabic: 'شَهِيدٌ', transliteration: 'shahiidun', type: 'noun', posTag: 'Isim (Saksi/Mati Syahid)', meaningIndo: 'Saksi / Maha Menyaksikan', frequency: 35 }
    ],
    occurrences: [
      {
        surahNumber: 3,
        ayahNumber: 18,
        surahNameIndo: 'Ali \'Imran',
        surahNameArabic: 'آل عمران',
        verseArabic: 'شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ قَائِمًا بِالْقِسْطِ',
        verseIndo: 'Allah menyatakan bahwa tidak ada tuhan selain Dia; (demikian pula) para malaikat dan orang berilmu...',
        matchedWordArabic: 'شَهِدَ',
        matchedWordIndo: 'menyatakan/bersaksi',
        wordLocation: '3:18:1'
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
      'Pengangkatan beban dengan ketahanan moral yang kuat'
    ],
    etymologyNote: 'Secara etimologi klasik, kata asal "صَبَر" (sobaro) merujuk pada "batu yang sangat keras dan padat" (الصَّبْرَةُ), serta tanaman herbal lidah buaya yang sangat pahit namun kaya obat.',
    totalOccurrences: 103,
    verbsCount: 46,
    nounsCount: 57,
    tags: ['sabar', 'sabara', 'sobar', 'sobaro', 'batu', 'batu keras', 'tanaman pahit', 'tabah', 'menahan', 'patience', 'endure', 'صبر', 'ص-ب-r'],
    verbs: [
      { id: 'sbr-v1', arabic: 'صَبَرَ', transliteration: 'sabara', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah bersabar', frequency: 24 }
    ],
    nouns: [
      { id: 'sbr-n1', arabic: 'صَبْرٌ', transliteration: 'sabrun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Kesabaran / Ketabahan jiwa', frequency: 15 }
    ],
    occurrences: [
      {
        surahNumber: 2,
        ayahNumber: 153,
        surahNameIndo: 'Al-Baqarah',
        surahNameArabic: 'البقرة',
        verseArabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        verseIndo: 'Wahai orang-orang yang beriman! Mohonlah pertolongan (kepada Allah) dengan sabar dan salat.',
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
      'Kitab suci petunjuk wahyu'
    ],
    etymologyNote: 'Secara etimologi, asal kata "K-T-B" berarti "mengumpulkan sesuatu dengan jahitan atau ikatan" (الجمع والكتابة).',
    totalOccurrences: 319,
    verbsCount: 58,
    nounsCount: 261,
    tags: ['kataba', 'k-t-b', 'kitab', 'tulis', 'menulis', 'catat', 'hukum', 'write', 'book', 'decree', 'كتب', 'ك-ت-ب'],
    verbs: [
      { id: 'ktb-v1', arabic: 'كَتَبَ', transliteration: 'kataba', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah menulis / menetapkan', frequency: 56 }
    ],
    nouns: [
      { id: 'ktb-n1', arabic: 'كِتَابٌ', transliteration: 'kitaabun', type: 'noun', posTag: 'Isim (Buku/Wahyu)', meaningIndo: 'Kitab / Buku / Ketetapan', frequency: 230 }
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
    etymologyNote: 'Akar kata "ع-ل-م" mencakup ilmu (pengetahuan) dan Alam/Alamat (tanda penunjuk).',
    totalOccurrences: 854,
    verbsCount: 382,
    nounsCount: 472,
    tags: ['alima', 'a-l-m', 'ilm', 'ilmu', 'tahu', 'mengetahui', 'pengetahuan', 'knowledge', 'learn', 'علم', 'ع-ل-م'],
    verbs: [
      { id: 'alm-v1', arabic: 'عَلِمَ', transliteration: 'alima', type: 'verb', form: 'Form I', posTag: 'Fi\'il Madhi', meaningIndo: 'Ia telah mengetahui', frequency: 140 }
    ],
    nouns: [
      { id: 'alm-n1', arabic: 'عِلْمٌ', transliteration: 'ilmun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Ilmu pengetahuan', frequency: 105 }
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
    etymologyNote: 'Akar "ر-ح-m" bermakna dasar kelembutan dan kasih yang mengayomi.',
    totalOccurrences: 339,
    verbsCount: 65,
    nounsCount: 274,
    tags: ['rahima', 'r-h-m', 'rahmah', 'rahmat', 'kasih', 'sayang', 'mercy', 'compassion', 'رحم', 'ر-ح-م'],
    verbs: [],
    nouns: [
      { id: 'rhm-n1', arabic: 'رَحْمَةٌ', transliteration: 'rahmatun', type: 'noun', posTag: 'Masdar', meaningIndo: 'Rahmat / Kasih sayang', frequency: 114 }
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
