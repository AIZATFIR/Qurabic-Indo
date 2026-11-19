'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Loader2, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { UseQuranAudioReturn, HandsfreeMode, RepeatMode } from '@/lib/hooks/useQuranAudio';
import { useLanguage } from '@/lib/context/LanguageContext';
import { estimateAudioProgress, stabilizeAudioProgress } from '@/lib/audio/smooth-progress';
import { preloadTranslationAudio } from '@/lib/audio/audio-preloader';

interface QuranAudioPlayerProps {
  audio: UseQuranAudioReturn;
  surahNameIndo: string;
  surahNameArabic: string;
  surahNumber: number;
  totalAyahs: number;
}

export default function QuranAudioPlayer({ audio, surahNameIndo, surahNameArabic, surahNumber, totalAyahs }: QuranAudioPlayerProps) {
  const { language, t } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const progressFillRef = useRef<HTMLSpanElement>(null);
  const progressThumbRef = useRef<HTMLSpanElement>(null);
  const displayedProgressRef = useRef(audio.progress);
  const observedTimeRef = useRef(audio.currentTime);
  const trackIdentityRef = useRef(`${audio.currentAyah}:${audio.isReadingTranslation}`);
  const progressSampleRef = useRef({
    currentTime: audio.currentTime,
    duration: audio.duration,
    isPlaying: audio.isPlaying,
    progress: audio.progress,
    observedAt: performance.now(),
  });
  const { currentAyah, playbackState, isPlaying, isLoading, isReadingTranslation, isAiGeneratedTranslation, isAiTranslationCandidate, handsfreeMode, currentQariMeta } = audio;

  useEffect(() => {
    const trackIdentity = `${audio.currentAyah}:${audio.isReadingTranslation}`;
    const newTrack = trackIdentityRef.current !== trackIdentity;
    const soughtBack = audio.currentTime < observedTimeRef.current - 0.25;
    if (newTrack || soughtBack) displayedProgressRef.current = audio.progress;
    trackIdentityRef.current = trackIdentity;
    observedTimeRef.current = audio.currentTime;
    progressSampleRef.current = {
      currentTime: audio.currentTime,
      duration: audio.duration,
      isPlaying: audio.isPlaying,
      progress: audio.progress,
      observedAt: performance.now(),
    };
  }, [audio.currentAyah, audio.currentTime, audio.duration, audio.isPlaying, audio.isReadingTranslation, audio.progress]);

  useEffect(() => {
    let frame = 0;
    const renderProgress = (now: number) => {
      const sample = progressSampleRef.current;
      const estimated = estimateAudioProgress({
        currentTime: sample.currentTime,
        duration: sample.duration,
        observedAt: sample.observedAt,
        now,
        isPlaying: sample.isPlaying,
        progress: sample.progress,
      });
      const progress = stabilizeAudioProgress(estimated, displayedProgressRef.current);
      displayedProgressRef.current = progress;
      progressFillRef.current?.style.setProperty('transform', `scaleX(${progress})`);
      progressThumbRef.current?.style.setProperty('left', `${progress * 100}%`);
      if (sample.isPlaying) frame = requestAnimationFrame(renderProgress);
    };
    renderProgress(performance.now());
    return () => cancelAnimationFrame(frame);
  }, [audio.currentAyah, audio.isPlaying, audio.isReadingTranslation]);

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

  return (
    <aside aria-label={t('Pemutar audio Al-Qur’an', 'Quran audio player')} className="fixed bottom-0 inset-x-0 z-40 border-t border-hairline bg-canvas-surface text-ink-primary shadow-subtle sm:bottom-4 sm:left-auto sm:right-4 sm:w-[480px] sm:border font-sans">
      <div className="flex items-center gap-2 px-3 pt-2">
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
        <button className={controlClass} onClick={() => setMinimized(!minimized)} aria-label={minimized ? t('Perbesar pemutar', 'Expand player') : t('Ringkas pemutar', 'Minimize player')} aria-expanded={!minimized}>
          {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button className={controlClass} onClick={audio.stop} aria-label={t('Tutup pemutar', 'Close player')}><X className="h-4 w-4" /></button>
      </div>
      {!minimized && <>
        <label className="block px-3 pt-1">
          <span className="sr-only">{t('Posisi audio', 'Audio position')}</span>
          <span className="relative flex h-11 w-full items-center" data-audio-progress>
            <span aria-hidden="true" className="absolute inset-x-0 h-1.5 overflow-hidden rounded-full bg-canvas-soft">
              <span ref={progressFillRef} className="block h-full origin-left rounded-full bg-primary" style={{ transform: 'scaleX(0)' }} />
            </span>
            <span ref={progressThumbRef} aria-hidden="true" className="absolute h-3 w-3 -translate-x-1/2 rounded-full border-2 border-canvas-surface bg-primary shadow-subtle" style={{ left: '0%' }} />
            <input aria-label={t('Posisi audio', 'Audio position')} type="range" min={0} max={1000} value={Math.round(audio.progress * 1000)} onChange={event => { const progress = Number(event.target.value) / 1000; displayedProgressRef.current = progress; audio.seek(progress); }} disabled={!audio.duration} className="absolute inset-0 h-11 w-full cursor-pointer opacity-0 focus-visible:rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default" />
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
                  ? t('Manusia, lalu suara AI (Indonesia)', 'Human, then AI voice (Indonesian)')
                  : t('Audio terjemahan nonaktif', 'Translation audio off')}</option>)}
            </select>
          </label>
          {audio.translationVoiceMode === 'ai-fallback' && <p className="text-sm leading-relaxed text-ink-secondary">
            {language === 'id'
              ? t('Rekaman manusia dipakai lebih dulu; TTS hanya mengisi ayat Indonesia yang tidak memiliki rekaman. Ini suara AI Gemini, bukan pembaca manusia, dan pelafalan atau jedanya bisa kurang tepat.', 'Human recordings play first; TTS fills only Indonesian verses without a human recording. This is Gemini AI voice, not a human reader; pronunciation or pacing may be imperfect.')
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
        </div>}
        {audio.error && <p role="alert" className="border-t border-hairline px-3 py-2 text-sm leading-relaxed text-red-700 dark:text-red-300">{t(audio.error, 'The recitation could not be loaded. Check your connection and press Play to try again.')}</p>}
      </>}
    </aside>
  );
}
