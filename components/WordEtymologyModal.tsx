'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, BookOpen, Volume2, VolumeX, ArrowRight, Compass, Info, Check, Sparkles } from 'lucide-react';
import { searchRoots, findBestMatchingRoot, extractArabicRootLetters, inferGrammarRole } from '@/lib/search/root-search';
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
  const [audioFailed, setAudioFailed] = useState(false);

  // Stop audio on close or change
  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioFailed(false);
  }, [isOpen, wordArabic]);

  if (!isOpen) return null;

  // 1. Resolve Root Word from local database
  let root: RootWord | undefined;
  if (matchedRootSlug) {
    const searchRes = searchRoots(matchedRootSlug);
    root = searchRes[0];
  }

  if (!root && wordArabic) {
    root = findBestMatchingRoot(wordArabic, meaningIndo);
  }

  // 2. Resolve root letters spaced
  const displayRootLetters = root?.rootArabic || rootLetters || extractArabicRootLetters(wordArabic);

  // 3. Resolve grammar detail
  const grammar = inferGrammarRole(wordArabic, meaningIndo);
  const displayPosTag = posTag || grammar.posCategory;
  const displayPosDetail = posDetail || grammar.posDetail;

  // 4. Audio Playback Handler
  const handlePlayAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    setAudioFailed(false);

    let audioSrc = audioUrl;
    if (!audioSrc) {
      // Fallback word-by-word audio format if available
      audioSrc = `https://audio.qurancdn.com/wbw/001_001_001.mp3`;
    }

    const audio = new Audio(audioSrc);
    audio.play().then(() => {
      audio.onended = () => setIsPlayingAudio(false);
    }).catch((err) => {
      console.warn('Audio playback error:', err);
      setAudioFailed(true);
      setIsPlayingAudio(false);
    });
  };

  // Helper to highlight active word in ayah Arabic context
  const renderHighlightedAyah = () => {
    if (!ayahArabic) return null;
    const words = ayahArabic.split(' ');
    const cleanTarget = wordArabic.replace(/[ًٌٍَُِّْٰٓ]/g, '');

    return (
      <div className="font-arabic text-xl sm:text-2xl leading-loose text-right dir-rtl text-slate-800 dark:text-slate-200">
        {words.map((w, idx) => {
          const cleanW = w.replace(/[ًٌٍَُِّْٰٓ]/g, '');
          const isMatch = cleanW === cleanTarget || cleanW.includes(cleanTarget) || cleanTarget.includes(cleanW);

          if (isMatch) {
            return (
              <span
                key={idx}
                className="inline-block px-1.5 py-0.5 mx-1 rounded-lg bg-primary text-white font-bold shadow-sm"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Large Flashcard Dialog Box */}
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2.5">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-primary-light text-xs font-mono font-bold tracking-wider uppercase">
              {displayPosTag}
            </span>
            {surahNameIndo && (
              <span className="text-xs text-slate-500 font-mono">
                Q.S. {surahNameIndo} [{surahNumber}]:{ayahNumber}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Audio pronunciation button */}
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className={`p-2 rounded-full transition-all ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-110 shadow-md animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 text-slate-700 dark:text-slate-300 hover:text-primary'
              }`}
              title="Dengarkan pelafalan kata"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Hero Flashcard Block */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-800/60 border border-amber-200/70 dark:border-slate-800 shadow-sm space-y-4">
          
          <div className="flex items-start justify-between gap-4">
            {/* Left: Spaced Root Letters & Transliteration */}
            <div className="space-y-1">
              {displayRootLetters && (
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
                    Akar:
                  </span>
                  <span className="font-arabic text-xl font-bold text-amber-900 dark:text-amber-300 tracking-wider">
                    {displayRootLetters}
                  </span>
                </div>
              )}
              {transliteration && (
                <p className="text-sm font-mono italic text-slate-600 dark:text-slate-400 font-medium">
                  {transliteration}
                </p>
              )}
            </div>

            {/* Right: Large Arabic Word */}
            <div className="text-right">
              <span className="font-arabic-lg text-4xl sm:text-5xl font-bold text-primary dark:text-primary-light block leading-tight" dir="rtl">
                {wordArabic}
              </span>
            </div>
          </div>

          {/* Primary Indonesian Meaning */}
          <div className="pt-2 border-t border-amber-200/50 dark:border-slate-800">
            <span className="text-[11px] font-mono uppercase font-semibold text-slate-400 dark:text-slate-500 block mb-1">
              Makna / Definisi Kata:
            </span>
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-sans leading-snug">
              {meaningIndo || 'Kata dalam Al-Qur\'an'}
            </p>
          </div>

        </div>

        {/* Short Morphological / Grammatical Role Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
              <Compass className="w-4 h-4 text-primary" />
              <span>Bedah Singkat Sharaf &amp; Morfologi</span>
            </span>
            {root && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary-light font-mono font-bold">
                {root.totalOccurrences}x di Al-Qur&apos;an
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
            {displayPosDetail}
          </p>

          {root?.etymologyNote && (
            <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 italic">
              &ldquo;{root.etymologyNote}&rdquo;
            </div>
          )}
        </div>

        {/* Ayah Context Block (with active word highlighted) */}
        {ayahArabic && (
          <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Konteks Ayat:</span>
              </span>
              {surahNumber && ayahNumber && (
                <span className="text-[11px] font-mono text-slate-500">
                  Ayat Ke-{ayahNumber}
                </span>
              )}
            </div>

            {/* Arabic verse text with active word highlighted */}
            {renderHighlightedAyah()}

            {/* Translation Indonesian */}
            {ayahIndo && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  &ldquo;{ayahIndo}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {root ? (
            <Link
              href={`/akar/${root.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold shadow-soft hover:shadow-hover transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Bedah Akar Kata Lengkap ({root.rootLatin})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          ) : (
            <Link
              href={`/cari?q=${encodeURIComponent(wordArabic)}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-semibold shadow-soft hover:shadow-hover transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Cari Semua Kemunculan &ldquo;{wordArabic}&rdquo; di Al-Qur&apos;an</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
