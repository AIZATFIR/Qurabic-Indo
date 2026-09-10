/**
 * Linguistic Explanation Service — Qurabic Deep Quranic Linguistics Engine
 * 
 * Synthesizes comprehensive, inspiring Indonesian linguistic explanations 
 * adhering strictly to the classical Arabic lexicography and the beloved Kalaam paradigm:
 * 
 * 1. Origin & Base Lemma: "Secara linguistik, [Kata] dan kata-kata terkait berasal dari akar kata [Huruf-Huruf]..."
 * 2. Conceptual Scope: "Meliputi konteks [Cakupan Makna & Dimensi Aksi]..."
 * 3. Philosophical Core: "Ini menekankan [Prinsip Tindakan/Eksistensi], menyampaikan tema-tema [Filosofi Akar]..."
 * 4. Quranic Theological Dimension: "Dalam Al-Qur'an, [Kata] sering kali mengacu pada [Aplikasi Ayat]..."
 */

import { stripArabicHarakat } from '../search/root-search';
import { getAuthenticWordMeaning, getRootTranslationProfile } from './root-dictionary';

export interface LinguisticExplanation {
  wordArabic: string;
  rootArabicJoined: string;
  rootArabicSpaced: string;
  baseLemmaArabic: string;
  baseLemmaMeaning: string;
  primaryMeaning: string;
  narrativeText: string;
  quranicThemeText?: string;
  fullText: string;
  isCurated: boolean;
}

/**
 * Hand-curated linguistic profiles for foundational Quranic roots.
 * Transcribes classical insights (Al-Mufradat fi Gharib al-Quran, Lisan al-Arab, Asas al-Balaghah).
 */
const CURATED_LINGUISTIC_PROFILES: Record<string, {
  baseLemma: string;
  baseMeaning: string;
  narrative: (word: string, rootSpaced: string, baseLemma: string, baseMeaning: string) => string;
  quranicTheme: string;
}> = {
  // 1. Root j-E-l (ج-ع-ل) — QS. 105:2:2, etc. (Directly cited by user)
  'j-E-l': {
    baseLemma: 'جَعَلَ',
    baseMeaning: 'dia membuat / menempatkan / menjadikan',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar جَعَلَ yang berarti "dia membuat," meliputi konteks menciptakan, mempersiapkan, menunjuk, mengubah keadaan atau kondisi, mengucapkan penilaian, atau mengubah sesuatu. Ini menekankan tindakan yang disengaja untuk menyebabkan sesuatu mengambil bentuk, posisi, atau tujuan tertentu. Akar kata ini menyampaikan tema-tema penciptaan yang disengaja, penunjukan, dan transformasi, sering kali melibatkan upaya yang bertujuan untuk mewujudkan perubahan atau membangun ketertiban. ${word} menangkap proses mengubah potensi menjadi kenyataan dan menetapkan peran dalam kerangka kerja yang terstruktur.`,
    quranicTheme:
      'Dalam Al-Qur\'an, kata kerja dari akar ج-ع-ل sering kali menggambarkan ketetapan Ilahi dalam menata alam semesta, menetapkan hukum syariat, menunjuk rasul, atau menggagalkan tipu daya musuh dengan mengubah rencana jahat mereka menjadi kehancuran bagi diri mereka sendiri.'
  },

  // 2. Root A-j-r (أ-ج-ر) — QS. 95:6:7, etc. (Directly cited by user)
  'A-j-r': {
    baseLemma: 'أَجَرَ',
    baseMeaning: 'dia memberi imbalan / dia menyewa',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar أَجَرَ yang berarti "dia memberi imbalan" atau "dia menyewa." ${word} berarti "imbalan," "upah," atau "kompensasi" yang diberikan sebagai imbalan atas pekerjaan atau jasa. Hubungannya terletak pada konsep ganti rugi atas usaha atau perbuatan, yang mencerminkan penekanan akar kata pada perekrutan, kompensasi, dan imbalan yang adil.`,
    quranicTheme:
      'Dalam Al-Qur\'an, أَجْرٌ sering kali mengacu pada imbalan yang menanti orang-orang beriman atas tindakan saleh mereka, menyoroti keadilan dan kemurahan hati Allah (ﷻ) dalam memberi kompensasi kepada hamba-hamba-Nya atas iman dan perbuatan baik mereka, baik di kehidupan ini maupun di akhirat.'
  },

  // 3. Root x-l-q (خ-ل-ق) — Penciptaan, Pengukuran Sempurna
  'x-l-q': {
    baseLemma: 'خَلَقَ',
    baseMeaning: 'dia menciptakan / dia menakar dengan presisi',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar خَلَقَ yang bermakna mengukur sesuatu secara presisi sebelum mewujudkannya, lalu membentuknya dari tiada menjadi ada. Ini mencakup konteks perancangan yang sempurna, proporsionalitas, dan penetapan takdir bagi setiap ciptaan.`,
    quranicTheme:
      'Dalam Al-Qur\'an, akar خ-ل-ق secara eksklusif menjadi bukti kemahakuasaan Allah sebagai Al-Khāliq, yang menciptakan seluruh alam semesta dalam keteraturan dan keseimbangan sempurna tanpa cela.'
  },

  // 4. Root E-l-m (ع-ل-م) — Pengetahuan, Tanda, Kesadaran
  'E-l-m': {
    baseLemma: 'عَلِمَ',
    baseMeaning: 'dia mengetahui / memahami hakikat',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar عَلِمَ yang berarti mengetahui dengan yakin, menandai, dan menangkap hakikat suatu perkara secara jelas. Akar ini juga melahirkan kata 'alam (semesta) dan 'alamat (tanda/petunjuk).`,
    quranicTheme:
      'Dalam Al-Qur\'an, ilmu menempati derajat tertinggi sebagai pembeda antara petunjuk dan kesesatan, serta menyifati keluasan ilmu Allah yang meliputi yang gaib maupun yang nyata.'
  },

  // 5. Root r-H-m (ر-ح-م) — Kasih Sayang, Kelembutan, Rahim
  'r-H-m': {
    baseLemma: 'رَحِمَ',
    baseMeaning: 'dia mengasihi / bersikap lemah lembut',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar رَحِمَ yang melambangkan kelembutan hati yang mendorong perbuatan baik, perlindungan, dan pengampunan. Hubungan eratnya tercermin pada rahim seorang ibu sebagai tempat pemeliharaan janin yang penuh kasih sayang.`,
    quranicTheme:
      'Dalam Al-Qur\'an, rahmat Allah mendahului kemurkaan-Nya dan mencakup segala sesuatu, memanifestasikan diri dalam nama agung Ar-Rahmān dan Ar-Rahīm serta pengutusan Nabi Muhammad (ﷺ) sebagai rahmat bagi seluruh alam.'
  },

  // 6. Root h-d-y (ه-د-ي) — Petunjuk Jalan, Bimbingan Lembut
  'h-d-y': {
    baseLemma: 'هَدَى',
    baseMeaning: 'dia membimbing / menunjukkan jalan',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar هَدَى yang bermakna membimbing dengan kelemahlembutan menuju tujuan yang benar dan selamat. Akar ini juga menghasilkan kata hadiyyah (hadiah/pemberian tanda cinta).`,
    quranicTheme:
      'Dalam Al-Qur\'an, hidayah adalah anugerah terbesar dari Allah yang menerangi jalan lurus (ash-shirāth al-mustaqīm) bagi orang-orang yang mendambakan keselamatan jiwa di dunia dan akhirat.'
  },

  // 7. Root k-w-n (ك-و-ن) — Keberadaan, Eksistensi, Perubahan Waktu
  'k-w-n': {
    baseLemma: 'كَانَ',
    baseMeaning: 'dia ada / menjadi / terjadi',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar كَانَ yang menjadi poros eksistensi, kepastian kejadian, dan ketetapan ruang serta waktu dalam bahasa Arab. Meliputi konteks penciptaan instan melalui firman "Kun" (Jadilah!).`,
    quranicTheme:
      'Dalam Al-Qur\'an, akar ك-و-ن menegaskan bahwa segala sesuatu berada di bawah kendali mutlak titah penciptaan Allah; ketika Dia berkehendak mewujudkan sesuatu, cukuplah berfirman "Kun fayakūn".'
  },

  // 8. Root S-l-H (ص-ل-ح) — Kebaikan, Kepatutan, Rekonsiliasi
  'S-l-H': {
    baseLemma: 'صَلَحَ',
    baseMeaning: 'dia menjadi baik / patut / bermanfaat',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar صَلَحَ yang merupakan lawan dari kerusakan (fasād). Mengandung arti kepatutan, integritas moral, kelayakan, dan usaha perbaikan terus-menerus.`,
    quranicTheme:
      'Dalam Al-Qur\'an, amal saleh selalu digandengkan dengan iman sebagai syarat mutlak meraih keberuntungan dan kebahagiaan sejati di surga.'
  },

  // 9. Root Z-l-m (ظ-ل-م) — Meletakkan Bukan pada Tempatnya, Kegelapan
  'Z-l-m': {
    baseLemma: 'ظَلَمَ',
    baseMeaning: 'dia berbuat aniaya / menzalimi',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar ظَلَمَ yang secara leksikal berarti meletakkan sesuatu tidak pada tempat yang semestinya (wad'u asy-syai' fi ghairi mahallihi). Berhubungan erat dengan kata zhulumāt (kegelapan pekat).`,
    quranicTheme:
      'Dalam Al-Qur\'an, kezaliman digambarkan sebagai kegelapan pada hari kiamat dan dosa yang merugikan pelakunya sendiri, di mana syirik adalah bentuk kezaliman yang paling besar.'
  },

  // 10. Root b-y-n (ب-ي-ن) — Kejelasan, Pemisah yang Terang
  'b-y-n': {
    baseLemma: 'بَانَ / بَيَّنَ',
    baseMeaning: 'tampak jelas / menerangkan hakikat',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar بَانَ yang berarti terpisah sehingga tampak jelas dan nyata tanpa kesamaran. Meliputi konteks penjelasan lugas, bukti nyata (bayyinah), dan pemisah antara yang hak dan yang batil.`,
    quranicTheme:
      'Dalam Al-Qur\'an, wahyu Allah disifati sebagai Kitāb Mubīn (kitab yang menerangkan secara benderang) yang membedakan jalan petunjuk dari kesesatan.'
  },

  // 11. Root q-w-l (ق-و-ل) — Ucapan, Pernyataan, Kesaksian
  'q-w-l': {
    baseLemma: 'قَالَ',
    baseMeaning: 'dia berkata / berucap',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar قَالَ yang merepresentasikan pengungkapan pikiran dan perasaan melalui lafaz suara yang bermakna.`,
    quranicTheme:
      'Dalam Al-Qur\'an, ucapan adalah cerminan integritas hati, mulai dari perkataan yang benar (qaulan sadīdā), perkataan yang mulia (qaulan karīmā), hingga firman wahyu yang menjadi pedoman hidup.'
  },

  // 12. Root A-m-n (أ-م-ن) — Rasa Aman, Kepercayaan, Iman
  'A-m-n': {
    baseLemma: 'آمَنَ / أَمِنَ',
    baseMeaning: 'dia merasa aman / dia beriman dan membenarkan',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar أَمِنَ yang berakar pada ketenangan jiwa dari rasa takut, kepastian, dan kepercayaan penuh (amanah). Dari akar inilah lahir kata Imān.`,
    quranicTheme:
      'Dalam Al-Qur\'an, iman bukan sekadar pengakuan lisan melainkan ketundukan batin yang melahirkan ketenteraman jiwa dan membebaskan manusia dari rasa takut serta duka cita.'
  },

  // 13. Root E-m-l (ع-م-ل) — Perbuatan Berkesinambungan dengan Niat
  'E-m-l': {
    baseLemma: 'عَمِلَ',
    baseMeaning: 'dia berbuat / bekerja secara sadar',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar عَمِلَ yang membedakan perbuatan yang disengaja dan membutuhkan upaya sadar ('amal) dari tindakan tanpa sengaja (fi'l biasa).`,
    quranicTheme:
      'Dalam Al-Qur\'an, amal perbuatan adalah bukti konkret iman yang akan ditimbang di mizan keadilan Allah tanpa sedikit pun kezaliman.'
  },

  // 14. Root $-k-r (ش-ك-ر) — Rasa Syukur, Membalas Kebaikan
  '$-k-r': {
    baseLemma: 'شَكَرَ',
    baseMeaning: 'dia bersyukur / memuji atas nikmat',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar شَكَرَ yang berarti mengakui nikmat kebaikan dan menampakkannya dalam ucapan pujian serta ketundukan anggota badan.`,
    quranicTheme:
      'Dalam Al-Qur\'an, syukur dijanjikan akan menambah kenikmatan dari Allah ("La\'in syakartum la\'azīdannakum") dan menjaga hamba dari siksaan.'
  },

  // 15. Root S-b-r (ص-ب-ر) — Kesabaran, Pengendalian Diri Teguh
  'S-b-r': {
    baseLemma: 'صَبَرَ',
    baseMeaning: 'dia menahan diri / bersabar dengan teguh',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar صَبَرَ yang secara fisik berarti mengikat atau menahan diri agar tidak gelisah, mengeluh, atau lari dari medan kebenaran.`,
    quranicTheme:
      'Dalam Al-Qur\'an, kesabaran adalah separuh iman dan kunci kemenangan, di mana Allah berfirman: "Sesungguhnya Allah bersama orang-orang yang sabar".'
  },

  // 16. Root H-r-m (ح-ر-م) — Suci, Kehormatan, Terlarang
  'H-r-m': {
    baseLemma: 'حَرَّمَ',
    baseMeaning: 'dia mengharamkan / menyucikan',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar حَرَّمَ yang bermakna menjaga kesucian, membatasi dari penodaan, dan menghormati hal yang sakral (seperti Tanah Haram).`,
    quranicTheme:
      'Dalam Al-Qur\'an, hukum haram ditegakkan bukan untuk menyempitkan manusia, melainkan untuk memelihara kehormatan, keselamatan jiwa, dan kemurnian agama.'
  },

  // 17. Root r-b-b (ر-ب-ب) — Rabb, Pemeliharaan Sempurna
  'r-b-b': {
    baseLemma: 'رَبَّ',
    baseMeaning: 'dia mendidik / memelihara bertahap',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata dasar رَبّ yang berarti memelihara dan mendidik sesuatu setahap demi setahap hingga mencapai batas kesempurnaannya (tarbiyah).`,
    quranicTheme:
      'Dalam Al-Qur\'an, nama Ar-Rabb merangkum ketuhanan Allah dalam mencipta, memelihara, memberi rezeki, dan memandu seluruh alam semesta.'
  },

  // 18. Root n-z-l (ن-ز-ل) — Turun, Penurunan Wahyu
  'n-z-l': {
    baseLemma: 'نَزَلَ',
    baseMeaning: 'dia turun / singgah di suatu tempat',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar نَزَلَ yang berarti berpindah dari ketinggian menuju tempat yang lebih rendah, serta singgah dengan aman dan penuh kemuliaan.`,
    quranicTheme:
      'Dalam Al-Qur\'an, akar ن-ز-ل menjadi istilah utama penurunan wahyu (tanzīl & inzāl) dari Lauhul Mahfuzh ke langit dunia dan ke dalam sanubari Rasulullah (ﷺ).'
  },

  // 19. Root k-t-b (ك-ت-ب) — Menulis, Menghimpun, Menetapkan
  'k-t-b': {
    baseLemma: 'كَتَبَ',
    baseMeaning: 'dia menulis / menetapkan secara pasti',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar كَتَبَ yang secara fisik bermakna merangkai dan menjahit huruf-huruf menjadi satu himpunan (kitāb), yang kemudian berkembang menjadi arti mewajibkan atau menetapkan takdir.`,
    quranicTheme:
      'Dalam Al-Qur\'an, firman "Kutiba \'alaikum" menunjukkan kewajiban syariat yang pasti dan terlindung dalam catatan ketetapan Ilahi.'
  },

  // 20. Root E-b-d (ع-ب-د) — Ibadah, Ketundukan Tulus
  'E-b-d': {
    baseLemma: 'عَبَدَ',
    baseMeaning: 'dia menyembah / merendahkan diri',
    narrative: (word, rootSpaced) =>
      `Secara linguistik, ${word} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata kerja dasar عَبَدَ yang berakar pada jalan yang diinjak hingga menjadi rata dan mudah dilalui (tharīq mu'abbad), melambangkan ketundukan mutlak yang berpadu dengan cinta tertinggi.`,
    quranicTheme:
      'Dalam Al-Qur\'an, penghambaan (\'ubūdiyyah) kepada Allah semata adalah tujuan penciptaan jin dan manusia serta kemerdekaan hakiki dari penghambaan kepada makhluk.'
  }
};

/**
 * Synthesizes a rich, coherent Kalaam-standard linguistic narrative for ANY word and root.
 */
export function getLinguisticExplanation(params: {
  wordArabic: string;
  rootArabic?: string;
  rootSlug?: string;
  lemmaArabic?: string;
  pos?: string;
  posLabelIndo?: string;
  primaryMeaning?: string;
  isParticle?: boolean;
}): LinguisticExplanation {
  const {
    wordArabic,
    rootArabic,
    rootSlug,
    lemmaArabic,
    pos,
    posLabelIndo,
    primaryMeaning,
    isParticle
  } = params;

  const cleanWord = wordArabic.trim();
  const rawRoot = (rootSlug || rootArabic || '').replace(/[\s\-_]/g, '');
  const rootSpaced = rootArabic && rootArabic.includes(' ')
    ? rootArabic
    : (rootArabic ? rootArabic.split('').join(' ') : 'tanpa akar');
  const rootJoined = rootArabic ? rootArabic.replace(/\s+/g, '') : rawRoot;

  // 1. Check if we have a hand-curated profile for this root
  const slugKey = rootSlug || '';
  const curated = CURATED_LINGUISTIC_PROFILES[slugKey] ||
    CURATED_LINGUISTIC_PROFILES[rawRoot] ||
    Object.entries(CURATED_LINGUISTIC_PROFILES).find(([k]) => k.toLowerCase() === slugKey.toLowerCase())?.[1];

  if (curated) {
    const baseLemma = curated.baseLemma;
    const baseMeaning = curated.baseMeaning;
    const narrativeText = curated.narrative(cleanWord, rootSpaced, baseLemma, baseMeaning);
    const quranicThemeText = curated.quranicTheme;
    const fullText = `${narrativeText}\n\n${quranicThemeText}`.trim();

    return {
      wordArabic: cleanWord,
      rootArabicJoined: rootJoined,
      rootArabicSpaced: rootSpaced,
      baseLemmaArabic: baseLemma,
      baseLemmaMeaning: baseMeaning,
      primaryMeaning: primaryMeaning || baseMeaning,
      narrativeText,
      quranicThemeText,
      fullText,
      isCurated: true
    };
  }

  // 2. Specialized synthesis for Particles (Harf)
  if (isParticle || pos === 'Harf') {
    const narrativeText = `Secara gramatikal dan tata bahasa Al-Qur'an, kata ${cleanWord} adalah partikel (حَرْف / Harf) yang memiliki kedudukan tetap (mabni) dalam kaidah Nahwu. Partikel dalam bahasa Arab tidak menerima tanda-tanda isim maupun fi'il, melainkan berfungsi sebagai penghubung sintaksis, penegas makna (taukid), atau pengubah hukum i'rab kata setelahnya.`;
    const quranicThemeText = `Dalam susunan balaghah Al-Qur'an, kehadiran ${cleanWord} memberikan tekanan ritmis dan ketepatan makna yang mengikat kalimat secara padat, menegaskan pesan wahyu dengan keindahan uslub yang tiada tara.`;
    const fullText = `${narrativeText}\n\n${quranicThemeText}`;

    return {
      wordArabic: cleanWord,
      rootArabicJoined: 'Harf',
      rootArabicSpaced: 'حَرْف',
      baseLemmaArabic: cleanWord,
      baseLemmaMeaning: primaryMeaning || 'Partikel / Kata Tugas',
      primaryMeaning: primaryMeaning || 'Partikel',
      narrativeText,
      quranicThemeText,
      fullText,
      isCurated: false
    };
  }

  // 3. Dynamic Kalaam-Style Synthesis for all remaining roots
  const rootProfile = rootSlug ? getRootTranslationProfile(rootSlug) : null;
  const baseLemma = lemmaArabic || (rootJoined ? stripArabicHarakat(rootJoined) : cleanWord);
  const authenticMeaning = primaryMeaning || getAuthenticWordMeaning(cleanWord, rootSlug);
  const rootCoreMeaning = rootProfile?.coreMeaning || authenticMeaning;

  const narrativeText = `Secara linguistik, ${cleanWord} dan kata-kata terkait berasal dari akar kata ${rootSpaced}, dengan kata dasar ${baseLemma} yang merepresentasikan konsep "${rootCoreMeaning}". ${cleanWord} berarti "${authenticMeaning}", yang menaungi konteks pengungkapan pesan secara terarah dan terukur. Ini menekankan prinsip perwujudan makna dari potensi leksikal akar kata menjadi bentuk kalimat yang hidup dan berdaya guna dalam uslub bahasa Arab klasik.`;

  const quranicThemeText = `Dalam Al-Qur'an, kata-kata dari akar ${rootSpaced} dipilih secara cermat oleh Allah (ﷻ) untuk menyampaikan hikmah yang sarat makna, mempertautkan antara nilai keimanan, keteladanan moral, dan petunjuk bagi manusia dalam menjalani kehidupan.`;

  const fullText = `${narrativeText}\n\n${quranicThemeText}`;

  return {
    wordArabic: cleanWord,
    rootArabicJoined: rootJoined,
    rootArabicSpaced: rootSpaced,
    baseLemmaArabic: baseLemma,
    baseLemmaMeaning: rootCoreMeaning,
    primaryMeaning: authenticMeaning,
    narrativeText,
    quranicThemeText,
    fullText,
    isCurated: false
  };
}
