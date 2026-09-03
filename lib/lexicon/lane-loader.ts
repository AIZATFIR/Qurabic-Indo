import { LaneRootLexicon, LaneEntryRecord, LexicalLookupResult } from './types';
import manifestData from './data/manifest.json';
import { buckwalterToArabic } from '../morphology/buckwalter';

declare const __non_webpack_require__: any;

const MANIFEST: Record<string, string> = manifestData as Record<string, string>;
const CHUNK_CACHE: Map<string, LaneEntryRecord[]> = new Map();

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
function loadChunk(chunkFilename: string): LaneEntryRecord[] | null {
  if (CHUNK_CACHE.has(chunkFilename)) {
    return CHUNK_CACHE.get(chunkFilename)!;
  }

  if (typeof window === 'undefined') {
    try {
      const getModule = (name: string) => {
        try {
          return Function('return require')()(name);
        } catch {
          return null;
        }
      };
      const fs = getModule('fs');
      const path = getModule('path');
      if (fs && path) {
        const chunkPath = path.join(process.cwd(), 'lib', 'lexicon', 'data', 'chunks', chunkFilename);
        if (fs.existsSync(chunkPath)) {
          const raw = fs.readFileSync(chunkPath, 'utf-8');
          const parsed = JSON.parse(raw) as LaneEntryRecord[];
          CHUNK_CACHE.set(chunkFilename, parsed);
          return parsed;
        }
      }
    } catch (err) {
      console.warn(`Could not load Lane chunk ${chunkFilename} on server:`, err);
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

  const lookupKeys: string[] = [];

  if (lemmaArabic) {
    const norm = normalizeArabicKey(lemmaArabic);
    if (norm) {
      lookupKeys.push(`lemma_norm:${norm}`);
      lookupKeys.push(`lemma_bare:${norm}`);
    }
    lookupKeys.push(`lemma_ar:${lemmaArabic}`);
  }

  if (lemmaBw) {
    const cleanBw = lemmaBw.replace(/[{`~]/g, '');
    lookupKeys.push(`lemma_bw:${lemmaBw}`);
    lookupKeys.push(`lemma_bw:${cleanBw}`);

    const arFromBw = buckwalterToArabic(lemmaBw);
    const normFromBw = normalizeArabicKey(arFromBw);
    if (normFromBw) {
      lookupKeys.push(`lemma_norm:${normFromBw}`);
      lookupKeys.push(`lemma_bare:${normFromBw}`);
    }
  }

  for (const k of lookupKeys) {
    const chunkFilename = MANIFEST[k];
    if (chunkFilename) {
      const chunk = loadChunk(chunkFilename);
      if (chunk) {
        // Match entry by headword
        const match = chunk.find(e => {
          if (lemmaArabic && normalizeArabicKey(e.headwordArabic) === normalizeArabicKey(lemmaArabic)) return true;
          if (lemmaArabic && e.bareword && normalizeArabicKey(e.bareword) === normalizeArabicKey(lemmaArabic)) return true;
          if (lemmaBw && e.headwordBw === lemmaBw) return true;
          if (lemmaBw && e.headwordBw.replace(/[{`~]/g, '') === lemmaBw.replace(/[{`~]/g, '')) return true;
          return false;
        });
        if (match) return match;
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
    const manifestKey = `root_bw:${cand}`;
    const chunkFilename = MANIFEST[manifestKey];
    if (chunkFilename) {
      const chunk = loadChunk(chunkFilename);
      if (chunk) {
        const rootEntries = chunk.filter(e => e.rootBw === cand || candidates.includes(e.rootBw));
        if (rootEntries.length > 0) {
          const first = rootEntries[0];
          return {
            rootArabic: first.rootArabic || buckwalterToArabic(rootBw),
            rootBw,
            volume: first.volume,
            page: first.page,
            entries: rootEntries,
            sourceCitation: `Edward William Lane, An Arabic-English Lexicon · Book I, Part ${first.volume}, p. ${first.page}`
          };
        }
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

  // 2. Try matching by exact lemma Buckwalter / Arabic
  if (lemmaBw) {
    const cleanLemma = lemmaBw.replace(/[{`~]/g, '');
    const matchByLemma = rootRec.entries.find(
      e => e.headwordBw === lemmaBw || e.headwordBw.replace(/[{`~]/g, '') === cleanLemma
    );
    if (matchByLemma) return matchByLemma;
  }

  // 3. Match primary Form 1 / Root Headword
  const form1 = rootRec.entries.find(e => e.itype === '1' || e.itype === 'I');
  if (form1) return form1;

  // 4. Default to first valid root entry with senses
  return rootRec.entries.find(e => e.senses && e.senses.length > 0) || rootRec.entries[0];
}

/**
 * High-level resolver: Resolves Lane definition for a given lemma/root combo with dual-layer fallback
 */
export async function resolveClassicalLexiconForLemma(
  lemmaBw?: string,
  rootBw?: string,
  verbForm?: string,
  lemmaArabic?: string
): Promise<LexicalLookupResult> {
  // Layer 1: Direct Lemma / Preposition / Particle Match
  const directMatch = getLaneLemmaRecord(lemmaBw, lemmaArabic);
  if (directMatch && directMatch.senses && directMatch.senses.length > 0) {
    return {
      hasLexicalData: true,
      source: "Lane's Arabic-English Lexicon",
      rootArabic: directMatch.rootArabic || (rootBw ? buckwalterToArabic(rootBw) : undefined),
      rootBw: directMatch.rootBw || rootBw,
      matchedLemmaArabic: directMatch.headwordArabic,
      matchedLemmaBw: directMatch.headwordBw,
      matchedForm: directMatch.itype ? `Form ${directMatch.itype}` : undefined,
      definition: directMatch.definition || directMatch.senses[0]?.text,
      sourceDefinition: directMatch.sourceDefinition,
      translationMethod: 'classical_source',
      isRootEntry: false,
      senses: directMatch.senses,
      volume: directMatch.volume,
      page: directMatch.page,
      sourceCitation: `Edward William Lane, An Arabic-English Lexicon · Book I, Part ${directMatch.volume}, p. ${directMatch.page}`
    };
  }

  // Layer 2: Root Hierarchy Match
  if (rootBw) {
    const rootRec = getLaneRootRecord(rootBw);
    const entry = rootRec ? getLaneEntryForLemma(rootBw, lemmaBw, verbForm) : null;

    if (rootRec && entry && entry.senses && entry.senses.length > 0) {
      return {
        hasLexicalData: true,
        source: "Lane's Arabic-English Lexicon",
        rootArabic: rootRec.rootArabic,
        rootBw: rootRec.rootBw,
        matchedLemmaArabic: entry.headwordArabic,
        matchedLemmaBw: entry.headwordBw,
        matchedForm: entry.itype ? `Form ${entry.itype}` : undefined,
        definition: entry.definition || entry.senses[0]?.text,
        sourceDefinition: entry.sourceDefinition,
        translationMethod: 'classical_source',
        isRootEntry: true,
        senses: entry.senses,
        volume: entry.volume,
        page: entry.page,
        sourceCitation: rootRec.sourceCitation
      };
    }
  }

  // Layer 3: Honest missing data state
  return {
    hasLexicalData: false,
    source: "Lane's Arabic-English Lexicon",
    rootArabic: rootBw ? buckwalterToArabic(rootBw) : undefined,
    rootBw,
    senses: [],
    sourceCitation: "Lane's Arabic-English Lexicon",
    message: 'Makna leksikal belum terindeks untuk entri ini'
  };
}
