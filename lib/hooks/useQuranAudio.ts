'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAyahAudioUrl, getAudioCandidateUrls } from '../api/audio';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
export type RepeatMode = 'off' | 'ayah' | 'surah';

export interface UseQuranAudioOptions {
  surahNumber: number;
  totalAyahs: number;
  autoScroll?: boolean;
}

export interface UseQuranAudioReturn {
  currentAyah: number | null;
  playbackState: PlaybackState;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 1
  repeatMode: RepeatMode;
  autoNext: boolean;
  error: string | null;
  playAyah: (ayahNumber: number) => void;
  togglePlayPause: () => void;
  pause: () => void;
  resume: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  setRepeatMode: (mode: RepeatMode) => void;
  cycleRepeatMode: () => void;
  setAutoNext: (enabled: boolean) => void;
  toggleAutoNext: () => void;
  seek: (progressRatio: number) => void;
  stop: () => void;
}

export function useQuranAudio({
  surahNumber,
  totalAyahs,
  autoScroll = true,
}: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestIdRef = useRef<number>(0);
  const candidateIndexRef = useRef<number>(0);
  const candidateUrlsRef = useRef<string[]>([]);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeAyahRef = useRef<number | null>(null);
  activeAyahRef.current = currentAyah;

  const totalAyahsRef = useRef<number>(totalAyahs);
  totalAyahsRef.current = totalAyahs;

  const surahNumberRef = useRef<number>(surahNumber);
  surahNumberRef.current = surahNumber;

  const repeatModeRef = useRef<RepeatMode>(repeatMode);
  repeatModeRef.current = repeatMode;

  const autoNextRef = useRef<boolean>(autoNext);
  autoNextRef.current = autoNext;

  // Forward refs to eliminate circular dependencies and hook warnings
  const playAyahInternalRef = useRef<(ayahNum: number) => void>(() => {});
  const tryNextCandidateRef = useRef<(reqId: number, ayahNum: number) => void>(() => {});

  // Clear watchdog timer helper
  const clearWatchdog = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  // Smooth auto-scroll helper
  const scrollToAyah = useCallback((ayahNum: number) => {
    if (!autoScroll || typeof document === 'undefined') return;

    requestAnimationFrame(() => {
      const el = document.getElementById(`ayah-${ayahNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, [autoScroll]);

  // Load a candidate URL with timeout watchdog & race-condition protection
  const loadCandidate = useCallback((index: number, reqId: number, ayahNum: number) => {
    clearWatchdog();

    const audio = audioRef.current;
    if (!audio) return;

    const urls = candidateUrlsRef.current;
    if (index >= urls.length) {
      setPlaybackState('error');
      setError('Audio tilawah tidak tersedia. Ketuk untuk mencoba lagi.');
      return;
    }

    candidateIndexRef.current = index;
    const targetUrl = urls[index];

    audio.src = targetUrl;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (requestIdRef.current !== reqId) return;
          clearWatchdog();
          setPlaybackState('playing');
          setError(null);
          scrollToAyah(ayahNum);
        })
        .catch((err) => {
          if (requestIdRef.current !== reqId) return;
          if (err.name === 'NotAllowedError') {
            // Browser autoplay restricted; keep in paused state ready for user tap
            clearWatchdog();
            setPlaybackState('paused');
          } else if (err.name !== 'AbortError') {
            console.warn(`[Qurabic Audio] Failed candidate ${index}: ${err.message}`);
            // Fallback immediately to next candidate
            tryNextCandidateRef.current(reqId, ayahNum);
          }
        });
    }

    // Watchdog timer: If audio doesn't start playing within 4.5s (e.g. stalled connection), failover
    loadTimeoutRef.current = setTimeout(() => {
      if (requestIdRef.current !== reqId) return;
      if (audio.paused || audio.readyState < 2) {
        console.warn(`[Qurabic Audio] Watchdog triggered on candidate ${index}, trying next candidate CDN...`);
        tryNextCandidateRef.current(reqId, ayahNum);
      }
    }, 4500);
  }, [clearWatchdog, scrollToAyah]);

  // Failover to next candidate in chain
  const tryNextCandidate = useCallback((reqId: number, ayahNum: number) => {
    const nextIndex = candidateIndexRef.current + 1;
    if (nextIndex < candidateUrlsRef.current.length) {
      loadCandidate(nextIndex, reqId, ayahNum);
    } else {
      clearWatchdog();
      setPlaybackState('error');
      setError('Koneksi audio tilawah terputus. Ketuk untuk mencoba lagi.');
    }
  }, [loadCandidate, clearWatchdog]);

  tryNextCandidateRef.current = tryNextCandidate;

  // Initialize single shared audio instance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const handlePlay = () => {
      clearWatchdog();
      setPlaybackState('playing');
      setError(null);
    };

    const handlePause = () => {
      if (audio.ended) {
        setPlaybackState('ended');
      } else {
        setPlaybackState('paused');
      }
    };

    const handleTimeUpdate = () => {
      clearWatchdog();
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleWaiting = () => {
      setPlaybackState('loading');
    };

    const handleCanPlay = () => {
      clearWatchdog();
      if (audio.paused) {
        setPlaybackState((prev) => (prev === 'loading' ? 'paused' : prev));
      } else {
        setPlaybackState('playing');
      }
    };

    const handleError = () => {
      console.warn(`[Qurabic Audio] Media element error on candidate ${candidateIndexRef.current}`);
      const activeAyah = activeAyahRef.current;
      if (activeAyah !== null) {
        tryNextCandidateRef.current(requestIdRef.current, activeAyah);
      } else {
        setPlaybackState('error');
        setError('Audio tilawah tidak tersedia untuk ayat ini');
      }
    };

    // Ayah Autoplay & Repeat Logic
    const handleEnded = () => {
      const current = activeAyahRef.current;
      const total = totalAyahsRef.current;
      const mode = repeatModeRef.current;
      const isAutoNext = autoNextRef.current;

      if (current === null) return;

      // 1. AYAH Repeat Mode
      if (mode === 'ayah') {
        playAyahInternalRef.current(current);
        return;
      }

      // 2. Next Ayah within Surah
      if (current < total) {
        if (isAutoNext) {
          playAyahInternalRef.current(current + 1);
        } else {
          setPlaybackState('paused');
        }
        return;
      }

      // 3. Final Ayah of Surah reached
      if (current >= total) {
        if (mode === 'surah') {
          // Loop back to Ayah 1 of the same surah
          playAyahInternalRef.current(1);
        } else {
          // Stop at final ayah, keep selected
          setPlaybackState('ended');
        }
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);

      clearWatchdog();
      audio.pause();
      audio.src = '';
    };
  }, [clearWatchdog]);

  // When selected surah changes, reset audio state cleanly
  useEffect(() => {
    requestIdRef.current++;
    clearWatchdog();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentAyah(null);
    setPlaybackState('idle');
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, [surahNumber, clearWatchdog]);

  // Core internal function to load and play a specific Ayah with Race Condition protection
  const playAyahInternal = useCallback((ayahNum: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentRequestId = ++requestIdRef.current;
    const candidates = getAudioCandidateUrls(surahNumberRef.current, ayahNum);
    candidateUrlsRef.current = candidates;

    setCurrentAyah(ayahNum);
    setPlaybackState('loading');
    setError(null);
    setCurrentTime(0);
    setDuration(0);

    loadCandidate(0, currentRequestId, ayahNum);
  }, [loadCandidate]);

  playAyahInternalRef.current = playAyahInternal;

  // Public: Play a specific Ayah
  const playAyah = useCallback((ayahNum: number) => {
    if (ayahNum < 1 || ayahNum > totalAyahs) return;
    playAyahInternal(ayahNum);
  }, [playAyahInternal, totalAyahs]);

  // Public: Toggle Play / Pause
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const isAudioPlaying = !audio.paused && audio.currentTime > 0 && !audio.ended;

    if (isAudioPlaying || playbackState === 'playing') {
      audio.pause();
      setPlaybackState('paused');
    } else if (currentAyah !== null && audio.src) {
      audio.play().catch(() => {});
      setPlaybackState('playing');
    } else {
      const target = currentAyah || 1;
      playAyahInternal(target);
    }
  }, [currentAyah, playbackState, playAyahInternal]);

  // Public: Pause
  const pause = useCallback(() => {
    if (audioRef.current && playbackState === 'playing') {
      audioRef.current.pause();
      setPlaybackState('paused');
    }
  }, [playbackState]);

  // Public: Resume
  const resume = useCallback(() => {
    if (audioRef.current && currentAyah !== null) {
      audioRef.current.play().catch(() => {});
      setPlaybackState('playing');
    }
  }, [currentAyah]);

  // Public: Next Ayah
  const nextAyah = useCallback(() => {
    const current = currentAyah || 0;
    if (current < totalAyahs) {
      playAyahInternal(current + 1);
    }
  }, [currentAyah, playAyahInternal, totalAyahs]);

  // Public: Prev Ayah
  const prevAyah = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || currentAyah === null) return;

    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (currentAyah > 1) {
      playAyahInternal(currentAyah - 1);
    } else {
      audio.currentTime = 0;
    }
  }, [currentAyah, playAyahInternal]);

  // Public: Cycle repeat mode (off -> ayah -> surah -> off)
  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'ayah';
      if (prev === 'ayah') return 'surah';
      return 'off';
    });
  }, []);

  // Public: Toggle Auto Next
  const toggleAutoNext = useCallback(() => {
    setAutoNext((prev) => !prev);
  }, []);

  // Public: Seek current ayah progress
  const seek = useCallback((progressRatio: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || isNaN(audio.duration)) return;

    const targetTime = Math.max(0, Math.min(progressRatio * audio.duration, audio.duration));
    audio.currentTime = targetTime;
    setCurrentTime(targetTime);
  }, []);

  // Public: Stop playback
  const stop = useCallback(() => {
    requestIdRef.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaybackState('idle');
    setCurrentTime(0);
    setCurrentAyah(null);
  }, []);

  // Keyboard shortcuts (Space = play/pause, ArrowRight = next, ArrowLeft = prev)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

      const isSpace = e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 32;

      if (isSpace) {
        e.preventDefault();
        e.stopPropagation();
        if (document.activeElement instanceof HTMLElement && document.activeElement !== document.body) {
          document.activeElement.blur();
        }
        togglePlayPause();
      } else if (e.code === 'ArrowRight' && currentAyah !== null) {
        e.preventDefault();
        e.stopPropagation();
        nextAyah();
      } else if (e.code === 'ArrowLeft' && currentAyah !== null) {
        e.preventDefault();
        e.stopPropagation();
        prevAyah();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [togglePlayPause, nextAyah, prevAyah, currentAyah]);

  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const isPlaying = playbackState === 'playing';
  const isLoading = playbackState === 'loading';

  return {
    currentAyah,
    playbackState,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    repeatMode,
    autoNext,
    error,
    playAyah,
    togglePlayPause,
    pause,
    resume,
    nextAyah,
    prevAyah,
    setRepeatMode,
    cycleRepeatMode,
    setAutoNext,
    toggleAutoNext,
    seek,
    stop,
  };
}
