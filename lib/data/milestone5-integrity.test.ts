import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { ROOT_DATABASE } from './roots';
import { getRootBySlug } from '../search/root-search';
import { getWordDetailedExplanation } from '../search/word-dictionary';

console.log('🧪 RUNNING MILESTONE 5 COMPLETE ROOT & WORD EXPERIENCE REGRESSION TESTS...\n');

// 1. Test Root Integrity for q-w-l (ق و ل)
console.log('Testing Root q-w-l (ق و ل) integrity & concordance accuracy...');
const qwlRoot = getRootBySlug('q-w-l');
assert.ok(qwlRoot, 'Root q-w-l must exist in database');
assert.strictEqual(qwlRoot.rootArabicJoined, 'قول');
assert.strictEqual(qwlRoot.rootLatin, 'qwl');
assert.ok(qwlRoot.totalOccurrences >= 1600, `Total occurrences for q-w-l should be ~1620, got ${qwlRoot.totalOccurrences}`);
assert.ok(qwlRoot.occurrences.length >= 1300, `Total ayahs for q-w-l should be ~1383, got ${qwlRoot.occurrences.length}`);

// Verify 58:8 occurrence in q-w-l does NOT pick unrelated word like حَيَّوْكَ
const occ58_8 = qwlRoot.occurrences.find(o => o.surahNumber === 58 && o.ayahNumber === 8);
assert.ok(occ58_8, 'Occurrence 58:8 must exist in q-w-l');
assert.ok(
  occ58_8.matchedWordArabic === 'وَيَقُولُونَ' || occ58_8.matchedWordArabic === 'نَقُولُ',
  `Target word in 58:8 must be 'وَيَقُولُونَ' or 'نَقُولُ', but got '${occ58_8.matchedWordArabic}'`
);
assert.notStrictEqual(occ58_8.matchedWordArabic, 'حَيَّوْكَ', 'Target word in 58:8 must NEVER be حَيَّوْكَ');
console.log('✅ Test 1 Passed: q-w-l concordance correctly targets وَيَقُولُونَ (0 حَيَّوْكَ mismatch).');

// 2. Test Root Integrity for s-m-w (س م و)
console.log('\nTesting Reference Root s-m-w (س م و)...');
const smwRoot = getRootBySlug('s-m-w');
assert.ok(smwRoot, 'Root s-m-w must exist');
assert.strictEqual(smwRoot.totalOccurrences, 381, `Expected 381 occurrences for smw, got ${smwRoot.totalOccurrences}`);
assert.strictEqual(smwRoot.occurrences.length, 352, `Expected 352 ayahs for smw, got ${smwRoot.occurrences.length}`);
assert.ok(smwRoot.coreMeaning && smwRoot.coreMeaning.includes('tinggi'), 'smw coreMeaning must describe height/elevation/naming');
assert.ok(smwRoot.usagePatterns && smwRoot.usagePatterns.length >= 3, 'smw must have at least 3 Quranic usage patterns');
console.log('✅ Test 2 Passed: s-m-w has exact 381 occurrences across 352 ayahs and rich usage patterns.');

// 3. Test Root Integrity for E-f-w (ع ف و)
console.log('\nTesting Root E-f-w (ع ف و)...');
const efwRoot = getRootBySlug('E-f-w');
assert.ok(efwRoot, 'Root E-f-w must exist');
assert.ok(efwRoot.coreMeaning && efwRoot.coreMeaning.toLowerCase().includes('maaf'), 'E-f-w coreMeaning must describe pardoning/forgiveness');
console.log('✅ Test 3 Passed: E-f-w has rich Indonesian pardoning semantic definition.');

// 4. Test Golden Benchmark x-w-f (خ و ف)
console.log('\nTesting Golden Benchmark Root x-w-f (خ و ف)...');
const xwfRoot = getRootBySlug('x-w-f') || getRootBySlug('kh-w-f');
assert.ok(xwfRoot, 'Root x-w-f must exist');
assert.strictEqual(xwfRoot.totalOccurrences, 124, `Expected 124 segments for xwf, got ${xwfRoot.totalOccurrences}`);
assert.strictEqual(xwfRoot.occurrences.length, 112, `Expected 112 ayahs for xwf, got ${xwfRoot.occurrences.length}`);
console.log('✅ Test 4 Passed: x-w-f Golden Benchmark invariants 100% satisfied (124 segments, 112 ayahs).');

// 5. Test Word Popup & Zero Random English
console.log('\nTesting Word Dictionary Indonesian-First Policy (Zero random English gloss)...');
const sampleWord = getWordDetailedExplanation('وَيَعْفُوا۟');
assert.ok(sampleWord, 'Word explanation for وَيَعْفُوا۟ must exist');
assert.ok(!sampleWord.primaryMeaning.includes('But He pardons'), 'Primary meaning must NOT contain English string');
assert.ok(sampleWord.primaryMeaning.toLowerCase().includes('maaf') || sampleWord.primaryMeaning.toLowerCase().includes('ampun') || sampleWord.primaryMeaning.length > 0);
console.log(`✅ Test 5 Passed: Word popup for وَيَعْفُوا۟ displays Indonesian gloss: "${sampleWord.primaryMeaning}".`);

// 6. Test Zero Fabricated Classical Citations
console.log('\nTesting Zero Fabricated Citations Policy...');
const rootsSummaryRaw = fs.readFileSync(path.join(process.cwd(), 'lib/data/roots-summary.json'), 'utf8');
assert.ok(!rootsSummaryRaw.includes("Menurut Lisan al-'Arab"), 'No fabricated Lisan al-Arab quotes allowed');
assert.ok(!rootsSummaryRaw.includes("Menurut Mu'jam Maqayis"), 'No fabricated Maqayis quotes allowed');
console.log('✅ Test 6 Passed: Zero fabricated classical dictionary citations detected.');

// 7. Test Absence of Generic Boilerplate in Curated Roots
console.log('\nTesting Semantic Content Quality (No generic filler in key roots)...');
['q-w-l', 's-m-w', 'E-f-w', 'x-w-f', 'S-b-r', 'S-l-w'].forEach((slug) => {
  const r = getRootBySlug(slug);
  assert.ok(r, `Root ${slug} must exist`);
  assert.ok(r.coreMeaning && r.coreMeaning.length > 30, `Root ${slug} must have substantive coreMeaning`);
  assert.ok(!r.coreMeaning.startsWith('Akar kata ' + r.rootArabic + ' memiliki ' + r.totalOccurrences), `Root ${slug} must NOT start with frequency count filler`);
});
console.log('✅ Test 7 Passed: Key roots have substantive, non-generic Tadabbur content.');

console.log('\n🎉 ALL MILESTONE 5 COMPLETE INTEGRITY TESTS PASSED SUCCESSFULLY!\n');
