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

  useEffect(() => {
    setIsPlayingAudio(false);
  }, [isOpen, wordArabic]);

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
      <div className="font-arabic text-xl sm:text-2xl leading-loose text-right dir-rtl text-ink-primary dark:text-stone-200">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-stone-900 border border-hairline dark:border-hairline-dark rounded-2xl shadow-hover z-10 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-dark pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-primary-subdued dark:bg-primary/20 text-primary dark:text-primary-light text-xs font-semibold font-sans uppercase">
              {displayPosTag}
            </span>
            {surahNameIndo && (
              <span className="text-xs text-ink-mute dark:text-stone-400 font-sans">
                Q.S. {surahNameIndo} [{surahNumber}]:{ayahNumber}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              className={`p-1.5 rounded-full transition-all ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-105'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-600 dark:text-stone-300'
              }`}
              title="Dengarkan pelafalan kata"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Word Main Card - Fresh Emerald Surface */}
        <div className="p-5 rounded-xl bg-primary-fixed/50 dark:bg-canvas-dark-surface border border-primary/15 dark:border-hairline-dark space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              {displayRootLetters && (
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-ink-mute dark:text-stone-400 font-sans font-medium">
                    Akar:
                  </span>
                  <span className="font-arabic text-lg font-bold text-primary dark:text-primary-light tracking-wider">
                    {displayRootLetters}
                  </span>
                  {displayRootLatin && (
                    <span className="text-xs text-ink-mute dark:text-stone-400 font-sans">
                      ({displayRootLatin})
                    </span>
                  )}
                </div>
              )}
              {transliteration && (
                <p className="text-xs text-ink-secondary dark:text-stone-300 font-medium font-sans">
                  {transliteration}
                </p>
              )}
            </div>

            <div className="text-right">
              <span className="font-arabic-lg text-3xl sm:text-4xl font-bold text-ink-primary dark:text-white block leading-tight" dir="rtl">
                {wordArabic}
              </span>
            </div>
          </div>

          {/* Primary & Detailed Meanings */}
          <div className="pt-2 border-t border-[#EBE6DC] dark:border-stone-700 space-y-1.5">
            <p className="text-base font-bold text-ink-primary dark:text-white font-sans leading-snug">
              {wordDetail.primaryMeaning || meaningIndo || 'Kata dalam Al-Qur\'an'}
            </p>

            {wordDetail.meanings.length > 1 && (
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-semibold text-ink-mute dark:text-stone-400 uppercase tracking-wider block font-sans">
                  Ragam Definisi:
                </span>
                <ul className="space-y-1 text-xs text-ink-secondary dark:text-stone-300 font-sans">
                  {wordDetail.meanings.slice(1).map((m, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-primary font-bold text-xs mt-0.5">•</span>
                      <span className="leading-relaxed">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Deep Root Etymology & Grammatical Role */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-hairline dark:border-hairline-dark space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-ink-primary dark:text-stone-200 flex items-center space-x-1.5 font-sans">
              <Compass className="w-3.5 h-3.5 text-primary" />
              <span>Bedah Etimologi &amp; Morfologi</span>
            </span>
            {root && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-primary-subdued dark:bg-primary/20 text-primary dark:text-primary-light font-medium font-sans">
                {root.totalOccurrences}x di Al-Qur&apos;an
              </span>
            )}
          </div>

          <p className="text-xs text-ink-secondary dark:text-stone-300 font-sans leading-relaxed">
            {displayGrammar}
          </p>

          {wordDetail.rootExplanation && (
            <div className="p-3 bg-white dark:bg-stone-800 rounded-lg border border-hairline dark:border-hairline-dark text-xs text-ink-secondary dark:text-stone-300 leading-relaxed space-y-1 font-sans">
              <p>{wordDetail.rootExplanation}</p>
              {wordDetail.classicalCitation && (
                <p className="text-[11px] text-ink-mute dark:text-stone-400 italic pt-1 border-t border-hairline dark:border-hairline-dark">
                  {wordDetail.classicalCitation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Ayah Context Block */}
        {ayahArabic && (
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-hairline dark:border-hairline-dark space-y-2">
            <div className="flex items-center justify-between border-b border-hairline dark:border-hairline-dark pb-1.5">
              <span className="text-xs font-medium text-ink-mute dark:text-stone-400 flex items-center space-x-1 font-sans">
                <BookOpen className="w-3 h-3 text-primary" />
                <span>Konteks Ayat:</span>
              </span>
              {ayahNumber && (
                <span className="text-[11px] text-ink-mute dark:text-stone-400 font-sans">
                  Ayat {ayahNumber}
                </span>
              )}
            </div>

            {renderHighlightedAyah()}

            {ayahIndo && (
              <div className="pt-1 border-t border-hairline dark:border-hairline-dark">
                <p className="text-xs text-ink-secondary dark:text-stone-300 leading-relaxed italic font-sans">
                  &ldquo;{ayahIndo}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-1">
          {root ? (
            <Link
              href={`/akar/${root.id}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-subtle hover:shadow-soft transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buka Bedah Akar Kata Lengkap ({root.rootLatin})</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          ) : (
            <Link
              href={`/cari?q=${encodeURIComponent(wordArabic)}`}
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3 px-4 rounded-xl text-xs font-semibold shadow-subtle hover:shadow-soft transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cari Semua Kemunculan &ldquo;{wordArabic}&rdquo;</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>

      </div>
    </div>
  );
}
