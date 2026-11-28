import assert from 'node:assert/strict';
import { getWordStudy } from './word-study-service';

const qacTokenIndexPath = require.resolve('./data/qac-tokens.json');
assert.equal(require.cache[qacTokenIndexPath], undefined, 'word-study imports do not eagerly parse the QAC token index');
const coordinateStudy = getWordStudy('2:153:3');
assert.equal(coordinateStudy.primaryMeaning.text, 'Makna kata belum tersedia');
assert.equal(coordinateStudy.primaryMeaning.sourceId, undefined, 'A static word study must not claim a Quran.com lookup that has not run');
assert.equal(require.cache[qacTokenIndexPath], undefined, 'coordinate word studies use the parsed QAC record without eagerly parsing the full token index');

const noun = getWordStudy('9:1:1');
assert.equal(noun.primaryMeaning.text, 'Makna kata belum tersedia');
assert.equal(noun.primaryMeaning.sourceId, undefined);
assert.equal(noun.primaryMeaning.sourceBadge, 'Sumber belum tersedia');
assert.equal(Object.hasOwn(noun.lexical, 'rootExcerpt'), false, 'Root excerpts are fetched by the dedicated source endpoint, not duplicated in every word-study payload');
const unknown = getWordStudy('xzx');
assert.equal(unknown.primaryMeaning.sourceId, undefined, 'Unknown tokens must not be attributed to Quran.com');
assert.equal(unknown.primaryMeaning.sourceBadge, 'Sumber belum tersedia');
assert.equal(unknown.primaryMeaning.sourceIdEnglish, undefined);
assert.equal(noun.linguisticExplanation, undefined, 'Unreviewed narratives must not masquerade as scholarship');
assert.equal(noun.grammarDerivation, undefined, 'Generic generated derivation is not corpus evidence');
for (const [location, expected] of [['18:3:2', 'di dalamnya'], ['78:4:1', 'sekali-kali tidak']] as const) {
  const particle = getWordStudy(location);
  assert.equal(particle.primaryMeaning.sourceId, 'qurabic-editorial-particle-gloss');
  assert.ok(particle.lexical.particleMeaning?.id, `${location}: known particles have a short function note`);
  assert.ok(particle.primaryMeaning.text.toLowerCase().includes(expected.split(' ')[0]), `${location}: ${particle.primaryMeaning.text}`);
}
const contextual = getWordStudy('9:1:1', { meaningIndo: 'untrusted caller text' });
assert.equal(contextual.primaryMeaning.text, 'Makna kata belum tersedia', 'Caller-supplied meanings are not lexical evidence');
console.log('Word study provenance, source separation, and particle notes passed');

for (const [token, english] of [['وَ', 'and'], ['فِي', 'in'], ['كَلَّا', 'Nay!']] as const) {
  const study = getWordStudy(token);
  assert.equal(study.primaryMeaning.textEnglish, english);
  assert.equal(study.lexical.rootArabic, undefined);
}

assert.equal(noun.primaryMeaning.textEnglish, undefined, 'English glosses are fetched by the active UI, not read from bundled exports');
for (const family of noun.wordFamily) {
  assert.equal(family.meaningIndo, undefined);
  assert.equal(family.meaningEnglish, undefined);
}
assert.notEqual(getWordStudy('كُلًّا').primaryMeaning.textEnglish, 'Nay!', 'All/each homograph must not become the aversion particle');
