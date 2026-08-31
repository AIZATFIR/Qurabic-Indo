'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, BookOpen, Volume2, ArrowRight, Compass } from 'lucide-react';
import { searchRoots, findBestMatchingRoot } from '@/lib/search/root-search';
import { getWordDetailedExplanation } from '@/lib/search/word-dictionary';
import { RootWord } from '@/lib/types/morphology';

interface WordEtymologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordArabic: string;
  transliteration?: string;
  meaningIndo?: string;
  posTag?: string;
  posDetail?: string;
  matchedRootSlug?: string;
  rootLetters?: string;
  audioUrl?: string;
  ayahArabic?: string;
  ayahIndo?: string;
  surahNumber?: number;
  ayahNumber?: number;
  surahNameIndo?: string;
}

export default function WordEtymologyModal({
  isOpen,
  onClose,
  wordArabic,
  transliteration,
  meaningIndo,
  posTag,
  posDetail,
  matchedRootSlug,
  rootLetters,
  audioUrl,
  ayahArabic,
  ayahIndo,
  surahNumber,
  ayahNumber,
  surahNameIndo,
}: WordEtymologyModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Body scroll lock & ESC keyboard dismissal
  useEffect(() => {
    if (!isOpen) return;

    setIsPlayingAudio(false);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, wordArabic, onClose]);

  if (!isOpen) return null;

  // 1. Get comprehensive dictionary & root etymology details
  const wordDetail = getWordDetailedExplanation(wordArabic, meaningIndo);

  // 2. Resolve Root Word from local database if available
  let root: RootWord | undefined;
  const slugToSearch = matchedRootSlug || wordDetail.rootSlug;
  if (slugToSearch) {
    const searchRes = searchRoots(slugToSearch);
    root = searchRes[0];
  }
  if (!root && wordArabic) {
    root = findBestMatchingRoot(wordArabic, meaningIndo);
  }

  const displayRootLetters = root?.rootArabic || wordDetail.rootLetters || rootLetters;
  const displayRootLatin = root?.rootLatin || wordDetail.rootLatin;
  const displayPosTag = posTag || wordDetail.posTag;
  const displayGrammar = posDetail || wordDetail.grammaticalRole;

  // Audio Playback
  const handlePlayAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    let audioSrc = audioUrl;
    if (!audioSrc) {
      audioSrc = `https://audio.qurancdn.com/wbw/001_001_001.mp3`;
    }

    const audio = new Audio(audioSrc);
    audio.play().then(() => {
      audio.onended = () => setIsPlayingAudio(false);
    }).catch((err) => {
      console.warn('Audio playback notice:', err);
      setIsPlayingAudio(false);
    });
  };

  // Helper to highlight active word in ayah Arabic context
  const renderHighlightedAyah = () => {
    if (!ayahArabic) return null;
    const words = ayahArabic.split(' ');
    const cleanTarget = wordArabic.replace(/[ًٌٍَُِّْٰٓ]/g, '');

    return (
      <div className="font-arabic text-xl sm:text-2xl leading-loose text-right dir-rtl text-ink-primary">
        {words.map((w, idx) => {
          const cleanW = w.replace(/[ًٌٍَُِّْٰٓ]/g, '');
          const isMatch = cleanW === cleanTarget || cleanW.includes(cleanTarget) || cleanTarget.includes(cleanW);

          if (isMatch) {
            return (
              <span
                key={idx}
                className="inline-block px-1.5 py-0.5 mx-1 rounded-md bg-primary text-white font-bold"
              >
                {w}
              </span>
            );
          }
          return <span key={idx} className="mx-0.5">{w} </span>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150 overscroll-contain">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl sm:max-w-3xl max-h-[88vh] overflow-y-auto overscroll-contain bg-canvas-surface text-ink-primary border border-hairline rounded-2xl shadow-hover z-10 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-0.5 rounded-lg bg-primary-subdued text-primary text-xs font-semibold font-sans uppercase">
              {displayPosTag}
            </span>
            {surahNameIndo && (
              <span className="text-xs sm:text-sm text-ink-mute font-sans font-medium">
                Q.S. {surahNameIndo} [{surahNumber}]:{ayahNumber}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className={`p-2 rounded-xl transition-all ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-105 shadow-subtle'
                  : 'bg-canvas-soft hover:bg-primary-fixed text-ink-secondary'
              }`}
              title="Dengarkan pelafalan kata"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
              title="Tutup (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Main Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-hairline space-y-4">
          <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5">
              {displayRootLetters && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm text-ink-mute font-sans font-medium">
                    Akar Kata:
                  </span>
                  <span className="font-arabic text-xl sm:text-2xl font-bold text-primary tracking-wider" dir="rtl">
                    {displayRootLetters}
                  </span>
                  {displayRootLatin && (
                    <span className="text-xs sm:text-sm text-ink-mute font-sans">
                      ({displayRootLatin})
                    </span>
                  )}
                </div>
              )}
              {transliteration && (
                <p className="text-sm sm:text-base text-ink-secondary font-medium font-sans italic">
                  {transliteration}
                </p>
              )}
            </div>

            <div className="text-right">
              <span className="font-arabic-lg text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-primary block leading-tight" dir="rtl">
                {wordArabic}
              </span>
            </div>
          </div>

          {/* Primary & Detailed Meanings */}
          <div className="pt-3 border-t border-hairline space-y-2">
            <p className="text-lg sm:text-xl font-semibold text-ink-primary font-sans leading-snug">
              {wordDetail.primaryMeaning || meaningIndo || 'Kata dalam Al-Qur\'an'}
            </p>

            {wordDetail.meanings.length > 1 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-ink-mute uppercase tracking-wider block font-sans">
                  Ragam Definisi:
                </span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-ink-secondary font-sans">
                  {wordDetail.meanings.slice(1).map((m, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="text-primary font-bold text-sm mt-0.5">•</span>
                      <span className="leading-relaxed font-normal">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Deep Root Etymology & Grammatical Role */}
        <div className="p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline space-y-3.5">
          <div className="flex items-center justify-between border-b border-hairline pb-2.5">
            <span className="text-xs sm:text-sm font-semibold text-ink-primary flex items-center space-x-2 font-sans">
              <Compass className="w-4 h-4 text-primary" />
              <span>Analisis Morfologi &amp; Tata Bahasa Sharaf</span>
            </span>
            {root && (
              <span className="text-xs text-ink-mute font-medium font-sans">
                {root.totalOccurrences}x di Al-Qur&apos;an
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs sm:text-sm text-ink-secondary font-sans leading-relaxed">
            <div className="flex items-baseline space-x-2">
              <span className="text-ink-mute font-medium">Peran Gramatikal:</span>
              <span className="text-ink-primary font-medium">{displayGrammar}</span>
            </div>
            {wordDetail.wazanOrForm && (
              <div className="flex items-baseline space-x-2">
                <span className="text-ink-mute font-medium">Wazan / Bentuk:</span>
                <span className="text-ink-primary font-medium">{wordDetail.wazanOrForm}</span>
              </div>
            )}
          </div>

          {wordDetail.rootExplanation && (
            <div className="p-4 bg-canvas-surface rounded-2xl border border-hairline text-xs sm:text-sm text-ink-secondary leading-relaxed space-y-2 font-sans">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute block">Kajian Etimologi Klasik:</span>
              <p className="text-ink-primary leading-relaxed font-normal">{wordDetail.rootExplanation}</p>
              {wordDetail.classicalCitation && (
                <p className="text-xs text-ink-mute italic pt-2 border-t border-hairline font-normal">
                  Rujukan: {wordDetail.classicalCitation}
                </p>
              )}
            </div>
          )}

          <div className="pt-1 flex justify-between items-center text-[11px] text-ink-mute font-sans">
            <span className="inline-flex items-center space-x-1">
              <span className={`w-1.5 h-1.5 rounded-full ${wordDetail.isVerified ? 'bg-primary' : 'bg-amber-500'}`} />
              <span>{wordDetail.isVerified ? 'Terverifikasi Leksikografi' : 'Data Live API'}</span>
            </span>
            <span className="truncate max-w-[280px]">
              Sumber: {wordDetail.sourceCitation}
            </span>
          </div>
        </div>

        {/* Ayah Context Block */}
        {ayahArabic && (
          <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2.5">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="text-xs sm:text-sm font-medium text-ink-mute flex items-center space-x-1.5 font-sans">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Konteks Ayat:</span>
              </span>
              {ayahNumber && (
                <span className="text-xs text-ink-mute font-sans">
                  Ayat Ke-{ayahNumber}
                </span>
              )}
            </div>

            {renderHighlightedAyah()}

            {ayahIndo && (
              <div className="pt-2 border-t border-hairline">
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed italic font-sans">
                  &ldquo;{ayahIndo}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons: Navigate Directly to Full Root Page */}
        <div className="pt-2">
          {root ? (
            <Link
              href={`/akar/${root.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-soft transition-all font-sans"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Halaman Definisi &amp; Bedah Akar Kata Lengkap ({root.rootLatin})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : wordDetail.rootSlug ? (
            <Link
              href={`/akar/${wordDetail.rootSlug}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-soft transition-all font-sans"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Halaman Definisi &amp; Bedah Morfologi Lengkap</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <Link
              href={`/cari?q=${encodeURIComponent(wordArabic)}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-soft transition-all font-sans"
            >
              <BookOpen className="w-4 h-4" />
              <span>Cari Definisi &amp; Semua Kemunculan &ldquo;{wordArabic}&rdquo;</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
