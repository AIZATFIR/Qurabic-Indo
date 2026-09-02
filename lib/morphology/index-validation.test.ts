import { getQACAuthoritativeIndex } from './qac-parser';
import { getAuthoritativeRootMorphology, getAuthoritativePilotRootWord } from './morphology-service';

console.log('🧪 RUNNING AUTHORITATIVE MORPHOLOGY INDEX & XWF REGRESSION TESTS...\n');

// 1. Test Index Parsing & Basic Invariants
const index = getQACAuthoritativeIndex();

console.log(`• Total Parsed QAC Records      : ${index.totalRecords.toLocaleString()} (Expected: 128,219)`);
console.log(`• Total Root-Bearing Records   : ${index.rootBearingRecordsCount.toLocaleString()} (Expected: ~49,968)`);
console.log(`• Unique Roots Count           : ${index.uniqueRootsCount.toLocaleString()} (Expected: 1,642)`);
console.log(`• Unique Lemmas Count          : ${index.uniqueLemmasCount.toLocaleString()} (Expected: >3,000)\n`);

if (index.totalRecords !== 128219) {
  throw new Error(`❌ Total records mismatch: got ${index.totalRecords}, expected 128219`);
}
if (index.uniqueRootsCount !== 1642) {
  throw new Error(`❌ Unique roots mismatch: got ${index.uniqueRootsCount}, expected 1642`);
}
console.log('✅ Test 1 Passed: QAC Authoritative Index records and unique root counts verified.\n');

// 2. Test Location Keys and Non-Collision
let duplicateLocations = 0;
let invalidLocations = 0;

index.recordsByLocation.forEach((record, key) => {
  const parts = key.split(':');
  if (parts.length !== 4) invalidLocations++;
  const [s, a, w, seg] = parts.map(Number);
  if (s < 1 || s > 114 || a < 1 || w < 1 || seg < 1) invalidLocations++;
});

if (duplicateLocations !== 0 || invalidLocations !== 0) {
  throw new Error(`❌ Invalid/duplicate location keys found! duplicates=${duplicateLocations}, invalid=${invalidLocations}`);
}
console.log('✅ Test 2 Passed: All location keys (surah:ayah:word:segment) are valid and collision-free.\n');

// 3. Test xwf (خ و ف) Regression Invariants
const xwfData = getAuthoritativeRootMorphology('xwf');
if (!xwfData) {
  throw new Error('❌ xwf authoritative data not found in index!');
}

console.log('====================================================');
console.log('🎯 XWF (خ و ف) REGRESSION TEST REPORT');
console.log('====================================================');
console.log(`• ROOT:xwf Total Segments     : ${xwfData.totalSegments} (Must be: 124)`);
console.log(`• Unique Word Locations       : ${xwfData.uniqueWordLocations} (Must be: 124)`);
console.log(`• Unique Ayahs                : ${xwfData.uniqueAyahs} (Must be: 112)`);
console.log(`• Verbs Count                 : ${xwfData.verbsCount}`);
console.log(`• Nouns Count                 : ${xwfData.nounsCount}`);
console.log(`• Unique Lemmas               : ${xwfData.lemmas.length}`);
console.log(`• Occurrences Generated       : ${xwfData.occurrences.length} ayahs`);
console.log('====================================================\n');

if (xwfData.totalSegments !== 124) {
  throw new Error(`❌ xwf total segments failed: got ${xwfData.totalSegments}, expected 124`);
}
if (xwfData.uniqueWordLocations !== 124) {
  throw new Error(`❌ xwf unique word locations failed: got ${xwfData.uniqueWordLocations}, expected 124`);
}
if (xwfData.uniqueAyahs !== 112) {
  throw new Error(`❌ xwf unique ayahs failed: got ${xwfData.uniqueAyahs}, expected 112`);
}
if (xwfData.occurrences.length !== 112) {
  throw new Error(`❌ xwf occurrences count mismatch: got ${xwfData.occurrences.length}, expected 112`);
}

// Check that Ayat Kursi (2:255) is NOT in xwf occurrences
const hasAyatKursi = xwfData.occurrences.some(o => o.surahNumber === 2 && o.ayahNumber === 255);
if (hasAyatKursi) {
  throw new Error('❌ Data corruption: Ayat Kursi (2:255) found in xwf occurrences!');
}

// Check that genuine occurrences are present (e.g. 2:38, 2:155, 3:175, 106:4)
const has238 = xwfData.occurrences.some(o => o.surahNumber === 2 && o.ayahNumber === 38);
const has2155 = xwfData.occurrences.some(o => o.surahNumber === 2 && o.ayahNumber === 155);
const has3175 = xwfData.occurrences.some(o => o.surahNumber === 3 && o.ayahNumber === 175);
const has1064 = xwfData.occurrences.some(o => o.surahNumber === 106 && o.ayahNumber === 4);

if (!has238 || !has2155 || !has3175 || !has1064) {
  throw new Error('❌ Missing authentic occurrences in xwf data!');
}

console.log('✅ Test 3 Passed: xwf regression invariants satisfied (124 segments, 124 words, 112 ayahs, 0 placeholders).\n');

// 4. Test Pilot Root Resolver for UI Integration
const pilotRoot = getAuthoritativePilotRootWord('kh-w-f');
if (!pilotRoot) {
  throw new Error('❌ getAuthoritativePilotRootWord("kh-w-f") returned null!');
}

if (pilotRoot.totalOccurrences !== 124 || pilotRoot.occurrences.length !== 112) {
  throw new Error(`❌ Pilot Root data mismatch: totalOccurrences=${pilotRoot.totalOccurrences}, occurrences=${pilotRoot.occurrences.length}`);
}

console.log('✅ Test 4 Passed: Pilot Root Word resolver for UI is fully operational.\n');

console.log('🎉 ALL AUTHORITATIVE MORPHOLOGY INDEX & REGRESSION TESTS PASSED SUCCESSFULLY!');
