'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Loader2,
  Headphones,
  Volume2,
  Settings2,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
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
    selectedQari,
    setSelectedQari,
    currentQariMeta,
    availableQaris,
    translationVoiceMode,
    setTranslationVoiceMode,
    translationVoiceOptions,
    handsfreeMode,
    isTranslationReadingEnabled,
    isReadingTranslation,
    setHandsfreeMode,
    togglePlayPause,
    nextAyah,
    prevAyah,
    cycleRepeatMode,
    seek,
    stop,
  } = audio;

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHandsfreeMenuOpen, setIsHandsfreeMenuOpen] = useState(false);
  const handsfreeMenuRef = useRef<HTMLDivElement>(null);

  // Close handsfree popup on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (handsfreeMenuRef.current && !handsfreeMenuRef.current.contains(e.target as Node)) {
        setIsHandsfreeMenuOpen(false);
      }
    };
    if (isHandsfreeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isHandsfreeMenuOpen]);

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
    if (isReadingTranslation) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio);
  };

  return (
    <aside
      aria-label="Pemutar Audio Tilawah Al-Qur'an dan Tadarus Handsfree"
      className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:right-6 sm:inset-x-auto sm:w-[460px] z-40 bg-canvas-surface border border-hairline rounded-2xl shadow-hover transition-all duration-200 text-ink-primary font-sans animate-in slide-in-from-bottom-4"
    >
      {/* Progress Bar along top edge of player */}
      <div
        onClick={handleProgressBarClick}
        className="w-full h-1 bg-canvas-soft cursor-pointer relative overflow-hidden rounded-t-2xl group"
        title={isReadingTranslation ? 'Sedang membacakan terjemahan Indonesia' : 'Klik untuk loncat durasi'}
      >
        <div
          className={`h-full transition-all duration-100 ease-out ${
            isReadingTranslation
              ? 'bg-emerald-500 w-full animate-pulse'
              : 'bg-primary'
          }`}
          style={!isReadingTranslation ? { width: `${progress * 100}%` } : undefined}
        />
        {!isReadingTranslation && (
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      {/* Audio Settings Panel (Modal/Dropdown) */}
      {isSettingsOpen && (
        <div className="p-3.5 border-b border-hairline bg-canvas-soft/80 backdrop-blur-sm rounded-t-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-primary flex items-center space-x-1.5">
              <Settings2 className="w-3.5 h-3.5 text-primary" />
              <span>Pengaturan Qari & Terjemahan</span>
            </span>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-ink-mute hover:text-ink-primary p-1 rounded-md"
              title="Tutup Pengaturan"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 1: Pilihan Qari */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-ink-secondary flex items-center justify-between">
              <span>Pilihan Qari / Pembaca Arab</span>
              <span className="text-[10px] text-ink-mute font-normal">{availableQaris.length} Pilihan</span>
            </label>
            <div className="relative">
              <select
                value={selectedQari}
                onChange={(e) => setSelectedQari(e.target.value)}
                className="w-full text-xs bg-canvas-surface border border-hairline rounded-lg px-2.5 py-1.5 text-ink-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none font-medium cursor-pointer"
              >
                {availableQaris.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name} ({q.style})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-ink-mute text-xs">
                ▼
              </div>
            </div>
            <div className="text-[10px] text-ink-mute flex items-center justify-between px-0.5">
              <span>Gaya: {currentQariMeta.style}</span>
              <span className="font-amiri text-xs text-ink-secondary">{currentQariMeta.arabicName}</span>
            </div>
          </div>

          {/* Section 2: Audio Terjemahan Indonesia */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-semibold text-ink-secondary">
              Audio Terjemahan Indonesia (Handsfree)
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {translationVoiceOptions.map((opt) => {
                const isSelected = translationVoiceMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTranslationVoiceMode(opt.id)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-semibold transition-all border text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-primary-subdued text-primary border-primary/40 shadow-sm'
                        : 'bg-canvas-surface text-ink-secondary border-hairline hover:bg-canvas-soft'
                    }`}
                  >
                    <span className="truncate">{opt.name.replace('Rekaman ', '').replace('Suara ', '')}</span>
                    {isSelected && <Check className="w-3 h-3 text-primary shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="p-3.5 sm:p-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Surah & Current Ayah Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-2 truncate">
              <span className="font-semibold text-xs text-ink-primary truncate">
                {surahNameIndo}
              </span>
              <span className="text-[11px] text-ink-mute font-medium shrink-0">
                Ayat {activeAyahNum} / {totalAyahs}
              </span>
            </div>

            {/* Subtitle Status: Reading Translation vs Arabic Audio */}
            {isReadingTranslation ? (
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 truncate animate-pulse">
                <Volume2 className="w-3 h-3 shrink-0" />
                <span className="truncate">
                  {handsfreeMode === 'reverse'
                    ? 'Membacakan Makna (ID) [1/2]...'
                    : 'Membacakan Makna (ID) [2/2]...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-[10px] text-ink-mute font-medium mt-0.5 truncate">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                <span>•</span>
                <span className="truncate max-w-[140px] xs:max-w-[180px]" title={currentQariMeta.name}>
                  {currentQariMeta.name.replace('Syaikh ', '')}
                </span>
                {handsfreeMode !== 'off' && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold hidden xs:inline">
                    • {handsfreeMode === 'reverse' ? 'Makna → Arab' : 'Arab → Makna'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right: Primary Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            {/* Audio & Qari Settings Button */}
            <button
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className={`p-1.5 rounded-lg text-xs font-semibold font-sans transition-all flex items-center space-x-1 border ${
                isSettingsOpen
                  ? 'bg-primary-subdued text-primary border-primary/40'
                  : 'text-ink-mute hover:text-ink-primary hover:bg-canvas-soft border-transparent'
              }`}
              title="Pengaturan Qari & Opsi Audio Terjemahan"
              aria-label="Pengaturan Qari & Audio"
              aria-expanded={isSettingsOpen}
            >
              <Settings2 className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Pop-up Switcher Tadarus Handsfree */}
            <div className="relative" ref={handsfreeMenuRef}>
              <button
                onClick={(e) => {
                  e.currentTarget.blur();
                  setIsHandsfreeMenuOpen((prev) => !prev);
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold font-sans transition-all flex items-center space-x-1 border ${
                  handsfreeMode !== 'off'
                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-subtle'
                    : 'text-ink-mute hover:text-ink-primary hover:bg-canvas-soft border-transparent'
                }`}
                title={
                  handsfreeMode === 'normal'
                    ? 'Handsfree Aktif: Arab → Makna (Klik untuk Switch Mode)'
                    : handsfreeMode === 'reverse'
                    ? 'Handsfree Aktif: Makna → Arab (Klik untuk Switch Mode)'
                    : 'Tadarus Handsfree: Klik untuk Aktifkan & Switch Mode'
                }
                aria-label="Tadarus Handsfree"
                aria-haspopup="true"
                aria-expanded={isHandsfreeMenuOpen}
              >
                <Headphones className="w-3.5 h-3.5 shrink-0" />
                {handsfreeMode === 'normal' && (
                  <ArrowRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                {handsfreeMode === 'reverse' && (
                  <ArrowLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
                <span className="text-[10px] hidden sm:inline">
                  {handsfreeMode === 'normal'
                    ? 'Arab → Makna'
                    : handsfreeMode === 'reverse'
                    ? 'Makna → Arab'
                    : 'Handsfree'}
                </span>
              </button>

              {/* Pop-up Switcher (2 Tombol Lanjutan Kiri & Kanan) */}
              {isHandsfreeMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2.5 w-72 p-3 bg-canvas-surface/95 backdrop-blur-xl border border-hairline rounded-2xl shadow-hover z-50 animate-in fade-in zoom-in-95 duration-150 font-sans space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-hairline">
                    <div className="flex items-center space-x-1.5">
                      <Headphones className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-semibold text-ink-primary">Mode Tadarus Handsfree</span>
                    </div>
                    {handsfreeMode !== 'off' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        Aktif
                      </span>
                    )}
                  </div>

                  {/* 2 Tombol Lanjutan Switch (Panah Kanan & Kiri) */}
                  <div className="grid grid-cols-1 gap-1.5">
                    {/* Tombol Panah Kanan: Arab -> Makna (Normal) */}
                    <button
                      onClick={() => {
                        setHandsfreeMode('normal');
                        setIsHandsfreeMenuOpen(false);
                        if (!isPlaying) {
                          audio.playAyah(activeAyahNum);
                        }
                      }}
                      className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between border ${
                        handsfreeMode === 'normal'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-medium'
                          : 'hover:bg-canvas-soft border-transparent text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">Arab → Makna</div>
                          <div className="text-[10px] text-ink-mute">Tilawah Arab dulu, baru terjemahan</div>
                        </div>
                      </div>
                      {handsfreeMode === 'normal' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>

                    {/* Tombol Panah Kiri: Makna -> Arab (Reverse) */}
                    <button
                      onClick={() => {
                        setHandsfreeMode('reverse');
                        setIsHandsfreeMenuOpen(false);
                        if (!isPlaying) {
                          audio.playAyah(activeAyahNum);
                        }
                      }}
                      className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between border ${
                        handsfreeMode === 'reverse'
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-medium'
                          : 'hover:bg-canvas-soft border-transparent text-ink-secondary hover:text-ink-primary'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <ArrowLeft className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold">Makna → Arab (Reverse)</div>
                          <div className="text-[10px] text-ink-mute">Terjemahan dibacakan dulu, baru Arab</div>
                        </div>
                      </div>
                      {handsfreeMode === 'reverse' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  </div>

                  {/* Switch Matikan */}
                  <div className="pt-1.5 border-t border-hairline">
                    <button
                      onClick={() => {
                        setHandsfreeMode('off');
                        setIsHandsfreeMenuOpen(false);
                      }}
                      className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-colors ${
                        handsfreeMode === 'off'
                          ? 'bg-canvas-soft text-ink-mute font-semibold'
                          : 'text-ink-mute hover:text-rose-600 hover:bg-rose-500/10'
                      }`}
                    >
                      {handsfreeMode === 'off' ? 'Handsfree Nonaktif' : 'Matikan Mode Handsfree'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Repeat Mode Button */}
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                cycleRepeatMode();
              }}
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
              onClick={(e) => {
                e.currentTarget.blur();
                prevAyah();
              }}
              disabled={activeAyahNum <= 1 && currentTime <= 3 && !isReadingTranslation}
              className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-canvas-soft disabled:opacity-40 transition-colors"
              title="Ayat Sebelumnya (Arrow Left)"
              aria-label="Ayat Sebelumnya"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause / Loading Button */}
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                togglePlayPause();
              }}
              className="p-2.5 rounded-xl bg-primary hover:bg-primary-deep text-white shadow-subtle transition-all active:scale-95 flex items-center justify-center"
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
              onClick={(e) => {
                e.currentTarget.blur();
                nextAyah();
              }}
              disabled={activeAyahNum >= totalAyahs}
              className="p-1.5 rounded-lg text-ink-secondary hover:text-ink-primary hover:bg-canvas-soft disabled:opacity-40 transition-colors"
              title="Ayat Selanjutnya (Arrow Right)"
              aria-label="Ayat Selanjutnya"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Dismiss / Stop Player */}
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                stop();
              }}
              className="p-1.5 rounded-lg text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors ml-1"
              title="Tutup Pemutar Audio"
              aria-label="Tutup Pemutar Audio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}
