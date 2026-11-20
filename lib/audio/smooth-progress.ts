export function shouldPublishAudioTime(now: number, lastPublishedAt: number, minimumIntervalMs = 100): boolean {
  return now - lastPublishedAt >= minimumIntervalMs;
}
