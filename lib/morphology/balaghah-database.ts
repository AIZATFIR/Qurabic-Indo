export interface SynonymComparison {
  primaryWord: { arabic: string; translit: string; root: string };
  comparedWord: { arabic: string; translit: string; root: string };
  topicTitle: string;
  balaghahInsight: string;
  primaryNuance: string;
  comparedNuance: string;
  primaryVerseExample: { verseRef: string; textArabic: string; translationIndo: string };
  comparedVerseExample: { verseRef: string; textArabic: string; translationIndo: string };
}

export const BALAGHAH_COMPARISONS: Record<string, SynonymComparison> = {
  // 1. Fear Nuance: Khawf vs Khasyyah
  'x-w-f': {
    primaryWord: { arabic: 'خَوْفٌ', translit: 'Khawf', root: 'خ-و-ف' },
    comparedWord: { arabic: 'خَشْيَةٌ', translit: 'Khasyyah', root: 'خ-ش-ي' },
    topicTitle: 'Bedah Balaghah: Khawf (خَوْف) vs Khasyyah (خَشْيَة)',
    balaghahInsight: 'Al-Qur\'an membedakan rasa takut biasa (Khawf) dengan rasa takut yang dilandasi oleh keagungan dan keilmuan mendalam (Khasyyah).',
    primaryNuance: 'Khawf adalah rasa takut umum akibat mengantisipasi bahaya atau hukuman yang tampak, yang dirasakan oleh fisik maupun jiwa.',
    comparedNuance: 'Khasyyah adalah rasa takut yang lahir dari pengenalan (ma\'rifah) dan rasa hormat yang sangat tinggi atas keagungan Allah. Oleh karena itu, Allah berfirman bahwa hanya para ulama yang memiliki Khasyyah kepada-Nya.',
    primaryVerseExample: {
      verseRef: 'QS. 2:155',
      textArabic: 'وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ وَالْجُوعِ',
      translationIndo: 'Dan Kami pasti akan menguji kamu dengan sedikit ketakutan (khawf) dan kelaparan.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 35:28',
      textArabic: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
      translationIndo: 'Di antara hamba-hamba Allah yang takut (khasyyah) kepada-Nya, hanyalah para ulama (orang berilmu).'
    }
  },
  'x-$-y': {
    primaryWord: { arabic: 'خَشْيَةٌ', translit: 'Khasyyah', root: 'خ-ش-ي' },
    comparedWord: { arabic: 'خَوْفٌ', translit: 'Khawf', root: 'خ-و-ف' },
    topicTitle: 'Bedah Balaghah: Khasyyah (خَشْيَة) vs Khawf (خَوْف)',
    balaghahInsight: 'Khasyyah mensyaratkan adanya ilmu dan rasa hormat mendalam kepada Sang Maha Pencipta, bukan sekadar kekhawatiran fisik.',
    primaryNuance: 'Khasyyah merujuk pada ketakutan spiritual yang dibarengi kekaguman agung (Reverence).',
    comparedNuance: 'Khawf merujuk pada naluri ketakutan insani terhadap bahaya fisik atau bencana.',
    primaryVerseExample: {
      verseRef: 'QS. 35:28',
      textArabic: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ',
      translationIndo: 'Hanyalah hamba Allah yang berilmu (ulama) yang merasa khasyyah kepada-Nya.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 2:155',
      textArabic: 'وَلَنَبْلُوَنَّكُمْ بِشَيْءٍ مِنَ الْخَوْفِ',
      translationIndo: 'Kami menguji kamu dengan sedikit ketakutan (khawf).'
    }
  },

  // 2. Mercy Nuance: Rahmah vs Ra'fah
  'r-h-m': {
    primaryWord: { arabic: 'رَحْمَةٌ', translit: 'Raḥmah', root: 'ر-ح-م' },
    comparedWord: { arabic: 'رَأْفَةٌ', translit: 'Ra\'fah', root: 'ر-أ-ف' },
    topicTitle: 'Bedah Balaghah: Raḥmah (رَحْمَة) vs Ra\'fah (رَأْفَة)',
    balaghahInsight: 'Raḥmah mencakup segala bentuk kebaikan dan kasih sayang luas, sedangkan Ra\'fah adalah kelembutan khusus untuk mencegah penderitaan.',
    primaryNuance: 'Raḥmah bersifat universal dan mencakup rezeki, ampunan, hidayah, serta kasih sayang dunia dan akhirat.',
    comparedNuance: 'Ra\'fah adalah belas kasih tingkat tinggi yang sangat lembut (Compassion), yang berfokus menjaga hamba agar tidak tertimpa kesulitan berat.',
    primaryVerseExample: {
      verseRef: 'QS. 7:156',
      textArabic: 'وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ',
      translationIndo: 'Dan rahmat-Ku meliputi segala sesuatu.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 2:207',
      textArabic: 'وَاللَّهُ رَءُوفٌ بِالْعِبَادِ',
      translationIndo: 'Dan Allah Maha Penyantun / Sangat Lembut (Ra\'ūf) kepada hamba-hamba-Nya.'
    }
  },

  // 3. Forgiveness Nuance: Maghfirah vs 'Afw
  'E-f-w': {
    primaryWord: { arabic: 'عَفْوٌ', translit: '\'Afw', root: 'ع-ف-و' },
    comparedWord: { arabic: 'مَغْفِرَةٌ', translit: 'Maghfirah', root: 'غ-ف-ر' },
    topicTitle: 'Bedah Balaghah: \'Afw (عَفْو) vs Maghfirah (مَغْفِرَة)',
    balaghahInsight: 'Para mufassir menjelaskan bahwa \'Afw lebih tinggi daripada Maghfirah.',
    primaryNuance: '\'Afw artinya menghapus bekas kesalahan secara menyeluruh hingga seolah-olah dosa tersebut tidak pernah ada.',
    comparedNuance: 'Maghfirah artinya menutup dosa (dari akar ghafara = menutupi) sehingga dosa tersebut ditutupi dan pelaku diselamatkan dari azab.',
    primaryVerseExample: {
      verseRef: 'QS. 4:149',
      textArabic: 'فَإِنَّ اللَّهَ كَانَ عَفُوًّا قَدِيرًا',
      translationIndo: 'Maka sesungguhnya Allah Maha Pemaaf (yang menghapus dosa) lagi Maha Kuasa.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 2:268',
      textArabic: 'وَاللَّهُ يَعِدُكُمْ مَغْفِرَةً مِنْهُ وَفَضْلًا',
      translationIndo: 'Dan Allah menjanjikan ampunan (maghfirah / penutupan dosa) dan karunia dari-Nya.'
    }
  },
  'g-f-r': {
    primaryWord: { arabic: 'مَغْفِرَةٌ', translit: 'Maghfirah', root: 'غ-ف-ر' },
    comparedWord: { arabic: 'عَفْوٌ', translit: '\'Afw', root: 'ع-ف-و' },
    topicTitle: 'Bedah Balaghah: Maghfirah (مَغْفِرَة) vs \'Afw (عَفْو)',
    balaghahInsight: 'Maghfirah menutup dan melindungi hamba dari celaan dosa, sedangkan \'Afw menghapus jejak dosa sepenuhnya.',
    primaryNuance: 'Maghfirah berasal dari kata al-mighfar (helm pelindung), yang bertindak menutupi dosa hamba.',
    comparedNuance: '\'Afw merujuk pada penghapusan total (effacement) sehingga catatannya dibersihkan.',
    primaryVerseExample: {
      verseRef: 'QS. 3:133',
      textArabic: 'وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ مِنْ رَبِّكُمْ',
      translationIndo: 'Dan bersegeralah kamu mencari ampunan (maghfirah) dari Tuhanmu.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 2:286',
      textArabic: 'وَاعْفُ عَنَّا وَاغْفِرْ لَنَا',
      translationIndo: 'Dan maafkanlah kami (\'afu), serta ampunilah kami (maghfirah).'
    }
  },

  // 4. Patience Nuance: Sabr vs Ishtibar
  's-b-r': {
    primaryWord: { arabic: 'صَبْرٌ', translit: 'Ṣabr', root: 'ص-ب-ر' },
    comparedWord: { arabic: 'اصْطِبَارٌ', translit: 'Iṣṭibār', root: 'ص-ب-ر' },
    topicTitle: 'Bedah Balaghah: Ṣabr (Form I) vs Iṣṭibār (Form VIII)',
    balaghahInsight: 'Penambahan huruf ta\' (berubah menjadi tha\') pada Form VIII melambangkan penambahan beban perjuangan jiwa dalam bersabar.',
    primaryNuance: 'Ṣabr adalah ketahanan menahan kesusahan pada tingkatan standar.',
    comparedNuance: 'Iṣṭibār adalah perjuangan ekstra keras, penuh pengorbanan jiwa untuk mempertahankan ketabahan dalam ibadah jangka panjang.',
    primaryVerseExample: {
      verseRef: 'QS. 2:153',
      textArabic: 'وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
      translationIndo: 'Dan mohonlah pertolongan dengan sabar dan shalat.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 19:65',
      textArabic: 'فَاعْبُدْهُ وَاصْطَبِرْ لِعِبَادَتِهِ',
      translationIndo: 'Maka sembahlah Dia dan berteguhlah (bersabarlah secara ekstra keras) dalam beribadah kepada-Nya.'
    }
  },

  // 5. Revelation Nuance: Anzala vs Nazzala
  'n-z-l': {
    primaryWord: { arabic: 'أَنْزَلَ', translit: 'Anzala (Form IV)', root: 'ن-ز-ل' },
    comparedWord: { arabic: 'نَزَّلَ', translit: 'Nazzala (Form II)', root: 'ن-ز-ل' },
    topicTitle: 'Bedah Balaghah: Anzala (Form IV) vs Nazzala (Form II)',
    balaghahInsight: 'Form IV (Anzala) merujuk pada penurunan sekaligus secara utuh, sedangkan Form II (Nazzala) merujuk pada penurunan secara bertahap.',
    primaryNuance: 'Anzala digunakan saat Al-Qur\'an diturunkan secara utuh sekaligus dari Lauhul Mahfuzh ke Baitul \'Izzah pada malam Lailatul Qadr.',
    comparedNuance: 'Nazzala digunakan saat Al-Qur\'an diturunkan secara berangsur-angsur (nujūl munajjaman) kepada Nabi Muhammad SAW selama 23 tahun.',
    primaryVerseExample: {
      verseRef: 'QS. 97:1',
      textArabic: 'إِنَّا أَنْزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ',
      translationIndo: 'Sesungguhnya Kami telah meurunkan-Nya (sekaligus) pada malam kemuliaan.'
    },
    comparedVerseExample: {
      verseRef: 'QS. 25:32',
      textArabic: 'وَقَالَ الَّذِينَ كَفَرُوا لَوْلَا نُزِّلَ عَلَيْهِ الْقُرْآنُ جُمْلَةً وَاحِدَةً',
      translationIndo: 'Dan orang-orang kafir berkata: Mengapa Al-Qur\'an tidak diturunkan kepadanya secara bertahap sekaligus?'
    }
  }
};

export function getBalaghahComparison(rootSlug?: string): SynonymComparison | undefined {
  if (!rootSlug) return undefined;
  return BALAGHAH_COMPARISONS[rootSlug.toLowerCase()];
}
