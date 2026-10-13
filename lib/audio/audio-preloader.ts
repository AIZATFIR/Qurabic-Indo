/**
 * Qurabic Audio Preloader & In-Memory Blob Cache
 * Eliminates audio loading latency between multi-qari Arabic tilawah and Indonesian translation.
 */

import {
  getAudioCandidateUrls,
  getTranslationAudioCandidateUrls,
  TranslationVoiceMode,
} from '../api/audio';

// In-memory cache mapping remote audio URLs to local memory Blob URLs
const blobUrlCache = new Map<string, string>();
const inFlightFetches = new Map<string, Promise<string>>();
const MAX_BLOB_CACHE = 60;

/**
 * Prunes oldest entries from blob cache to prevent memory bloat
 */
function pruneBlobCache() {
  if (blobUrlCache.size <= MAX_BLOB_CACHE) return;
  const iterator = blobUrlCache.entries();
  while (blobUrlCache.size > MAX_BLOB_CACHE) {
    const next = iterator.next();
    if (next.done) break;
    const [key, blobUrl] = next.value;
    try {
      if (typeof URL !== 'undefined' && URL.revokeObjectURL && blobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(blobUrl);
      }
    } catch {
      // ignore
    }
    blobUrlCache.delete(key);
  }
}

/**
 * Returns preloaded Blob URL synchronously if already available in memory
 */
export function getCachedAudioUrl(url: string): string | undefined {
  return blobUrlCache.get(url);
}

/**
 * Preloads a single audio URL into an in-memory Blob URL
 * If fetch fails or times out, safely resolves to original URL as stream fallback
 */
export async function preloadAudioBlob(url: string, timeoutMs = 4000): Promise<string> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return url;
  }

  // Already cached
  const existing = blobUrlCache.get(url);
  if (existing) return existing;

  // In-flight deduplication
  const inFlight = inFlightFetches.get(url);
  if (inFlight) return inFlight;

  const fetchPromise = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        signal: controller.signal,
        cache: 'force-cache',
      });
      clearTimeout(timer);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        throw new Error('Empty audio blob');
      }

      const blobUrl = URL.createObjectURL(blob);
      blobUrlCache.set(url, blobUrl);
      pruneBlobCache();
      return blobUrl;
    } catch {
      // Return original URL so audio element can stream directly
      return url;
    } finally {
      inFlightFetches.delete(url);
    }
  })();

  inFlightFetches.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Preloads Indonesian translation audio with multi-candidate failover based on user preference
 */
export async function preloadTranslationAudio(
  surahNumber: number,
  ayahNumber: number,
  translationText?: string,
  mode: TranslationVoiceMode = 'human'
): Promise<string> {
  if (typeof window === 'undefined' || mode === 'off') return '';

  const candidates = getTranslationAudioCandidateUrls(
    surahNumber,
    ayahNumber,
    translationText,
    mode
  );
  if (!candidates || candidates.length === 0) return '';

  // 1. Check if any candidate is already in memory
  for (const candidate of candidates) {
    const cached = blobUrlCache.get(candidate);
    if (cached) return cached;
  }

  // 2. Try primary candidate with tight 3000ms timeout
  const primaryUrl = candidates[0];
  try {
    const primaryBlob = await preloadAudioBlob(primaryUrl, 3000);
    if (primaryBlob && primaryBlob.startsWith('blob:')) {
      return primaryBlob;
    }
  } catch {
    // Continue to fallback
  }

  // 3. Fallback to secondary candidate
  if (candidates.length > 1) {
    const fallbackUrl = candidates[1];
    return await preloadAudioBlob(fallbackUrl, 5000);
  }

  return primaryUrl;
}

/**
 * Returns preloaded translation audio URL synchronously if already available in memory
 */
export function getCachedTranslationUrl(
  surahNumber: number,
  ayahNumber: number,
  translationText?: string,
  mode: TranslationVoiceMode = 'human'
): string | undefined {
  if (mode === 'off') return undefined;

  const candidates = getTranslationAudioCandidateUrls(
    surahNumber,
    ayahNumber,
    translationText,
    mode
  );
  for (const candidate of candidates) {
    const cached = blobUrlCache.get(candidate);
    if (cached) return cached;
  }
  return undefined;
}

/**
 * Preloads Arabic recitation audio for an ayah using active Qari
 */
export async function preloadArabicAudio(
  surahNumber: number,
  ayahNumber: number,
  qariId: string = 'alafasy'
): Promise<string> {
  const candidates = getAudioCandidateUrls(surahNumber, ayahNumber, qariId);
  if (!candidates || candidates.length === 0) return '';
  return await preloadAudioBlob(candidates[0], 4000);
}

/**
 * Preloads upcoming Ayahs (N and N+1) in the background for zero-latency seamless playback
 */
export function preloadUpcomingAyahs(
  surahNumber: number,
  currentAyah: number,
  totalAyahs: number,
  getTranslation?: (ayahNum: number) => string | undefined,
  qariId: string = 'alafasy',
  mode: TranslationVoiceMode = 'human'
): void {
  if (typeof window === 'undefined') return;

  // Preload current ayah translation immediately
  if (mode !== 'off') {
    preloadTranslationAudio(
      surahNumber,
      currentAyah,
      getTranslation?.(currentAyah),
      mode
    ).catch(() => {});
  }

  // Preload next ayah Arabic + translation immediately
  if (currentAyah < totalAyahs) {
    const nextAyah = currentAyah + 1;
    preloadArabicAudio(surahNumber, nextAyah, qariId).catch(() => {});
    if (mode !== 'off') {
      preloadTranslationAudio(
        surahNumber,
        nextAyah,
        getTranslation?.(nextAyah),
        mode
      ).catch(() => {});
    }
  }
}
