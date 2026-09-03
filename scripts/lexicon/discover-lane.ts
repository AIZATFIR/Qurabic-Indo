import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { getQACAuthoritativeIndex } from '../../lib/morphology/qac-parser';
import { buckwalterToArabic } from '../../lib/morphology/buckwalter';

export interface DiscoveryResult {
  totalQacLemmas: number;
  rootBearingLemmas: number;
  rootlessLemmas: number;
  matchedDirectLemma: number;
  matchedViaRoot: number;
  totalResolved: number;
  coveragePercentage: number;
  unresolvedLemmas: string[];
}

export function discoverLaneCoverage(): DiscoveryResult {
  const qacIndex = getQACAuthoritativeIndex();
  const dbPath = path.join(process.cwd(), 'data', 'lexicon', 'lane', 'raw', 'lexicon.sqlite');
  
  if (!fs.existsSync(dbPath)) {
    throw new Error(`Lane SQLite database not found at ${dbPath}`);
  }

  const db = new (sqlite3 as any)(dbPath, { readonly: true });
  
  // Build lookup sets from Lane SQLite
  const directWords = new Set<string>();
  const directBarewords = new Set<string>();
  const directRoots = new Set<string>();

  const rows = db.prepare('SELECT bword, bareword, broot FROM entry').all() as Array<{
    bword?: string;
    bareword?: string;
    broot?: string;
  }>;

  for (const r of rows) {
    if (r.bword) directWords.add(r.bword.trim().replace(/[{`~]/g, ''));
    if (r.bareword) directBarewords.add(r.bareword.trim());
    if (r.broot) directRoots.add(r.broot.trim());
  }

  let rootBearing = 0;
  let rootless = 0;
  let matchedDirect = 0;
  let matchedRoot = 0;
  const unresolved: string[] = [];

  const uniqueLemmas = Array.from(qacIndex.recordsByLemma.keys());

  for (const lem of uniqueLemmas) {
    const records = qacIndex.recordsByLemma.get(lem) || [];
    const hasRoot = records.some(r => r.root);
    const rootBw = records.find(r => r.root)?.root;

    if (hasRoot) rootBearing++;
    else rootless++;

    const cleanLem = lem.replace(/[{`~]/g, '');
    const arLem = buckwalterToArabic(lem);

    let isMatched = false;

    if (directWords.has(cleanLem) || directBarewords.has(arLem)) {
      matchedDirect++;
      isMatched = true;
    } else if (hasRoot && rootBw && directRoots.has(rootBw)) {
      matchedRoot++;
      isMatched = true;
    }

    if (!isMatched) {
      unresolved.push(lem);
    }
  }

  const totalResolved = matchedDirect + matchedRoot;
  const coveragePercentage = (totalResolved / uniqueLemmas.length) * 100;

  db.close();

  return {
    totalQacLemmas: uniqueLemmas.length,
    rootBearingLemmas: rootBearing,
    rootlessLemmas: rootless,
    matchedDirectLemma: matchedDirect,
    matchedViaRoot: matchedRoot,
    totalResolved,
    coveragePercentage,
    unresolvedLemmas: unresolved
  };
}

if (require.main === module) {
  console.log('Running Lexicon Harvest: Discover Lane...');
  const res = discoverLaneCoverage();
  console.log('====================================================');
  console.log(`• Total Unique QAC Lemmas      : ${res.totalQacLemmas}`);
  console.log(`• Root-Bearing Lemmas          : ${res.rootBearingLemmas}`);
  console.log(`• Rootless Lemmas (Particles)  : ${res.rootlessLemmas}`);
  console.log(`• Matched Direct Lemma/Headword: ${res.matchedDirectLemma}`);
  console.log(`• Matched via Root Hierarchy   : ${res.matchedViaRoot}`);
  console.log(`• Total Resolved               : ${res.totalResolved} (${res.coveragePercentage.toFixed(2)}%)`);
  console.log(`• Unresolved Lemmas Count      : ${res.unresolvedLemmas.length}`);
  console.log('====================================================');
}
