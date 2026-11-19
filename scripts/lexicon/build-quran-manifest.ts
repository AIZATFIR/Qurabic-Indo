import fs from 'node:fs';
import path from 'node:path';
import manifestData from '../../lib/lexicon/data/manifest.json';
import locationsData from '../../lib/morphology/data/qac-locations.json';
import { buckwalterToArabic } from '../../lib/morphology/buckwalter';

const manifest = manifestData as Record<string, string>;
const locations = locationsData as Record<string, string[]>;
const quranKeys = new Set<string>();

function normalizeArabicKey(text: string): string {
  return text
    .replace(/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱٲٳ]/g, 'ا')
    .replace(/[ىئ]/g, 'ي')
    .replace(/ة/g, 'ه')
    .trim();
}

function addRootKeys(root: string): void {
  const variants = [root];
  if (root.endsWith('y')) variants.push(`${root.slice(0, -1)}Y`, `${root.slice(0, -1)}w`);
  if (root.length === 3 && root[1] === root[2]) variants.push(root.slice(0, 2));
  if (root.includes('A')) variants.push(root.replace(/A/g, 'A^'));

  for (const variant of variants) {
    const arabic = buckwalterToArabic(variant);
    quranKeys.add(`root_bw:${variant}`);
    quranKeys.add(`root_ar:${arabic}`);
    quranKeys.add(`root_norm:${normalizeArabicKey(arabic)}`);
  }
}

function addLemmaKeys(lemma: string): void {
  const arabic = buckwalterToArabic(lemma);
  const normalized = normalizeArabicKey(arabic);
  const cleanBuckwalter = lemma.replace(/[{}~`]/g, '');

  quranKeys.add(`lemma_bw:${lemma}`);
  quranKeys.add(`lemma_bw:${cleanBuckwalter}`);
  quranKeys.add(`lemma_ar:${arabic}`);
  quranKeys.add(`lemma_norm:${normalized}`);
  quranKeys.add(`lemma_bare:${normalized}`);
}

for (const [root, lemma] of Object.values(locations)) {
  if (root) addRootKeys(root);
  if (lemma) addLemmaKeys(lemma);
}

const quranManifest: Record<string, string | null> = {};
for (const key of quranKeys) quranManifest[key] = manifest[key] || null;

const outputPath = path.join(process.cwd(), 'lib/lexicon/data/quran-manifest.json');
fs.writeFileSync(outputPath, `${JSON.stringify(quranManifest)}\n`);
console.log(`Wrote ${Object.keys(quranManifest).length} Quran lookup keys (${Buffer.byteLength(JSON.stringify(quranManifest))} bytes).`);
