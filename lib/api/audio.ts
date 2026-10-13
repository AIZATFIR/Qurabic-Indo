/**
 * Quran Recitation Audio Source Abstraction
 * Provides multi-qari per-ayah audio URLs using high-availability CDNs (EveryAyah, QuranCDN)
 * and configurable Indonesian translation audio providers (Human recording & TTS AI).
 */

export interface QariMeta {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  everyAyahFolder: string;
  quranComSlug?: string;
}

export const AVAILABLE_QARIS: QariMeta[] = [
  {
    id: 'alafasy',
    name: 'Syaikh Mishary Rashid Al-Afasy',
    arabicName: 'مشاري بن راشد العفاسي',
    style: 'Murattal Merdu (Default)',
    everyAyahFolder: 'Alafasy_128kbps',
    quranComSlug: 'Alafasy',
  },
  {
    id: 'yasser_dossary',
    name: 'Syaikh Yasser Al-Dossary',
    arabicName: 'ياسر الدوسري',
    style: 'Imam Masjidil Haram (Maqam & Khusyuk)',
    everyAyahFolder: 'Yasser_Ad-Dussary_128kbps',
  },
  {
    id: 'abdul_basit_mujawwad',
    name: 'Syaikh Abdul Basit Abdus Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    style: 'Mujawwad Klasik / Nagham',
    everyAyahFolder: 'Abdul_Basit_Mujawwad_128kbps',
  },
  {
    id: 'abdul_basit_murattal',
    name: 'Syaikh Abdul Basit Abdus Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    style: 'Murattal Cepat',
    everyAyahFolder: 'Abdul_Basit_Murattal_192kbps',
  },
  {
    id: 'as_sudais',
    name: 'Syaikh Abdurrahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    style: 'Imam Masjidil Haram',
    everyAyahFolder: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: 'al_muaiqly',
    name: 'Syaikh Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    style: 'Imam Masjidil Haram',
    everyAyahFolder: 'MaherAlMuaiqly128kbps',
  },
  {
    id: 'al_minshawi_murattal',
    name: 'Syaikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'Murattal Khusyuk',
    everyAyahFolder: 'Minshawy_Murattal_128kbps',
  },
  {
    id: 'al_minshawi_mujawwad',
    name: 'Syaikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'Mujawwad Klasik',
    everyAyahFolder: 'Minshawy_Mujawwad_192kbps',
  },
  {
    id: 'al_husary',
    name: 'Syaikh Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Standar Tartil & Tajwid',
    everyAyahFolder: 'Husary_128kbps',
  },
  {
    id: 'al_ghamdi',
    name: 'Syaikh Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'Murattal Syahdu',
    everyAyahFolder: 'Ghamadi_40kbps',
  },
  {
    id: 'ash_shaatree',
    name: 'Syaikh Abu Bakr Asy-Syathiri',
    arabicName: 'أبو بكر الشاطري',
    style: 'Murattal Dinamis',
    everyAyahFolder: 'Abu_Bakr_Ash-Shaatree_128kbps',
  },
  {
    id: 'nasser_alqatami',
    name: 'Syaikh Nasser Al-Qatami',
    arabicName: 'ناصر القطامي',
    style: 'Murattal Menyentuh Hati',
    everyAyahFolder: 'Nasser_Alqatami_128kbps',
  },
];

export type TranslationVoiceMode = 'human' | 'tts' | 'off';

export interface TranslationVoiceOption {
  id: TranslationVoiceMode;
  name: string;
  description: string;
}

export const TRANSLATION_VOICE_OPTIONS: TranslationVoiceOption[] = [
  {
    id: 'human',
    name: 'Rekaman Suara Manusia',
    description: 'Pembaca asli Bahasa Indonesia (Archive.org dengan failover TTS)',
  },
  {
    id: 'tts',
    name: 'Suara Digital (TTS AI)',
    description: 'Sintesis vokal Bahasa Indonesia jernih & stabil (/api/audio-translation)',
  },
  {
    id: 'off',
    name: 'Nonaktif',
    description: 'Hanya murottal qari bahasa Arab (tanpa terjemahan)',
  },
];

export interface AyahAudioMeta {
  surahNumber: number;
  ayahNumber: number;
  audioUrl: string;
  reciter: string;
}

/**
 * Returns formatted 3-digit padded numbers, e.g. (1 -> "001", 255 -> "255")
 */
export function padDigits(num: number, targetLength: number = 3): string {
  return String(num).padStart(targetLength, '0');
}

/**
 * Returns clean Ayah key e.g. "1:1" or "2:255"
 */
export function getFormattedAyahKey(surahNumber: number, ayahNumber: number): string {
  return `${surahNumber}:${ayahNumber}`;
}

/**
 * Resolves authoritative recitation audio URL for a specific Surah & Ayah
 */
export function getAyahAudioUrl(
  surahNumber: number,
  ayahNumber: number,
  qariId: string = 'alafasy'
): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  const qari = AVAILABLE_QARIS.find((q) => q.id === qariId) || AVAILABLE_QARIS[0];

  if (qari.quranComSlug) {
    return `https://verses.quran.com/${qari.quranComSlug}/mp3/${s}${a}.mp3`;
  }
  return `https://everyayah.com/data/${qari.everyAyahFolder}/${s}${a}.mp3`;
}

/**
 * Returns ordered candidate audio CDN URLs for multi-source fallback resilience
 */
export function getAudioCandidateUrls(
  surahNumber: number,
  ayahNumber: number,
  qariId: string = 'alafasy'
): string[] {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  const qari = AVAILABLE_QARIS.find((q) => q.id === qariId) || AVAILABLE_QARIS[0];

  const candidates: string[] = [];

  // 1. If Quran.com CDN is available for this reciter
  if (qari.quranComSlug) {
    candidates.push(`https://verses.quran.com/${qari.quranComSlug}/mp3/${s}${a}.mp3`);
    candidates.push(`https://audio.qurancdn.com/${qari.quranComSlug}/mp3/${s}${a}.mp3`);
  }

  // 2. High-availability EveryAyah CDN mirror (CORS-enabled BunnyCDN)
  candidates.push(`https://everyayah.com/data/${qari.everyAyahFolder}/${s}${a}.mp3`);

  // 3. Mirror fallback for default Alafasy
  if (qari.id === 'alafasy') {
    candidates.push(
      `https://equran.nos.wjv-1.neo.id/audio-partial/Misyari-Rasyid-Al-Afasi/${s}${a}.mp3`
    );
  }

  return candidates;
}

/**
 * Optional fallback URL resolver in case of network issues
 */
export function getFallbackAyahAudioUrl(
  surahNumber: number,
  ayahNumber: number,
  qariId: string = 'alafasy'
): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  const qari = AVAILABLE_QARIS.find((q) => q.id === qariId) || AVAILABLE_QARIS[0];

  if (qari.quranComSlug) {
    return `https://audio.qurancdn.com/${qari.quranComSlug}/mp3/${s}${a}.mp3`;
  }
  return `https://everyayah.com/data/${qari.everyAyahFolder}/${s}${a}.mp3`;
}

/**
 * Resolves human-recorded Indonesian translation audio URLs from high-availability Archive.org mirror
 */
export function getHumanTranslationAudioUrl(surahNumber: number, ayahNumber: number): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  return `https://archive.org/download/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab/${s}${a}.mp3`;
}

/**
 * Resolves streaming TTS audio endpoint for Indonesian translation
 */
export function getTranslationTtsAudioUrl(
  text?: string,
  surahNumber?: number,
  ayahNumber?: number
): string {
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  if (surahNumber) params.set('surah', String(surahNumber));
  if (ayahNumber) params.set('ayah', String(ayahNumber));
  return `/api/audio-translation?${params.toString()}`;
}

/**
 * Returns prioritized candidate list for Indonesian translation audio based on user preference:
 * - 'human': [Human recording, TTS API fallback]
 * - 'tts': [TTS API, Human recording fallback]
 * - 'off': []
 */
export function getTranslationAudioCandidateUrls(
  surahNumber: number,
  ayahNumber: number,
  translationText?: string,
  mode: TranslationVoiceMode = 'human'
): string[] {
  if (mode === 'off') return [];

  const humanUrl = getHumanTranslationAudioUrl(surahNumber, ayahNumber);
  const ttsUrl = getTranslationTtsAudioUrl(translationText, surahNumber, ayahNumber);

  if (mode === 'tts') {
    return [ttsUrl, humanUrl];
  }
  return [humanUrl, ttsUrl];
}
