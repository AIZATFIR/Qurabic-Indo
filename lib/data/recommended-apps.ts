export interface RecommendedApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  whatItIs: string;
  whyItWorks: string;
  howToUse: string;
  highlights: string[];
  platform: ('iOS' | 'Android' | 'Web')[];
  badgeText: string;
  appUrl: string;
  appleStoreUrl?: string;
  googlePlayUrl?: string;
  rating?: string;
  activeUsers?: string;
}

export const RECOMMENDED_APPS: RecommendedApp[] = [
  {
    id: 'kalaam-app',
    name: 'Kalaam App',
    tagline: 'Belajar 85% Kosakata Al-Qur\'an Secara Harian & Gamified',
    description: 'Aplikasi interaktif yang dirancang khusus untuk membantu muslim memahami bahasa Arab Al-Qur\'an secara bertahap hanya dalam 10-15 menit sehari.',
    whatItIs: 'Platform micro-learning kosakata Al-Qur\'an berbasis frekuensi kata tertinggi yang langsung muncul berulang kali dalam ayat-ayat mushaf.',
    whyItWorks: 'Menggunakan metode Spaced Repetition System (SRS) dan pendekatan gamifikasi bertingkat, sehingga kata-kata penting tersimpan kuat dalam memori jangka panjang.',
    howToUse: 'Gunakan 10 menit setiap pagi atau setelah shalat untuk melatih 5-10 kosakata baru, lalu uji pemahaman langsung di dalam bacaan surah di Qurabic.',
    highlights: [
      'Kurikulum berbasis 80% kosakata Al-Qur\'an dengan kemunculan tertinggi',
      'Latihan interaktif harian (hanya 10 menit per sesi)',
      'Audio pelafalan otentik dan contoh langsung dari ayat Al-Qur\'an',
      'Pelacak progres harian & streak konsistensi'
    ],
    platform: ['iOS', 'Android', 'Web'],
    badgeText: 'Pilihan Utama Belajar Harian',
    appUrl: 'https://www.kalaamapp.com/',
    appleStoreUrl: 'https://apps.apple.com/app/kalaam-quranic-arabic/id1578142345',
    googlePlayUrl: 'https://play.google.com/store/apps/details?id=com.kalaamapp.kalaam',
    rating: '4.9 ★',
    activeUsers: '100.000+ Pembelajar'
  }
];
