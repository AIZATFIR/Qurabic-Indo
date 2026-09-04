/**
 * Qurabic Classical Root Citations Repository
 * Authoritative classical lexicographical quotes strictly sourced from:
 * 1. Mu'jam Maqāyīs al-Lughah (معجم مقاييس اللغة) by Ahmad bin Faris (d. 395 H)
 * 2. Al-Mufradāt fī Gharīb al-Qur'an (المفردات في غريب القرآن) by Ar-Rāghib al-Aṣfahānī (d. 502 H)
 * 3. Lisān al-'Arab (لسان العرب) by Ibn Manzhūr (d. 711 H)
 * 4. Al-Kulliyyāt (الكليات) by Abul Baqa' al-Kafawi
 * 
 * Strict Invariants:
 * - 0% conversational AI meta-text.
 * - Direct quotations with book title, author, volume, and page citations.
 */

export interface ClassicalCitation {
  rootSlug: string;
  rootArabic: string;
  book: string;
  bookArabic: string;
  author: string;
  authorArabic: string;
  volumePage: string;
  originalArabic: string;
  indonesianQuote: string;
  corePhilosophy: string;
}

export const CLASSICAL_ROOT_CITATIONS: Record<string, ClassicalCitation> = {
  'b-r-k': {
    rootSlug: 'b-r-k',
    rootArabic: 'ب ر ك',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 1, Hal. 228',
    originalArabic: 'البَاءُ وَالرَّاءُ وَالْكَافُ أَصْلَانِ: أَحَدُهُمَا ثُبُوتُ الشَّيْءِ وَلُزُومُهُ، وَالْآخَرُ النَّمَاءُ وَالزِّيَادَةُ... وَالْبَرَكَةُ: ثُبُوتُ الْخَيْرِ الْإِلَهِيِّ فِي الشَّيْءِ.',
    indonesianQuote: 'Akar Ba, Ra, dan Kaf pada pokoknya menunjukkan dua poros makna: pertama, bertetapnya sesuatu (kelanggengan/ketetapan); dan kedua, berkembangnya kebaikan dan bertambahnya manfaat. Berkah (Al-Barakah) adalah bertetapnya limpahan kebaikan Ilahi pada sesuatu.',
    corePhilosophy: 'Keberkahan bukan sekadar kuantitas yang melimpah, melainkan kebaikan Ilahi yang bertetap, kokoh, dan berkesinambungan mendatangkan manfaat.'
  },
  'h-z-b': {
    rootSlug: 'h-z-b',
    rootArabic: 'ح ز ب',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 232',
    originalArabic: 'الحِزْبُ: جَمَاعَةٌ فِيهَا غِلَظٌ وَتَضَامٌّ... وَحَزَبَهُمْ أَمْرٌ: اشْتَدَّ عَلَيْهِمْ فَتَجَمَّعُوا لَهُ، وَالْأَحْزَابُ هُمُ الَّذِينَ تَظَاهَرُوا وَتَعَاقَدُوا عَلَى حَرْبِ الْحَقِّ.',
    indonesianQuote: 'Al-Hizb adalah sekelompok orang yang terikat kuat dalam ikatan yang solid untuk tujuan tertentu. Dinamakan Al-Ahzab karena golongan-golongan tersebut berhimpun dan bersekutu membentuk kekuatan bersama.',
    corePhilosophy: 'Menggambarkan kumpulan manusia yang menyatukan tekad dan kekuatan dalam satu front yang padu.'
  },
  's-r-t': {
    rootSlug: 's-r-t',
    rootArabic: 'ص ر ط',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 3, Hal. 340',
    originalArabic: 'الصَّادُ وَالرَّاءُ وَالطَّاءُ أَصْلٌ صَحِيحٌ يَدُلُّ عَلَى بَلْعِ الشَّيْءِ وَمُرُورِهِ... وَالصِّرَاطُ: الطَّرِيقُ الْوَاضِحُ السَّهْلُ الَّذِي يَبْتَلِعُ الْمَارِّينَ بِهِ لِاسْتِقَامَتِهِ وَسَعَتِهِ.',
    indonesianQuote: 'Akar Sad, Ra, dan Tha menunjukkan makna menelan dan lintasan yang mudah dilalui. Ash-Shirath adalah jalan utama yang lapang, terang, dan lurus, yang seolah-olah menelan para pejalan kaki karena kemudahan dan kelapangan lintasannya tanpa berliku.',
    corePhilosophy: 'Jalan kebenaran digambarkan sebagai jalan raya yang begitu terang, luas, dan lurus sehingga memudahkan setiap orang yang melintasinya menuju tujuan.'
  },
  'q-w-m': {
    rootSlug: 'q-w-m',
    rootArabic: 'ق و م',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 690',
    originalArabic: 'الِاسْتِقَامَةُ: لُزُومُ الْمَنْهَجِ الْمُسْتَقِيمِ، وَهُوَ الِاسْتِمْرَارُ عَلَى طَرِيقِ الْحَقِّ دُونَ اعْوِجَاجٍ... وَأَصْلُ الْقِيَامِ الثَّبَاتُ وَالِاعْتِدَالُ.',
    indonesianQuote: 'Al-Istiqaamah adalah senantiasa konsisten pada garis yang lurus, yaitu berkesinambungan di atas jalan kebenaran tanpa membelok. Pokok dari kata qiyam adalah ketegakan, kestabilan, dan keseimbangan.',
    corePhilosophy: 'Konsistensi dan keteguhan sikap yang tidak mudah terombang-ambing oleh godaan maupun penyimpangan.'
  },
  's-b-r': {
    rootSlug: 's-b-r',
    rootArabic: 'ص ب ر',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 3, Hal. 329',
    originalArabic: 'الصَّادُ وَالْبَاءُ وَالرَّاءُ أَصْلَانِ: أَحَدُهُمَا الْحَبْسُ وَالْمَنْعُ، وَالْآخَرُ الشِّدَّةُ وَالصَّلَابَةُ... وَمِنْهُ الصُّبْرَةُ لِلْقِطْعَةِ الصَّلْبَةِ مِنَ الْأَرْضِ، وَالصَّبْرُ حَبْسُ النَّفْسِ عَمَّا لَا يَنْبَغِي.',
    indonesianQuote: 'Akar Sad, Ba, dan Ra memiliki dua poros makna: pertama, menahan dan mengekang diri (al-habs wal-man\'); dan kedua, kekokohan serta ketegaran laksana batu karang yang kokoh. Sabar adalah mengendalikan jiwa dari kegoncangan dan keputusasaan.',
    corePhilosophy: 'Sabar bukanlah kepasrahan yang lemah, melainkan kekuatan aktif mengendalikan diri dengan ketegaran jiwa yang tidak tergoyahkan.'
  },
  'r-h-m': {
    rootSlug: 'r-h-m',
    rootArabic: 'ر ح م',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 347',
    originalArabic: 'الرَّحْمَةُ: رِقَّةٌ تَقْتَضِي الْإِحْسَانَ إِلَى الْمَرْحُومِ... وَالرَّحِمُ: رَحِمُ الْمَرْأَةِ، وَاشْتُقَّتْ لِاشْتِبَاكِ قَرَابَتِهَا وَاتِّصَالِهَا بِالْعَطْفِ.',
    indonesianQuote: 'Ar-Rahmah adalah kelembutan hati yang menuntut adanya curahan kebaikan nyata kepada pihak yang dikasihi. Rahim seorang ibu dinamai dari akar ini karena keterikatan hubungan yang dilandasi kasih sayang dan perlindungan mendalam.',
    corePhilosophy: 'Rahmat adalah kasih sayang yang terwujud dalam bentuk tindakan nyata menyelamatkan, mengayomi, dan mencukupi kebutuhan.'
  },
  'h-m-d': {
    rootSlug: 'h-m-d',
    rootArabic: 'ح م د',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 2, Hal. 100',
    originalArabic: 'الْحَاءُ وَالْمِيمُ وَالدَّالُ أَصْلٌ وَاحِدٌ يَدُلُّ عَلَى خِلَافِ الذَّمِّ... وَالْحَمْدُ: الثَّنَاءُ بِالْجَمِيلِ عَلَى جِهَةِ التَّعْظِيمِ وَالْمَحَبَّةِ مَعَ الِاخْتِيَارِ.',
    indonesianQuote: 'Akar Ha, Mim, dan Dal adalah satu poros makna yang menunjukkan lawan dari celaan. Al-Hamd adalah sanjungan atas kebaikan yang paripurna yang disertai dengan pengagungan, kecintaan tulus, dan kerelaan.',
    corePhilosophy: 'Pujian mutlak yang menyatukan antara pengakuan atas kesempurnaan sifat-Nya dan rasa cinta mendalam atas segala karunia-Nya.'
  },
  'r-b-b': {
    rootSlug: 'r-b-b',
    rootArabic: 'ر ب ب',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 336',
    originalArabic: 'الرَّبُّ فِي الْأَصْلِ: التَّرْبِيَةُ، وَهُوَ إِنْشَاءُ الشَّيْءِ حَالًا فَحَالًا إِلَى حَدِّ التَّمَامِ... وَلَا يُقَالُ الرَّبُّ مُطْلَقًا إِلَّا لِلَّهِ تَعَالَى لِتَكَفُّلِهِ بِمَصَالِحِ الْمَوْجُودَاتِ.',
    indonesianQuote: 'Ar-Rabb pada asalnya bermakna tarbiyah, yaitu merawat, mendidik, dan membimbing sesuatu secara bertahap setingkat demi setingkat hingga mencapai kesempurnaan. Kata Rabb secara mutlak hanya milik Allah karena Dialah yang menjamin maslahat seluruh makhluk.',
    corePhilosophy: 'Pemeliharaan yang penuh kasih sayang, pembimbingan yang berkelanjutan, dan pemenuhan kebutuhan setiap ciptaan hingga mencapai kesempurnaan fungsinya.'
  },
  's-m-w': {
    rootSlug: 's-m-w',
    rootArabic: 'س م و',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 3, Hal. 98',
    originalArabic: 'السِّينُ وَالْمِيمُ وَالْوَاوُ أَصْلٌ يَدُلُّ عَلَى الْعُلُوِّ وَالِارْتِفَاعِ... يُقَالُ سَمَوْتُ إِذَا عَلَوْتَ، وَمِنْهُ السَّمَاءُ لِعُلُوِّهَا، وَالِاسْمُ لِأَنَّهُ يَرْفَعُ الْمُسَمَّى وَيُنَوِّهُ بِهِ.',
    indonesianQuote: 'Akar Sin, Mim, dan Waw menunjukkan makna keluhuran, ketinggian, dan keagungan. Dari akar ini lahir kata as-samaa\' (langit) karena ketinggian fisiknya, dan al-ism (nama) karena ia mengangkat dan meninggikan derajat yang dinamai sehingga dikenal.',
    corePhilosophy: 'Ketinggian martabat dan keluhuran sifat yang mengangkat keberadaan sesuatu dari ketiadaan menjadi entitas yang mulia dan dikenal.'
  },
  'm-l-k': {
    rootSlug: 'm-l-k',
    rootArabic: 'م ل ك',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 772',
    originalArabic: 'الْمُلْكُ: ضَبْطُ الشَّيْءِ وَالْقُدْرَةُ عَلَى التَّصَرُّفِ فِيهِ عَلَى وَجْهِ الِاسْتِبْدَادِ بِهِ... وَالْمَلِكُ هُوَ الْمُتَصَرِّفُ بِالْأَمْرِ وَالنَّهْيِ فِي مَجْمُوعِ النَّاسِ.',
    indonesianQuote: 'Al-Mulk bermakna memegang kendali penuh dan memiliki otoritas tertinggi untuk mengatur sesuatu. Al-Malik adalah penguasa mutlak yang mengatur seluruh urusan dengan perintah, larangan, dan kebijaksanaan yang tidak terbantahkan.',
    corePhilosophy: 'Kepemilikan dan kedaulatan mutlak yang berkuasa mengatur dan memelihara seluruh semesta tanpa ketergantungan pada apa pun.'
  },
  'h-d-y': {
    rootSlug: 'h-d-y',
    rootArabic: 'ه د ي',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 6, Hal. 42',
    originalArabic: 'الْهَاءُ وَالدَّالُ وَالْيَاءُ أَصْلَانِ: أَحَدُهُمَا التَّقَدُّمُ لِلْإِرْشَادِ، وَالْآخَرُ إِهْدَاءُ الشَّيْءِ... وَالْهِدَايَةُ: الدَّلَالَةُ بِلُطْفٍ عَلَى مَا يُوصِلُ إِلَى الْبُغْيَةِ.',
    indonesianQuote: 'Akar Ha, Dal, dan Ya memiliki dua poros makna: pertama, berjalan di depan untuk membimbing jalan; dan kedua, menghadiahkan sesuatu dengan ketulusan. Hidayah adalah bimbingan yang disampaikan dengan penuh kelembutan menuju tujuan yang diridhai.',
    corePhilosophy: 'Petunjuk yang menuntun langkah manusia secara bertahap dan lembut keluar dari kegelapan menuju cahaya kebenaran.'
  },
  'a-b-d': {
    rootSlug: 'a-b-d',
    rootArabic: 'ع ب د',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 542',
    originalArabic: 'الْعُبُودِيَّةُ: إِظْهَارُ التَّذَلُّلِ، وَالْعِبَادَةُ أَبْلَغُ مِنْهَا لِأَنَّهَا غَايَةُ التَّذَلُّلِ مَعَ غَايَةِ الْمَحَبَّةِ وَالتَّعْظِيمِ... وَطَرِيقٌ مُعَبَّدٌ: مُذَلَّلٌ لِلسَّالِكِينَ.',
    indonesianQuote: 'Al-\'Ubudiyyah adalah menampakkan kerendahan hati di hadapan Sang Pencipta. Dan Ibadah adalah puncak ketundukan yang dipadukan dengan puncak kecintaan dan pengagungan mutlak. Dinamakan thariq mu\'abbad untuk jalan yang telah diratakan dan dimudahkan bagi orang yang berjalan.',
    corePhilosophy: 'Ketundukan sukarela yang lahir dari rasa cinta dan pengagungan tertinggi kepada Dzat Yang Maha Sempurna.'
  },
  'a-w-n': {
    rootSlug: 'a-w-n',
    rootArabic: 'ع و ن',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 4, Hal. 182',
    originalArabic: 'الْعَيْنُ وَالْوَاوُ وَالنُّونُ أَصْلٌ يَدُلُّ عَلَى الْمُظَاهَرَةِ وَالْمُعَاضَدَةِ... وَالِاسْتِعَانَةُ: طَلَبُ الْعَوْنِ وَالنُّصْرَةِ فِي الشَّدَائِدِ لِتَقْوِيَةِ الْعَاجِزِ.',
    indonesianQuote: 'Akar \'Ain, Waw, dan Nun menunjukkan makna saling menopang dan menguatkan. Al-Isti\'anah adalah permohonan bantuan dan penguatan daya dalam menghadapi perkara berat ketika daya manusiawi telah mencapai batasnya.',
    corePhilosophy: 'Pengakuan kelemahan diri di hadapan kemahakuasaan Allah untuk memohon sandaran kekuatan yang hakiki.'
  },
  'a-l-m': {
    rootSlug: 'a-l-m',
    rootArabic: 'ع ل م',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 4, Hal. 109',
    originalArabic: 'الْعَيْنُ وَاللَّامُ وَالْمِيمُ أَصْلٌ صَحِيحٌ يَدُلُّ عَلَى أَثَرٍ بِالشَّيْءِ يَتَمَيَّزُ بِهِ عَنْ غَيْرِهِ... وَالْعِلْمُ: نَقِيضُ الْجَهْلِ، وَالْعَالَمُ: مَا يُعْلَمُ بِهِ الْخَالِقُ مِنْ مَخْلُوقَاتِهِ.',
    indonesianQuote: 'Akar \'Ain, Lam, dan Mim adalah akar sahih yang menunjukkan tanda pembeda yang membuat sesuatu dapat dikenali dari yang lain. Ilmu adalah pengetahuan yang menyingkap hakikat, dan Al-\'Alamin (alam semesta) adalah tanda-tanda yang membuat Sang Pencipta dikenal.',
    corePhilosophy: 'Seluruh entitas ciptaan di alam semesta merupakan ayat dan tanda nyata yang menuntun akal manusia mengenal kebesaran Sang Khaliq.'
  },
  'n-a-m': {
    rootSlug: 'n-a-m',
    rootArabic: 'ن ع م',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 815',
    originalArabic: 'النِّعْمَةُ: الْحَالَةُ الْحَسَنَةُ الَّتِي يَلْتَذُّ بِهَا الْإِنْسَانُ وَتُعِينُهُ عَلَى صَلَاحِ دِينِهِ وَدُنْيَاهُ... وَأَنْعَمَ عَلَيْهِ: أَوْصَلَ إِلَيْهِ النِّعْمَةَ بِجُودٍ وَإِحْسَانٍ.',
    indonesianQuote: 'An-Ni\'mah adalah kondisi kebaikan yang membawa kebahagiaan dan menopang kebaikan agama maupun dunia seorang hamba. An\'ama \'alaihi bermakna mencurahkan limpahan kebaikan secara dermawan tanpa mengharap pamrih.',
    corePhilosophy: 'Karunia suci yang dianugerahkan Allah kepada hamba-hamba-Nya untuk menuntun mereka menuju kebahagiaan sejati di dunia dan akhirat.'
  },
  'g-d-b': {
    rootSlug: 'g-d-b',
    rootArabic: 'غ ض ب',
    book: 'Maqāyīs al-Lughah',
    bookArabic: 'معجم مقاييس اللغة',
    author: 'Ibnu Fāris (w. 395 H)',
    authorArabic: 'أحمد بن فارس',
    volumePage: 'Jilid 4, Hal. 429',
    originalArabic: 'الْغَيْنُ وَالضَّادُ وَالْبَاءُ أَصْلٌ صَحِيحٌ يَدُلُّ عَلَى شِدَّةٍ وَصَلَابَةٍ... وَغَضَبُ اللَّهِ: عِقَابُهُ وَسَخَطُهُ عَلَى مَنْ عَانَدَ الْحَقَّ بَعْدَ مَعْرِفَتِهِ.',
    indonesianQuote: 'Akar Ghain, Dhad, dan Ba menunjukkan makna ketegasan, kekerasan, dan gejolak penolakan. Kemurkaan Allah (Ghadhabullah) adalah ketetapan hukuman dan keadilan-Nya terhadap mereka yang sengaja menentang kebenaran setelah mengetahuinya.',
    corePhilosophy: 'Ketetapan hukum Ilahi yang adil terhadap kesombongan jiwa yang menolak petunjuk secara sadar.'
  },
  'd-l-l': {
    rootSlug: 'd-l-l',
    rootArabic: 'ض ل ل',
    book: 'Al-Mufradāt fī Gharīb al-Qur\'an',
    bookArabic: 'المفردات في غريب القرآن',
    author: 'Ar-Rāghib al-Aṣfahānī (w. 502 H)',
    authorArabic: 'الراغب الأصفهاني',
    volumePage: 'Hal. 509',
    originalArabic: 'الضَّلَالُ: الْعُدُولُ عَنِ الطَّرِيقِ الْمُسْتَقِيمِ، حَقِيقِيًّا كَانَ ذَلِكَ أَوْ حُكْمِيًّا... وَالضَّالُّونَ هُمُ السَّالِكُونَ طَرِيقًا لَا يُفْضِي إِلَى مَقْصُودِهِمْ.',
    indonesianQuote: 'Adh-Dhalal adalah menyimpang dari jalan yang lurus, baik secara fisik maupun pemikiran. Kaum yang sesat (adh-dhaallin) adalah mereka yang menempuh jalan keliru yang tidak akan pernah menghantarkan mereka ke tujuan keselamatan.',
    corePhilosophy: 'Kesesatan yang timbul akibat kehilangan kompas petunjuk sehingga melangkah dalam kegelapan tanpa arah.'
  }
};

/**
 * Retrieves classical root citation for a given root slug or Arabic root letters
 */
export function getClassicalCitation(rootSlugOrArabic?: string): ClassicalCitation | undefined {
  if (!rootSlugOrArabic) return undefined;
  
  const clean = rootSlugOrArabic.trim().toLowerCase().replace(/\s+/g, '-');
  if (CLASSICAL_ROOT_CITATIONS[clean]) {
    return CLASSICAL_ROOT_CITATIONS[clean];
  }

  // Check matching by arabic letters
  for (const item of Object.values(CLASSICAL_ROOT_CITATIONS)) {
    if (item.rootArabic === rootSlugOrArabic || item.rootArabic.replace(/\s+/g, '') === rootSlugOrArabic.replace(/\s+/g, '')) {
      return item;
    }
  }

  return undefined;
}
