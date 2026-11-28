import { readFile } from 'node:fs/promises';

const indexUrl = 'https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/';
const source = await readFile(new URL('../../lib/data/surah-list.ts', import.meta.url), 'utf8');
const chapters = [...source.matchAll(/\{ number: (\d+),[^\n]*?ayahsCount: (\d+),/g)]
  .map(([, surah, count]) => [Number(surah), Number(count)]);

if (chapters.length !== 114) {
  throw new Error(`Expected 114 Quran chapters, found ${chapters.length}.`);
}

const response = await fetch(indexUrl, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error(`EveryAyah index returned HTTP ${response.status}.`);
const html = await response.text();
const listedFiles = new Set([...html.matchAll(/\/([0-9]{6})\.mp3/gi)].map(([, file]) => file));
const expectedFiles = new Set();
for (const [surah, ayahCount] of chapters) {
  for (let ayah = 1; ayah <= ayahCount; ayah += 1) {
    expectedFiles.add(`${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}`);
  }
}

const missing = [...expectedFiles].filter((file) => !listedFiles.has(file)).sort();
const listedAyahFiles = [...listedFiles].filter((file) => expectedFiles.has(file)).length;
console.log(`EveryAyah English Ibrahim Walk index: ${listedAyahFiles}/${expectedFiles.size} verse files listed.`);
console.log(`Unmatched six-digit files: ${listedFiles.size - listedAyahFiles} (includes 114 surah intro files).`);
if (missing.length) {
  console.error(`Missing ${missing.length}: ${missing.slice(0, 20).join(', ')}`);
  process.exitCode = 1;
}
