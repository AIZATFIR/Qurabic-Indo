import test from 'node:test';
import assert from 'node:assert/strict';
import { getAudioProgress, shouldPublishAudioTime } from './smooth-progress';
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

test('live audio progress ignores tiny backward media-time corrections', () => {
  const getMonotonicAudioProgress = (progressFunctions as unknown as Record<string, unknown>).getMonotonicAudioProgress;
  assert.equal(typeof getMonotonicAudioProgress, 'function');
  const keepForward = getMonotonicAudioProgress as (next: number, previous: number) => number;
  assert.equal(keepForward(0.2995, 0.3), 0.3);
  assert.equal(keepForward(0.31, 0.3), 0.31);
});

test('live audio progress interpolates between quantized media-time samples', () => {
  const interpolate = (progressFunctions as unknown as Record<string, unknown>).interpolateAudioProgress;
  assert.equal(typeof interpolate, 'function');
  const getInterpolated = interpolate as (progress: number, duration: number, rate: number, now: number, playing: boolean, observation: { value: number; at: number }) => number;
  const observation = { value: 0, at: 0 };
  assert.equal(getInterpolated(0, 8, 1, 0, true, observation), 0);
  assert.equal(getInterpolated(0, 8, 1, 125, true, observation), 0.015625);
  assert.equal(getInterpolated(0.03125, 8, 1, 250, true, observation), 0.03125);
  assert.equal(getInterpolated(0.03125, 8, 1, 375, true, observation), 0.046875);
  assert.equal(getInterpolated(0.03125, 8, 1, 400, false, observation), 0.03125);
});
