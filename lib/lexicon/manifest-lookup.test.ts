import assert from 'node:assert/strict';
import { createLaneManifestLookup } from './manifest-lookup';

let fullManifestLoads = 0;
const lookup = createLaneManifestLookup(
  {
    'root_bw:Sbr': 'chunk_05.json',
    'lemma_bw:unindexed-quran-lemma': null,
  },
  () => {
    fullManifestLoads++;
    return {
      'lemma_bw:outside-quran': 'chunk_12.json',
      'lemma_bw:unindexed-quran-lemma': 'chunk_03.json',
    };
  },
);

assert.equal(lookup('root_bw:Sbr'), 'chunk_05.json');
assert.equal(fullManifestLoads, 0, 'Quran roots must resolve without loading the full Lane manifest');
assert.equal(lookup('lemma_bw:unindexed-quran-lemma'), 'chunk_03.json');
assert.equal(lookup('lemma_bw:outside-quran'), 'chunk_12.json');
assert.equal(lookup('another-missing-key'), undefined);
assert.equal(fullManifestLoads, 1, 'non-Quran lookups should load the full manifest once and reuse it');

let quranOnlyManifestLoads = 0;
const quranOnlyLookup = createLaneManifestLookup(
  { 'lemma_bw:unindexed-quran-lemma': null },
  () => {
    quranOnlyManifestLoads++;
    return { 'lemma_bw:unindexed-quran-lemma': 'chunk_03.json' };
  },
);
assert.equal(quranOnlyLookup('lemma_bw:unindexed-quran-lemma', true), undefined);
assert.equal(quranOnlyManifestLoads, 0, 'Quran-only requests should skip confirmed misses without loading the full manifest');

console.log('Passed: Quran lookups stay on the compact manifest and general Arabic lookups fall back once.');
