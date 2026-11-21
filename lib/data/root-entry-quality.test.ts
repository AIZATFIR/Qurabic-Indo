import assert from 'node:assert/strict';
import { getCanonicalRootDetail } from '../morphology/canonical-service';
import { getQbqRootEntry, getRootSemanticProfile } from './root-semantics';
import { ROOT_DATABASE } from './roots';

// These roots had only a generated occurrence-count sentence in the root data.
// They must not present that sentence as a lexical definition.
const rootsWithoutIndexedDefinition = ['r-A-y', 'm-r-A', 'm-l-A', 'f-A-y', 'm-A-y'];

for (const rootId of rootsWithoutIndexedDefinition) {
  const root = getCanonicalRootDetail(rootId);
  assert.ok(root, `Root ${rootId} should resolve from the Quranic corpus`);
  assert.equal(root.coreMeaning, '', `Root ${rootId} must not show a generated filler as its definition`);
  assert.deepEqual(root.meaningsIndonesian, [], `Root ${rootId} must not treat corpus forms as definitions`);
}

const malikProfile = getRootSemanticProfile('m-l-k', 'م ل ك');
assert.ok(malikProfile?.coreMeaningEnglish, 'Root م ل ك should retain its source English gloss');
assert.equal(malikProfile.coreMeaning, '', 'An English source gloss must not be placed in the Indonesian field');
assert.ok(malikProfile.classicalArabicExcerpt, 'The classical Arabic excerpt should remain available separately');
const malikRoot = getCanonicalRootDetail('m-l-k');
assert.ok(malikRoot?.coreMeaningEnglish, 'The root page should receive the English gloss');
assert.equal(malikRoot.coreMeaning, '', 'An uncited generated Indonesian summary must not appear as a sourced definition');
assert.notEqual(malikRoot.coreMeaning, malikRoot.coreMeaningEnglish, 'The root page must keep Indonesian and English summaries separate');

const samwRoot = getCanonicalRootDetail('s-m-w');
assert.ok(samwRoot?.coreMeaningEnglish, 'The source gloss should take precedence over an uncited curated summary');
assert.equal(samwRoot.coreMeaning, '', 'An uncited curated summary must not appear as a sourced definition');

const nadwProfile = getRootSemanticProfile('n-d-w', 'ن د و');
assert.ok(nadwProfile?.coreMeaningEnglish?.includes('call'), 'Root ن د و should use Quranic Arabic Corpus form glosses');
assert.ok(nadwProfile?.coreMeaning.includes('Memanggil'), 'Root ن د و should have a clear Indonesian translation of the corpus gloss');
assert.equal(nadwProfile?.meaningSource?.url, 'https://corpus.quran.com/qurandictionary.jsp?q=ndw');
assert.match(nadwProfile?.contextualNote || '', /Lane.*ندى|Lane.*ndy/i, 'The different root spelling in Lane should be disclosed');

const luLuProfile = getRootSemanticProfile('l-A-l-A', 'ل ا ل ا');
assert.ok(luLuProfile?.coreMeaningEnglish?.includes('pearls'), 'Root ل أ ل أ should use the corpus noun gloss');
assert.ok(luLuProfile?.coreMeaning.includes('mutiara'), 'Root ل أ ل أ should have a clear Indonesian translation of the corpus gloss');
assert.equal(luLuProfile?.meaningSource?.url, 'https://corpus.quran.com/qurandictionary.jsp?q=lAlA');
assert.match(luLuProfile?.contextualNote || '', /Lane.*لأ|Lane.*lA/i, 'The Lane headword indexing should be disclosed');

assert.equal(getQbqRootEntry('ا ل ه')?.meaningEn.startsWith('Allah ('), true, 'Alif in the corpus root should match the hamza-on-alif spelling in the sourced QBQ gloss');

let checkedEnglishGlosses = 0;
for (const root of ROOT_DATABASE) {
  const profile = getRootSemanticProfile(root.id, root.rootArabic);
  if (!profile?.coreMeaningEnglish) continue;
  checkedEnglishGlosses++;
  assert.notEqual(profile.coreMeaning, profile.coreMeaningEnglish, `Root ${root.id} must not place its English gloss in the Indonesian field`);
  assert.ok(!profile.meaningsIndonesian.includes(profile.coreMeaningEnglish), `Root ${root.id} must not label its English gloss as Indonesian`);
}
assert.ok(checkedEnglishGlosses > 1000, `Expected broad source coverage; checked ${checkedEnglishGlosses} English glosses`);

console.log(`Passed: ${rootsWithoutIndexedDefinition.length} unindexed roots have no filler; ${checkedEnglishGlosses} English glosses stay out of Indonesian fields.`);
