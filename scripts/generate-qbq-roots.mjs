import fs from 'fs';
import path from 'path';

const rootsIndexPath = '/home/aizatfir/projects/Qurabic-Indo/lib/data/quran-bil-quran/roots_index.json';
const mufradatPath = '/home/aizatfir/projects/Qurabic-Indo/lib/data/quran-bil-quran/mufradat.json';

const rootsData = JSON.parse(fs.readFileSync(rootsIndexPath, 'utf8'));
const mufradatData = JSON.parse(fs.readFileSync(mufradatPath, 'utf8'));

// Format lookup index by clean Arabic root (e.g. "شعر", "عون", "علم")
const rootSemanticsMap = {};

for (const [rootAr, val] of Object.entries(rootsData)) {
  const cleanAr = rootAr.replace(/\s+/g, '');
  const mufradatEntry = mufradatData[cleanAr];
  
  rootSemanticsMap[cleanAr] = {
    rootArabic: rootAr,
    meaningEn: val.m || '',
    family: val.fam || '',
    frequency: val.f || 0,
    mufradatArabic: mufradatEntry?.t || '',
  };
}

const outputPath = '/home/aizatfir/projects/Qurabic-Indo/lib/data/quran-bil-quran-roots.json';
fs.writeFileSync(outputPath, JSON.stringify(rootSemanticsMap, null, 2), 'utf8');
console.log(`Generated Quran-bil-Quran roots dataset with ${Object.keys(rootSemanticsMap).length} roots at ${outputPath}`);
