import test from 'node:test';
import assert from 'node:assert';
import { getWordStudy } from './word-study-service';
import { getLinguisticExplanation } from './linguistic-explanation-service';
import { getGrammarDerivation } from './grammar-derivation-service';

test('Kalaam Experience Suite: QS. 105:2:2 (يَجْعَلْ)', () => {
  const study = getWordStudy('105:2:2');

  assert.strictEqual(study.identity.arabic, 'يَجْعَلْ');
  assert.ok(study.primaryMeaning.text.includes('membuat') || study.primaryMeaning.text.includes('menjadikan'));
  assert.notStrictEqual(study.primaryMeaning.text, "Kosakata Al-Qur'an");

  // Linguistic explanation assertions
  const ling = study.linguisticExplanation;
  assert.ok(ling, 'Linguistic explanation must exist');
  assert.strictEqual(ling.baseLemmaArabic, 'جَعَلَ');
  assert.ok(ling.narrativeText.includes('Secara linguistik, يَجْعَلْ dan kata-kata terkait berasal dari akar kata ج ع ل'));
  assert.ok(ling.narrativeText.includes('mengubah potensi menjadi kenyataan'));
  assert.ok(ling.quranicThemeText?.includes('Al-Qur\'an'));

  // Grammar flowchart assertions
  const gram = study.grammarDerivation;
  assert.ok(gram, 'Grammar derivation flowchart must exist');
  assert.strictEqual(gram.baseLemma.arabic, 'جَعَلَ');
  assert.ok(gram.baseLemma.meaning.includes('membuat') || gram.baseLemma.meaning.includes('menempatkan'));
  assert.strictEqual(gram.verseForm.arabic, 'يَجْعَلْ');
  assert.ok(gram.verseForm.morphemes.length >= 2, 'Must have at least prefix and stem morphemes');
  assert.ok(gram.verseForm.grammarExplanation.includes('أَلَمْ يَجْعَلْ'));
});

test('Kalaam Experience Suite: QS. 95:6:7 (أَجْرٌ)', () => {
  const study = getWordStudy('95:6:7');

  assert.strictEqual(study.identity.arabic, 'أَجْرٌ');
  assert.ok(study.primaryMeaning.text.includes('Pahala') || study.primaryMeaning.text.includes('Imbalan'));
  assert.notStrictEqual(study.primaryMeaning.text, "Kosakata Al-Qur'an");

  // Linguistic explanation assertions
  const ling = study.linguisticExplanation;
  assert.ok(ling, 'Linguistic explanation must exist');
  assert.strictEqual(ling.baseLemmaArabic, 'أَجَرَ');
  assert.ok(ling.narrativeText.includes('Secara linguistik, أَجْرٌ dan kata-kata terkait berasal dari akar kata ا ج ر'));
  assert.ok(ling.narrativeText.includes('kompensasi'));
  assert.ok(ling.quranicThemeText?.includes('Allah (ﷻ)'));

  // Grammar flowchart assertions
  const gram = study.grammarDerivation;
  assert.ok(gram, 'Grammar derivation flowchart must exist');
  assert.strictEqual(gram.baseLemma.arabic, 'أَجَرَ');
  assert.strictEqual(gram.verseForm.arabic, 'أَجْرٌ');
  assert.ok(gram.verseForm.grammarExplanation.includes('Mubtada\' Mu\'akhkhar'));
});

test('Kalaam Experience Suite: Zero Empty Placeholders across diverse words', () => {
  const testTokens = ['1:1:1', '1:2:1', '1:5:2', '1:5:4', '2:2:2', '2:22:11', '2:77:9', '112:1:3', '114:1:3'];

  for (const token of testTokens) {
    const study = getWordStudy(token);
    assert.ok(study.identity.arabic, `Word Arabic must exist for ${token}`);
    assert.ok(study.primaryMeaning.text, `Primary meaning must exist for ${token}`);
    assert.notStrictEqual(study.primaryMeaning.text, "Kosakata Al-Qur'an", `Must not be generic placeholder for ${token}`);
    
    // Either curated narrative or authentic classical lexicon senses must be present
    const hasLexicalEvidence = (study.linguisticExplanation?.narrativeText) || (study.lexical.senses.length > 0);
    assert.ok(hasLexicalEvidence, `Lexical evidence (curated or Lane) must exist for ${token}`);
    
    assert.ok(study.grammarDerivation?.baseLemma.arabic, `Grammar base lemma must exist for ${token}`);
    assert.ok(study.grammarDerivation?.verseForm.arabic, `Grammar verse form must exist for ${token}`);
  }
});

test('Kalaam Experience Suite: Root Eln (2:77:9) and Root mwh (2:22:11) have authentic scholarship', () => {
  const yuElinun = getWordStudy('2:77:9');
  assert.strictEqual(yuElinun.identity.arabic, 'يُعْلِنُونَ');
  assert.ok(yuElinun.linguisticExplanation?.narrativeText.includes('ع ل ن'));
  assert.ok(yuElinun.linguisticExplanation?.narrativeText.includes('menampakkan'));
  assert.ok(yuElinun.lexical.senses.length > 0, 'Must have Lane Lexicon senses');

  const ma = getWordStudy('2:22:11');
  assert.strictEqual(ma.identity.arabic, 'مَاْءً');
  assert.ok(ma.linguisticExplanation?.narrativeText.includes('م و ه'));
  assert.ok(ma.linguisticExplanation?.narrativeText.includes('kelangsungan hidup'));
  assert.ok(ma.lexical.senses.length > 0, 'Must have Lane Lexicon senses');
});
