import test from 'node:test';
import assert from 'node:assert/strict';
import { estimateAudioProgress, stabilizeAudioProgress } from './smooth-progress';

test('audio progress interpolation follows playback between browser timeupdate events', () => {
  assert.equal(estimateAudioProgress({ currentTime: 10, duration: 100, observedAt: 1000, now: 1500, isPlaying: true, progress: 0.1 }), 0.105);
});

test('paused or loading playback stays at the last observed audio position', () => {
  assert.equal(estimateAudioProgress({ currentTime: 10, duration: 100, observedAt: 1000, now: 1500, isPlaying: false, progress: 0.1 }), 0.1);
});

test('audio progress handles unknown duration and never escapes its track', () => {
  assert.equal(estimateAudioProgress({ currentTime: 0, duration: 0, observedAt: 0, now: 1000, isPlaying: true, progress: 0.25 }), 0.25);
  assert.equal(estimateAudioProgress({ currentTime: 200, duration: 100, observedAt: 0, now: 0, isPlaying: false, progress: 1 }), 1);
});

test('audio progress ignores small backward updates but permits an intentional seek or new track', () => {
  assert.equal(stabilizeAudioProgress(0.42, 0.45), 0.45);
  assert.equal(stabilizeAudioProgress(0.42, 0.45, true), 0.42);
  assert.equal(stabilizeAudioProgress(1.4, 0.45), 1);
});
