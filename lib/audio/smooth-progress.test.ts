import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldPublishAudioTime } from './smooth-progress';

test('audio time state publishes at most twice per second', () => {
  assert.equal(shouldPublishAudioTime(1499, 1000), false);
  assert.equal(shouldPublishAudioTime(1500, 1000), true);
});
