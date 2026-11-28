import assert from 'node:assert/strict';
import { getMaqamWordGlosses } from './maqam';
import { formatMaqamGloss } from './maqam-gloss-format';

async function run() {
  const result = await getMaqamWordGlosses(['1:1:4', '2:2:3', '18:3:2', '114:6:3']);
  assert.equal(Object.keys(result).length, 4, 'every valid coordinate should have a gloss');
  assert.equal(result['2:2:3']?.gloss, 'no;not;non-');
  assert.equal(result['2:2:3']?.pos, 'part_neg');
  assert.equal(result['18:3:2']?.gloss, 'in');
  assert.equal(result['18:3:2']?.pos, 'prep');
  assert.equal(result['1:1:4']?.root, 'ر.ح.م');
  assert.equal(formatMaqamGloss('Rahman;Rahman_(i.e._God_one_of_the_99_Beautiful_Names)'), 'Rahman · Rahman (i.e. God one of the 99 Beautiful Names)');
  const deduplicated = await getMaqamWordGlosses(['1:1:4', '1:1:4', '0:1:1', 'bad']);
  assert.deepEqual(Object.keys(deduplicated), ['1:1:4']);
}

run().then(() => console.log('MAQAM lexical gloss checks passed')).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
