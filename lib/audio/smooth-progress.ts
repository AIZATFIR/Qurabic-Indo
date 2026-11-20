export function shouldPublishAudioTime(now: number, lastPublishedAt: number, minimumIntervalMs = 100): boolean {
  return now - lastPublishedAt >= minimumIntervalMs;
}

export function getAudioProgress(currentTime: number, duration: number): number {
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return 0;
  return Math.max(0, Math.min(1, currentTime / duration));
}
