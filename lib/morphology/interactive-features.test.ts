import assert from 'node:assert';

console.log('🧪 Running Interactive Features, Sharaf Paradigms & Balaghah Suite...');

// 1. Test Root Semantics & Curated Data
import { CURATED_ROOT_SEMANTICS } from '../data/root-semantics';

const requiredRoots = ['q-w-l', 's-m-w', 'E-f-w', 'S-b-r', 'x-w-f'];
for (const r of requiredRoots) {
  assert.ok(CURATED_ROOT_SEMANTICS[r], `Root ${r} must exist in CURATED_ROOT_SEMANTICS`);
  assert.ok(CURATED_ROOT_SEMANTICS[r].coreMeaning.length > 30, `Root ${r} must have substantive core meaning`);
}
console.log('✅ Test 1 Passed: Curated root semantics database verified.');

// 2. Test Word Study Service & Authentic Meanings
import { getWordStudy } from './word-study-service';

const sampleWordStudy = getWordStudy('صَبَرَ', {
  surahNumber: 2,
  ayahNumber: 153,
  wordIndex: 3,
  meaningIndo: 'Dan bersabarlah'
});

assert.ok(sampleWordStudy.identity.arabic === 'صَبَرَ', 'Word study identity must match target Arabic');
assert.ok(sampleWordStudy.primaryMeaning.text.length > 0, 'Word study must have non-empty primary meaning');
assert.ok(sampleWordStudy.grammarDerivation, 'Word study must construct grammar derivation');
console.log('✅ Test 2 Passed: Word study model generation verified.');

// 3. Test Centralized Sharaf Paradigms Engine
import { CLASSICAL_PARADIGMS, generateGenericParadigm, getSharafParadigms } from './sharaf-paradigms';

const sbrParadigms = getSharafParadigms('s-b-r', 'صبر');
assert.ok(sbrParadigms.length >= 3, 'Root s-b-r must have at least 3 paradigms');
assert.strictEqual(sbrParadigms[0].formId, 'Form I', 'First paradigm for s-b-r must be Form I');
assert.ok(sbrParadigms[0].madhi.arabic === 'صَبَرَ', 'Madhi for s-b-r Form I must be صَبَرَ');

const genericParadigms = generateGenericParadigm('كتب', 'k-t-b');
assert.ok(genericParadigms.length >= 3, 'Generic paradigm generator must return at least 3 forms');
console.log('✅ Test 3 Passed: Sharaf paradigms engine verified.');

// 4. Test Centralized Balaghah Database
import { BALAGHAH_COMPARISONS, getBalaghahComparison } from './balaghah-database';

const xwfComparison = getBalaghahComparison('x-w-f');
assert.ok(xwfComparison, 'Root x-w-f must have Balaghah comparison');
assert.ok(xwfComparison.topicTitle.includes('Khawf'), 'Topic title must contain Khawf');
assert.ok(xwfComparison.balaghahInsight.length > 30, 'Balaghah insight must be non-empty');
console.log('✅ Test 4 Passed: Balaghah comparisons database verified.');

// 5. Test Quiz Bank & Flashcards Invariants
import { QUIZ_BANK, FLASHCARD_BANK } from '../data/latihan-bank';

assert.ok(QUIZ_BANK.length >= 6, 'Quiz bank must contain at least 6 questions');
for (const q of QUIZ_BANK) {
  assert.ok(q.id, 'Question must have id');
  assert.ok(q.options.length >= 4, `Question ${q.id} must have at least 4 options`);
  assert.ok(q.correctAnswerIndex >= 0 && q.correctAnswerIndex < q.options.length, `Question ${q.id} must have valid correctAnswerIndex`);
  assert.ok(q.explanation.length > 20, `Question ${q.id} must have clear explanation`);
}

assert.ok(FLASHCARD_BANK.length >= 4, 'Flashcard bank must contain at least 4 cards');
for (const fc of FLASHCARD_BANK) {
  assert.ok(fc.arabicWord, 'Flashcard must contain arabicWord');
  assert.ok(fc.wazanForm, 'Flashcard must contain wazanForm');
  assert.ok(fc.meaningIndo, 'Flashcard must contain meaningIndo');
}
console.log('✅ Test 5 Passed: Quiz bank and Flashcards model invariants satisfied.');

console.log('🎉 ALL INTERACTIVE LEARNING & SHARAF PARADIGM TESTS PASSED SUCCESSFULLY!');
