import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Source files are produced by sync_all_wbw.py from Quran.com API v4 language=id.
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const directory = path.join(projectRoot, 'lib/data/wbw');
const meanings = {};
for (const file of readdirSync(directory).filter(file => /^surah_\d{3}\.json$/.test(file)).sort()) {
  for (const words of Object.values(JSON.parse(readFileSync(path.join(directory, file), 'utf8')))) {
    for (const word of words) {
      const text = word.meaningIndo?.trim();
      if (text && /^\d+:\d+:\d+$/.test(word.location)) meanings[word.location] = text;
    }
  }
}
writeFileSync(path.join(projectRoot, 'lib/data/wbw-indonesian-glosses.json'), JSON.stringify({
  source: 'Quran.com API v4 word-by-word translation (Indonesian)', meanings,
}));
console.log(`Indexed ${Object.keys(meanings).length} Indonesian word glosses`);
