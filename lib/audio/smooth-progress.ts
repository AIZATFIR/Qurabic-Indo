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

export function getInterpolatedAudioProgress(
  sampledTime: number,
  duration: number,
  sampledAt: number,
  now: number,
  isPlaying: boolean,
  playbackRate = 1,
): number {
  const elapsed = isPlaying && Number.isFinite(sampledAt) && Number.isFinite(now)
    ? Math.max(0, Math.min(500, now - sampledAt)) / 1000
    : 0;
  const rate = Number.isFinite(playbackRate) && playbackRate > 0 ? playbackRate : 1;
  return getAudioProgress(sampledTime + elapsed * rate, duration);
}
