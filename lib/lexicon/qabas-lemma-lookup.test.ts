import assert from 'node:assert/strict';
import { getQabasLemmaId } from './qabas-lemma-lookup';

const index = {
  '1:1': ['202000942', '202000992', '2023229541', '2023229542'],
};

assert.equal(getQabasLemmaId('1:1:1', index), '202000942');
assert.equal(getQabasLemmaId('1:1:4', index), '2023229542');
assert.equal(getQabasLemmaId('1:1:5', index), undefined);
assert.equal(getQabasLemmaId('invalid', index), undefined);
assert.equal(getQabasLemmaId(undefined, index), undefined);
assert.equal(getQabasLemmaId('1:1:4'), '202003981');
assert.equal(getQabasLemmaId('2:55:8'), '202001196');

console.log('Passed: Qabas lemma lookup uses Quran word coordinates and safely handles missing coordinates.');
