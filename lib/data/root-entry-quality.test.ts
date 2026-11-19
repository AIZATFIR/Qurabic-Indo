import assert from 'node:assert/strict';
import { getCanonicalRootDetail } from '../morphology/canonical-service';
import { getQbqRootEntry, getRootSemanticProfile } from './root-semantics';
import { ROOT_DATABASE } from './roots';

// These roots had only a generated occurrence-count sentence in the root data.
// They must not present that sentence as a lexical definition.
const rootsWithoutIndexedDefinition = ['r-A-y', 'm-r-A', 'n-d-w', 'm-l-A', 'f-A-y', 'm-A-y', 'l-A-l-A'];

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
assert.ok(malikRoot.coreMeaning, 'The root page should retain an available Indonesian summary');
assert.notEqual(malikRoot.coreMeaning, malikRoot.coreMeaningEnglish, 'The root page must keep Indonesian and English summaries separate');

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
