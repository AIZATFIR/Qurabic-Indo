'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_TRANSLATION_VOICE_MODE, getAudioCandidateUrls, getTranslationAudioCandidateUrls, getFirstAudioTrack, getNextAudioTrack, isHumanTranslationAvailable, AVAILABLE_QARIS, QariMeta, TranslationVoiceMode, TRANSLATION_VOICE_OPTIONS, TranslationVoiceOption, AudioTrack, TranslationAudioLanguage, AUDIO_STARTUP_TIMEOUT_MS, shouldRepeatVerse, VerseRepeatCount, isQuranFoundationAudioUrl } from '../api/audio';
import { getQuranFoundationRecitationAudioUrl } from '../offline/quran-content-store';
import { getCachedAudioUrl, getStoredAudioUrl, preloadNextAudioTrack, waitForPreloadedAudioUrl } from '../audio/audio-preloader';
import { getAudioProgress, getMonotonicAudioProgress, interpolateAudioProgress, shouldPublishAudioTime } from '../audio/smooth-progress';
import { registerQuranAudio } from '../audio/active-audio-registry';

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
export type RepeatMode = 'off' | 'ayah' | 'surah';
export type HandsfreeMode = 'off' | 'normal' | 'reverse';
export interface QariSelectionOptions {
  persist?: boolean;
  restartPlayback?: boolean;
}

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
  readLiveProgress: () => number;
  repeatMode: RepeatMode;
  repeatCount: VerseRepeatCount;
  autoNext: boolean;
  error: string | null;
  translationAudioUnavailable: boolean;
  // Multi-Qari Selection
  selectedQari: string;
  setSelectedQari: (qariId: string, options?: QariSelectionOptions) => void;
  currentQariMeta: QariMeta;
  availableQaris: QariMeta[];
  // Translation Voice Options
  translationVoiceMode: TranslationVoiceMode;
  setTranslationVoiceMode: (mode: TranslationVoiceMode) => void;
  translationVoiceOptions: TranslationVoiceOption[];
  isHumanTranslationAvailableForCurrentAyah: boolean;
  // Handsfree translated audio
  handsfreeMode: HandsfreeMode;
  isTranslationReadingEnabled: boolean;
  isReadingTranslation: boolean;
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
  setRepeatCount: (count: VerseRepeatCount) => void;
  cycleRepeatMode: () => void;
  setAutoNext: (enabled: boolean) => void;
  toggleAutoNext: () => void;
  seek: (progressRatio: number) => void;
  stop: () => void;
}

const officialAudioByRecitation = new Map<string, Promise<Map<string, string>>>();

async function getOfficialAyahAudioUrl(recitationId: number, surahNumber: number, ayahNumber: number): Promise<string | undefined> {
  if (recitationId === 7) {
    const syncedUrl = await getQuranFoundationRecitationAudioUrl(surahNumber, ayahNumber).catch(() => undefined);
    if (syncedUrl && isQuranFoundationAudioUrl(syncedUrl)) return syncedUrl;
  }
  const cacheKey = `${recitationId}:${surahNumber}`;
  let request = officialAudioByRecitation.get(cacheKey);
  if (!request) {
    request = fetch(`/api/qf/recitations?${new URLSearchParams({ recitation: String(recitationId), surah: String(surahNumber) })}`, { signal: AbortSignal.timeout(10_000) })
      .then(async (response) => {
        const payload = await response.json().catch(() => null) as { files?: Array<{ verseKey?: unknown; url?: unknown }> } | null;
        if (!response.ok || !Array.isArray(payload?.files)) throw new Error('Official recitation unavailable');
        return new Map(payload.files.flatMap((file) => typeof file.verseKey === 'string' && typeof file.url === 'string' && isQuranFoundationAudioUrl(file.url)
          ? [[file.verseKey, file.url] as const]
          : []));
      })
      .catch((error) => {
        officialAudioByRecitation.delete(cacheKey);
        throw error;
      });
    officialAudioByRecitation.set(cacheKey, request);
    while (officialAudioByRecitation.size > 40) {
      const oldest = officialAudioByRecitation.keys().next().value;
      if (oldest === undefined) break;
      officialAudioByRecitation.delete(oldest);
    }
  }
  return (await request).get(`${surahNumber}:${ayahNumber}`);
}

export function useQuranAudio({ surahNumber, totalAyahs, autoScroll = true, getAyahTranslation, translationLanguage = 'id' }: UseQuranAudioOptions): UseQuranAudioReturn {
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const lastTimePublishAtRef = useRef(0);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');
  const [repeatCount, setRepeatCountState] = useState<VerseRepeatCount>(3);
  const [autoNext, setAutoNextState] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [translationAudioUnavailable, setTranslationAudioUnavailable] = useState(false);
  const [selectedQari, setSelectedQariState] = useState('alafasy');
  const [availableQaris, setAvailableQaris] = useState(() => process.env.NODE_ENV === 'production'
    ? AVAILABLE_QARIS.filter((qari) => qari.qfRecitationId !== undefined)
    : AVAILABLE_QARIS);
  const [officialCatalogLoaded, setOfficialCatalogLoaded] = useState(process.env.NODE_ENV === 'production');
  const [translationVoiceMode, setTranslationVoiceModeState] = useState<TranslationVoiceMode>(DEFAULT_TRANSLATION_VOICE_MODE);
  const [handsfreeMode, setHandsfreeModeState] = useState<HandsfreeMode>('off');
  const [isReadingTranslation, setIsReadingTranslation] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastLiveProgressRef = useRef(0);
  const progressObservationRef = useRef({ value: 0, at: 0 });
  const readLiveProgress = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return 0;
    const now = performance.now();
    const current = getAudioProgress(audio.currentTime, audio.duration);
    const progress = interpolateAudioProgress(
      current,
      audio.duration,
      audio.playbackRate,
      now,
      !audio.paused && !audio.ended,
      progressObservationRef.current,
    );
    lastLiveProgressRef.current = getMonotonicAudioProgress(progress, lastLiveProgressRef.current);
    return lastLiveProgressRef.current;
  }, []);
  const trackRef = useRef<AudioTrack | null>(null);
  const completedVersePlaysRef = useRef({ ayah: 0, count: 0 });
  const requestRef = useRef(0);
  const restartOnResumeRef = useRef(false);
  const wantsPlaybackRef = useRef(false);
  const cleanupTrackRef = useRef<() => void>(() => {});
  const startTrackRef = useRef<(track: AudioTrack) => void>(() => {});
  const playAyahRef = useRef<(ayah: number) => void>(() => {});
  const completeTrackRef = useRef<() => void>(() => {});
  const previousTranslationLanguageRef = useRef(translationLanguage);
  const prefsRef = useRef({ surahNumber, totalAyahs, repeatMode, repeatCount, autoNext, handsfreeMode, selectedQari, availableQaris, officialCatalogLoaded, translationVoiceMode: DEFAULT_TRANSLATION_VOICE_MODE, getAyahTranslation, autoScroll, translationLanguage });
  prefsRef.current = { surahNumber, totalAyahs, repeatMode, repeatCount, autoNext, handsfreeMode, selectedQari, availableQaris, officialCatalogLoaded, translationVoiceMode, getAyahTranslation, autoScroll, translationLanguage };

  const scrollToAyah = useCallback((ayah: number) => {
    if (!prefsRef.current.autoScroll) return;
    const element = document.getElementById(`ayah-${ayah}`);
    if (!element) return;
    const header = document.getElementById('reader-headbar');
    const top = element.getBoundingClientRect().top + window.scrollY - (header?.getBoundingClientRect().bottom ?? 0);
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }, []);

  const completeTrack = useCallback(() => {
    const track = trackRef.current;
    if (!track || !wantsPlaybackRef.current) return;
    const prefs = prefsRef.current;
    const qari = prefs.availableQaris.find(q => q.id === prefs.selectedQari);
    if (qari?.isSurahLevel) {
      if (prefs.repeatMode === 'surah') startTrackRef.current({ ayahNumber: 1, phase: 'arabic' });
      else { wantsPlaybackRef.current = false; setPlaybackState('ended'); }
      return;
    }
    const verseCycleEnded = prefs.handsfreeMode === 'normal'
      ? track.phase === 'translation'
      : track.phase === 'arabic';
    if (prefs.repeatMode === 'ayah' && verseCycleEnded) {
      if (completedVersePlaysRef.current.ayah !== track.ayahNumber) completedVersePlaysRef.current = { ayah: track.ayahNumber, count: 0 };
      completedVersePlaysRef.current.count += 1;
      if (shouldRepeatVerse(completedVersePlaysRef.current.count, prefs.repeatCount)) {
        startTrackRef.current(getFirstAudioTrack(prefs.surahNumber, track.ayahNumber, prefs.handsfreeMode, prefs.translationLanguage, prefs.translationVoiceMode));
        return;
      }
      completedVersePlaysRef.current = { ayah: 0, count: 0 };
      const nextAfterRepeat = getNextAudioTrack({ ...prefs, ...track, repeatMode: 'off' });
      if (nextAfterRepeat) startTrackRef.current(nextAfterRepeat);
      else {
        wantsPlaybackRef.current = false;
        setIsReadingTranslation(false);
        setPlaybackState(track.ayahNumber >= prefs.totalAyahs ? 'ended' : 'paused');
      }
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
    lastLiveProgressRef.current = 0;
    progressObservationRef.current = { value: 0, at: performance.now() };
    wantsPlaybackRef.current = true;
    restartOnResumeRef.current = false;
    trackRef.current = track;
    setCurrentAyah(track.ayahNumber);
    setIsReadingTranslation(track.phase === 'translation');
    setCurrentTime(0);
    setDuration(0);
    lastTimePublishAtRef.current = 0;
    setError(null);
    setPlaybackState('loading');
    scrollToAyah(track.ayahNumber);
    const prefs = prefsRef.current;
    let candidates = track.phase === 'translation'
      ? getTranslationAudioCandidateUrls(prefs.surahNumber, track.ayahNumber, undefined, prefs.translationVoiceMode, prefs.translationLanguage)
      : getAudioCandidateUrls(prefs.surahNumber, track.ayahNumber, prefs.selectedQari);
    const selectedQari = prefs.availableQaris.find((qari) => qari.id === prefs.selectedQari);
    const useOfficialQfAudio = Boolean(selectedQari?.qfRecitationId && (prefs.officialCatalogLoaded || prefs.selectedQari.startsWith('qf-')));
    if (track.phase === 'arabic' && useOfficialQfAudio) candidates = [];
    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let failedIndex = -1;
    const isCurrent = () => requestRef.current === request;
    const clearTimer = () => { if (timer) clearTimeout(timer); timer = undefined; };
    const armTimer = () => {
      // Repeated `waiting` events must not keep extending a stalled track forever.
      if (timer) return;
      const timeoutMs = track.phase === 'translation' ? AUDIO_STARTUP_TIMEOUT_MS.translation : AUDIO_STARTUP_TIMEOUT_MS.arabic;
      timer = setTimeout(() => { if (isCurrent() && wantsPlaybackRef.current) failCandidate(); }, timeoutMs);
    };
    const missingTranslation = () => {
      setTranslationAudioUnavailable(true);
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
      setError('RECITATION_UNAVAILABLE');
    };
    const loadCandidate = async () => {
      if (!isCurrent()) return;
      const candidateIndex = index;
      const candidateUrl = candidates[candidateIndex];
      let source = getCachedAudioUrl(candidateUrl);
      if (!source) source = await waitForPreloadedAudioUrl(candidateUrl, 1200);
      if (!source) source = await getStoredAudioUrl(candidateUrl);
      if (!isCurrent() || candidateIndex !== index || !wantsPlaybackRef.current) return;
      audio.src = source || candidateUrl;
      audio.load();
      armTimer();
      audio.play()?.then(() => {
        if (!isCurrent() || candidateIndex !== index) return;
        if (!wantsPlaybackRef.current) { audio.pause(); return; }
        clearTimer();
        setPlaybackState('playing');
      }).catch((err: DOMException) => {
        if (!isCurrent() || candidateIndex !== index || !wantsPlaybackRef.current) return;
        if (err.name === 'NotAllowedError') { clearTimer(); wantsPlaybackRef.current = false; setPlaybackState('paused'); setError('AUDIO_AUTOPLAY_BLOCKED'); }
        else if (err.name !== 'AbortError') failCandidate();
      });
    };
    const syncAudioTime = () => {
      if (Number.isFinite(audio.currentTime)) setCurrentTime(audio.currentTime);
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onPlaying = () => { if (isCurrent() && wantsPlaybackRef.current) { clearTimer(); syncAudioTime(); setError(null); if (track.phase === 'translation') setTranslationAudioUnavailable(false); setPlaybackState('playing'); } };
    const onPause = () => { if (isCurrent() && !audio.ended) { clearTimer(); syncAudioTime(); setPlaybackState('paused'); } };
    const onWaiting = () => { if (isCurrent() && wantsPlaybackRef.current) { syncAudioTime(); setPlaybackState('loading'); armTimer(); } };
    const onTime = () => {
      if (!isCurrent()) return;
      const now = performance.now();
      if (shouldPublishAudioTime(now, lastTimePublishAtRef.current)) {
        lastTimePublishAtRef.current = now;
        setCurrentTime(audio.currentTime);
      }
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
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
    const loadTrack = () => {
      if (!candidates.length) {
        if (track.phase === 'translation') missingTranslation();
        else { wantsPlaybackRef.current = false; setPlaybackState('error'); setError('RECITATION_UNAVAILABLE'); }
        return;
      }
      loadCandidate();
    };
    if (track.phase === 'arabic' && !navigator.onLine && (selectedQari?.quranComSlug === 'Alafasy' || selectedQari?.qfRecitationId === 7)) {
      const independentCandidates = candidates.filter(candidate => !isQuranFoundationAudioUrl(candidate));
      void getQuranFoundationRecitationAudioUrl(prefs.surahNumber, track.ayahNumber).then((syncedUrl) => {
        if (!isCurrent() || !wantsPlaybackRef.current) return;
        candidates = selectedQari?.qfRecitationId === 7 ? (syncedUrl ? [syncedUrl] : []) : [...(syncedUrl ? [syncedUrl] : []), ...independentCandidates];
        loadTrack();
      }).catch(() => {
        candidates = independentCandidates;
        loadTrack();
      });
    } else if (track.phase === 'arabic' && useOfficialQfAudio && selectedQari?.qfRecitationId) {
      getOfficialAyahAudioUrl(selectedQari.qfRecitationId, prefs.surahNumber, track.ayahNumber)
        .then((audioUrl) => {
          if (!isCurrent() || !wantsPlaybackRef.current) return;
          if (!audioUrl) throw new Error('Official verse audio unavailable');
          candidates = [audioUrl];
          loadTrack();
        })
        .catch(() => {
          if (!isCurrent() || !wantsPlaybackRef.current) return;
          wantsPlaybackRef.current = false;
          setPlaybackState('error');
          setError('RECITATION_UNAVAILABLE');
        });
    } else {
      loadTrack();
    }
    if (!useOfficialQfAudio) preloadNextAudioTrack({
      surahNumber: prefs.surahNumber,
      currentAyah: track.ayahNumber,
      phase: track.phase,
      totalAyahs: prefs.totalAyahs,
      handsfreeMode: prefs.handsfreeMode,
      repeatMode: prefs.repeatMode,
      autoNext: prefs.autoNext,
      qariId: prefs.selectedQari,
      translationLanguage: prefs.translationLanguage,
      translationVoiceMode: prefs.translationVoiceMode,
    });
  }, [scrollToAyah]);
  startTrackRef.current = startTrack;

  const playAyah = useCallback((ayah: number) => {
    const prefs = prefsRef.current;
    if (ayah < 1 || ayah > prefs.totalAyahs) return;
    completedVersePlaysRef.current = { ayah: 0, count: 0 };
    setTranslationAudioUnavailable(false);
    const qari = prefs.availableQaris.find(q => q.id === prefs.selectedQari);
    startTrackRef.current(getFirstAudioTrack(prefs.surahNumber, qari?.isSurahLevel ? 1 : ayah, prefs.handsfreeMode, prefs.translationLanguage, prefs.translationVoiceMode));
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
    }).catch((err: DOMException) => {
      if (request !== requestRef.current) return;
      wantsPlaybackRef.current = false;
      setPlaybackState('paused');
      if (err.name !== 'AbortError') {
        setError(err.name === 'NotAllowedError' ? 'AUDIO_AUTOPLAY_BLOCKED' : 'AUDIO_START_FAILED');
      }
    });
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
    setTranslationAudioUnavailable(false);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    const unregisterAudio = registerQuranAudio(audio);
    audio.preload = 'auto';
    audioRef.current = audio;
    try {
      const savedQari = localStorage.getItem('qurabic_audio_qari');
      const savedQariMeta = AVAILABLE_QARIS.find((qari) => qari.id === savedQari);
      const savedQariAllowed = (process.env.NODE_ENV !== 'production' && /^qf-\d+$/.test(savedQari || ''))
        || (process.env.NODE_ENV === 'production' && savedQari === 'qf-7')
        || Boolean(savedQariMeta && (process.env.NODE_ENV !== 'production' || savedQariMeta.qfRecitationId !== undefined));
      if (savedQari && savedQariAllowed) { prefsRef.current.selectedQari = savedQari; setSelectedQariState(savedQari); }
      // Keep the last supported source choice; discard any unrecognized legacy values.
      const savedVoice = localStorage.getItem('qurabic_audio_translation_voice');
      const voice: TranslationVoiceMode = savedVoice === 'off' ? 'off' : DEFAULT_TRANSLATION_VOICE_MODE;
      setTranslationVoiceModeState(voice);
      prefsRef.current.translationVoiceMode = voice;
      localStorage.setItem('qurabic_audio_translation_voice', voice);
    } catch { /* Storage may be unavailable. */ }
    return () => { wantsPlaybackRef.current = false; requestRef.current++; cleanupTrackRef.current(); audio.pause(); audio.removeAttribute('src'); audio.load(); unregisterAudio(); audioRef.current = null; };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ language: translationLanguage });
    fetch(`/api/qf/recitations?${params}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => null) as { recitations?: Array<{ id?: unknown; reciterName?: unknown; style?: unknown; name?: unknown }> } | null;
        if (!response.ok || !Array.isArray(payload?.recitations)) throw new Error('Official recitation catalog unavailable');
        const officialQaris = payload.recitations.flatMap((item) => {
          if (!Number.isInteger(item.id) || typeof item.reciterName !== 'string' || typeof item.style !== 'string') return [];
          const displayName = typeof item.name === 'string' && item.name ? item.name : item.reciterName;
          const id = Number(item.id);
          return [{
            id: `qf-${id}`,
            name: item.reciterName,
            nameEnglish: displayName,
            arabicName: '',
            descriptionId: `${item.style} · Quran Foundation`,
            descriptionEn: `${item.style} · Quran Foundation`,
            everyAyahFolder: '',
            qfRecitationId: id,
          }];
        });
        if (!officialQaris.length) throw new Error('Official recitation catalog is empty');
        if (controller.signal.aborted) return;
        setAvailableQaris(officialQaris);
        setOfficialCatalogLoaded(true);
        prefsRef.current.availableQaris = officialQaris;
        prefsRef.current.officialCatalogLoaded = true;
        const preferredQari = officialQaris.find((qari) => qari.qfRecitationId === 7) || officialQaris[0];
        let persistedQari: string | null = null;
        try { persistedQari = localStorage.getItem('qurabic_audio_qari'); } catch { /* optional preference */ }
        const chosenQari = officialQaris.find((qari) => qari.id === prefsRef.current.selectedQari)
          || officialQaris.find((qari) => qari.id === persistedQari)
          || preferredQari;
        if (chosenQari.id !== prefsRef.current.selectedQari) {
          prefsRef.current.selectedQari = chosenQari.id;
          setSelectedQariState(chosenQari.id);
          try { localStorage.setItem('qurabic_audio_qari', chosenQari.id); } catch { /* optional preference */ }
          if (trackRef.current && wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        if (process.env.NODE_ENV === 'production') {
          const officialFallback = AVAILABLE_QARIS.filter((qari) => qari.qfRecitationId !== undefined);
          setAvailableQaris(officialFallback);
          prefsRef.current.availableQaris = officialFallback;
          setOfficialCatalogLoaded(true);
          prefsRef.current.officialCatalogLoaded = true;
          prefsRef.current.selectedQari = 'alafasy';
          setSelectedQariState('alafasy');
          try { localStorage.setItem('qurabic_audio_qari', 'alafasy'); } catch { /* optional preference */ }
        }
      });
    return () => controller.abort();
  }, [translationLanguage]);
  useEffect(() => { stop(); }, [surahNumber, totalAyahs, stop]);
  useEffect(() => {
    if (previousTranslationLanguageRef.current === translationLanguage) return;
    previousTranslationLanguageRef.current = translationLanguage;
    if (prefsRef.current.handsfreeMode === 'off' || !trackRef.current) return;
    if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
    else restartOnResumeRef.current = true;
  }, [translationLanguage]);

  const setRepeatMode = useCallback((mode: RepeatMode) => {
    if (prefsRef.current.repeatMode !== mode) completedVersePlaysRef.current = { ayah: 0, count: 0 };
    prefsRef.current.repeatMode = mode;
    setRepeatModeState(mode);
  }, []);
  const setRepeatCount = useCallback((count: VerseRepeatCount) => {
    prefsRef.current.repeatCount = count;
    setRepeatCountState(count);
  }, []);
  const setAutoNext = useCallback((enabled: boolean) => { prefsRef.current.autoNext = enabled; setAutoNextState(enabled); }, []);
  const setHandsfreeMode = useCallback((mode: HandsfreeMode) => {
    prefsRef.current.handsfreeMode = mode;
    setHandsfreeModeState(mode);
    if (mode === 'off') setTranslationAudioUnavailable(false);
    if (mode !== 'off') {
      const qari = prefsRef.current.availableQaris.find(q => q.id === prefsRef.current.selectedQari);
      if (qari?.isSurahLevel) { prefsRef.current.selectedQari = 'alafasy'; setSelectedQariState('alafasy'); }
    }
    if (trackRef.current) {
      if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
      else restartOnResumeRef.current = true;
    }
  }, []);
  const setTranslationVoiceMode = useCallback((mode: TranslationVoiceMode) => {
    const safeMode: TranslationVoiceMode = mode === 'off' ? mode : 'human';
    prefsRef.current.translationVoiceMode = safeMode;
    setTranslationVoiceModeState(safeMode);
    try { localStorage.setItem('qurabic_audio_translation_voice', safeMode); } catch { /* optional preference */ }
    if (safeMode === 'off') setHandsfreeMode('off');
    else if (trackRef.current) {
      if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
      else restartOnResumeRef.current = true;
    }
  }, [setHandsfreeMode]);
  const setSelectedQari = useCallback((qariId: string, options?: QariSelectionOptions) => {
    const qari = prefsRef.current.availableQaris.find(q => q.id === qariId);
    if (!qari) return;
    prefsRef.current.selectedQari = qariId;
    setSelectedQariState(qariId);
    if (qari.isSurahLevel) { prefsRef.current.handsfreeMode = 'off'; setHandsfreeModeState('off'); if (prefsRef.current.repeatMode === 'ayah') { prefsRef.current.repeatMode = 'off'; setRepeatModeState('off'); } }
    if (options?.persist !== false) {
      try { localStorage.setItem('qurabic_audio_qari', qariId); } catch { /* optional preference */ }
    }
    if (trackRef.current && options?.restartPlayback !== false) {
      if (wantsPlaybackRef.current) playAyahRef.current(trackRef.current.ayahNumber);
      else restartOnResumeRef.current = true;
    }
  }, []);
  const nextAyah = useCallback(() => { const ayah = trackRef.current?.ayahNumber || 0; if (ayah < prefsRef.current.totalAyahs) playAyahRef.current(ayah + 1); }, []);
  const prevAyah = useCallback(() => { const ayah = trackRef.current?.ayahNumber; if (!ayah) return; if ((audioRef.current?.currentTime || 0) > 3) playAyahRef.current(ayah); else playAyahRef.current(Math.max(1, ayah - 1)); }, []);
  const seek = useCallback((ratio: number) => { const audio = audioRef.current; if (audio && Number.isFinite(audio.duration)) { audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration; lastLiveProgressRef.current = getAudioProgress(audio.currentTime, audio.duration); progressObservationRef.current = { value: lastLiveProgressRef.current, at: performance.now() }; setCurrentTime(audio.currentTime); } }, []);
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
    const qari = availableQaris.find(q => q.id === selectedQari) || availableQaris[0] || AVAILABLE_QARIS[0];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({ title: `QS ${surahNumber}:${currentAyah}`, artist: isReadingTranslation ? (prefsRef.current.translationLanguage === 'en' ? 'English translation · human recording' : 'Terjemahan Indonesia · rekaman manusia') : (prefsRef.current.translationLanguage === 'en' ? qari.nameEnglish : qari.name), album: 'Qurabic' });
      navigator.mediaSession.setActionHandler('play', resume);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('nexttrack', nextAyah);
      navigator.mediaSession.setActionHandler('previoustrack', prevAyah);
    } catch { /* MediaSession is optional. */ }
  }, [currentAyah, surahNumber, selectedQari, isReadingTranslation, translationLanguage, resume, pause, nextAyah, prevAyah]);

  return { currentAyah, playbackState, isPlaying: playbackState === 'playing', isLoading: playbackState === 'loading', currentTime, duration, progress: readLiveProgress(), readLiveProgress, repeatMode, repeatCount, autoNext, error, translationAudioUnavailable, selectedQari, setSelectedQari, currentQariMeta: availableQaris.find(q => q.id === selectedQari) || availableQaris[0] || AVAILABLE_QARIS[0], availableQaris, translationVoiceMode, setTranslationVoiceMode, translationVoiceOptions: TRANSLATION_VOICE_OPTIONS, isHumanTranslationAvailableForCurrentAyah: currentAyah === null || isHumanTranslationAvailable(surahNumber, translationLanguage, currentAyah), handsfreeMode, isTranslationReadingEnabled: handsfreeMode !== 'off', isReadingTranslation, setHandsfreeMode, toggleTranslationReading, setTranslationReadingEnabled, playAyah, togglePlayPause, pause, resume, nextAyah, prevAyah, setRepeatMode, setRepeatCount, cycleRepeatMode, setAutoNext, toggleAutoNext, seek, stop };
}
