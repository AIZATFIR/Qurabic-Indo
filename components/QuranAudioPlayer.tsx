'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Loader2, Settings2, ChevronDown, ChevronUp, Headphones, Download, Trash2 } from 'lucide-react';
import { UseQuranAudioReturn, HandsfreeMode, RepeatMode } from '@/lib/hooks/useQuranAudio';
import { useLanguage } from '@/lib/context/LanguageContext';
import { cacheAudioForOffline, deleteCachedAudioForUrl, preloadTranslationAudio } from '@/lib/audio/audio-preloader';
import { fetchQuranFoundationRecitationAudioUrls, getQuranFoundationRecitationAudioUrls } from '@/lib/offline/quran-content-store';
import { isQuranFoundationAudioUrl } from '@/lib/api/audio';
import { getSurahByNumber } from '@/lib/data/surah-list';

type PlayerMode = 'expanded' | 'compact' | 'hidden';

interface QuranAudioPlayerProps {
  audio: UseQuranAudioReturn;
  surahNameIndo: string;
  surahNameArabic: string;
  surahNumber: number;
  totalAyahs: number;
  focusMode?: boolean;
  initialMode?: 'expanded' | 'compact' | 'hidden';
}

export default function QuranAudioPlayer({ audio, surahNameIndo, surahNameArabic, surahNumber, totalAyahs, focusMode = false, initialMode = 'expanded' }: QuranAudioPlayerProps) {
  const { language, t } = useLanguage();
  const surahDisplayName = language === 'en' ? getSurahByNumber(surahNumber)?.transliteration || surahNameIndo : surahNameIndo;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState<PlayerMode>(initialMode);
  const [offlineStatus, setOfflineStatus] = useState<'idle' | 'saving' | 'deleting' | 'saved' | 'partial' | 'deleted' | 'cancelled' | 'error' | 'deleteError'>('idle');
  const [downloadProgress, setDownloadProgress] = useState({ done: 0, total: 0 });
  const stopAfterCurrentAyahRef = useRef(false);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressThumbRef = useRef<HTMLSpanElement>(null);
  const { currentAyah, playbackState, isPlaying, isLoading, isReadingTranslation, translationAudioUnavailable, handsfreeMode, currentQariMeta, readLiveProgress } = audio;
  const currentTranslationUnavailable = handsfreeMode !== 'off' && currentAyah !== null && !audio.isHumanTranslationAvailableForCurrentAyah;
  const offlineDownloadSupported = (currentQariMeta.quranComSlug === 'Alafasy' || currentQariMeta.qfRecitationId === 7) && !currentQariMeta.isSurahLevel;
  useEffect(() => {
    if (focusMode && playerMode === 'expanded') setPlayerMode('compact');
  }, [focusMode, playerMode]);
  useEffect(() => {
    if (!isPlaying || playerMode !== 'expanded') return;
    let frame = 0;
    const updateProgress = () => {
      const progress = readLiveProgress();
      if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${progress})`;
      if (progressThumbRef.current) progressThumbRef.current.style.transform = `translateX(${progress * 100}%)`;
      frame = window.requestAnimationFrame(updateProgress);
    };
    frame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [readLiveProgress, isPlaying, playerMode]);

  useEffect(() => {
    if (isPlaying && playerMode === 'expanded') return;
    const progress = audio.progress;
    if (progressFillRef.current) progressFillRef.current.style.transform = `scaleX(${progress})`;
    if (progressThumbRef.current) progressThumbRef.current.style.transform = `translateX(${progress * 100}%)`;
  }, [audio.progress, isPlaying, playerMode]);

  if (playbackState === 'idle' && currentAyah === null) return null;
  const formatTime = (seconds: number) => Number.isFinite(seconds) && seconds >= 0 ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
  const repeatLabel = audio.repeatMode === 'ayah' ? t(`Ayat · ${audio.repeatCount || '∞'}×`, `Verse · ${audio.repeatCount || '∞'}×`) : audio.repeatMode === 'surah' ? t('Surat', 'Surah') : t('Mati', 'Off');
  const qariDescription = (qari: typeof currentQariMeta) => t(qari.descriptionId, qari.descriptionEn);
  const toggleLabel = isPlaying || isLoading ? t('Jeda', 'Pause') : t('Putar', 'Play');
  const audioErrorText = audio.error === 'AUDIO_AUTOPLAY_BLOCKED'
    ? t('Browser memblokir putar otomatis. Tekan Putar untuk memulai audio.', 'Your browser blocked automatic playback. Press Play to start audio.')
    : audio.error === 'RECITATION_UNAVAILABLE'
      ? t('Rekaman tilawah tidak dapat dimuat. Periksa koneksi lalu tekan Putar untuk mencoba lagi.', 'The recitation could not be loaded. Check your connection and press Play to try again.')
      : t('Audio tidak dapat dimulai. Periksa koneksi, lalu tekan Putar.', 'Audio could not start. Check your connection, then press Play to retry.');
  const controlClass = 'inline-flex min-h-11 min-w-11 items-center justify-center text-ink-secondary hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40';
  const selectClass = 'min-h-11 w-full border-b border-hairline bg-canvas-surface py-2 text-sm text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';
  const warmCurrentTranslation = () => {
    if (!currentAyah) return;
    void preloadTranslationAudio(surahNumber, currentAyah, undefined, audio.translationVoiceMode, language).catch(() => {});
  };

  const cacheAyahAudio = async (
    ayahNumber: number,
    targetSurah = surahNumber,
    qariId = audio.selectedQari,
    syncedAudioUrls?: Record<number, string>,
  ) => {
    const qari = audio.availableQaris.find((option) => option.id === qariId);
    if ((qari?.quranComSlug !== 'Alafasy' && qari?.qfRecitationId !== 7) || qari.isSurahLevel) {
      throw new Error('Offline saving is unavailable for this reciter source');
    }
    const cachedUrls = syncedAudioUrls || await getQuranFoundationRecitationAudioUrls(targetSurah);
    const audioUrls = Object.keys(cachedUrls).length ? cachedUrls : await fetchQuranFoundationRecitationAudioUrls(targetSurah, qari?.qfRecitationId || 7);
    const syncedQfUrl = audioUrls[ayahNumber];
    if (!syncedQfUrl || !isQuranFoundationAudioUrl(syncedQfUrl)) {
      throw new Error('Quran Foundation audio has not been synced for this verse');
    }
    await cacheAudioForOffline(syncedQfUrl);
  };

  const saveCurrentAyahOffline = async () => {
    if (!currentAyah) return;
    setOfflineStatus('saving');
    setDownloadProgress({ done: 0, total: 0 });
    try {
      await cacheAyahAudio(currentAyah, surahNumber, audio.selectedQari);
      setOfflineStatus(audio.translationVoiceMode === 'off' ? 'saved' : 'partial');
    } catch {
      setOfflineStatus('error');
    }
  };

  const saveSurahOffline = async () => {
    const targetSurah = surahNumber;
    const targetQari = audio.selectedQari;
    const targetTotal = totalAyahs;
    const targetVoiceMode = audio.translationVoiceMode;
    stopAfterCurrentAyahRef.current = false;
    setOfflineStatus('saving');
    setDownloadProgress({ done: 0, total: targetTotal });
    try {
      const cachedUrls = await getQuranFoundationRecitationAudioUrls(targetSurah);
      const syncedAudioUrls = Object.keys(cachedUrls).length ? cachedUrls : await fetchQuranFoundationRecitationAudioUrls(targetSurah, audio.availableQaris.find((qari) => qari.id === targetQari)?.qfRecitationId || 7);
      let completed = 0;
      const batchSize = 3;
      for (let start = 1; start <= targetTotal; start += batchSize) {
        if (stopAfterCurrentAyahRef.current) {
          setOfflineStatus('cancelled');
          return;
        }
        const ayahs = Array.from(
          { length: Math.min(batchSize, targetTotal - start + 1) },
          (_, index) => start + index,
        );
        const results = await Promise.allSettled(ayahs.map(async (ayah) => {
          await cacheAyahAudio(ayah, targetSurah, targetQari, syncedAudioUrls);
          completed += 1;
          setDownloadProgress({ done: completed, total: targetTotal });
        }));
        const failed = results.find((result) => result.status === 'rejected');
        if (failed?.status === 'rejected') throw failed.reason;
        if (stopAfterCurrentAyahRef.current && completed < targetTotal) {
          setOfflineStatus('cancelled');
          return;
        }
      }
      setOfflineStatus(targetVoiceMode === 'off' ? 'saved' : 'partial');
    } catch {
      setOfflineStatus('error');
    }
  };

  const removeOfflineAudio = async (removeWholeSurah: boolean) => {
    if (!offlineDownloadSupported || !currentAyah) return;
    if (removeWholeSurah && !window.confirm(t(
      `Hapus semua tilawah offline Al-Afasy untuk ${surahDisplayName}?`,
      `Remove all saved Al-Afasy recitation for ${surahDisplayName}?`,
    ))) return;
    if (audio.isPlaying || audio.isLoading) audio.pause();
    setOfflineStatus('deleting');
    setDownloadProgress({ done: 0, total: removeWholeSurah ? totalAyahs : 1 });
    try {
      const audioUrls = await getQuranFoundationRecitationAudioUrls(surahNumber);
      const ayahs = removeWholeSurah ? Array.from({ length: totalAyahs }, (_, index) => index + 1) : [currentAyah];
      const urls = ayahs.flatMap((ayah) => {
        const url = audioUrls[ayah];
        return url && isQuranFoundationAudioUrl(url) ? [url] : [];
      });
      for (let index = 0; index < urls.length; index += 6) {
        await Promise.all(urls.slice(index, index + 6).map(deleteCachedAudioForUrl));
        setDownloadProgress({ done: Math.min(index + 6, urls.length), total: urls.length });
      }
      setOfflineStatus('deleted');
    } catch {
      setOfflineStatus('deleteError');
    }
  };

  return (
    <aside aria-label={t('Pemutar audio Al-Qur’an', 'Quran audio player')} data-player-mode={playerMode} className={`fixed z-40 max-h-[min(80dvh,calc(100dvh-1rem))] overflow-y-auto overscroll-contain border border-hairline bg-canvas-surface text-ink-primary shadow-hover font-sans ${playerMode === 'compact' ? 'bottom-3 right-3 w-[min(16.5rem,calc(100vw-1rem))] rounded-2xl' : 'bottom-0 inset-x-0 rounded-t-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-[360px] sm:rounded-2xl'}`}>
      {playerMode === 'hidden' ? (
        <button type="button" onClick={() => setPlayerMode('compact')} className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-canvas-surface text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={t('Tampilkan pemutar audio', 'Show audio player')} title={t('Tampilkan pemutar audio', 'Show audio player')}>
          <Headphones className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : playerMode === 'compact' ? (
        <div className="flex min-h-14 items-center gap-0 px-1">
          <button type="button" onClick={audio.prevAyah} disabled={(currentAyah || 1) <= 1 && audio.currentTime <= 3} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-ink-secondary disabled:opacity-40" aria-label={t('Ayat sebelumnya', 'Previous verse')}><SkipBack className="h-4 w-4" /></button>
          <button type="button" onClick={audio.togglePlayPause} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white" aria-label={toggleLabel} title={toggleLabel}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <span className={`min-w-0 flex-1 text-center text-xs font-medium tabular-nums ${audio.error ? 'whitespace-normal leading-tight text-ink-secondary' : 'truncate'}`} aria-live="polite">
            {audio.error ? audioErrorText : <><bdi>{surahNumber}:{currentAyah || 1}</bdi><span className="ms-1 font-normal text-ink-secondary">{currentTranslationUnavailable ? t('Tanpa terjemahan', 'No translation audio') : translationAudioUnavailable ? t('Terjemahan terlewat', 'Translation skipped') : isReadingTranslation ? t('Terjemahan', 'Translation') : t('Tilawah', 'Recitation')}</span></>}
          </span>
          <button type="button" onClick={audio.nextAyah} disabled={(currentAyah || 1) >= totalAyahs || currentQariMeta.isSurahLevel} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-ink-secondary disabled:opacity-40" aria-label={t('Ayat selanjutnya', 'Next verse')}><SkipForward className="h-4 w-4" /></button>
          <button type="button" onClick={() => setPlayerMode('expanded')} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas-soft" aria-label={t('Buka pemutar audio', 'Expand audio player')} aria-expanded="false"><ChevronUp className="h-4 w-4" /></button>
          <button type="button" onClick={() => setPlayerMode('hidden')} className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas-soft" aria-label={t('Sembunyikan pemutar', 'Hide audio player')}><X className="h-4 w-4" /></button>
        </div>
      ) : <>
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-canvas-surface px-3 pt-2 pb-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" title={surahNameArabic}>{surahDisplayName} · {t('Ayat', 'Verse')} {currentAyah || 1}/{totalAyahs}</p>
          <p className="truncate text-xs text-ink-secondary" aria-live="polite">
            {isReadingTranslation
              ? language === 'en' ? t('Terjemahan bahasa Inggris · rekaman manusia', 'English translation · human recording') : t('Terjemahan Indonesia · rekaman manusia', 'Indonesian translation · human recording')
              : language === 'en' ? currentQariMeta.nameEnglish : currentQariMeta.name}
            {' · '}{formatTime(audio.currentTime)} / {formatTime(audio.duration)}
          </p>
        </div>
        <button className={controlClass} onClick={audio.togglePlayPause} aria-label={toggleLabel} title={toggleLabel}>
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </button>
        <button className={controlClass} onClick={() => setPlayerMode('compact')} aria-label={t('Ringkas pemutar', 'Minimize player')} aria-expanded="true">
          <ChevronDown className="h-4 w-4" />
        </button>
        <button className={controlClass} onClick={audio.stop} aria-label={t('Tutup pemutar', 'Close player')}><X className="h-4 w-4" /></button>
      </div>
      <>
        <label className="block px-3 pt-1">
          <span className="sr-only">{t('Posisi audio', 'Audio position')}</span>
          <span className="relative flex h-11 w-full items-center" data-audio-progress>
            <span aria-hidden="true" className="absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-canvas-soft">
              <span ref={progressFillRef} className="block h-full origin-left rounded-full bg-primary" style={{ transform: 'scaleX(0)' }} />
            </span>
            <span ref={progressThumbRef} aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-full" style={{ transform: 'translateX(0%)' }}>
              <span className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-canvas-surface bg-primary shadow-subtle" />
            </span>
            <input aria-label={t('Posisi audio', 'Audio position')} type="range" min={0} max={1000} value={Math.round(audio.progress * 1000)} onChange={event => audio.seek(Number(event.target.value) / 1000)} disabled={!audio.duration} className="absolute inset-0 h-11 w-full cursor-pointer opacity-0 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default" />
          </span>
        </label>
        <div className="flex items-center gap-2 px-3 pb-2">
          <button className={controlClass} onClick={audio.prevAyah} disabled={(currentAyah || 1) <= 1 && audio.currentTime <= 3} aria-label={t('Ayat sebelumnya', 'Previous verse')}><SkipBack className="h-4 w-4" /></button>
          <button className={controlClass} onClick={audio.nextAyah} disabled={(currentAyah || 1) >= totalAyahs || currentQariMeta.isSurahLevel} aria-label={t('Ayat selanjutnya', 'Next verse')}><SkipForward className="h-4 w-4" /></button>
          <label className="flex min-w-0 flex-1 items-center gap-1 text-sm">
            <span>{t('Ulangi:', 'Repeat:')}</span>
            <select aria-label={t('Ulangi', 'Repeat')} title={`${t('Ulangi', 'Repeat')}: ${repeatLabel}`} value={audio.repeatMode} onChange={event => audio.setRepeatMode(event.target.value as RepeatMode)} className="min-h-11 min-w-0 flex-1 bg-canvas-surface text-sm text-ink-primary">
              <option value="off">{t('Mati', 'Off')}</option>
              <option value="ayah" disabled={currentQariMeta.isSurahLevel}>{t('Ayat ini', 'This verse')}</option>
              <option value="surah">{t('Surat ini', 'This surah')}</option>
            </select>
          </label>
          <button className={controlClass} onClick={() => setSettingsOpen(!settingsOpen)} aria-label={t('Pengaturan audio', 'Audio settings')} aria-expanded={settingsOpen}><Settings2 className="h-5 w-5" /></button>
        </div>
        {audio.repeatMode === 'ayah' && <label className="flex min-h-11 items-center justify-between gap-3 border-t border-hairline px-3 text-sm">
          <span>{t('Putar ayat sebanyak', 'Play verse')}</span>
          <select aria-label={t('Jumlah pengulangan ayat', 'Verse repeat count')} value={audio.repeatCount} onChange={event => audio.setRepeatCount(Number(event.target.value) as typeof audio.repeatCount)} className="min-h-11 bg-canvas-surface font-medium text-ink-primary">
            <option value={1}>1×</option><option value={2}>2×</option><option value={3}>3×</option><option value={5}>5×</option><option value={10}>10×</option><option value={0}>{t('Tanpa batas', 'Until stopped')}</option>
          </select>
        </label>}
        <div className="border-t border-hairline px-3 py-2">
          <label className="flex items-center gap-3 text-sm">
            <span className="shrink-0">Handsfree</span>
            <select aria-label={t('Mode handsfree', 'Handsfree mode')} value={handsfreeMode} onFocus={warmCurrentTranslation} onChange={event => audio.setHandsfreeMode(event.target.value as HandsfreeMode)} className={selectClass}>
              <option value="off">{t('Mati · tilawah saja', 'Off · recitation only')}</option>
              <option value="normal">{t('Arab → Terjemahan Indonesia', 'Arabic → English translation')}</option>
              <option value="reverse">{t('Terjemahan Indonesia → Arab', 'English translation → Arabic')}</option>
            </select>
          </label>
          {currentTranslationUnavailable && <p role="status" className="mt-2 text-sm leading-relaxed text-ink-secondary">{t(`Rekaman terjemahan manusia untuk ayat ${currentAyah} tidak tersedia. Tilawah Arab tetap dapat diputar.`, `Human translation audio for verse ${currentAyah} is unavailable. Quran recitation remains available.`)}</p>}
        </div>
        {settingsOpen && <div className="space-y-3 border-t border-hairline px-3 py-3">
          <label className="block text-sm">{t('Audio terjemahan', 'Translation audio')}
            <select aria-label={t('Audio terjemahan', 'Translation audio')} value={audio.translationVoiceMode} onChange={event => audio.setTranslationVoiceMode(event.target.value as typeof audio.translationVoiceMode)} className={selectClass}>
              {audio.translationVoiceOptions.map(option => <option key={option.id} value={option.id}>{option.id === 'human' ? t('Rekaman manusia', 'Human recordings') : t('Nonaktif', 'Off')}</option>)}
            </select>
          </label>
          <label className="block text-sm">{t('Qari', 'Reciter')}
            <select aria-label={t('Qari', 'Reciter')} value={audio.selectedQari} onChange={event => audio.setSelectedQari(event.target.value)} className={selectClass}>
              {audio.availableQaris.map(qari => <option key={qari.id} value={qari.id}>{language === 'en' ? qari.nameEnglish : qari.name} · {qariDescription(qari)}</option>)}
            </select>
          </label>
          <p className="text-sm text-ink-secondary">{qariDescription(currentQariMeta)}</p>
          {currentQariMeta.isSurahLevel && <p className="text-sm leading-relaxed text-ink-secondary">{t('Rekaman qari ini tersedia per surat penuh. Pilih qari lain untuk handsfree dan ulangi per ayat.', 'This reciter has full-surah recordings. Choose another reciter for handsfree and verse repeat.')}</p>}
          <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={audio.autoNext} onChange={event => audio.setAutoNext(event.target.checked)} className="h-4 w-4 accent-primary" />{t('Lanjut otomatis ke ayat berikutnya', 'Continue to the next verse automatically')}</label>
          <p className="text-sm leading-relaxed text-ink-secondary">{t('Unduh tilawah Al-Afasy dari Quran Foundation ke penyimpanan aplikasi. Qari lain dan rekaman terjemahan diputar lewat internet.', 'Download Al-Afasy recitation from Quran Foundation to app storage. Other reciters and translation recordings stream online.')}</p>
          {!offlineDownloadSupported && <p className="text-sm leading-relaxed text-ink-secondary">{t('Pilih Al-Afasy untuk mengunduh tilawah offline.', 'Select Al-Afasy to download recitation for offline listening.')}</p>}
          <div className="space-y-2 border-t border-hairline pt-3">
            <button type="button" onClick={() => void saveCurrentAyahOffline()} disabled={!offlineDownloadSupported || !currentAyah || offlineStatus === 'saving' || offlineStatus === 'deleting'} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-sm font-medium hover:bg-canvas-soft disabled:opacity-50">
              {offlineStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t(`Simpan ayat ${currentAyah || 1} offline`, `Save verse ${currentAyah || 1} offline`)}
            </button>
            <button type="button" onClick={() => void saveSurahOffline()} disabled={!offlineDownloadSupported || offlineStatus === 'saving' || offlineStatus === 'deleting'} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-sm font-medium hover:bg-canvas-soft disabled:opacity-50">
              {offlineStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t(`Simpan seluruh surah · ${totalAyahs} ayat`, `Save entire surah · ${totalAyahs} verses`)}
            </button>
            {offlineDownloadSupported && <details className="border-t border-hairline pt-2">
              <summary className="min-h-11 cursor-pointer py-2 text-sm font-medium text-ink-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('Kelola audio offline', 'Manage offline audio')}</summary>
              <div className="grid gap-2 pb-2 sm:grid-cols-2">
                <button type="button" onClick={() => void removeOfflineAudio(false)} disabled={!currentAyah || offlineStatus === 'saving' || offlineStatus === 'deleting'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-sm text-ink-secondary hover:bg-canvas-soft disabled:opacity-50">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />{t('Hapus ayat ini', 'Remove this verse')}
                </button>
                <button type="button" onClick={() => void removeOfflineAudio(true)} disabled={!currentAyah || offlineStatus === 'saving' || offlineStatus === 'deleting'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-sm text-ink-secondary hover:bg-canvas-soft disabled:opacity-50">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />{t('Hapus audio surah', 'Remove surah audio')}
                </button>
              </div>
            </details>}
            {offlineStatus === 'saving' && <div className="flex items-center justify-between gap-3 text-sm text-ink-secondary">
              <p role="status">{downloadProgress.total ? currentQariMeta.isSurahLevel ? t('Mengunduh rekaman surah…', 'Saving the surah recording…') : t(`Mengunduh ayat ${downloadProgress.done} dari ${downloadProgress.total}…`, `Saving verse ${downloadProgress.done} of ${downloadProgress.total}…`) : currentQariMeta.isSurahLevel ? t('Mengunduh rekaman surah…', 'Saving the surah recording…') : t('Mengunduh audio ayat…', 'Saving verse audio…')}</p>
              {downloadProgress.total > 1 && <button type="button" onClick={() => { stopAfterCurrentAyahRef.current = true; }} className="min-h-11 shrink-0 px-2 font-medium text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('Hentikan setelah unduhan berjalan', 'Stop after current downloads')}</button>}
            </div>}
            {offlineStatus === 'deleting' && <p role="status" className="text-sm text-ink-secondary">{downloadProgress.total > 1
              ? t(`Menghapus ayat ${downloadProgress.done} dari ${downloadProgress.total}…`, `Removing verse ${downloadProgress.done} of ${downloadProgress.total}…`)
              : t('Menghapus audio offline…', 'Removing offline audio…')}</p>}
            {offlineStatus === 'cancelled' && <p role="status" className="text-sm text-ink-secondary">{t('Unduhan dihentikan. Ayat yang sudah selesai tetap tersedia offline.', 'Download stopped. Completed verses remain available offline.')}</p>}
            {offlineStatus === 'saved' && <p role="status" className="text-sm text-ink-secondary">{t('Tilawah tersimpan di penyimpanan aplikasi untuk diputar offline.', 'Recitation saved in app storage for offline playback.')}</p>}
            {offlineStatus === 'partial' && <p role="status" className="text-sm text-ink-secondary">{t('Tilawah tersimpan. Rekaman terjemahan hanya tersedia saat online.', 'Recitation saved. Translation recordings remain online only.')}</p>}
            {offlineStatus === 'deleted' && <p role="status" className="text-sm text-ink-secondary">{t('Audio offline Al-Afasy dihapus dari perangkat.', 'Offline Al-Afasy audio removed from this device.')}</p>}
            {offlineStatus === 'error' && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{t('Unduhan tidak lengkap. Berkas yang sudah tersimpan tetap tersedia. Periksa koneksi, akses audio Quran Foundation, dan ruang penyimpanan, lalu coba lagi.', 'The download is incomplete. Files already saved remain available. Check your connection, Quran Foundation audio access, and device storage, then retry.')}</p>}
            {offlineStatus === 'deleteError' && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{t('Audio offline tidak dapat dihapus. Coba lagi.', 'Offline audio could not be removed. Please retry.')}</p>}
          </div>
        </div>}
        {translationAudioUnavailable && <p role="status" className="border-t border-hairline px-3 py-2 text-sm leading-relaxed text-ink-secondary">{t('Rekaman terjemahan manusia tidak termuat untuk ayat ini; tilawah Arab tetap berjalan.', 'Human translation audio did not load for this verse; Quran recitation continues.')}</p>}
        {audio.error && <p role="alert" className="border-t border-hairline px-3 py-2 text-sm leading-relaxed text-red-700 dark:text-red-300">{audioErrorText}</p>}
      </>
      </>}
    </aside>
  );
}
