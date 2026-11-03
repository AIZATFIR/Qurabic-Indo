import assert from 'node:assert/strict';
import wbwEnglish from '../data/wbw-english-glosses.json';
import wbwIndonesian from '../data/wbw-indonesian-glosses.json';
import { getWordStudy } from './word-study-service';

const noun = getWordStudy('9:1:1');
assert.equal(noun.primaryMeaning.text.toLowerCase(), 'pemutusan perhubungan');
assert.equal(noun.primaryMeaning.sourceId, 'quran-com-wbw');
assert.equal(noun.primaryMeaning.sourceBadge, 'Quran.com · Indonesia');
assert.equal(noun.linguisticExplanation, undefined, 'Unreviewed narratives must not masquerade as scholarship');
assert.equal(noun.grammarDerivation, undefined, 'Generic generated derivation is not corpus evidence');
for (const [location, expected] of [['18:3:2', 'di dalamnya'], ['78:4:1', 'sekali-kali tidak']] as const) {
  const particle = getWordStudy(location);
  assert.ok(particle.primaryMeaning.text.toLowerCase().replace(/\s+/g, '').includes(expected.replace(/\s+/g, '')), `${location}: ${particle.primaryMeaning.text}`);
  assert.equal(particle.primaryMeaning.sourceId, 'quran-com-wbw');
}
const contextual = getWordStudy('9:1:1', { meaningIndo: 'untrusted caller text' });
assert.equal(contextual.primaryMeaning.text.toLowerCase(), 'pemutusan perhubungan', 'Bundled translation outranks caller text');
console.log('Word study provenance and particle meanings passed');

for (const [token, english] of [['وَ', 'and'], ['فِي', 'in'], ['كَلَّا', 'Nay!']] as const) {
  const study = getWordStudy(token);
  assert.equal(study.primaryMeaning.textEnglish, english);
  assert.equal(study.lexical.rootArabic, undefined);
}

assert.equal(noun.primaryMeaning.textEnglish, (wbwEnglish.meanings as Record<string, string>)['9:1:1']);
for (const family of noun.wordFamily) {
  const coordinate = family.sampleCoordinate!.split(':').slice(0, 3).join(':');
  assert.equal(family.meaningIndo, (wbwIndonesian.meanings as Record<string, string>)[coordinate]);
  assert.equal(family.meaningEnglish, (wbwEnglish.meanings as Record<string, string>)[coordinate]);
}
assert.notEqual(getWordStudy('كُلًّا').primaryMeaning.textEnglish, 'Nay!', 'All/each homograph must not become the aversion particle');
