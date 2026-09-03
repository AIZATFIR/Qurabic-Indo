import { LaneRootLexicon, LaneEntryRecord } from './types';
import lanePilotData from './data/lane-pilot.json';

const LANE_ROOTS: Record<string, LaneRootLexicon> = lanePilotData as Record<string, LaneRootLexicon>;

/**
 * Retrieves the raw verified Lane Lexicon record for a given Buckwalter root
 * @param rootBw Case-sensitive Buckwalter root identifier (e.g. "Ewn", "Sbr", "xlT", "ryb")
 */
export function getLaneRootRecord(rootBw: string): LaneRootLexicon | null {
  if (!rootBw) return null;
  const cleanKey = rootBw.trim().replace(/-/g, '');
  return LANE_ROOTS[cleanKey] || null;
}

/**
 * Retrieves specific Lane lexical entry for a given root and lemma / verb form
 */
export function getLaneEntryForLemma(
  rootBw: string,
  lemmaBw?: string,
  verbForm?: string,
  pos?: string
): LaneEntryRecord | null {
  const rootRec = getLaneRootRecord(rootBw);
  if (!rootRec || !rootRec.entries || rootRec.entries.length === 0) return null;

  // 1. Try matching by verb form (itype) if verb
  if (verbForm) {
    const formNum = verbForm.replace(/[^0-9]/g, '');
    if (formNum) {
      const matchByForm = rootRec.entries.find(e => e.itype === formNum);
      if (matchByForm) return matchByForm;
    }
  }

  // 2. Try matching by headword / lemma Buckwalter
  if (lemmaBw) {
    const cleanLemma = lemmaBw.replace(/[{`~]/g, '');
    const matchByLemma = rootRec.entries.find(e => {
      const cleanHw = e.headwordBw.replace(/[{`~]/g, '');
      return cleanHw === cleanLemma || cleanLemma.includes(cleanHw) || cleanHw.includes(cleanLemma);
    });
    if (matchByLemma) return matchByLemma;
  }

  // 3. Try matching by POS (e.g. Noun / Participle)
  if (pos === 'N' || pos === 'ADJ') {
    const matchByPos = rootRec.entries.find(e => e.pos === pos);
    if (matchByPos) return matchByPos;
  }

  // 4. Default to first primary entry
  return rootRec.entries[0] || null;
}
