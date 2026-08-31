export interface CuratedVideo {
  id: string;
  youtubeId: string;
  title: string;
  speaker: string;
  channel: string;
  category: 'Bedah Kata' | 'Tadabbur Ayat' | 'Rahasia Balaghah' | 'Kaidah Morfologi';
  duration: string;
  linguisticTakeaway: string;
  description: string;
  relatedRootSlug?: string;
  relatedRootArabic?: string;
  relatedVerseKey?: string;
}

export const CURATED_VIDEOS: CuratedVideo[] = [
  {
    id: 'video-1',
    youtubeId: 'HKjUgJD0Tw4',
    title: 'Keajaiban Pemilihan Kata dalam Al-Qur\'an (Linguistic Precision)',
    speaker: 'Ustadz Nouman Ali Khan',
    channel: 'Bayyinah Institute',
    category: 'Bedah Kata',
    duration: '14:20',
    linguisticTakeaway: 'Bagaimana setiap kata dalam Al-Qur\'an dipilih dengan presisi luar biasa di mana sinonim kata tidak pernah dapat saling menggantikan tanpa mengubah kedalaman maknanya.',
    description: 'Kajian mendalam tentang keajaiban morfologi dan pemilihan leksikon Al-Qur\'an yang menakjubkan bagi pembelajar bahasa Arab Al-Qur\'an.',
    relatedRootSlug: 'r-h-m',
    relatedRootArabic: 'ر ح م',
    relatedVerseKey: '1:1'
  },
  {
    id: 'video-2',
    youtubeId: 'zoF4A5l9Eyg',
    title: 'Menyingkap Makna Tersembunyi Kosakata Al-Qur\'an',
    speaker: 'Kajian Bahasa Al-Qur\'an',
    channel: 'Tadabbur & Balaghah',
    category: 'Rahasia Balaghah',
    duration: '18:45',
    linguisticTakeaway: 'Analisis akar kata dan struktur Sharaf yang membimbing pemahaman makna kontekstual ayat-ayat Al-Qur\'an secara utuh.',
    description: 'Menyelami bagaimana akar kata trilateral (Tsulatsi) membentuk spektrum makna yang luas dan saling terhubung di berbagai surah.',
    relatedRootSlug: 's-b-r',
    relatedRootArabic: 'ص ب ر',
    relatedVerseKey: '2:153'
  },
  {
    id: 'video-3',
    youtubeId: 'HF9asWpE5AU',
    title: 'Struktur Morfologi Sharaf & Keindahan Balaghah Ayat',
    speaker: 'Dr. Fadhil As-Samarra\'i',
    channel: 'Lughatuna Al-Jamilah',
    category: 'Kaidah Morfologi',
    duration: '22:10',
    linguisticTakeaway: 'Pembedahan perbedaan wazan (timbangan kata) dalam membedakan intensitas perbuatan dan penekanan makna dalam teks Al-Qur\'an.',
    description: 'Kajian klasik akademis yang membedah keunikan gramatika dan sintaksis bahasa Arab Al-Qur\'an tingkat lanjut.',
    relatedRootSlug: 'a-l-m',
    relatedRootArabic: 'ع ل م',
    relatedVerseKey: '96:1'
  },
  {
    id: 'video-4',
    youtubeId: 'jmNY06nmpL8',
    title: 'Tadabbur Ayat & Bedah Leksikal Surat Pilihan',
    speaker: 'Ustadz Adi Hidayat / Tim Riset',
    channel: 'Kajian Tadabbur Qur\'an',
    category: 'Tadabbur Ayat',
    duration: '16:35',
    linguisticTakeaway: 'Korelasi antara asal-usul kata (etimologi) dengan pesan moral dan spiritual yang terkandung dalam susunan kalimat Al-Qur\'an.',
    description: 'Penjelasan sistematis per kata dan per kalimat yang memudahkan pemula memahami pesan Al-Qur\'an langsung dari bahasa aslinya.',
    relatedRootSlug: 's-l-w',
    relatedRootArabic: 'ص ل و',
    relatedVerseKey: '2:3'
  }
];

export const VIDEO_CATEGORIES = [
  'Semua',
  'Bedah Kata',
  'Tadabbur Ayat',
  'Rahasia Balaghah',
  'Kaidah Morfologi'
] as const;
