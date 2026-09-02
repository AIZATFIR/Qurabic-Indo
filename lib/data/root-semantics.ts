import { QuranicUsagePattern } from '../types/morphology';

export interface RootSemanticProfile {
  titleIndo: string;
  coreMeaning: string;
  usagePatterns: QuranicUsagePattern[];
  contextualNote?: string;
  meaningsIndonesian: string[];
}

/**
 * Curated Semantic Profiles for Key Quranic Roots (Tadabbur-Grade Insight)
 * Based on authentic Quranic context & linguistic nuance.
 * Layer: LINGUISTIC_INTERPRETATION (Editorial / AI-assisted context).
 */
export const CURATED_ROOT_SEMANTICS: Record<string, RootSemanticProfile> = {
  // 1. q-w-l (ق و ل) - Dominant Quranic Speech Root
  'q-w-l': {
    titleIndo: 'Berkata / Mengucapkan / Perkataan / Qaul',
    coreMeaning:
      'Akar ق و ل berkaitan dengan tindakan mengucapkan, menyatakan, atau menyampaikan sesuatu melalui perkataan. Dalam Al-Qur\'an, akar ini menjadi salah satu pilar leksikal terbesar yang mengabadikan firman Allah, dialog para nabi, bantahan kaum ingkar, seruan tauhid, serta adab tutur kata antar-manusia.',
    usagePatterns: [
      {
        title: 'Ucapan dan Perkataan Verbal (Qala / Yaqulu / Qul)',
        description: 'Bentuk verba yang digunakan untuk menyampaikan firman, perintah risalah (Qul), jawaban, dan dialog langsung.',
        examples: ['قَالَ', 'يَقُولُونَ', 'قُلْ', 'قِيلَ']
      },
      {
        title: 'Isi Perkataan & Pernyataan (Qaul)',
        description: 'Bentuk nomina (qaul) yang merujuk pada ucapan berbobot, ketetapan firman, atau anjuran tutur kata yang santun (qaulan layyina).',
        examples: ['قَوْلًا سَدِيدًا', 'قَوْلًا لَّيِّنًا', 'قَوْلُ الْحَقِّ']
      },
      {
        title: 'Pihak Penutur / Yang Berkata (Qa\'il)',
        description: 'Bentuk isim fa\'il untuk menunjuk seseorang yang mengutarakan perkataan atau pertanyaan dalam peristiwa dialog.',
        examples: ['قَالَ قَائِلٌ مِّنْهُمْ']
      },
      {
        title: 'Perkataan yang Dibuat-buat (Taqawwala)',
        description: 'Bentuk verba Form V (taqawwala) untuk menggambarkan tindakan mengada-adakan atau mereka-reka perkataan palsu atas nama Allah.',
        examples: ['وَلَوْ تَقَوَّلَ عَلَيْنَا بَعْضَ الْأَقَاوِيلِ']
      }
    ],
    contextualNote:
      'Perintah "Qul" (Katakanlah!) dalam Al-Qur\'an menegaskan integritas wahyu, di mana Rasulullah saw bertindak sebagai penyampai amanah ilahi persis sebagaimana yang diturunkan.',
    meaningsIndonesian: [
      'Tindakan berbicara, mengucapkan, dan menyampaikan pesan',
      'Isi perkataan, pernyataan, dan ketetapan firman (qaul)',
      'Perintah dakwah dan penegasan wahyu (Qul)',
      'Dialog, perbantahan, dan kesaksian lisan di akhirat'
    ]
  },

  // 2. s-m-w (س م و) - Reference Root
  's-m-w': {
    titleIndo: 'Tinggi / Menjulang / Nama / Penamaan',
    coreMeaning:
      'Akar س م و berkaitan dengan gagasan tinggi, menjulang, atau berada di atas. Dari akar yang sama berkembang penggunaan yang berkaitan dengan nama/penamaan (ism), karena nama mengangkat dan meninggikan penyebutan suatu entitas sehingga dikenal dan dibedakan dari yang lain.',
    usagePatterns: [
      {
        title: 'Langit / Sesuatu yang tinggi',
        description: 'Digunakan untuk menunjuk benda alamiah di atas bumi (as-sama\'), cakrawala, dan alam ketinggian tempat turunnya berkah dan ketetapan Ilahi.',
        examples: ['السَّمَاء', 'السَّمَاوَات']
      },
      {
        title: 'Nama dan Penamaan',
        description: 'Muncul dalam bentuk isim (اسْم) untuk menyebut asma Allah, nama manusia, atau sebutan pengenal.',
        examples: ['بِسْمِ اللَّهِ', 'اسْمُهُ أَحْمَدُ', 'أَسْمَاءً سَمَّيْتُمُوهَا']
      },
      {
        title: 'Penamaan / Tindakan Memberi Nama',
        description: 'Bentuk verbal (سَمَّىٰ / يُسَمُّونَ) digunakan dalam konteks tindakan menetapkan nama atau memberi sebutan.',
        examples: ['سَمَّيْتُهَا مَرْيَمَ', 'إِنَّ الَّذِينَ لَا يُؤْمِنُونَ بِالْآخِرَةِ لَيُسَمُّونَ الْمَلَائِكَةَ']
      },
      {
        title: 'Sesuatu yang Dinamai / Ditetapkan',
        description: 'Bentuk turunan musamma (مُسَمًّى) merujuk pada batas waktu (ajal), jangka waktu, atau perjanjian yang telah ditentukan secara pasti.',
        examples: ['أَجَلٌ مُسَمًّى', 'إِلَىٰ أَجَلٍ مُسَمًّى']
      }
    ],
    contextualNote:
      'Kesamaan akar tidak berarti seluruh turunannya memiliki arti yang identik. Hubungan akar menunjukkan keterkaitan leksikal dasar (ketinggian & pengenalan), sedangkan makna aktual ditentukan oleh bentuk kata (sharaf) dan konteks pembicaraan dalam ayat.',
    meaningsIndonesian: [
      'Ketinggian dan keluhuran derajat',
      'Langit dan alam atas semesta (as-sama\')',
      'Nama dan penyebutan pengenal (ism)',
      'Penetapan sebutan dan pemberian nama (tasmiyah)',
      'Batas ketetapan yang telah ditentukan (musamma)'
    ]
  },

  // 3. E-f-w (ع ف و) - Forgiveness & Pardoning
  'E-f-w': {
    titleIndo: 'Memaafkan / Menghapus Kesalahan / Kelapangan',
    coreMeaning:
      'Akar ع ف و secara etimologi merujuk pada tindakan melenyapkan atau menghapus bekas tapak hingga tiada bersisa. Dalam Al-Qur\'an, \'afw adalah kerelaan hati untuk memaafkan kesalahan dan dosa tanpa meninggalkan dendam, hukuman, maupun celaan.',
    usagePatterns: [
      {
        title: 'Pemaafan Allah atas Dosa Hamba (Al-\'Afuww)',
        description: 'Sifat kemurahan Allah yang senang menghapus dosa dan membebaskan hamba dari catatan kesalahan.',
        examples: ['إِنَّ اللَّهَ كَانَ عَفُوًّا غَفُورًا', 'وَيَعْفُو عَنْ كَثِيرٍ']
      },
      {
        title: 'Sikap Pemaaf Antar-Sesama',
        description: 'Anjuran akhlak mulia untuk berlapang dada, mengabaikan perlakuan buruk, dan memberi maaf.',
        examples: ['خُذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ', 'وَأَنْ تَعْفُوا أَقْرَبُ لِلتَّقْوَىٰ']
      },
      {
        title: 'Kelapangan / Harta Berlebih',
        description: 'Kelebihan rezeki setelah tercukupinya kebutuhan pokok yang disalurkan untuk infak.',
        examples: ['وَيَسْأَلُونَكَ مَاذَا يُنْفِقُونَ قُلِ الْعَفْوَ']
      }
    ],
    contextualNote:
      'Tingkatan \'afw (memaafkan) lebih luhur daripada sekadar menahan amarah (kazhm al-ghaizh), karena \'afw melenyapkan sisa kebencian di dalam hati.',
    meaningsIndonesian: [
      'Menghapus dosa dan memaafkan tanpa membalas',
      'Kelapangan hati dalam memaklumi kekurangan sesama',
      'Kelebihan rezeki yang dinafkahkan di jalan kebaikan'
    ]
  },

  // 4. x-w-f (خ و ف) - Golden Benchmark Root
  'x-w-f': {
    titleIndo: 'Rasa Takut / Kekhawatiran / Kewaspadaan / Khauf',
    coreMeaning:
      'Akar خ و ف berkaitan dengan gagasan rasa takut, kekhawatiran batin, kegentaran, atau kecemasan terhadap sesuatu yang dibenci yang diperkirakan akan terjadi di masa depan.',
    usagePatterns: [
      {
        title: 'Takut kepada Allah (Khauf Ibadah)',
        description: 'Sikap batin orang beriman yang gentar akan keagungan, ancaman, dan hisab Allah sehingga terdorong untuk taat dan menjauhi maksiat.',
        examples: ['فَلَا تَخَافُوهُمْ وَخَافُونِ', 'يَخَافُونَ رَبَّهُمْ']
      },
      {
        title: 'Takut Alami / Manusiawi',
        description: 'Kekhawatiran naluriah manusia terhadap bahaya musuh, ancaman fisik, atau ketidakpastian.',
        examples: ['فَأَوْجَسَ فِي نَفْسِهِ خِيفَةً', 'خَوْفًا وَطَمَعًا']
      },
      {
        title: 'Ancaman / Menakut-nakuti',
        description: 'Bentuk verba transitif (khawwafa) untuk menakut-nakuti hamba melalui tanda-tanda kekuasaan atau bisikan setan.',
        examples: ['وَمَا نُرْسِلُ بِالْآيَاتِ إِلَّا تَخْوِيفًا', 'الشَّيْطَانُ يُخَوِّفُ أَوْلِيَاءَهُ']
      },
      {
        title: 'Rasa Takut yang Dilenyapkan',
        description: 'Ketiadaan rasa takut dan kesedihan bagi para kekasih Allah dan orang-orang beriman di akhirat.',
        examples: ['فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ']
      }
    ],
    contextualNote:
      'Dalam Al-Qur\'an, rasa takut terpuji (khauf kepada Allah) berpasangan dengan rasa harap (thama\'/raja\'), melahirkan keseimbangan jiwa yang senantiasa waspada dan optimis.',
    meaningsIndonesian: [
      'Rasa takut dan kegentaran hati kepada Allah',
      'Kekhawatiran manusiawi terhadap bahaya',
      'Peringatan ancaman siksa dan hisab',
      'Kewaspadaan batin dalam memelihara ketaatan'
    ]
  },

  // 5. S-b-r (ص ب ر)
  'S-b-r': {
    titleIndo: 'Sabar / Menahan Diri / Keteguhan Hati',
    coreMeaning:
      'Akar ص ب ر berkaitan dengan gagasan menahan, mengikat, atau membatasi diri. Dalam konteks Qur\'ani, sabar adalah keteguhan jiwa dalam memegang ketaatan, menahan diri dari dorongan hawa nafsu, serta ketabahan saat menghadapi cobaan dan takdir yang berat.',
    usagePatterns: [
      {
        title: 'Sabar dalam Menjalankan Ketaatan',
        description: 'Keteguhan dan konsistensi dalam beribadah dan menegakkan kebenaran tanpa putus asa.',
        examples: ['وَاصْطَبِرْ عَلَيْهَا', 'وَاصْبِرْ لِحُكْمِ رَبِّكَ']
      },
      {
        title: 'Sabar Menghadapi Ujian & Musibah',
        description: 'Ketenangan batin dan sikap ridha tanpa keluh kesah saat ditimpa kesulitan hidup.',
        examples: ['الصَّابِرِينَ فِي الْبَأْسَاءِ وَالضَّرَّاءِ', 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم']
      },
      {
        title: 'Sabar Menahan Diri dari Kezaliman',
        description: 'Kemampuan menahan amarah dan tidak membalas kejahatan dengan kejahatan serupa.',
        examples: ['وَلَمَنْ صَبَرَ وَغَفَرَ إِنَّ ذَٰلِكَ لَمِنْ عَزْمِ الْأُمُورِ']
      }
    ],
    contextualNote:
      'Sabar dalam Islam bukan kepasrahan yang lemah, melainkan kekuatan aktif untuk mengendalikan diri dan bertahan di jalan kebenaran.',
    meaningsIndonesian: [
      'Ketabahan dan keteguhan hati menghadapi cobaan',
      'Kemampuan menahan diri dari hawa nafsu dan amarah',
      'Konsistensi dalam menjalankan ketaatan dan ibadah',
      'Ketenangan jiwa dan optimisme bersandar kepada Allah'
    ]
  },

  // 6. S-l-w (ص ل و)
  'S-l-w': {
    titleIndo: 'Shalat / Doa / Hubungan Spiritual / Shalawat',
    coreMeaning:
      'Akar ص ل و berkaitan dengan jalinan hubungan, penghubung (shilah), ketundukan beribadah kepada Allah (shalat), serta doa permohonan ampunan, berkah, dan rahmat (shalawat).',
    usagePatterns: [
      {
        title: 'Ibadah Shalat Fardhu & Sunnah',
        description: 'Rukun ibadah praktis yang menghubungkan hamba langsung dengan Sang Pencipta.',
        examples: ['أَقِيمُوا الصَّلَاةَ', 'الَّذِينَ هُمْ عَلَىٰ صَلَاتِهِمْ دَائِمُونَ']
      },
      {
        title: 'Shalawat Allah & Malaikat',
        description: 'Limpahan rahmat, pujian, dan ampunan dari Allah serta permohonan doa dari para malaikat bagi Nabi dan orang beriman.',
        examples: ['إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ', 'هُوَ الَّذِي يُصَلِّي عَلَيْكُمْ']
      },
      {
        title: 'Doa Kebaikan / Keberkahan',
        description: 'Doa kebaikan yang dipanjatkan seorang rasul atau manusia bagi sesamanya.',
        examples: ['وَصَلِّ عَلَيْهِمْ إِنَّ صَلَاتَكَ سَكَنٌ لَهُمْ']
      }
    ],
    contextualNote:
      'Makna shalat mencakup dimensi ritual lahiriah dan koneksi batiniah yang mencegah perbuatan keji dan munkar.',
    meaningsIndonesian: [
      'Ibadah shalat sebagai tiang agama dan komunikasi hamba-Nya',
      'Limpahan rahmat dan pengagungan Allah (shalawat)',
      'Doa permohonan berkah, ketenangan, dan ampunan'
    ]
  },

  // 7. r-H-m (ر ح م)
  'r-H-m': {
    titleIndo: 'Rahmat / Kasih Sayang / Rahim / Kelembutan',
    coreMeaning:
      'Akar ر ح م berkaitan dengan kelembutan, kebaikan hati, dan dorongan memberi perlindungan serta anugerah. Dari akar ini lahir nama Allah Ar-Rahman dan Ar-Rahim, serta rahim seorang ibu sebagai tempat pemeliharaan janin penuh cinta.',
    usagePatterns: [
      {
        title: 'Sifat Kasih Sayang Allah yang Menyeluruh',
        description: 'Rahmat Allah yang mendahului murka-Nya dan mencakup seluruh makhluk di alam semesta.',
        examples: ['وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ', 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ']
      },
      {
        title: 'Pertalian Kerabat & Silaturrahim',
        description: 'Hubungan kekeluargaan dan kasih sayang antarsesama manusia.',
        examples: ['وَأُولُو الْأَرْحَامِ بَعْضُهُمْ أَوْلَىٰ بِبَعْضٍ']
      },
      {
        title: 'Pengampunan & Penyelamatan',
        description: 'Kasih sayang Ilahi yang membebaskan hamba dari siksaan dan mengantarkan ke surga.',
        examples: ['رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً', 'يُدْخِلُ مَنْ يَشَاءُ فِي رَحْمَتِهِ']
      }
    ],
    contextualNote:
      'Ar-Rahman adalah kasih sayang hakiki yang meluas bagi seluruh makhluk, sedangkan Ar-Rahim adalah rahmat khusus yang abadi bagi orang-orang beriman.',
    meaningsIndonesian: [
      'Kasih sayang mutlak yang melimpah bagi seluruh alam',
      'Kelembutan, pengampunan, dan pertolongan Ilahi',
      'Ikatan persaudaraan dan kekerabatan (rahim)'
    ]
  },

  // 8. H-m-d (ح م د)
  'H-m-d': {
    titleIndo: 'Pujian / Sanjungan / Kesyukuran / Hamdalah',
    coreMeaning:
      'Akar ح م د merujuk pada sanjungan dan pujian yang tulus atas dasar cinta (mahabbah) dan pengagungan (ta\'zhim), yang ditujukan kepada Dzat yang berbuat kebaikan atas kehendak dan kesempurnaan sifat-Nya sendiri.',
    usagePatterns: [
      {
        title: 'Pujian Mutlak bagi Allah',
        description: 'Pengakuan bahwa segala ragam pujian di langit dan bumi hanya berhak dimiliki oleh Allah semata.',
        examples: ['الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'وَهُوَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ لَهُ الْحَمْدُ']
      },
      {
        title: 'Kedudukan Terpuji (Maqam Mahmud)',
        description: 'Derajat kemuliaan tertinggi yang dianugerahkan Allah kepada Nabi Muhammad saw di akhirat.',
        examples: ['عَسَىٰ أَنْ يَبْعَثَكَ رَبُّكَ مَقَامًا مَحْمُودًا']
      },
      {
        title: 'Pujian Alam Semesta',
        description: 'Seluruh makhluk bertasbih dan memuji kesucian Sang Pencipta.',
        examples: ['وَإِنْ مِنْ شَيْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِ']
      }
    ],
    contextualNote:
      'Hamd lebih tinggi dari madah (pujian fisik) dan syukr (terima kasih atas nikmat), karena hamd memuji keindahan Dzat dan kesempurnaan perbuatan sekaligus.',
    meaningsIndonesian: [
      'Segala puji dan sanjungan sempurna bagi Allah',
      'Pujian berpadu rasa cinta dan pengagungan mutlak',
      'Derajat dan kedudukan yang terpuji di sisi-Nya'
    ]
  },

  // 9. k-Z-b (ك ذ ب)
  'k-Z-b': {
    titleIndo: 'Dusta / Kebohongan / Pendustaan Ayat',
    coreMeaning:
      'Akar ك ذ ب berkaitan dengan ketidaksesuaian antara perkataan dan kenyataan (kebohongan), serta sikap keras kepala dalam menolak dan mendustakan kebenaran wahyu, ayat, dan para rasul.',
    usagePatterns: [
      {
        title: 'Mendustakan Ayat & Hari Pembalasan',
        description: 'Penolakan kaum ingkar terhadap bukti-bukti kenabian dan kepastian akhirat.',
        examples: ['وَكَذَّبُوا بِآيَاتِنَا كِذَّابًا', 'الَّذِينَ يُكَذِّبُونَ بِيَوْمِ الدِّينِ']
      },
      {
        title: 'Mengada-adakan Kebohongan atas Nama Allah',
        description: 'Tindakan syirik dan fatwa palsu yang menisbatkan kebohongan kepada wahyu.',
        examples: ['وَيَوْمَ الْقِيَامَةِ تَرَى الَّذِينَ كَذَبُوا عَلَى اللَّهِ']
      },
      {
        title: 'Mendustakan Para Rasul',
        description: 'Sejarah umat terdahulu yang menuduh rasul mereka sebagai pembohong.',
        examples: ['فَقَدْ كُذِّبَتْ رُسُلٌ مِنْ قَبْلِكَ']
      }
    ],
    contextualNote:
      'Dalam Al-Qur\'an, kata kazdzaba (Form II) mengandung makna mendustakan atau menganggap bohong ajaran kebenaran secara aktif.',
    meaningsIndonesian: [
      'Perkataan bohong dan pemutarbalikan fakta',
      'Penolakan dan pendustaan terhadap ayat serta rasul',
      'Mengada-adakan kedustaan dalam urusan agama'
    ]
  },

  // 10. A-m-n (أ م ن)
  'A-m-n': {
    titleIndo: 'Iman / Aman / Ketenangan / Kepercayaan',
    coreMeaning:
      'Akar أ م ن berkaitan dengan rasa aman dari marabahaya, ketenangan jiwa dari ketakutan, serta kepercayaan penuh dalam membenarkan kebenaran wahyu Allah (iman).',
    usagePatterns: [
      {
        title: 'Keimanan Hati & Amal Saleh',
        description: 'Keyakinan kokoh kepada Allah, malaikat, kitab, rasul, dan hari akhir.',
        examples: ['آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ', 'الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ']
      },
      {
        title: 'Rasa Aman & Perlindungan',
        description: 'Negeri dan jiwa yang terlindung dari kelaparan, ketakutan, dan ancaman.',
        examples: ['وَآمَنَهُمْ مِنْ خَوْفٍ', 'رَبِّ اجْعَلْ هَـٰذَا بَلَدًا آمِنًا']
      },
      {
        title: 'Amanah & Kejujuran',
        description: 'Tanggung jawab yang dipercayakan untuk dijaga dan ditunaikan dengan benar.',
        examples: ['إِنَّ اللَّهَ يَأْمُرُكُمْ أَنْ تُؤَدُّوا الْأَمَانَاتِ']
      }
    ],
    contextualNote:
      'Iman sejati melahirkan rasa aman di dalam hati dan menjamin keamanan bagi sesama manusia.',
    meaningsIndonesian: [
      'Keyakinan teguh dan ketundukan hati (iman)',
      'Perlindungan dan terbebas dari rasa takut (aman)',
      'Penjagaan janji dan kepercayaan (amanah)'
    ]
  },

  // 11. k-f-r (ك ف ر)
  'k-f-r': {
    titleIndo: 'Kafir / Mengingkari / Menutupi Kebenaran / Kufur',
    coreMeaning:
      'Akar ك ف ر secara etimologi merujuk pada tindakan menutupi sesuatu (seperti tanah yang menutupi benih). Dalam konteks Qur\'ani, kata ini digunakan untuk menggambarkan penutupan hati dari cahaya kebenaran serta pengingkaran terhadap nikmat dan keesaan Allah.',
    usagePatterns: [
      {
        title: 'Pengingkaran Akidah (Kekafiran)',
        description: 'Menolak beriman kepada Allah dan rasul-Nya.',
        examples: ['إِنَّ الَّذِينَ كَفَرُوا سَوَاءٌ عَلَيْهِمْ', 'لَمْ يَكُنِ الَّذِينَ كَفَرُوا']
      },
      {
        title: 'Mengingkari Nikmat (Kufur Nikmat)',
        description: 'Ketidaksyukuran atas karunia dan pemberian Allah.',
        examples: ['فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ']
      },
      {
        title: 'Menghapus Kesalahan (Kafarat / Menutupi Dosa)',
        description: 'Bentuk takfir (Form II) berarti Allah menutupi dan mengampuni dosa hamba-Nya.',
        examples: ['رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا']
      }
    ],
    contextualNote:
      'Konsep kufur dalam Al-Qur\'an berlawanan dengan iman dan syukur; sedangkan kafarat adalah sarana penutup kesalahan.',
    meaningsIndonesian: [
      'Menutup diri dan mengingkari kebenaran wahyu',
      'Ketidaksyukuran atas limpahan karunia (kufur nikmat)',
      'Penghapusan dan penutupan dosa (takfir/kafarat)'
    ]
  },

  // 12. E-l-m (ع ل م)
  'E-l-m': {
    titleIndo: 'Ilmu / Mengetahui / Pemahaman / Tanda Pengenal',
    coreMeaning:
      'Akar ع ل م berkaitan dengan tersingkapnya hakikat sesuatu sehingga jelas diketahui, tanda pengenal (alam), serta pengetahuan yang mendalam yang membedakan sesuatu dari keraguan.',
    usagePatterns: [
      {
        title: 'Pengetahuan Mahaluas Allah',
        description: 'Ilmu Allah yang meliputi segala sesuatu yang tampak maupun yang gaib.',
        examples: ['وَاللَّهُ بِكُلِّ شَيْءٍ عَلِيمٌ', 'عَالِمِ الْغَيْبِ وَالشَّهَادَةِ']
      },
      {
        title: 'Ilmu Wahyu & Petunjuk bagi Manusia',
        description: 'Pengetahuan yang diajarkan Allah kepada manusia agar memahami tujuan penciptaan.',
        examples: ['عَلَّمَ الْإِنْسَانَ مَا لَمْ يَعْلَمْ', 'وَقُلْ رَبِّ زِدْنِي عِلْمًا']
      },
      {
        title: 'Tanda & Batas Alam (Alam Semesta)',
        description: 'Makhluk dan alam semesta sebagai tanda nyata keagungan Sang Pencipta.',
        examples: ['الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'وَعَلَامَاتٍ وَبِالنَّجْمِ هُمْ يَهْتَدُونَ']
      }
    ],
    contextualNote:
      'Ilmu dalam perspektif Qur\'ani selalu menuntut rasa takut dan tunduk kepada Allah (khasyyah).',
    meaningsIndonesian: [
      'Pengetahuan dan kearifan yang bersumber dari wahyu',
      'Ilmu Allah yang meliputi yang gaib dan nyata',
      'Tanda-tanda kebesaran Pencipta di alam semesta'
    ]
  },

  // 13. w-q-y (و ق ي)
  'w-q-y': {
    titleIndo: 'Takwa / Menjaga Diri / Perlindungan / Membentengi',
    coreMeaning:
      'Akar و ق ي berkaitan dengan gagasan menjaga, melindungi, atau membuat benteng/tameng pelindung (wiqayah) dari bahaya. Dari akar ini lahir istilah Taqwa: membentengi diri dari kemurkaan dan azab Allah dengan menjalankan perintah-Nya dan menjauhi larangan-Nya.',
    usagePatterns: [
      {
        title: 'Ketakwaan Orang Beriman',
        description: 'Sikap waspada dan taat yang menjadi bekal terbaik hamba di dunia dan akhirat.',
        examples: ['يَا أَيُّهَا الَّذِينَ آمَنُوا اتَّقُوا اللَّهَ', 'إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ']
      },
      {
        title: 'Perlindungan dari Azab & Bahaya',
        description: 'Pertolongan Allah yang membentengi hamba dari kehancuran dan kejahatan.',
        examples: ['فَوَقَاهُمُ اللَّهُ شَرَّ ذَٰلِكَ الْيَوْمِ', 'وَقِنَا عَذَابَ النَّارِ']
      },
      {
        title: 'Menjaga Diri dan Keluarga',
        description: 'Tanggung jawab membimbing keluarga agar terhindar dari api neraka.',
        examples: ['قُوا أَنْفُسَكُمْ وَأَهْلِيكُمْ نَارًا']
      }
    ],
    contextualNote:
      'Takwa bukan sekadar rasa takut, melainkan kesadaran aktif untuk senantiasa berjalan dalam koridor ridha Ilahi.',
    meaningsIndonesian: [
      'Ketakwaan sejati dan ketundukan menjalankan perintah Allah',
      'Membentengi diri dari azab dan murka Ilahi',
      'Perlindungan dan keselamatan dari keburukan'
    ]
  }
};

/**
 * Returns a rich, context-aware semantic profile for any Quranic root.
 */
export function getRootSemanticProfile(rootBw: string, rootArabic: string, totalOccurrences: number, verbsCount: number, nounsCount: number): RootSemanticProfile {
  const normalizedId = rootBw.replace(/\s+/g, '-').split('').join('-');
  const directId = rootBw.split('').join('-');

  if (CURATED_ROOT_SEMANTICS[rootBw]) return CURATED_ROOT_SEMANTICS[rootBw];
  if (CURATED_ROOT_SEMANTICS[normalizedId]) return CURATED_ROOT_SEMANTICS[normalizedId];
  if (CURATED_ROOT_SEMANTICS[directId]) return CURATED_ROOT_SEMANTICS[directId];

  // Dynamic semantic synthesis for all other roots (Clean, informative, context-aware)
  const rootArJoined = rootArabic.replace(/\s+/g, '');
  
  return {
    titleIndo: `Konsep & Turunan Akar ${rootArJoined}`,
    coreMeaning: `Akar kata ${rootArabic} (${rootBw}) memiliki peranan penting dalam kosakata Al-Qur'an dengan berbagai bentuk turunan verba (${verbsCount} bentuk) dan nomina (${nounsCount} bentuk) yang tersebar di berbagai konteks ayat.`,
    usagePatterns: [
      {
        title: 'Penggunaan Kontekstual dalam Ayat',
        description: `Turunan akar ${rootArJoined} hadir dalam konstruksi kalimat Al-Qur'an untuk menyampaikan pesan ketuhanan, hukum, peringatan, maupun kisah teladan sesuai ragam wazan sharaf yang digunakan.`
      }
    ],
    contextualNote: 'Hubungan antar-turunan kata berpangkal pada akar leksikal yang sama, sedangkan makna definitif ditentukan oleh wazan sharaf dan konteks kalimat dalam ayat Al-Qur\'an.',
    meaningsIndonesian: [
      `Gagasan pokok yang terhimpun dalam akar kata ${rootArJoined}`,
      `Ragam makna kontekstual sesuai penggunaan ayat Al-Qur'an`
    ]
  };
}
