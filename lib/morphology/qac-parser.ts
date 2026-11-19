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
let cachedRawLines: string[] | null = null;
const targetedRootRecords = new Map<string, NormalizedMorphologyRecord[]>();
const targetedWordRecords = new Map<string, NormalizedMorphologyRecord[]>();
const MAX_TARGETED_ROOTS = 32;
const MAX_TARGETED_WORDS = 64;

function normalizeArabicText(text: string): string {
  if (!text) return '';
  let norm = text.replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\uFD3E\uFD3F]/g, '');
  norm = norm.replace(/[\u0622\u0623\u0625\u0671\u0672\u0673\u0675]/g, '\u0627');
  norm = norm.replace(/\u0649/g, '\u064A');
  return norm.trim();
}

function parseMorphologyLine(line: string): NormalizedMorphologyRecord | undefined {
  if (!line || line.startsWith('#') || line.startsWith('LOCATION')) return undefined;
  const parts = line.split('\t');
  if (parts.length < 4) return undefined;

  const locRaw = parts[0].replace(/[()]/g, '');
  const [sStr, aStr, wStr, segStr] = locRaw.split(':');
  const surah = parseInt(sStr, 10);
  const ayah = parseInt(aStr, 10);
  const word = parseInt(wStr, 10);
  const segment = parseInt(segStr, 10);
  const form = parts[1];
  const tag = parts[2];
  const rawFeatures = parts[3];
  const root = rawFeatures.match(/ROOT:([^|]+)/)?.[1];
  const lemma = rawFeatures.match(/LEM:([^|]+)/)?.[1];
  const pos = rawFeatures.match(/POS:([^|]+)/)?.[1] || tag;
  const rootArabic = root ? buckwalterToArabic(root).split('').join(' ') : undefined;
  const lemmaArabic = lemma ? buckwalterToArabic(lemma) : undefined;
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
  const verbForm = verbFormMatch ? `Form ${verbFormMatch[1]}` : pos === 'V' ? 'Form I' : undefined;
  let nounType: 'ACT_PCPL' | 'PASS_PCPL' | 'VN' | 'NOUN' | undefined;
  if (isActPcpl) nounType = 'ACT_PCPL';
  else if (isPassPcpl) nounType = 'PASS_PCPL';
  else if (isVn) nounType = 'VN';
  else if (pos === 'N') nounType = 'NOUN';

  let normalizedCategory = '';
  let linguisticInterpretation = '';
  if (pos === 'V') {
    normalizedCategory = `Verb + Form ${isFormII ? 'II' : 'I'} + ${verbType || 'General'}`;
    linguisticInterpretation = `Fi'il ${verbType === 'PERF' ? 'Madhi' : verbType === 'IMPF' ? 'Mudhari\'' : 'Amr'} Form ${isFormII ? "II (Fa''ala)" : 'I (Mujarrad)'}`;
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
  const sourceEvidence = `QAC POS:${pos}${isPerf ? ' + PERF' : ''}${isImpf ? ' + IMPF' : ''}${isImpv ? ' + IMPV' : ''}${isActPcpl ? ' + ACT|PCPL' : ''}${isVn ? ' + VN' : ''}${isFormII ? ' + Form (II)' : ''}`;

  return {
    surah, ayah, word, segment, locationKey, wordLocationKey, ayahLocationKey,
    form, formArabic: buckwalterToArabic(form), tag, pos, root, rootArabic,
    lemma, lemmaArabic, verbType, verbForm, nounType, rawTag: tag, rawFeatures,
    normalizedCategory, linguisticInterpretation,
    interpretationContract: {
      label: linguisticInterpretation,
      sourceEvidence,
      layer: 'interpretation',
      derivation: 'derived'
    }
  };
}

function getRawQACLines(): string[] | undefined {
  if (cachedRawLines) return cachedRawLines;
  if (typeof window !== 'undefined') return undefined;
  try {
    const nodeReq = (globalThis as any).require || eval('require');
    const fs = nodeReq('fs');
    const path = nodeReq('path');
    const candidates = [
      path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt'),
      path.join(__dirname, 'quranic-corpus-morphology-0.4.txt'),
      path.join(__dirname, '..', 'quranic-corpus-morphology-0.4.txt'),
      path.join(__dirname, '..', '..', 'lib', 'quranic-corpus-morphology-0.4.txt'),
      path.join(process.cwd(), '.next/server/lib/quranic-corpus-morphology-0.4.txt'),
    ];
    const sourcePath = candidates.find((candidate: string) => fs.existsSync(candidate));
    if (!sourcePath) return undefined;
    cachedRawLines = fs.readFileSync(sourcePath, 'utf8').split('\n');
    return cachedRawLines!;
  } catch {
    return undefined;
  }
}

export function getQACRecordsByWordLocation(location: string): NormalizedMorphologyRecord[] {
  const key = location.split(':').slice(0, 3).join(':');
  const cached = targetedWordRecords.get(key);
  if (cached) return cached;
  const lines = getRawQACLines();
  if (!lines) return getQACAuthoritativeIndex().recordsByWordLocation.get(key) || [];

  const records: NormalizedMorphologyRecord[] = [];
  const prefix = `(${key}:`;
  for (const line of lines) {
    if (!line.startsWith(prefix)) continue;
    const record = parseMorphologyLine(line.trim());
    if (record) records.push(record);
  }
  targetedWordRecords.set(key, records);
  if (targetedWordRecords.size > MAX_TARGETED_WORDS) {
    targetedWordRecords.delete(targetedWordRecords.keys().next().value!);
  }
  return records;
}

export function getQACRecordsByRoot(root: string): NormalizedMorphologyRecord[] {
  const cached = targetedRootRecords.get(root);
  if (cached) return cached;
  const lines = getRawQACLines();
  if (!lines) return getQACAuthoritativeIndex().recordsByRoot.get(root) || [];

  const exactRoot = `|ROOT:${root}`;
  const records: NormalizedMorphologyRecord[] = [];
  for (const line of lines) {
    if (!line.includes(exactRoot)) continue;
    const afterRoot = line.slice(line.indexOf(exactRoot) + exactRoot.length);
    if (afterRoot && afterRoot[0] !== '|' && afterRoot[0] !== '\t') continue;
    const record = parseMorphologyLine(line.trim());
    if (record?.root === root) records.push(record);
  }
  targetedRootRecords.set(root, records);
  if (targetedRootRecords.size > MAX_TARGETED_ROOTS) {
    targetedRootRecords.delete(targetedRootRecords.keys().next().value!);
  }
  return records;
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

    const candidatePaths = [
      path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt'),
      path.join(__dirname, 'quranic-corpus-morphology-0.4.txt'),
      path.join(__dirname, '..', 'quranic-corpus-morphology-0.4.txt'),
      path.join(__dirname, '..', '..', 'lib/quranic-corpus-morphology-0.4.txt'),
      path.join(process.cwd(), '.next/server/lib/quranic-corpus-morphology-0.4.txt'),
    ];
    let resolvedPath: string | null = null;
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        resolvedPath = p;
        break;
      }
    }

    if (!resolvedPath) {
      // Robust Serverless Fallback: Load precompiled JSON without needing 6.1MB raw text file
      try {
        const locationsData = nodeReq('./data/qac-locations.json');
        const tokensData = nodeReq('./data/qac-tokens.json');
        const recordsByWordLocation = new Map<string, NormalizedMorphologyRecord[]>();
        const recordsByToken = new Map<string, NormalizedMorphologyRecord[]>();
        const recordsByRoot = new Map<string, NormalizedMorphologyRecord[]>();
        const recordsByLemma = new Map<string, NormalizedMorphologyRecord[]>();
        const recordsByLocation = new Map<string, NormalizedMorphologyRecord>();

        for (const [locKey, tuple] of Object.entries(locationsData as Record<string, [string, string, string, string, string]>)) {
          const [sStr, aStr, wStr] = locKey.split(':');
          const surah = parseInt(sStr, 10);
          const ayah = parseInt(aStr, 10);
          const word = parseInt(wStr, 10);
          const [rootBw, lemmaBw, posRaw, typeRaw, formRaw] = tuple;
          const rootArabic = rootBw ? buckwalterToArabic(rootBw).split('').join(' ') : undefined;
          const lemmaArabic = lemmaBw ? buckwalterToArabic(lemmaBw) : undefined;
          const pos = posRaw === 'V' ? 'V' : (posRaw === 'N' || posRaw === 'PN' || posRaw === 'ADJ') ? 'N' : posRaw;

          let verbType: 'PERF' | 'IMPF' | 'IMPV' | undefined;
          if (typeRaw === 'PERF') verbType = 'PERF';
          else if (typeRaw === 'IMPF') verbType = 'IMPF';
          else if (typeRaw === 'IMPV') verbType = 'IMPV';

          const rec: NormalizedMorphologyRecord = {
            surah,
            ayah,
            word,
            segment: 1,
            locationKey: `${locKey}:1`,
            wordLocationKey: locKey,
            ayahLocationKey: `${surah}:${ayah}`,
            form: lemmaBw || '',
            formArabic: lemmaArabic || '',
            tag: posRaw,
            pos,
            root: rootBw || undefined,
            rootArabic,
            lemma: lemmaBw || undefined,
            lemmaArabic,
            verbType,
            verbForm: formRaw || undefined,
            nounType: typeRaw.includes('PCPL') || typeRaw === 'VN' ? (typeRaw as any) : undefined,
            rawTag: posRaw,
            rawFeatures: `POS:${posRaw}${rootBw ? `|ROOT:${rootBw}` : ''}${lemmaBw ? `|LEM:${lemmaBw}` : ''}${verbType ? `|${verbType}` : ''}`,
            normalizedCategory: pos === 'V' ? `Verb + ${formRaw || 'Form I'} + ${verbType || ''}` : `Noun (${posRaw})`,
            linguisticInterpretation: pos === 'V' ? `Fi'il ${verbType === 'PERF' ? 'Madhi' : verbType === 'IMPF' ? "Mudhari'" : 'Amr'} ${formRaw || 'Form I'}` : `Isim (${posRaw})`,
            interpretationContract: {
              label: pos === 'V' ? `Fi'il ${verbType || ''}` : `Isim`,
              sourceEvidence: 'Precompiled QAC v0.4',
              layer: 'interpretation',
              derivation: 'derived'
            }
          };

          recordsByLocation.set(`${locKey}:1`, rec);
          recordsByWordLocation.set(locKey, [rec]);

          if (rootBw) {
            if (!recordsByRoot.has(rootBw)) recordsByRoot.set(rootBw, []);
            recordsByRoot.get(rootBw)!.push(rec);
          }
          if (lemmaBw) {
            if (!recordsByLemma.has(lemmaBw)) recordsByLemma.set(lemmaBw, []);
            recordsByLemma.get(lemmaBw)!.push(rec);
          }
        }

        for (const [tokKey, tuple] of Object.entries(tokensData as Record<string, [string, string, string, string, string]>)) {
          const [rootBw, lemmaBw, posRaw, typeRaw, formRaw] = tuple;
          const rootArabic = rootBw ? buckwalterToArabic(rootBw).split('').join(' ') : undefined;
          const lemmaArabic = lemmaBw ? buckwalterToArabic(lemmaBw) : undefined;
          const pos = posRaw === 'V' ? 'V' : (posRaw === 'N' || posRaw === 'PN' || posRaw === 'ADJ') ? 'N' : posRaw;

          const rec: NormalizedMorphologyRecord = {
            surah: 0,
            ayah: 0,
            word: 0,
            segment: 1,
            locationKey: '0:0:0:1',
            wordLocationKey: '0:0:0',
            ayahLocationKey: '0:0',
            form: lemmaBw || '',
            formArabic: tokKey,
            tag: posRaw,
            pos,
            root: rootBw || undefined,
            rootArabic,
            lemma: lemmaBw || undefined,
            lemmaArabic,
            verbType: typeRaw === 'IMPV' ? 'IMPV' : typeRaw === 'PERF' ? 'PERF' : typeRaw === 'IMPF' ? 'IMPF' : undefined,
            verbForm: formRaw || undefined,
            nounType: undefined,
            rawTag: posRaw,
            rawFeatures: `POS:${posRaw}${rootBw ? `|ROOT:${rootBw}` : ''}${lemmaBw ? `|LEM:${lemmaBw}` : ''}`,
            normalizedCategory: pos === 'V' ? `Verb + ${formRaw || 'Form I'}` : `Noun (${posRaw})`,
            linguisticInterpretation: pos === 'V' ? `Fi'il` : `Isim`,
            interpretationContract: {
              label: 'QAC Precompiled',
              sourceEvidence: 'QAC v0.4',
              layer: 'interpretation',
              derivation: 'derived'
            }
          };

          recordsByToken.set(tokKey, [rec]);
        }

        cachedIndex = {
          totalRecords: recordsByLocation.size,
          rootBearingRecordsCount: recordsByRoot.size,
          uniqueRootsCount: recordsByRoot.size,
          uniqueLemmasCount: recordsByLemma.size,
          recordsByRoot,
          recordsByLemma,
          recordsByLocation,
          recordsByWordLocation,
          recordsByToken
        };

        return cachedIndex;
      } catch (err) {
        return emptyFallback;
      }
    }

    const lines = cachedRawLines || fs.readFileSync(resolvedPath, 'utf8').split('\n');
    cachedRawLines = lines;

    const recordsByRoot = new Map<string, NormalizedMorphologyRecord[]>();
    const recordsByLemma = new Map<string, NormalizedMorphologyRecord[]>();
    const recordsByLocation = new Map<string, NormalizedMorphologyRecord>();
    const recordsByWordLocation = new Map<string, NormalizedMorphologyRecord[]>();

    let totalRecords = 0;
    let rootBearingRecordsCount = 0;

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#') || line.startsWith('LOCATION')) continue;

      totalRecords++;
      const record = parseMorphologyLine(line);
      if (!record) continue;
      if (record.root) rootBearingRecordsCount++;

      recordsByLocation.set(record.locationKey, record);
      if (!recordsByWordLocation.has(record.wordLocationKey)) recordsByWordLocation.set(record.wordLocationKey, []);
      recordsByWordLocation.get(record.wordLocationKey)!.push(record);

      if (record.root) {
        if (!recordsByRoot.has(record.root)) recordsByRoot.set(record.root, []);
        recordsByRoot.get(record.root)!.push(record);
      }
      if (record.lemma) {
        if (!recordsByLemma.has(record.lemma)) recordsByLemma.set(record.lemma, []);
        recordsByLemma.get(record.lemma)!.push(record);
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
      const fullWithAlif = normalizeArabicText(fullArabic.replace(/\u0670/g, '\u0627'));
      if (fullWithAlif && !recordsByToken.has(fullWithAlif)) {
        recordsByToken.set(fullWithAlif, recs);
      }

      // Exact vowelled form index for high-precision morphology matching
      if (fullArabic && !recordsByToken.has(fullArabic)) {
        recordsByToken.set(fullArabic, recs);
      }

      const stemRec = recs.find(r => r.root || r.pos === 'V' || r.pos === 'N' || r.pos === 'ADJ');
      if (stemRec) {
        if (stemRec.formArabic && !recordsByToken.has(stemRec.formArabic)) {
          recordsByToken.set(stemRec.formArabic, recs);
        }
        const cleanStem = normalizeArabicText(stemRec.formArabic);
        if (cleanStem && !recordsByToken.has(cleanStem)) {
          recordsByToken.set(cleanStem, recs);
        }
        const stemWithAlif = normalizeArabicText(stemRec.formArabic.replace(/\u0670/g, '\u0627'));
        if (stemWithAlif && !recordsByToken.has(stemWithAlif)) {
          recordsByToken.set(stemWithAlif, recs);
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
