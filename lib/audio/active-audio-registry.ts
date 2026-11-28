const activeQuranAudio = new Set<HTMLAudioElement>();

export function registerQuranAudio(audio: HTMLAudioElement): () => void {
  activeQuranAudio.add(audio);
  return () => activeQuranAudio.delete(audio);
}

export function isQuranAudioPlaying(): boolean {
  for (const audio of activeQuranAudio) {
    if (!audio.paused && !audio.ended) return true;
  }
  return false;
}
