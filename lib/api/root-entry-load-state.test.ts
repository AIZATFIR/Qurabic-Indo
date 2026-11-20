import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getRootEntryLoadState } from './root-entry-load-state';

test('keeps available root data ready while verse occurrences load', () => {
  assert.deepEqual(getRootEntryLoadState(93, true, 0), {
    rootData: false,
    occurrences: true,
  });
});

test('loads root data and occurrences when both are missing', () => {
  assert.deepEqual(getRootEntryLoadState(0, false, 0), {
    rootData: true,
    occurrences: true,
  });
});
