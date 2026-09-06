/**
 * Comprehensive Quranic Particles (Harf / Kata Tugas) Dictionary
 * 
 * Provides authentic, rich classical Nahwu (Arabic syntax) definitions,
 * syntactic rules (mabni), and contextual meanings in Indonesian for all
 * major particles and prepositions in the Al-Qur'an.
 * 
 * Invariant: Particles are indeclinable (mabni) without tri-consonantal roots.
 */

import { stripArabicHarakat } from '../search/root-search';

export interface QuranicParticleInfo {
  arabic: string;
  cleanArabic: string;
  transliteration: string;
  particleCategory: 'Harf Jarr' | 'Harf Athaf' | 'Harf Taukid' | 'Harf Nafi' | 'Harf Nahyi' | 'Harf Syarat' | 'Harf Istitsna' | 'Harf Istifham' | 'Harf Nida' | 'Harf Jawaban' | 'Harf Rad\'in' | 'Harf Mashdariyyah' | 'Harf Tanfis' | 'Kata Tugas (Harf)';
  grammaticalRole: string;
  primaryMeaning: string;
  meanings: string[];
  syntaxExplanation: string;
  quranicNuances: string[];
}

export const QURANIC_PARTICLES_DICTIONARY: Record<string, QuranicParticleInfo> = {
  // Preposisi / Harf Jarr
  'في': {
    arabic: 'فِي',
    cleanArabic: 'في',
    transliteration: 'fī',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr azh-Zharfiyyah Mabni 'alas-Sukun",
    primaryMeaning: 'Di dalam / Pada / Mengenai (Wadah Waktu & Tempat)',
    meanings: [
      'Azh-Zharfiyyah al-Makāniyyah: Menunjukkan wadah tempat kejadian (di dalam ruang/lingkungan)',
      'Azh-Zharfiyyah az-Zamāniyyah: Menunjukkan waktu terjadinya peristiwa (pada kurun waktu tertentu)',
      'As-Sababiyyah: Menunjukkan sebab terjadinya suatu balasan atau akibat'
    ],
    syntaxExplanation: "Merupakan Harf Jarr yang berstatus Mabni 'alas-sukun (harakat akhirnya tetap sukun), berfungsi memajrurkan isim setelahnya (isim majrur). Tidak memiliki akar kata trikonsonantal.",
    quranicNuances: [
      'Digunakan untuk menggambarkan keberadaan di dalam surga atau neraka (misal: "fīhâ khâlidûn")',
      'Digunakan untuk merujuk pada isi hati dan rahasia jiwa (misal: "fī qulūbihim maradun")'
    ]
  },
  'من': {
    arabic: 'مِنْ',
    cleanArabic: 'من',
    transliteration: 'min',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr Mabni 'alas-Sukun",
    primaryMeaning: 'Dari / Sebagian dari / Termasuk (Permulaan Titik Tolak)',
    meanings: [
      'Ibtidā\' al-Ghāyah: Menunjukkan titik awal batas tempat, waktu, atau peristiwa (dari)',
      'At-Tab\'īdh: Menunjukkan makna sebagian atau pecahan dari suatu kelompok (sebagian dari)',
      'Bayān al-Jins: Menjelaskan jenis atau bahan asal suatu benda (yang berupa/terbuat dari)'
    ],
    syntaxExplanation: "Harf Jarr yang berstatus Mabni 'alas-sukun. Ketika bertemu huruf sukun berikutnya (washal), harakatnya berubah menjadi fathah (mina) untuk kelancaran pelafalan.",
    quranicNuances: [
      'Digunakan untuk menyatakan asal penciptaan manusia (misal: "min thīn", "min nutfah")',
      'Menyatakan penurunan wahyu dari sisi Allah (misal: "tanzīlum min rabbil \'ālamīn")'
    ]
  },
  'الى': {
    arabic: 'إِلَىٰ',
    cleanArabic: 'الى',
    transliteration: 'ilā',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr Intihā' al-Ghāyah Mabni 'alas-Sukun",
    primaryMeaning: 'Ke / Kepada / Hingga (Batas Akhir Tujuan)',
    meanings: [
      'Intihā\' al-Ghāyah al-Makāniyyah: Menunjukkan batas akhir tujuan perjalanan atau gerakan (ke tempat tujuan)',
      'Intihā\' al-Ghāyah az-Zamāniyyah: Menunjukkan batas akhir masa atau waktu (hingga waktu tiba)',
      'Al-Ma\'iyyah: Bermakna "bersama / beserta" dalam susunan kalimat tertentu'
    ],
    syntaxExplanation: "Harf Jarr yang berstatus Mabni 'alas-sukun (di atas alif layyinah). Memajrurkan isim setelahnya.",
    quranicNuances: [
      'Digunakan untuk menyatakan tempat kembali mutlak seluruh makhluk (misal: "wa ilayhir-rojī\'un")',
      'Menyatakan seruan menuju jalan Allah (misal: "ud\'u ilā sabīli rabbik")'
    ]
  },
  'على': {
    arabic: 'عَلَىٰ',
    cleanArabic: 'على',
    transliteration: '\'alā',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr al-Isti'lā' Mabni 'alas-Sukun",
    primaryMeaning: 'Di atas / Atas / Terhadap / Wajib bagi (Keunggulan & Tanggungan)',
    meanings: [
      'Al-Isti\'lā\' al-Haqīqī: Menunjukkan posisi fisik berada di atas sesuatu',
      'Al-Isti\'lā\' al-Ma\'nawī: Menunjukkan kekuasaan, keunggulan, atau kewajiban tanggungan (atas / wajib bagi)',
      'Al-Mushāhabah: Bermakna "meskipun / bersamaan dengan" (misal: \'alā hubbihī = meskipun menyukainya)'
    ],
    syntaxExplanation: "Harf Jarr yang berstatus Mabni 'alas-sukun. Memajrurkan isim setelahnya.",
    quranicNuances: [
      'Menyatakan ketinggian kekuasaan Allah di atas singgasana Arsy (misal: "\'alas-samāwāti wal-ardh", "istawā \'alal-\'arsy")',
      'Menyatakan kewajiban syariat atas kaum mukminin (misal: "kutiba \'alaikumush-shiyām")'
    ]
  },
  'عن': {
    arabic: 'عَنْ',
    cleanArabic: 'عن',
    transliteration: '\'an',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr al-Mujāwazah Mabni 'alas-Sukun",
    primaryMeaning: 'Dari / Menjauh dari / Tentang / Perihal',
    meanings: [
      'Al-Mujāwazah wal-Ibti\'ād: Menunjukkan tindakan melampaui, menjauhi, atau meninggalkan sesuatu',
      'Al-Badal: Menunjukkan penggantian peran (mewakili / menggantikan posisi)',
      'Al-Ikhbār: Menunjukkan perihal atau topik yang dibicarakan (tentang / mengenai)'
    ],
    syntaxExplanation: "Harf Jarr Mabni 'alas-sukun. Ketika disambung ke huruf mati setelahnya, sukun berubah menjadi kasrah ('ani).",
    quranicNuances: [
      'Digunakan untuk larangan berpaling dari petunjuk (misal: "\'an dzikrī")',
      'Digunakan untuk pertanyaan para sahabat tentang urusan wahyu (misal: "yas\'alūnaka \'an...")'
    ]
  },
  'حتى': {
    arabic: 'حَتَّىٰ',
    cleanArabic: 'حتى',
    transliteration: 'ḥattā',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Ghāyah wa Jarr / Harf Ibtidā'",
    primaryMeaning: 'Hingga / Sampai / Sehingga',
    meanings: [
      'Intihā\' al-Ghāyah: Menunjukkan puncak akhir peristiwa atau tenggat waktu',
      'At-Ta\'līl: Bermakna "supaya / agar" ketika masuk ke fi\'il mudhari\' yang dinashabkan dengan an mudhmarah',
      'Harf Ibtidā\': Mengawali anak kalimat baru'
    ],
    syntaxExplanation: "Bisa berfungsi sebagai Harf Jarr yang memajrurkan isim, atau partikel nashab yang menashabkan fi'il mudhari' melalui an tersembunyi.",
    quranicNuances: [
      'Digunakan pada waktu kedamaian malam Lailatul Qadar: "Salāmun hiya hattā mathla\'il fajr" (QS. Al-Qadr: 5)'
    ]
  },
  'ب': {
    arabic: 'بِ',
    cleanArabic: 'ب',
    transliteration: 'bi',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr Mabni 'alal-Kasr",
    primaryMeaning: 'Dengan / Demi / Karena / Bersama (Instrumen & Keterikatan)',
    meanings: [
      'Al-Ilshāq: Menunjukkan keterikatan kuat dan perlekatan secara hakiki maupun maknawi',
      'Al-Isti\'ānah: Menunjukkan instrumen, sarana, atau media yang digunakan (dengan perantara)',
      'As-Sababiyyah: Menunjukkan alasan atau penyebab (disebabkan oleh)',
      'Al-Qasam: Digunakan sebagai huruf sumpah (demi)'
    ],
    syntaxExplanation: "Harf Jarr yang terikat erat di awal kata, berstatus Mabni 'alal-kasr (kasrah tetap). Memajrurkan isim setelahnya.",
    quranicNuances: [
      'Membuka surah-surah Al-Qur\'an dalam Basmalah: "Bismillāh" (Dengan nama Allah)',
      'Menyatakan sebab datangnya azab atau pahala: "bimā kānū yakdzibūn" (disebabkan kedustaan mereka)'
    ]
  },
  'ل': {
    arabic: 'لِ',
    cleanArabic: 'ل',
    transliteration: 'li',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr Mabni 'alal-Kasr / Lam Ta'līl",
    primaryMeaning: 'Untuk / Milik / Bagi / Karena / Demi',
    meanings: [
      'Al-Milkiyyah: Menunjukkan kepemilikan mutlak (milik Allah)',
      'Al-Ikhtishāsh: Menunjukkan kekhususan peruntukan (khusus bagi)',
      'At-Ta\'līl: Menjelaskan alasan atau maksud tujuan suatu tindakan (agar / supaya / karena)'
    ],
    syntaxExplanation: "Harf Jarr berharakat kasrah (li), namun berharakat fathah (la) jika bersambung dengan kata ganti dhomir (lahu, lahum, lakum).",
    quranicNuances: [
      'Menegaskan kepemilikan alam semesta bagi Allah: "Lillāhi mā fis-samāwāti wal-ardh"'
    ]
  },
  'ك': {
    arabic: 'كَ',
    cleanArabic: 'ك',
    transliteration: 'ka',
    particleCategory: 'Harf Jarr',
    grammaticalRole: "Harf Jarr at-Tasybīh Mabni 'alal-Fath",
    primaryMeaning: 'Seperti / Laksana / Seumpama (Penyerupaan)',
    meanings: [
      'At-Tasybīh: Menyerupakan suatu hal dengan hal lain dalam suatu sifat atau keadaan',
      'At-Ta\'kīd: Berfungsi menguatkan penegasan peniadaan keserupaan (seperti pada "laisa kamitslihī syai\'")'
    ],
    syntaxExplanation: "Harf Jarr yang berstatus Mabni 'alal-fath (fathah tetap). Selalu memajrurkan isim setelahnya.",
    quranicNuances: [
      'Digunakan untuk membuat perumpamaan balaghah dalam Al-Qur\'an (misal: "kamatstali...", "ka-ashfin ma\'kūl")'
    ]
  },

  // Konjungsi / Harf Athaf
  'و': {
    arabic: 'وَ',
    cleanArabic: 'و',
    transliteration: 'wa',
    particleCategory: 'Harf Athaf',
    grammaticalRole: "Harf 'Athaf al-Muthlaq al-Jam' Mabni 'alal-Fath",
    primaryMeaning: 'Dan / Demi (Penggabungan & Sumpah)',
    meanings: [
      'Al-Muthlaq al-Jam\': Menggabungkan dua kata atau kalimat tanpa membatasi urutan waktu (dan)',
      'Wawu al-Qasam: Berfungsi sebagai huruf sumpah agung yang memajrurkan kata berikutnya (demi)',
      'Wawu al-Hāl: Menjelaskan kondisi pelaku saat perbuatan berlangsung (padahal / seraya)'
    ],
    syntaxExplanation: "Partikel yang berstatus Mabni 'alal-fath. Mengikutkan i'rab kata kedua kepada kata pertama (ma'thuf 'alaih).",
    quranicNuances: [
      'Dipakai dalam sumpah-sumpah kosmis Al-Qur\'an: "Was-syamsi", "Wal-\'ashr", "Wadh-dhuhā"',
      'Menghubungkan sifat-sifat mulia Allah: "Al-\'Azīzul-Ḥakīm"'
    ]
  },
  'ف': {
    arabic: 'فَ',
    cleanArabic: 'ف',
    transliteration: 'fa',
    particleCategory: 'Harf Athaf',
    grammaticalRole: "Harf 'Athaf at-Tartīb ma'at-Ta'qīb Mabni 'alal-Fath",
    primaryMeaning: 'Maka / Lalu / Segera setelah itu (Kausalitas Cepat)',
    meanings: [
      'At-Tartīb ma\'at-Ta\'qīb: Menunjukkan urutan kejadian yang berlangsung segera tanpa jeda waktu lama',
      'As-Sababiyyah: Menunjukkan hubungan sebab-akibat langsung (karenanya / maka)',
      'Fā\' al-Jawāb: Menghubungkan kalimat syarat dengan jawabannya'
    ],
    syntaxExplanation: "Harf 'Athaf berstatus Mabni 'alal-fath. Menyambungkan hukum gramatikal sekaligus memberi arti kesegeraan.",
    quranicNuances: [
      'Menggambarkan penciptaan kilat Ilahi: "Kun fayakūn" (Jadilah! Maka seketika jadi)',
      'Menggambarkan respon langsung atas perintah Allah'
    ]
  },
  'ثم': {
    arabic: 'ثُمَّ',
    cleanArabic: 'ثم',
    transliteration: 'tsumma',
    particleCategory: 'Harf Athaf',
    grammaticalRole: "Harf 'Athaf at-Tartīb ma'at-Tarākhī Mabni 'alal-Fath",
    primaryMeaning: 'Kemudian / Lalu setelah beberapa waktu (Urutan Berjeda)',
    meanings: [
      'At-Tartīb ma\'at-Tarākhī: Menunjukkan urutan tahapan yang memerlukan jeda waktu atau proses bertahap',
      'Kenaikan derajad kepentingan peristiwa dalam susunan retorika'
    ],
    syntaxExplanation: "Harf 'Athaf berstatus Mabni 'alal-fath. Berbeda dari fa', tsumma mengandung makna jeda waktu atau fase bertahap.",
    quranicNuances: [
      'Digunakan untuk menjelaskan fase bertahap penciptaan manusia dalam rahim dan hari kebangkitan'
    ]
  },
  'او': {
    arabic: 'أَوْ',
    cleanArabic: 'او',
    transliteration: 'au',
    particleCategory: 'Harf Athaf',
    grammaticalRole: "Harf 'Athaf at-Takhyīr Mabni 'alas-Sukun",
    primaryMeaning: 'Atau (Pilihan / Keraguan / Penjelasan Ragam)',
    meanings: [
      'At-Takhyīr: Memberikan kebebasan memilih salah satu dari dua opsi yang diperbolehkan',
      'Al-Ibhām / Asy-Syakk: Menggambarkan ketidakpastian atau keraguan dari sudut pandang manusia',
      'At-Tafsīl: Merinci kemungkinan-kemungkinan alternatif'
    ],
    syntaxExplanation: "Harf 'Athaf Mabni 'alas-sukun. Berubah menjadi auwa jika bertemu hamzah washal.",
    quranicNuances: [
      'Memberikan kelonggaran pilihan fidyah/kafarat dalam hukum syariat'
    ]
  },
  'ام': {
    arabic: 'أَمْ',
    cleanArabic: 'ام',
    transliteration: 'am',
    particleCategory: 'Harf Athaf',
    grammaticalRole: "Harf 'Athaf al-Mu'ādalah Mabni 'alas-Sukun",
    primaryMeaning: 'Atau / Ataukah (Penyeimbang Pertanyaan)',
    meanings: [
      'Al-Muttashilah: Berada setelah hamzah istifham untuk menuntut kepastian di antara dua pilihan',
      'Al-Munqathi\'ah: Bermakna peralihan pembicaraan (bal / bahkan)'
    ],
    syntaxExplanation: "Harf 'Athaf Mabni 'alas-sukun.",
    quranicNuances: [
      'Digunakan dalam pertanyaan retoris bantahan terhadap kaum musyrikin'
    ]
  },
  'بل': {
    arabic: 'بَلْ',
    cleanArabic: 'بل',
    transliteration: 'bal',
    particleCategory: 'Harf Athaf',
    grammaticalRole: "Harf Idhrāb Mabni 'alas-Sukun",
    primaryMeaning: 'Bahkan / Melainkan / Sebenarnya (Peralihan Penegasan)',
    meanings: [
      'Al-Idhrāb al-Ibtālī: Membatalkan kebenaran pernyataan sebelumnya dan menegaskan kebenaran baru',
      'Al-Idhrāb al-Intiqālī: Berpindah dari satu topik ke topik lain yang lebih penting'
    ],
    syntaxExplanation: "Harf Mabni 'alas-sukun yang berfungsi mengoreksi atau mengalihkan fokus kalimat.",
    quranicNuances: [
      'Membantah tuduhan orang kafir terhadap Nabi saw dan Al-Qur\'an'
    ]
  },

  // Partikel Penegas / Taukid & Mashdar
  'ان': {
    arabic: 'إِنَّ',
    cleanArabic: 'ان',
    transliteration: 'inna',
    particleCategory: 'Harf Taukid',
    grammaticalRole: "Harf Taukīd wa Nashab Mabni 'alal-Fath",
    primaryMeaning: 'Sesungguhnya / Sungguh / Benar-benar (Penegasan Mutlak)',
    meanings: [
      'At-Taukīd: Menghilangkan keraguan dan membantah pengingkaran terhadap kebenaran informasi',
      'Memasuki jumlah ismiyyah: menashabkan isim (disebut Isim Inna) dan merafa\'kan khabar (Khabar Inna)'
    ],
    syntaxExplanation: "Salah satu pilar Nawasikh dalam ilmu Nahwu. Berstatus Mabni 'alal-fath.",
    quranicNuances: [
      'Membuka pernyataan aqidah fundamental: "Innallāha \'alā kulli syai\'in qadīr", "Inna ma\'al \'usri yusrā"'
    ]
  },
  'أن': {
    arabic: 'أَنَّ',
    cleanArabic: 'أن',
    transliteration: 'anna',
    particleCategory: 'Harf Taukid',
    grammaticalRole: "Harf Taukīd wa Mashdariyyah Mabni 'alal-Fath",
    primaryMeaning: 'Bahwa / Bahwasanya / Sesungguhnya',
    meanings: [
      'Al-Mashdariyyah wal-Taukīd: Mengubah klausa setelahnya menjadi kesatuan makna kata benda (masdar mu\'awwal)',
      'Menegaskan kepastian fakta dalam anak kalimat'
    ],
    syntaxExplanation: "Menashabkan isim dan merafa'kan khabar. Bersama kalimat setelahnya dapat menempati posisi fail, maf'ul, atau majrur.",
    quranicNuances: [
      'Menegaskan persaksian tauhid: "Asyhadu allā ilāha illallāh"'
    ]
  },
  'أن_mashdar': {
    arabic: 'أَنْ',
    cleanArabic: 'ان',
    transliteration: 'an',
    particleCategory: 'Harf Mashdariyyah',
    grammaticalRole: "Harf Mashdariyyah wa Nashab Mabni 'alas-Sukun",
    primaryMeaning: 'Bahwa / Untuk / Supaya / Hendaknya',
    meanings: [
      'Al-Mashdariyyah: Melebur bersama fi\'il mudhari\' menjadi makna kata asal (masdar mu\'awwal)',
      'An-Nashb: Menashabkan fi\'il mudhari\' setelahnya'
    ],
    syntaxExplanation: "Partikel penashab fi'il mudhari' paling kuat. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Digunakan dalam perintah syariat: "Wa an tashūmū khairul-lakum" (Dan berpuasa itu lebih baik bagimu)'
    ]
  },
  'قد': {
    arabic: 'قَدْ',
    cleanArabic: 'قد',
    transliteration: 'qad',
    particleCategory: 'Harf Taukid',
    grammaticalRole: "Harf Tahqīq / Harf Taqlīl Mabni 'alas-Sukun",
    primaryMeaning: 'Sungguh / Benar-benar (dengan Madhi) atau Terkadang (dengan Mudhari\')',
    meanings: [
      'At-Tahqīq wat-Taqrīb: Menegaskan kepastian terwujudnya peristiwa ketika masuk ke fi\'il madhi (sungguh telah)',
      'At-Taqlīl / At-Taktsīr: Menunjukkan kemungkinan sesekali atau sering ketika masuk ke fi\'il mudhari\''
    ],
    syntaxExplanation: "Partikel khusus kata kerja. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Menegaskan kemenangan kaum mukmin: "Qad aflahal-mu\'minūn"'
    ]
  },

  // Partikel Penyangkal / Nafi & Nahyi
  'لا': {
    arabic: 'لَا',
    cleanArabic: 'لا',
    transliteration: 'lā',
    particleCategory: 'Harf Nafi',
    grammaticalRole: "Harf Nafi / Harf Nahyi Mabni 'alas-Sukun",
    primaryMeaning: 'Tidak / Bukan (Peniadaan) atau Janganlah (Larangan)',
    meanings: [
      'Lā an-Nāfiyah: Meniadakan peristiwa atau keberadaan tanpa mempengaruhi i\'rab (tidak / tiada)',
      'Lā an-Nāfiyah lil-Jins: Meniadakan seluruh jenis entitas secara mutlak dengan menashabkan isim mabni fathah (tiada Tuhan selain Allah)',
      'Lā an-Nāhiyah: Perintah larangan yang menjazamkan fi\'il mudhari\' (janganlah)'
    ],
    syntaxExplanation: "Partikel serbaguna dalam bahasa Arab. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Pangkal kalimat Tauhid: "Lā ilāha illallāh" (Tiada tuhan yang berhak disembah selain Allah)',
      'Menegaskan ketiadaan keraguan Al-Qur\'an: "Lā raiba fīh"'
    ]
  },
  'ما': {
    arabic: 'مَا',
    cleanArabic: 'ما',
    transliteration: 'mā',
    particleCategory: 'Harf Nafi',
    grammaticalRole: "Harf Nafi / Ism Maushūl / Ism Istifhām Mabni 'alas-Sukun",
    primaryMeaning: 'Tidak / Apa yang / Bukan (Peniadaan atau Relatif)',
    meanings: [
      'Mā an-Nāfiyah: Meniadakan perbuatan pada masa lampau atau sekarang (tidak / tiada)',
      'Mā al-Maushūlah: Kata ganti penghubung benda mati (apa yang / segala sesuatu yang)',
      'Mā al-Istifhāmiyyah: Kata tanya benda (apakah)'
    ],
    syntaxExplanation: "Berstatus Mabni 'alas-sukun. Merupakan salah satu partikel paling luas fungsinya dalam Al-Qur'an.",
    quranicNuances: [
      'Menegaskan integritas Rasulullah saw: "Mā dhalla shāhibukum wa mā ghawā"'
    ]
  },
  'لن': {
    arabic: 'لَنْ',
    cleanArabic: 'لن',
    transliteration: 'lan',
    particleCategory: 'Harf Nafi',
    grammaticalRole: "Harf Nashab wa Nafi wa Istiqbāl Mabni 'alas-Sukun",
    primaryMeaning: 'Sekali-kali Tidak Akan (Penolakan Masa Depan Mutlak)',
    meanings: [
      'An-Nafi: Meniadakan keterjadian peristiwa',
      'Al-Istiqbāl: Mengarahkan peniadaan murni ke masa depan',
      'An-Nashb: Menashabkan fi\'il mudhari\' setelahnya'
    ],
    syntaxExplanation: "Partikel penashab fi'il mudhari' masa depan. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Menantang siapa pun membuat tandingan Al-Qur\'an: "Fa-in lam taf\'alū wa lan taf\'alū" (QS. Al-Baqarah: 24)'
    ]
  },
  'لم': {
    arabic: 'لَمْ',
    cleanArabic: 'لم',
    transliteration: 'lam',
    particleCategory: 'Harf Nafi',
    grammaticalRole: "Harf Jazm wa Nafi wa Qalb Mabni 'alas-Sukun",
    primaryMeaning: 'Tidak / Belum (Peniadaan Masa Lampau)',
    meanings: [
      'Al-Jazm: Menjazamkan (mensukunkan) fi\'il mudhari\' setelahnya',
      'Al-Qalb: Mengubah makna waktu fi\'il mudhari\' dari sekarang/nanti menjadi masa lampau yang telah berlalu'
    ],
    syntaxExplanation: "Harf Jazm khusus fi'il mudhari'. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Menegaskan keesaan Allah dalam Surah Al-Ikhlas: "Lam yalid wa lam yūlad"'
    ]
  },
  'لما': {
    arabic: 'لَمَّا',
    cleanArabic: 'لما',
    transliteration: 'lammā',
    particleCategory: 'Harf Syarat',
    grammaticalRole: "Zharaf Zamān / Harf Jazm Mabni 'alas-Sukun",
    primaryMeaning: 'Tatkala / Ketika / Belum',
    meanings: [
      'Al-Hīniyyah: Menunjukkan keterangan waktu terjadinya peristiwa masa lalu (tatkala/ketika)',
      'Al-Jāzimah: Menjazamkan fi\'il mudhari\' dengan makna "belum hingga saat ini"'
    ],
    syntaxExplanation: "Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Mengawali kisah sejarah para nabi saat menghadapi ujian Ilahi'
    ]
  },

  // Partikel Syarat & Pengecualian
  'ان_syarat': {
    arabic: 'إِنْ',
    cleanArabic: 'ان',
    transliteration: 'in',
    particleCategory: 'Harf Syarat',
    grammaticalRole: "Harf Syarat Jāzim Mabni 'alas-Sukun",
    primaryMeaning: 'Jika / Jikalau / Apabila (Kondisi Bersyarat)',
    meanings: [
      'Asy-Syarth: Menjadikan terwujudnya hal kedua bergantung mutlak pada terwujudnya hal pertama',
      'Al-Jazm: Menjazamkan dua fi\'il (fi\'il syarat dan jawab syarat)',
      'An-Nāfiyah: Terkadang bermakna peniadaan serupa mā ("in il-lā" = tiada lain kecuali)'
    ],
    syntaxExplanation: "Pangkal seluruh perangkat syarat dalam ilmu Nahwu. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Menggantungkan pertolongan Allah pada ketakwaan hamba: "In tanshurullāha yanshurkum"'
    ]
  },
  'اذا': {
    arabic: 'إِذَا',
    cleanArabic: 'اذا',
    transliteration: 'idzā',
    particleCategory: 'Harf Syarat',
    grammaticalRole: "Zharaf Zamān lil-Mustaqbal Ghairu Jāzim Mabni 'alas-Sukun",
    primaryMeaning: 'Apabila / Ketika / Saat (Kepastian Masa Depan)',
    meanings: [
      'Menunjukkan waktu masa depan yang pasti akan terjadi',
      'Mengandung makna syarat tanpa menjazamkan fi\'il (ghairu jazim)'
    ],
    syntaxExplanation: "Isim Zharaf zaman yang berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Membuka surah kiamat yang pasti terjadi: "Idzā jā\'a nashrullāhi wal-fath", "Idzas-samā\'unsyaqqat"'
    ]
  },
  'اذ': {
    arabic: 'إِذْ',
    cleanArabic: 'اذ',
    transliteration: 'idz',
    particleCategory: 'Harf Syarat',
    grammaticalRole: "Zharaf Zamān lil-Mādhī Mabni 'alas-Sukun",
    primaryMeaning: 'Ingatlah Ketika / Tatkala (Peringatan Peristiwa Lampau)',
    meanings: [
      'Menunjukkan keterangan waktu masa lampau tempat berlangsungnya mukjizat atau dialog bersejarah',
      'Sering menyimpan kata kerja tersirat "Udzkur" (Ingatlah)'
    ],
    syntaxExplanation: "Zharaf zaman masa lampau berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Mengajak manusia merenungi dialog penciptaan Adam: "Wa idz qāla rabbuka lil-malā\'ikah"'
    ]
  },
  'لو': {
    arabic: 'لَوْ',
    cleanArabic: 'لو',
    transliteration: 'lau',
    particleCategory: 'Harf Syarat',
    grammaticalRole: "Harf Imtinā' li-Imtinā' Mabni 'alas-Sukun",
    primaryMeaning: 'Seandainya / Jikalau (Pengandaian yang Tidak Terwujud)',
    meanings: [
      'Imtinā\' li-Imtinā\': Menunjukkan tidak terjadinya akibat karena tidak terwujudnya syarat pengandaian di masa lalu',
      'At-Tamannī: Mengungkapkan angan-angan yang mustahil tercapai'
    ],
    syntaxExplanation: "Harf Syarat ghairu jazim berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Menggambarkan penyesalan kaum yang ingkar di akhirat: "Lau anna lanā karratan..."'
    ]
  },
  'لولا': {
    arabic: 'لَوْلَا',
    cleanArabic: 'لولا',
    transliteration: 'laulā',
    particleCategory: 'Harf Syarat',
    grammaticalRole: "Harf Imtinā' li-Wujūd Mabni 'alas-Sukun",
    primaryMeaning: 'Jikalau Bukan Karena / Mengapa Tidak (Pencegahan Berkat Rahmat)',
    meanings: [
      'Imtinā\' li-Wujūd: Menunjukkan terhindarnya azab atau kebinasaan berkat adanya karunia Allah',
      'At-Tahdhīdh: Dorongan kuat untuk melakukan kebajikan (mengapa kalian tidak...)'
    ],
    syntaxExplanation: "Harf Mabni 'alas-sukun. Diikuti oleh mubtada yang khabarnya wajib dibuang.",
    quranicNuances: [
      'Mengingatkan karunia perlindungan Allah: "Wa laulā fadhlullāhi \'alaikum wa rahmatuh..."'
    ]
  },
  'الا': {
    arabic: 'إِلَّا',
    cleanArabic: 'الا',
    transliteration: 'illā',
    particleCategory: 'Harf Istitsna',
    grammaticalRole: "Harf Istitsnā' Mabni 'alas-Sukun",
    primaryMeaning: 'Kecuali / Selain / Melainkan (Pengecualian)',
    meanings: [
      'Al-Istitsnā\' al-Muttashil: Mengecualikan bagian dari kelompok yang disebutkan sebelumnya',
      'Al-Istitsnā\' al-Munqathi\': Mengecualikan hal yang bukan sejenis dari kelompok asal (tetapi/melainkan)',
      'Al-Khashr wal-Iqtishār: Berfungsi membatasi dan mengkhususkan setelah kalimat nafi (tiada lain melainkan)'
    ],
    syntaxExplanation: "Perangkat utama hukum pengecualian dalam Nahwu. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Kunci pemurnian ibadah tauhid: "Wa mā arsalnāka illā rahmatan lil-\'ālamīn"'
    ]
  },

  // Partikel Tanya, Seru, & Harapan
  'هل': {
    arabic: 'هَلْ',
    cleanArabic: 'هل',
    transliteration: 'hal',
    particleCategory: 'Harf Istifham',
    grammaticalRole: "Harf Istifhām Mabni 'alas-Sukun",
    primaryMeaning: 'Apakah / Adakah (Pertanyaan Kepastian)',
    meanings: [
      'At-Tashdīq: Menuntut jawaban pembenaran (ya atau tidak)',
      'At-Taswīq: Membangkitkan rasa penasaran dan ketertarikan pendengar (sukakah kalian aku tunjukkan...)'
    ],
    syntaxExplanation: "Harf Istifham murni tanpa kedudukan i'rab tersendiri. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Menawarkan perniagaan keselamatan akhirat: "Hal adullukum \'alā tijārah..." (QS. Ash-Shaff: 10)'
    ]
  },
  'يا': {
    arabic: 'يَا',
    cleanArabic: 'يا',
    transliteration: 'yā',
    particleCategory: 'Harf Nida',
    grammaticalRole: "Harf Nidā' Mabni 'alas-Sukun",
    primaryMeaning: 'Wahai (Kata Seruan)',
    meanings: [
      'An-Nidā\': Memanggil dan menarik perhatian pihak yang diseru baik dekat maupun jauh',
      'At-Tanbīh: Mengingatkan keagungan pesan yang akan disampaikan setelahnya'
    ],
    syntaxExplanation: "Partikel panggilan paling agung dan sering digunakan dalam Al-Qur'an. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Seruan kasih sayang kepada orang beriman: "Yā ayyuhalladzīna āmanū"',
      'Seruan universal kepada seluruh umat manusia: "Yā ayyuhan-nās"'
    ]
  },
  'لعل': {
    arabic: 'لَعَلَّ',
    cleanArabic: 'لعل',
    transliteration: 'la\'alla',
    particleCategory: 'Kata Tugas (Harf)',
    grammaticalRole: "Harf Tarajjī wa Tawaqqu' Mabni 'alal-Fath",
    primaryMeaning: 'Semoga / Mudah-mudahan / Agar (Harapan Baik & Hikmah)',
    meanings: [
      'At-Tarajjī: Mengharapkan terjadinya kebaikan yang dicintai dan diridhai',
      'At-Ta\'līl: Menjelaskan hikmah dan tujuan diwajibkannya suatu amalan (agar kalian bertakwa)'
    ],
    syntaxExplanation: "Saudari Inna (Nawasikh), menashabkan isim dan merafa'kan khabar. Berstatus Mabni 'alal-fath.",
    quranicNuances: [
      'Tujuan akhir pelaksanaan ibadah puasa: "La\'allakum tattaqūn" (QS. Al-Baqarah: 183)'
    ]
  },
  'ليت': {
    arabic: 'لَيْتَ',
    cleanArabic: 'ليت',
    transliteration: 'laita',
    particleCategory: 'Kata Tugas (Harf)',
    grammaticalRole: "Harf Tamannī Mabni 'alal-Fath",
    primaryMeaning: 'Aduhai Sekiranya / Seandainya Saja (Angan-angan Mustahil)',
    meanings: [
      'At-Tamannī: Mengharap sesuatu yang mustahil terwujud atau sangat sulit dicapai',
      'Menyuarakan penyesalan mendalam'
    ],
    syntaxExplanation: "Saudari Inna yang menashabkan isim. Berstatus Mabni 'alal-fath.",
    quranicNuances: [
      'Penyesalan orang kafir di hari kiamat: "Yā laitanī kuntu turābā" (QS. An-Naba: 40)'
    ]
  },
  'كلا': {
    arabic: 'كَلَّا',
    cleanArabic: 'كلا',
    transliteration: 'kallā',
    particleCategory: 'Harf Rad\'in',
    grammaticalRole: "Harf Rad'in wa Zajr Mabni 'alas-Sukun",
    primaryMeaning: 'Sekali-kali Tidak! / Jangan Sekali-kali Begitu! (Pencegahan Keras)',
    meanings: [
      'Ar-Rad\'u waz-Zajr: Membentak keras, menolak anggapan salah, dan membungkam alasan batil',
      'Haqqan: Bermakna kepastian mutlak (sungguh benar-benar)'
    ],
    syntaxExplanation: "Harf penolakan keras yang sering muncul pada surah-surah Makkiyyah. Berstatus Mabni 'alas-sukun.",
    quranicNuances: [
      'Membungkam persaingan bermegah-megahan dunia: "Kallā saufa ta\'lamūn" (QS. At-Takatsur)'
    ]
  },
  'سوف': {
    arabic: 'سَوْفَ',
    cleanArabic: 'سوف',
    transliteration: 'saufa',
    particleCategory: 'Harf Tanfis',
    grammaticalRole: "Harf Taswīf wa Istiqbāl Mabni 'alal-Fath",
    primaryMeaning: 'Kelak / Nanti (Waktu Mendatang Berjangka Jauh)',
    meanings: [
      'At-Taswīf: Mengarahkan perbuatan fi\'il mudhari\' ke masa depan yang memiliki jarak/waktu signifikan',
      'Menyiratkan kepastian balasan dan hisab di akhirat kelak'
    ],
    syntaxExplanation: "Partikel khusus penunjuk masa depan (istiqbal) yang masuk ke fi'il mudhari'. Berstatus Mabni 'alal-fath.",
    quranicNuances: [
      'Peringatan bahwa manusia kelak akan melihat hasil perbuatannya dengan mata kepala sendiri'
    ]
  }
};

/**
 * Resolves any Quranic word token to check if it matches a known particle / kata tugas.
 */
export function getQuranicParticleInfo(token: string): QuranicParticleInfo | null {
  if (!token) return null;
  const clean = stripArabicHarakat(token).trim();

  if (QURANIC_PARTICLES_DICTIONARY[clean]) {
    return QURANIC_PARTICLES_DICTIONARY[clean];
  }

  // Handle clitic particles joined to words, or special keys
  if (clean === 'فى') return QURANIC_PARTICLES_DICTIONARY['في'];
  if (clean === 'على' || clean === 'علي') return QURANIC_PARTICLES_DICTIONARY['على'];
  if (clean === 'الى' || clean === 'الي') return QURANIC_PARTICLES_DICTIONARY['الى'];
  if (clean === 'حتي') return QURANIC_PARTICLES_DICTIONARY['حتى'];

  return null;
}
