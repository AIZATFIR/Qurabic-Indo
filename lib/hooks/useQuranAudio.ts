'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getAudioCandidateUrls, getTranslationAudioCandidateUrls, getFirstAudioTrack, getNextAudioTrack, isHumanTranslationAvailable, AVAILABLE_QARIS, QariMeta, TranslationVoiceMode, TRANSLATION_VOICE_OPTIONS, TranslationVoiceOption, AudioTrack, TranslationAudioLanguage } from '../api/audio';
import { getCachedAudioUrl, preloadUpcomingAyahs } from '../audio/audio-preloader';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
export type RepeatMode = 'off' | 'ayah' | 'surah';
export type HandsfreeMode = 'off' | 'normal' | 'reverse';

export interface UseQuranAudioOptions {
  surahNumber: number;
  totalAyahs: number;
  autoScroll?: boolean;
  getAyahTranslation?: (ayahNumber: number) => string | undefined;
  translationLanguage?: TranslationAudioLanguage;
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

export function useQuranAudio({ surahNumber, totalAyahs, autoScroll = true, getAyahTranslation, translationLanguage = 'id' }: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');
  const [autoNext, setAutoNextState] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQari, setSelectedQariState] = useState('alafasy');
  const [translationVoiceMode, setTranslationVoiceModeState] = useState<TranslationVoiceMode>('human');
  const [handsfreeMode, setHandsfreeModeState] = useState<HandsfreeMode>('off');
  const [isReadingTranslation, setIsReadingTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<AudioTrack | null>(null);
  const requestRef = useRef(0);
  const restartOnResumeRef = useRef(false);
  const wantsPlaybackRef = useRef(false);
  const cleanupTrackRef = useRef<() => void>(() => {});
  const startTrackRef = useRef<(track: AudioTrack) => void>(() => {});
  const playAyahRef = useRef<(ayah: number) => void>(() => {});
  const completeTrackRef = useRef<() => void>(() => {});
  const previousTranslationLanguageRef = useRef(translationLanguage);
  const prefsRef = useRef({ surahNumber, totalAyahs, repeatMode, autoNext, handsfreeMode, selectedQari, translationVoiceMode, getAyahTranslation, autoScroll, translationLanguage });
  prefsRef.current = { surahNumber, totalAyahs, repeatMode, autoNext, handsfreeMode, selectedQari, translationVoiceMode, getAyahTranslation, autoScroll, translationLanguage };

  const scrollToAyah = useCallback((ayah: number) => {
    if (!prefsRef.current.autoScroll) return;
    document.getElementById(`ayah-${ayah}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const completeTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track || !wantsPlaybackRef.current) return;
    const prefs = prefsRef.current;
    const qari = AVAILABLE_QARIS.find(q => q.id === prefs.selectedQari);
    if (qari?.isSurahLevel) {
      if (prefs.repeatMode === 'surah') startTrackRef.current({ ayahNumber: 1, phase: 'arabic' });
      else { wantsPlaybackRef.current = false; setPlaybackState('ended'); }
      return;
    }
    const next = getNextAudioTrack({ ...prefs, ...track });
    if (next) startTrackRef.current(next);
    else {
      wantsPlaybackRef.current = false;
      setIsReadingTranslation(false);
      setPlaybackState(track.ayahNumber >= prefs.totalAyahs ? 'ended' : 'paused');
    }
  }, []);
  completeTrackRef.current = completeTrack;

  const startTrack = useCallback((track: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;
    const request = ++requestRef.current;
    cleanupTrackRef.current();
    audio.pause();
    wantsPlaybackRef.current = true;
    restartOnResumeRef.current = false;
    trackRef.current = track;
    setCurrentAyah(track.ayahNumber);
    setIsReadingTranslation(track.phase === 'translation');
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setPlaybackState('loading');
    scrollToAyah(track.ayahNumber);
    const prefs = prefsRef.current;
    const candidates = track.phase === 'translation'
      ? getTranslationAudioCandidateUrls(prefs.surahNumber, track.ayahNumber, undefined, 'human', prefs.translationLanguage)
      : getAudioCandidateUrls(prefs.surahNumber, track.ayahNumber, prefs.selectedQari);
    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failedIndex = -1;
    const isCurrent = () => requestRef.current === request;
    const clearTimer = () => { if (timer) clearTimeout(timer); timer = undefined; };
    const armTimer = () => {
      clearTimer();
      timer = setTimeout(() => { if (isCurrent() && wantsPlaybackRef.current) failCandidate(); }, 12000);
    };
    const missingTranslation = () => {
      cleanupTrackRef.current();
      // The Arabic half of reverse mode must still play the SAME verse.
      if (prefsRef.current.handsfreeMode === 'reverse') startTrackRef.current({ ...track, phase: 'arabic' });
      else completeTrackRef.current();
    };
    const failCandidate = () => {
      if (!isCurrent() || !wantsPlaybackRef.current || failedIndex === index) return;
      failedIndex = index;
      clearTimer();
      if (index + 1 < candidates.length) { index++; loadCandidate(); return; }
      if (track.phase === 'translation') { missingTranslation(); return; }
      wantsPlaybackRef.current = false;
      setPlaybackState('error');
      setError('Rekaman tilawah tidak dapat dimuat. Periksa koneksi lalu tekan Putar untuk mencoba lagi.');
    };
    const loadCandidate = () => {
      if (!isCurrent()) return;
      const candidateIndex = index;
      audio.src = getCachedAudioUrl(candidates[index]) || candidates[index];
      audio.load();
      armTimer();
      audio.play()?.then(() => {
        if (!isCurrent() || candidateIndex !== index) return;
        if (!wantsPlaybackRef.current) { audio.pause(); return; }
        clearTimer();
        setPlaybackState('playing');
      }).catch((err: DOMException) => {
        if (!isCurrent() || candidateIndex !== index || !wantsPlaybackRef.current) return;
        if (err.name === 'NotAllowedError') { clearTimer(); wantsPlaybackRef.current = false; setPlaybackState('paused'); }
        else if (err.name !== 'AbortError') failCandidate();
      });
    };
    const onPlaying = () => { if (isCurrent() && wantsPlaybackRef.current) { clearTimer(); setPlaybackState('playing'); } };
    const onPause = () => { if (isCurrent() && !audio.ended) { clearTimer(); setPlaybackState('paused'); } };
    const onWaiting = () => { if (isCurrent() && wantsPlaybackRef.current) { setPlaybackState('loading'); armTimer(); } };
    const onTime = () => { if (isCurrent()) { setCurrentTime(audio.currentTime); if (Number.isFinite(audio.duration)) setDuration(audio.duration); } };
    const onEnded = () => { if (isCurrent() && wantsPlaybackRef.current) { clearTimer(); completeTrackRef.current(); } };
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', failCandidate);
    cleanupTrackRef.current = () => {
      clearTimer();
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', failCandidate);
    };
    if (!candidates.length) { missingTranslation(); return; }
    loadCandidate();
    preloadUpcomingAyahs(prefs.surahNumber, track.ayahNumber, prefs.totalAyahs, prefs.getAyahTranslation, prefs.selectedQari, prefs.translationVoiceMode, prefs.translationLanguage);
  }, [scrollToAyah]);
  startTrackRef.current = startTrack;

  const playAyah = useCallback((ayah: number) => {
    const prefs = prefsRef.current;
    if (ayah < 1 || ayah > prefs.totalAyahs) return;
    const qari = AVAILABLE_QARIS.find(q => q.id === prefs.selectedQari);
    startTrackRef.current(getFirstAudioTrack(prefs.surahNumber, qari?.isSurahLevel ? 1 : ayah, prefs.handsfreeMode, prefs.translationLanguage));
  }, []);
  playAyahRef.current = playAyah;

  const pause = useCallback(() => {
    wantsPlaybackRef.current = false;
    audioRef.current?.pause();
    setPlaybackState('paused');
  }, []);
  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (restartOnResumeRef.current || !trackRef.current || audio.ended || audio.error) { playAyahRef.current(trackRef.current?.ayahNumber || 1); return; }
    wantsPlaybackRef.current = true;
    const request = requestRef.current;
    setPlaybackState('loading');
    audio.play()?.then(() => {
      if (request !== requestRef.current) return;
      if (!wantsPlaybackRef.current) { audio.pause(); return; }
      setPlaybackState('playing');
    }).catch(() => { if (request === requestRef.current) { wantsPlaybackRef.current = false; setPlaybackState('paused'); } });
  }, []);
  const togglePlayPause = useCallback(() => { if (wantsPlaybackRef.current) pause(); else resume(); }, [pause, resume]);
  const stop = useCallback(() => {
    wantsPlaybackRef.current = false;
    requestRef.current++;
    cleanupTrackRef.current();
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
    trackRef.current = null;
    restartOnResumeRef.current = false;
    setCurrentAyah(null);
    setPlaybackState('idle');
    setIsReadingTranslation(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;
    try {
      const savedQari = localStorage.getItem('qurabic_audio_qari');
      if (savedQari && AVAILABLE_QARIS.some(q => q.id === savedQari)) { prefsRef.current.selectedQari = savedQari; setSelectedQariState(savedQari); }
      // Migrate a previous synthetic voice preference to the human recording option.
      const voice = localStorage.getItem('qurabic_audio_translation_voice') === 'off' ? 'off' : 'human';
      setTranslationVoiceModeState(voice);
      prefsRef.current.translationVoiceMode = voice;
      localStorage.setItem('qurabic_audio_translation_voice', voice);
    } catch { /* Storage may be unavailable. */ }
    return () => { wantsPlaybackRef.current = false; requestRef.current++; cleanupTrackRef.current(); audio.pause(); audio.removeAttribute('src'); audio.load(); audioRef.current = null; };
  }, []);
  useEffect(() => { stop(); }, [surahNumber, totalAyahs, stop]);
  useEffect(() => {
    if (previousTranslationLanguageRef.current === translationLanguage) return;
    previousTranslationLanguageRef.current = translationLanguage;
    if (prefsRef.current.handsfreeMode === 'off' || !trackRef.current) return;
    if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
    else restartOnResumeRef.current = true;
  }, [translationLanguage]);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    prefsRef.current.repeatMode = mode;
    setRepeatModeState(mode);
  }, []);
  const setAutoNext = useCallback((enabled: boolean) => { prefsRef.current.autoNext = enabled; setAutoNextState(enabled); }, []);
  const setHandsfreeMode = useCallback((mode: HandsfreeMode) => {
    prefsRef.current.handsfreeMode = mode;
    setHandsfreeModeState(mode);
    if (mode !== 'off') {
      const qari = AVAILABLE_QARIS.find(q => q.id === prefsRef.current.selectedQari);
      if (qari?.isSurahLevel) { prefsRef.current.selectedQari = 'alafasy'; setSelectedQariState('alafasy'); }
      prefsRef.current.translationVoiceMode = 'human';
      setTranslationVoiceModeState('human');
    }
    if (trackRef.current) {
      if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
      else restartOnResumeRef.current = true;
    }
  }, []);
  const setTranslationVoiceMode = useCallback((mode: TranslationVoiceMode) => {
    const safeMode = mode === 'off' ? 'off' : 'human';
    prefsRef.current.translationVoiceMode = safeMode;
    setTranslationVoiceModeState(safeMode);
    try { localStorage.setItem('qurabic_audio_translation_voice', safeMode); } catch { /* optional preference */ }
    if (safeMode === 'off') setHandsfreeMode('off');
  }, [setHandsfreeMode]);
  const setSelectedQari = useCallback((qariId: string) => {
    const qari = AVAILABLE_QARIS.find(q => q.id === qariId);
    if (!qari) return;
    prefsRef.current.selectedQari = qariId;
    setSelectedQariState(qariId);
    if (qari.isSurahLevel) { prefsRef.current.handsfreeMode = 'off'; setHandsfreeModeState('off'); if (prefsRef.current.repeatMode === 'ayah') { prefsRef.current.repeatMode = 'off'; setRepeatModeState('off'); } }
    try { localStorage.setItem('qurabic_audio_qari', qariId); } catch { /* optional preference */ }
    if (trackRef.current) {
      if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
      else restartOnResumeRef.current = true;
    }
  }, []);
  const nextAyah = useCallback(() => { const ayah = trackRef.current?.ayahNumber || 0; if (ayah < prefsRef.current.totalAyahs) playAyahRef.current(ayah + 1); }, []);
  const prevAyah = useCallback(() => { const ayah = trackRef.current?.ayahNumber; if (!ayah) return; if ((audioRef.current?.currentTime || 0) > 3) playAyahRef.current(ayah); else playAyahRef.current(Math.max(1, ayah - 1)); }, []);
  const seek = useCallback((ratio: number) => { const audio = audioRef.current; if (audio && Number.isFinite(audio.duration)) { audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration; setCurrentTime(audio.currentTime); } }, []);
  const cycleRepeatMode = useCallback(() => setRepeatMode(prefsRef.current.repeatMode === 'off' ? 'ayah' : prefsRef.current.repeatMode === 'ayah' ? 'surah' : 'off'), [setRepeatMode]);
  const toggleAutoNext = useCallback(() => setAutoNext(!prefsRef.current.autoNext), [setAutoNext]);
  const toggleTranslationReading = useCallback(() => setHandsfreeMode(prefsRef.current.handsfreeMode === 'off' ? 'normal' : 'off'), [setHandsfreeMode]);
  const setTranslationReadingEnabled = useCallback((enabled: boolean) => setHandsfreeMode(enabled ? 'normal' : 'off'), [setHandsfreeMode]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, button, a, [contenteditable="true"]')) return;
      if (event.code === 'Space') { event.preventDefault(); togglePlayPause(); }
      else if (event.code === 'ArrowRight' && trackRef.current) { event.preventDefault(); nextAyah(); }
      else if (event.code === 'ArrowLeft' && trackRef.current) { event.preventDefault(); prevAyah(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [togglePlayPause, nextAyah, prevAyah]);
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentAyah) return;
    const qari = AVAILABLE_QARIS.find(q => q.id === selectedQari) || AVAILABLE_QARIS[0];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: `QS ${surahNumber}:${currentAyah}`, artist: isReadingTranslation ? (prefsRef.current.translationLanguage === 'en' ? 'English translation · Sahih International' : 'Terjemahan Indonesia') : qari.name, album: 'Qurabic' });
      navigator.mediaSession.setActionHandler('play', resume);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('nexttrack', nextAyah);
      navigator.mediaSession.setActionHandler('previoustrack', prevAyah);
    } catch { /* MediaSession is optional. */ }
  }, [currentAyah, surahNumber, selectedQari, isReadingTranslation, translationLanguage, resume, pause, nextAyah, prevAyah]);

  return { currentAyah, playbackState, isPlaying: playbackState === 'playing', isLoading: playbackState === 'loading', currentTime, duration, progress: duration > 0 ? Math.min(1, currentTime / duration) : 0, repeatMode, autoNext, error, selectedQari, setSelectedQari, currentQariMeta: AVAILABLE_QARIS.find(q => q.id === selectedQari) || AVAILABLE_QARIS[0], availableQaris: AVAILABLE_QARIS, translationVoiceMode, setTranslationVoiceMode, translationVoiceOptions: TRANSLATION_VOICE_OPTIONS, isHumanTranslationAvailableForCurrentSurah: isHumanTranslationAvailable(surahNumber, translationLanguage), handsfreeMode, isTranslationReadingEnabled: handsfreeMode !== 'off', isReadingTranslation, translationSpeechSupported: true, setHandsfreeMode, toggleTranslationReading, setTranslationReadingEnabled, playAyah, togglePlayPause, pause, resume, nextAyah, prevAyah, setRepeatMode, cycleRepeatMode, setAutoNext, toggleAutoNext, seek, stop };
}
