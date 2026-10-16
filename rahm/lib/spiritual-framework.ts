/**
 * Rahm Spiritual Framework (رَحْم)
 * Synthesizing Ibn 'Arabi's Journey to the Lord of Power (Mawatin & Khalwa),
 * Islamic Tazkiyatun Nafs (7 Stages of the Soul), and the Spectrum of Consciousness.
 */

export interface NafsStage {
  level: number;
  arabicName: string;
  transliteration: string;
  translation: string;
  alchemicalStage: string;
  latinKeynote: string;
  coreProcess: string;
  description: string;
  quranicReference: {
    surah: number;
    ayah: number;
    textArabic: string;
    textIndo: string;
  };
}

export const NAFS_STAGES: NafsStage[] = [
  {
    level: 1,
    arabicName: 'النَّفْسُ الْأَمَّارَةُ بِالسُّوءِ',
    transliteration: 'Nafs al-Ammarah',
    translation: 'Jiwa yang Terjebak Dorongan Hawa Nafsu',
    alchemicalStage: 'Disintegration (Penghancuran Pola Not-Self)',
    latinKeynote: 'Nigredo - Menghadapi Bayangan Batin',
    coreProcess: 'Tazkiyah Awwaliyah: Memecah ilusi keakuan, menyadari penderitaan hawa nafsu.',
    description: 'Taraf kesadaran di mana manusia masih didikte oleh kebiasaan otomatis tubuh fisik dan dorongan ego (Not-Self). Tahap awal transformasi seluler melalui pengakuan ketidakberdayaan diri.',
    quranicReference: {
      surah: 12,
      ayah: 53,
      textArabic: 'وَمَآ أُبَرِّئُ نَفْسِىٓ ۚ إِنَّ ٱلنَّفْسَ لَأَمَّارَةٌۢ بِٱلسُّوٓءِ إِلَّا مَا رَحِمَ رَبِّىٓ',
      textIndo: 'Dan aku tidak membebaskan diriku (dari kesalahan), karena sesungguhnya nafsu itu selalu menyuruh kepada kejahatan, kecuali nafsu yang diberi rahmat oleh Tuhanku.',
    },
  },
  {
    level: 2,
    arabicName: 'النَّفْسُ اللَّوَّامَةُ',
    transliteration: 'Nafs al-Lawwamah',
    translation: 'Jiwa yang Menyesali Diri & Mencela Kesalahan',
    alchemicalStage: 'Education (Pembersihan Emosi & Hubungan)',
    latinKeynote: 'Solutio / Albedo - Pemutihan Bejana Jiwa',
    coreProcess: 'Muhasabah: Munculnya suara nurani, penyesalan tulus, dan penyucian hati dari racun emosi.',
    description: 'Kesadaran yang mulai peka terhadap cela dan kelemahan dirinya. Manusia belajar membersihkan pergaulan, menahan lisan, dan melepaskan dendam serta rasa bersalah semu.',
    quranicReference: {
      surah: 75,
      ayah: 2,
      textArabic: 'وَلَآ أُقْسِمُ بِٱلنَّفْسِ ٱللَّوَّامَةِ',
      textIndo: 'Dan aku bersumpah demi jiwa yang amat menyesali (dirinya sendiri).',
    },
  },
  {
    level: 3,
    arabicName: 'النَّفْسُ الْمُلْهَمَةُ',
    transliteration: 'Nafs al-Mulhamah',
    translation: 'Jiwa yang Menerima Ilham Petunjuk & Ketakwaan',
    alchemicalStage: 'Alignment (Penyelarasan Energi Batin & Takdir)',
    latinKeynote: 'Coagulatio - Pemadatan Kekuatan Hakiki',
    coreProcess: 'Muraqabah: Penyerahan kehendak diri kepada Kehendak Ilahi, penataan energi fisik & qalb.',
    description: 'Membukanya gerbang ilham kebaikan. Manusia mengalami pemadatan energi spiritual, mengenali komitmen hidup sejati, dan belajar bernafas dari pusat keheningan batin.',
    quranicReference: {
      surah: 91,
      ayah: 7,
      textArabic: 'وَنَفْسٍۢ وَمَا سَوَّىٰهَا ۝ فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَىٰهَا',
      textIndo: 'Demi jiwa serta penyempurnaan (ciptaan)nya, maka Dia mengilhamkan kepadanya (jalan) kejahatan dan ketakwaannya.',
    },
  },
  {
    level: 4,
    arabicName: 'النَّفْسُ الْمُطْمَئِنَّةُ',
    transliteration: 'Nafs al-Mutma’innah',
    translation: 'Jiwa yang Tenang, Damai, dan Berakar pada Nur',
    alchemicalStage: 'Initiation (Kelahiran Kembali ke Ranah Qalb)',
    latinKeynote: 'Illuminatio - Transmutasi Seluler ke Ranah Kasih',
    coreProcess: 'Sakīnah: Melepaskan ekspektasi ego, melompati ketakutan masa lalu, berlabuh dalam kepastian iman.',
    description: 'Titik ekuilibrium agung di mana sel-sel kesadaran lebih dominan bergetar pada kebenaran Ilahi daripada ilusi duniawi. Hati berada dalam naungan ketenteraman abadi.',
    quranicReference: {
      surah: 89,
      ayah: 27,
      textArabic: 'يَـٰٓأَيَّتُهَا ٱلنَّفْسُ ٱلْمُطْمَئِنَّةُ',
      textIndo: 'Wahai jiwa yang tenang!',
    },
  },
  {
    level: 5,
    arabicName: 'النَّفْسُ الرَّاضِيَةُ',
    transliteration: 'Nafs ar-Radhiyah',
    translation: 'Jiwa yang Ridha atas Segala Ketetapan Ilahi',
    alchemicalStage: 'Quickening (Akselerasi Rezeki Batin & Kelimpahan)',
    latinKeynote: 'Multiplicato - Kelimpahan Menghasilkan Kelimpahan',
    coreProcess: 'Tawakkul Mutlak: Memandang segala ujian sebagai tajalli rahmat, hilangnya perlawanan mental.',
    description: 'Fase percepatan spiritual di mana kekayaan batin terpancar ke alam nyata. Jiwa tidak lagi menuntut atau mengeluh, melainkan menikmati setiap ketukan takdir.',
    quranicReference: {
      surah: 89,
      ayah: 28,
      textArabic: 'ٱرْجِعِىٓ إِلَىٰ رَبِّكِ رَاضِيَةًۭ مَّرْضِيَّةًۭ',
      textIndo: 'Kembalilah kepada Tuhanmu dengan hati yang ridha dan diridhai-Nya.',
    },
  },
  {
    level: 6,
    arabicName: 'النَّفْسُ الْمَرْضِيَّةُ',
    transliteration: 'Nafs al-Mardhiyah',
    translation: 'Jiwa yang Diridhai, Memancarkan Cahaya Ihsan',
    alchemicalStage: 'Awakening (Fajar Kesadaran Hakiki)',
    latinKeynote: 'Rubedo - Luminositas & Kemilau Fajar Keemasan',
    coreProcess: 'Fana’ fil-Haqq: Berbuat ihsan seolah-olah melihat Allah, memandang makhluk dengan pandangan kasih.',
    description: 'Taraf di mana Allah meridhai seluruh gerak-gerik sang hamba. Hati menjadi cermin jernih yang memantulkan keagungan Asmaul Husna ke sekelilingnya tanpa hijab keakuan.',
    quranicReference: {
      surah: 98,
      ayah: 8,
      textArabic: 'رَّضِىَ ٱللَّهُ عَنْهُمْ وَرَضُوا۟ عَنْهُ ۚ ذَٰلِكَ لِمَنْ خَشِىَ رَبَّهُۥ',
      textIndo: 'Allah ridha terhadap mereka dan mereka pun ridha kepada-Nya. Yang demikian itu adalah (balasan) bagi orang yang takut kepada Tuhannya.',
    },
  },
  {
    level: 7,
    arabicName: 'النَّفْسُ الْكَامِلَةُ',
    transliteration: 'Nafs al-Kamilah (az-Zakiyyah)',
    translation: 'Jiwa yang Sempurna, Insan Kamil Penabur Rahmat',
    alchemicalStage: 'Integration (Penyatuan Manunggal & Khidmat Semesta)',
    latinKeynote: 'Coniuncto - Kesatuan Suci Rohani & Jasmani',
    coreProcess: 'Baqa’ bil-Haqq: Kembali turun ke pasar kehidupan untuk menuntun dan melayani umat (Mardudun).',
    description: 'Puncak transformasi spiritual menurut Ibn Arabi: setelah fana dalam Kehadiran Ilahi, sang hamba diutus kembali ke tengah ciptaan dengan akhlak Rasulullah SAW.',
    quranicReference: {
      surah: 21,
      ayah: 107,
      textArabic: 'وَمَآ أَرْسَلْنَـٰكَ إِلَّا رَحْمَةًۭ لِّلْعَـٰلَمِينَ',
      textIndo: 'Dan Kami tidak mengutus engkau (Muhammad) melainkan untuk (menjadi) rahmat bagi seluruh alam.',
    },
  },
];

export interface Mawtin {
  realmId: number;
  arabicName: string;
  nameIndo: string;
  significance: string;
  obligation: string;
}

export const MAWATIN: Mawtin[] = [
  {
    realmId: 1,
    arabicName: 'عَالَمُ الْمِيثَاقِ (أَلَسْتُ بِرَبِّكُمْ)',
    nameIndo: 'Alam Al-Mithaq (Perjanjian Azali)',
    significance: 'Tempat ruh berhimpun dan menyaksikan langsung Ketuhanan Allah sebelum ditiupkan ke dalam jasad.',
    obligation: 'Mengingat fitrah tauhid murni yang terukir dalam DNA rohani.',
  },
  {
    realmId: 2,
    arabicName: 'عَالَمُ الدُّنْيَا وَالتَّكْلِيفِ',
    nameIndo: 'Alam Ad-Dunya (Alam Tugas, Amal & Taklif)',
    significance: 'Tempat ujian, pembuktian iman, perbuatan baik, dan ladang menanam ma’rifatullah.',
    obligation: 'Menjalankan syariat, membersihkan nafs, dan berkhidmah bagi sesama.',
  },
  {
    realmId: 3,
    arabicName: 'عَالَمُ الْبَرْزَخِ وَالْمِثَالِ',
    nameIndo: 'Alam Al-Barzakh (Jembatan Makna & Khayal Suci)',
    significance: 'Dimensi pembatas antara fisik dan gaib, tempat bentuk batin amal termanifestasi.',
    obligation: 'Menjaga imajinasi dan niat agar selaras dengan kesucian wahyu.',
  },
  {
    realmId: 4,
    arabicName: 'عَالَمُ الْبَعْثِ وَالْقِيَامَةِ',
    nameIndo: 'Alam Al-Qiyamah (Bumi Kebangkitan & Penyingkapan)',
    significance: 'Pembalikan hakikat: apa yang tersembunyi dalam dada tersingkap nyata tanpa tabir.',
    obligation: 'Memupuk amal saleh yang kelak memancarkan cahaya di padang mahsyar.',
  },
  {
    realmId: 5,
    arabicName: 'عَالَمُ الْجَنَّةِ وَالنَّارِ',
    nameIndo: 'Alam Surga & Neraka (Dar As-Salam & Dar Al-Bawar)',
    significance: 'Tempat pembalasan adil dan karunia kenikmatan abadi bagi hamba yang taat.',
    obligation: 'Mengharap ridha dan rahmat Allah serta berlindung dari azab nafsu.',
  },
  {
    realmId: 6,
    arabicName: 'الْكَثِيبُ (مَقَامُ الرُّؤْيَةِ)',
    nameIndo: 'Al-Kathib (Bukit Kesturi Putih & Ru’yatullah)',
    significance: 'Puncak segala anugerah: tempat para wali dan kekasih Allah memandang Wajah-Nya Yang Maha Indah.',
    obligation: 'Menyucikan hati hingga tiada yang dicari selain Wajah Allah.',
  },
];

export interface TransmutationMap {
  id: string;
  category: 'emosi' | 'mental' | 'spiritual' | 'sosial';
  shadow: string;       // Nafs Ammarah state
  shadowDesc: string;
  gift: string;         // Hikmah / Taraf Mutma'innah
  giftDesc: string;
  siddhi: string;       // Nur / Kamilah
  siddhiDesc: string;
  asmaulHusna: {
    arabic: string;
    transliteration: string;
    meaning: string;
    dhikrPrompt: string;
  };
  quranicAyah: {
    surah: number;
    ayah: number;
    arabic: string;
    indo: string;
  };
  hadithGuide: string;
}

export const TRANSMUTATION_SPECTRUM: TransmutationMap[] = [
  {
    id: 'cemas',
    category: 'emosi',
    shadow: 'Gundah & Was-was (Qalaq)',
    shadowDesc: 'Pikiran terombang-ambing oleh ketakutan akan masa depan dan kehilangan kendali.',
    gift: 'Kewaspadaan Sadar (Yaqzhah)',
    giftDesc: 'Menjadikan rasa takut sebagai pendorong untuk kembali bersandar kepada Penjaga Alam.',
    siddhi: 'Kedamaian Hakiki (As-Sakīnah)',
    siddhiDesc: 'Ketenteraman mutlak yang melampaui kondisi fisik apa pun, berlabuh dalam pelukan Ilahi.',
    asmaulHusna: {
      arabic: 'يَا سَلَامُ يَا مُؤْمِنُ',
      transliteration: 'Ya Salam, Ya Mu’min',
      meaning: 'Wahai Yang Memberi Keselamatan dan Menenangkan Rasa Takut',
      dhikrPrompt: 'Heningkan nafas, ulangi 33x dengan melepaskan kekhawatiran masa depan ke tangan-Nya.',
    },
    quranicAyah: {
      surah: 48,
      ayah: 4,
      arabic: 'هُوَ ٱلَّذِىٓ أَنزَلَ ٱلسَّكِينَةَ فِى قُلُوبِ ٱلْمُؤْمِنِينَ لِيَزْدَادُوٓا۟ إِيمَـٰنًۭا مَّعَ إِيمَـٰنِهِمْ',
      indo: 'Dialah yang telah menurunkan ketenangan ke dalam hati orang-orang mukmin untuk menambah keimanan di atas keimanan mereka.',
    },
    hadithGuide: 'Rasulullah SAW bersabda: "Ketahuilah, jika seluruh umat berkumpul untuk mencelakakanmu, mereka tidak akan mampu kecuali dengan apa yang telah Allah tetapkan bagimu." (HR. Tirmidzi)',
  },
  {
    id: 'arah',
    category: 'spiritual',
    shadow: 'Kehilangan Arah & Kebingungan (Dhalal)',
    shadowDesc: 'Merasa hampa, tidak tahu tujuan hidup, terjebak dalam pusaran rutinitas tanpa makna.',
    gift: 'Kejernihan Menyimak (Tafakkur & Istishlah)',
    giftDesc: 'Kemampuan berhenti sejenak untuk mendengar bisikan petunjuk kalbu yang hakiki.',
    siddhi: 'Cahaya Petunjuk (Al-Huda wal-Basīrah)',
    siddhiDesc: 'Melihat jalur takdir dengan mata batin yang terang benderang bersama Al-Hadi.',
    asmaulHusna: {
      arabic: 'يَا هَادِي يَا رَشِيدُ',
      transliteration: 'Ya Hadi, Ya Rashid',
      meaning: 'Wahai Yang Maha Menunjuki dan Maha Membimbing ke Arah yang Lurus',
      dhikrPrompt: 'Pejamkan mata, serahkan kebingungan pikiran, mohonkan panduan jalan lurus.',
    },
    quranicAyah: {
      surah: 93,
      ayah: 7,
      arabic: 'وَوَجَدَكَ ضَآلًّۭا فَهَدَىٰ',
      indo: 'Dan Dia mendapatimu sebagai seorang yang bingung, lalu Dia memberikan petunjuk.',
    },
    hadithGuide: 'Rasulullah SAW bersabda: "Mintalah fatwa kepada hatimu. Kebaikan adalah apa yang membuat jiwa tenang dan hati tenteram." (HR. Ahmad)',
  },
  {
    id: 'marah',
    category: 'emosi',
    shadow: 'Amarah Membakar & Dendam (Ghadhab)',
    shadowDesc: 'Ego merasa terluka atau dilangkahi, memicu impuls ledakan yang merusak diri dan sesama.',
    gift: 'Kekuatan Menahan Diri (Kazhmul Ghaizh)',
    giftDesc: 'Mengubah api amarah menjadi energi ketabahan dan wibawa spiritual yang teduh.',
    siddhi: 'Kelapangan Memaafkan (Al-Hilm wal-’Afw)',
    siddhiDesc: 'Pemaafan tanpa syarat yang membebaskan jiwa dari belenggu masa lalu.',
    asmaulHusna: {
      arabic: 'يَا حَلِيمُ يَا عَفُوُّ',
      transliteration: 'Ya Halim, Ya ‘Afuww',
      meaning: 'Wahai Yang Maha Santun Menahan Murka dan Maha Menghapus Kesalahan',
      dhikrPrompt: 'Tarik nafas panjang, hembuskan bersama pelepasan rasa sakit dan amarah.',
    },
    quranicAyah: {
      surah: 3,
      ayah: 134,
      arabic: 'وَٱلْكَـٰظِمِينَ ٱلْغَيْظَ وَٱلْعَافِينَ عَنِ ٱلنَّاسِ ۗ وَٱللَّهُ يُحِبُّ ٱلْمُحْسِنِينَ',
      indo: 'Dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang lain. Dan Allah mencintai orang-orang yang berbuat kebaikan.',
    },
    hadithGuide: 'Rasulullah SAW bersabda: "Bukanlah orang kuat itu yang menang bergulat, melainkan orang yang mampu menguasai dirinya saat marah." (HR. Bukhari & Muslim)',
  },
  {
    id: 'sombong',
    category: 'mental',
    shadow: 'Kesombongan & Keakuan (Kibr wal-Ujb)',
    shadowDesc: 'Merasa lebih unggul, meremehkan orang lain, dan takut jatuh pamor di mata manusia.',
    gift: 'Kejujuran Rendah Hati (Tawadhu’)',
    giftDesc: 'Menyadari bahwa segala kelebihan, ilmu, dan harta hanyalah titipan amanah.',
    siddhi: 'Kemuliaan Sejati (Al-Izzah billah)',
    siddhiDesc: 'Merasa mulia hanya karena menjadi hamba Allah, bebas dari butuh sanjungan makhluk.',
    asmaulHusna: {
      arabic: 'يَا كَبِيرُ يَا مُتَعَالُ',
      transliteration: 'Ya Kabir, Ya Muta’al',
      meaning: 'Wahai Yang Maha Agung dan Maha Tinggi Melampaui Segala Prasangka',
      dhikrPrompt: 'Sujud dalam batin, sadari kehampaan diri di hadapan Keagungan-Nya.',
    },
    quranicAyah: {
      surah: 35,
      ayah: 10,
      arabic: 'مَن كَانَ يُرِيدُ ٱلْعِزَّةَ فَلِلَّهِ ٱلْعِزَّةُ جَمِيعًا',
      indo: 'Barangsiapa menghendaki kemuliaan, maka bagi Allah-lah kemuliaan itu semuanya.',
    },
    hadithGuide: 'Rasulullah SAW bersabda: "Tidak akan berkurang harta karena sedekah, dan Allah tidak menambah bagi hamba yang pemaaf melainkan kemuliaan, serta tidaklah seseorang merendahkan hati karena Allah melainkan Allah akan mengangkat derajatnya." (HR. Muslim)',
  },
  {
    id: 'putusasa',
    category: 'spiritual',
    shadow: 'Putus Asa & Terpuruk (Ya’s wal-Qunuth)',
    shadowDesc: 'Merasa doa tak dikabulkan, merasa dosa terlalu besar, atau pintu kebaikan telah tertutup.',
    gift: 'Harapan Teguh (Ar-Raja’)',
    giftDesc: 'Meyakini keluasan rahmat Allah yang mendahului murka-Nya di setiap episode hidup.',
    siddhi: 'Cinta Rahmatan lil ‘Alamin (Al-Wuddu wal-Maghfirah)',
    siddhiDesc: 'Menjadi penyalur rahmat dan harapan bagi orang-orang yang sedang patah jiwa.',
    asmaulHusna: {
      arabic: 'يَا رَحْمَـٰنُ يَا وَدُودُ',
      transliteration: 'Ya Rahman, Ya Wadud',
      meaning: 'Wahai Yang Maha Pengasih Merata dan Maha Mencintai Hamba-Nya',
      dhikrPrompt: 'Rasakan hembusan kasih sayang Allah yang menghidupkan kembali sel-sel hatimu.',
    },
    quranicAyah: {
      surah: 39,
      ayah: 53,
      arabic: 'قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا',
      indo: 'Katakanlah: "Wahai hamba-hamba-Ku yang melampaui batas terhadap diri mereka sendiri! Janganlah kamu berputus asa dari rahmat Allah. Sesungguhnya Allah mengampuni dosa-dosa semuanya."',
    },
    hadithGuide: 'Hadits Qudsi: "Rahmat-Ku mendahului kemurkaan-Ku." (HR. Bukhari)',
  },
  {
    id: 'duniawi',
    category: 'mental',
    shadow: 'Keserakahan & FOMO (Hubbud Dunya)',
    shadowDesc: 'Khawatir kekurangan harta, selalu membandingkan diri dengan capaian orang lain di media sosial.',
    gift: 'Kecukupan Jiwa (Qana’ah)',
    giftDesc: 'Menikmati apa yang ada dengan rasa syukur mendalam dan membagikan kelebihannya.',
    siddhi: 'Kekayaan Sejati (Al-Ghinā bil-Wahhab)',
    siddhiDesc: 'Hati yang kaya raya, merasa cukup dengan Allah sebagai Pencukupi segala kebutuhan.',
    asmaulHusna: {
      arabic: 'يَا غَنِيُّ يَا وَهَّابُ',
      transliteration: 'Ya Ghaniyy, Ya Wahhab',
      meaning: 'Wahai Yang Maha Kaya Tanpa Butuh Apapun dan Maha Menganugerahkan Karunia',
      dhikrPrompt: 'Akui bahwa segala rezeki telah ditakar dengan bijak, syukuri nikmat nafas saat ini.',
    },
    quranicAyah: {
      surah: 57,
      ayah: 20,
      arabic: 'ٱعْلَمُوٓا۟ أَنَّمَا ٱلْحَيَوٰةُ ٱلدُّنْيَا لَعِبٌۭ وَلَهْوٌۭ وَزِينَةٌۭ وَتَفَاخُرٌۢ بَيْنَكُمْ وَتَكَاثُرٌۭ فِى ٱلْأَمْوَٰلِ وَٱلْأَوْلَـٰدِ',
      indo: 'Ketahuilah, bahwa sesungguhnya kehidupan dunia ini hanyalah permainan dan sesuatu yang melalaikan, perhiasan dan bermegah-megahan antara kamu serta berbangga-bangga tentang banyaknya harta dan anak.',
    },
    hadithGuide: 'Rasulullah SAW bersabda: "Bukanlah kekayaan itu dengan banyaknya harta benda, melainkan kekayaan sejati adalah kekayaan jiwa." (HR. Bukhari & Muslim)',
  },
];

export const MAWATIN_STAGES = MAWATIN.map((m) => ({
  number: m.realmId,
  titleIndo: m.nameIndo,
  innerState: m.significance,
  obligation: m.obligation,
}));

export interface IbnArabiKhalwaRule {
  principle: string;
  source: string;
  ruleArabic: string;
  ruleIndo: string;
  practicalAction: string;
}

export const IBN_ARABI_KHALWA_RULES: IbnArabiKhalwaRule[] = [
  {
    principle: "Ri'ayat al-Anfas (Menjaga Desah Nafas)",
    source: "Risalat al-Anwar fi Ma Yumnah Sahib al-Khalwa",
    ruleArabic: 'صَاحِبُ الْأَنْفَاسِ يَمْلِكُ السَّاعَاتِ',
    ruleIndo: 'Orang yang sadar dan menjaga desah nafasnya memiliki kendali atas jam-jamnya; dan orang yang sadar atas jamnya kehilangan nafasnya.',
    practicalAction: 'Lakukan dzikir hening pada setiap tarikan nafas (nafas masuk: Huwa / Ilahi; nafas keluar: Allah). Jangan biarkan satu desah nafas berlalu tanpa kesadaran akan Dzat.',
  },
  {
    principle: 'Mithaq Awwal: Mensucikan Diri dari Bentuk Semu',
    source: 'Risalat al-Anwar',
    ruleArabic: 'تَعَالَى اللّٰهُ عَنْ ذٰلِكَ! أَنْتَ بِاللّٰهِ',
    ruleIndo: 'Katakan kepada setiap bentuk atau bisikan gaib yang mengaku tuhan dalam keheningan: "Maha Suci Allah dari wujud itu! Engkau ada hanya karena Allah."',
    practicalAction: 'Jangan terpikat oleh bisikan ilusi atau visual batin. Kembalikan semua rasa kagum semata-mata kepada Dzat Yang Maha Suci.',
  },
  {
    principle: 'Mithaq Tsani: Pemurnian Himmah (Niat Tunggal)',
    source: 'Risalat al-Anwar',
    ruleArabic: 'لَا تَطْلُبْ مِنْهُ إِلَّا إِيَّاهُ',
    ruleIndo: 'Jangan meminta dari-Nya di dalam khalwa selain Dzat-Nya sendiri. Jika seluruh semesta dibentangkan di hadapanmu, terimalah dengan santun, namun jangan berhenti di situ!',
    practicalAction: 'Jika Dia mengujimu dengan karamah atau kekayaan duniawi, jangan terikat. Teruslah melangkah menuju Kehadiran-Nya.',
  },
  {
    principle: 'Pembeda Ilham Malaikat vs Bisikan Setan',
    source: 'Sharh Risalat al-Anwar (Abdul Karim Jili)',
    ruleArabic: 'الْبَرْدُ وَالنَّعِيمُ فِي مُقَابَلَةِ الِاضْطِرَابِ',
    ruleIndo: 'Pengaruh malaikat meninggalkan rasa sejuk, damai, dan hikmah ilmu tanpa rasa sakit. Pengaruh setan meninggalkan kegelisahan, disorientasi fisik, keraguan, dan kekacauan batin.',
    practicalAction: 'Jika batin terasa panas, cemas, atau kacau setelah suatu pemikiran, segera basuh wudhu dan ucapkan Istighfar serta Ta&apos;awwudh.',
  },
  {
    principle: 'Al-Awadah wal-Baqa (Kembali ke Tengah Manusia sebagai Mardudun)',
    source: 'Risalat al-Anwar',
    ruleArabic: 'الْمَرْدُودُونَ إِلَى الْخَلْقِ بِاللّٰهِ',
    ruleIndo: 'Puncak hakiki bukanlah berdiam di menara spiritual, melainkan kembali (Mardudun) ke pasar kehidupan berbaur dengan masyarakat dalam pakaian biasa namun dengan batin yang bersatu dengan Allah.',
    practicalAction: 'Jalani profesi, pekerjaan, dan keluarga dengan penuh integritas, kasih sayang, dan pelayanan tanpa menonjolkan keakuan spiritual.',
  },
];

export interface DosPrinciple {
  step: 'D' | 'O' | 'S';
  code: string;
  name: string;
  alchemyMapping: string;
  instruction: string;
  dailyApplication: string;
}

export const DOS_PROGRAM_PRINCIPLES: DosPrinciple[] = [
  {
    step: 'D',
    code: 'DECONSTRUCT',
    name: 'Membongkar Ego-Self (Not-Self)',
    alchemyMapping: 'Nigredo / Disintegration (Tahap 1 Nafs Ammarah)',
    instruction: 'Sadari bahwa identitas palsu (ketakutan, kesombongan, reaktifitas emosional) adalah program simulasi pikiran, bukan hakikat dirimu.',
    dailyApplication: 'Ketika emosi terpicu, jangan langsung bereaksi. Berhenti 3 detik, ucapkan "Inna lillahi wa inna ilayhi raji&apos;un".',
  },
  {
    step: 'O',
    code: 'OBSERVE',
    name: 'Mengamati dalam Keheningan (The Infinite Observer / Muraqib)',
    alchemyMapping: 'Albedo / Stillness (Tahap 2-3 Nafs Lawwamah & Mulhamah)',
    instruction: 'Posisikan kesadaran sebagai saksi yang tenang (Syahid) di balik aliran pikiran dan sensasi tubuh fisik.',
    dailyApplication: 'Duduk tegak, tutup mata sejenak, rasakan desah nafas tanpa menghakimi pikiran yang melintas.',
  },
  {
    step: 'S',
    code: 'SHIFT',
    name: 'Beralih ke Frekuensi Tawfiq (Co-Creation / Al-Ittihad bil-Haqq)',
    alchemyMapping: 'Rubedo / Coagulatio (Tahap 4-7 Mutma&apos;innah hingga Kamilah)',
    instruction: 'Pindahkan niat dari ego ketakutan (Co-Destruction) menuju penyerahan pasrah yang berdaya (Co-Creation bersama Takdir Ilahi).',
    dailyApplication: 'Ucapkan Asmaul Husna yang sesuai dengan transmutasi masalahmu dan melangkahlah dengan prasangka baik (Husnudzan).',
  },
];

export interface BreathPacingTechnique {
  id: string;
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  sufiName: string;
  spiritualEffect: string;
}

export const BREATH_PACING_TECHNIQUES: BreathPacingTechnique[] = [
  {
    id: 'muraqabah-4444',
    name: 'Kotak Kesadaran (Box Breathing 4-4-4-4)',
    inhale: 4,
    holdIn: 4,
    exhale: 4,
    holdOut: 4,
    sufiName: 'Nafas Rohani Sakīnah',
    spiritualEffect: 'Menenangkan gelombang otak ke Alpha-Theta, melepaskan hormon stres, memfokuskan himmah batin.',
  },
  {
    id: 'khalwa-478',
    name: 'Pelepasan Beban Jiwa (Deep Surrender 4-7-8)',
    inhale: 4,
    holdIn: 7,
    exhale: 8,
    holdOut: 0,
    sufiName: 'Nafas Istighfar & Inabah',
    spiritualEffect: 'Mengaktivasi saraf parasimpatis, meluruhkan ketegangan ego, persiapan tidur kontemplatif (Niyyah qabl an-nawm).',
  },
  {
    id: 'tazkiyah-3333',
    name: 'Sat-Set Fokus Cepat (Quick Coherence 3-3-3-3)',
    inhale: 3,
    holdIn: 3,
    exhale: 3,
    holdOut: 3,
    sufiName: 'Nafas Tajdidul Himmah',
    spiritualEffect: 'Meningkatkan kesigapan mental dan kehadiran batin seketika di tengah rutinitas kerja.',
  },
];

export function getNafsStage(level: number): NafsStage {
  return NAFS_STAGES.find((s) => s.level === level) || NAFS_STAGES[0];
}

export function getMawtin(id: number): Mawtin {
  return MAWATIN.find((m) => m.realmId === id) || MAWATIN[1]; // default Dunya
}

export function findTransmutation(idOrKeyword: string): TransmutationMap | undefined {
  const q = idOrKeyword.toLowerCase();
  return TRANSMUTATION_SPECTRUM.find(
    (item) =>
      item.id === q ||
      item.shadow.toLowerCase().includes(q) ||
      item.gift.toLowerCase().includes(q) ||
      item.siddhi.toLowerCase().includes(q) ||
      item.shadowDesc.toLowerCase().includes(q)
  );
}

