import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPublishAudioTime } from './smooth-progress';

test('audio time state publishes often enough for continuous CSS progress', () => {
  assert.equal(shouldPublishAudioTime(1099, 1000), false);
  assert.equal(shouldPublishAudioTime(1100, 1000), true);
});
