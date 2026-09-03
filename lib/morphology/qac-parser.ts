import { NormalizedMorphologyRecord } from './types';
import { buckwalterToArabic } from './buckwalter';

export interface QACAuthoritativeIndex {
  totalRecords: number;
  rootBearingRecordsCount: number;
  uniqueRootsCount: number;
  uniqueLemmasCount: number;
  recordsByRoot: Map<string, NormalizedMorphologyRecord[]>;
  recordsByLemma: Map<string, NormalizedMorphologyRecord[]>;
  recordsByLocation: Map<string, NormalizedMorphologyRecord>;
  recordsByWordLocation: Map<string, NormalizedMorphologyRecord[]>;
  recordsByToken: Map<string, NormalizedMorphologyRecord[]>;
}

let cachedIndex: QACAuthoritativeIndex | null = null;

function normalizeArabicText(text: string): string {
  if (!text) return '';
  let norm = text.replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\uFD3E\uFD3F]/g, '');
  norm = norm.replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675]/g, '\u0627');
  norm = norm.replace(/\u0649/g, '\u064A');
  return norm.trim();
}

/**
 * Parses lib/quranic-corpus-morphology-0.4.txt into an in-memory authoritative index.
 * Results are cached in memory as a singleton for sub-millisecond retrieval.
 * Uses dynamic require to remain 100% compatible with Next.js client component bundlers.
 */
export function getQACAuthoritativeIndex(): QACAuthoritativeIndex {
  if (cachedIndex) {
    return cachedIndex;
  }

  const emptyFallback: QACAuthoritativeIndex = {
    totalRecords: 0,
    rootBearingRecordsCount: 0,
    uniqueRootsCount: 0,
    uniqueLemmasCount: 0,
    recordsByRoot: new Map(),
    recordsByLemma: new Map(),
    recordsByLocation: new Map(),
    recordsByWordLocation: new Map(),
    recordsByToken: new Map()
  };

  if (typeof window !== 'undefined') {
    return emptyFallback;
  }

  try {
    const nodeReq = (globalThis as any).require || eval('require');
    const fs = nodeReq('fs');
    const path = nodeReq('path');

    const qacPath = path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt');
    if (!fs.existsSync(qacPath)) {
      return emptyFallback;
    }

    const content = fs.readFileSync(qacPath, 'utf8');
    const lines = content.split('\n');

    const recordsByRoot = new Map<string, NormalizedMorphologyRecord[]>();
    const recordsByLemma = new Map<string, NormalizedMorphologyRecord[]>();
    const recordsByLocation = new Map<string, NormalizedMorphologyRecord>();
    const recordsByWordLocation = new Map<string, NormalizedMorphologyRecord[]>();

    let totalRecords = 0;
    let rootBearingRecordsCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#') || line.startsWith('LOCATION')) {
        continue;
      }

      totalRecords++;
      const parts = line.split('\t');
      if (parts.length < 4) continue;

      const locRaw = parts[0].replace(/[()]/g, '');
      const [sStr, aStr, wStr, segStr] = locRaw.split(':');
      const surah = parseInt(sStr, 10);
      const ayah = parseInt(aStr, 10);
      const word = parseInt(wStr, 10);
      const segment = parseInt(segStr, 10);

      const form = parts[1];
      const tag = parts[2];
      const rawFeatures = parts[3];

      // Extract Root
      const rootMatch = rawFeatures.match(/ROOT:([^|]+)/);
      const root = rootMatch ? rootMatch[1] : undefined;
      const rootArabic = root ? buckwalterToArabic(root).split('').join(' ') : undefined;

      // Extract Lemma
      const lemMatch = rawFeatures.match(/LEM:([^|]+)/);
      const lemma = lemMatch ? lemMatch[1] : undefined;
      const lemmaArabic = lemma ? buckwalterToArabic(lemma) : undefined;

      // Extract POS
      const posMatch = rawFeatures.match(/POS:([^|]+)/);
      const pos = posMatch ? posMatch[1] : tag;

      // Layer 2: Normalized Morphology (Strict Deterministic)
      const isPerf = rawFeatures.includes('PERF');
      const isImpf = rawFeatures.includes('IMPF');
      const isImpv = rawFeatures.includes('IMPV');
      const isFormII = rawFeatures.includes('(II)');
      const isActPcpl = rawFeatures.includes('ACT|PCPL');
      const isPassPcpl = rawFeatures.includes('PASS|PCPL');
      const isVn = rawFeatures.includes('VN');

      let verbType: 'PERF' | 'IMPF' | 'IMPV' | undefined;
      if (isPerf) verbType = 'PERF';
      else if (isImpf) verbType = 'IMPF';
      else if (isImpv) verbType = 'IMPV';

      const verbFormMatch = rawFeatures.match(/\((I|II|III|IV|V|VI|VII|VIII|IX|X)\)/);
      const verbForm = verbFormMatch
        ? `Form ${verbFormMatch[1]}`
        : pos === 'V'
        ? 'Form I'
        : undefined;

      let nounType: 'ACT_PCPL' | 'PASS_PCPL' | 'VN' | 'NOUN' | undefined;
      if (isActPcpl) nounType = 'ACT_PCPL';
      else if (isPassPcpl) nounType = 'PASS_PCPL';
      else if (isVn) nounType = 'VN';
      else if (pos === 'N') nounType = 'NOUN';

      let normalizedCategory = '';
      let linguisticInterpretation = '';

      if (pos === 'V') {
        if (isFormII) {
          normalizedCategory = `Verb + Form II + ${verbType || 'General'}`;
          linguisticInterpretation = `Fi'il ${verbType === 'PERF' ? 'Madhi' : verbType === 'IMPF' ? 'Mudhari\'' : 'Amr'} Form II (Fa''ala)`;
        } else {
          normalizedCategory = `Verb + Form I + ${verbType || 'General'}`;
          linguisticInterpretation = `Fi'il ${verbType === 'PERF' ? 'Madhi' : verbType === 'IMPF' ? 'Mudhari\'' : 'Amr'} Form I (Mujarrad)`;
        }
      } else if (pos === 'N') {
        if (isActPcpl) {
          normalizedCategory = 'Noun + Active Participle (ACT|PCPL)';
          linguisticInterpretation = 'Isim Fa\'il';
        } else if (isPassPcpl) {
          normalizedCategory = 'Noun + Passive Participle (PASS|PCPL)';
          linguisticInterpretation = 'Isim Maf\'ul';
        } else if (isVn) {
          normalizedCategory = 'Noun + Verbal Noun (VN)';
          linguisticInterpretation = 'Isim Masdar';
        } else {
          normalizedCategory = 'Noun (General)';
          linguisticInterpretation = 'Isim / Masdar Asal';
        }
      } else {
        normalizedCategory = `Particle / Other (${pos})`;
        linguisticInterpretation = `Harf / Partikel (${pos})`;
      }

      const locationKey = `${surah}:${ayah}:${word}:${segment}`;
      const wordLocationKey = `${surah}:${ayah}:${word}`;
      const ayahLocationKey = `${surah}:${ayah}`;

      const sourceEvidence = `QAC POS:${pos}${rawFeatures.includes('PERF') ? ' + PERF' : ''}${rawFeatures.includes('IMPF') ? ' + IMPF' : ''}${rawFeatures.includes('IMPV') ? ' + IMPV' : ''}${rawFeatures.includes('ACT|PCPL') ? ' + ACT|PCPL' : ''}${rawFeatures.includes('VN') ? ' + VN' : ''}${isFormII ? ' + Form (II)' : ''}`;

      const record: NormalizedMorphologyRecord = {
        surah,
        ayah,
        word,
        segment,
        locationKey,
        wordLocationKey,
        ayahLocationKey,
        form,
        formArabic: buckwalterToArabic(form),
        tag,
        pos,
        root,
        rootArabic,
        lemma,
        lemmaArabic,
        verbType,
        verbForm,
        nounType,
        rawTag: tag,
        rawFeatures,
        normalizedCategory,
        linguisticInterpretation,
        interpretationContract: {
          label: linguisticInterpretation,
          sourceEvidence,
          layer: 'interpretation',
          derivation: 'derived'
        }
      };

      // Index by Location
      recordsByLocation.set(locationKey, record);

      // Index by Word Location
      if (!recordsByWordLocation.has(wordLocationKey)) {
        recordsByWordLocation.set(wordLocationKey, []);
      }
      recordsByWordLocation.get(wordLocationKey)!.push(record);

      // Index by Root
      if (root) {
        rootBearingRecordsCount++;
        if (!recordsByRoot.has(root)) {
          recordsByRoot.set(root, []);
        }
        recordsByRoot.get(root)!.push(record);
      }

      // Index by Lemma
      if (lemma) {
        if (!recordsByLemma.has(lemma)) {
          recordsByLemma.set(lemma, []);
        }
        recordsByLemma.get(lemma)!.push(record);
      }
    }

    // Build recordsByToken index for fast Arabic token lookup
    const recordsByToken = new Map<string, NormalizedMorphologyRecord[]>();
    for (const [_, recs] of recordsByWordLocation.entries()) {
      const fullArabic = recs.map(r => r.formArabic).join('');
      const cleanFull = normalizeArabicText(fullArabic);
      if (cleanFull && !recordsByToken.has(cleanFull)) {
        recordsByToken.set(cleanFull, recs);
      }
      const stemRec = recs.find(r => r.root || r.pos === 'V' || r.pos === 'N' || r.pos === 'ADJ');
      if (stemRec) {
        const cleanStem = normalizeArabicText(stemRec.formArabic);
        if (cleanStem && !recordsByToken.has(cleanStem)) {
          recordsByToken.set(cleanStem, recs);
        }
      }
    }

    cachedIndex = {
      totalRecords,
      rootBearingRecordsCount,
      uniqueRootsCount: recordsByRoot.size,
      uniqueLemmasCount: recordsByLemma.size,
      recordsByRoot,
      recordsByLemma,
      recordsByLocation,
      recordsByWordLocation,
      recordsByToken
    };

    return cachedIndex;
  } catch (e) {
    return emptyFallback;
  }
}
