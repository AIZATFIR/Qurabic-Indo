'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getAyahAudioUrl,
  getAudioCandidateUrls,
  getTranslationAudioCandidateUrls,
  isHumanTranslationAvailable,
  AVAILABLE_QARIS,
  QariMeta,
  TranslationVoiceMode,
  TRANSLATION_VOICE_OPTIONS,
  TranslationVoiceOption,
} from '../api/audio';
import {
  getCachedAudioUrl,
  getCachedTranslationUrl,
  preloadUpcomingAyahs,
  preloadArabicAudio,
  preloadTranslationAudio,
} from '../audio/audio-preloader';
import {
  speakIndonesianTranslation,
  cancelSpeechSynthesis,
  isSpeechSynthesisSupported,
} from '../audio/speech-translation';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
export type RepeatMode = 'off' | 'ayah' | 'surah';
export type HandsfreeMode = 'off' | 'normal' | 'reverse';

export interface UseQuranAudioOptions {
  surahNumber: number;
  totalAyahs: number;
  autoScroll?: boolean;
  getAyahTranslation?: (ayahNumber: number) => string | undefined;
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
  // Multi-Qari Selection
  selectedQari: string;
  setSelectedQari: (qariId: string) => void;
  currentQariMeta: QariMeta;
  availableQaris: QariMeta[];
  // Translation Voice Options
  translationVoiceMode: TranslationVoiceMode;
  setTranslationVoiceMode: (mode: TranslationVoiceMode) => void;
  translationVoiceOptions: TranslationVoiceOption[];
  isHumanTranslationAvailableForCurrentSurah: boolean;
  // Tadarus Handsfree (Indonesian Translation Speech)
  handsfreeMode: HandsfreeMode;
  isTranslationReadingEnabled: boolean; // boolean compatibility alias (handsfreeMode !== 'off')
  isReadingTranslation: boolean;
  translationSpeechSupported: boolean;
  setHandsfreeMode: (mode: HandsfreeMode) => void;
  toggleTranslationReading: () => void;
  setTranslationReadingEnabled: (enabled: boolean) => void;
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
  getAyahTranslation,
}: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [autoNext, setAutoNext] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Multi-Qari state (defaults to Alafasy, persists in localStorage)
  const [selectedQari, setSelectedQariState] = useState<string>('alafasy');

  // Translation Voice Mode state ('human' | 'tts' | 'off')
  const [translationVoiceMode, setTranslationVoiceModeState] = useState<TranslationVoiceMode>('human');

  // Tadarus Handsfree state
  const [handsfreeMode, setHandsfreeModeState] = useState<HandsfreeMode>('off');
  const [isReadingTranslation, setIsReadingTranslation] = useState<boolean>(false);
  const [translationSpeechSupported, setTranslationSpeechSupported] = useState<boolean>(true);

  const isTranslationReadingEnabled = handsfreeMode !== 'off';

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const requestIdRef = useRef<number>(0);
  const candidateIndexRef = useRef<number>(0);
  const candidateUrlsRef = useRef<string[]>([]);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activePhaseRef = useRef<'arabic' | 'translation'>('arabic');

  const selectedQariRef = useRef<string>(selectedQari);
  selectedQariRef.current = selectedQari;

  const translationVoiceModeRef = useRef<TranslationVoiceMode>(translationVoiceMode);
  translationVoiceModeRef.current = translationVoiceMode;

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

  const handsfreeModeRef = useRef<HandsfreeMode>('off');
  handsfreeModeRef.current = handsfreeMode;

  const isTranslationReadingEnabledRef = useRef<boolean>(isTranslationReadingEnabled);
  isTranslationReadingEnabledRef.current = isTranslationReadingEnabled;

  const isReadingTranslationRef = useRef<boolean>(isReadingTranslation);
  isReadingTranslationRef.current = isReadingTranslation;

  const getAyahTranslationRef = useRef<((ayahNumber: number) => string | undefined) | undefined>(
    getAyahTranslation
  );
  getAyahTranslationRef.current = getAyahTranslation;

  // Forward refs to eliminate circular dependencies
  const playAyahInternalRef = useRef<(ayahNum: number) => void>(() => {});
  const playArabicCandidateRef = useRef<(ayahNum: number) => void>(() => {});
  const playTranslationInternalRef = useRef<(ayahNum: number) => void>(() => {});
  const tryNextCandidateRef = useRef<(reqId: number, ayahNum: number) => void>(() => {});
  const advanceAfterAyahRef = useRef<() => void>(() => {});

  // Load preferences from localStorage on mount
  useEffect(() => {
    setTranslationSpeechSupported(true);
    if (typeof window === 'undefined') return;
    try {
      const savedQari = localStorage.getItem('qurabic_audio_qari');
      if (savedQari && AVAILABLE_QARIS.some((q) => q.id === savedQari)) {
        setSelectedQariState(savedQari);
        selectedQariRef.current = savedQari;
      }

      const savedVoice = localStorage.getItem('qurabic_audio_translation_voice') as TranslationVoiceMode;
      if (savedVoice && ['human', 'tts', 'off'].includes(savedVoice)) {
        setTranslationVoiceModeState(savedVoice);
        translationVoiceModeRef.current = savedVoice;
        if (savedVoice === 'off') {
          setHandsfreeModeState('off');
          handsfreeModeRef.current = 'off';
        } else {
          setHandsfreeModeState('normal');
          handsfreeModeRef.current = 'normal';
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Clear watchdog timer helper
  const clearWatchdog = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  // Smooth auto-scroll helper aligned with precision to the top border of ayah
  const scrollToAyah = useCallback(
    (ayahNum: number) => {
      if (!autoScroll || typeof document === 'undefined') return;

      const tryScroll = (attemptsLeft = 4) => {
        const el = document.getElementById(`ayah-${ayahNum}`);
        if (el) {
          const header = document.getElementById('reader-headbar');
          const headerHeight = header ? header.getBoundingClientRect().height : 56;
          const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: Math.max(0, elementTop - headerHeight),
            behavior: 'smooth',
          });
        } else if (attemptsLeft > 0) {
          setTimeout(() => tryScroll(attemptsLeft - 1), 80);
        }
      };

      requestAnimationFrame(() => tryScroll());
    },
    [autoScroll]
  );

  // Helper to advance after Ayah cycle completes (either Arabic audio only or Arabic + Translation)
  const advanceAfterAyah = useCallback(() => {
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
        playAyahInternalRef.current(1);
      } else {
        setPlaybackState('ended');
      }
    }
  }, []);

  advanceAfterAyahRef.current = advanceAfterAyah;

  // Load a candidate URL with timeout watchdog & race-condition protection
  const loadCandidate = useCallback(
    (index: number, reqId: number, ayahNum: number) => {
      clearWatchdog();

      const audio = audioRef.current;
      if (!audio) return;

      const urls = candidateUrlsRef.current;
      if (index >= urls.length) {
        if (activePhaseRef.current === 'translation') {
          console.warn('[Qurabic Audio] Translation audio candidates exhausted, advancing to next ayah...');
          activePhaseRef.current = 'arabic';
          setIsReadingTranslation(false);
          advanceAfterAyahRef.current();
          return;
        }
        setPlaybackState('error');
        setError('Audio tilawah tidak tersedia. Ketuk untuk mencoba lagi.');
        return;
      }

      candidateIndexRef.current = index;
      const targetUrl = urls[index];

      // Instant 0ms start if preloaded into memory blob
      const cachedBlob = getCachedAudioUrl(targetUrl);
      const effectiveUrl = cachedBlob || targetUrl;

      audio.src = effectiveUrl;
      audio.load();

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (requestIdRef.current !== reqId) return;
            clearWatchdog();
            setPlaybackState('playing');
            setError(null);
            if (activePhaseRef.current === 'arabic') {
              scrollToAyah(ayahNum);
            }
          })
          .catch((err) => {
            if (requestIdRef.current !== reqId) return;
            if (err.name === 'NotAllowedError') {
              clearWatchdog();
              setPlaybackState('paused');
            } else if (err.name !== 'AbortError') {
              console.warn(`[Qurabic Audio] Failed candidate ${index}: ${err.message}`);
              tryNextCandidateRef.current(reqId, ayahNum);
            }
          });
      }

      // Watchdog timer: If audio doesn't start playing within 5s, failover
      loadTimeoutRef.current = setTimeout(() => {
        if (requestIdRef.current !== reqId) return;
        if (audio.paused || audio.readyState < 2) {
          console.warn(
            `[Qurabic Audio] Watchdog triggered on candidate ${index}, trying next candidate...`
          );
          tryNextCandidateRef.current(reqId, ayahNum);
        }
      }, 5000);
    },
    [clearWatchdog, scrollToAyah]
  );

  // Failover to next candidate in chain
  const tryNextCandidate = useCallback(
    (reqId: number, ayahNum: number) => {
      const nextIndex = candidateIndexRef.current + 1;
      if (nextIndex < candidateUrlsRef.current.length) {
        loadCandidate(nextIndex, reqId, ayahNum);
      } else {
        clearWatchdog();
        if (activePhaseRef.current === 'translation') {
          console.warn('[Qurabic Audio] All translation CDNs failed, advancing to next phase...');
          activePhaseRef.current = 'arabic';
          setIsReadingTranslation(false);
          if (handsfreeModeRef.current === 'reverse') {
            playArabicCandidateRef.current(ayahNum);
          } else {
            advanceAfterAyahRef.current();
          }
          return;
        }
        setPlaybackState('error');
        setError('Koneksi audio tilawah terputus. Ketuk untuk mencoba lagi.');
      }
    },
    [loadCandidate, clearWatchdog]
  );

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

    // Ayah Autoplay & Handsfree Dual-Phase Flow Logic
    const handleEnded = () => {
      const current = activeAyahRef.current;
      if (current === null) return;

      const currentMode = handsfreeModeRef.current;

      // Special handling for surah-level reciters (e.g. Syaikh Muhammad Al-Luhaidan)
      const qari = AVAILABLE_QARIS.find((q) => q.id === selectedQariRef.current);
      if (qari?.isSurahLevel && activePhaseRef.current === 'arabic') {
        if (repeatModeRef.current === 'surah') {
          playAyahInternalRef.current(1);
        } else {
          setPlaybackState('ended');
          setCurrentAyah(null);
        }
        return;
      }

      // 1. If Indonesian translation audio just completed
      if (activePhaseRef.current === 'translation') {
        setIsReadingTranslation(false);

        // In Reverse mode, translation was phase 1 -> now play Arabic audio of the same ayah!
        if (currentMode === 'reverse') {
          activePhaseRef.current = 'arabic';
          playArabicCandidateRef.current(current);
          return;
        }

        // In Normal mode, translation was phase 2 -> this ayah is complete -> advance!
        activePhaseRef.current = 'arabic';
        advanceAfterAyahRef.current();
        return;
      }

      // 2. If Arabic audio just completed
      if (activePhaseRef.current === 'arabic') {
        // In Normal mode, Arabic was phase 1 -> now play Indonesian translation!
        if (currentMode === 'normal') {
          playTranslationInternalRef.current(current);
          return;
        }

        // In Reverse mode (or Off mode), Arabic was the final phase -> advance!
        advanceAfterAyahRef.current();
        return;
      }

      advanceAfterAyahRef.current();
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

  // When selected surah changes, reset audio cleanly
  useEffect(() => {
    requestIdRef.current++;
    clearWatchdog();
    activePhaseRef.current = 'arabic';
    setIsReadingTranslation(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentAyah(null);
    setPlaybackState('idle');
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    // Warm-up Ayah 1 bundle (Arabic + Translation) immediately on surah selection
    preloadUpcomingAyahs(
      surahNumber,
      1,
      totalAyahs,
      getAyahTranslationRef.current,
      selectedQariRef.current,
      translationVoiceModeRef.current
    );
  }, [surahNumber, totalAyahs, clearWatchdog]);

  // Load and play Arabic audio recitation candidate
  const playArabicCandidate = useCallback(
    (ayahNum: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      activePhaseRef.current = 'arabic';
      setIsReadingTranslation(false);
      const currentRequestId = ++requestIdRef.current;
      const candidates = getAudioCandidateUrls(
        surahNumberRef.current,
        ayahNum,
        selectedQariRef.current
      );

      // Prepend preloaded blob for instant 0ms start
      const cachedArabic = getCachedAudioUrl(candidates[0]);
      if (cachedArabic) {
        candidates.unshift(cachedArabic);
      }
      candidateUrlsRef.current = candidates;

      setCurrentAyah(ayahNum);
      setPlaybackState('loading');
      setError(null);
      setCurrentTime(0);
      setDuration(0);

      loadCandidate(0, currentRequestId, ayahNum);

      // Proactively preload translation and upcoming ayahs simultaneously
      preloadUpcomingAyahs(
        surahNumberRef.current,
        ayahNum,
        totalAyahsRef.current,
        getAyahTranslationRef.current,
        selectedQariRef.current,
        translationVoiceModeRef.current
      );
    },
    [loadCandidate]
  );

  playArabicCandidateRef.current = playArabicCandidate;

  // Core internal function to load and play an Ayah according to active Handsfree mode
  const playAyahInternal = useCallback(
    (ayahNum: number) => {
      clearWatchdog();
      cancelSpeechSynthesis();
      setIsReadingTranslation(false);

      // TADARUS HANDSFREE REVERSE MODE: Read Indonesian translation FIRST, then Arabic audio
      if (handsfreeModeRef.current === 'reverse') {
        playTranslationInternalRef.current(ayahNum);
        return;
      }

      // Default or Normal mode: play Arabic audio candidate directly
      playArabicCandidate(ayahNum);
    },
    [clearWatchdog, playArabicCandidate]
  );

  playAyahInternalRef.current = playAyahInternal;

  // Core internal function to load and play Indonesian translation audio of an Ayah
  const playTranslationInternal = useCallback(
    (ayahNum: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      activePhaseRef.current = 'translation';
      setIsReadingTranslation(true);
      setCurrentAyah(ayahNum);
      scrollToAyah(ayahNum);

      const currentRequestId = ++requestIdRef.current;
      const translationText = getAyahTranslationRef.current?.(ayahNum);
      const voiceMode =
        translationVoiceModeRef.current === 'off' ? 'human' : translationVoiceModeRef.current;
      const candidates = getTranslationAudioCandidateUrls(
        surahNumberRef.current,
        ayahNum,
        translationText,
        voiceMode
      );

      // Check if translation audio was already preloaded into memory blob
      const cachedTranslation = getCachedTranslationUrl(
        surahNumberRef.current,
        ayahNum,
        translationText,
        voiceMode
      );
      if (cachedTranslation) {
        candidates.unshift(cachedTranslation);
      }
      candidateUrlsRef.current = candidates;

      // If no translation candidates available (e.g. human mode for surahs where human recording wasn't made)
      if (candidates.length === 0) {
        activePhaseRef.current = 'arabic';
        setIsReadingTranslation(false);
        advanceAfterAyahRef.current();
        return;
      }

      setPlaybackState('loading');
      setError(null);
      setCurrentTime(0);
      setDuration(0);

      loadCandidate(0, currentRequestId, ayahNum);

      // Preload next ayah Arabic + translation while current translation is playing
      if (ayahNum < totalAyahsRef.current) {
        const nextAyah = ayahNum + 1;
        preloadArabicAudio(surahNumberRef.current, nextAyah, selectedQariRef.current).catch(() => {});
        if (translationVoiceModeRef.current !== 'off') {
          preloadTranslationAudio(
            surahNumberRef.current,
            nextAyah,
            getAyahTranslationRef.current?.(nextAyah),
            translationVoiceModeRef.current
          ).catch(() => {});
        }
      }
    },
    [loadCandidate, scrollToAyah]
  );

  playTranslationInternalRef.current = playTranslationInternal;

  // Public: Play a specific Ayah (starts with Arabic)
  const playAyah = useCallback(
    (ayahNum: number) => {
      if (ayahNum < 1 || ayahNum > totalAyahs) return;
      playAyahInternal(ayahNum);
    },
    [playAyahInternal, totalAyahs]
  );

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
    activePhaseRef.current = 'arabic';
    setIsReadingTranslation(false);

    const current = currentAyah || 0;
    if (current < totalAyahs) {
      playAyahInternal(current + 1);
    }
  }, [currentAyah, playAyahInternal, totalAyahs]);

  // Public: Prev Ayah
  const prevAyah = useCallback(() => {
    activePhaseRef.current = 'arabic';
    setIsReadingTranslation(false);

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

  // Public: Set Active Qari (persists in localStorage & updates current ayah playback)
  const setSelectedQari = useCallback((qariId: string) => {
    setSelectedQariState(qariId);
    selectedQariRef.current = qariId;
    try {
      localStorage.setItem('qurabic_audio_qari', qariId);
    } catch {}

    // If currently on an ayah and playing Arabic, reload with new qari immediately
    const current = activeAyahRef.current;
    if (current !== null && activePhaseRef.current === 'arabic') {
      playAyahInternalRef.current(current);
    }
  }, []);

  // Public: Set Translation Voice Mode ('human' | 'tts' | 'off')
  const setTranslationVoiceMode = useCallback((mode: TranslationVoiceMode) => {
    setTranslationVoiceModeState(mode);
    translationVoiceModeRef.current = mode;
    try {
      localStorage.setItem('qurabic_audio_translation_voice', mode);
    } catch {}
  }, []);

  // Public: Set specific Handsfree mode
  const setHandsfreeMode = useCallback((mode: HandsfreeMode) => {
    const prevMode = handsfreeModeRef.current;
    setHandsfreeModeState(mode);
    handsfreeModeRef.current = mode;

    if (mode !== 'off' && translationVoiceModeRef.current === 'off') {
      setTranslationVoiceModeState('human');
      translationVoiceModeRef.current = 'human';
      try {
        localStorage.setItem('qurabic_audio_translation_voice', 'human');
      } catch {}
    }

    if (mode === 'off' && isReadingTranslationRef.current) {
      cancelSpeechSynthesis();
      setIsReadingTranslation(false);
      activePhaseRef.current = 'arabic';
      if (prevMode === 'reverse') {
        const current = activeAyahRef.current;
        if (current !== null) {
          playArabicCandidateRef.current(current);
        }
      } else {
        advanceAfterAyahRef.current();
      }
    }
  }, []);

  // Public: Toggle Tadarus Handsfree Translation Reading (off -> normal -> off)
  const toggleTranslationReading = useCallback(() => {
    setHandsfreeModeState((prev) => {
      const next: HandsfreeMode = prev === 'off' ? 'normal' : 'off';
      if (next !== 'off' && translationVoiceModeRef.current === 'off') {
        setTranslationVoiceModeState('human');
        translationVoiceModeRef.current = 'human';
        try {
          localStorage.setItem('qurabic_audio_translation_voice', 'human');
        } catch {}
      }
      if (next === 'off' && isReadingTranslationRef.current) {
        cancelSpeechSynthesis();
        setIsReadingTranslation(false);
        activePhaseRef.current = 'arabic';
        if (prev === 'reverse') {
          const current = activeAyahRef.current;
          if (current !== null) {
            playArabicCandidateRef.current(current);
          }
        } else {
          advanceAfterAyahRef.current();
        }
      }
      handsfreeModeRef.current = next;
      return next;
    });
  }, []);

  const setTranslationReadingEnabled = useCallback(
    (enabled: boolean) => {
      setHandsfreeMode(enabled ? 'normal' : 'off');
    },
    [setHandsfreeMode]
  );

  // Public: Seek current audio progress
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
    clearWatchdog();
    activePhaseRef.current = 'arabic';
    setIsReadingTranslation(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }
    setPlaybackState('idle');
    setCurrentTime(0);
    setCurrentAyah(null);
  }, [clearWatchdog]);

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

  const currentQariMeta =
    AVAILABLE_QARIS.find((q) => q.id === selectedQari) || AVAILABLE_QARIS[0];

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
    // Multi-Qari Selection
    selectedQari,
    setSelectedQari,
    currentQariMeta,
    availableQaris: AVAILABLE_QARIS,
    // Translation Voice Options
    translationVoiceMode,
    setTranslationVoiceMode,
    translationVoiceOptions: TRANSLATION_VOICE_OPTIONS,
    isHumanTranslationAvailableForCurrentSurah: isHumanTranslationAvailable(surahNumber),
    // Tadarus Handsfree
    handsfreeMode,
    isTranslationReadingEnabled,
    isReadingTranslation,
    translationSpeechSupported,
    setHandsfreeMode,
    toggleTranslationReading,
    setTranslationReadingEnabled,
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
