/**
 * Qurabic Audio Preloader & Multi-Tier Cache (In-Memory Blob + CacheStorage API)
 * Eliminates audio loading latency between multi-qari Arabic tilawah and Indonesian translation.
 */

import {
  getAudioCandidateUrls,
  getNextAudioTrack,
  getTranslationAudioCandidateUrls,
  TranslationVoiceMode,
  TranslationAudioLanguage,
} from '../api/audio';

const AUDIO_CACHE_NAME = 'qurabic-audio-cache-v1';

// In-memory cache mapping remote audio URLs to local memory Blob URLs
const blobUrlCache = new Map<string, string>();
const inFlightFetches = new Map<string, Promise<string>>();
const inFlightControllers = new Map<string, AbortController>();
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

export async function waitForPreloadedAudioUrl(url: string, timeoutMs: number): Promise<string | undefined> {
  const cached = getCachedAudioUrl(url);
  if (cached) return cached;
  const pending = inFlightFetches.get(url);
  if (!pending) return undefined;

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const result = await Promise.race([
    pending,
    new Promise<undefined>((resolve) => { timeout = setTimeout(() => resolve(undefined), timeoutMs); }),
  ]);
  if (timeout) clearTimeout(timeout);
  return result?.startsWith('blob:') ? result : undefined;
}

export function cancelAudioPreload(url: string): void {
  inFlightControllers.get(url)?.abort();
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

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  inFlightControllers.set(url, controller);
  let fetchPromise!: Promise<string>;
  fetchPromise = (async () => {
    try {
      // 3. Persistent CacheStorage check
      if ('caches' in window) {
        try {
          const cache = await window.caches.open(AUDIO_CACHE_NAME);
          const cachedResponse = await cache.match(url);
          if (cachedResponse && cachedResponse.ok) {
            const blob = await cachedResponse.blob();
            if (blob && blob.size > 0 && !controller.signal.aborted) {
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
      if (controller.signal.aborted) return url;

      const res = await fetch(url, {
        signal: controller.signal,
        cache: 'force-cache',
      });
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
      if (!blob || blob.size === 0 || controller.signal.aborted) {
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
      clearTimeout(timer);
      if (inFlightFetches.get(url) === fetchPromise) inFlightFetches.delete(url);
      if (inFlightControllers.get(url) === controller) inFlightControllers.delete(url);
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
  mode: TranslationVoiceMode = 'human',
  language: TranslationAudioLanguage = 'id'
): Promise<string> {
  if (typeof window === 'undefined' || mode === 'off') return '';

  const candidates = getTranslationAudioCandidateUrls(
    surahNumber,
    ayahNumber,
    translationText,
    mode,
    language
  );
  if (!candidates || candidates.length === 0) return '';

  // 1. Check if any candidate is already in memory
  for (const candidate of candidates) {
    const cached = blobUrlCache.get(candidate);
    if (cached) return cached;
  }

  // Warm the preferred source only. Fetching a full TTS file in parallel with
  // the human recording wastes bandwidth and memory when the human file works.
  return preloadAudioBlob(candidates[0], 4000).catch(() => candidates[0]);
}

/**
 * Returns preloaded translation audio URL synchronously if already available in memory
 */
export function getCachedTranslationUrl(
  surahNumber: number,
  ayahNumber: number,
  translationText?: string,
  mode: TranslationVoiceMode = 'human',
  language: TranslationAudioLanguage = 'id'
): string | undefined {
  if (mode === 'off') return undefined;

  const candidates = getTranslationAudioCandidateUrls(
    surahNumber,
    ayahNumber,
    translationText,
    mode,
    language
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

export interface NextAudioPreloadOptions {
  surahNumber: number;
  currentAyah: number;
  phase: 'arabic' | 'translation';
  totalAyahs: number;
  handsfreeMode: 'off' | 'normal' | 'reverse';
  repeatMode: 'off' | 'ayah' | 'surah';
  autoNext: boolean;
  qariId: string;
  translationLanguage: TranslationAudioLanguage;
  translationVoiceMode?: TranslationVoiceMode;
}

export function getNextAudioPreloadUrl(options: NextAudioPreloadOptions): string | undefined {
  return getNextAudioPreloadUrls(options)[0];
}

export function getNextAudioPreloadUrls(options: NextAudioPreloadOptions): string[] {
  const nextTrack = getNextAudioTrack({
    surahNumber: options.surahNumber,
    ayahNumber: options.currentAyah,
    phase: options.phase,
    totalAyahs: options.totalAyahs,
    handsfreeMode: options.handsfreeMode,
    repeatMode: options.repeatMode,
    autoNext: options.autoNext,
    translationLanguage: options.translationLanguage,
    translationVoiceMode: options.translationVoiceMode,
  });
  if (!nextTrack) return [];
  return nextTrack.phase === 'translation'
    ? getTranslationAudioCandidateUrls(options.surahNumber, nextTrack.ayahNumber, undefined, options.translationVoiceMode ?? 'human', options.translationLanguage).slice(0, 1)
    : getAudioCandidateUrls(options.surahNumber, nextTrack.ayahNumber, options.qariId);
}

/** Warm only the immediate next track so background requests do not compete with playback. */
export function preloadNextAudioTrack(options: NextAudioPreloadOptions): void {
  if (typeof window === 'undefined') return;
  for (const url of getNextAudioPreloadUrls(options)) {
    void preloadAudioBlob(url, 4000).catch(() => {});
  }
}
