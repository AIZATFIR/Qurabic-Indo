import test from 'node:test';
import assert from 'node:assert/strict';
import { getAudioProgress, getInterpolatedAudioProgress, shouldPublishAudioTime } from './smooth-progress';
import * as progressFunctions from './smooth-progress';

test('audio time state publishes often enough for continuous CSS progress', () => {
  assert.equal(shouldPublishAudioTime(1099, 1000), false);
  assert.equal(shouldPublishAudioTime(1100, 1000), true);
});

test('live audio progress stays bounded and is zero until duration is known', () => {
  assert.equal(getAudioProgress(0, 0), 0);
  assert.equal(getAudioProgress(15, 30), 0.5);
  assert.equal(getAudioProgress(40, 30), 1);
});

test('live audio progress interpolates between media time samples while playing', () => {
  assert.equal(getInterpolatedAudioProgress(4, 20, 1000, 1250, true), 0.2125);
  assert.equal(getInterpolatedAudioProgress(4, 20, 1000, 1250, false), 0.2);
});

test('live audio progress ignores tiny backward media-time corrections', () => {
  const getMonotonicAudioProgress = (progressFunctions as unknown as Record<string, unknown>).getMonotonicAudioProgress;
  assert.equal(typeof getMonotonicAudioProgress, 'function');
  const keepForward = getMonotonicAudioProgress as (next: number, previous: number) => number;
  assert.equal(keepForward(0.2995, 0.3), 0.3);
  assert.equal(keepForward(0.31, 0.3), 0.31);
});

test('live audio interpolation is capped when browser time updates pause', () => {
  assert.equal(getInterpolatedAudioProgress(4, 20, 1000, 5000, true), 0.225);
  assert.equal(getInterpolatedAudioProgress(4, 0, 1000, 1250, true), 0);
});
