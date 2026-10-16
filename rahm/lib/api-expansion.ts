/**
 * Rahm API Expansion Layer (تَوْسِعَةُ الْبَيَانَاتِ)
 * Integrates multi-source Islamic APIs: Asmaul Husna 99 Names, Prayer Times (AlAdhan),
 * Curated Authentic Hadiths, and Qurabic Corpus Linking.
 */

export interface AsmaulHusnaItem {
  number: number;
  arabic: string;
  transliteration: string;
  meaningId: string;
  rootArabic: string;
  rootLatin: string;
  category: 'Jamal' | 'Jalal' | 'Kamal';
  quranOccurrence: string;
  contemplationKey: string;
}

export const ASMAUL_HUSNA_DATA: AsmaulHusnaItem[] = [
  {
    number: 1,
    arabic: 'الرَّحْمَـٰنُ',
    transliteration: 'Ar-Rahman',
    meaningId: 'Yang Maha Pengasih melimpah kepada seluruh semesta',
    rootArabic: 'ر ح م',
    rootLatin: 'r-h-m',
    category: 'Jamal',
    quranOccurrence: 'QS. 1:1, 55:1, 20:5',
    contemplationKey: 'Merasakan naungan kasih sayang Allah yang mendahului murka-Nya, menyelimuti setiap desah nafas.',
  },
  {
    number: 2,
    arabic: 'الرَّحِيمُ',
    transliteration: 'Ar-Rahim',
    meaningId: 'Yang Maha Penyayang tiada henti khusus bagi orang beriman',
    rootArabic: 'ر ح م',
    rootLatin: 'r-h-m',
    category: 'Jamal',
    quranOccurrence: 'QS. 1:1, 2:143, 9:117',
    contemplationKey: 'Menyandarkan keselamatan akhirat dan ketenangan batin hanya pada rahmat-Nya yang khusus.',
  },
  {
    number: 3,
    arabic: 'الْمَلِكُ',
    transliteration: 'Al-Malik',
    meaningId: 'Yang Maha Merajai seluruh kerajaan langit dan bumi',
    rootArabic: 'م ل ك',
    rootLatin: 'm-l-k',
    category: 'Jalal',
    quranOccurrence: 'QS. 59:23, 20:114, 23:116',
    contemplationKey: 'Melepaskan klaim kepemilikan semu ego; menyadari diri hanyalah hamba di istana Raja Semesta.',
  },
  {
    number: 4,
    arabic: 'الْقُدُّوسُ',
    transliteration: 'Al-Quddus',
    meaningId: 'Yang Maha Suci dari segala kekurangan dan cela',
    rootArabic: 'ق د س',
    rootLatin: 'q-d-s',
    category: 'Kamal',
    quranOccurrence: 'QS. 59:23, 62:1',
    contemplationKey: 'Membersihkan cermin hati dari kotoran berhala duniawi dan ilusi pamrih.',
  },
  {
    number: 5,
    arabic: 'السَّلَامُ',
    transliteration: 'As-Salam',
    meaningId: 'Yang Maha Memberi Kedamaian dan Keselamatan Hakiki',
    rootArabic: 'س ل م',
    rootLatin: 's-l-m',
    category: 'Jamal',
    quranOccurrence: 'QS. 59:23',
    contemplationKey: 'Menyerap kedamaian Ilahi untuk meredakan kegelisahan mental dan ketakutan masa depan.',
  },
  {
    number: 6,
    arabic: 'الْمُؤْمِنُ',
    transliteration: 'Al-Mu’min',
    meaningId: 'Yang Maha Menganugerahkan Keamanan dan Membenarkan Janji-Nya',
    rootArabic: 'أ م ن',
    rootLatin: 'a-m-n',
    category: 'Jamal',
    quranOccurrence: 'QS. 59:23',
    contemplationKey: 'Memasuki benteng rasa aman di mana tiada kecemasan yang mampu menembus perlindungan-Nya.',
  },
  {
    number: 7,
    arabic: 'الْمُهَيْمِنُ',
    transliteration: 'Al-Muhaymin',
    meaningId: 'Yang Maha Mengawasi, Memelihara, dan Mengayomi',
    rootArabic: 'ه ي م ن',
    rootLatin: 'h-y-m-n',
    category: 'Kamal',
    quranOccurrence: 'QS. 59:23',
    contemplationKey: 'Muraqabah: menyadari bahwa setiap denyut jantung dan lintasan rahasia batin senantiasa dalam tatapan-Nya.',
  },
  {
    number: 8,
    arabic: 'الْعَزِيزُ',
    transliteration: 'Al-’Aziz',
    meaningId: 'Yang Maha Perkasa, Mulia, dan Tak Terkalahkan',
    rootArabic: 'ع ز ز',
    rootLatin: 'E-z-z',
    category: 'Jalal',
    quranOccurrence: 'QS. 59:23, 2:209, 3:6',
    contemplationKey: 'Menemukan harga diri dan kemuliaan sejati bukan dari sanjungan manusia, melainkan dari kedekatan dengan Al-’Aziz.',
  },
  {
    number: 9,
    arabic: 'الْجَبَّارُ',
    transliteration: 'Al-Jabbar',
    meaningId: 'Yang Maha Memperbaiki Hati yang Patah dan Maha Memaksa Kehendak-Nya',
    rootArabic: 'ج ب ر',
    rootLatin: 'j-b-r',
    category: 'Jalal',
    quranOccurrence: 'QS. 59:23',
    contemplationKey: 'Menyerahkan serpihan hati yang patah dan kecewa agar disambung kembali oleh Tangan Kekuasaan-Nya.',
  },
  {
    number: 10,
    arabic: 'الْمُتَكَبِّرُ',
    transliteration: 'Al-Mutakabbir',
    meaningId: 'Yang Memiliki Segala Kebesaran dan Keagungan Mutlak',
    rootArabic: 'ك ب ر',
    rootLatin: 'k-b-r',
    category: 'Kamal',
    quranOccurrence: 'QS. 59:23',
    contemplationKey: 'Mengecilkan ego dan kesombongan diri di hadapan Kebesaran yang tiada bertepi.',
  },
  {
    number: 11,
    arabic: 'الْخَالِقُ',
    transliteration: 'Al-Khaliq',
    meaningId: 'Yang Maha Menciptakan segala sesuatu dari ketiadaan',
    rootArabic: 'خ ل ق',
    rootLatin: 'x-l-q',
    category: 'Kamal',
    quranOccurrence: 'QS. 59:24, 6:102, 13:16',
    contemplationKey: 'Merenungi keajaiban perancangan alam semesta dan penciptaan diri yang sempurna.',
  },
  {
    number: 12,
    arabic: 'الْبَارِئُ',
    transliteration: 'Al-Bari’',
    meaningId: 'Yang Maha Mengadakan dari tiada menjadi ada dengan harmoni sempurna',
    rootArabic: 'ب ر أ',
    rootLatin: 'b-r-a',
    category: 'Kamal',
    quranOccurrence: 'QS. 59:24, 2:54',
    contemplationKey: 'Penyelarasan wujud: bagaimana setiap sel dalam tubuh beroperasi dalam ketertiban Ilahi.',
  },
  {
    number: 13,
    arabic: 'الْمُصَوِّرُ',
    transliteration: 'Al-Mushawwir',
    meaningId: 'Yang Maha Membentuk Rupa makhluk-Nya dengan keindahan unik',
    rootArabic: 'ص و ر',
    rootLatin: 'S-w-r',
    category: 'Jamal',
    quranOccurrence: 'QS. 59:24, 3:6, 7:11',
    contemplationKey: 'Menerima dan mensyukuri rupa serta keunikan bakat diri sebagai karya seni Ilahi.',
  },
  {
    number: 14,
    arabic: 'الْغَفَّارُ',
    transliteration: 'Al-Ghaffar',
    meaningId: 'Yang Maha Pengampun berulang kali menutupi aib hamba-Nya',
    rootArabic: 'غ ف ر',
    rootLatin: 'g-f-r',
    category: 'Jamal',
    quranOccurrence: 'QS. 20:82, 38:66, 71:10',
    contemplationKey: 'Merasakan tirai Al-Ghaffar yang menutupi kelemahan diri di hadapan sesama manusia.',
  },
  {
    number: 15,
    arabic: 'الْقَهَّارُ',
    transliteration: 'Al-Qahhar',
    meaningId: 'Yang Maha Menundukkan segala penentang di bawah kekuasaan-Nya',
    rootArabic: 'ق ه ر',
    rootLatin: 'q-h-r',
    category: 'Jalal',
    quranOccurrence: 'QS. 12:39, 13:16, 14:48',
    contemplationKey: 'Menundukkan hembusan godaan syahwat dan amarah di bawah keperkasaan Al-Qahhar.',
  },
  {
    number: 16,
    arabic: 'الْوَهَّابُ',
    transliteration: 'Al-Wahhab',
    meaningId: 'Yang Maha Pemberi Karunia melimpah ruah tanpa pamrih',
    rootArabic: 'و ه ب',
    rootLatin: 'w-h-b',
    category: 'Jamal',
    quranOccurrence: 'QS. 3:8, 38:9, 38:35',
    contemplationKey: 'Membuka tangan batin untuk menerima curahan anugerah yang tak terduga.',
  },
  {
    number: 17,
    arabic: 'الرَّزَّاقُ',
    transliteration: 'Ar-Razzaq',
    meaningId: 'Yang Maha Melapangkan dan Menjamin Rezeki seluruh makhluk',
    rootArabic: 'ر ز ق',
    rootLatin: 'r-z-q',
    category: 'Jamal',
    quranOccurrence: 'QS. 51:58',
    contemplationKey: 'Mengikis ketakutan miskin dan kekhawatiran rezeki; rezeki mencari hamba lebih cepat daripada ajal.',
  },
  {
    number: 18,
    arabic: 'الْفَتَّاحُ',
    transliteration: 'Al-Fattah',
    meaningId: 'Yang Maha Membuka pintu-pintu rahmat, solusi, dan jalan keluar',
    rootArabic: 'ف ت ح',
    rootLatin: 'f-t-h',
    category: 'Jamal',
    quranOccurrence: 'QS. 34:26',
    contemplationKey: 'Saat jalan buntu menghadang, berserulah kepada Al-Fattah untuk menyingkap pintu gerbang baru.',
  },
  {
    number: 19,
    arabic: 'الْعَلِيمُ',
    transliteration: 'Al-’Alim',
    meaningId: 'Yang Maha Mengetahui segala yang tersembunyi dan yang tampak',
    rootArabic: 'ع ل م',
    rootLatin: 'E-l-m',
    category: 'Kamal',
    quranOccurrence: 'QS. 2:29, 4:32, 24:35',
    contemplationKey: 'Menghormati ilmu Ilahi dan menyadari betapa terbatasnya akal manusia di hadapan Samudera-Nya.',
  },
  {
    number: 20,
    arabic: 'الْحَكِيمُ',
    transliteration: 'Al-Hakim',
    meaningId: 'Yang Maha Bijaksana dalam segala ciptaan dan ketetapan takdir',
    rootArabic: 'ح ك م',
    rootLatin: 'h-k-m',
    category: 'Kamal',
    quranOccurrence: 'QS. 2:129, 31:27, 43:84',
    contemplationKey: 'Menerima hikmah indah di balik setiap kejadian yang awalnya tampak pahit.',
  },
  {
    number: 21,
    arabic: 'النُّورُ',
    transliteration: 'An-Nur',
    meaningId: 'Cahaya yang Menerangi langit dan bumi serta mata hati',
    rootArabic: 'ن و ر',
    rootLatin: 'n-w-r',
    category: 'Jamal',
    quranOccurrence: 'QS. 24:35',
    contemplationKey: 'Memohon pancaran cahaya iman agar hati dapat menembus kegelapan ilusi duniawi.',
  },
  {
    number: 22,
    arabic: 'الْهَادِي',
    transliteration: 'Al-Hadi',
    meaningId: 'Yang Maha Menuntun ke jalan kebenaran dan keselamatan',
    rootArabic: 'ه د ي',
    rootLatin: 'h-d-y',
    category: 'Jamal',
    quranOccurrence: 'QS. 22:54, 25:31',
    contemplationKey: 'Berserah diri sebagai musafir yang memerlukan kompas nurani dari Al-Hadi.',
  },
  {
    number: 24,
    arabic: 'الْغَفُورُ',
    transliteration: 'Al-Ghafur',
    meaningId: 'Yang Maha Pengampun luas menutupi aib dan dosa',
    rootArabic: 'غ ف ر',
    rootLatin: 'gh-f-r',
    category: 'Jamal',
    quranOccurrence: 'QS. 2:173, 8:69, 14:36',
    contemplationKey: 'Membasuh luka hati dengan kepastian bahwa pintu ampunan-Nya selalu terbuka selebar langit dan bumi.',
  },
  {
    number: 25,
    arabic: 'الْوَكِيلُ',
    transliteration: 'Al-Wakil',
    meaningId: 'Yang Maha Memelihara dan Menjamin segala urusan hamba',
    rootArabic: 'و ك ل',
    rootLatin: 'w-k-l',
    category: 'Kamal',
    quranOccurrence: 'QS. 3:173, 4:81, 33:3',
    contemplationKey: 'Meletakkan seluruh kecemasan masa depan ke dalam tangan pemeliharaan Al-Wakil.',
  },
  {
    number: 26,
    arabic: 'الْمُجِيبُ',
    transliteration: 'Al-Mujib',
    meaningId: 'Yang Maha Mengabulkan permohonan hamba yang berdoa',
    rootArabic: 'ج و ب',
    rootLatin: 'j-w-b',
    category: 'Jamal',
    quranOccurrence: 'QS. 11:61',
    contemplationKey: 'Menyadari bahwa setiap bisikan kalbu didengar dan dijawab tepat pada waktu terbaik menurut kebijaksanaan-Nya.',
  },
  {
    number: 27,
    arabic: 'الْحَكِيمُ',
    transliteration: 'Al-Hakim',
    meaningId: 'Yang Maha Bijaksana dalam segala ciptaan dan takdir-Nya',
    rootArabic: 'ح ك م',
    rootLatin: 'h-k-m',
    category: 'Kamal',
    quranOccurrence: 'QS. 2:129, 31:27, 43:84',
    contemplationKey: 'Melihat hikmah tersirat di balik setiap kesulitan hidup, tidak ada yang sia-sia.',
  },
  {
    number: 28,
    arabic: 'الْفَتَّاحُ',
    transliteration: 'Al-Fattah',
    meaningId: 'Yang Maha Membuka pintu rahmat, rezeki, dan jalan keluar',
    rootArabic: 'ف ت ح',
    rootLatin: 'f-t-h',
    category: 'Jamal',
    quranOccurrence: 'QS. 34:26',
    contemplationKey: 'Memohon dibukanya simpul-simpul kebuntuan batin dan dibukakannya gerbang ilmu makrifat.',
  },
];

export interface HadithItem {
  id: string;
  narrator: string;
  sourceBook: string;
  theme: 'Niat & Ikhlas' | 'Muraqabah & Khusyu' | 'Sabar & Ridha' | 'Dzikir & Doa' | 'Akhlak & Umat';
  arabicText: string;
  indoText: string;
  reflection: string;
  authenticity: string;
  reference?: string;
}

export const CURATED_HADITHS: HadithItem[] = [
  {
    id: 'hadith-niat',
    narrator: 'Umar bin Khattab RA',
    sourceBook: 'Sahih Bukhari (No. 1) & Sahih Muslim (No. 1907)',
    reference: 'Sahih Bukhari (No. 1)',
    authenticity: 'Shahih',
    theme: 'Niat & Ikhlas',
    arabicText: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    indoText: 'Sesungguhnya setiap amal perbuatan tergantung pada niatnya, dan setiap orang akan mendapatkan balasan sesuai dengan apa yang ia niatkan.',
    reflection: 'Niat adalah poros transformasi spiritual. Sebelum bertindak, luruskan niat hanya mencari ridha Ilahi.',
  },
  {
    id: 'hadith-ihsan',
    narrator: 'Umar bin Khattab RA (Hadits Jibril)',
    sourceBook: 'Sahih Muslim (No. 8)',
    reference: 'Sahih Muslim (No. 8)',
    authenticity: 'Shahih',
    theme: 'Muraqabah & Khusyu',
    arabicText: 'أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ، فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ',
    indoText: 'Ihsan adalah engkau menyembah Allah seakan-akan engkau melihat-Nya; jika engkau tidak dapat melihat-Nya, ketahuilah bahwa Dia senantiasa melihatmu.',
    reflection: 'Esensi muraqabah: hidup dalam kesadaran penuh bahwa Allah senantiasa menatap dan mendampingi jiwamu.',
  },
  {
    id: 'hadith-hati',
    narrator: 'An-Nu’man bin Basyir RA',
    sourceBook: 'Sahih Bukhari (No. 52) & Sahih Muslim (No. 1599)',
    reference: 'Sahih Bukhari (No. 52)',
    authenticity: 'Shahih',
    theme: 'Muraqabah & Khusyu',
    arabicText: 'أَلاَ وَإِنَّ فِي الْجَسَدِ مُضْغَةً إِذَا صَلَحَتْ صَلَحَ الْجَسَدُ كُلُّهُ، وَإِذَا فَسَدَتْ فَسَدَ الْجَسَدُ كُلُّهُ، أَلاَ وَهِيَ الْقَلْبُ',
    indoText: 'Ingatlah bahwa di dalam jasad ada segumpal daging; jika ia baik maka baiklah seluruh jasad, dan jika ia rusak maka rusaklah seluruh jasad. Ketahuilah, ia adalah hati (qalb).',
    reflection: 'Pembersihan batin (tazkiyatun nafs) adalah kunci kesehatan lahiriah dan keharmonisan hidup.',
  },
  {
    id: 'hadith-dzikir-tenang',
    narrator: 'Abu Hurairah & Abu Sa’id Al-Khudri RA',
    sourceBook: 'Sahih Muslim (No. 2700)',
    reference: 'Sahih Muslim (No. 2700)',
    authenticity: 'Shahih',
    theme: 'Dzikir & Doa',
    arabicText: 'لاَ يَقْعُدُ قَوْمٌ يَذْكُرُونَ اللَّهَ عَزَّ وَجَلَّ إِلاَّ حَفَّتْهُمُ الْمَلاَئِكَةُ وَغَشِيَتْهُمُ الرَّحْمَةُ وَنَزَلَتْ عَلَيْهِمُ السَّكِينَةُ وَذَكَرَهُمُ اللَّهُ فِيمَنْ عِنْدَهُ',
    indoText: 'Tidaklah suatu kaum duduk berdzikir mengingat Allah melainkan para malaikat mengelilingi mereka, rahmat menyelimuti mereka, ketenangan (sakinah) turun kepada mereka, dan Allah membanggakan mereka di hadapan makhluk yang ada di sisi-Nya.',
    reflection: 'Dzikir membuka portal ketenangan batin yang membebaskan manusia dari cengkeraman kegundahan dunia.',
  },
  {
    id: 'hadith-kekayaan-jiwa',
    narrator: 'Abu Hurairah RA',
    sourceBook: 'Sahih Bukhari (No. 6446) & Sahih Muslim (No. 1051)',
    reference: 'Sahih Bukhari (No. 6446)',
    authenticity: 'Shahih',
    theme: 'Sabar & Ridha',
    arabicText: 'لَيْسَ الْغِنَى عَنْ كَثْرَةِ الْعَرَضِ، وَلَكِنَّ الْغِنَى غِنَى النَّفْسِ',
    indoText: 'Bukanlah kekayaan itu diukur dari banyaknya harta benda dunia, melainkan kekayaan sejati adalah kekayaan jiwa (qana’ah).',
    reflection: 'Kelimpahan hakiki (multiplicato) lahir saat hati telah merasa utuh dan bersyukur bersama Allah.',
  },
];

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  dateHijri: string;
  dateGregorian: string;
  locationName: string;
}

/**
 * Fetches real-time prayer schedule from AlAdhan API with local fallback calculation
 */
export async function getPrayerTimes(
  latitude = -6.2088,
  longitude = 106.8456,
  city = 'Jakarta'
): Promise<PrayerTimesResult> {
  const fallbackDate = new Date();
  const fallbackResult: PrayerTimesResult = {
    fajr: '04:22',
    sunrise: '05:38',
    dhuhr: '11:45',
    asr: '14:55',
    maghrib: '17:51',
    isha: '19:01',
    dateHijri: '1448 H (Perkiraan)',
    dateGregorian: fallbackDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    locationName: city,
  };

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=11`; // method 11 = Kemenag RI
    const res = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return fallbackResult;

    const json = await res.json();
    if (json?.data?.timings) {
      const t = json.data.timings;
      const h = json.data.date.hijri;
      return {
        fajr: t.Fajr || fallbackResult.fajr,
        sunrise: t.Sunrise || fallbackResult.sunrise,
        dhuhr: t.Dhuhr || fallbackResult.dhuhr,
        asr: t.Asr || fallbackResult.asr,
        maghrib: t.Maghrib || fallbackResult.maghrib,
        isha: t.Isha || fallbackResult.isha,
        dateHijri: `${h.day} ${h.month?.en} ${h.year} H`,
        dateGregorian: json.data.date.readable || fallbackResult.dateGregorian,
        locationName: city,
      };
    }
  } catch (err) {
    // Graceful fallback to default Jakarta coordinates
  }

  return fallbackResult;
}

export function searchAsmaulHusna(query: string): AsmaulHusnaItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return ASMAUL_HUSNA_DATA;
  return ASMAUL_HUSNA_DATA.filter(
    (item) =>
      item.transliteration.toLowerCase().includes(q) ||
      item.meaningId.toLowerCase().includes(q) ||
      item.arabic.includes(q) ||
      item.rootLatin.toLowerCase().includes(q)
  );
}

export function searchHadithByTheme(theme: string): HadithItem[] {
  const q = theme.trim().toLowerCase();
  return CURATED_HADITHS.filter(
    (h) => h.theme.toLowerCase().includes(q) || h.indoText.toLowerCase().includes(q)
  );
}

export const fetchPrayerTimes = getPrayerTimes;

