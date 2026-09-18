import { QuranicUsagePattern } from '../types/morphology';
import { ROOT_DATABASE } from './roots';

export interface RootSemanticProfile {
  titleIndo: string;
  coreMeaning: string;
  usagePatterns: QuranicUsagePattern[];
  contextualNote?: string;
  meaningsIndonesian: string[];
}

/**
 * Curated Semantic Profiles for Key Quranic Roots (Lexicographical Reference)
 * Sourced from classical Arabic lexicons (Lisan al-'Arab, Al-Mufradat fi Gharib Al-Qur'an, Hans Wehr).
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
  },

  // 14. k-*-b (ك ذ ب) - Lying, Falsehood, Denial of Truth
  'k-*-b': {
    titleIndo: 'Dusta / Berbohong / Mengingkari Kebenaran / Menyalahi Realitas',
    coreMeaning:
      'Akar ك ذ ب (k-dh-b) melandasi gagasan pokok tentang ketiadaan kesesuaian antara apa yang diucapkan atau diyakini dengan hakikat kenyataan yang sebenarnya (kebalikan dari ص د ق / kejujuran dan kesesuaian faktual). Dalam Al-Qur\'an, akar ini mencakup tiga dimensi: (1) kedustaan lisan terhadap Allah dan ayat-ayat-Nya, (2) kemunafikan amalan ketika lisan mengaku beriman padahal batin mengingkari, dan (3) angan-angan palsu yang memperdaya manusia.',
    usagePatterns: [
      {
        title: 'Kedustaan Lisan & Pengingkaran Wahyu (Kadzaba / Yakdzibu)',
        description: 'Bentuk verba Form I yang merujuk pada ucapan bohong atau penyampaian kabar yang bertentangan dengan kebenaran faktual.',
        examples: ['يَكْذِبُونَ', 'كَذَبُوا عَلَىٰ أَنْفُسِهِمْ', 'إِنْ كَانَ مِنَ الْكَاذِبِينَ']
      },
      {
        title: 'Mendustakan Kebenaran & Utusan Allah (Kadz-dzaba)',
        description: 'Bentuk verba Form II (intensif) yang bermakna aktif menolak, menuduh bohong, atau menyangkal kebenaran risalah rasul dan hari pembalasan.',
        examples: ['وَكَذَّبُوا بِآيَاتِنَا كِذَّابًا', 'فَكَذَّبُوهُ فَعَقَرُوهَا']
      },
      {
        title: 'Hakikat Dusta & Berita Palsu (Kadzib / Kidzb)',
        description: 'Bentuk nomina (masdar) yang merujuk pada substansi kebohongan, tuduhan palsu, atau kebatilan.',
        examples: ['وَجَاءُوا عَلَىٰ قَمِيصِهِ بِدَمٍ كَذِبٍ', 'تَفْتَرُونَ عَلَى اللَّهِ الْكَذِبَ']
      },
      {
        title: 'Pelaku Dusta yang Melampaui Batas (Kadz-dzab / Kadzib)',
        description: 'Bentuk isim fa\'il dan mubalaghah (penyengatan) untuk menyebut pembohong kronis atau pendusta ajaran wahyu.',
        examples: ['إِنَّ اللَّهَ لَا يَهْدِي مَنْ هُوَ مُسْرِفٌ كَذَّابٌ', 'كَٰذِبُونَ']
      }
    ],
    contextualNote:
      'Dalam QS. At-Taubah: 77, kata يَكْذِبُونَ menyoroti watak dasar kaum munafik yang merusak perjanjian dengan Allah karena kebiasaan berbohong yang telah mendarah daging.',
    meaningsIndonesian: [
      'Menyatakan sesuatu yang bertolak belakang dari kebenaran (dusta)',
      'Mendustakan dan menolak ayat-ayat Allah serta seruan para rasul',
      'Kemunafikan dan pengingkaran ikrar iman',
      'Kebatilan dan kepalsuan klaim sesat'
    ]
  },

  // 9. k-w-n (ك و ن) - Dominant Existential & Creation Root (1,390 Occurrences)
  'k-w-n': {
    titleIndo: 'Wujud / Keberadaan / Terjadi / Menjadi / Kepastian Ketetapan (Kāna / Kun)',
    coreMeaning:
      'Akar ك و ن melandasi gagasan penetapan wujud (al-kaun wal-wujūd), kepastian eksistensi suatu hal, peralihan keadaan (ash-shairūrah), dan kehendak penciptaan mutlak Allah melalui titah "Kun fa yakūn". Dalam bahasa Arab Al-Qur\'an, kata kerja kāna bukan sekadar predikat lampau biasa, melainkan sering berfungsi menetapkan sifat azali dan kekal bagi Allah swt.',
    usagePatterns: [
      {
        title: 'Penetapan Sifat Azali & Kekal Allah (Kāna Allāhu...)',
        description: 'Bentuk verba yang menetapkan bahwa sifat kesempurnaan Allah (Maha Pengampun, Maha Mengetahui, Maha Bijaksana) senantiasa ada dan tidak pernah terputus oleh dimensi waktu.',
        examples: ['وَكَانَ اللَّهُ غَفُورًا رَحِيمًا', 'وَكَانَ اللَّهُ عَلِيمًا حَكِيمًا', 'وَكَانَ اللَّهُ بِمَا تَعْمَلُونَ بَصِيرًا']
      },
      {
        title: 'Titah Penciptaan Mutlak (Kun fa Yakūn)',
        description: 'Bentuk fi\'il amr (perintah "Kun") yang menunjukkan keagungan kuasa Allah di mana segala sesuatu tercipta seketika tanpa perantara yang rumit saat Dia berkehendak.',
        examples: ['إِذَا قَضَىٰ أَمْرًا فَإِنَّمَا يَقُولُ لَهُ كُنْ فَيَكُونُ', 'إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَنْ يَقُولَ لَهُ كُنْ فَيَكُونُ']
      },
      {
        title: 'Peristiwa Masa Lampau & Kondisi Umat Terdahulu',
        description: 'Menjelaskan sejarah, watak, dan keadaan umat manusia serta akibat dari ketaatan atau keingkaran mereka.',
        examples: ['كَانُوا لَا يَتَنَاهَوْنَ عَنْ مُنْكَرٍ فَعَلُوهُ', 'كَانَ النَّاسُ أُمَّةً وَاحِدَةً']
      },
      {
        title: 'Nomina Tempat & Kedudukan (Makān / Makānah)',
        description: 'Bentuk isim makan yang menunjukkan tempat fisik, kedudukan terhormat, atau ruang keberadaan suatu entitas.',
        examples: ['مَكَانًا شَرْقِيًّا', 'مَكَانًا عَلِيًّا', 'اعْمَلُوا عَلَىٰ مَكَانَتِكُمْ']
      }
    ],
    contextualNote:
      'Imam Ar-Raghib Al-Ashfahani dalam Al-Mufradat menjelaskan bahwa "al-kaun" adalah pemunculan sesuatu dari ketiadaan menuju keberadaan nyata, sedangkan dalam kalam Ilahi kata "kāna" menegaskan hakikat yang pasti dan tak tergoyahkan.',
    meaningsIndonesian: [
      'Penetapan keberadaan dan hakikat sifat kekal Allah (kāna Allāh)',
      'Titah penciptaan seketika dengan kehendak mutlak (Kun fa yakūn)',
      'Kondisi, tabiat, dan rekam jejak perilaku manusia (kānū)',
      'Tempat, ruang eksistensi, dan kedudukan martabat (makān)'
    ]
  },

  // 10. A-l-h (ا ل ه) - The Supreme Divine Root (2,851 Occurrences)
  'A-l-h': {
    titleIndo: 'Ketuhanan / Sembahan yang Haq / Pengagungan & Cinta Mutlak (Allāh / Ilāh)',
    coreMeaning:
      'Akar ا ل ه melandasi gagasan ketundukan batin yang disertai rasa cinta mendalam (al-mahabbah), ketakjuban, dan pengagungan mutlak kepada Dzat Yang Maha Melindungi (Al-Ma\'lūh). Dari akar inilah lahir nama agung Allah (Lafzhul Jalālah) serta kata Ilāh (Tuhan sesembahan).',
    usagePatterns: [
      {
        title: 'Lafzhul Jalālah (Allāh)',
        description: 'Nama Dzat Yang Maha Suci, poros seluruh nama-nama indah (Asmaul Husna), yang mencakup segala sifat kesempurnaan mutlak.',
        examples: ['اللَّهِ', 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ', 'قُلْ هُوَ اللَّهُ أَحَدٌ']
      },
      {
        title: 'Konsep Ketuhanan & Pemurnian Tauhid (Ilāh)',
        description: 'Pernyataan bahwa tidak ada sesembahan yang berhak diibadahi dengan benar di alam semesta selain Dzat Yang Tunggal.',
        examples: ['وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ', 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ']
      }
    ],
    contextualNote:
      'Ibnu Katsir dan para ahli tafsir menegaskan bahwa nama Allah adalah al-ism al-a\'zham (nama paling agung) yang tidak boleh disematkan kepada selain Dzat Pencipta.',
    meaningsIndonesian: [
      'Dzat Yang Maha Suci, Esa, dan Satu-satunya yang berhak disembah (Allāh)',
      'Sesembahan yang ditaati dengan penuh cinta dan ketundukan batin (Ilāh)',
      'Pemurnian Tauhid dan penolakan tandingan sekutu bagi-Nya'
    ]
  },

  // 11. r-b-b (ر ب ب) - Divine Lordship & Nurturance (980 Occurrences)
  'r-b-b': {
    titleIndo: 'Pemeliharaan / Pendidik / Pemilik / Pengatur Semesta (Ar-Rabb)',
    coreMeaning:
      'Akar ر ب ب berkaitan dengan tindakan merawat, memelihara, mendidik, dan membimbing suatu ciptaan tahap demi tahap menuju kesempurnaan hakikinya (at-tarbiyah). Ar-Rabb adalah Penguasa yang mengurus seluruh kebutuhan hamba-Nya dengan penuh kasih dan hikmah.',
    usagePatterns: [
      {
        title: 'Rabb Semesta Alam (Rabbul-\'Ālamīn)',
        description: 'Gelar ketuhanan yang menegaskan bahwa seluruh galaksi, alam malaikat, jin, dan manusia berada di bawah asuhan dan pengawasan Allah.',
        examples: ['الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', 'قَالَ فِرْعَوْنُ وَمَا رَبُّ الْعَالَمِينَ']
      },
      {
        title: 'Munajat Hamba kepada Sang Pemelihara (Rabbanā / Rabbī)',
        description: 'Seruan doa yang paling sering dipanjatkan para nabi dan orang-orang saleh saat memohon ampunan, bimbingan, dan ketabahan.',
        examples: ['رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً', 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ']
      }
    ],
    contextualNote:
      'Ibnu Jarir Ath-Thabari menjelaskan bahwa Ar-Rabb adalah Dzat yang memiliki hak kepemilikan mutlak (Al-Malik), yang ditaati perintah-Nya (As-Sayyid), dan yang memperbaiki urusan makhluk-Nya (Al-Mushlih).',
    meaningsIndonesian: [
      'Pemilik, Pencipta, dan Penguasa mutlak seluruh alam (Ar-Rabb)',
      'Pendidik dan pembimbing ruhani manusia tahap demi tahap (At-Tarbiyah)',
      'Tumpuan permohonan doa dan pertolongan hidup (Rabbanā)'
    ]
  },

  // 12. E-m-l (ع م ل) - Action & Moral Praxis (360 Occurrences)
  'E-m-l': {
    titleIndo: 'Amal / Bekerja / Perbuatan Nyata / Konsekuensi Moral (\'Amila / \'Amal)',
    coreMeaning:
      'Akar ع م ل merujuk pada perbuatan yang dilakukan dengan niat, kesadaran akal, dan kehendak ikhtiar manusia. Dalam Al-Qur\'an, amal saleh hampir selalu digandengkan berdampingan dengan iman sebagai pembuktian nyata dari keyakinan batin.',
    usagePatterns: [
      {
        title: 'Amal Saleh Pasangan Keimanan',
        description: 'Tindakan kebajikan yang sesuai syariat dan ikhlas karena Allah sebagai prasyarat keselamatan akhirat.',
        examples: ['الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', 'فَمَنْ يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ']
      },
      {
        title: 'Balasan dan Rekam Jejak Perbuatan',
        description: 'Penegasan bahwa setiap manusia akan menuai hasil amalannya secara adil tanpa ada yang dizalimi.',
        examples: ['لِيَجْزِيَ الَّذِينَ أَسَاءُوا بِمَا عَمِلُوا', 'وَوُفِّيَتْ كُلُّ نَفْسٍ مَا عَمِلَتْ']
      }
    ],
    contextualNote:
      'Al-Qur\'an menegaskan konsep integritas amaliyah: iman tanpa amal adalah kekosongan, sedangkan amal tanpa iman laksana debu yang diterbangkan angin.',
    meaningsIndonesian: [
      'Bekerja, bertindak, dan berbuat dengan niat ikhtiar (\'Amila)',
      'Amal saleh kebajikan sebagai bukti keimanan sejati',
      'Catatan dan pertanggungjawaban amalan di mahkamah Ilahi'
    ]
  },

  // 13. d-x-l (د خ ل) - Entering, Commitment & Sanctuary (126 Occurrences)
  'd-x-l': {
    titleIndo: 'Masuk / Merasuk / Menembus / Memasuki Naungan (Dakhala / Udkhulū)',
    coreMeaning:
      'Akar د خ ل berkaitan dengan tindakan masuk, melangkah ke dalam suatu ruang, kondisi, atau ikatan perlindungan (lawan dari kharaja / keluar). Dalam Al-Qur\'an, akar ini melambangkan komitmen total memasuki kepatuhan (Islam kaffah) dan anugerah memasuki surga yang penuh keselamatan.',
    usagePatterns: [
      {
        title: 'Perintah Komitmen Menyeluruh (Udkhulū fīs-Silmi)',
        description: 'Seruan kepada orang beriman untuk memasuki kedamaian Islam secara menyeluruh tanpa setengah hati.',
        examples: ['يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً']
      },
      {
        title: 'Memasuki Negeri Damai & Kenikmatan Surga (Jannāt)',
        description: 'Undangan kehormatan bagi jiwa yang tenang untuk melangkah masuk ke dalam surga Allah.',
        examples: ['ادْخُلُوهَا بِسَلَامٍ ذَٰلِكَ يَوْمُ الْخُلُودِ', 'فَادْخُلِي فِي عِبَادِي وَادْخُلِي جَنَّتِي']
      },
      {
        title: 'Ketaatan Berkelompok ke dalam Agama Allah',
        description: 'Menggambarkan fenomena hijrah dan masuknya manusia berbondong-bondong ke dalam naungan hidayah.',
        examples: ['وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا']
      }
    ],
    contextualNote:
      'Lisan al-\'Arab menjelaskan bahwa "ad-dukhūl" adalah penembusan batas luar menuju ruang inti yang dilindungi, menggambarkan keberserahan utuh seorang hamba.',
    meaningsIndonesian: [
      'Masuk dan menembus ke dalam suatu tempat atau ruang terlindung (Dakhala)',
      'Komitmen utuh memasuki ajaran Islam secara kafah (Udkhulū)',
      'Anugerah memasuki surga keselamatan abadi di akhirat'
    ]
  },

  // 20. $-y-A (ش ي ا) - Kehendak Mutlak & Segala Sesuatu (519 occurrences)
  '$-y-A': {
    titleIndo: 'Kehendak Mutlak & Segala Sesuatu (Masyi\'ah & Syai\')',
    coreMeaning: 'Akar ش ي ا berpusat pada konsep kehendak mutlak ilahi (masyi\'ah) yang mendahului dan melandasi terciptanya segala wujud. Dari akar ini lahir kata kerja شَاءَ (berkehendak) yang menegaskan kedaulatan mutlak ketetapan Allah, serta kata benda شَىْء (sesuatu) yang merujuk pada segala entitas yang diadakan dan berada di bawah kekuasaan-Nya.',
    usagePatterns: [
      {
        title: 'Kehendak Mutlak Allah (Syaa\'a / Yasyaa\'u)',
        description: 'Bentuk verba yang menegaskan bahwa segala peristiwa di alam semesta hanya terwujud atas izin dan kehendak Allah.',
        examples: ['إِن شَآءَ ٱللَّهُ', 'يَشَآءُ مَن يَشَآءُ']
      },
      {
        title: 'Entitas Ciptaan & Segala Hal (Syai\')',
        description: 'Bentuk nomina yang mencakup seluruh wujud ciptaan yang berada dalam pemeliharaan dan pengawasan ilahi.',
        examples: ['عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ', 'خَالِقُ كُلِّ شَىْءٍۢ']
      }
    ],
    contextualNote: 'Ibnu Faris dalam Maqayis al-Lughah menjelaskan bahwa asal kata ini melambangkan penentuan tekad dan pewujudan wujud dari ketiadaan.',
    meaningsIndonesian: [
      'Kehendak mutlak ilahi dalam menentukan dan menetapkan peristiwa (Masyi\'ah)',
      'Segala sesuatu ciptaan dan entitas yang terwujud di alam semesta (Syai\')',
      'Kepastian berlakunya takdir dan ketetapan Allah'
    ]
  },

  // 21. A-t-y (ا ت ي) - Datang & Menganugerahkan (549 occurrences)
  'A-t-y': {
    titleIndo: 'Datang, Tiba, dan Menganugerahkan (Ityān & Ītā\')',
    coreMeaning: 'Akar ا ت ي melandasi gagasan kedatangan peristiwa dengan mudah dan pasti, serta pemberian atau penganugerahan karunia. Digunakan untuk menegaskan datangnya ketetapan Allah yang tak dapat ditolak, serta anugerah wahyu, hikmah, dan rezeki kepada hamba-hamba-Nya.',
    usagePatterns: [
      {
        title: 'Kedatangan & Terjadinya Peristiwa (Atā / Ya\'tī)',
        description: 'Kata kerja Form I yang menggambarkan tibanya perintah Allah, hari kiamat, atau kebenaran.',
        examples: ['أَتَىٰٓ أَمْرُ ٱللَّهِ', 'يَأْتِيَهُمُ ٱللَّهُ']
      },
      {
        title: 'Memberi & Menganugerahkan (Ātā / Yu\'tī)',
        description: 'Kata kerja Form IV yang digunakan khusus untuk anugerah wahyu, hikmah, kekuasaan, dan kewajiban menunaikan zakat.',
        examples: ['وَءَاتُوا۟ ٱلزَّكَوٰةَ', 'ءَاتَيْنَـٰهُمُ ٱلْكِتَـٰبَ']
      }
    ],
    contextualNote: 'Al-Mufradat mencatat bahwa "Al-Ityān" adalah kedatangan yang berlangsung secara wajar dan pasti terlaksana sesuai ketetapan waktu.',
    meaningsIndonesian: [
      'Kedatangan peristiwa, wahyu, dan ketetapan ilahi yang pasti tiba (Atā)',
      'Pemberian karunia, hikmah, dan kewajiban zakat (Ātā)',
      'Kedatangan manusia menghadap Allah pada hari hisab'
    ]
  },

  // 22. r-s-l (ر س ل) - Mengutus & Risalah Kenabian (513 occurrences)
  'r-s-l': {
    titleIndo: 'Mengutus, Risalah, dan Utusan (Irsāl & Rasūl)',
    coreMeaning: 'Akar ر س ل melambangkan tindakan melepaskan, mengalirkan dengan terarah, dan mengutus pembawa amanah. Dalam Al-Qur\'an, akar ini menjadi landasan konsep risalah kenabian (Rasul), pengutusan malaikat pembawa wahyu, hingga pengiriman angin pembawa rahmat hujan.',
    usagePatterns: [
      {
        title: 'Mengutus Para Nabi & Malaikat (Arsala)',
        description: 'Verba Form IV untuk pengutusan rasul pembawa kabar gembira dan peringatan kepada umat manusia.',
        examples: ['إِنَّآ أَرْسَلْنَـٰكَ', 'أَرْسَلْنَا رُسُلَنَا']
      },
      {
        title: 'Utusan Allah / Rasul (Rasūl / Rusul)',
        description: 'Nomina yang merujuk pada manusia pilihan penyampai wahyu dan risalah tauhid.',
        examples: ['مُّحَمَّدٌۭ رَّسُولُ ٱللَّهِ', 'رُسُلًا مُّبَشِّرِينَ']
      }
    ],
    meaningsIndonesian: [
      'Pengutusan rasul dan malaikat pembawa wahyu dan amanah (Irsāl)',
      'Sosok utusan pembimbing umat menuju kebenaran (Rasūl)',
      'Pengiriman angin dan rahmat pembawa keberkahan hujan'
    ]
  },

  // 23. A-r-D (ا ر ض) - Bumi & Hamparan Kehidupan (461 occurrences)
  'A-r-D': {
    titleIndo: 'Bumi, Hamparan Kehidupan, dan Tempat Berpijak (Ardh)',
    coreMeaning: 'Akar ا ر ض merujuk pada kerendahan, ketenangan tempat berpijak, dan hamparan alam semesta (Al-Ardh) yang disiapkan Allah bagi kelangsungan hidup makhluk. Menggambarkan bumi sebagai tempat bernaung, bercocok tanam, dan arena pembuktian amal kebajikan.',
    usagePatterns: [
      {
        title: 'Bumi Sebagai Hamparan Ciptaan (Al-Ardh)',
        description: 'Sering dipasangkan dengan langit (as-samāwāt) untuk menegaskan cakupan utuh kekuasaan Allah.',
        examples: ['ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ', 'فِى ٱلْأَرْضِ خَلِيفَةًۭ']
      }
    ],
    meaningsIndonesian: [
      'Hamparan bumi tempat tinggal dan beribadah manusia',
      'Pasangan kosmis langit dan bumi ciptaan Allah',
      'Negeri atau wilayah kediaman suatu kaum'
    ]
  },

  // 24. y-w-m (ي و م) - Hari, Waktu & Pembalasan (405 occurrences)
  'y-w-m': {
    titleIndo: 'Hari, Babak Waktu, dan Hari Pembalasan (Yaum)',
    coreMeaning: 'Akar ي و م berkaitan dengan perputaran masa, terbitnya terang siang, dan babak-babak waktu. Penggunaan utamanya dalam Al-Qur\'an menegaskan kepastian Yaumul Qiyamah (Hari Kiamat), Yaumud Din (Hari Pembalasan), dan hari-hari penentu sejarah umat manusia.',
    usagePatterns: [
      {
        title: 'Hari Kiamat & Hari Pembalasan',
        description: 'Penegasan saat seluruh amal manusia diperlihatkan dan diadili secara adil.',
        examples: ['يَوْمِ ٱلدِّينِ', 'يَوْمَ ٱلْقِيَـٰمَةِ', 'يَوْمَئِذٍۢ']
      }
    ],
    meaningsIndonesian: [
      'Babak waktu, hari-hari dalam penciptaan dan sejarah (Yaum)',
      'Hari Kiamat dan Hari Pembalasan hakiki di akhirat',
      'Momen penentuan hisab amal seluruh manusia'
    ]
  },

  // 25. A-y-y (ا ي ي) - Tanda Kekuasaan & Ayat Wahyu (382 occurrences)
  'A-y-y': {
    titleIndo: 'Tanda Kekuasaan, Mukjizat, dan Ayat Wahyu (Āyah)',
    coreMeaning: 'Akar ا ي ي melambangkan tanda penunjuk arah yang nyata, bukti kebenaran yang tak terbantahkan, dan mukjizat kenabian. Menghubungkan fenomena alam semesta (ayat kauniyyah) dengan firman wahyu (ayat qauliyyah) sebagai penuntun tauhid.',
    usagePatterns: [
      {
        title: 'Tanda Kekuasaan di Alam Semesta',
        description: 'Fenomena pergantian siang-malam, penciptaan manusia, dan peredaran benda langit.',
        examples: ['وَمِنْ ءَايَـٰتِهِۦ', 'ءَايَـٰتٍۢ لِّقَوْمٍۢ يَتَفَكَّرُونَ']
      },
      {
        title: 'Kalimat-Kalimat Firman Al-Qur\'an',
        description: 'Satuan wahyu yang diturunkan untuk menjadi petunjuk hidup.',
        examples: ['ءَايَـٰتُ ٱلْكِتَـٰبِ', 'تِلْكَ ءَايَـٰتُ ٱللَّهِ']
      }
    ],
    meaningsIndonesian: [
      'Tanda-tanda kebesaran dan kekuasaan Allah di alam semesta',
      'Rangkaian kalimat firman wahyu Al-Qur\'an (Āyah)',
      'Mukjizat pembuktian kebenaran risalah kenabian'
    ]
  },

  // 26. k-l-l (ك ل ل) - Menyeluruh & Seluruh Ciptaan (377 occurrences)
  'k-l-l': {
    titleIndo: 'Menyeluruh, Melingkupi, dan Seluruh Entitas (Kull)',
    coreMeaning: 'Akar ك ل ل berkaitan dengan gagasan melingkupi secara sempurna, mahkota yang mengelilingi kepala (iklīl), dan keutuhan. Bentuk كُلّ (kull) menegaskan universalitas kekuasaan, pengetahuan, dan pemeliharaan Allah yang meliputi segala sesuatu tanpa terkecuali.',
    usagePatterns: [
      {
        title: 'Seluruh / Setiap Ciptaan (Kull)',
        description: 'Menegaskan bahwa tiada satu makhluk pun yang luput dari ketetapan ilahi.',
        examples: ['كُلُّ نَفْسٍۢ ذَآئِقَةُ ٱلْمَوْتِ', 'عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ']
      }
    ],
    meaningsIndonesian: [
      'Menyeluruh, setiap, dan segenap entitas ciptaan (Kull)',
      'Keutuhan cakupan kekuasaan dan rahmat Allah',
      'Ketetapan yang berlaku mutlak bagi seluruh jiwa'
    ]
  },

  // 27. E-*-b (ع ذ ب) - Pencegahan Dari Kelezatan & Azab (373 occurrences)
  'E-*-b': {
    titleIndo: 'Pencegahan Dari Kenikmatan, Sanksi, dan Azab (Adzāb)',
    coreMeaning: 'Akar ع ذ ب memiliki makna dasar pencegahan dan terhalangnya rasa manis kelezatan. Dari sanalah lahir konsep Azab (\'Adzāb) sebagai balasan hukum yang memutus kenikmatan bagi penentang kebenaran, menegaskan keadilan hisab ilahi.',
    usagePatterns: [
      {
        title: 'Sanksi Keadilan Ilahi (\'Adzāb)',
        description: 'Peringatan keras bagi kekufuran, kezaliman, dan pengingkaran risalah.',
        examples: ['عَذَابٌ أَلِيمٌۭ', 'عَذَابَ ٱلْقَبْرِ', 'عَذَّبْنَـٰهُمْ']
      }
    ],
    meaningsIndonesian: [
      'Pembalasan dan sanksi adil atas kezaliman (\'Adzāb)',
      'Peringatan agar manusia menjauhi perbuatan dosa',
      'Pemberian rasa manis (air tawar / \'adzb) sebagai rahmat pembanding'
    ]
  },

  // 28. E-l-w / E-l-y (ع ل ي) - Ketinggian, Keluhuran & Keagungan (215 occurrences)
  'E-l-y': {
    titleIndo: 'Ketinggian Martabat, Keluhuran Ilahi, dan Posisi di Atas (\'Uluww)',
    coreMeaning: 'Akar ع ل ي melambangkan ketinggian mutlak, kemuliaan tanpa tanding, dan posisi berada di atas. Menjadi landasan nama mulia Allah Al-\'Aliyy (Yang Maha Luhur), sifat ketinggian derajat kaum berilmu dan beriman, serta preposisi \'alā yang menunjukkan keunggulan posisi dan kepastian tanggung jawab.',
    usagePatterns: [
      {
        title: 'Kemaha-Luhuran Allah (Al-\'Aliyy / Al-A\'lā)',
        description: 'Nama dan sifat mulia Allah yang menegaskan keagungan-Nya melampaui seluruh ciptaan.',
        examples: ['وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ', 'سَبِّحِ ٱسْمَ رَبِّكَ ٱلْأَعْلَى']
      },
      {
        title: 'Tinggi Derajat & Keunggulan (\'Uluwwan / \'Āliyah)',
        description: 'Penggunaan untuk menggambarkan kemuliaan tempat di surga atau celaan bagi kesombongan tiran di muka bumi.',
        examples: ['فِى جَنَّةٍ عَالِيَةٍۢ', 'إِنَّ فِرْعَوْنَ عَلَا فِى ٱلْأَرْضِ']
      }
    ],
    meaningsIndonesian: [
      'Keluhuran mutlak dan ketinggian zat serta sifat Allah (Al-\'Aliyy)',
      'Ketinggian derajat surga dan orang-orang berilmu',
      'Peringatan terhadap kesombongan dan keangkuhan zalim di muka bumi'
    ]
  },
  'E-l-w': {
    titleIndo: 'Ketinggian Martabat, Keluhuran Ilahi, dan Posisi di Atas (\'Uluww)',
    coreMeaning: 'Akar ع ل و melambangkan ketinggian mutlak, kemuliaan tanpa tanding, dan posisi berada di atas. Menjadi landasan nama mulia Allah Al-\'Aliyy (Yang Maha Luhur), sifat ketinggian derajat kaum beriman, serta preposisi \'alā.',
    usagePatterns: [
      {
        title: 'Kemaha-Luhuran Allah (Al-\'Aliyy / Al-A\'lā)',
        description: 'Penegasan keagungan Allah yang Maha Tinggi atas seluruh alam semesta.',
        examples: ['وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ', 'سَبِّحِ ٱسْمَ رَبِّكَ ٱلْأَعْلَى']
      }
    ],
    meaningsIndonesian: [
      'Keluhuran mutlak Allah Sang Maha Tinggi',
      'Ketinggian derajat tempat kembali di akhirat',
      'Penolakan terhadap keangkuhan dan kesombongan hidup'
    ]
  },

  // 29. H-q-q (ح ق ق) - Kebenaran Hakiki & Kepastian Hukum (287 occurrences)
  'H-q-q': {
    titleIndo: 'Kebenaran Mutlak, Kepastian Hakiki, dan Keadilan (Haqq)',
    coreMeaning: 'Akar ح ق ق menunjukkan ketetapan yang tak terbantahkan, kecocokan sempurna dengan realitas hakiki, dan kepastian yang wajib dipenuhi. Al-Haqq adalah salah satu nama mulia Allah yang menegaskan bahwa seluruh firman, janji, dan ciptaan-Nya adalah kebenaran sejati.',
    usagePatterns: [
      {
        title: 'Kebenaran Wahyu & Kepastian Janji (Al-Haqq)',
        description: 'Penegasan bahwa Al-Qur\'an, hari kiamat, dan janji Allah adalah kenyataan mutlak.',
        examples: ['قَوْلُهُ ٱلْحَقُّ', 'إِنَّ وَعْدَ ٱللَّهِ حَقٌّۭ']
      }
    ],
    meaningsIndonesian: [
      'Kebenaran mutlak yang melandasi penciptaan dan syariat (Haqq)',
      'Kepastian berlakunya ketetapan dan azab bagi orang ingkar (Haqqat)',
      'Hak-hak yang wajib ditunaikan dalam keadilan antarsesama'
    ]
  },

  // 30. *-k-r (ذ ك ر) - Mengingat, Menyebut, dan Peringatan (292 occurrences)
  '*-k-r': {
    titleIndo: 'Mengingat, Menuturkan, dan Pengingat Jiwa (Dzikr)',
    coreMeaning: 'Akar ذ ك ر melambangkan kehadiran ingatan di dalam kalbu, penuturan kalimat pujian lewat lisan, serta ketinggian martabat kemuliaan. Al-Qur\'an sendiri dinamai Adz-Dzikr karena senantiasa menyadarkan manusia dari kelalaian duniawi.',
    usagePatterns: [
      {
        title: 'Zikir dan Mengingat Allah (Dzakara)',
        description: 'Perintah mengingat Allah dalam segala keadaan sebagai sumber ketenangan batin.',
        examples: ['أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ', 'فَٱذْكُرُونِىٓ أَذْكُرْكُمْ']
      },
      {
        title: 'Al-Qur\'an Sebagai Pengingat (Adz-Dzikr)',
        description: 'Peringatan abadi yang dijaga keasliannya untuk membimbing umat manusia.',
        examples: ['إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ', 'وَهَـٰذَا ذِكْرٌۭ مُّبَارَكٌ']
      }
    ],
    meaningsIndonesian: [
      'Mengingat Allah dengan lisan dan ketulusan kalbu (Dzikrullah)',
      'Peringatan dan bimbingan wahyu Al-Qur\'an (Adz-Dzikr)',
      'Kemuliaan dan reputasi terpuji bagi orang-orang beriman'
    ]
  },

  // 31. E-t-w (ع ت و) - Kedurhakaan Ekstrem, Kebangkangan, dan Kelemahan Usia Renta (10 occurrences)
  'E-t-w': {
    titleIndo: 'Melampaui Batas / Kedurhakaan Ekstrem / Kesombongan (Etw)',
    coreMeaning: 'Akar ع ت و berpusat pada makna leksikal melampaui batas kewajaran, kedurhakaan ekstrem, dan kesombongan yang membangkang terhadap perintah Allah (عَتَوْا عَنْ أَمْرِ رَبِّهِمْ). Di samping itu, akar ini secara balaghah melukiskan dahsyatnya angin kencang yang mengamuk (عَاتِيَةٍ) serta kerapuhan fisik manusia yang telah mencapai usia teramat senja/renta (عِتِيًّا).',
    usagePatterns: [
      {
        title: 'Kebangkangan dan Kedurhakaan Melampaui Batas (Eataw / Utuw)',
        description: 'Digunakan untuk mencela sikap kaum durhaka yang menentang peringatan para rasul secara angkuh dan melampaui batas kezaliman.',
        examples: ['فَعَقَرُوا۟ ٱلنَّاقَةَ وَعَتَوْا۟ عَنْ أَمْرِ رَبِّهِمْ', 'بَل لَّجُّوا۟ فِى عُتُوٍّۢ وَنُفُورٍ']
      },
      {
        title: 'Kedahsyatan Angin yang Mengamuk (Reeyah \'Atiyah)',
        description: 'Bentuk sifat (fa\'ilah) untuk menggambarkan angin topan dingin yang bertiup kencang membinasakan kaum \'Ad.',
        examples: ['بِرِيحٍۢ صَرْصَرٍ عَاتِيَةٍۢ']
      },
      {
        title: 'Kelemahan dan Kerapuhan Usia Senja (\'Itiyya)',
        description: 'Ungkapan Nabi Zakaria \'alaihissalam ketika bermunajat memohon keturunan saat fisiknya telah mencapai usia sangat tua dan rapuh.',
        examples: ['وَقَدْ بَلَغْتُ مِنَ ٱلْكِبَرِ عِتِيًّۭا']
      }
    ],
    meaningsIndonesian: [
      'Kedurhakaan dan kesombongan yang melampaui batas (Utuw)',
      'Tindakan membangkang terhadap perintah Tuhan (Eataw)',
      'Kedahsyatan amukan angin kencang (\'Atiyah)',
      'Kerapuhan fisik di puncak usia renta (\'Itiyya)'
    ]
  }
};

/**
 * Returns a rich, context-aware semantic profile for key Quranic roots,
 * or intelligently synthesizes a dignified profile from real Quranic derivatives.
 * Strictly ZERO robotic frequency counts, zero filler importance phrases, and zero fake corpus tags.
 */
export function getRootSemanticProfile(rootBw: string, rootArabic?: string): RootSemanticProfile | null {
  if (!rootBw) return null;

  const cleanBw = rootBw.trim();
  const normalizedId = cleanBw.replace(/-/g, '');
  const dashedId = cleanBw.includes('-') ? cleanBw : cleanBw.split('').join('-');

  if (CURATED_ROOT_SEMANTICS[cleanBw]) return CURATED_ROOT_SEMANTICS[cleanBw];
  if (CURATED_ROOT_SEMANTICS[dashedId]) return CURATED_ROOT_SEMANTICS[dashedId];

  // Search case-insensitively across curated keys
  for (const [k, v] of Object.entries(CURATED_ROOT_SEMANTICS)) {
    if (k.replace(/-/g, '').toLowerCase() === normalizedId.toLowerCase()) {
      return v;
    }
  }

  // Intelligent, dignified synthesis for uncurated roots using actual Quranic derivatives
  const dbRoot = ROOT_DATABASE.find(r => 
    r.id === cleanBw || 
    r.id === dashedId || 
    r.rootLatin === cleanBw ||
    r.id.replace(/-/g, '').toLowerCase() === normalizedId.toLowerCase() ||
    (rootArabic && r.rootArabic.replace(/\s+/g, '') === rootArabic.replace(/\s+/g, ''))
  );

  if (dbRoot) {
    const rawMeaning = dbRoot.coreMeaning || '';
    if (rawMeaning && !rawMeaning.includes('memiliki peranan penting') && !rawMeaning.startsWith('Akar kata ')) {
      return {
        titleIndo: dbRoot.titleIndo && !dbRoot.titleIndo.startsWith('Konsep') ? dbRoot.titleIndo : `Akar ${dbRoot.rootArabic}`,
        coreMeaning: rawMeaning,
        usagePatterns: dbRoot.usagePatterns || [],
        meaningsIndonesian: dbRoot.meaningsIndonesian || []
      };
    }

    const sampleVerbs = (dbRoot.verbs || []).filter(v => v.arabic && !v.arabic.includes('(')).slice(0, 2).map(v => v.arabic);
    const sampleNouns = (dbRoot.nouns || []).filter(n => n.arabic && !n.arabic.includes('(')).slice(0, 2).map(n => n.arabic);

    let synthesized = '';
    if (sampleVerbs.length > 0 && sampleNouns.length > 0) {
      synthesized = `Akar kata ${dbRoot.rootArabic} melandasi pembentukan ragam kata Al-Qur'an seperti verba ${sampleVerbs.join(', ')} serta nomina ${sampleNouns.join(', ')}, yang masing-masing mengemban nuansa makna leksikal definitif sesuai wazan sharaf dan konteks ayat penuturannya.`;
    } else if (sampleVerbs.length > 0) {
      synthesized = `Akar kata ${dbRoot.rootArabic} hadir dalam Al-Qur'an melalui ragam konjugasi kata kerja seperti ${sampleVerbs.join(', ')} yang menggambarkan dinamika tindakan, keadilan, dan ketetapan ilahi di dalam ayat.`;
    } else if (sampleNouns.length > 0) {
      synthesized = `Akar kata ${dbRoot.rootArabic} termanifestasi dalam Al-Qur'an melalui nomina substantif seperti ${sampleNouns.join(', ')} yang menjadi pilar leksikal untuk menegaskan hakikat pesan yang diuraikan ayat.`;
    } else {
      synthesized = `Akar kata ${dbRoot.rootArabic} merupakan pilar leksikal bahasa Arab klasik yang memperkaya keindahan sastra dan kedalaman pesan wahyu dalam Al-Qur'an.`;
    }

    const cleanTitle = dbRoot.titleIndo && !dbRoot.titleIndo.startsWith('Konsep')
      ? dbRoot.titleIndo.replace(/^Akar\s+[^\(]+\(/, '').replace(/\)$/, '').trim()
      : (sampleNouns[0] || sampleVerbs[0] || `Akar ${dbRoot.rootArabic}`);

    return {
      titleIndo: cleanTitle,
      coreMeaning: synthesized,
      usagePatterns: dbRoot.usagePatterns || [],
      meaningsIndonesian: [cleanTitle]
    };
  }

  return null;
}
