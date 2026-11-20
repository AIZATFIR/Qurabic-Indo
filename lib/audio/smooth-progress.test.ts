import test from 'node:test';
import assert from 'node:assert/strict';
import { getAudioProgress, shouldPublishAudioTime } from './smooth-progress';

test('audio time state publishes often enough for continuous CSS progress', () => {
  assert.equal(shouldPublishAudioTime(1099, 1000), false);
  assert.equal(shouldPublishAudioTime(1100, 1000), true);
});

test('live audio progress stays bounded and is zero until duration is known', () => {
  assert.equal(getAudioProgress(0, 0), 0);
  assert.equal(getAudioProgress(15, 30), 0.5);
  assert.equal(getAudioProgress(40, 30), 1);
});
