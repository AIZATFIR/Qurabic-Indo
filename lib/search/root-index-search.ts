import type { RootWord } from '../types/morphology';
import { ROOT_DATABASE } from '../data/roots';
import { stripArabicHarakat } from './arabic-normalization';
import { normalizePhoneticQuery } from './query-normalization';

/** Search root-index metadata without loading word-level QAC token tables. */
export function searchRoots(query: string): RootWord[] {
  const rawCleaned = query.trim().toLowerCase();
  const normalized = normalizePhoneticQuery(query);
  if (!rawCleaned) return ROOT_DATABASE;

  return ROOT_DATABASE.filter((root) => {
    const idClean = root.id.toLowerCase().replace(/-/g, '');
    if (idClean === normalized || idClean === rawCleaned) return true;
    const arabicJoinedClean = stripArabicHarakat(root.rootArabicJoined);
    const arabicSpacedClean = stripArabicHarakat(root.rootArabic.replace(/\s+/g, ''));
    if (arabicJoinedClean === normalized || arabicSpacedClean === normalized || arabicJoinedClean === rawCleaned) return true;
    if (root.rootLatin.toLowerCase() === normalized || root.rootLatin.toLowerCase() === rawCleaned) return true;
    if (root.titleIndo.toLowerCase().includes(normalized) || root.titleIndo.toLowerCase().includes(rawCleaned)) return true;

    const tagMatch = root.tags.some((tag) => {
      const cleanTag = tag.toLowerCase().replace(/[-_.\s]+/g, '');
      return cleanTag === normalized || cleanTag === rawCleaned || tag.toLowerCase() === rawCleaned;
    });
    if (tagMatch) return true;
    return root.meaningsIndonesian.some((meaning) => meaning.toLowerCase().includes(normalized) || meaning.toLowerCase().includes(rawCleaned));
  });
}
