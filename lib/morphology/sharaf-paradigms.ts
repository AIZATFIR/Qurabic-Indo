export interface SharafForm {
  formId: string;
  formName: string;
  wazanPattern: string;
  faedahSharaf: string;
  explanation: string;
  madhi: { arabic: string; translit: string; meaning: string };
  mudhari: { arabic: string; translit: string; meaning: string };
  amr?: { arabic: string; translit: string; meaning: string };
  masdar?: { arabic: string; translit: string; meaning: string };
  isimFail?: { arabic: string; translit: string; meaning: string };
  isimMaful?: { arabic: string; translit: string; meaning: string };
  quranicExample?: { verseRef: string; arabic: string; indo: string };
}

/**
 * Authentic Classical Sharaf Paradigms for High-Frequency Quranic Roots
 */
export const CLASSICAL_PARADIGMS: Record<string, SharafForm[]> = {
  // 1. Root s-b-r (ص-ب-ر)
  's-b-r': [
    {
      formId: 'Form I',
      formName: 'Tsulatsi Mujarrad (فَعَلَ)',
      wazanPattern: 'فَعَلَ / يَفْعِلُ (صَبَرَ / يَصْبِرُ)',
      faedahSharaf: 'Menahan diri, tabah menghadapi kesulitan (makna dasar).',
      explanation: 'Bentuk paling dasar dari akar ص-ب-ر yang merujuk pada ketahanan jiwa bagaikan batu keras.',
      madhi: { arabic: 'صَبَرَ', translit: 'Ṣabara', meaning: 'Dia telah bersabar' },
      mudhari: { arabic: 'يَصْبِرُ', translit: 'Yaṣbiru', meaning: 'Dia sedang/akan bersabar' },
      amr: { arabic: 'اصْبِرْ', translit: 'Iṣbir', meaning: 'Bersabarlah!' },
      masdar: { arabic: 'صَبْرًا', translit: 'Ṣabran', meaning: 'Kesabaran' },
      isimFail: { arabic: 'صَابِرٌ', translit: 'Ṣābirun', meaning: 'Orang yang bersabar' },
      isimMaful: { arabic: 'مَصْبُورٌ', translit: 'Maṣbūrun', meaning: 'Yang ditahan' },
      quranicExample: { verseRef: 'QS. 2:153', arabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ', indo: 'Dan mohonlah pertolongan dengan sabar dan shalat.' }
    },
    {
      formId: 'Form III',
      formName: 'Bab Mufa\'alah (فَاعَلَ)',
      wazanPattern: 'فَاعَلَ / يُفَاعِلُ (صَابَرَ / يُصَابِرُ)',
      faedahSharaf: 'Musyarakah (Saling menguatkan kesabaran bersama orang lain).',
      explanation: 'Penambahan alif setelah fa\' fi\'il menunjukkan kesabaran interaktif dalam perjuangan bersama.',
      madhi: { arabic: 'صَابَرَ', translit: 'Ṣābara', meaning: 'Dia saling menguatkan sabar' },
      mudhari: { arabic: 'يُصَابِرُ', translit: 'Yuṣābiru', meaning: 'Dia menguatkan kesabaran' },
      amr: { arabic: 'صَابِرُوا', translit: 'Ṣābirū', meaning: 'Tetapkanlah kesabaranmu bersama!' },
      masdar: { arabic: 'مُصَابَرَةً', translit: 'Muṣābaratan', meaning: 'Keteguhan bersabar bersama' },
      isimFail: { arabic: 'مُصَابِرٌ', translit: 'Muṣābirun', meaning: 'Orang yang saling menguatkan kesabaran' },
      quranicExample: { verseRef: 'QS. 3:200', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اصْبِرُوا وَصَابِرُوا', indo: 'Wahai orang-orang beriman, bersabarlah kamu dan kuatkanlah kesabaranmu!' }
    },
    {
      formId: 'Form VIII',
      formName: 'Bab Ifti\'al (افْتَعَلَ)',
      wazanPattern: 'اِفْتَعَلَ / يَفْتَعِلُ (اصْطَبَرَ / يَصْطَبِرُ)',
      faedahSharaf: 'Iktisab & Mujahadah (Kesungguhan ekstra luar biasa untuk bertahan).',
      explanation: 'Mengalami asimilasi morfologis (Ibdal ta -> tha) dari اِصْتَبَرَ menjadi اِصْطَبَرَ untuk melukiskan perjuangan sabar tanpa henti.',
      madhi: { arabic: 'اصْطَبَرَ', translit: 'Iṣṭabara', meaning: 'Dia berjuang keras untuk terus sabar' },
      mudhari: { arabic: 'يَصْطَبِرُ', translit: 'Yaṣṭabiru', meaning: 'Dia sangat bersungguh-sungguh bersabar' },
      amr: { arabic: 'اصْطَبِرْ', translit: 'Iṣṭabir', meaning: 'Teguhkanlah kesabaranmu secara ekstra!' },
      masdar: { arabic: 'اصْطِبَارًا', translit: 'Iṣṭibāran', meaning: 'Perjuangan kesabaran mendalam' },
      isimFail: { arabic: 'مُصْطَبِرٌ', translit: 'Muṣṭabirun', meaning: 'Orang yang sangat teguh bersabar' },
      quranicExample: { verseRef: 'QS. 19:65', arabic: 'فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ', indo: 'Maka sembahlah Dia dan berteguhlah (bersabarlah secara ekstra) dalam beribadah kepada-Nya.' }
    }
  ],

  // 2. Root k-t-b (ك-ت-ب)
  'k-t-b': [
    {
      formId: 'Form I',
      formName: 'Tsulatsi Mujarrad (فَعَلَ)',
      wazanPattern: 'كَتَبَ / يَكْتُبُ',
      faedahSharaf: 'Menulis, menetapkan, mewajibkan (makna dasar).',
      explanation: 'Makna dasar menggabungkan sesuatu atau menuangkan tulisan/hukum.',
      madhi: { arabic: 'كَتَبَ', translit: 'Kataba', meaning: 'Dia telah menulis / menetapkan' },
      mudhari: { arabic: 'يَكْتُبُ', translit: 'Yaktubu', meaning: 'Dia sedang/akan menulis' },
      amr: { arabic: 'اكْتُبْ', translit: 'Uktub', meaning: 'Tulislah!' },
      masdar: { arabic: 'كِتَابَةً / كِتَابٌ', translit: 'Kitāban', meaning: 'Penulisan / Kitab Ketetapan' },
      isimFail: { arabic: 'كَاتِبٌ', translit: 'Kātibun', meaning: 'Penulis / Pencatat' },
      isimMaful: { arabic: 'مَكْتُوبٌ', translit: 'Maktūbun', meaning: 'Tertulis / Ditetapkan' },
      quranicExample: { verseRef: 'QS. 2:183', arabic: 'كُتِبَ عَلَيْكُمُ الصِّيَامُ', indo: 'Diwajibkan (ditetapkan) atas kamu berpuasa.' }
    },
    {
      formId: 'Form III',
      formName: 'Bab Mufa\'alah (فَاعَلَ)',
      wazanPattern: 'كَاتَبَ / يُكَاتِبُ',
      faedahSharaf: 'Musyarakah (Perjanjian tertulis timbal balik).',
      explanation: 'Merujuk pada kesepakatan tertulis antar dua pihak.',
      madhi: { arabic: 'كَاتَبَ', translit: 'Kātaba', meaning: 'Dia membuat perjanjian tertulis' },
      mudhari: { arabic: 'يُكَاتِبُ', translit: 'Yukātibu', meaning: 'Dia mengadakan perjanjian tertulis' },
      amr: { arabic: 'كَاتِبُوهُمْ', translit: 'Kātibūhum', meaning: 'Buatlah perjanjian tertulis dengan mereka!' },
      masdar: { arabic: 'مُكَاتَبَةً', translit: 'Mukātabatan', meaning: 'Perjanjian tertulis' },
      quranicExample: { verseRef: 'QS. 24:33', arabic: 'فَكَاتِبُوهُمْ إِنْ عَلِمْتُمْ فِيهِمْ خَيْرًا', indo: 'Maka buatlah perjanjian (kebebasan tertulis) dengan mereka jika kamu mengetahui ada kebaikan pada mereka.' }
    },
    {
      formId: 'Form VIII',
      formName: 'Bab Ifti\'al (افْتَعَلَ)',
      wazanPattern: 'اِكْتَتَبَ / يَكْتَتِبُ',
      faedahSharaf: 'Iktisab (Usaha menyuruh orang lain menuliskan untuk dirinya).',
      explanation: 'Menunjukkan tindakan aktif meminta atau mencatat dongeng/kitab secara berlebihan.',
      madhi: { arabic: 'اكْتَتَبَ', translit: 'Iktataba', meaning: 'Dia meminta untuk dituliskan' },
      mudhari: { arabic: 'يَكْتَتِبُ', translit: 'Yaktatibu', meaning: 'Dia meminta dituliskan' },
      masdar: { arabic: 'اِكْتِتَابًا', translit: 'Iktitāban', meaning: 'Permintaan pencatatan' },
      quranicExample: { verseRef: 'QS. 25:5', arabic: 'أَسَاطِيرُ الْأَوَّلِينَ اكْتَتَبَهَا', indo: 'Dongeng-dongeng orang terdahulu yang dia minta untuk dituliskan.' }
    }
  ],

  // 3. Root E-l-m (ع-ل-م)
  'E-l-m': [
    {
      formId: 'Form I',
      formName: 'Tsulatsi Mujarrad (فَعِلَ)',
      wazanPattern: 'عَلِمَ / يَعْلَمُ',
      faedahSharaf: 'Mengetahui, memahami secara pasti.',
      explanation: 'Mengetahui kebenaran atau kenyataan sesuatu sebagaimana mestinya.',
      madhi: { arabic: 'عَلِمَ', translit: '\'Alima', meaning: 'Dia telah mengetahui' },
      mudhari: { arabic: 'يَعْلَمُ', translit: 'Ya\'lamu', meaning: 'Dia mengetahui' },
      amr: { arabic: 'اعْلَمْ', translit: 'I\'lam', meaning: 'Ketahuilah!' },
      masdar: { arabic: 'عِلْمًا', translit: '\'Ilman', meaning: 'Ilmu / Pengetahuan' },
      isimFail: { arabic: 'عَالِمٌ', translit: '\'Ālimun', meaning: 'Orang yang tahu' },
      isimMaful: { arabic: 'مَعْلُومٌ', translit: 'Ma\'lūmun', meaning: 'Diketahui / Diberi batas' },
      quranicExample: { verseRef: 'QS. 47:19', arabic: 'فَاعْلَمْ أَنَّهُ لَا إِلَٰهَ إِلَّا اللَّهُ', indo: 'Maka ketahuilah bahwa tidak ada tuhan selain Allah.' }
    },
    {
      formId: 'Form II',
      formName: 'Bab Taf\'il (فَعَّلَ)',
      wazanPattern: 'عَلَّمَ / يُعَلِّمُ',
      faedahSharaf: 'Ta\'diyah & Taktsir (Mengajarkan secara intensif dan bertahap).',
      explanation: 'Mentransitifkan makna mengetahui menjadi mentransfer ilmu kepada pihak lain secara terstruktur.',
      madhi: { arabic: 'عَلَّمَ', translit: '\'Allama', meaning: 'Dia telah mengajarkan' },
      mudhari: { arabic: 'يُعَلِّمُ', translit: 'Yu\'allimu', meaning: 'Dia mengajarkan' },
      amr: { arabic: 'عَلِّمْ', translit: '\'Allim', meaning: 'Ajarkanlah!' },
      masdar: { arabic: 'تَعْلِيمًا', translit: 'Ta\'līman', meaning: 'Pengajaran' },
      isimFail: { arabic: 'مُعَلِّمٌ', translit: 'Mu\'allimun', meaning: 'Pengajar / Guru' },
      quranicExample: { verseRef: 'QS. 96:4-5', arabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ ۞ عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ', indo: 'Yang mengajarkan (manusia) dengan pena. Dia mengajarkan manusia apa yang tidak diketahuinya.' }
    },
    {
      formId: 'Form V',
      formName: 'Bab Tafa\'\'ul (تَفَعَّلَ)',
      wazanPattern: 'تَعَلَّمَ / يَتَعَلَّمُ',
      faedahSharaf: 'Mutawa\'ah Form II & Takalluf (Proses belajar secara sungguh-sungguh).',
      explanation: 'Menerima dampak pengajaran dengan berusaha keras mempelajari ilmu.',
      madhi: { arabic: 'تَعَلَّمَ', translit: 'Ta\'allama', meaning: 'Dia telah belajar' },
      mudhari: { arabic: 'يَتَعَلَّمُ', translit: 'Yata\'allamu', meaning: 'Dia sedang belajar' },
      amr: { arabic: 'تَعَلَّمْ', translit: 'Ta\'allam', meaning: 'Belajarlah!' },
      masdar: { arabic: 'تَعَلُّمًا', translit: 'Ta\'alluman', meaning: 'Proses belajar' },
      quranicExample: { verseRef: 'QS. 2:102', arabic: 'فَيَتَعَلَّمُونَ مِنْهُمَا مَا يُفَرِّقُونَ بِهِ', indo: 'Maka mereka mempelajari dari keduanya apa yang dapat memisahkan antara suami dan istrinya.' }
    }
  ],

  // 4. Root g-f-r (غ-ف-ر)
  'g-f-r': [
    {
      formId: 'Form I',
      formName: 'Tsulatsi Mujarrad (فَعَلَ)',
      wazanPattern: 'غَفَرَ / يَغْفِرُ',
      faedahSharaf: 'Menutupi dan mengampuni dosa.',
      explanation: 'Berasal dari akar ghafara yang berarti menutupi (seperti helm pelindung / mighfar).',
      madhi: { arabic: 'غَفَرَ', translit: 'Ghafara', meaning: 'Dia telah mengampuni' },
      mudhari: { arabic: 'يَغْفِرُ', translit: 'Yaghfiru', meaning: 'Dia mengampuni' },
      amr: { arabic: 'اغْفِرْ', translit: 'Ighfir', meaning: 'Ampunilah!' },
      masdar: { arabic: 'مَغْفِرَةً / غُفْرَانًا', translit: 'Maghfiratan', meaning: 'Ampunan / Perlindungan Dosa' },
      isimFail: { arabic: 'غَافِرٌ / غَفُورٌ', translit: 'Ghāfirun / Ghafūr', meaning: 'Maha Pengampun' },
      quranicExample: { verseRef: 'QS. 3:135', arabic: 'فَاسْتَغْفَرُوا لِذُنُوبِهِمْ وَمَنْ يَغْفِرُ الذُّنُوبَ إِلَّا اللَّهُ', indo: 'Maka mereka memohon ampun atas dosa-dosa mereka, dan siapa lagi yang dapat mengampuni dosa selain Allah?' }
    },
    {
      formId: 'Form X',
      formName: 'Bab Istif\'al (اسْتَفْعَلَ)',
      wazanPattern: 'اسْتَغْفَرَ / يَسْتَغْفِرُ',
      faedahSharaf: 'Thalab (Memohon / meminta dengan kesungguhan hati).',
      explanation: 'Penambahan alif, sin, dan ta\' di awal kata kerja menunjukkan permintaan aktif memohon ampunan.',
      madhi: { arabic: 'اسْتَغْفَرَ', translit: 'Istaghfara', meaning: 'Dia telah memohon ampun' },
      mudhari: { arabic: 'يَسْتَغْفِرُ', translit: 'Yastaghfiru', meaning: 'Dia memohon ampun' },
      amr: { arabic: 'اسْتَغْفِرْ', translit: 'Istaghfir', meaning: 'Mohonlah ampun!' },
      masdar: { arabic: 'اسْتِغْفَارًا', translit: 'Istighfāran', meaning: 'Permohonan ampun' },
      quranicExample: { verseRef: 'QS. 110:3', arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ', indo: 'Maka bertasbihlah dengan memuji Tuhanmu dan mohonlah ampun kepada-Nya.' }
    }
  ],

  // 5. Root n-s-r (ن-ص-ر)
  'n-s-r': [
    {
      formId: 'Form I',
      formName: 'Tsulatsi Mujarrad (فَعَلَ)',
      wazanPattern: 'نَصَرَ / يَنْصُرُ',
      faedahSharaf: 'Menolong, memberi pertolongan dan kejayaan.',
      explanation: 'Bentuk utama pertolongan ilahi dan pertolongan antar manusia.',
      madhi: { arabic: 'نَصَرَ', translit: 'Naṣara', meaning: 'Dia telah menolong' },
      mudhari: { arabic: 'يَنْصُرُ', translit: 'Yanṣuru', meaning: 'Dia menolong' },
      amr: { arabic: 'انْصُرْ', translit: 'Unṣur', meaning: 'Tolonglah!' },
      masdar: { arabic: 'نَصْرًا', translit: 'Naṣran', meaning: 'Pertolongan / Kemenangan' },
      isimFail: { arabic: 'نَاصِرٌ / نَصِيرٌ', translit: 'Nāṣirun / Naṣīr', meaning: 'Penolong' },
      isimMaful: { arabic: 'مَنْصُورٌ', translit: 'Manṣūrun', meaning: 'Yang ditolong / Menang' },
      quranicExample: { verseRef: 'QS. 110:1', arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', indo: 'Apabila telah datang pertolongan Allah dan kemenangan.' }
    },
    {
      formId: 'Form VIII',
      formName: 'Bab Ifti\'al (افْتَعَلَ)',
      wazanPattern: 'انْتَصَرَ / يَنْتَصِرُ',
      faedahSharaf: 'Mutawa\'ah & Iktisab (Membela diri / meraih kemenangan).',
      explanation: 'Upaya membela diri dari kezaliman dan meraih kemenangan.',
      madhi: { arabic: 'انْتَصَرَ', translit: 'Intaṣara', meaning: 'Dia membela diri / meraih kemenangan' },
      mudhari: { arabic: 'يَنْتَصِرُ', translit: 'Yantaṣiru', meaning: 'Dia membela diri' },
      masdar: { arabic: 'انْتِصَارًا', translit: 'Intiṣāran', meaning: 'Pembelaan diri' },
      quranicExample: { verseRef: 'QS. 42:41', arabic: 'وَلَمَنِ انتَصَرَ بَعْدَ ظُلْمِهِ فَأُولَٰئِكَ مَا عَلَيْهِم مِّن سَبِيلٍ', indo: 'Dan sungguh siapa yang membela diri setelah terzalimi, tidak ada alasan menyalahkan mereka.' }
    }
  ]
};

/**
 * Fallback Generator for generic Quranic roots
 */
export function generateGenericParadigm(rootAr: string, rootSlug: string): SharafForm[] {
  const clean = (rootAr || rootSlug || 'فعل').replace(/[^a-zA-Z\u0621-\u064A\s-]/g, '').trim();
  const letters = clean.includes('-') ? clean.split('-') : clean.split('');
  const f = letters[0] || 'ف';
  const a = letters[1] || 'ع';
  const l = letters[2] || 'ل';

  return [
    {
      formId: 'Form I',
      formName: 'Tsulatsi Mujarrad (فَعَلَ)',
      wazanPattern: 'فَعَلَ / يَفْعُلُ',
      faedahSharaf: 'Perbuatan dasar (al-hadats al-asasi) dari akar kata.',
      explanation: `Bentuk asli (Mujarrad) tanpa imbuhan huruf tambahan untuk akar ${f}-${a}-${l}.`,
      madhi: { arabic: `${f}َ${a}َ${l}َ`, translit: 'Fa\'ala', meaning: 'Telah melakukan (Lampau)' },
      mudhari: { arabic: `يَ${f}ْ${a}ُ${l}ُ`, translit: 'Yaf\'ulu', meaning: 'Sedang / akan melakukan' },
      amr: { arabic: `اُ${f}ْ${a}ُ${l}ْ`, translit: 'Uf\'ul', meaning: 'Lakukanlah!' },
      masdar: { arabic: `${f}َ${a}ْ${l}ً`, translit: 'Fa\'lan', meaning: 'Tindakan / Kata Benda' },
      isimFail: { arabic: `${f}َا${a}ِ${l}ٌ`, translit: 'Fā\'ilun', meaning: 'Pelaku / yang melakukan' },
      isimMaful: { arabic: `مَ${f}ْ${a}ُ${l}ٌ`, translit: 'Maf\'ūlun', meaning: 'Objek / yang dikenai' },
    },
    {
      formId: 'Form II',
      formName: 'Bab Taf\'il (فَعَّلَ)',
      wazanPattern: 'فَعَّلَ / يُفَعِّلُ',
      faedahSharaf: 'Taktsir (Penguatan intensitas) atau Ta\'diyah (Mentransitifkan).',
      explanation: 'Penambahan tasydid untuk memperkuat frekuensi atau mentransitifkan makna.',
      madhi: { arabic: `${f}َ${a}َّ${l}َ`, translit: 'Fa\'\'ala', meaning: 'Telah melakukan secara intensif' },
      mudhari: { arabic: `يُ${f}َ${a}ِّ${l}ُ`, translit: 'Yufa\'\'ilu', meaning: 'Sedang melakukan dengan kuat' },
      masdar: { arabic: `تَ${f}ْ${a}ِ${l}ً`, translit: 'Taf\'īlan', meaning: 'Penguatan perbuatan' },
    },
    {
      formId: 'Form IV',
      formName: 'Bab If\'al (أَفْعَلَ)',
      wazanPattern: 'أَفْعَلَ / يُفْعِلُ',
      faedahSharaf: 'Ta\'diyah (Menjadikan objek lain mengalami tindakan).',
      explanation: 'Imbuhan hamzah qatha\' di awal kata kerja untuk menujukan perbuatan kepada objek.',
      madhi: { arabic: `أَ${f}ْ${a}َ${l}َ`, translit: 'Af\'ala', meaning: 'Telah menyebabkannya terjadi' },
      mudhari: { arabic: `يُ${f}ْ${a}ِ${l}ُ`, translit: 'Yuf\'ilu', meaning: 'Sedang menyebabkan terjadi' },
      masdar: { arabic: `إِ${f}ْ${a}َا${l}ً`, translit: 'If\'ālan', meaning: 'Tindakan mementingkan objek' },
    }
  ];
}

export function getSharafParadigms(rootSlug?: string, rootArabic?: string): SharafForm[] {
  const slug = (rootSlug || '').toLowerCase();
  return CLASSICAL_PARADIGMS[slug] || generateGenericParadigm(rootArabic || '', slug);
}
