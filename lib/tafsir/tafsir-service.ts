/**
 * Retrieve Indonesian tafsir from a pinned Rio Astamal/quran-json revision.
 *
 * The archive labels these records `tafsir.id.kemenag`. Its README credits
 * Kemenag for Quran text and translations, but does not separately document
 * tafsir provenance. Keep the archive attribution visible and avoid calling
 * this mirror an official Kemenag endpoint.
 */

import { SURAH_LIST } from '@/lib/data/surah-list';

export interface AyahTafsirResult {
  surahNumber: number;
  ayahNumber: number;
  source: string;
  sourceTitle: string;
  text: string;
}

// In-Memory Cache: Surah Number -> Map of Ayah Number to Tafsir text
const TAFSIR_ARCHIVE_REVISION = '73b1d5262f30695f5d17d9a61ce6b6af9b74aeda';
const TAFSIR_SURAH_CACHE = new Map<number, Record<string, string>>();

function isValidAyahReference(surahNumber: number, ayahNumber: number): boolean {
  if (!Number.isSafeInteger(surahNumber) || !Number.isSafeInteger(ayahNumber) || ayahNumber < 1) return false;
  const surah = SURAH_LIST[surahNumber - 1];
  return surah?.number === surahNumber && ayahNumber <= surah.ayahsCount;
}

/** Fetches and caches the archive's tafsir records for one valid surah. */
export async function fetchSurahTafsir(surahNumber: number): Promise<Record<string, string> | null> {
  if (!Number.isSafeInteger(surahNumber) || surahNumber < 1 || surahNumber > SURAH_LIST.length) return null;

  if (TAFSIR_SURAH_CACHE.has(surahNumber)) {
    return TAFSIR_SURAH_CACHE.get(surahNumber)!;
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const url = `https://raw.githubusercontent.com/rioastamal/quran-json/${TAFSIR_ARCHIVE_REVISION}/surah/${surahNumber}.json`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(url, {
        signal: controller.signal,
        next: { revalidate: 604800 } // Cache 7 days on edge
      }).finally(() => clearTimeout(timeoutId));

      if (!res.ok) {
        console.warn(`[TafsirService] Failed to fetch tafsir for Surah ${surahNumber}: HTTP ${res.status}`);
        return null;
      }

      const data = await res.json();
      const surahData = data[String(surahNumber)];
      const rawTexts = surahData?.tafsir?.id?.kemenag?.text;
      const kemenagTexts: Record<string, string> = {};
      if (rawTexts && typeof rawTexts === 'object' && !Array.isArray(rawTexts)) {
        for (const [ayah, text] of Object.entries(rawTexts)) {
          if (/^\d+$/.test(ayah) && typeof text === 'string' && text.trim()) {
            kemenagTexts[ayah] = text;
          }
        }
      }

      if (Object.keys(kemenagTexts).length > 0) {
        TAFSIR_SURAH_CACHE.set(surahNumber, kemenagTexts);
        return kemenagTexts;
      }

      return null;
    } catch (error) {
      if (attempt === 2) {
        console.error(`[TafsirService] Error fetching tafsir for Surah ${surahNumber}:`, error);
        return null;
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  return null;
}

/** Retrieves one verse's tafsir text when the archive provides it. */
export async function getAyahTafsir(
  surahNumber: number,
  ayahNumber: number
): Promise<AyahTafsirResult | null> {
  if (!isValidAyahReference(surahNumber, ayahNumber)) return null;

  const surahTafsir = await fetchSurahTafsir(surahNumber);
  if (!surahTafsir) return null;

  const text = surahTafsir[String(ayahNumber)];
  if (!text || !text.trim()) return null;

  return {
    surahNumber,
    ayahNumber,
    source: 'rioastamal/quran-json · record labelled tafsir.id.kemenag',
    sourceTitle: 'rioastamal/quran-json@73b1d52 · tafsir.id.kemenag',
    text: text.trim()
  };
}
