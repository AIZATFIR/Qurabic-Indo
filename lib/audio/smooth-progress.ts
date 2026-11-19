export function shouldPublishAudioTime(now: number, lastPublishedAt: number, minimumIntervalMs = 500): boolean {
  return now - lastPublishedAt >= minimumIntervalMs;
}
