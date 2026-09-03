/**
 * Qurabic Lexicon Acquisition Pipeline - Index Builder (Root-Coherent Chunking)
 * Codename: Lexicon Harvest
 */

import sqlite3 from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { parseRawLaneRow } from './parse-lane';
import { normalizeArabicKey, getRootKeyVariants } from './normalize-lane';
import { LaneEntryRecord } from '../../lib/lexicon/types';

interface ChunkManifest {
  version: string;
  totalEntries: number;
  totalSenses: number;
  totalRoots: number;
  totalChunkFiles: number;
  generatedAt: string;
  index: Record<string, string>; // key -> "chunk_XX.json"
}

export function buildLaneProductionIndex() {
  const dbPath = path.join(process.cwd(), 'data', 'lexicon', 'lane', 'raw', 'lexicon.sqlite');
  const chunksDir = path.join(process.cwd(), 'lib', 'lexicon', 'data', 'chunks');

  if (!fs.existsSync(dbPath)) {
    throw new Error(`Lane SQLite database not found at ${dbPath}`);
  }

  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }

  const db = new (sqlite3 as any)(dbPath, { readonly: true });
  console.log('Fetching entries from Lane SQLite database...');

  const rows = db.prepare('SELECT id, word, bword, bareword, root, broot, itype, page, perseusxml FROM entry ORDER BY page ASC, id ASC').all() as any[];
  console.log(`Retrieved ${rows.length} raw entry records from SQLite.`);

  // 1. Group records by root (or '__no_root__' for standalone particle headwords)
  const rootGroups = new Map<string, LaneEntryRecord[]>();
  let totalSenses = 0;

  for (const r of rows) {
    const record = parseRawLaneRow(r);
    totalSenses += record.senses.length;

    const groupKey = (record.rootBw || '').trim() || '__particle_headwords__';
    const group = rootGroups.get(groupKey) || [];
    group.push(record);
    rootGroups.set(groupKey, group);
  }

  console.log(`Grouped into ${rootGroups.size} unique root/headword clusters.`);

  // 2. Distribute root clusters across 20 balanced chunk files (Zero cross-chunk root fragmentation!)
  const TOTAL_CHUNKS = 20;
  const chunks: LaneEntryRecord[][] = Array.from({ length: TOTAL_CHUNKS }, () => []);
  const chunkSizes = new Array(TOTAL_CHUNKS).fill(0);

  // Sort groups by size descending to pack balance, or maintain alphabetical order
  const groupKeys = Array.from(rootGroups.keys());

  groupKeys.forEach((key, idx) => {
    // Find chunk with smallest current size
    let minChunkIdx = 0;
    for (let c = 1; c < TOTAL_CHUNKS; c++) {
      if (chunkSizes[c] < chunkSizes[minChunkIdx]) {
        minChunkIdx = c;
      }
    }

    const entries = rootGroups.get(key)!;
    chunks[minChunkIdx].push(...entries);
    chunkSizes[minChunkIdx] += entries.length;
  });

  const manifestIndex: Record<string, string> = {};
  const uniqueRoots = new Set<string>();

  // 3. Write chunks and build comprehensive collision-free index map
  for (let c = 0; c < TOTAL_CHUNKS; c++) {
    const chunkFilename = `chunk_${String(c).padStart(2, '0')}.json`;
    const chunkFilePath = path.join(chunksDir, chunkFilename);
    const chunkEntries = chunks[c];

    fs.writeFileSync(chunkFilePath, JSON.stringify(chunkEntries, null, 2), 'utf-8');

    for (const entry of chunkEntries) {
      // A. Map by Entry ID
      manifestIndex[entry.entryId] = chunkFilename;

      // B. Map by Root (Arabic, BW, Normalized, Variants)
      if (entry.rootBw) {
        uniqueRoots.add(entry.rootBw);
        manifestIndex[`root_bw:${entry.rootBw}`] = chunkFilename;
        manifestIndex[`root_bw:${entry.rootBw.replace(/[{`~]/g, '')}`] = chunkFilename;

        const variants = getRootKeyVariants(entry.rootBw);
        for (const v of variants) {
          manifestIndex[`root_bw:${v}`] = chunkFilename;
        }
      }

      if (entry.rootArabic) {
        manifestIndex[`root_ar:${entry.rootArabic}`] = chunkFilename;
        const normAr = normalizeArabicKey(entry.rootArabic);
        if (normAr) manifestIndex[`root_norm:${normAr}`] = chunkFilename;
      }

      // C. Map by Direct Headword / Lemma / Particle (Arabic & Buckwalter)
      if (entry.headwordBw) {
        const cleanBw = entry.headwordBw.replace(/[{`~]/g, '');
        manifestIndex[`lemma_bw:${entry.headwordBw}`] = chunkFilename;
        manifestIndex[`lemma_bw:${cleanBw}`] = chunkFilename;
      }

      if (entry.headwordArabic) {
        manifestIndex[`lemma_ar:${entry.headwordArabic}`] = chunkFilename;
        const normHeadAr = normalizeArabicKey(entry.headwordArabic);
        if (normHeadAr) manifestIndex[`lemma_norm:${normHeadAr}`] = chunkFilename;
      }

      if (entry.bareword) {
        manifestIndex[`lemma_bare:${entry.bareword}`] = chunkFilename;
        const normBare = normalizeArabicKey(entry.bareword);
        if (normBare) manifestIndex[`lemma_norm:${normBare}`] = chunkFilename;
      }
    }

    console.log(`Written ${chunkFilename} (${chunkEntries.length} entries)`);
  }

  // Write Manifests (both in chunks and root data directory for direct imports)
  const manifest: ChunkManifest = {
    version: '2.0.0-lexicon-harvest',
    totalEntries: rows.length,
    totalSenses,
    totalRoots: uniqueRoots.size,
    totalChunkFiles: TOTAL_CHUNKS,
    generatedAt: new Date().toISOString(),
    index: manifestIndex
  };

  const chunkManifestPath = path.join(chunksDir, 'manifest.json');
  const dataManifestPath = path.join(process.cwd(), 'lib', 'lexicon', 'data', 'manifest.json');
  fs.writeFileSync(chunkManifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync(dataManifestPath, JSON.stringify(manifestIndex, null, 2), 'utf-8');
  console.log(`Manifest written with ${Object.keys(manifestIndex).length} index keys.`);

  db.close();
  return manifest;
}

if (require.main === module) {
  console.log('Building Lane Lexicon Production Index (Root-Coherent)...');
  const mf = buildLaneProductionIndex();
  console.log('====================================================');
  console.log(`• Total Entries Processed : ${mf.totalEntries}`);
  console.log(`• Total Discrete Senses   : ${mf.totalSenses}`);
  console.log(`• Total Unique Roots      : ${mf.totalRoots}`);
  console.log(`• Total Index Keys        : ${Object.keys(mf.index).length}`);
  console.log('====================================================');
}
