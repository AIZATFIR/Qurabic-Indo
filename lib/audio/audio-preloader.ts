/**
 * Qurabic Audio Preloader & Multi-Tier Cache (In-Memory Blob + CacheStorage API)
 * Eliminates audio loading latency between multi-qari Arabic tilawah and Indonesian translation.
 */

import {
  getAudioCandidateUrls,
  getTranslationAudioCandidateUrls,
  TranslationVoiceMode,
} from '../api/audio';

const AUDIO_CACHE_NAME = 'qurabic-audio-cache-v1';

// In-memory cache mapping remote audio URLs to local memory Blob URLs
const blobUrlCache = new Map<string, string>();
const inFlightFetches = new Map<string, Promise<string>>();
const MAX_BLOB_CACHE = 80;

/**
 * Prunes oldest entries from in-memory blob cache to prevent RAM bloat
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
 * Preloads a single audio URL into an in-memory Blob URL with persistent CacheStorage backing
 * If fetch fails or times out, safely resolves to original URL as stream fallback
 */
export async function preloadAudioBlob(url: string, timeoutMs = 5000): Promise<string> {
  if (typeof window === 'undefined' || typeof fetch === 'undefined') {
    return url;
  }

  // 1. In-memory check (instant 0ms)
  const existing = blobUrlCache.get(url);
  if (existing) return existing;

  // 2. In-flight deduplication
  const inFlight = inFlightFetches.get(url);
  if (inFlight) return inFlight;

  const fetchPromise = (async () => {
    try {
      // 3. Persistent CacheStorage check
      if ('caches' in window) {
        try {
          const cache = await window.caches.open(AUDIO_CACHE_NAME);
          const cachedResponse = await cache.match(url);
          if (cachedResponse && cachedResponse.ok) {
            const blob = await cachedResponse.blob();
            if (blob && blob.size > 0) {
              const blobUrl = URL.createObjectURL(blob);
              blobUrlCache.set(url, blobUrl);
              pruneBlobCache();
              return blobUrl;
            }
          }
        } catch {
          // CacheStorage might be restricted in some private modes
        }
      }

      // 4. Network fetch with timeout
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

      // Clone response to persist into CacheStorage before consuming blob
      if ('caches' in window) {
        try {
          const cache = await window.caches.open(AUDIO_CACHE_NAME);
          cache.put(url, res.clone()).catch(() => {});
        } catch {
          // ignore
        }
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
      // Return original URL so audio element can stream directly without throwing
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

  // 2. Try primary candidate with 4000ms timeout
  const primaryUrl = candidates[0];
  try {
    const primaryBlob = await preloadAudioBlob(primaryUrl, 4000);
    if (primaryBlob && primaryBlob.startsWith('blob:')) {
      return primaryBlob;
    }
  } catch {
    // Continue to fallback
  }

  // 3. Fallback to secondary candidate if available
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
 * Preloads upcoming Ayahs (current, N+1, N+2) in the background for zero-latency seamless playback
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

  // Preload next ayah Arabic + translation
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

  // Preload Ayah + 2 in the background
  if (currentAyah + 1 < totalAyahs) {
    const aheadAyah = currentAyah + 2;
    preloadArabicAudio(surahNumber, aheadAyah, qariId).catch(() => {});
    if (mode !== 'off') {
      preloadTranslationAudio(
        surahNumber,
        aheadAyah,
        getTranslation?.(aheadAyah),
        mode
      ).catch(() => {});
    }
  }
}
