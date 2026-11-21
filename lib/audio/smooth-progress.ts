export function shouldPublishAudioTime(now: number, lastPublishedAt: number, minimumIntervalMs = 100): boolean {
  return now - lastPublishedAt >= minimumIntervalMs;
}

export function getAudioProgress(currentTime: number, duration: number): number {
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return 0;
  return Math.max(0, Math.min(1, currentTime / duration));
}

export function getMonotonicAudioProgress(next: number, previous: number): number {
  return Math.max(previous, next);
}

export function interpolateAudioProgress(
  progress: number,
  duration: number,
  playbackRate: number,
  now: number,
  playing: boolean,
  observation: { value: number; at: number },
  maxExtrapolationMs = 250,
): number {
  const boundedProgress = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : observation.value;
  if (boundedProgress > observation.value) {
    observation.value = boundedProgress;
    observation.at = now;
  }
  if (!playing) {
    observation.value = boundedProgress;
    observation.at = now;
    return boundedProgress;
  }
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(playbackRate) || playbackRate <= 0) return observation.value;
  const elapsedMs = Math.max(0, Math.min(maxExtrapolationMs, now - observation.at));
  return Math.min(1, observation.value + elapsedMs * playbackRate / (duration * 1000));
}
