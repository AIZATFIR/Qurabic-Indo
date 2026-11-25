'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Loader2, Settings2, ChevronDown, ChevronUp, Headphones, Download } from 'lucide-react';
import { UseQuranAudioReturn, HandsfreeMode, RepeatMode } from '@/lib/hooks/useQuranAudio';
import { useLanguage } from '@/lib/context/LanguageContext';
import { cacheAudioForOffline, preloadTranslationAudio } from '@/lib/audio/audio-preloader';
import { getAudioCandidateUrls } from '@/lib/api/audio';

type PlayerMode = 'expanded' | 'compact' | 'hidden';
const SHORT_SURAH_DOWNLOAD_LIMIT = 12;

interface QuranAudioPlayerProps {
  audio: UseQuranAudioReturn;
  surahNameIndo: string;
  surahNameArabic: string;
  surahNumber: number;
  totalAyahs: number;
  focusMode?: boolean;
}

export default function QuranAudioPlayer({ audio, surahNameIndo, surahNameArabic, surahNumber, totalAyahs, focusMode = false }: QuranAudioPlayerProps) {
  const { language, t } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('expanded');
  const [offlineStatus, setOfflineStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState({ done: 0, total: 0 });
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressThumbRef = useRef<HTMLSpanElement>(null);
  const { currentAyah, playbackState, isPlaying, isLoading, isReadingTranslation, isAiGeneratedTranslation, isAiTranslationCandidate, handsfreeMode, currentQariMeta, readLiveProgress } = audio;
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
  const repeatLabel = audio.repeatMode === 'ayah' ? t('Ayat', 'Verse') : audio.repeatMode === 'surah' ? t('Surat', 'Surah') : t('Mati', 'Off');
  const toggleLabel = isPlaying || isLoading ? t('Jeda', 'Pause') : t('Putar', 'Play');
  const controlClass = 'inline-flex min-h-11 min-w-11 items-center justify-center text-ink-secondary hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40';
  const selectClass = 'min-h-11 w-full border-b border-hairline bg-canvas-surface py-2 text-sm text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';
  const warmCurrentTranslation = () => {
    if (!currentAyah) return;
    void preloadTranslationAudio(surahNumber, currentAyah, undefined, audio.translationVoiceMode, language).catch(() => {});
  };

  const cacheAyahAudio = async (ayahNumber: number) => {
    let lastError: unknown;
    for (const url of getAudioCandidateUrls(surahNumber, ayahNumber, audio.selectedQari)) {
      try {
        await cacheAudioForOffline(url);
        return;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError ?? new Error('Audio could not be saved');
  };

  const saveCurrentAyahOffline = async () => {
    if (!currentAyah) return;
    setOfflineStatus('saving');
    try {
      await cacheAyahAudio(currentAyah);
      setOfflineStatus('saved');
    } catch {
      setOfflineStatus('error');
    }
  };

  const saveShortSurahOffline = async () => {
    setOfflineStatus('saving');
    setDownloadProgress({ done: 0, total: totalAyahs });
    try {
      for (let ayah = 1; ayah <= totalAyahs; ayah++) {
        await cacheAyahAudio(ayah);
        setDownloadProgress({ done: ayah, total: totalAyahs });
      }
      setOfflineStatus('saved');
    } catch {
      setOfflineStatus('error');
    }
  };

  return (
    <aside aria-label={t('Pemutar audio Al-Qur’an', 'Quran audio player')} data-player-mode={playerMode} className={`fixed z-40 max-h-[min(80dvh,calc(100dvh-1rem))] overflow-y-auto overscroll-contain border border-hairline bg-canvas-surface text-ink-primary shadow-hover font-sans ${playerMode === 'compact' ? 'bottom-3 right-3 w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl' : 'bottom-0 inset-x-0 rounded-t-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-[360px] sm:rounded-2xl'}`}>
      {playerMode === 'hidden' ? (
        <button type="button" onClick={() => setPlayerMode('compact')} className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full bg-canvas-surface text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary" aria-label={t('Tampilkan pemutar audio', 'Show audio player')} title={t('Tampilkan pemutar audio', 'Show audio player')}>
          <Headphones className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : playerMode === 'compact' ? (
        <div className="flex min-h-14 items-center gap-1 px-2">
          <button type="button" onClick={audio.togglePlayPause} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-primary text-white" aria-label={toggleLabel} title={toggleLabel}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{t('Ayat', 'Verse')} {currentAyah || 1}</span>
          <button type="button" onClick={() => setPlayerMode('expanded')} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas-soft" aria-label={t('Buka pemutar audio', 'Expand audio player')} aria-expanded="false"><ChevronUp className="h-4 w-4" /></button>
          <button type="button" onClick={() => setPlayerMode('hidden')} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas-soft" aria-label={t('Sembunyikan pemutar', 'Hide audio player')}><X className="h-4 w-4" /></button>
        </div>
      ) : <>
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-canvas-surface px-3 pt-2 pb-1">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" title={surahNameArabic}>{surahNameIndo} · {t('Ayat', 'Verse')} {currentAyah || 1}/{totalAyahs}</p>
          <p className="truncate text-xs text-ink-secondary" aria-live="polite">
            {isReadingTranslation
              ? isAiGeneratedTranslation
                ? t('Suara AI · Gemini TTS', 'AI voice · Gemini TTS')
                : isAiTranslationCandidate
                  ? isLoading
                    ? t('Memuat suara AI · Gemini TTS', 'Loading AI voice · Gemini TTS')
                    : t('Suara AI · Gemini TTS', 'AI voice · Gemini TTS')
                : language === 'en'
                  ? t('Rekaman terjemahan Indonesia', 'Human English translation')
                  : t('Terjemahan Indonesia · suara manusia', 'Indonesian translation · human recording')
              : currentQariMeta.name}
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
        <div className="border-t border-hairline px-3 py-2">
          <label className="flex items-center gap-3 text-sm">
            <span className="shrink-0">Handsfree</span>
            <select aria-label={t('Mode handsfree', 'Handsfree mode')} value={handsfreeMode} onFocus={warmCurrentTranslation} onChange={event => audio.setHandsfreeMode(event.target.value as HandsfreeMode)} className={selectClass}>
              <option value="off">{t('Mati · tilawah saja', 'Off · recitation only')}</option>
              <option value="normal">{t('Arab → Terjemahan Indonesia', 'Arabic → English translation')}</option>
              <option value="reverse">{t('Terjemahan Indonesia → Arab', 'English translation → Arabic')}</option>
            </select>
          </label>
          {handsfreeMode !== 'off' && !audio.isHumanTranslationAvailableForCurrentSurah && <p role="status" className="mt-2 text-sm leading-relaxed text-ink-secondary">{audio.translationVoiceMode === 'ai-fallback' && language === 'id'
            ? t('Tidak ada rekaman manusia untuk surat ini; terjemahannya memakai suara AI yang ditandai jelas.', 'No human translation recordings are listed for this surah; its translation uses the clearly labeled AI voice.')
            : t('Rekaman terjemahan manusia tidak tersedia untuk surat ini. Mode manusia akan melanjutkan tilawah Arab tanpa menebak audio.', 'Human translation recordings are unavailable for this surah. Human-only mode continues Arabic recitation without guessing an audio source.')}</p>}
        </div>
        {settingsOpen && <div className="space-y-3 border-t border-hairline px-3 py-3">
          <label className="block text-sm">{t('Audio terjemahan', 'Translation audio')}
            <select aria-label={t('Audio terjemahan', 'Translation audio')} value={audio.translationVoiceMode} onChange={event => audio.setTranslationVoiceMode(event.target.value as typeof audio.translationVoiceMode)} className={selectClass}>
              {audio.translationVoiceOptions.map(option => <option key={option.id} value={option.id}>{option.id === 'human'
                ? t('Rekaman manusia saja', 'Human recordings only')
                : option.id === 'ai-fallback'
                  ? t('Manusia dulu; AI jika lambat (Indonesia)', 'Human first; AI if slow (Indonesian)')
                  : t('Audio terjemahan nonaktif', 'Translation audio off')}</option>)}
            </select>
          </label>
          {audio.translationVoiceMode === 'ai-fallback' && <p className="text-sm leading-relaxed text-ink-secondary">
            {language === 'id'
              ? t('Pemutar mencoba rekaman manusia sebentar; jika lambat atau tidak tersedia, pemutar beralih ke Gemini TTS. Ini suara AI, dan pelafalan atau jedanya bisa kurang tepat.', 'The player tries human recordings briefly; if one is slow or unavailable, it switches to Gemini TTS. This is AI speech; pronunciation or pauses may be imperfect.')
              : t('Fallback suara AI ini hanya tersedia untuk audio Indonesia. Audio Inggris tetap memakai rekaman manusia yang tersedia.', 'AI voice fallback is only available for Indonesian audio. English audio continues to use available human recordings.')}{' '}
            {language === 'id' && <a href="https://huggingface.co/datasets/insanalamin/quran-terjemahan-indonesia-audio-by-ayah" target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline underline-offset-2">{t('Sumber & batas penggunaan', 'Source & usage terms')}</a>}
            {language === 'id' && <span> {t('Lisensi sumber membatasi penggunaan audio AI untuk edukasi, pendengaran keagamaan, aksesibilitas, dan referensi non-komersial.', 'The source license limits AI audio use to non-commercial education, religious listening, accessibility, and reference.')}</span>}
          </p>}
          <label className="block text-sm">{t('Qari', 'Reciter')}
            <select aria-label={t('Qari', 'Reciter')} value={audio.selectedQari} onChange={event => audio.setSelectedQari(event.target.value)} className={selectClass}>
              {audio.availableQaris.map(qari => <option key={qari.id} value={qari.id}>{qari.name}</option>)}
            </select>
          </label>
          {currentQariMeta.isSurahLevel && <p className="text-sm leading-relaxed text-ink-secondary">{t('Rekaman qari ini tersedia per surat penuh. Pilih qari lain untuk handsfree dan ulangi per ayat.', 'This reciter has full-surah recordings. Choose another reciter for handsfree and verse repeat.')}</p>}
          <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={audio.autoNext} onChange={event => audio.setAutoNext(event.target.checked)} className="h-4 w-4 accent-primary" />{t('Lanjut otomatis ke ayat berikutnya', 'Continue to the next verse automatically')}</label>
          <p className="text-sm leading-relaxed text-ink-secondary">{t('Tilawah: Quran.com / EveryAyah / MP3Quran. Terjemahan Indonesia: rekaman manusia di Internet Archive; sebagian surat belum tersedia.', 'Arabic recitation: Quran.com / EveryAyah / MP3Quran. English translation: Sahih International, read by Ibrahim Walk (EveryAyah). Failed files are skipped.')}</p>
          <div className="space-y-2 border-t border-hairline pt-3">
            <button type="button" onClick={() => void saveCurrentAyahOffline()} disabled={!currentAyah || offlineStatus === 'saving'} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-sm font-medium hover:bg-canvas-soft disabled:opacity-50">
              {offlineStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t(`Simpan ayat ${currentAyah || 1} offline`, `Save verse ${currentAyah || 1} offline`)}
            </button>
            {totalAyahs <= SHORT_SURAH_DOWNLOAD_LIMIT && !currentQariMeta.isSurahLevel && <button type="button" onClick={() => void saveShortSurahOffline()} disabled={offlineStatus === 'saving'} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-hairline px-3 text-sm font-medium hover:bg-canvas-soft disabled:opacity-50">
              {offlineStatus === 'saving' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {t(`Simpan semua ${totalAyahs} ayat offline`, `Save all ${totalAyahs} verses offline`)}
            </button>}
            {offlineStatus === 'saving' && <p role="status" className="text-sm text-ink-secondary">{downloadProgress.total ? t(`Mengunduh ayat ${downloadProgress.done} dari ${downloadProgress.total}…`, `Saving verse ${downloadProgress.done} of ${downloadProgress.total}…`) : t('Mengunduh audio ayat…', 'Saving verse audio…')}</p>}
            {offlineStatus === 'saved' && <p role="status" className="text-sm text-ink-secondary">{t('Audio tersimpan di penyimpanan aplikasi untuk pemutaran offline.', 'Audio saved in app storage for offline playback.')}</p>}
            {offlineStatus === 'error' && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{t('Audio belum tersimpan. Periksa koneksi dan ruang penyimpanan, lalu coba lagi.', 'Audio was not saved. Check your connection and storage, then try again.')}</p>}
          </div>
        </div>}
        {audio.error && <p role="alert" className="border-t border-hairline px-3 py-2 text-sm leading-relaxed text-red-700 dark:text-red-300">{t(audio.error, 'The recitation could not be loaded. Check your connection and press Play to try again.')}</p>}
      </>
      </>}
    </aside>
  );
}
