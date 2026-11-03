'use client';

import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, X, Loader2, Settings2, ChevronDown, ChevronUp } from 'lucide-react';
import { UseQuranAudioReturn, HandsfreeMode, RepeatMode } from '@/lib/hooks/useQuranAudio';
import { useLanguage } from '@/lib/context/LanguageContext';

interface QuranAudioPlayerProps {
  audio: UseQuranAudioReturn;
  surahNameIndo: string;
  surahNameArabic: string;
  totalAyahs: number;
}

export default function QuranAudioPlayer({ audio, surahNameIndo, surahNameArabic, totalAyahs }: QuranAudioPlayerProps) {
  const { t } = useLanguage();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const { currentAyah, playbackState, isPlaying, isLoading, isReadingTranslation, handsfreeMode, currentQariMeta } = audio;
  if (playbackState === 'idle' && currentAyah === null) return null;
  const formatTime = (seconds: number) => Number.isFinite(seconds) && seconds >= 0 ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
  const repeatLabel = audio.repeatMode === 'ayah' ? t('Ayat', 'Verse') : audio.repeatMode === 'surah' ? t('Surat', 'Surah') : t('Mati', 'Off');
  const toggleLabel = isPlaying || isLoading ? t('Jeda', 'Pause') : t('Putar', 'Play');
  const controlClass = 'inline-flex min-h-11 min-w-11 items-center justify-center text-ink-secondary hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-40';
  const selectClass = 'min-h-11 w-full border-b border-hairline bg-canvas-surface py-2 text-sm text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary';

  return (
    <aside aria-label={t('Pemutar audio Al-Qur’an', 'Quran audio player')} className="fixed bottom-0 inset-x-0 z-40 border-t border-hairline bg-canvas-surface text-ink-primary shadow-subtle sm:bottom-4 sm:left-auto sm:right-4 sm:w-[480px] sm:border font-sans">
      <div className="flex items-center gap-2 px-3 pt-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold" title={surahNameArabic}>{surahNameIndo} · {t('Ayat', 'Verse')} {currentAyah || 1}/{totalAyahs}</p>
          <p className="truncate text-xs text-ink-secondary" aria-live="polite">
            {isReadingTranslation ? t('Rekaman terjemahan Indonesia', 'Human Indonesian translation') : currentQariMeta.name}
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
          <input aria-label={t('Posisi audio', 'Audio position')} type="range" min={0} max={1000} value={Math.round(audio.progress * 1000)} onChange={event => audio.seek(Number(event.target.value) / 1000)} disabled={!audio.duration} className="h-6 w-full accent-primary" />
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
            <select aria-label={t('Mode handsfree', 'Handsfree mode')} value={handsfreeMode} onChange={event => audio.setHandsfreeMode(event.target.value as HandsfreeMode)} className={selectClass}>
              <option value="off">{t('Mati · tilawah saja', 'Off · recitation only')}</option>
              <option value="normal">{t('Arab → Terjemahan Indonesia', 'Arabic → Indonesian translation')}</option>
              <option value="reverse">{t('Terjemahan Indonesia → Arab', 'Indonesian translation → Arabic')}</option>
            </select>
          </label>
          {handsfreeMode !== 'off' && !audio.isHumanTranslationAvailableForCurrentSurah && <p role="status" className="mt-2 text-sm leading-relaxed text-ink-secondary">{t('Rekaman terjemahan manusia belum tersedia untuk surat ini. Tilawah Arab tetap lanjut ke ayat berikutnya.', 'Human Indonesian translation is unavailable for this surah. Arabic recitation continues to the next verse.')}</p>}
        </div>
        {settingsOpen && <div className="space-y-3 border-t border-hairline px-3 py-3">
          <label className="block text-sm">{t('Qari', 'Reciter')}
            <select aria-label={t('Qari', 'Reciter')} value={audio.selectedQari} onChange={event => audio.setSelectedQari(event.target.value)} className={selectClass}>
              {audio.availableQaris.map(qari => <option key={qari.id} value={qari.id}>{qari.name}</option>)}
            </select>
          </label>
          {currentQariMeta.isSurahLevel && <p className="text-sm leading-relaxed text-ink-secondary">{t('Rekaman qari ini tersedia per surat penuh. Pilih qari lain untuk handsfree dan ulangi per ayat.', 'This reciter has full-surah recordings. Choose another reciter for handsfree and verse repeat.')}</p>}
          <label className="flex min-h-11 items-center gap-2 text-sm"><input type="checkbox" checked={audio.autoNext} onChange={event => audio.setAutoNext(event.target.checked)} className="h-4 w-4 accent-primary" />{t('Lanjut otomatis ke ayat berikutnya', 'Continue to the next verse automatically')}</label>
          <p className="text-sm leading-relaxed text-ink-secondary">{t('Tilawah: Quran.com / EveryAyah / MP3Quran. Terjemahan Indonesia: rekaman manusia di Internet Archive. Ketersediaan mengikuti arsip; rekaman yang gagal dimuat dilewati.', 'Recitation: Quran.com / EveryAyah / MP3Quran. Indonesian translation: human recordings on Internet Archive. Availability follows the archive; failed translation recordings are skipped.')}</p>
        </div>}
        {audio.error && <p role="alert" className="border-t border-hairline px-3 py-2 text-sm leading-relaxed text-red-700 dark:text-red-300">{t(audio.error, 'The recitation could not be loaded. Check your connection and press Play to try again.')}</p>}
      </>}
    </aside>
  );
}
