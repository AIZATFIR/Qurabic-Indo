/**
 * Quran Recitation Audio Source Abstraction
 * Provides multi-qari per-ayah audio URLs using high-availability CDNs (EveryAyah, QuranCDN)
 * and human-recorded translation audio.
 */

import { SURAH_LIST } from '../data/surah-list';

const QURAN_FOUNDATION_AUDIO_HOSTS = new Set([
  'verses.quran.com',
  'verses.quran.foundation',
  'audio.qurancdn.com',
  'quranicaudio.com',
  'download.quranicaudio.com',
]);

/** Resolve a Content Sync audio URL and reject any host outside Quran Foundation's published audio hosts. */
export function normalizeQuranFoundationAudioUrl(value: string): string | undefined {
  try {
    const url = new URL(value, 'https://verses.quran.com/');
    if (url.protocol !== 'https:' || url.username || url.password || !QURAN_FOUNDATION_AUDIO_HOSTS.has(url.hostname.toLowerCase())) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function isQuranFoundationAudioUrl(value: string): boolean {
  return normalizeQuranFoundationAudioUrl(value) !== undefined;
}

export interface QariMeta {
  id: string;
  name: string;
  nameEnglish: string;
  arabicName: string;
  descriptionId: string;
  descriptionEn: string;
  everyAyahFolder: string;
  quranComSlug?: string;
  surahAudioBaseUrl?: string;
  isSurahLevel?: boolean;
  qfRecitationId?: number;
}

export const AVAILABLE_QARIS: QariMeta[] = [
  {
    id: 'alafasy',
    name: 'Syaikh Mishary Rashid Al-Afasy',
    nameEnglish: 'Sheikh Mishary Rashid Al-Afasy',
    arabicName: 'مشاري بن راشد العفاسي',
    descriptionId: 'Tilawah per ayat',
    descriptionEn: 'Verse-by-verse recitation',
    everyAyahFolder: 'Alafasy_128kbps',
    quranComSlug: 'Alafasy',
    qfRecitationId: 7,
  },
  {
    id: 'al_luhaidan',
    name: 'Syaikh Muhammad Al-Luhaidan',
    nameEnglish: 'Sheikh Muhammad Al-Luhaidan',
    arabicName: 'محمد اللحيدان',
    descriptionId: 'Rekaman satu surat penuh',
    descriptionEn: 'Full-surah recording',
    everyAyahFolder: 'Muhammad_Al-Luhaidan',
    surahAudioBaseUrl: 'https://cdn.mp3quran.net/audio/muhammad-luhaidan/r1',
    isSurahLevel: true,
  },
  {
    id: 'yasser_dossary',
    name: 'Syaikh Yasser Al-Dossary',
    nameEnglish: 'Sheikh Yasser Al-Dossary',
    arabicName: 'ياسر الدوسري',
    descriptionId: 'Imam Masjidil Haram · per ayat',
    descriptionEn: 'Grand Mosque imam · verse by verse',
    everyAyahFolder: 'Yasser_Ad-Dussary_128kbps',
  },
  {
    id: 'abdul_basit_mujawwad',
    name: 'Syaikh Abdul Basit Abdus Samad',
    nameEnglish: 'Sheikh Abdul Basit Abdus Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    descriptionId: 'Mujawwad · tilawah melodi per ayat',
    descriptionEn: 'Mujawwad · melodic verse-by-verse recitation',
    everyAyahFolder: 'Abdul_Basit_Mujawwad_128kbps',
  },
  {
    id: 'abdul_basit_murattal',
    name: 'Syaikh Abdul Basit Abdus Samad',
    nameEnglish: 'Sheikh Abdul Basit Abdus Samad',
    arabicName: 'عبد الباسط عبد الصمد',
    descriptionId: 'Murattal · tilawah per ayat',
    descriptionEn: 'Murattal · verse-by-verse recitation',
    everyAyahFolder: 'Abdul_Basit_Murattal_192kbps',
  },
  {
    id: 'as_sudais',
    name: 'Syaikh Abdurrahman As-Sudais',
    nameEnglish: 'Sheikh Abdurrahman As-Sudais',
    arabicName: 'عبد الرحمن السديس',
    descriptionId: 'Imam Masjidil Haram · per ayat',
    descriptionEn: 'Grand Mosque imam · verse by verse',
    everyAyahFolder: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: 'al_muaiqly',
    name: 'Syaikh Maher Al-Muaiqly',
    nameEnglish: 'Sheikh Maher Al-Muaiqly',
    arabicName: 'ماهر المعيقلي',
    descriptionId: 'Imam Masjidil Haram · per ayat',
    descriptionEn: 'Grand Mosque imam · verse by verse',
    everyAyahFolder: 'MaherAlMuaiqly128kbps',
  },
  {
    id: 'al_minshawi_murattal',
    name: 'Syaikh Muhammad Siddiq Al-Minshawi',
    nameEnglish: 'Sheikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    descriptionId: 'Murattal · tilawah per ayat',
    descriptionEn: 'Murattal · verse-by-verse recitation',
    everyAyahFolder: 'Minshawy_Murattal_128kbps',
  },
  {
    id: 'al_minshawi_mujawwad',
    name: 'Syaikh Muhammad Siddiq Al-Minshawi',
    nameEnglish: 'Sheikh Muhammad Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    descriptionId: 'Mujawwad · tilawah melodi per ayat',
    descriptionEn: 'Mujawwad · melodic verse-by-verse recitation',
    everyAyahFolder: 'Minshawy_Mujawwad_192kbps',
  },
  {
    id: 'al_husary',
    name: 'Syaikh Mahmoud Khalil Al-Husary',
    nameEnglish: 'Sheikh Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    descriptionId: 'Tilawah per ayat',
    descriptionEn: 'Verse-by-verse recitation',
    everyAyahFolder: 'Husary_128kbps',
  },
  {
    id: 'al_ghamdi',
    name: 'Syaikh Saad Al-Ghamdi',
    nameEnglish: 'Sheikh Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    descriptionId: 'Tilawah per ayat',
    descriptionEn: 'Verse-by-verse recitation',
    everyAyahFolder: 'Ghamadi_40kbps',
  },
  {
    id: 'ash_shaatree',
    name: 'Syaikh Abu Bakr Asy-Syathiri',
    nameEnglish: 'Sheikh Abu Bakr Ash-Shaatree',
    arabicName: 'أبو بكر الشاطري',
    descriptionId: 'Tilawah per ayat',
    descriptionEn: 'Verse-by-verse recitation',
    everyAyahFolder: 'Abu_Bakr_Ash-Shaatree_128kbps',
  },
  {
    id: 'nasser_alqatami',
    name: 'Syaikh Nasser Al-Qatami',
    nameEnglish: 'Sheikh Nasser Al-Qatami',
    arabicName: 'ناصر القطامي',
    descriptionId: 'Tilawah per ayat',
    descriptionEn: 'Verse-by-verse recitation',
    everyAyahFolder: 'Nasser_Alqatami_128kbps',
  },
];

export type TranslationVoiceMode = 'human' | 'off';
export type TranslationAudioLanguage = 'id' | 'en';
export type VerseRepeatCount = 0 | 1 | 2 | 3 | 5 | 10;
export function shouldRepeatVerse(completedPlays: number, totalPlays: VerseRepeatCount): boolean {
  return totalPlays === 0 || completedPlays < totalPlays;
}
export const DEFAULT_TRANSLATION_VOICE_MODE: TranslationVoiceMode = 'human';
// Translation recordings can start slowly on mobile; do not skip a valid human track after only a brief buffer.
export const AUDIO_STARTUP_TIMEOUT_MS = { arabic: 12000, translation: 10000 } as const;

export interface TranslationVoiceOption {
  id: TranslationVoiceMode;
  name: string;
  description: string;
}

export const TRANSLATION_VOICE_OPTIONS: TranslationVoiceOption[] = [
  {
    id: 'human',
    name: 'Rekaman Suara Manusia (Asli)',
    description: 'Rekaman terjemahan manusia, mengikuti ketersediaan arsip per ayat.',
  },
  {
    id: 'off',
    name: 'Nonaktif',
    description: 'Hanya murottal qari bahasa Arab (tanpa terjemahan)',
  },
];

/**
 * Surah coverage listed by the existing Internet Archive per-verse recording collection.
 * Individual files can still be missing or unavailable; playback skips failures.
 * This collection does not provide per-verse recordings for Surahs 3–39 and 42.
 */
export const HUMAN_INDONESIAN_TRANSLATION_AVAILABLE_SURAHS = new Set<number>([
  1, 2, 40, 41, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
  62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
  84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104,
  105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
]);

/** Files 041001 and 069038–069052 are absent from the source archive. */
const HUMAN_INDONESIAN_TRANSLATION_MISSING_AYAHS: Record<number, ReadonlySet<number>> = {
  41: new Set([1]),
  69: new Set(Array.from({ length: 15 }, (_, index) => index + 38)),
};

export function isHumanTranslationAvailable(surahNumber: number, language: TranslationAudioLanguage = 'id', ayahNumber?: number): boolean {
  return isHumanTranslationAvailableInLanguage(surahNumber, language, ayahNumber);
}

export function isHumanTranslationAvailableInLanguage(surahNumber: number, language: TranslationAudioLanguage = 'id', ayahNumber?: number): boolean {
  // Keep unverified third-party translation recordings out of public builds until their rights are confirmed.
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_HUMAN_TRANSLATION_AUDIO_RIGHTS_VERIFIED !== 'true') return false;
  // The EveryAyah directory index lists all 6,236 expected per-verse English files.
  if (language === 'en') return surahNumber >= 1 && surahNumber <= 114;
  if (!HUMAN_INDONESIAN_TRANSLATION_AVAILABLE_SURAHS.has(surahNumber)) return false;
  return ayahNumber === undefined || !HUMAN_INDONESIAN_TRANSLATION_MISSING_AYAHS[surahNumber]?.has(ayahNumber);
}

export function isTranslationAudioAvailable(
  surahNumber: number,
  language: TranslationAudioLanguage = 'id',
  mode: TranslationVoiceMode = 'human',
  ayahNumber = 1
): boolean {
  if (mode === 'off') return false;
  return isHumanTranslationAvailableInLanguage(surahNumber, language, ayahNumber);
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
 * Resolves human-recorded translation audio URLs from the configured Indonesian archive
 * or English EveryAyah collection. Individual files may still be unavailable at playback time.
 */
export function getHumanTranslationAudioUrl(surahNumber: number, ayahNumber: number, language: TranslationAudioLanguage = 'id'): string {
  const s = padDigits(surahNumber, 3);
  const a = padDigits(ayahNumber, 3);
  if (language === 'en') return `https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/${s}${a}.mp3`;
  return `https://archive.org/download/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab/${s}${a}.mp3`;
}

/** Translation audio is limited to human recordings with known availability. */
export function getTranslationAudioCandidateUrls(
  surahNumber: number,
  ayahNumber: number,
  _translationText?: string,
  mode: TranslationVoiceMode = 'human',
  language: TranslationAudioLanguage = 'id'
): string[] {
  if (mode === 'off') return [];
  const candidates: string[] = [];
  if (isHumanTranslationAvailableInLanguage(surahNumber, language, ayahNumber)) {
    candidates.push(getHumanTranslationAudioUrl(surahNumber, ayahNumber, language));
  }
  return candidates;
}

export interface AudioTrack {
  ayahNumber: number;
  phase: 'arabic' | 'translation';
}

export function getFirstAudioTrack(
  surahNumber: number,
  ayahNumber: number,
  handsfreeMode: 'off' | 'normal' | 'reverse',
  language: TranslationAudioLanguage = 'id',
  translationVoiceMode: TranslationVoiceMode = 'human'
): AudioTrack {
  return { ayahNumber, phase: handsfreeMode === 'reverse' && isTranslationAudioAvailable(surahNumber, language, translationVoiceMode, ayahNumber) ? 'translation' : 'arabic' };
}

/** One verse cycle includes its two phases; unavailable human recordings are skipped. */
export function getNextAudioTrack(options: {
  surahNumber: number;
  ayahNumber: number;
  phase: AudioTrack['phase'];
  totalAyahs: number;
  handsfreeMode: 'off' | 'normal' | 'reverse';
  translationLanguage?: TranslationAudioLanguage;
  translationVoiceMode?: TranslationVoiceMode;
  repeatMode: 'off' | 'ayah' | 'surah';
  autoNext: boolean;
}): AudioTrack | null {
  const { surahNumber, ayahNumber, phase, totalAyahs, handsfreeMode, repeatMode, autoNext, translationLanguage = 'id', translationVoiceMode = 'human' } = options;
  if (phase === 'translation' && handsfreeMode === 'reverse') return { ayahNumber, phase: 'arabic' };
  if (phase === 'arabic' && handsfreeMode === 'normal' && isTranslationAudioAvailable(surahNumber, translationLanguage, translationVoiceMode, ayahNumber)) {
    return { ayahNumber, phase: 'translation' };
  }
  if (repeatMode === 'ayah') return getFirstAudioTrack(surahNumber, ayahNumber, handsfreeMode, translationLanguage, translationVoiceMode);
  if (ayahNumber >= totalAyahs) return repeatMode === 'surah' ? getFirstAudioTrack(surahNumber, 1, handsfreeMode, translationLanguage, translationVoiceMode) : null;
  return autoNext ? getFirstAudioTrack(surahNumber, ayahNumber + 1, handsfreeMode, translationLanguage, translationVoiceMode) : null;
}
