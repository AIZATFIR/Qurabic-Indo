import { LaneRootLexicon, LaneEntryRecord } from './types';
import manifestData from './data/manifest.json';
import { buckwalterToArabic } from '../morphology/buckwalter';

declare const __non_webpack_require__: any;

export interface LaneChunkPayload {
  roots: Record<string, LaneRootLexicon>;
  lemmas: Record<string, LaneEntryRecord>;
}

const MANIFEST: Record<string, string> = manifestData as Record<string, string>;
const CHUNK_CACHE: Map<string, LaneChunkPayload> = new Map();

function normalizeArabicKey(text: string): string {
  if (!text) return '';
  let t = text.replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  t = t.replace(/[أإآٱٲٳ]/g, 'ا');
  t = t.replace(/[ىئ]/g, 'ي');
  t = t.replace(/ة/g, 'ه');
  return t.trim();
}

/**
 * Server-safe on-demand chunk loader.
 * Invariants:
 * 1. Never bundles 70MB dictionary into client JavaScript bundles.
 * 2. On server (SSR / API / Tests), loads modular chunk on-demand and caches in memory.
 */
function loadChunk(chunkName: string): LaneChunkPayload | null {
  if (CHUNK_CACHE.has(chunkName)) {
    return CHUNK_CACHE.get(chunkName)!;
  }

  if (typeof window === 'undefined') {
    try {
      const req = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : require;
      const fs = req('fs');
      const path = req('path');
      const chunkPath = path.join(process.cwd(), 'lib', 'lexicon', 'data', 'chunks', `${chunkName}.json`);
      if (fs.existsSync(chunkPath)) {
        const raw = fs.readFileSync(chunkPath, 'utf-8');
        const parsed = JSON.parse(raw) as LaneChunkPayload;
        CHUNK_CACHE.set(chunkName, parsed);
        return parsed;
      }
    } catch (err) {
      console.warn(`Could not load Lane chunk ${chunkName} on server:`, err);
    }
  }

  return null;
}

/**
 * Generates classical root key candidate variants (e.g. geminate ungeminated, weak letters)
 */
function getRootKeyVariants(rootBw: string): string[] {
  const clean = rootBw.trim().replace(/-/g, '');
  const variants: string[] = [clean];

  // 1. Weak letter Alif Maqsura (QAC 'y' -> Lane 'Y')
  if (clean.endsWith('y')) {
    variants.push(clean.slice(0, -1) + 'Y');
    variants.push(clean.slice(0, -1) + 'w');
  }

  // 2. Geminate ungeminated (QAC 'Dmm' -> Lane 'Dm', 'gll' -> 'gl')
  if (clean.length === 3 && clean[1] === clean[2]) {
    variants.push(clean.slice(0, 2));
  }

  // 3. Hamza variants (QAC 'A' -> Lane 'A^')
  if (clean.includes('A')) {
    variants.push(clean.replace(/A/g, 'A^'));
  }

  return variants;
}

/**
 * Retrieves direct Lemma / Headword entry from Lane (supports particles, prepositions, and specific lemmas)
 */
export function getLaneLemmaRecord(lemmaBw?: string, lemmaArabic?: string): LaneEntryRecord | null {
  if (!lemmaBw && !lemmaArabic) return null;

  // 1. Try normalized Arabic lemma
  const arCandidates: string[] = [];
  if (lemmaArabic) {
    arCandidates.push(normalizeArabicKey(lemmaArabic));
  }
  if (lemmaBw) {
    const arFromBw = buckwalterToArabic(lemmaBw);
    arCandidates.push(normalizeArabicKey(arFromBw));
  }

  for (const ar of arCandidates) {
    if (!ar) continue;
    const manifestKey = `lem_${ar}`;
    const chunkName = MANIFEST[manifestKey];
    if (chunkName) {
      const chunk = loadChunk(chunkName);
      if (chunk && chunk.lemmas && chunk.lemmas[ar]) {
        return chunk.lemmas[ar];
      }
    }
  }

  // 2. Try Buckwalter clean stem
  if (lemmaBw) {
    const cleanBw = lemmaBw.replace(/[{`~]/g, '');
    const manifestKey = `lem_${cleanBw}`;
    const chunkName = MANIFEST[manifestKey];
    if (chunkName) {
      const chunk = loadChunk(chunkName);
      if (chunk && chunk.lemmas && chunk.lemmas[cleanBw]) {
        return chunk.lemmas[cleanBw];
      }
    }
  }

  return null;
}

/**
 * Retrieves the raw verified Lane Lexicon record for a given Buckwalter root
 * @param rootBw Case-sensitive Buckwalter root identifier (e.g. "Ewn", "Sbr", "xlT", "ryb", "Dmm", "hdy")
 */
export function getLaneRootRecord(rootBw: string): LaneRootLexicon | null {
  if (!rootBw) return null;
  const candidates = getRootKeyVariants(rootBw);

  for (const cand of candidates) {
    const chunkName = MANIFEST[cand];
    if (chunkName) {
      const chunk = loadChunk(chunkName);
      if (chunk && chunk.roots && chunk.roots[cand]) {
        return chunk.roots[cand];
      }
    }
  }

  return null;
}

function normalizeVerbFormToNumber(verbForm?: string): string | null {
  if (!verbForm) return null;
  const upper = verbForm.toUpperCase().trim();
  if (upper.includes('VIII')) return '8';
  if (upper.includes('VII')) return '7';
  if (upper.includes('VI')) return '6';
  if (upper.includes('IV')) return '4';
  if (upper.includes('IX')) return '9';
  if (upper.includes('X')) return '10';
  if (upper.includes('V')) return '5';
  if (upper.includes('III')) return '3';
  if (upper.includes('II')) return '2';
  if (upper.includes('I')) return '1';

  const digits = verbForm.replace(/[^0-9]/g, '');
  return digits || null;
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
  const formNum = normalizeVerbFormToNumber(verbForm);
  if (formNum) {
    const matchByForm = rootRec.entries.find(e => e.itype === formNum);
    if (matchByForm) return matchByForm;
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
