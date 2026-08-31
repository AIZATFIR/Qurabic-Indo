'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAyahAudioUrl } from '../api/audio';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

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
  error: string | null;
  playAyah: (ayahNumber: number) => void;
  togglePlayPause: () => void;
  pause: () => void;
  resume: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
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
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeAyahRef = useRef<number | null>(null);
  activeAyahRef.current = currentAyah;

  const totalAyahsRef = useRef<number>(totalAyahs);
  totalAyahsRef.current = totalAyahs;

  const surahNumberRef = useRef<number>(surahNumber);
  surahNumberRef.current = surahNumber;

  // Initialize or retrieve single shared audio instance
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    const handlePlay = () => {
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
      if (audio.paused) {
        setPlaybackState((prev) => (prev === 'loading' ? 'paused' : prev));
      } else {
        setPlaybackState('playing');
      }
    };

    const handleError = () => {
      console.warn(`Audio playback error for Surah ${surahNumberRef.current}:${activeAyahRef.current}`);
      setPlaybackState('error');
      setError('Audio tidak tersedia untuk ayat ini');
    };

    // Ayah Autoplay: when current ayah ends, automatically play next ayah
    const handleEnded = () => {
      const current = activeAyahRef.current;
      const total = totalAyahsRef.current;

      if (current !== null && current < total) {
        const next = current + 1;
        playAyahInternal(next);
      } else {
        setPlaybackState('ended');
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

      audio.pause();
      audio.src = '';
    };
  }, []);

  // When selected surah changes, reset audio state cleanly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentAyah(null);
    setPlaybackState('idle');
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, [surahNumber]);

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

  // Core internal function to load and play a specific Ayah
  const playAyahInternal = useCallback((ayahNum: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const url = getAyahAudioUrl(surahNumberRef.current, ayahNum);

    setCurrentAyah(ayahNum);
    setPlaybackState('loading');
    setError(null);
    setCurrentTime(0);
    setDuration(0);

    audio.src = url;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setPlaybackState('playing');
          scrollToAyah(ayahNum);
        })
        .catch((err) => {
          // Handle browser autoplay rejection gracefully
          if (err.name !== 'AbortError') {
            console.warn('Playback notice:', err.message);
            setPlaybackState('paused');
          }
        });
    }
  }, [scrollToAyah]);

  // Public: Play a specific Ayah
  const playAyah = useCallback((ayahNum: number) => {
    if (ayahNum < 1 || ayahNum > totalAyahs) return;
    playAyahInternal(ayahNum);
  }, [playAyahInternal, totalAyahs]);

  // Public: Toggle Play / Pause
  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playbackState === 'playing') {
      audio.pause();
      setPlaybackState('paused');
    } else if (playbackState === 'paused' && currentAyah !== null) {
      audio.play().catch(() => {});
      setPlaybackState('playing');
    } else {
      // Start from first ayah or current ayah
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

    // If already played > 3 seconds into the ayah, restart current ayah
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else if (currentAyah > 1) {
      playAyahInternal(currentAyah - 1);
    } else {
      audio.currentTime = 0;
    }
  }, [currentAyah, playAyahInternal]);

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaybackState('idle');
    setCurrentTime(0);
    setCurrentAyah(null);
  }, []);

  // Keyboard shortcut listener (Space = play/pause, ArrowRight = next, ArrowLeft = prev)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or search modal is open
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowRight' && currentAyah !== null) {
        e.preventDefault();
        nextAyah();
      } else if (e.code === 'ArrowLeft' && currentAyah !== null) {
        e.preventDefault();
        prevAyah();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    error,
    playAyah,
    togglePlayPause,
    pause,
    resume,
    nextAyah,
    prevAyah,
    seek,
    stop,
  };
}
