import { ROOT_DATABASE } from '../lib/data/roots';

console.log('🔍 RUNNING COMPREHENSIVE DATABASE AUDIT ON ROOT_DATABASE...\n');

let totalRoots = ROOT_DATABASE.length;
let totalOccurrences = 0;
let placeholderOccurrences = 0;
let invalidOccurrences = 0;
let genericVerbMeanings = 0;
let genericNounMeanings = 0;

const placeholderRoots: string[] = [];
const genericMeaningRoots: string[] = [];

for (const root of ROOT_DATABASE) {
  totalOccurrences += root.occurrences.length;

  // 1. Check placeholder occurrences (2:255 for non-hayy roots)
  const hasPlaceholder = root.occurrences.some(
    (occ) => occ.surahNumber === 2 && occ.ayahNumber === 255 && root.id !== 'h-y-y'
  );
  if (hasPlaceholder) {
    placeholderOccurrences += root.occurrences.filter(
      (occ) => occ.surahNumber === 2 && occ.ayahNumber === 255 && root.id !== 'h-y-y'
    ).length;
    placeholderRoots.push(`${root.id} (${root.rootArabic})`);
  }

  // 2. Check invalid occurrences
  for (const occ of root.occurrences) {
    if (!occ.surahNumber || occ.surahNumber < 1 || occ.surahNumber > 114) invalidOccurrences++;
    if (!occ.ayahNumber || occ.ayahNumber < 1) invalidOccurrences++;
    if (!occ.verseArabic || occ.verseArabic.trim().length === 0) invalidOccurrences++;
    if (!occ.verseIndo || occ.verseIndo.trim().length === 0) invalidOccurrences++;
  }

  // 3. Check generic verb meanings
  let hasGeneric = false;
  for (const v of root.verbs) {
    if (v.meaningIndo && v.meaningIndo.startsWith('Bentuk kata kerja')) {
      genericVerbMeanings++;
      hasGeneric = true;
    }
  }

  // 4. Check generic noun meanings
  for (const n of root.nouns) {
    if (n.meaningIndo && n.meaningIndo.startsWith('Bentuk kata benda')) {
      genericNounMeanings++;
      hasGeneric = true;
    }
  }

  if (hasGeneric) {
    genericMeaningRoots.push(`${root.id} (${root.rootArabic})`);
  }
}

console.log('====================================================');
console.log('📊 AUDIT SUMMARY REPORT');
console.log('====================================================');
console.log(`1. Total Roots Checked              : ${totalRoots}`);
console.log(`2. Total Occurrences Found          : ${totalOccurrences}`);
console.log(`3. Placeholder 2:255 Occurrences    : ${placeholderOccurrences} (across ${placeholderRoots.length} roots)`);
console.log(`4. Invalid / Malformed Occurrences  : ${invalidOccurrences}`);
console.log(`5. Generic Verb Meanings Found      : ${genericVerbMeanings}`);
console.log(`6. Generic Noun Meanings Found      : ${genericNounMeanings}`);
console.log(`   Total Generic Morphology Entries : ${genericVerbMeanings + genericNounMeanings} (across ${genericMeaningRoots.length} roots)`);
console.log('====================================================\n');
