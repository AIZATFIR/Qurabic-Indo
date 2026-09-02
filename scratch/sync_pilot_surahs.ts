import fs from 'fs';
import path from 'path';
import { PILOT_XWF_AUTHORITATIVE_DATA } from '../lib/morphology/pilot-data';
import { SURAH_LIST } from '../lib/data/surah-list';

const updated = { ...PILOT_XWF_AUTHORITATIVE_DATA };

updated.occurrences.forEach((occ) => {
  const meta = SURAH_LIST[occ.surahNumber - 1];
  if (meta) {
    occ.surahNameIndo = meta.nameIndo;
    occ.surahNameArabic = meta.nameArabic;
  }
});

const fileContent = `import { AuthoritativeRootMorphology } from './types';

export const PILOT_XWF_AUTHORITATIVE_DATA: AuthoritativeRootMorphology = ${JSON.stringify(updated, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'lib/morphology/pilot-data.ts'), fileContent, 'utf8');
console.log('✅ Synchronized pilot-data.ts with official Indonesian SURAH_LIST!');
