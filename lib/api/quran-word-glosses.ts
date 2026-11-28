import { getSurahByNumber } from '@/lib/data/surah-list';
import { fetchJsonWithTimeout } from './request';
import { getMaqamWordGlosses } from '@/lib/lexicon/maqam';
import { formatMaqamGloss } from '@/lib/lexicon/maqam-gloss-format';
import { normalizeIndonesianWbwGloss } from './indonesian-wbw-normalizer';

export type QuranWordGlossLanguage = 'id' | 'en';
const VERSE_GLOSS_CONCURRENCY = 8;

type QuranWord = {
  char_type_name?: string;
  location?: string;
  text_uthmani?: string;
  transliteration?: { text?: string };
  translation?: { text?: string };
};

export interface QuranWordToken {
  location: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}

function cleanGloss(value: string): string {
  return value
    .replace(/<sup\b[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseLocation(value: string): { verseKey: string; location: string } | null {
  const match = /^(\d{1,3}):(\d{1,3}):(\d{1,3})$/.exec(value);
  if (!match) return null;
  const surah = Number(match[1]);
  const ayah = Number(match[2]);
  const position = Number(match[3]);
  const surahMeta = getSurahByNumber(surah);
  if (!surahMeta || ayah < 1 || ayah > surahMeta.ayahsCount || position < 1) return null;
  return { verseKey: `${surah}:${ayah}`, location: `${surah}:${ayah}:${position}` };
}

export async function getQuranVerseWordTokens(
  verseKey: string,
  language: QuranWordGlossLanguage,
): Promise<QuranWordToken[]> {
  const params = new URLSearchParams({
    language,
    words: 'true',
    word_fields: 'text_uthmani,location,transliteration,translation',
  });
  const { response, data } = await fetchJsonWithTimeout<any>(
    `https://api.quran.com/api/v4/verses/by_key/${verseKey}?${params.toString()}`,
    { next: { revalidate: 86_400 } },
    6_000,
  );
  if (!response.ok || !Array.isArray(data?.verse?.words)) throw new Error('Quran.com word data unavailable.');

  const tokens: QuranWordToken[] = [];
  for (const word of data.verse.words as QuranWord[]) {
    if (word.char_type_name === 'end' || typeof word.location !== 'string') continue;
    const parsed = parseLocation(word.location);
    if (!parsed || parsed.verseKey !== verseKey) continue;
    const rawGloss = typeof word.translation?.text === 'string' ? cleanGloss(word.translation.text) : '';
    const gloss = language === 'id' ? normalizeIndonesianWbwGloss(rawGloss) : rawGloss;
    tokens.push({
      location: word.location,
      arabic: word.text_uthmani || '',
      transliteration: word.transliteration?.text || '',
      meaning: gloss,
    });
  }
  return tokens;
}

async function fetchVerseGlosses(verseKey: string, language: QuranWordGlossLanguage): Promise<Record<string, string>> {
  const tokens = await getQuranVerseWordTokens(verseKey, language);
  const glosses: Record<string, string> = {};
  for (const token of tokens) if (token.meaning) glosses[token.location] = token.meaning;
  return glosses;
}

export async function getQuranWordGlosses(
  locations: string[],
  language: QuranWordGlossLanguage,
): Promise<{ meanings: Record<string, string>; sources: Record<string, 'quran-com-wbw' | 'maqam-english-gloss'> }> {
  const parsed = [...new Map(locations.flatMap((value) => {
    const result = parseLocation(value);
    return result ? [[result.location, result] as const] : [];
  })).values()];
  if (parsed.length === 0) return { meanings: {}, sources: {} };

  const verseKeys = [...new Set(parsed.map((item) => item.verseKey))];
  const glosses: Record<string, string> = {};
  let requestFailed = false;
  for (let index = 0; index < verseKeys.length; index += VERSE_GLOSS_CONCURRENCY) {
    const batch = verseKeys.slice(index, index + VERSE_GLOSS_CONCURRENCY);
    const results = await Promise.allSettled(batch.map((verseKey) => fetchVerseGlosses(verseKey, language)));
    for (const result of results) {
      if (result.status === 'fulfilled') Object.assign(glosses, result.value);
      else requestFailed = true;
    }
  }
  // Keep useful results when one verse in a multi-verse family request fails.
  // Fail the request only when upstream failures leave us with no usable glosses.
  const matched: Record<string, string> = {};
  const sources: Record<string, 'quran-com-wbw' | 'maqam-english-gloss'> = {};
  for (const { location } of parsed) {
    if (glosses[location]) {
      matched[location] = glosses[location];
      sources[location] = 'quran-com-wbw';
    }
  }
  const missing = parsed.map(({ location }) => location).filter((location) => !matched[location]);
  if (missing.length > 0) {
    const maqam = await getMaqamWordGlosses(missing);
    for (const [location, entry] of Object.entries(maqam)) {
      matched[location] = formatMaqamGloss(entry.gloss);
      sources[location] = 'maqam-english-gloss';
    }
  }
  // A source-backed local gloss is useful even when Quran.com is unavailable.
  // Only fail when neither source can provide any of the requested locations.
  if (requestFailed && Object.keys(matched).length === 0) {
    throw new Error('Word gloss data could not be loaded.');
  }
  return { meanings: matched, sources };
}
