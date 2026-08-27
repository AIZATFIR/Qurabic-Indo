export interface SurahMeta {
  number: number;
  nameIndo: string;
  nameArabic: string;
  transliteration: string;
  translationId: string;
  ayahsCount: number;
  revelationType: 'Makkiyyah' | 'Madaniyyah';
}

export const SURAH_LIST: SurahMeta[] = [
  { number: 1, nameIndo: 'Al-Fatihah', nameArabic: 'الفاتحة', transliteration: 'Al-Fatihah', translationId: 'Pembukaan', ayahsCount: 7, revelationType: 'Makkiyyah' },
  { number: 2, nameIndo: 'Al-Baqarah', nameArabic: 'البقرة', transliteration: 'Al-Baqarah', translationId: 'Sapi Betina', ayahsCount: 286, revelationType: 'Madaniyyah' },
  { number: 3, nameIndo: 'Ali \'Imran', nameArabic: 'آل عمران', transliteration: 'Ali \'Imran', translationId: 'Keluarga Imran', ayahsCount: 200, revelationType: 'Madaniyyah' },
  { number: 4, nameIndo: 'An-Nisa\'', nameArabic: 'النساء', transliteration: 'An-Nisa\'', translationId: 'Wanita', ayahsCount: 176, revelationType: 'Madaniyyah' },
  { number: 5, nameIndo: 'Al-Ma\'idah', nameArabic: 'المائدة', transliteration: 'Al-Ma\'idah', translationId: 'Hidangan', ayahsCount: 120, revelationType: 'Madaniyyah' },
  { number: 6, nameIndo: 'Al-An\'am', nameArabic: 'الأنعام', transliteration: 'Al-An\'am', translationId: 'Binatang Ternak', ayahsCount: 165, revelationType: 'Makkiyyah' },
  { number: 7, nameIndo: 'Al-A\'raf', nameArabic: 'الأعراف', transliteration: 'Al-A\'raf', translationId: 'Tempat Tertinggi', ayahsCount: 206, revelationType: 'Makkiyyah' },
  { number: 8, nameIndo: 'Al-Anfal', nameArabic: 'الأنفال', transliteration: 'Al-Anfal', translationId: 'Rampasan Perang', ayahsCount: 75, revelationType: 'Madaniyyah' },
  { number: 9, nameIndo: 'At-Taubah', nameArabic: 'التوبة', transliteration: 'At-Taubah', translationId: 'Pengampunan', ayahsCount: 129, revelationType: 'Madaniyyah' },
  { number: 10, nameIndo: 'Yunus', nameArabic: 'يونس', transliteration: 'Yunus', translationId: 'Nabi Yunus', ayahsCount: 109, revelationType: 'Makkiyyah' },
  { number: 11, nameIndo: 'Hud', nameArabic: 'هود', transliteration: 'Hud', translationId: 'Nabi Hud', ayahsCount: 123, revelationType: 'Makkiyyah' },
  { number: 12, nameIndo: 'Yusuf', nameArabic: 'يوسف', transliteration: 'Yusuf', translationId: 'Nabi Yusuf', ayahsCount: 111, revelationType: 'Makkiyyah' },
  { number: 13, nameIndo: 'Ar-Ra\'d', nameArabic: 'الرعد', transliteration: 'Ar-Ra\'d', translationId: 'Guruh', ayahsCount: 43, revelationType: 'Madaniyyah' },
  { number: 14, nameIndo: 'Ibrahim', nameArabic: 'إبراهيم', transliteration: 'Ibrahim', translationId: 'Nabi Ibrahim', ayahsCount: 52, revelationType: 'Makkiyyah' },
  { number: 15, nameIndo: 'Al-Hijr', nameArabic: 'الحجر', transliteration: 'Al-Hijr', translationId: 'Gunung Al-Hijr', ayahsCount: 99, revelationType: 'Makkiyyah' },
  { number: 16, nameIndo: 'An-Nahl', nameArabic: 'النحل', transliteration: 'An-Nahl', translationId: 'Lebah', ayahsCount: 128, revelationType: 'Makkiyyah' },
  { number: 17, nameIndo: 'Al-Isra\'', nameArabic: 'الإسراء', transliteration: 'Al-Isra\'', translationId: 'Perjalanan Malam', ayahsCount: 111, revelationType: 'Makkiyyah' },
  { number: 18, nameIndo: 'Al-Kahf', nameArabic: 'الكهف', transliteration: 'Al-Kahf', translationId: 'Penghuni Gua', ayahsCount: 110, revelationType: 'Makkiyyah' },
  { number: 19, nameIndo: 'Maryam', nameArabic: 'مريم', transliteration: 'Maryam', translationId: 'Siti Maryam', ayahsCount: 98, revelationType: 'Makkiyyah' },
  { number: 20, nameIndo: 'Taha', nameArabic: 'طه', transliteration: 'Taha', translationId: 'Ta Ha', ayahsCount: 135, revelationType: 'Makkiyyah' },
  { number: 21, nameIndo: 'Al-Anbiya\'', nameArabic: 'الأنبياء', transliteration: 'Al-Anbiya\'', translationId: 'Para Nabi', ayahsCount: 112, revelationType: 'Makkiyyah' },
  { number: 22, nameIndo: 'Al-Hajj', nameArabic: 'الحج', transliteration: 'Al-Hajj', translationId: 'Haji', ayahsCount: 78, revelationType: 'Madaniyyah' },
  { number: 23, nameIndo: 'Al-Mu\'minun', nameArabic: 'المؤمنون', transliteration: 'Al-Mu\'minun', translationId: 'Orang-Orang Mukmin', ayahsCount: 118, revelationType: 'Makkiyyah' },
  { number: 24, nameIndo: 'An-Nur', nameArabic: 'النور', transliteration: 'An-Nur', translationId: 'Cahaya', ayahsCount: 64, revelationType: 'Madaniyyah' },
  { number: 25, nameIndo: 'Al-Furqan', nameArabic: 'الفرقان', transliteration: 'Al-Furqan', translationId: 'Pembeda', ayahsCount: 77, revelationType: 'Makkiyyah' },
  { number: 26, nameIndo: 'Asy-Syu\'ara\'', nameArabic: 'الشعراء', transliteration: 'Asy-Syu\'ara\'', translationId: 'Para Penyair', ayahsCount: 227, revelationType: 'Makkiyyah' },
  { number: 27, nameIndo: 'An-Naml', nameArabic: 'النمل', transliteration: 'An-Naml', translationId: 'Semut', ayahsCount: 93, revelationType: 'Makkiyyah' },
  { number: 28, nameIndo: 'Al-Qasas', nameArabic: 'القصص', transliteration: 'Al-Qasas', translationId: 'Kisah-Kisah', ayahsCount: 88, revelationType: 'Makkiyyah' },
  { number: 29, nameIndo: 'Al-\'Ankabut', nameArabic: 'العنكبوت', transliteration: 'Al-\'Ankabut', translationId: 'Laba-Laba', ayahsCount: 69, revelationType: 'Makkiyyah' },
  { number: 30, nameIndo: 'Ar-Rum', nameArabic: 'الروم', transliteration: 'Ar-Rum', translationId: 'Bangsa Romawi', ayahsCount: 60, revelationType: 'Makkiyyah' },
  { number: 31, nameIndo: 'Luqman', nameArabic: 'لقمان', transliteration: 'Luqman', translationId: 'Keluarga Luqman', ayahsCount: 34, revelationType: 'Makkiyyah' },
  { number: 32, nameIndo: 'As-Sajdah', nameArabic: 'السجدة', transliteration: 'As-Sajdah', translationId: 'Sujud', ayahsCount: 30, revelationType: 'Makkiyyah' },
  { number: 33, nameIndo: 'Al-Ahzab', nameArabic: 'الأحزاب', transliteration: 'Al-Ahzab', translationId: 'Golongan yang Bersekutu', ayahsCount: 73, revelationType: 'Madaniyyah' },
  { number: 34, nameIndo: 'Saba\'', nameArabic: 'سبأ', transliteration: 'Saba\'', translationId: 'Kaum Saba\'', ayahsCount: 54, revelationType: 'Makkiyyah' },
  { number: 35, nameIndo: 'Fatir', nameArabic: 'فاطر', transliteration: 'Fatir', translationId: 'Pencipta', ayahsCount: 45, revelationType: 'Makkiyyah' },
  { number: 36, nameIndo: 'Yasin', nameArabic: 'يس', transliteration: 'Yasin', translationId: 'Ya Sin', ayahsCount: 83, revelationType: 'Makkiyyah' },
  { number: 37, nameIndo: 'As-Saffat', nameArabic: 'الصافات', transliteration: 'As-Saffat', translationId: 'Barisan-Barisan', ayahsCount: 182, revelationType: 'Makkiyyah' },
  { number: 38, nameIndo: 'Sad', nameArabic: 'ص', transliteration: 'Sad', translationId: 'Shad', ayahsCount: 88, revelationType: 'Makkiyyah' },
  { number: 39, nameIndo: 'Az-Zumar', nameArabic: 'الزمر', transliteration: 'Az-Zumar', translationId: 'Rombongan-Rombongan', ayahsCount: 75, revelationType: 'Makkiyyah' },
  { number: 40, nameIndo: 'Ghafir', nameArabic: 'غافر', transliteration: 'Ghafir', translationId: 'Yang Mengampuni', ayahsCount: 85, revelationType: 'Makkiyyah' },
  { number: 41, nameIndo: 'Fussilat', nameArabic: 'فصلت', transliteration: 'Fussilat', translationId: 'Yang Dijelaskan', ayahsCount: 54, revelationType: 'Makkiyyah' },
  { number: 42, nameIndo: 'Asy-Syura', nameArabic: 'الشورى', transliteration: 'Asy-Syura', translationId: 'Musyawarah', ayahsCount: 53, revelationType: 'Makkiyyah' },
  { number: 43, nameIndo: 'Az-Zukhruf', nameArabic: 'الزخرف', transliteration: 'Az-Zukhruf', translationId: 'Perhiasan', ayahsCount: 89, revelationType: 'Makkiyyah' },
  { number: 44, nameIndo: 'Ad-Dukhan', nameArabic: 'الدخان', transliteration: 'Ad-Dukhan', translationId: 'Kabut', ayahsCount: 59, revelationType: 'Makkiyyah' },
  { number: 45, nameIndo: 'Al-Jasiyah', nameArabic: 'الجاثية', transliteration: 'Al-Jasiyah', translationId: 'Yang Berlutut', ayahsCount: 37, revelationType: 'Makkiyyah' },
  { number: 46, nameIndo: 'Al-Ahqaf', nameArabic: 'الأحقاف', transliteration: 'Al-Ahqaf', translationId: 'Bukit-Bukit Pasir', ayahsCount: 35, revelationType: 'Makkiyyah' },
  { number: 47, nameIndo: 'Muhammad', nameArabic: 'محمد', transliteration: 'Muhammad', translationId: 'Nabi Muhammad', ayahsCount: 38, revelationType: 'Madaniyyah' },
  { number: 48, nameIndo: 'Al-Fath', nameArabic: 'الفتح', transliteration: 'Al-Fath', translationId: 'Kemenangan', ayahsCount: 29, revelationType: 'Madaniyyah' },
  { number: 49, nameIndo: 'Al-Hujurat', nameArabic: 'الحجرات', transliteration: 'Al-Hujurat', translationId: 'Kamar-Kamar', ayahsCount: 18, revelationType: 'Madaniyyah' },
  { number: 50, nameIndo: 'Qaf', nameArabic: 'ق', transliteration: 'Qaf', translationId: 'Qaf', ayahsCount: 45, revelationType: 'Makkiyyah' },
  { number: 51, nameIndo: 'Az-Zariyat', nameArabic: 'الذاريات', transliteration: 'Az-Zariyat', translationId: 'Angin yang Menerbangkan', ayahsCount: 60, revelationType: 'Makkiyyah' },
  { number: 52, nameIndo: 'At-Tur', nameArabic: 'الطور', transliteration: 'At-Tur', translationId: 'Bukit', ayahsCount: 49, revelationType: 'Makkiyyah' },
  { number: 53, nameIndo: 'An-Najm', nameArabic: 'النجم', transliteration: 'An-Najm', translationId: 'Bintang', ayahsCount: 62, revelationType: 'Makkiyyah' },
  { number: 54, nameIndo: 'Al-Qamar', nameArabic: 'القمر', transliteration: 'Al-Qamar', translationId: 'Bulan', ayahsCount: 55, revelationType: 'Makkiyyah' },
  { number: 55, nameIndo: 'Ar-Rahman', nameArabic: 'الرحمن', transliteration: 'Ar-Rahman', translationId: 'Yang Maha Pemurah', ayahsCount: 78, revelationType: 'Madaniyyah' },
  { number: 56, nameIndo: 'Al-Waqi\'ah', nameArabic: 'الواقعة', transliteration: 'Al-Waqi\'ah', translationId: 'Hari Kiamat', ayahsCount: 96, revelationType: 'Makkiyyah' },
  { number: 57, nameIndo: 'Al-Hadid', nameArabic: 'الحديد', transliteration: 'Al-Hadid', translationId: 'Besi', ayahsCount: 29, revelationType: 'Madaniyyah' },
  { number: 58, nameIndo: 'Al-Mujadilah', nameArabic: 'المجادلة', transliteration: 'Al-Mujadilah', translationId: 'Wanita yang Mengajukan Gugatan', ayahsCount: 22, revelationType: 'Madaniyyah' },
  { number: 59, nameIndo: 'Al-Hasyr', nameArabic: 'الحشر', transliteration: 'Al-Hasyr', translationId: 'Pengusiran', ayahsCount: 24, revelationType: 'Madaniyyah' },
  { number: 60, nameIndo: 'Al-Mumtahanah', nameArabic: 'الممتحنة', transliteration: 'Al-Mumtahanah', translationId: 'Wanita yang Diuji', ayahsCount: 13, revelationType: 'Madaniyyah' },
  { number: 61, nameIndo: 'As-Saff', nameArabic: 'الصف', transliteration: 'As-Saff', translationId: 'Barisan', ayahsCount: 14, revelationType: 'Madaniyyah' },
  { number: 62, nameIndo: 'Al-Jumu\'ah', nameArabic: 'الجمعة', transliteration: 'Al-Jumu\'ah', translationId: 'Hari Jum\'at', ayahsCount: 11, revelationType: 'Madaniyyah' },
  { number: 63, nameIndo: 'Al-Munafiqun', nameArabic: 'المنافقون', transliteration: 'Al-Munafiqun', translationId: 'Orang-Orang Munafik', ayahsCount: 11, revelationType: 'Madaniyyah' },
  { number: 64, nameIndo: 'At-Taghabun', nameArabic: 'التغابن', transliteration: 'At-Taghabun', translationId: 'Hari Dinampakkan Kesalahan', ayahsCount: 18, revelationType: 'Madaniyyah' },
  { number: 65, nameIndo: 'At-Talaq', nameArabic: 'الطلاق', transliteration: 'At-Talaq', translationId: 'Talak', ayahsCount: 12, revelationType: 'Madaniyyah' },
  { number: 66, nameIndo: 'At-Tahrim', nameArabic: 'التحريم', transliteration: 'At-Tahrim', translationId: 'Mengharamkan', ayahsCount: 12, revelationType: 'Madaniyyah' },
  { number: 67, nameIndo: 'Al-Mulk', nameArabic: 'الملك', transliteration: 'Al-Mulk', translationId: 'Kerajaan', ayahsCount: 30, revelationType: 'Makkiyyah' },
  { number: 68, nameIndo: 'Al-Qalam', nameArabic: 'القلم', transliteration: 'Al-Qalam', translationId: 'Pena', ayahsCount: 52, revelationType: 'Makkiyyah' },
  { number: 69, nameIndo: 'Al-Haqqah', nameArabic: 'الحاقة', transliteration: 'Al-Haqqah', translationId: 'Hari Kiamat', ayahsCount: 52, revelationType: 'Makkiyyah' },
  { number: 70, nameIndo: 'Al-Ma\'arij', nameArabic: 'المعارج', transliteration: 'Al-Ma\'arij', translationId: 'Tempat Naik', ayahsCount: 44, revelationType: 'Makkiyyah' },
  { number: 71, nameIndo: 'Nuh', nameArabic: 'نوح', transliteration: 'Nuh', translationId: 'Nabi Nuh', ayahsCount: 28, revelationType: 'Makkiyyah' },
  { number: 72, nameIndo: 'Al-Jinn', nameArabic: 'الجن', transliteration: 'Al-Jinn', translationId: 'Jin', ayahsCount: 28, revelationType: 'Makkiyyah' },
  { number: 73, nameIndo: 'Al-Muzzammil', nameArabic: 'المزمل', transliteration: 'Al-Muzzammil', translationId: 'Orang yang Berselimut', ayahsCount: 20, revelationType: 'Makkiyyah' },
  { number: 74, nameIndo: 'Al-Muddassir', nameArabic: 'المدثر', transliteration: 'Al-Muddassir', translationId: 'Orang yang Berkemul', ayahsCount: 56, revelationType: 'Makkiyyah' },
  { number: 75, nameIndo: 'Al-Qiyamah', nameArabic: 'القيامة', transliteration: 'Al-Qiyamah', translationId: 'Hari Kiamat', ayahsCount: 40, revelationType: 'Makkiyyah' },
  { number: 76, nameIndo: 'Al-Insan', nameArabic: 'الإنسان', transliteration: 'Al-Insan', translationId: 'Manusia', ayahsCount: 31, revelationType: 'Madaniyyah' },
  { number: 77, nameIndo: 'Al-Mursalat', nameArabic: 'المرسلات', transliteration: 'Al-Mursalat', translationId: 'Malaikat yang Diutus', ayahsCount: 50, revelationType: 'Makkiyyah' },
  { number: 78, nameIndo: 'An-Naba\'', nameArabic: 'النبأ', transliteration: 'An-Naba\'', translationId: 'Berita Besar', ayahsCount: 40, revelationType: 'Makkiyyah' },
  { number: 79, nameIndo: 'An-Nazi\'at', nameArabic: 'النازعات', transliteration: 'An-Nazi\'at', translationId: 'Malaikat yang Mencabut', ayahsCount: 46, revelationType: 'Makkiyyah' },
  { number: 80, nameIndo: '\'Abasa', nameArabic: 'عبس', transliteration: '\'Abasa', translationId: 'Ia Bermuka Masam', ayahsCount: 42, revelationType: 'Makkiyyah' },
  { number: 81, nameIndo: 'At-Takwir', nameArabic: 'التكوير', transliteration: 'At-Takwir', translationId: 'Menggulung', ayahsCount: 29, revelationType: 'Makkiyyah' },
  { number: 82, nameIndo: 'Al-Infitar', nameArabic: 'الانفطار', transliteration: 'Al-Infitar', translationId: 'Terbelah', ayahsCount: 19, revelationType: 'Makkiyyah' },
  { number: 83, nameIndo: 'Al-Mutaffifin', nameArabic: 'المطففين', transliteration: 'Al-Mutaffifin', translationId: 'Orang-Orang yang Curang', ayahsCount: 36, revelationType: 'Makkiyyah' },
  { number: 84, nameIndo: 'Al-Insyiqaq', nameArabic: 'الانشقاق', transliteration: 'Al-Insyiqaq', translationId: 'Terbelah', ayahsCount: 25, revelationType: 'Makkiyyah' },
  { number: 85, nameIndo: 'Al-Buruj', nameArabic: 'البروج', transliteration: 'Al-Buruj', translationId: 'Gugusan Bintang', ayahsCount: 22, revelationType: 'Makkiyyah' },
  { number: 86, nameIndo: 'At-Tariq', nameArabic: 'الطارق', transliteration: 'At-Tariq', translationId: 'Yang Datang di Malam Hari', ayahsCount: 17, revelationType: 'Makkiyyah' },
  { number: 87, nameIndo: 'Al-A\'la', nameArabic: 'الأعلى', transliteration: 'Al-A\'la', translationId: 'Yang Paling Tinggi', ayahsCount: 19, revelationType: 'Makkiyyah' },
  { number: 88, nameIndo: 'Al-Ghasyiyah', nameArabic: 'الغاشية', transliteration: 'Al-Ghasyiyah', translationId: 'Hari Pembalasan', ayahsCount: 26, revelationType: 'Makkiyyah' },
  { number: 89, nameIndo: 'Al-Fajr', nameArabic: 'الفجر', transliteration: 'Al-Fajr', translationId: 'Fajar', ayahsCount: 30, revelationType: 'Makkiyyah' },
  { number: 90, nameIndo: 'Al-Balad', nameArabic: 'البلد', transliteration: 'Al-Balad', translationId: 'Negeri', ayahsCount: 20, revelationType: 'Makkiyyah' },
  { number: 91, nameIndo: 'Asy-Syams', nameArabic: 'الشمس', transliteration: 'Asy-Syams', translationId: 'Matahari', ayahsCount: 15, revelationType: 'Makkiyyah' },
  { number: 92, nameIndo: 'Al-Lail', nameArabic: 'الليل', transliteration: 'Al-Lail', translationId: 'Malam', ayahsCount: 21, revelationType: 'Makkiyyah' },
  { number: 93, nameIndo: 'Ad-Duha', nameArabic: 'الضحى', transliteration: 'Ad-Duha', translationId: 'Waktu Dhuha', ayahsCount: 11, revelationType: 'Makkiyyah' },
  { number: 94, nameIndo: 'Asy-Syarh', nameArabic: 'الشرح', transliteration: 'Asy-Syarh', translationId: 'Melapangkan', ayahsCount: 8, revelationType: 'Makkiyyah' },
  { number: 95, nameIndo: 'At-Tin', nameArabic: 'التين', transliteration: 'At-Tin', translationId: 'Buah Tin', ayahsCount: 8, revelationType: 'Makkiyyah' },
  { number: 96, nameIndo: 'Al-\'Alaq', nameArabic: 'العلق', transliteration: 'Al-\'Alaq', translationId: 'Segumpal Darah', ayahsCount: 19, revelationType: 'Makkiyyah' },
  { number: 97, nameIndo: 'Al-Qadr', nameArabic: 'القدر', transliteration: 'Al-Qadr', translationId: 'Kemuliaan', ayahsCount: 5, revelationType: 'Makkiyyah' },
  { number: 98, nameIndo: 'Al-Bayyinah', nameArabic: 'البينة', transliteration: 'Al-Bayyinah', translationId: 'Bukti Nyata', ayahsCount: 8, revelationType: 'Madaniyyah' },
  { number: 99, nameIndo: 'Az-Zalzalah', nameArabic: 'الزلزلة', transliteration: 'Az-Zalzalah', translationId: 'Kegoncangan', ayahsCount: 8, revelationType: 'Madaniyyah' },
  { number: 100, nameIndo: 'Al-\'Adiyat', nameArabic: 'العاديات', transliteration: 'Al-\'Adiyat', translationId: 'Kuda Perang', ayahsCount: 11, revelationType: 'Makkiyyah' },
  { number: 101, nameIndo: 'Al-Qari\'ah', nameArabic: 'القارعة', transliteration: 'Al-Qari\'ah', translationId: 'Hari Kiamat', ayahsCount: 11, revelationType: 'Makkiyyah' },
  { number: 102, nameIndo: 'At-Takasur', nameArabic: 'التكاثر', transliteration: 'At-Takasur', translationId: 'Bermegah-Megahan', ayahsCount: 8, revelationType: 'Makkiyyah' },
  { number: 103, nameIndo: 'Al-\'Asr', nameArabic: 'العصر', transliteration: 'Al-\'Asr', translationId: 'Masa / Waktu Sore', ayahsCount: 3, revelationType: 'Makkiyyah' },
  { number: 104, nameIndo: 'Al-Humazah', nameArabic: 'الهمزة', transliteration: 'Al-Humazah', translationId: 'Pengumpat', ayahsCount: 9, revelationType: 'Makkiyyah' },
  { number: 105, nameIndo: 'Al-Fil', nameArabic: 'الفيل', transliteration: 'Al-Fil', translationId: 'Gajah', ayahsCount: 5, revelationType: 'Makkiyyah' },
  { number: 106, nameIndo: 'Quraisy', nameArabic: 'قريش', transliteration: 'Quraisy', translationId: 'Suku Quraisy', ayahsCount: 4, revelationType: 'Makkiyyah' },
  { number: 107, nameIndo: 'Al-Ma\'un', nameArabic: 'الماعون', transliteration: 'Al-Ma\'un', translationId: 'Barang yang Berguna', ayahsCount: 7, revelationType: 'Makkiyyah' },
  { number: 108, nameIndo: 'Al-Kausar', nameArabic: 'الكوثر', transliteration: 'Al-Kausar', translationId: 'Nikmat yang Berlimpah', ayahsCount: 3, revelationType: 'Makkiyyah' },
  { number: 109, nameIndo: 'Al-Kafirun', nameArabic: 'الكافرون', transliteration: 'Al-Kafirun', translationId: 'Orang-Orang Kafir', ayahsCount: 6, revelationType: 'Makkiyyah' },
  { number: 110, nameIndo: 'An-Nasr', nameArabic: 'النصر', transliteration: 'An-Nasr', translationId: 'Pertolongan', ayahsCount: 3, revelationType: 'Madaniyyah' },
  { number: 111, nameIndo: 'Al-Lahab', nameArabic: 'اللهب', transliteration: 'Al-Lahab', translationId: 'Gejolak Api', ayahsCount: 5, revelationType: 'Makkiyyah' },
  { number: 112, nameIndo: 'Al-Ikhlas', nameArabic: 'الإخلاص', transliteration: 'Al-Ikhlas', translationId: 'Kemurnian Keesaan Allah', ayahsCount: 4, revelationType: 'Makkiyyah' },
  { number: 113, nameIndo: 'Al-Falaq', nameArabic: 'الفلق', transliteration: 'Al-Falaq', translationId: 'Waktu Subuh', ayahsCount: 5, revelationType: 'Makkiyyah' },
  { number: 114, nameIndo: 'An-Nas', nameArabic: 'الناس', transliteration: 'An-Nas', translationId: 'Umat Manusia', ayahsCount: 6, revelationType: 'Makkiyyah' },
];

export function getSurahByNumber(num: number): SurahMeta | undefined {
  return SURAH_LIST.find((s) => s.number === num);
}

export function searchSurahs(query: string): SurahMeta[] {
  if (!query || !query.trim()) return SURAH_LIST;
  const cleanQ = query.toLowerCase().trim();

  // If query is a number
  const num = parseInt(cleanQ, 10);
  if (!isNaN(num) && num >= 1 && num <= 114) {
    const directMatch = getSurahByNumber(num);
    const otherMatches = SURAH_LIST.filter(s => s.number !== num && (s.number.toString().includes(cleanQ) || s.nameIndo.toLowerCase().includes(cleanQ)));
    return directMatch ? [directMatch, ...otherMatches] : otherMatches;
  }

  // Normalization for search
  const normalizedQ = cleanQ.replace(/[-'\s]/g, '');

  return SURAH_LIST.filter((s) => {
    const cleanName = s.nameIndo.toLowerCase().replace(/[-'\s]/g, '');
    const cleanTranslit = s.transliteration.toLowerCase().replace(/[-'\s]/g, '');
    const cleanMeaning = s.translationId.toLowerCase();
    const cleanArabic = s.nameArabic;

    return (
      cleanName.includes(normalizedQ) ||
      cleanTranslit.includes(normalizedQ) ||
      cleanMeaning.includes(cleanQ) ||
      cleanArabic.includes(query) ||
      s.number.toString() === cleanQ
    );
  });
}
