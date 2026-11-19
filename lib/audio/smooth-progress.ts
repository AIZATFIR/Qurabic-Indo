export interface AudioProgressSample {
  currentTime: number;
  duration: number;
  observedAt: number;
  now: number;
  isPlaying: boolean;
  progress: number;
}

export function estimateAudioProgress(sample: AudioProgressSample): number {
  const { currentTime, duration, observedAt, now, isPlaying, progress } = sample;
  if (!Number.isFinite(duration) || duration <= 0) {
    return Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  }
  const elapsed = isPlaying && Number.isFinite(now - observedAt) ? Math.max(0, now - observedAt) / 1000 : 0;
  return Math.max(0, Math.min(1, (currentTime + elapsed) / duration));
}

export function stabilizeAudioProgress(progress: number, lastProgress: number, allowRewind = false): number {
  const bounded = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  return allowRewind ? bounded : Math.max(bounded, Math.max(0, Math.min(1, lastProgress)));
}
