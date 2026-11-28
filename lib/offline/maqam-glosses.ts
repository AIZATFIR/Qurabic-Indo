import { formatMaqamGloss } from '@/lib/lexicon/maqam-gloss-format';

let glossIndexPromise: Promise<Record<string, string>> | null = null;

async function loadGlossIndex(): Promise<Record<string, string>> {
  if (!glossIndexPromise) {
    glossIndexPromise = fetch('/data/maqam-glosses.json', { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('Offline word-gloss data is not available.');
        return response.json() as Promise<Record<string, string>>;
      })
      .catch((error) => {
        glossIndexPromise = null;
        throw error;
      });
  }
  return glossIndexPromise;
}

export async function getOfflineMaqamGlosses(locations: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(locations.filter((location) => /^\d{1,3}:\d{1,3}:\d{1,3}$/.test(location)))];
  if (!unique.length) return {};
  const index = await loadGlossIndex();
  const found: Record<string, string> = {};
  for (const location of unique) {
    const gloss = index[location];
    if (typeof gloss === 'string' && gloss.trim()) found[location] = formatMaqamGloss(gloss);
  }
  return found;
}
