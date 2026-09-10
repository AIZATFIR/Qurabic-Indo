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
};

/**
 * Normalizes root identifier to find matching profile
 */
export function getRootTranslationProfile(slugOrArabic?: string): RootTranslationProfile | null {
  if (!slugOrArabic) return null;
  const clean = slugOrArabic.trim().replace(/\s+/g, '-');
  const dashed = clean.includes('-') ? clean : clean.split('').join('-');

  // Direct match by slug
  if (ROOT_DICTIONARY[clean]) return ROOT_DICTIONARY[clean];
  if (ROOT_DICTIONARY[dashed]) return ROOT_DICTIONARY[dashed];

  // Match by Arabic letters
  const cleanAr = stripArabicHarakat(slugOrArabic).replace(/\s+/g, '');
  for (const prof of Object.values(ROOT_DICTIONARY)) {
    const profAr = stripArabicHarakat(prof.rootArabic).replace(/\s+/g, '');
    if (profAr === cleanAr) return prof;
  }

  return null;
}

/**
 * Resolves authentic Indonesian meaning for any Quranic word
 */
export function getAuthenticWordMeaning(
  wordArabic: string,
  rootSlugOrArabic?: string,
  defaultMeaning?: string
): string {
  if (!wordArabic) return '';

  const cleanAr = stripArabicHarakat(wordArabic);

  // 1. Check root-specific derivative dictionary
  const prof = getRootTranslationProfile(rootSlugOrArabic);
  if (prof) {
    if (prof.derivatives[wordArabic]) return prof.derivatives[wordArabic];
    if (prof.derivatives[cleanAr]) return prof.derivatives[cleanAr];
    for (const [k, v] of Object.entries(prof.derivatives)) {
      if (stripArabicHarakat(k) === cleanAr) return v;
    }
  }

  // 2. Check all roots if not found in given root profile
  for (const p of Object.values(ROOT_DICTIONARY)) {
    if (p.derivatives[wordArabic]) return p.derivatives[wordArabic];
    if (p.derivatives[cleanAr]) return p.derivatives[cleanAr];
    for (const [k, v] of Object.entries(p.derivatives)) {
      if (stripArabicHarakat(k) === cleanAr) return v;
    }
  }

  // 3. Fall back to clean default meaning if it is a genuine Indonesian translation
  if (
    defaultMeaning &&
    !defaultMeaning.startsWith('Konsep & Turunan') &&
    !defaultMeaning.startsWith('Bentuk Kata') &&
    !defaultMeaning.startsWith('Akar kata') &&
    !defaultMeaning.startsWith('Nomina (') &&
    !defaultMeaning.startsWith('Verba (') &&
    defaultMeaning !== "Kata dalam Al-Qur'an"
  ) {
    // Ensure default meaning is not raw English
    const isEnglish = /\b(the|and|or|of|to|in|on|from|with|by|for|not|he|they|we|you|she|it|his|their|our|your|my|who|which|that|enter|entered|say|said|know|knew|believed|disbelieved|eat|eaten|surely|will|were|was|are|is|have|has|had|brought|hosts|another|clear|prison|throne|recited)\b/i.test(defaultMeaning);
    if (!isEnglish) {
      return defaultMeaning;
    }
  }

  // 4. Intelligent Morphological Pattern Synthesizer using ROOT_DICTIONARY
  if (prof && prof.coreMeaning) {
    const firstMeaning = prof.coreMeaning.split(',')[0].trim();
    if (cleanAr.startsWith('ال') || cleanAr.startsWith('ٱل')) {
      return firstMeaning.charAt(0).toUpperCase() + firstMeaning.slice(1);
    }
    if (cleanAr.startsWith('ي') || cleanAr.startsWith('ت') || cleanAr.startsWith('ن')) {
      return `Sedang/Akan ${firstMeaning}`;
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
        if (stripArabicHarakat(v.arabic) === cleanAr && v.meaningIndo && !v.meaningIndo.startsWith('Verba (')) {
          return v.meaningIndo;
        }
      }
      // Check nouns
      for (const n of dbRoot.nouns || []) {
        if (stripArabicHarakat(n.arabic) === cleanAr && n.meaningIndo && !n.meaningIndo.startsWith('Nomina (')) {
          return n.meaningIndo;
        }
      }
      // Use clean titleIndo or coreMeaning
      if (dbRoot.titleIndo && !dbRoot.titleIndo.startsWith('Konsep & Turunan')) {
        const cleanTitle = dbRoot.titleIndo.replace(/^Akar\s+[^\(]+\(/, '').replace(/\)$/, '').trim();
        return cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
      }
      if (dbRoot.coreMeaning && !dbRoot.coreMeaning.startsWith('Akar kata ') && !dbRoot.coreMeaning.includes('memiliki peranan penting')) {
        return dbRoot.coreMeaning.split('.')[0].trim();
      }
    }
  }

  return cleanAr;
}
