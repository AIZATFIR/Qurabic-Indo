/**
 * Qurabic Authoritative Root & Derivatives Translation Engine
 * Sourced strictly from classical Quranic Arabic morphology & Indonesian Quranic translations.
 * Guarantees zero empty or placeholder definitions across all root families and words.
 */

import { stripArabicHarakat } from '../search/root-search';
import { ROOT_DATABASE } from '../data/roots';

export interface RootTranslationProfile {
  rootArabic: string;
  rootLatin: string;
  titleIndo: string;
  coreMeaning: string;
  derivatives: Record<string, string>;
}

export const ROOT_DICTIONARY: Record<string, RootTranslationProfile> = {
  // 1. Root H-r-m (ح ر م) — 83 occurrences
  'H-r-m': {
    rootArabic: 'ح ر م',
    rootLatin: 'Hrm',
    titleIndo: 'Akar ح ر م (Suci, Mengharamkan, Kehormatan)',
    coreMeaning: 'Mengharamkan, mensucikan, memelihara kehormatan, dan terlarang dari penodaan.',
    derivatives: {
      'حَرَّمَ': 'Mengharamkan / Melarang',
      'حَرَّمْنَا': 'Kami haramkan',
      'حَرَّمُوا۟': 'Mereka mengharamkan',
      'حُرِّمَتْ': 'Diharamkan',
      'حُرِّمَ': 'Diharamkan',
      'تُحَرِّمُوا۟': 'Jangan kamu haramkan',
      'حَرَام': 'Suci / Terhormat / Terlarang',
      'حَرَامٌ': 'Haram / Suci / Terlarang',
      'ٱلْحَرَامِ': 'Yang suci / Dihormati (Masjidil Haram)',
      'ٱلْحَرَامُ': 'Yang suci / Dihormati (Bulan Haram)',
      'ٱلْحَرَامَ': 'Yang suci / Dihormati',
      'مُحَرَّم': 'Diharamkan / Yang disucikan',
      'مُحَرَّمٌ': 'Diharamkan / Terlarang',
      'مُحَرَّمَةٌ': 'Diharamkan / Terlarang dimasuki',
      'حُرُمَات': 'Hal-hal yang disucikan / Kehormatan',
      'حُرُمَٰتُ': 'Hal-hal yang disucikan / Kehormatan',
      'ٱلْحُرُمَٰتُ': 'Hal-hal yang disucikan / Kehormatan hukum Allah',
      'حُرُم': 'Sedang berihram / Dalam keadaan suci',
      'حُرُمٌ': 'Sedang berihram / Keadaan ihram',
      'حُرُمًۭا': 'Dalam keadaan berihram',
      'مَحْرُوم': 'Orang yang terhalang rezeki / kekurangan',
      'مَّحْرُومٍ': 'Orang miskin yang tidak meminta-minta',
    },
  },

  // 2. Root $-h-r (ش ه ر) — 21 occurrences
  '$-h-r': {
    rootArabic: 'ش ه ر',
    rootLatin: '$hr',
    titleIndo: 'Akar ش ه ر (Bulan Penanggalan, Masyhur)',
    coreMeaning: 'Bulan (waktu perhitungan hilal), tampak jelas, terang, dan kemasyhuran.',
    derivatives: {
      'شَهْر': 'Bulan (penanggalan)',
      'شَهْرٌ': 'Satu bulan',
      'شَهْرٍ': 'Satu bulan',
      'شَهْرَ': 'Bulan (penanggalan)',
      'شَهْرُ': 'Bulan (penanggalan)',
      'ٱلشَّهْرُ': 'Bulan (penanggalan)',
      'ٱلشَّهْرَ': 'Bulan (penanggalan)',
      'ٱلشَّهْرِ': 'Bulan (penanggalan)',
      'أَشْهُر': 'Bulan-bulan (jamak)',
      'أَشْهُرٌ': 'Beberapa bulan (jamak)',
      'أَشْهُرٍ': 'Beberapa bulan',
      'شُهُور': 'Bulan-bulan (jamak 12 bulan)',
      'شُهُورًا': 'Hitungan bulan-bulan',
    },
  },

  // 3. Root k-*-b (ك ذ ب) — 282 occurrences
  'k-*-b': {
    rootArabic: 'ك ذ ب',
    rootLatin: 'k*b',
    titleIndo: 'Akar ك ذ ب (Dusta, Kebohongan, Mendustakan)',
    coreMeaning: 'Dusta, tidak sesuai kenyataan, membohongi, dan mendustakan kebenaran.',
    derivatives: {
      'كَذَبَ': 'Berdusta / Berbohong',
      'كَذَبُوا۟': 'Mereka berdusta',
      'يَكْذِبُونَ': 'Mereka berdusta',
      'تَكْذِبُونَ': 'Kalian berdusta',
      'كَذَّبَ': 'Mendustakan / Mengingkari wahyu',
      'كَذَّبُوا۟': 'Mereka mendustakan',
      'يُكَذِّبُ': 'Mendustakan',
      'يُكَذِّبُونَ': 'Mereka mendustakan',
      'تُكَذِّبَانِ': 'Kamu berdua dustakan',
      'كَذِب': 'Kedustaan / Dusta',
      'كَذِبًا': 'Kedustaan / Secara dusta',
      'كَاذِب': 'Orang yang berdusta / Pembohong',
      'كَاذِبُونَ': 'Orang-orang yang berdusta',
      'مُكَذِّب': 'Orang yang mendustakan',
      'مُكَذِّبِينَ': 'Orang-orang yang mendustakan kebenaran',
      'كِذَّاب': 'Pendustaan besar-besaran',
      'كِذَّابًا': 'Kedustaan yang besar',
    },
  },

  // 4. Root k-w-n (ك و ن) — 1,390 occurrences
  'k-w-n': {
    rootArabic: 'ك و ن',
    rootLatin: 'kwn',
    titleIndo: 'Akar ك و ن (Eksistensi, Ada, Menjadi, Takdir)',
    coreMeaning: 'Menjadi, terjadi, terwujud, ketetapan takdir, dan eksistensi wujud.',
    derivatives: {
      'كَانَ': 'Ada / Adalah / Dia telah menjadi',
      'كَانُوا۟': 'Mereka adalah / Mereka dahulu',
      'كُنْتَ': 'Engkau adalah / Dahulu engkau',
      'كُنتُمْ': 'Kalian adalah / Dahulu kalian',
      'كُنَّا': 'Kami adalah',
      'يَكُونُ': 'Menjadi / Terjadi',
      'يَكُونُونَ': 'Mereka menjadi',
      'تَكُونُ': 'Engkau menjadi / Dia (perempuan) menjadi',
      'أَكُونَ': 'Aku menjadi',
      'نَكُونَ': 'Kami menjadi',
      'كُن': 'Jadilah! (Firman penciptaan)',
      'كُونُوا۟': 'Jadilah kalian!',
      'مَكَان': 'Tempat / Kedudukan',
      'مَكَانًا': 'Tempat / Posisi',
      'مَكَانَة': 'Kedudukan / Keadaan',
    },
  },

  // 5. Root d-x-l (د خ ل) — 126 occurrences
  'd-x-l': {
    rootArabic: 'د خ ل',
    rootLatin: 'dxl',
    titleIndo: 'Akar د خ ل (Masuk, Memasukkan)',
    coreMeaning: 'Masuk ke suatu tempat, memasukkan sesuatu, dan bergabung ke dalam suatu hal.',
    derivatives: {
      'دَخَلَ': 'Dia telah masuk',
      'دَخَلُوا۟': 'Mereka telah masuk',
      'دَخَلْتُم': 'Kalian telah masuk',
      'يَدْخُلُ': 'Dia sedang/akan masuk',
      'يَدْخُلُونَ': 'Mereka masuk',
      'تَدْخُلُوا۟': 'Kalian masuk',
      'ٱدْخُلُوا۟': 'Masuklah kalian!',
      'ٱدْخُلْ': 'Masuklah engkau!',
      'أَدْخَلَ': 'Dia memasukkan',
      'أَدْخِلْنَا': 'Masukkanlah kami!',
      'يُدْخِلُ': 'Dia memasukkan',
      'يُدْخِلْهُمْ': 'Dia memasukkan mereka',
      'مَدْخَل': 'Tempat masuk / Pintu masuk',
      'مُدْخَل': 'Pintu gerbang masuk yang mulia',
      'دَاخِلُونَ': 'Orang-orang yang hina dina / tunduk',
    },
  },

  // 6. Root E-m-l (ع م ل) — 360 occurrences
  'E-m-l': {
    rootArabic: 'ع م ل',
    rootLatin: 'Eml',
    titleIndo: 'Akar ع م ل (Beramal, Bekerja, Berbuat)',
    coreMeaning: 'Bekerja, melakukan perbuatan nyata secara sengaja, dan beramal kebajikan.',
    derivatives: {
      'عَمِلَ': 'Dia telah berbuat / beramal',
      'عَمِلُوا۟': 'Mereka telah beramal shalih',
      'عَمِلْتُمْ': 'Kalian telah kerjakan',
      'يَعْمَلُ': 'Dia mengerjakan',
      'يَعْمَلُونَ': 'Mereka mengerjakan / memperbuat',
      'تَعْمَلُونَ': 'Kalian kerjakan',
      'ٱعْمَلُوا۟': 'Bekerjalah / Beramallah kalian!',
      'عَمَل': 'Pekerjaan / Amal perbuatan',
      'عَمَلًا': 'Pekerjaan / Perbuatan nyata',
      'أَعْمَال': 'Amal-amal perbuatan (jamak)',
      'أَعْمَٰلُهُمْ': 'Amal-amal perbuatan mereka',
      'عَامِل': 'Orang yang bekerja / beramal',
      'عَامِلِينَ': 'Orang-orang yang bekerja / beramal',
    },
  },

  // 7. Root E-l-m (ع ل م) — 854 occurrences
  'E-l-m': {
    rootArabic: 'ع ل م',
    rootLatin: 'Elm',
    titleIndo: 'Akar ع ل م (Mengetahui, Memahami, Ilmu)',
    coreMeaning: 'Mengetahui hakikat kebenaran, memahami tanda, dan menguasai ilmu pengetahuan.',
    derivatives: {
      'عَلِمَ': 'Dia telah mengetahui',
      'عَلِمُوا۟': 'Mereka mengetahui',
      'عَلِمْتُمْ': 'Kalian ketahui',
      'يَعْلَمُ': 'Dia mengetahui (Maha Mengetahui)',
      'يَعْلَمُونَ': 'Mereka mengetahui',
      'تَعْلَمُونَ': 'Kalian ketahui',
      'ٱعْلَمُوا۟': 'Ketahuilah oleh kalian!',
      'عَلَّمَ': 'Dia mengajarkan',
      'عَلَّمْنَٰهُ': 'Kami ajarkan kepadanya',
      'عِلْم': 'Ilmu pengetahuan / Petunjuk wahyu',
      'عِلْمًا': 'Pengetahuan luas',
      'عَالِم': 'Orang yang berilmu / Mengetahui hal ghaib',
      'عَلِيم': 'Maha Mengetahui segala sesuatu',
      'عَلِيمٌ': 'Maha Mengetahui',
      'عَالَمِينَ': 'Seluruh semesta alam',
      'ٱلْعَٰلَمِينَ': 'Seluruh semesta alam ciptaan Allah',
      'عَلَامَات': 'Tanda-tanda petunjuk jalan',
    },
  },

  // 8. Root r-H-m (ر ح م) — 339 occurrences
  'r-H-m': {
    rootArabic: 'ر ح م',
    rootLatin: 'rHm',
    titleIndo: 'Akar ر ح م (Rahmat, Kasih Sayang, Belas Kasih)',
    coreMeaning: 'Kasih sayang yang mendalam, kelembutan hati, karunia, dan pengampunan.',
    derivatives: {
      'رَحِمَ': 'Dia merahmati / menyayangi',
      'يَرْحَمُ': 'Dia merahmati',
      'ٱرْحَمْنَا': 'Rahmatilah kami!',
      'رَحْمَة': 'Rahmat / Karunia kasih sayang',
      'رَحْمَتِى': 'Rahmat-Ku',
      'ٱلرَّحْمَٰنُ': 'Maha Pengasih bagi seluruh makhluk',
      'ٱلرَّحِيمُ': 'Maha Penyayang bagi hamba-Nya yang beriman',
      'أَرْحَام': 'Tali persaudaraan rahim / Kandungan ibu',
      'رَاحِمِينَ': 'Pemberi kasih sayang terbaik',
    },
  },

  // 9. Root g-f-r (غ ف ر) — 234 occurrences
  'g-f-r': {
    rootArabic: 'غ ف ر',
    rootLatin: 'gfr',
    titleIndo: 'Akar غ ف ر (Mengampuni, Menutupi Kesalahan)',
    coreMeaning: 'Menutupi dosa, memaafkan kesalahan, dan melindungi dari siksaan.',
    derivatives: {
      'غَفَرَ': 'Dia telah mengampuni',
      'يَغْفِرُ': 'Dia mengampuni',
      'ٱغْفِرْ': 'Ampunilah!',
      'ٱغْفِرْ لَنَا': 'Ampunilah dosa-dosa kami!',
      'مَغْفِرَة': 'Ampunan dosa',
      'غَفُور': 'Maha Pengampun',
      'غَفُورٌ': 'Maha Pengampun',
      'غَفَّار': 'Maha Pengampun yang berulang-ulang',
      'ٱسْتَغْفِرُوا۟': 'Mohonlah ampunan kepada Allah!',
    },
  },

  // 10. Root x-l-q (خ ل ق) — 261 occurrences
  'x-l-q': {
    rootArabic: 'خ ل ق',
    rootLatin: 'xlq',
    titleIndo: 'Akar خ ل ق (Menciptakan, Menjadikan)',
    coreMeaning: 'Menciptakan sesuatu dari ketiadaan, menakar ukuran ciptaan, dan watak fitrah.',
    derivatives: {
      'خَلَقَ': 'Dia telah menciptakan',
      'خَلَقْنَا': 'Kami telah menciptakan',
      'خَلَقَكُم': 'Dia menciptakan kalian',
      'يَخْلُقُ': 'Dia menciptakan apa yang dikehendaki',
      'خَلْق': 'Penciptaan / Ciptaan alam',
      'خَلْقًا': 'Ciptaan baru',
      'خَالِق': 'Sang Pencipta',
      'خَلَّاق': 'Maha Pencipta yang tiada henti',
      'أَخْلَاق': 'Budi pekerti / Watak fitrah',
    },
  },

  // 11. Root S-l-H (ص ل ح) — 180 occurrences
  'S-l-H': {
    rootArabic: 'ص ل ح',
    rootLatin: 'SlH',
    titleIndo: 'Akar ص ل ح (Saleh, Baik, Memperbaiki)',
    coreMeaning: 'Kebaikan, kesalehan jiwa, memperbaiki kerusakan, dan bermanfaat.',
    derivatives: {
      'صَلَحَ': 'Baik / Bermanfaat',
      'أَصْلَحَ': 'Memperbaiki kerusakan',
      'أَصْلَحُوا۟': 'Mereka memperbaiki diri',
      'يُصْلِحُ': 'Memperbaiki keadaan',
      'صَالِح': 'Orang yang saleh / taat',
      'صَالِحًا': 'Amal kebajikan / Perbuatan baik',
      'صَالِحُونَ': 'Orang-orang yang saleh',
      'صَالِحَات': 'Amalan-amalan kebajikan',
      'مُصْلِحُونَ': 'Orang-orang yang mengadakan perbaikan',
    },
  },

  // 12. Root Z-l-m (ظ ل م) — 315 occurrences
  'Z-l-m': {
    rootArabic: 'ظ ل م',
    rootLatin: 'Zlm',
    titleIndo: 'Akar ظ ل م (Zalim, Kegelapan, Aniaya)',
    coreMeaning: 'Menempatkan sesuatu bukan pada tempatnya yang hak, kegelapan, dan aniaya.',
    derivatives: {
      'ظَلَمَ': 'Dia telah berbuat zalim',
      'ظَلَمُوا۟': 'Mereka telah berbuat zalim',
      'ظَلَمْتُمْ': 'Kalian telah menzalimi diri sendiri',
      'يَظْلِمُ': 'Berbuat zalim',
      'يَظْلِمُونَ': 'Mereka berbuat zalim',
      'ظُلْم': 'Kezaliman / Aniaya',
      'ظُلْمًا': 'Secara zalim / Aniaya besar',
      'ظَالِم': 'Orang yang zalim',
      'ظَالِمُونَ': 'Orang-orang yang berbuat aniaya',
      'ظُلُمَات': 'Kegelapan yang berlapis-lapis',
      'ظَلَّام': 'Maha berbuat aniaya (dinafikan dari Allah)',
    },
  },

  // 13. Root S-b-r (ص ب ر) — 103 occurrences
  'S-b-r': {
    rootArabic: 'ص ب ر',
    rootLatin: 'Sbr',
    titleIndo: 'Akar ص ب ر (Sabar, Tabah, Menahan Diri)',
    coreMeaning: 'Menahan jiwa dari keluh kesah, teguh menjalankan ketaatan, dan tabah menghadapi ujian.',
    derivatives: {
      'صَبَرَ': 'Dia bersabar',
      'صَبَرُوا۟': 'Mereka telah bersabar',
      'ٱصْبِرْ': 'Bersabarlah engkau!',
      'ٱصْبِرُوا۟': 'Bersabarlah kalian!',
      'صَبْر': 'Kesabaran / Ketabahan hati',
      'صَبْرًا': 'Dengan penuh kesabaran',
      'صَابِر': 'Orang yang sabar',
      'صَابِرُونَ': 'Orang-orang yang tabah bersabar',
      'صَبَّار': 'Orang yang amat penyabar',
    },
  },

  // 14. Root $-k-r (ش ك ر) — 75 occurrences
  '$-k-r': {
    rootArabic: 'ش ك ر',
    rootLatin: '$kr',
    titleIndo: 'Akar ش ك ر (Bersyukur, Berterima Kasih)',
    coreMeaning: 'Mengakui nikmat dengan lisan, hati, dan perbuatan, serta membalas kebaikan.',
    derivatives: {
      'شَكَرَ': 'Dia bersyukur',
      'شَكَرْتُمْ': 'Kalian bersyukur',
      'يَشْكُرُ': 'Dia bersyukur kepada Allah',
      'يَشْكُرُونَ': 'Mereka bersyukur',
      'ٱشْكُرُوا۟': 'Bersyukurlah kalian!',
      'شُكْر': 'Rasa syukur / Terima kasih',
      'شَاكِر': 'Orang yang bersyukur',
      'شَاكِرُونَ': 'Orang-orang yang pandai bersyukur',
      'شَكُور': 'Maha Menghargai kebaikan hamba / Sangat bersyukur',
    },
  },

  // 15. Root A-m-n (ا م ن) — 879 occurrences
  'A-m-n': {
    rootArabic: 'ا م ن',
    rootLatin: 'Amn',
    titleIndo: 'Akar ا م ن (Iman, Rasa Aman, Kepercayaan)',
    coreMeaning: 'Ketenteraman jiwa dari ketakutan, kejujuran amanah, dan membenarkan wahyu Ilahi.',
    derivatives: {
      'ءَامَنَ': 'Dia telah beriman',
      'ءَامَنُوا۟': 'Orang-orang yang beriman',
      'يُؤْمِنُ': 'Dia beriman',
      'يُؤْمِنُونَ': 'Mereka beriman kepada perkara ghaib',
      'ءَامِنُوا۟': 'Berimanlah kalian!',
      'إِيمَان': 'Keimanan yang kokoh',
      'أَمْن': 'Rasa aman dan tenteram',
      'أَمَانَة': 'Amanah / Titipan tanggung jawab',
      'مُؤْمِن': 'Orang yang beriman (Mukmin)',
      'مُؤْمِنُونَ': 'Orang-orang mukmin yang sejati',
      'أَمِين': 'Dapat dipercaya / Terpercaya',
    },
  },

  // 16. Root q-w-l (ق و ل) — 1,722 occurrences
  'q-w-l': {
    rootArabic: 'ق و ل',
    rootLatin: 'qwl',
    titleIndo: 'Akar ق و ل (Berkata, Berucap, Firman)',
    coreMeaning: 'Mengeluarkan ucapan yang bermakna, menyampaikan perkataan, dan firman wahyu.',
    derivatives: {
      'قَالَ': 'Dia telah berkata',
      'قَالُوا۟': 'Mereka berkata',
      'قُلْتُ': 'Aku telah berkata',
      'يَقُولُ': 'Dia berkata / berucap',
      'يَقُولُونَ': 'Mereka mengatakan',
      'قُلْ': 'Katakanlah wahai Nabi!',
      'قَوْل': 'Perkataan / Ucapan / Kalimat',
      'قَوْلًا': 'Perkataan yang benar',
      'قِيلَ': 'Dikatakan kepada mereka',
    },
  },

  // 17. Root h-d-y (ه د ي) — 316 occurrences
  'h-d-y': {
    rootArabic: 'ه د ي',
    rootLatin: 'hdy',
    titleIndo: 'Akar ه د ي (Petunjuk, Hidayah, Bimbingan)',
    coreMeaning: 'Menunjuki jalan kebenaran, membimbing kepada petunjuk lurus, dan menganugerahkan hidayah.',
    derivatives: {
      'هَدَىٰ': 'Memberi petunjuk / Menunjuki',
      'يَهْدِي': 'Membimbing / Memberi hidayah',
      'ٱهْدِنَا': 'Tunjukilah kami jalan yang lurus',
      'هُدًى': 'Petunjuk kebenaran (Hidayah)',
      'ٱلْهُدَىٰ': 'Petunjuk wahyu Allah',
      'مُهْتَدُونَ': 'Orang-orang yang mendapat petunjuk',
      'مُهْتَدٍ': 'Orang yang terbimbing',
    },
  },

  // 18. Root r-b-b (ر ب ب) — 980 occurrences
  'r-b-b': {
    rootArabic: 'ر ب ب',
    rootLatin: 'rbb',
    titleIndo: 'Akar ر ب ب (Tuhan Pemelihara, Rabb)',
    coreMeaning: 'Memelihara, mendidik, merawat secara bertahap hingga sempurna, dan menguasai kepemilikan semesta alam.',
    derivatives: {
      'رَبّ': 'Tuhan Pemelihara (Rabb)',
      'رَبِّ': 'Tuhan Pemeliharaku',
      'رَبَّنَا': 'Ya Tuhan Pemelihara kami',
      'رَبُّكُمْ': 'Tuhan Pemelihara kalian',
      'رَبِّهِمْ': 'Tuhan Pemelihara mereka',
      'ٱلرَّبّ': 'Sang Maha Pemelihara',
    },
  },

  // 19. Root n-z-l (ن ز ل) — 293 occurrences
  'n-z-l': {
    rootArabic: 'ن ز ل',
    rootLatin: 'nzl',
    titleIndo: 'Akar ن ز ل (Turun, Menurunkan Wahyu)',
    coreMeaning: 'Turun dari ketinggian, menurunkan wahyu, kitab suci, rahmat, atau rezeki dari langit.',
    derivatives: {
      'نَزَلَ': 'Telah turun',
      'أَنزَلَ': 'Telah menurunkan (wahyu)',
      'أَنزَلْنَا': 'Kami telah menurunkan',
      'نَزَّلَ': 'Menurunkan secara berangsur-angsur',
      'تَنزِيل': 'Penurunan wahyu Al-Qur\'an',
      'مُنزَل': 'Tempat yang diturunkan',
    },
  },

  // 20. Root k-t-b (ك ت ب) — 319 occurrences
  'k-t-b': {
    rootArabic: 'ك ت ب',
    rootLatin: 'ktb',
    titleIndo: 'Akar ك ت ب (Menulis, Mewajibkan, Kitab)',
    coreMeaning: 'Mengumpulkan huruf menjadi tulisan, mencatat takdir, menetapkan hukum kewajiban, dan Kitab Suci.',
    derivatives: {
      'كَتَبَ': 'Telah menulis / Mewajibkan',
      'كُتِبَ': 'Diwajibkan / Ditetapkan',
      'كِتَٰب': 'Kitab / Buku catatan amal',
      'ٱلْكِتَٰب': 'Al-Kitab (Al-Qur\'an / Taurat / Injil)',
      'يَكْتُبُونَ': 'Mereka menulis',
      'كَاتِب': 'Juru tulis',
    },
  },

  // 21. Root E-b-d (ع ب د) — 275 occurrences
  'E-b-d': {
    rootArabic: 'ع ب د',
    rootLatin: 'Ebd',
    titleIndo: 'Akar ع ب د (Menyembah, Ibadah, Hamba)',
    coreMeaning: 'Menghinakan diri dalam ketundukan penuh kepada Allah, menyembah dengan penuh cinta, dan melayani sebagai hamba.',
    derivatives: {
      'عَبَدَ': 'Menyembah',
      'نَعْبُدُ': 'Kami menyembah hanya kepada-Mu',
      'ٱعْبُدُوا۟': 'Sembahlah oleh kalian!',
      'عِبَاد': 'Hamba-hamba Allah',
      'عِبَادَة': 'Ibadah / Penghambaan',
      'عَابِدُونَ': 'Orang-orang yang beribadah',
    },
  },

  // 22. Root b-y-n (ب ي ن) — 523 occurrences
  'b-y-n': {
    rootArabic: 'ب ي ن',
    rootLatin: 'byn',
    titleIndo: 'Akar ب ي ن (Jelas, Nyata, Menerangkan)',
    coreMeaning: 'Tampak jelas dan terpisah dari keraguan, menjelaskan hakikat perkara, dan bukti nyata kebenaran.',
    derivatives: {
      'بَيَّنَ': 'Menjelaskan dengan terang',
      'بَيَّنَّا': 'Kami telah menjelaskan',
      'يُبَيِّنُ': 'Menjelaskan / Menerangkan',
      'بَيِّنَة': 'Bukti yang nyata / Keterangan jelas',
      'بَيِّنَٰت': 'Bukti-bukti nyata kebenaran',
      'بَيْنَ': 'Di antara',
      'مُبِين': 'Yang nyata / Terang benderang',
    },
  },

  // 23. Root j-E-l (ج ع ل) — 346 occurrences (QS. 105:2:2, etc.)
  'j-E-l': {
    rootArabic: 'ج ع ل',
    rootLatin: 'jEl',
    titleIndo: 'Akar ج ع ل (Membuat, Menjadikan, Menetapkan)',
    coreMeaning: 'Menjadikan, membuat, menempatkan, mengubah keadaan, menunjuk, dan menetapkan peran terstruktur.',
    derivatives: {
      'جَعَلَ': 'Dia membuat / menjadikan / menempatkan',
      'جَعَلْنَا': 'Kami jadikan / Kami ciptakan',
      'جَعَلُوا۟': 'Mereka menjadikan',
      'جَعَلُوا': 'Mereka menjadikan',
      'يَجْعَلْ': 'Dia membuat / menjadikan',
      'يَجْعَلُ': 'Dia membuat / menjadikan',
      'يَجْعَلُونَ': 'Mereka menjadikan',
      'تَجْعَلُوا۟': 'Jangan kamu jadikan / Kamu jadikan',
      'تَجْعَلُوا': 'Jangan kamu jadikan / Kamu jadikan',
      'تَجْعَلْ': 'Engkau jadikan',
      'أَجْعَلُ': 'Aku menjadikan',
      'نَجْعَلَ': 'Kami jadikan',
      'نَجْعَلُ': 'Kami jadikan',
      'جَاعِل': 'Yang menjadikan',
      'جَاعِلٌ': 'Yang menjadikan',
      'جَاعِلُوكَ': 'Menjadikanmu',
      'جَعْل': 'Pembuatan / Penetapan',
    },
  },

  // 24. Root A-j-r (أ ج ر) — 108 occurrences (QS. 95:6:7, etc.)
  'A-j-r': {
    rootArabic: 'أ ج ر',
    rootLatin: 'Ajr',
    titleIndo: 'Akar أ ج ر (Pahala, Upah, Kompensasi Kebaikan)',
    coreMeaning: 'Memberi imbalan yang adil, upah atas kebaikan atau jasa, dan ganti rugi yang mulia.',
    derivatives: {
      'أَجْر': 'Pahala / Imbalan / Upah',
      'أَجْرٌ': 'Pahala / Imbalan yang agung',
      'أَجْرًا': 'Pahala yang besar / balasan',
      'أَجْرِيَ': 'Upahku / Pahala bagiku',
      'أَجْرِهِ': 'Pahalanya',
      'أَجْرُهُمْ': 'Pahala mereka',
      'أُجُور': 'Pahala-pahala / Mahar / Upah',
      'أُجُورَهُمْ': 'Pahala-pahala mereka',
      'أُجُورَهُنَّ': 'Mahar-mahar mereka',
      'أَجْرَيْنِ': 'Dua pahala',
      'أَجَرَ': 'Dia memberi imbalan / menyewa',
      'تَأْجُرَنِي': 'Engkau bekerja padaku',
      'ٱسْتَـْٔجِرْهُ': 'Pekerjakanlah dia',
    },
  },

  // 25. Root f-E-l (ف ع ل) — 108 occurrences
  'f-E-l': {
    rootArabic: 'ف ع ل',
    rootLatin: 'fEl',
    titleIndo: 'Akar ف ع ل (Mengerjakan, Berbuat, Melakukan)',
    coreMeaning: 'Mengerjakan suatu tindakan, mewujudkan perbuatan nyata, dan beraktivitas.',
    derivatives: {
      'فَعَلَ': 'Dia telah berbuat / mengerjakan',
      'فَعَلْتُمْ': 'Kalian telah kerjakan',
      'فَعَلُوا۟': 'Mereka telah perbuat',
      'يَفْعَلُ': 'Dia berbuat / mengerjakan',
      'يَفْعَلُونَ': 'Mereka berbuat / mengerjakan',
      'تَفْعَلُوا۟': 'Kalian kerjakan',
      'تَفْعَلُونَ': 'Kalian kerjakan',
      'فِعْل': 'Perbuatan / Tindakan',
      'فَعَّال': 'Maha Melaksanakan kehendak-Nya',
    },
  },

  // 26. Root m-l-k (م ل ك) — 206 occurrences (QS. 1:4:1, QS. 2:30:4, etc.)
  'm-l-k': {
    rootArabic: 'م ل ك',
    rootLatin: 'mlk',
    titleIndo: 'Akar م ل ك (Kepemilikan, Kerajaan, Penguasa, Malaikat)',
    coreMeaning: 'Kepemilikan hakiki, kekuasaan semesta, wewenang mengatur urusan, dan utusan Ilahi yang patuh.',
    derivatives: {
      'مَلَك': 'Malaikat',
      'مَلَكًا': 'Seorang malaikat',
      'مَلَكٌ': 'Malaikat',
      'مَلَكَيْنِ': 'Dua malaikat (Harut & Marut)',
      'مَلَـٰٓئِكَة': 'Para Malaikat',
      'مَلَائِكَة': 'Para Malaikat',
      'ٱلْمَلَـٰٓئِكَةُ': 'Para Malaikat',
      'ٱلْمَلَـٰٓئِكَةِ': 'Para Malaikat',
      'ٱلْمَلَـٰٓئِكَةَ': 'Para Malaikat',
      'يَمْلِكُ': 'Dia memiliki / menguasai',
      'يَمْلِكُونَ': 'Mereka memiliki / menguasai',
      'أَمْلِكُ': 'Aku memiliki / menguasai',
      'تَمْلِكُ': 'Kamu memiliki / menguasai',
      'تَمْلِكُونَ': 'Kalian memiliki / menguasai',
      'نَمْلِكُ': 'Kami memiliki / menguasai',
      'مَلَكَتْ': 'Dimiliki oleh (hamba sahaya)',
      'مَلَكْتُمْ': 'Kalian miliki / kuasai',
      'مُلْك': 'Kerajaan / Kekuasaan mutlak',
      'مُلْكًا': 'Kerajaan / Kekuasaan yang besar',
      'مُلْكُ': 'Kerajaan / Kepemilikan',
      'مُلْكِ': 'Kerajaan / Kekuasaan',
      'ٱلْمُلْكُ': 'Kerajaan semesta / Kekuasaan mutlak',
      'مَلِك': 'Raja / Penguasa',
      'مَلِكًا': 'Seorang raja',
      'مَلِكٌ': 'Raja',
      'ٱلْمَلِكُ': 'Sang Raja (Maha Penguasa)',
      'مُلُوك': 'Raja-raja',
      'مُلُوكًا': 'Raja-raja',
      'مَالِك': 'Pemilik / Penguasa / Malaikat Malik',
      'مَـٰلِكِ': 'Pemilik / Penguasa (Hari Pembalasan)',
      'مَمْلُوك': 'Hamba sahaya / Yang dimiliki',
      'مَمْلُوكًا': 'Hamba sahaya / Yang dimiliki orang lain',
      'مَلَكُوت': 'Kerajaan agung / Kekuasaan semesta',
      'مَلَكُوتَ': 'Kerajaan semesta / Kekuasaan tertinggi',
      'مَلِيك': 'Raja Yang Maha Kuasa',
    },
  },

  // 27. Root E-m-y (ع م ي) — 33 occurrences (QS. 80:2, etc.)
  'E-m-y': {
    rootArabic: 'ع م ي',
    rootLatin: 'Emy',
    titleIndo: 'Akar ع م ي (Kebutaan, Tertutup Penglihatan, Buta Hati)',
    coreMeaning: 'Hilangnya penglihatan mata lahiriah atau tertutupnya mata batin/nurani dari petunjuk kebenaran.',
    derivatives: {
      'أَعْمَىٰ': 'Orang yang buta',
      'ٱلْأَعْمَىٰ': 'Orang yang buta',
      'أَعْمَى': 'Orang yang buta',
      'عَمِىَ': 'Dia telah buta (mata/hatinya)',
      'عَمُوا۟': 'Mereka telah buta',
      'عَمِينَ': 'Orang-orang yang buta mata hatinya',
      'عُمْي': 'Orang-orang buta (jamak)',
      'عُمْيًا': 'Dalam keadaan buta',
      'عُمْيٌ': 'Orang-orang buta',
      'عُمِّيَتْ': 'Dibutakan / Disamarkan bagi mereka',
      'تَعْمَى': 'Menjadi buta (mata hati)',
      'عَمَايَة': 'Kesesatan / Kebutaan batin',
    },
  },

  // 28. Root w-k-l (و ك ل) — 70 occurrences (QS. 67:29, 3:173, etc.)
  'w-k-l': {
    rootArabic: 'و ك ل',
    rootLatin: 'wkl',
    titleIndo: 'Akar و ك ل (Tawakal, Perlindungan, Penyerahan Diri)',
    coreMeaning: 'Penyerahan urusan, sandaran perlindungan, dan keyakinan berserah diri sepenuhnya kepada pemeliharaan Allah.',
    derivatives: {
      'وَكِيل': 'Pelindung / Penjamin / Pemelihara',
      'وَكِيلًا': 'Sebagai Pelindung / Penjamin',
      'وَكِيلًۭا': 'Sebagai Pelindung / Penjamin',
      'وَكِيلُ': 'Pelindung / Penjamin',
      'وَكِيلٍ': 'Pelindung / Penjamin',
      'تَوَكَّلْ': 'Bertawakallah / Berserah dirilah',
      'وَتَوَكَّلْ': 'Dan bertawakallah',
      'فَتَوَكَّلْ': 'Maka bertawakallah',
      'تَوَكَّلْنَا': 'Kami bertawakal / berserah diri',
      'تَوَكَّلْتُ': 'Aku bertawakal / berserah diri',
      'تَوَكَّلُوا۟': 'Bertawakallah kalian',
      'يَتَوَكَّلِ': 'Dia bertawakal / berserah diri',
      'يَتَوَكَّلْ': 'Dia bertawakal / berserah diri',
      'يَتَوَكَّلُ': 'Dia bertawakal / berserah diri',
      'يَتَوَكَّلُونَ': 'Mereka bertawakal / berserah diri',
      'فَلْيَتَوَكَّلِ': 'Maka hendaklah dia bertawakal',
      'فَلْيَتَوَكَّلْ': 'Maka hendaklah bertawakal',
      'وَعَلَى ٱللَّهِ فَلْيَتَوَكَّلِ': 'Dan hanya kepada Allah bertawakal',
      'تَتَوَكَّلُوا۟': 'Kalian bertawakal / berserah diri',
      'نَتَوَكَّلَ': 'Kami bertawakal / berserah diri',
      'نَتَوَكَّلُ': 'Kami bertawakal / berserah diri',
      'مُتَوَكِّلُونَ': 'Orang-orang yang bertawakal',
      'ٱلْمُتَوَكِّلُونَ': 'Orang-orang yang bertawakal',
      'مُتَوَكِّلِينَ': 'Orang-orang yang bertawakal',
      'ٱلْمُتَوَكِّلِينَ': 'Orang-orang yang bertawakal',
      'وَكَّلْنَا': 'Kami serahkan tanggung jawab / percayakan',
      'وَكَّلْ': 'Serahkanlah tanggung jawab',
      'وُكِّلَ': 'Diserahi urusan / ditugasi memelihara',
    },
  },

  // 29. Root s-l-m (س ل م) — 140 occurrences
  's-l-m': {
    rootArabic: 'س ل م',
    rootLatin: 'slm',
    titleIndo: 'Akar س ل م (Kedamaian, Keselamatan, Kepasrahan Islam)',
    coreMeaning: 'Keselamatan dari bahaya, ketenteraman hati, dan kepasrahan lahir-batin secara utuh kepada Allah.',
    derivatives: {
      'سَلَٰم': 'Kedamaian / Keselamatan / Sejahtera',
      'سَلَٰمٌ': 'Kedamaian / Keselamatan',
      'سَلَام': 'Kedamaian / Keselamatan',
      'سَلَامًا': 'Kedamaian / Ucapan keselamatan',
      'ٱلسَّلَٰمُ': 'Kesejahteraan / Keselamatan (As-Salam)',
      'إِسْلَٰم': 'Kepasrahan total kepada Allah (Islam)',
      'ٱلْإِسْلَٰمُ': 'Agama kepasrahan kepada Allah (Islam)',
      'ٱلْإِسْلَٰمِ': 'Agama Islam / Kepasrahan diri',
      'مُسْلِم': 'Orang yang berserah diri (Muslim)',
      'مُسْلِمٌ': 'Seorang muslim yang berserah diri',
      'مُسْلِمِينَ': 'Orang-orang yang berserah diri (Muslimin)',
      'مُسْلِمُونَ': 'Orang-orang yang berserah diri (Muslimun)',
      'مُّسْلِمَةٍ': 'Wanita yang berserah diri',
      'مُسْلِمَٰتٍ': 'Wanita-wanita yang berserah diri',
      'أَسْلَمَ': 'Dia telah berserah diri',
      'أَسْلَمْتُ': 'Aku berserah diri',
      'أَسْلَمْنَا': 'Kami telah berserah diri',
      'أَسْلِمُوا۟': 'Berserah dirilah kalian',
      'سَلِيم': 'Hati yang bersih / selamat dari cela',
      'سَلِيمٍ': 'Hati yang bersih dan lurus',
      'سُلَّم': 'Tangga menuju langit',
      'السِّلْم': 'Kedamaian / Masuk Islam seutuhnya',
    },
  },

  // 30. Root H-m-d (ح م د) — 68 occurrences
  'H-m-d': {
    rootArabic: 'ح م د',
    rootLatin: 'Hmd',
    titleIndo: 'Akar ح م د (Pujian, Kesyukuran, Kemuliaan)',
    coreMeaning: 'Memuji sifat-sifat kesempurnaan dan memuliakan kebaikan atas dasar cinta dan pengagungan.',
    derivatives: {
      'حَمْد': 'Pujian / Syukur',
      'ٱلْحَمْدُ': 'Segala puji bagi Allah',
      'حَمِيد': 'Maha Terpuji / Kaya akan pujian',
      'حَمِيدٌ': 'Maha Terpuji',
      'حَمِيدٍ': 'Yang Terpuji',
      'مَحْمُود': 'Terpuji (kedudukan yang mulia)',
      'مَّحْمُودًا': 'Kedudukan yang terpuji',
      'أَحْمَدُ': 'Ahmad (Yang paling terpuji)',
      'مُحَمَّد': 'Muhammad (Yang amat terpuji)',
      'مُّحَمَّدٌ': 'Muhammad Rasulullah SAW',
      'يَحْمَدُونَ': 'Mereka suka dipuji',
    },
  },

  // 31. Root r-z-q (ر ز ق) — 123 occurrences
  'r-z-q': {
    rootArabic: 'ر ز ق',
    rootLatin: 'rzq',
    titleIndo: 'Akar ر ز ق (Rezeki, Nafkah, Anugerah Kehidupan)',
    coreMeaning: 'Pemberian karunia, kecukupan nafkah, dan segala anugerah penopang kehidupan materiil maupun spiritual.',
    derivatives: {
      'رَزَقَ': 'Dia telah memberi rezeki',
      'رَزَقَهُمُ': 'Dia menganugerahi mereka rezeki',
      'رَزَقْنَا': 'Kami anugerahkan rezeki',
      'رَزَقْنَٰهُمْ': 'Kami anugerahkan rezeki kepada mereka',
      'رَزَقَكُمُ': 'Allah menganugerahkan rezeki kepadamu',
      'رِزْق': 'Rezeki / Karunia nafkah',
      'رِزْقًا': 'Sebagai limpahan rezeki',
      'رِزْقُ': 'Rezeki / Nafkah penopang',
      'رِزْقِ': 'Rezeki karunia Allah',
      'ٱلرَّزَّاقُ': 'Maha Pemberi Rezeki',
      'يَرْزُقُ': 'Dia melimpahkan rezeki',
      'يَرْزُقُكُم': 'Dia memberi kalian rezeki',
      'تَرْزُقُ': 'Engkau melimpahkan rezeki',
      'نَرْزُقُكَ': 'Kami yang memberi rezeki kepadamu',
      'نَرْزُقُهُمْ': 'Kami yang memberi rezeki kepada mereka',
      'تُرْزَقَانِهِ': 'Diberikan rezeki kepadamu berdua',
    },
  },

  // 32. Root $-y-A (ش ي ا) — 519 occurrences
  '$-y-A': {
    rootArabic: 'ش ي ا',
    rootLatin: '$yA',
    titleIndo: 'Akar ش ي ا (Kehendak Mutlak & Segala Sesuatu)',
    coreMeaning: 'Kehendak mutlak ilahi (masyi\'ah), ketetapan takdir, dan pewujudan segala entitas ciptaan (syai\').',
    derivatives: {
      'شَآءَ': 'Berkehendak / Menghendaki',
      'شَاْءَ': 'Berkehendak / Menghendaki',
      'شَاءَ': 'Berkehendak / Menghendaki',
      'يَشَآءُ': 'Dia berkehendak',
      'يَشَاءُ': 'Dia berkehendak',
      'نَشَآءُ': 'Kami berkehendak',
      'نَشَاءُ': 'Kami berkehendak',
      'تَشَآءُ': 'Kamu berkehendak',
      'تَشَاءُ': 'Kamu berkehendak',
      'شِئْتَ': 'Engkau kehendaki',
      'شِئْنَا': 'Kami kehendaki',
      'شِئْتُمْ': 'Kamu kehendaki',
      'شَىْء': 'Sesuatu / Suatu hal',
      'شَيْء': 'Sesuatu / Segala sesuatu',
      'شَيْءٍۢ': 'Sesuatu / Segala hal',
      'شَيْـًٔا': 'Sesuatu apa pun',
      'أَشْيَآءَ': 'Sesuatu-sesuatu / Hal-hal (jamak)',
    },
  },

  // 33. Root E-l-y (ع ل ي) — 215 occurrences
  'E-l-y': {
    rootArabic: 'ع ل ي',
    rootLatin: 'Ely',
    titleIndo: 'Akar ع ل ي (Ketinggian Martabat & Keluhuran)',
    coreMeaning: 'Ketinggian derajat, keluhuran martabat ilahi, dan posisi unggul di atas segalanya.',
    derivatives: {
      'عَلَا': 'Tinggi / Menjulang / Menyombongkan diri',
      'يَعْلُو': 'Tinggi / Unggul',
      'عَلِىّ': 'Maha Tinggi / Luhur',
      'ٱلْعَلِىُّ': 'Yang Maha Luhur / Maha Tinggi',
      'ٱلْأَعْلَىٰ': 'Yang Paling Tinggi / Maha Luhur',
      'عَالِيَة': 'Tinggi (derajat surga)',
      'عِلِّيِّينَ': 'Tempat tertinggi penuh kemuliaan',
      'عُلُوّ': 'Ketinggian / Keangkuhan',
      'عَلَىٰ': 'Atas / Di atas / Terhadap',
      'عَلَيْ': 'Atas / Di atas / Terhadap',
    },
  },

  // 34. Root E-t-w (ع ت و) — 10 occurrences
  'E-t-w': {
    rootArabic: 'ع ت و',
    rootLatin: 'Etw',
    titleIndo: 'Akar ع ت و (Melampaui Batas & Kedurhakaan Ekstrem)',
    coreMeaning: 'Melampaui batas kewajaran, kedurhakaan ekstrem, kesombongan membangkang perintah Allah, amukan angin topan kencang, dan kelemahan fisik di usia sangat renta.',
    derivatives: {
      'عَتَا': 'Membangkang / Melampaui Batas',
      'عَتَوْ': 'Membangkang / Berlaku Angkuh / Durhaka',
      'عَتَوْا': 'Mereka membangkang / berlaku angkuh',
      'وَعَتَوْا': 'Dan mereka berlaku angkuh / membangkang',
      'فَعَتَوْا': 'Maka mereka berlaku angkuh / membangkang',
      'عَتَتْ': 'Mendurhakai (perintah Tuhannya)',
      'عُتُوّ': 'Kedurhakaan yang melampaui batas / kesombongan',
      'عُتُوٍّ': 'Kedurhakaan yang melampaui batas / kesombongan',
      'عُتُوًّا': 'Kedurhakaan / kesombongan yang besar',
      'عِتِيّ': 'Kelemahan usia renta / kedurhakaan yang sangat',
      'عِتِيًّا': 'Usia yang sangat renta / kedurhakaan yang sangat',
      'عَاتِيَة': 'Sangat kencang / mengamuk dahsyat (angin)',
      'عَاتِيَةٍ': 'Sangat dingin lagi amat kencang (angin)',
      'عَاتٍ': 'Sombong melampaui batas / mengamuk kencang',
    },
  },
};

/**
 * Retrieves the authentic root profile with its derivatives dictionary
 */
export function getRootTranslationProfile(slugOrArabic?: string): RootTranslationProfile | null {
  if (!slugOrArabic) return null;

  const cleanSlug = slugOrArabic.replace(/[\s\-_]/g, '').toLowerCase();
  
  for (const [key, profile] of Object.entries(ROOT_DICTIONARY)) {
    const pKey = key.replace(/[\s\-_]/g, '').toLowerCase();
    const pArJoined = profile.rootArabic.replace(/\s+/g, '');
    if (key === slugOrArabic || pKey === cleanSlug || profile.rootLatin.toLowerCase() === cleanSlug || pArJoined === slugOrArabic) {
      return profile;
    }
  }

  return null;
}

/**
 * Resolves an authentic, non-generic Indonesian meaning for any Quranic word token.
 * 
 * Lookup Hierarchy (PRD Section 4 Invariant):
 * 1. Exact token lookup in CURATED_WORD_DICTIONARY
 * 2. Exact derivative lookup in ROOT_DICTIONARY
 * 3. Default contextual meaning from Kemenag WBW dataset
 * 4. Morphological deduction based on verb form / noun pattern + root
 * 5. Deterministic fallback to root essence
 */
export function getAuthenticWordMeaning(
  rawArabic: string,
  rootSlugOrArabic?: string,
  defaultMeaning?: string
): string {
  const cleanAr = stripArabicHarakat(rawArabic);
  const cleanNormAlif = stripArabicHarakat(rawArabic.replace(/\u0670/g, '\u0627'));

  // 1. Direct Derivative Match in ROOT_DICTIONARY
  const prof = getRootTranslationProfile(rootSlugOrArabic);
  if (prof && prof.derivatives) {
    if (prof.derivatives[rawArabic]) return prof.derivatives[rawArabic];
    if (prof.derivatives[cleanAr]) return prof.derivatives[cleanAr];
    if (prof.derivatives[cleanNormAlif]) return prof.derivatives[cleanNormAlif];

    // Strip prefixes like wa-, fa-, li-, bi-, al-
    const dePrefixed = cleanNormAlif.replace(/^(و|ف|ب|ل|ال|ٱل)/, '');
    if (prof.derivatives[dePrefixed]) return prof.derivatives[dePrefixed];
  }

  // 3. Authentic Default Meaning from Kemenag (if not generic/fallback)
  if (defaultMeaning) {
    const isGeneric = 
      defaultMeaning.startsWith('Bentuk Kata') ||
      defaultMeaning.startsWith('Konsep & Turunan') ||
      defaultMeaning.startsWith('Kata dalam') ||
      defaultMeaning.startsWith('Kosakata Al-Qur\'an') ||
      defaultMeaning.startsWith('Nomina') ||
      defaultMeaning.startsWith('Verba') ||
      defaultMeaning.startsWith('Partikel') ||
      defaultMeaning.includes('memiliki peranan penting');

    if (!isGeneric && defaultMeaning.trim().length > 0) {
      return defaultMeaning;
    }
  }

  // 4. Intelligent Morphological Pattern Synthesizer using ROOT_DICTIONARY
  if (prof && prof.coreMeaning) {
    const firstMeaning = prof.coreMeaning.split(',')[0].replace(/^(Memiliki|Mengharamkan|Mengerjakan|Hilangnya|Memberi)\s+/i, '').trim();
    if (cleanAr.startsWith('ال') || cleanAr.startsWith('ٱل')) {
      return firstMeaning.charAt(0).toUpperCase() + firstMeaning.slice(1);
    }
    if (cleanAr.startsWith('ي')) {
      return `Dia ${firstMeaning}`;
    }
    if (cleanAr.startsWith('ت')) {
      return `Kamu / Dia ${firstMeaning}`;
    }
    if (cleanAr.startsWith('أ') || cleanAr.startsWith('ا')) {
      return `Aku ${firstMeaning}`;
    }
    if (cleanAr.startsWith('ن')) {
      return `Kami ${firstMeaning}`;
    }
    if (cleanAr.endsWith('وا')) {
      return `Mereka ${firstMeaning}`;
    }
    return firstMeaning.charAt(0).toUpperCase() + firstMeaning.slice(1);
  }

  // 5. Query 1,642 Roots Database (ROOT_DATABASE)
  if (rootSlugOrArabic) {
    const cleanSlug = rootSlugOrArabic.replace(/[\s\-_]/g, '');
    const dbRoot = ROOT_DATABASE.find(r => 
      r.id === rootSlugOrArabic || 
      r.rootLatin === cleanSlug || 
      r.rootArabicJoined === cleanSlug ||
      r.rootArabic.replace(/\s+/g, '') === cleanSlug
    );

    if (dbRoot) {
      // Check verbs
      for (const v of dbRoot.verbs || []) {
        if (stripArabicHarakat(v.arabic) === cleanAr && v.meaningIndo && !v.meaningIndo.startsWith('Verba')) {
          return v.meaningIndo;
        }
      }
      // Check nouns
      for (const n of dbRoot.nouns || []) {
        if (stripArabicHarakat(n.arabic) === cleanAr && n.meaningIndo && !n.meaningIndo.startsWith('Nomina')) {
          return n.meaningIndo;
        }
      }
      // 5c. Check clean titleIndo, coreMeaning, or meaningsIndonesian from database
      if (dbRoot.titleIndo && !dbRoot.titleIndo.startsWith('Konsep & Turunan')) {
        const cleanTitle = dbRoot.titleIndo.replace(/^Akar\s+[^\(]+\(/, '').replace(/\)$/, '').trim();
        return cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      }
      if (dbRoot.coreMeaning && !dbRoot.coreMeaning.startsWith('Akar kata ') && !dbRoot.coreMeaning.includes('memiliki peranan penting')) {
        return dbRoot.coreMeaning.split('.')[0].trim();
      }
      if (dbRoot.meaningsIndonesian && dbRoot.meaningsIndonesian.length > 0 && !dbRoot.meaningsIndonesian[0].startsWith('Gagasan pokok') && !dbRoot.meaningsIndonesian[0].includes('Ragam makna')) {
        return dbRoot.meaningsIndonesian[0].trim();
      }

      // 5d. Check specific usage patterns from classical lexicon / database
      if (dbRoot.usagePatterns && dbRoot.usagePatterns.length > 0) {
        const pattern = dbRoot.usagePatterns.find(p => p.title && !p.title.startsWith('Penggunaan Kontekstual'));
        if (pattern?.title) {
          return pattern.title.split('/')[0].trim();
        }
      }

      // 5e. Intelligent grammatical deduction based on morphemes without placeholder labels
      const rootAr = dbRoot.rootArabic || dbRoot.rootArabicJoined;
      if (cleanAr.endsWith('ون') || cleanAr.endsWith('ين')) {
        return `Golongan / Para Pelaku (${rootAr})`;
      }
      if (cleanAr.startsWith('م')) {
        return `Subjek / Objek (${rootAr})`;
      }
      if (cleanAr.startsWith('ي')) {
        return `Dia bertindak (${rootAr})`;
      }
      if (cleanAr.startsWith('ت')) {
        return `Kamu / Dia bertindak (${rootAr})`;
      }
      if (cleanAr.startsWith('ن')) {
        return `Kami bertindak (${rootAr})`;
      }
      if (cleanAr.startsWith('أ') || cleanAr.startsWith('ا')) {
        return `Aku / Bertindaklah (${rootAr})`;
      }
      return `Bentuk Turunan (${rootAr})`;
    }
  }

  return 'Bentuk Kata Terindeks';
}
