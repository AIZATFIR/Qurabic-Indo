'use client';

import React from 'react';
import { Play, Pause, SkipBack, SkipForward, X, AlertCircle, Loader2 } from 'lucide-react';
import { UseQuranAudioReturn } from '@/lib/hooks/useQuranAudio';

interface QuranAudioPlayerProps {
  audio: UseQuranAudioReturn;
  surahNameIndo: string;
  surahNameArabic: string;
  totalAyahs: number;
}

export default function QuranAudioPlayer({
  audio,
  surahNameIndo,
  surahNameArabic,
  totalAyahs,
}: QuranAudioPlayerProps) {
  const {
    currentAyah,
    playbackState,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    repeatMode,
    error,
    togglePlayPause,
    nextAyah,
    prevAyah,
    cycleRepeatMode,
    seek,
    stop,
  } = audio;

  // Format mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // If player is idle and has never started, do not take up space
  if (playbackState === 'idle' && currentAyah === null) {
    return null;
  }

  const activeAyahNum = currentAyah || 1;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio);
  };

  return (
    <aside
      aria-label="Pemutar Audio Tilawah Al-Qur'an"
      className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-auto sm:right-6 sm:left-auto max-w-md sm:w-[420px] z-40 bg-canvas-surface/95 backdrop-blur-md border border-hairline rounded-2xl shadow-hover transition-all duration-200 text-ink-primary font-sans animate-in slide-in-from-bottom-4"
    >
      {/* Subtle Progress Bar along top edge of player */}
      <div
        onClick={handleProgressBarClick}
        className="w-full h-1 bg-canvas-soft cursor-pointer relative overflow-hidden rounded-t-2xl group"
        title="Klik untuk loncat durasi"
      >
        <div
          className="h-full bg-primary transition-all duration-100 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-3.5 sm:p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Surah & Current Ayah Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2 truncate">
              <span className="font-semibold text-xs text-ink-primary truncate">
                {surahNameIndo}
              </span>
              <span className="text-[11px] text-ink-mute font-medium">
                Ayat {activeAyahNum} / {totalAyahs}
              </span>
            </div>

            {/* Time Indicator & Reciter */}
            <div className="flex items-center space-x-2 text-[10px] text-ink-mute font-medium mt-0.5">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <span>•</span>
              <span className="truncate">Syaikh Mishary Al-Afasy</span>
            </div>
          </div>

          {/* Right: Primary Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Repeat Mode Button */}
            <button
              onClick={cycleRepeatMode}
              className={`p-1.5 rounded-lg text-xs font-semibold font-sans transition-colors flex items-center space-x-1 ${
                repeatMode !== 'off'
                  ? 'bg-primary-subdued text-primary'
                  : 'text-ink-mute hover:text-ink-primary hover:bg-canvas-soft'
              }`}
              title={
                repeatMode === 'ayah'
                  ? 'Ulangi Ayat Ini (Ayah Loop)'
                  : repeatMode === 'surah'
                  ? 'Ulangi Surah Ini (Surah Loop)'
                  : 'Ulangi: Mati (Normal)'
              }
              aria-label="Mode Ulangi"
            >
              <span className="text-[10px] uppercase">
                {repeatMode === 'ayah' ? '1x' : repeatMode === 'surah' ? 'Surah' : 'Loop'}
              </span>
            </button>

            {/* Prev Ayah */}
            <button
              onClick={prevAyah}
              disabled={activeAyahNum <= 1 && currentTime <= 3}
              className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-canvas-soft disabled:opacity-40 transition-colors"
              title="Ayat Sebelumnya (Arrow Left)"
              aria-label="Ayat Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause / Loading Button */}
            <button
              onClick={togglePlayPause}
              disabled={Boolean(error)}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-deep text-white shadow-subtle transition-all active:scale-95 flex items-center justify-center disabled:opacity-50"
              title={isPlaying ? 'Jeda (Space)' : 'Putar (Space)'}
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Ayah */}
            <button
              onClick={nextAyah}
              disabled={activeAyahNum >= totalAyahs}
              className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-canvas-soft disabled:opacity-40 transition-colors"
              title="Ayat Selanjutnya (Arrow Right)"
              aria-label="Ayat Selanjutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Dismiss / Stop Player */}
            <button
              onClick={stop}
              className="p-1.5 rounded-lg text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors ml-1"
              title="Tutup Pemutar Audio"
              aria-label="Tutup Pemutar Audio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Error message if audio fails to load */}
        {error && (
          <div className="flex items-center space-x-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
