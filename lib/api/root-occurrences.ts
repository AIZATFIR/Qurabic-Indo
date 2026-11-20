import type { VerseOccurrence } from '@/lib/types/morphology';

export async function fetchRootOccurrences(rootId: string): Promise<VerseOccurrence[]> {
  const response = await fetch(`/data/occurrences/${encodeURIComponent(rootId)}.json`, { cache: 'force-cache' });
  if (!response.ok) throw new Error('Root occurrences unavailable');

  const occurrences: unknown = await response.json();
  if (!Array.isArray(occurrences)) throw new Error('Invalid root occurrences');
  return occurrences as VerseOccurrence[];
}
