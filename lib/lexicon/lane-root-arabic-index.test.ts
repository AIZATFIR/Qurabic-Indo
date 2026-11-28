import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getLaneRootRecord } from './lane-loader';

describe('Lane root lookup through the Arabic index', () => {
  it('returns the matching cited Lane root when the Buckwalter root key is absent', () => {
    const cases = [
      { root: 'rAy', entryId: 'lane_22014', volume: 3, page: 999 },
      { root: 'jhl', entryId: 'lane_47641', volume: 2, page: 477 },
      { root: 'mlA', entryId: 'lane_12912', volume: 7, page: 2729 },
      { root: 'fAy', entryId: 'lane_33073', volume: 6, page: 2326 },
      { root: 'mAy', entryId: 'lane_5599', volume: 8, page: 3016 },
    ];

    for (const expected of cases) {
      const result = getLaneRootRecord(expected.root, true);
      assert.ok(result, `Quran root ${expected.root} should resolve through Lane's Arabic root index`);
      assert.strictEqual(result.rootBw, expected.root, 'The result must preserve the Quran root identifier');
      assert.strictEqual(result.volume, expected.volume);
      assert.strictEqual(result.page, expected.page);
      assert.ok(
        result.entries.some((entry) => entry.entryId === expected.entryId),
        `Expected the source entry ${expected.entryId} for ${expected.root}`,
      );
    }

    const arabicInput = getLaneRootRecord('رأي', true);
    assert.ok(arabicInput, 'Arabic root input should resolve through Lane’s Arabic root index');
    assert.ok(arabicInput.entries.some((entry) => entry.entryId === 'lane_22014'));
  });
});
