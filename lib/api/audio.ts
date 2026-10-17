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
  surahAudioBaseUrl?: string;
  isSurahLevel?: boolean;
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
    id: 'al_luhaidan',
    name: 'Syaikh Muhammad Al-Luhaidan',
    arabicName: 'محمد اللحيدان',
    style: 'Tartil Emosional & Mengharukan',
    everyAyahFolder: 'Muhammad_Al-Luhaidan',
    surahAudioBaseUrl: 'https://cdn.mp3quran.net/audio/muhammad-luhaidan/r1',
    isSurahLevel: true,
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
    name: 'Rekaman Suara Manusia (Asli)',
    description: 'Suara asli manusia (Tersedia untuk 76 surat, tanpa sisipan suara robot)',
  },
  {
    id: 'tts',
    name: 'Suara Digital (TTS AI)',
    description: 'Sintesis vokal Bahasa Indonesia untuk seluruh 114 surat',
  },
  {
    id: 'off',
    name: 'Nonaktif',
    description: 'Hanya murottal qari bahasa Arab (tanpa terjemahan)',
  },
];

/**
 * Set of Surahs with authentic human-recorded Indonesian translation available in the public archive.
 * (76 Surahs total: Al-Fatihah, Al-Baqarah, and Surahs 40-41, 43-114).
 * Surahs 3 to 39 and 42 were not produced in the per-ayah recording archive.
 */
export const HUMAN_TRANSLATION_AVAILABLE_SURAHS = new Set<number>([
  1, 2, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
  84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104,
  105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
]);

export function isHumanTranslationAvailable(surahNumber: number): boolean {
  return HUMAN_TRANSLATION_AVAILABLE_SURAHS.has(surahNumber);
}

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

  if (qari.surahAudioBaseUrl) {
    return `${qari.surahAudioBaseUrl}/${s}.mp3`;
  }
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

  // 1. If Surah-level audio CDN is configured (e.g. Syaikh Muhammad Al-Luhaidan)
  if (qari.surahAudioBaseUrl) {
    candidates.push(`${qari.surahAudioBaseUrl}/${s}.mp3`);
    candidates.push(`https://server8.mp3quran.net/lhdan/${s}.mp3`);
    return candidates;
  }

  // 2. If Quran.com CDN is available for this reciter
  if (qari.quranComSlug) {
    candidates.push(`https://verses.quran.com/${qari.quranComSlug}/mp3/${s}${a}.mp3`);
    candidates.push(`https://audio.qurancdn.com/${qari.quranComSlug}/mp3/${s}${a}.mp3`);
  }

  // 3. High-availability EveryAyah CDN mirror (CORS-enabled BunnyCDN)
  candidates.push(`https://everyayah.com/data/${qari.everyAyahFolder}/${s}${a}.mp3`);

  // 4. Mirror fallback for default Alafasy
  if (qari.id === 'alafasy') {
    candidates.push(
      `https://cdn.equran.id/audio-partial/Misyari-Rasyid-Al-Afasi/${s}${a}.mp3`
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

  if (qari.surahAudioBaseUrl) {
    return `${qari.surahAudioBaseUrl}/${s}.mp3`;
  }
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
 * - 'human': Pure human voice without robotic TTS interruptions.
 *            Returns [humanUrl] if surah is supported (76 surahs available).
 *            Returns [] if surah human audio is not available, preventing awkward TTS pop-in.
 * - 'tts': [TTS API endpoint] for 114 surah universal AI voice synthesis.
 * - 'off': []
 */
export function getTranslationAudioCandidateUrls(
  surahNumber: number,
  ayahNumber: number,
  translationText?: string,
  mode: TranslationVoiceMode = 'human',
  allowTtsFallback: boolean = false
): string[] {
  if (mode === 'off') return [];

  const humanAvailable = isHumanTranslationAvailable(surahNumber);
  const humanUrl = getHumanTranslationAudioUrl(surahNumber, ayahNumber);
  const ttsUrl = getTranslationTtsAudioUrl(translationText, surahNumber, ayahNumber);

  if (mode === 'human') {
    if (!humanAvailable) {
      // In human-only mode, never unexpectedly switch to robotic Google TTS
      return allowTtsFallback ? [ttsUrl] : [];
    }
    return allowTtsFallback ? [humanUrl, ttsUrl] : [humanUrl];
  }

  if (mode === 'tts') {
    return humanAvailable ? [ttsUrl, humanUrl] : [ttsUrl];
  }

  return [];
}
