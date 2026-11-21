export interface WordDetailQuery {
  word: string;
  location?: string;
  surahNumber?: number;
  ayahNumber?: number;
  wordIndex?: number;
  meaningIndo?: string;
  surahNameIndo?: string;
  ayahArabic?: string;
  ayahIndo?: string;
}

export interface WordDetailPayload {
  data?: { study?: unknown };
  study?: unknown;
}

const MAX_CACHED_WORD_DETAILS = 24;
const WORD_DETAIL_TIMEOUT_MS = 12_000;
const wordDetailRequests = new Map<string, Promise<WordDetailPayload>>();

export function getWordDetailUrl(query: WordDetailQuery): string {
  const hasLocation = query.location || (query.surahNumber && query.ayahNumber && query.wordIndex);
  const params = hasLocation
    ? new URLSearchParams({ location: query.location || `${query.surahNumber}:${query.ayahNumber}:${query.wordIndex}` })
    : new URLSearchParams({
        word: query.word,
        surah: query.surahNumber ? String(query.surahNumber) : '',
        ayah: query.ayahNumber ? String(query.ayahNumber) : '',
        wordIndex: query.wordIndex ? String(query.wordIndex) : '',
        meaning: query.meaningIndo || '',
        surahNameIndo: query.surahNameIndo || '',
        ayahArabic: query.ayahArabic || '',
        ayahIndo: query.ayahIndo || '',
      });
  return `/api/word-detail?${params.toString()}`;
}

export function loadWordDetail(url: string): Promise<WordDetailPayload> {
  const cached = wordDetailRequests.get(url);
  if (cached) {
    wordDetailRequests.delete(url);
    wordDetailRequests.set(url, cached);
    return cached;
  }

  let request: Promise<WordDetailPayload>;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WORD_DETAIL_TIMEOUT_MS);
  request = fetch(url, { cache: 'force-cache', signal: controller.signal })
    .then((response) => {
      if (!response.ok) throw new Error('Word detail unavailable');
      return response.json() as Promise<WordDetailPayload>;
    })
    .catch((error) => {
      if (wordDetailRequests.get(url) === request) wordDetailRequests.delete(url);
      throw error;
    })
    .finally(() => {
      clearTimeout(timeout);
    });
  wordDetailRequests.set(url, request);
  while (wordDetailRequests.size > MAX_CACHED_WORD_DETAILS) {
    const oldest = wordDetailRequests.keys().next().value;
    if (!oldest) break;
    wordDetailRequests.delete(oldest);
  }
  return request;
}

export function prefetchWordDetail(query: WordDetailQuery): void {
  void loadWordDetail(getWordDetailUrl(query)).catch(() => {});
}
