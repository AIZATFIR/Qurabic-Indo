import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getQACAuthoritativeIndex, getQACRecordsByRoot, getQACRecordsByWordLocation } from './qac-parser';

test('targeted QAC lookup preserves full parser records for a word and root', () => {
  const wordLocation = '1:1:1';
  const root = 'rHm';
  const targetedWord = getQACRecordsByWordLocation(wordLocation);
  const targetedRoot = getQACRecordsByRoot(root);
  const fullIndex = getQACAuthoritativeIndex();
  const indexedWord = fullIndex.recordsByWordLocation.get(wordLocation) || [];
  const indexedRoot = fullIndex.recordsByRoot.get(root) || [];

  assert.deepEqual(targetedWord, indexedWord);
  assert.deepEqual(targetedRoot, indexedRoot);
  assert.equal(targetedWord.length, 2);
  assert.equal(targetedRoot.length, 339);
});
