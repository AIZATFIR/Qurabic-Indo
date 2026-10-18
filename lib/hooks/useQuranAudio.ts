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
  isTranslationReadingEnabled: boolean;
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

interface QueuedTrack {
  ayahNumber: number;
  phase: 'arabic' | 'translation';
  candidates: string[];
  candidateIndex: number;
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

  // Dual-Deck Audio Engine (Deck 0 and Deck 1) for 0ms Gapless Playback
  const deck0Ref = useRef<HTMLAudioElement | null>(null);
  const deck1Ref = useRef<HTMLAudioElement | null>(null);
  const activeDeckIndexRef = useRef<0 | 1>(0);

  const getActiveDeck = useCallback((): HTMLAudioElement | null => {
    return activeDeckIndexRef.current === 0 ? deck0Ref.current : deck1Ref.current;
  }, []);

  const getStandbyDeck = useCallback((): HTMLAudioElement | null => {
    return activeDeckIndexRef.current === 0 ? deck1Ref.current : deck0Ref.current;
  }, []);

  // Pre-buffered standby track descriptor
  const queuedStandbyRef = useRef<QueuedTrack | null>(null);

  const requestIdRef = useRef<number>(0);
  const activeCandidateIndexRef = useRef<number>(0);
  const activeCandidateUrlsRef = useRef<string[]>([]);
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

  const isReadingTranslationRef = useRef<boolean>(isReadingTranslation);
  isReadingTranslationRef.current = isReadingTranslation;

  const getAyahTranslationRef = useRef<((ayahNumber: number) => string | undefined) | undefined>(
    getAyahTranslation
  );
  getAyahTranslationRef.current = getAyahTranslation;

  // Forward refs to prevent circular dependencies
  const playAyahInternalRef = useRef<(ayahNum: number) => void>(() => {});
  const playArabicInternalRef = useRef<(ayahNum: number) => void>(() => {});
  const playTranslationInternalRef = useRef<(ayahNum: number) => void>(() => {});
  const advanceAfterAyahRef = useRef<() => void>(() => {});
  const prepareStandbyTrackRef = useRef<(currentAyahNum: number, currentPhase: 'arabic' | 'translation') => void>(() => {});

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

  // Smooth auto-scroll helper aligned with precision to top border of ayah
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

  // Sync with Android Lock Screen & Notification Center (MediaSession API)
  const syncMediaSession = useCallback(
    (ayahNum: number, phase: 'arabic' | 'translation') => {
      if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

      const qari = AVAILABLE_QARIS.find((q) => q.id === selectedQariRef.current) || AVAILABLE_QARIS[0];
      const title =
        phase === 'translation'
          ? `Terjemahan Indo — QS ${surahNumberRef.current}:${ayahNum}`
          : `QS ${surahNumberRef.current}:${ayahNum} — ${qari.name}`;
      const artist = phase === 'translation' ? 'Al-Qur\'an Terjemahan Indonesia' : qari.name;

      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title,
          artist,
          album: `Qurabic (Indo) Surat ${surahNumberRef.current}`,
          artwork: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => {
          getActiveDeck()?.play().catch(() => {});
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          getActiveDeck()?.pause();
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          const cur = activeAyahRef.current;
          if (cur && cur > 1) playAyahInternalRef.current(cur - 1);
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          const cur = activeAyahRef.current;
          if (cur && cur < totalAyahsRef.current) playAyahInternalRef.current(cur + 1);
        });
      } catch {
        // MediaSession unsupported or threw in test env
      }
    },
    [getActiveDeck]
  );

  // Calculates the immediate next track and buffers it in standby deck
  const prepareStandbyTrack = useCallback(
    (currentAyahNum: number, currentPhase: 'arabic' | 'translation') => {
      const mode = handsfreeModeRef.current;
      const surah = surahNumberRef.current;
      const total = totalAyahsRef.current;
      const repeat = repeatModeRef.current;
      const voiceMode = translationVoiceModeRef.current;
      const isHumanAvail = isHumanTranslationAvailable(surah);

      let nextAyah = currentAyahNum;
      let nextPhase: 'arabic' | 'translation' = 'arabic';
      let shouldPrepare = true;

      if (currentPhase === 'arabic') {
        if (mode === 'normal') {
          // If in normal handsfree mode and translation is available
          if ((voiceMode === 'human' && isHumanAvail) || voiceMode === 'tts') {
            nextPhase = 'translation';
            nextAyah = currentAyahNum;
          } else {
            // No translation available for this surah in human mode -> skip directly to next ayah Arabic!
            if (repeat === 'ayah') {
              nextAyah = currentAyahNum;
              nextPhase = 'arabic';
            } else if (currentAyahNum < total) {
              nextAyah = currentAyahNum + 1;
              nextPhase = 'arabic';
            } else if (repeat === 'surah') {
              nextAyah = 1;
              nextPhase = 'arabic';
            } else {
              shouldPrepare = false;
            }
          }
        } else {
          // Mode is 'off' or 'reverse' (Arabic is the concluding phase)
          if (repeat === 'ayah') {
            nextAyah = currentAyahNum;
            nextPhase = mode === 'reverse' ? 'translation' : 'arabic';
          } else if (currentAyahNum < total) {
            nextAyah = currentAyahNum + 1;
            nextPhase = mode === 'reverse' ? 'translation' : 'arabic';
          } else if (repeat === 'surah') {
            nextAyah = 1;
            nextPhase = mode === 'reverse' ? 'translation' : 'arabic';
          } else {
            shouldPrepare = false;
          }
        }
      } else {
        // Current phase is translation
        if (mode === 'reverse') {
          // In reverse mode, Arabic follows translation for the SAME ayah
          nextPhase = 'arabic';
          nextAyah = currentAyahNum;
        } else {
          // In normal mode, next ayah Arabic follows translation
          if (repeat === 'ayah') {
            nextAyah = currentAyahNum;
            nextPhase = 'arabic';
          } else if (currentAyahNum < total) {
            nextAyah = currentAyahNum + 1;
            nextPhase = 'arabic';
          } else if (repeat === 'surah') {
            nextAyah = 1;
            nextPhase = 'arabic';
          } else {
            shouldPrepare = false;
          }
        }
      }

      if (!shouldPrepare) {
        queuedStandbyRef.current = null;
        return;
      }

      // Resolve candidate URLs for the next track
      let candidates: string[] = [];
      if (nextPhase === 'arabic') {
        candidates = getAudioCandidateUrls(surah, nextAyah, selectedQariRef.current);
        const cached = getCachedAudioUrl(candidates[0]);
        if (cached) candidates.unshift(cached);
      } else {
        const transText = getAyahTranslationRef.current?.(nextAyah);
        const effectiveVoice = voiceMode === 'off' ? 'human' : voiceMode;
        candidates = getTranslationAudioCandidateUrls(surah, nextAyah, transText, effectiveVoice);
        const cached = getCachedTranslationUrl(surah, nextAyah, transText, effectiveVoice);
        if (cached) candidates.unshift(cached);
      }

      if (candidates.length === 0) {
        queuedStandbyRef.current = null;
        return;
      }

      // Queue and buffer in the standby deck
      const standby = getStandbyDeck();
      if (standby) {
        standby.pause();
        standby.src = candidates[0];
        standby.preload = 'auto';
        standby.load();
      }

      queuedStandbyRef.current = {
        ayahNumber: nextAyah,
        phase: nextPhase,
        candidates,
        candidateIndex: 0,
      };
    },
    [getStandbyDeck]
  );

  prepareStandbyTrackRef.current = prepareStandbyTrack;

  // Helper to advance after Ayah cycle completes (either Arabic audio only or Arabic + Translation)
  const advanceAfterAyah = useCallback(() => {
    const current = activeAyahRef.current;
    const total = totalAyahsRef.current;
    const mode = repeatModeRef.current;
    const isAutoNext = autoNextRef.current;

    if (current === null) return;

    if (mode === 'ayah') {
      playAyahInternalRef.current(current);
      return;
    }

    if (current < total) {
      if (isAutoNext) {
        playAyahInternalRef.current(current + 1);
      } else {
        setPlaybackState('paused');
      }
      return;
    }

    if (current >= total) {
      if (mode === 'surah') {
        playAyahInternalRef.current(1);
      } else {
        setPlaybackState('ended');
      }
    }
  }, []);

  advanceAfterAyahRef.current = advanceAfterAyah;

  // Failover to next candidate in active deck
  const tryNextActiveCandidate = useCallback(
    (reqId: number, ayahNum: number) => {
      const nextIndex = activeCandidateIndexRef.current + 1;
      const urls = activeCandidateUrlsRef.current;
      const activeDeck = getActiveDeck();

      if (activeDeck && nextIndex < urls.length) {
        activeCandidateIndexRef.current = nextIndex;
        const targetUrl = urls[nextIndex];
        const cached = getCachedAudioUrl(targetUrl);
        activeDeck.src = cached || targetUrl;
        activeDeck.load();
        activeDeck.play().catch(() => {});
      } else {
        clearWatchdog();
        if (activePhaseRef.current === 'translation') {
          activePhaseRef.current = 'arabic';
          setIsReadingTranslation(false);
          if (handsfreeModeRef.current === 'reverse') {
            playArabicInternalRef.current(ayahNum);
          } else {
            advanceAfterAyahRef.current();
          }
          return;
        }
        setPlaybackState('error');
        setError('Koneksi audio tilawah terputus. Ketuk untuk mencoba lagi.');
      }
    },
    [getActiveDeck, clearWatchdog]
  );

  // Initialize Dual-Deck HTMLAudioElements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const deck0 = new Audio();
    deck0.preload = 'auto';
    const deck1 = new Audio();
    deck1.preload = 'auto';

    deck0Ref.current = deck0;
    deck1Ref.current = deck1;

    const attachDeckListeners = (deck: HTMLAudioElement, deckIndex: 0 | 1) => {
      const isDeckActive = () => activeDeckIndexRef.current === deckIndex;

      const handlePlay = () => {
        if (!isDeckActive()) return;
        clearWatchdog();
        setPlaybackState('playing');
        setError(null);
      };

      const handlePause = () => {
        if (!isDeckActive()) return;
        if (deck.ended) {
          setPlaybackState('ended');
        } else {
          setPlaybackState('paused');
        }
      };

      const handleTimeUpdate = () => {
        if (!isDeckActive()) return;
        clearWatchdog();
        setCurrentTime(deck.currentTime);
        if (deck.duration && !isNaN(deck.duration)) {
          setDuration(deck.duration);
        }
      };

      const handleLoadedMetadata = () => {
        if (!isDeckActive()) return;
        if (deck.duration && !isNaN(deck.duration)) {
          setDuration(deck.duration);
        }
      };

      const handleWaiting = () => {
        if (!isDeckActive()) return;
        setPlaybackState('loading');
      };

      const handleCanPlay = () => {
        if (!isDeckActive()) return;
        clearWatchdog();
        if (deck.paused) {
          setPlaybackState((prev) => (prev === 'loading' ? 'paused' : prev));
        } else {
          setPlaybackState('playing');
        }
      };

      const handleError = () => {
        if (!isDeckActive()) return;
        const activeAyah = activeAyahRef.current;
        if (activeAyah !== null) {
          tryNextActiveCandidate(requestIdRef.current, activeAyah);
        } else {
          setPlaybackState('error');
          setError('Audio tilawah tidak tersedia untuk ayat ini');
        }
      };

      // Gapless Track Completion Transition Handler
      const handleEnded = () => {
        if (!isDeckActive()) return;

        const current = activeAyahRef.current;
        if (current === null) return;

        // Surah-level reciter handling (e.g. Syaikh Muhammad Al-Luhaidan)
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

        const queued = queuedStandbyRef.current;

        // If standby deck is armed with next track -> SWAP DECKS FOR ZERO-DELAY TRANSITION!
        if (queued) {
          queuedStandbyRef.current = null;
          activeDeckIndexRef.current = activeDeckIndexRef.current === 0 ? 1 : 0;
          const nextActiveDeck = getActiveDeck();

          activePhaseRef.current = queued.phase;
          setIsReadingTranslation(queued.phase === 'translation');
          activeAyahRef.current = queued.ayahNumber;
          setCurrentAyah(queued.ayahNumber);
          activeCandidateUrlsRef.current = queued.candidates;
          activeCandidateIndexRef.current = queued.candidateIndex;

          if (queued.phase === 'arabic') {
            scrollToAyah(queued.ayahNumber);
          }
          syncMediaSession(queued.ayahNumber, queued.phase);

          // Instant 0ms play since standby deck was already buffering!
          if (nextActiveDeck) {
            nextActiveDeck.currentTime = 0;
            const playPromise = nextActiveDeck.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => {
                  setPlaybackState('playing');
                  setError(null);
                })
                .catch((err) => {
                  if (err.name !== 'AbortError') {
                    console.warn(`[Qurabic Audio] Standby play failed, attempting recover:`, err);
                    tryNextActiveCandidate(requestIdRef.current, queued.ayahNumber);
                  }
                });
            }
          }

          // Prime the other deck with the subsequent track immediately
          prepareStandbyTrackRef.current(queued.ayahNumber, queued.phase);
          return;
        }

        // If no preloaded track (e.g. reached end of surah without repeat)
        advanceAfterAyahRef.current();
      };

      deck.addEventListener('play', handlePlay);
      deck.addEventListener('pause', handlePause);
      deck.addEventListener('timeupdate', handleTimeUpdate);
      deck.addEventListener('loadedmetadata', handleLoadedMetadata);
      deck.addEventListener('waiting', handleWaiting);
      deck.addEventListener('canplay', handleCanPlay);
      deck.addEventListener('error', handleError);
      deck.addEventListener('ended', handleEnded);

      return () => {
        deck.removeEventListener('play', handlePlay);
        deck.removeEventListener('pause', handlePause);
        deck.removeEventListener('timeupdate', handleTimeUpdate);
        deck.removeEventListener('loadedmetadata', handleLoadedMetadata);
        deck.removeEventListener('waiting', handleWaiting);
        deck.removeEventListener('canplay', handleCanPlay);
        deck.removeEventListener('error', handleError);
        deck.removeEventListener('ended', handleEnded);
      };
    };

    const cleanup0 = attachDeckListeners(deck0, 0);
    const cleanup1 = attachDeckListeners(deck1, 1);

    return () => {
      cleanup0();
      cleanup1();
      clearWatchdog();
      deck0.pause();
      deck0.src = '';
      deck1.pause();
      deck1.src = '';
    };
  }, [clearWatchdog, getActiveDeck, scrollToAyah, syncMediaSession, tryNextActiveCandidate]);

  // When selected surah changes, reset audio cleanly
  useEffect(() => {
    requestIdRef.current++;
    clearWatchdog();
    activePhaseRef.current = 'arabic';
    setIsReadingTranslation(false);
    queuedStandbyRef.current = null;

    if (deck0Ref.current) {
      deck0Ref.current.pause();
      deck0Ref.current.src = '';
    }
    if (deck1Ref.current) {
      deck1Ref.current.pause();
      deck1Ref.current.src = '';
    }

    setCurrentAyah(null);
    setPlaybackState('idle');
    setCurrentTime(0);
    setDuration(0);
    setError(null);

    // Warm-up Ayah 1 & 2 immediately on surah selection
    preloadUpcomingAyahs(
      surahNumber,
      1,
      totalAyahs,
      getAyahTranslationRef.current,
      selectedQariRef.current,
      translationVoiceModeRef.current
    );
  }, [surahNumber, totalAyahs, clearWatchdog]);

  // Play Arabic recitation on active deck
  const playArabicInternal = useCallback(
    (ayahNum: number) => {
      const activeDeck = getActiveDeck();
      if (!activeDeck) return;

      activePhaseRef.current = 'arabic';
      setIsReadingTranslation(false);
      const reqId = ++requestIdRef.current;

      const candidates = getAudioCandidateUrls(
        surahNumberRef.current,
        ayahNum,
        selectedQariRef.current
      );
      const cached = getCachedAudioUrl(candidates[0]);
      if (cached) candidates.unshift(cached);

      activeCandidateUrlsRef.current = candidates;
      activeCandidateIndexRef.current = 0;

      setCurrentAyah(ayahNum);
      setPlaybackState('loading');
      setError(null);
      setCurrentTime(0);
      setDuration(0);

      const targetUrl = candidates[0];
      activeDeck.src = targetUrl;
      activeDeck.load();

      const playPromise = activeDeck.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (requestIdRef.current !== reqId) return;
            clearWatchdog();
            setPlaybackState('playing');
            setError(null);
            scrollToAyah(ayahNum);
            syncMediaSession(ayahNum, 'arabic');
          })
          .catch((err) => {
            if (requestIdRef.current !== reqId) return;
            if (err.name === 'NotAllowedError') {
              clearWatchdog();
              setPlaybackState('paused');
            } else if (err.name !== 'AbortError') {
              tryNextActiveCandidate(reqId, ayahNum);
            }
          });
      }

      // Proactively buffer the next track onto standby deck
      prepareStandbyTrack(ayahNum, 'arabic');

      // Preload next upcoming ayahs in background
      preloadUpcomingAyahs(
        surahNumberRef.current,
        ayahNum,
        totalAyahsRef.current,
        getAyahTranslationRef.current,
        selectedQariRef.current,
        translationVoiceModeRef.current
      );
    },
    [getActiveDeck, clearWatchdog, scrollToAyah, syncMediaSession, tryNextActiveCandidate, prepareStandbyTrack]
  );

  playArabicInternalRef.current = playArabicInternal;

  // Play Indonesian translation audio on active deck
  const playTranslationInternal = useCallback(
    (ayahNum: number) => {
      const activeDeck = getActiveDeck();
      if (!activeDeck) return;

      activePhaseRef.current = 'translation';
      setIsReadingTranslation(true);
      setCurrentAyah(ayahNum);
      scrollToAyah(ayahNum);

      const reqId = ++requestIdRef.current;
      const translationText = getAyahTranslationRef.current?.(ayahNum);
      const voiceMode =
        translationVoiceModeRef.current === 'off' ? 'human' : translationVoiceModeRef.current;
      const candidates = getTranslationAudioCandidateUrls(
        surahNumberRef.current,
        ayahNum,
        translationText,
        voiceMode
      );

      const cached = getCachedTranslationUrl(
        surahNumberRef.current,
        ayahNum,
        translationText,
        voiceMode
      );
      if (cached) candidates.unshift(cached);

      activeCandidateUrlsRef.current = candidates;
      activeCandidateIndexRef.current = 0;

      // If no translation candidates available (e.g. human mode on unrecorded surah), advance directly
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

      const targetUrl = candidates[0];
      activeDeck.src = targetUrl;
      activeDeck.load();

      const playPromise = activeDeck.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (requestIdRef.current !== reqId) return;
            clearWatchdog();
            setPlaybackState('playing');
            setError(null);
            syncMediaSession(ayahNum, 'translation');
          })
          .catch((err) => {
            if (requestIdRef.current !== reqId) return;
            if (err.name === 'NotAllowedError') {
              clearWatchdog();
              setPlaybackState('paused');
            } else if (err.name !== 'AbortError') {
              tryNextActiveCandidate(reqId, ayahNum);
            }
          });
      }

      // Proactively buffer the next track onto standby deck
      prepareStandbyTrack(ayahNum, 'translation');
    },
    [getActiveDeck, clearWatchdog, scrollToAyah, syncMediaSession, tryNextActiveCandidate, prepareStandbyTrack]
  );

  playTranslationInternalRef.current = playTranslationInternal;

  // Core internal function to load and play an Ayah according to active Handsfree mode
  const playAyahInternal = useCallback(
    (ayahNum: number) => {
      clearWatchdog();
      cancelSpeechSynthesis();
      setIsReadingTranslation(false);

      if (handsfreeModeRef.current === 'reverse') {
        playTranslationInternal(ayahNum);
        return;
      }

      playArabicInternal(ayahNum);
    },
    [clearWatchdog, playTranslationInternal, playArabicInternal]
  );

  playAyahInternalRef.current = playAyahInternal;

  // Public: Play a specific Ayah
  const playAyah = useCallback(
    (ayahNum: number) => {
      if (ayahNum < 1 || ayahNum > totalAyahs) return;
      playAyahInternal(ayahNum);
    },
    [playAyahInternal, totalAyahs]
  );

  // Public: Toggle Play / Pause
  const togglePlayPause = useCallback(() => {
    const activeDeck = getActiveDeck();
    if (!activeDeck) return;

    const isAudioPlaying = !activeDeck.paused && activeDeck.currentTime > 0 && !activeDeck.ended;

    if (isAudioPlaying || playbackState === 'playing') {
      activeDeck.pause();
      setPlaybackState('paused');
    } else if (currentAyah !== null && activeDeck.src) {
      activeDeck.play().catch(() => {});
      setPlaybackState('playing');
    } else {
      const target = currentAyah || 1;
      playAyahInternal(target);
    }
  }, [getActiveDeck, currentAyah, playbackState, playAyahInternal]);

  // Public: Pause
  const pause = useCallback(() => {
    const activeDeck = getActiveDeck();
    if (activeDeck && playbackState === 'playing') {
      activeDeck.pause();
      setPlaybackState('paused');
    }
  }, [getActiveDeck, playbackState]);

  // Public: Resume
  const resume = useCallback(() => {
    const activeDeck = getActiveDeck();
    if (activeDeck && currentAyah !== null) {
      activeDeck.play().catch(() => {});
      setPlaybackState('playing');
    }
  }, [getActiveDeck, currentAyah]);

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

    const activeDeck = getActiveDeck();
    if (!activeDeck || currentAyah === null) return;

    if (activeDeck.currentTime > 3) {
      activeDeck.currentTime = 0;
      activeDeck.play().catch(() => {});
    } else if (currentAyah > 1) {
      playAyahInternal(currentAyah - 1);
    } else {
      activeDeck.currentTime = 0;
    }
  }, [getActiveDeck, currentAyah, playAyahInternal]);

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
          playArabicInternalRef.current(current);
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
            playArabicInternalRef.current(current);
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
  const seek = useCallback(
    (progressRatio: number) => {
      const activeDeck = getActiveDeck();
      if (!activeDeck || !activeDeck.duration || isNaN(activeDeck.duration)) return;

      const targetTime = Math.max(0, Math.min(progressRatio * activeDeck.duration, activeDeck.duration));
      activeDeck.currentTime = targetTime;
      setCurrentTime(targetTime);
    },
    [getActiveDeck]
  );

  // Public: Stop playback
  const stop = useCallback(() => {
    requestIdRef.current++;
    clearWatchdog();
    activePhaseRef.current = 'arabic';
    setIsReadingTranslation(false);
    queuedStandbyRef.current = null;

    if (deck0Ref.current) {
      deck0Ref.current.pause();
      deck0Ref.current.currentTime = 0;
      deck0Ref.current.src = '';
    }
    if (deck1Ref.current) {
      deck1Ref.current.pause();
      deck1Ref.current.currentTime = 0;
      deck1Ref.current.src = '';
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
