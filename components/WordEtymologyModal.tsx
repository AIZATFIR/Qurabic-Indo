'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, BookOpen, Volume2, ArrowRight, Layers, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { searchRoots, findBestMatchingRoot, stripArabicHarakat } from '@/lib/search/root-search';
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
  wordIndex?: number;
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
  wordIndex,
}: WordEtymologyModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCorpusOpen, setIsCorpusOpen] = useState(false);

  // Body scroll lock & ESC keyboard dismissal
  useEffect(() => {
    if (!isOpen) return;

    setIsPlayingAudio(false);
    setIsCorpusOpen(false);
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

  // 1. Get dictionary & root details
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

  const isParticle = wordDetail.posTag === 'Harf' || posTag === 'Harf';
  const displayRootLetters = isParticle ? '' : (root?.rootArabic || wordDetail.rootLetters || rootLetters);
  const displayRootLatin = isParticle ? '' : (root?.rootLatin || wordDetail.rootLatin);
  const displayPosTag = wordDetail.posTag || posTag || 'Isim';
  const displayGrammar = wordDetail.grammaticalRole || posDetail || (isParticle ? 'Harf / Partikel (Kaidah Nahwu)' : 'Isim (Kata Benda / Istilah)');
  const primaryMeaningClean = wordDetail.primaryMeaning || meaningIndo || 'Kosakata Al-Qur\'an';

  // Audio Playback
  const handlePlayAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    let audioSrc = audioUrl;
    if (!audioSrc && surahNumber && ayahNumber && wordIndex) {
      const sPad = String(surahNumber).padStart(3, '0');
      const aPad = String(ayahNumber).padStart(3, '0');
      const wPad = String(wordIndex).padStart(3, '0');
      audioSrc = `https://audio.qurancdn.com/wbw/${sPad}_${aPad}_${wPad}.mp3`;
    }

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
    const cleanTarget = stripArabicHarakat(wordArabic);

    return (
      <div className="font-arabic text-xl sm:text-2xl text-ink-primary text-right leading-[2.6] sm:leading-[2.8]" dir="rtl">
        {words.map((w, idx) => {
          const cleanW = stripArabicHarakat(w);
          const isMatch = cleanW === cleanTarget;

          if (isMatch) {
            return (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 mx-1 rounded-xl bg-primary text-white font-bold shadow-subtle"
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
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl sm:max-w-2xl max-h-[88vh] my-auto overflow-y-auto overscroll-contain bg-canvas-surface text-ink-primary border border-hairline rounded-3xl shadow-hover z-10 p-5 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150 font-sans">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-subdued text-primary text-xs font-semibold font-sans">
              {displayPosTag} {wordDetail.wazanOrForm ? `· ${wordDetail.wazanOrForm}` : ''}
            </span>
            {surahNameIndo && (
              <span className="text-xs text-ink-mute font-sans font-medium">
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

        {/* 1. Main Word Display & Meaning */}
        <div className="p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline space-y-3">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-lg sm:text-xl font-bold text-ink-primary font-sans leading-snug">
                {primaryMeaningClean}
              </p>
              {transliteration && (
                <p className="text-xs sm:text-sm text-ink-mute font-medium font-sans italic mt-0.5">
                  {transliteration}
                </p>
              )}
            </div>

            {/* Arabic Word Display */}
            <div className="text-right py-1" dir="rtl">
              <span className="font-arabic text-4xl sm:text-5xl font-bold text-ink-primary block leading-[2.0]" dir="rtl">
                {wordArabic}
              </span>
            </div>
          </div>

          {/* Word Actions & Root Link Banner */}
          <div className="pt-2 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-xs font-sans">
            <div className="flex items-center space-x-2">
              <span className="text-ink-mute font-medium">Akar:</span>
              {isParticle || !displayRootLetters ? (
                <span className="text-ink-mute italic">
                  Tidak memiliki akar (Partikel / Harf)
                </span>
              ) : (
                <>
                  <span className="font-arabic text-base font-bold text-primary" dir="rtl">
                    {displayRootLetters}
                  </span>
                  {displayRootLatin && (
                    <span className="text-ink-mute font-medium">
                      ({displayRootLatin})
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href={`/kata/${encodeURIComponent(wordArabic.trim())}`}
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center space-x-1.5"
              >
                <span>Buka Detail Kata</span>
                <ArrowRight aria-hidden="true" className="w-3 h-3" />
              </Link>
              {root && (
                <Link
                  href={`/akar/${root.id}`}
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-full bg-canvas-surface hover:bg-canvas-page border border-hairline text-ink-primary hover:text-primary text-xs font-semibold transition-all inline-flex items-center space-x-1.5"
                >
                  <span>Akar</span>
                  <ExternalLink aria-hidden="true" className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 2. Bentuk Kata & Peran Morfologis */}
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline space-y-2 text-xs sm:text-sm font-sans">
          <div className="flex items-center space-x-2 font-semibold text-ink-primary">
            <Layers className="w-4 h-4 text-primary" />
            <span>Bentuk Kata &amp; Peran Morfologi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-canvas-soft rounded-xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Kategori Gramatikal:</span>
              <span className="font-semibold text-ink-primary">{displayGrammar || displayPosTag}</span>
            </div>
            <div className="p-2.5 bg-canvas-soft rounded-xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Wazan / Pola:</span>
              <span className="font-semibold text-ink-primary">{wordDetail.wazanOrForm || (isParticle ? 'Mabni (Tetap)' : 'Bentuk Leksikal')}</span>
            </div>
          </div>
        </div>

        {/* 3. Konteks Ayat & Terjemahan Kemenag RI */}
        {ayahArabic && (
          <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-3 font-sans">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <span className="text-xs font-semibold text-ink-primary flex items-center space-x-1.5 font-sans">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Konteks Ayat dalam Mushaf:</span>
              </span>
              {surahNumber && ayahNumber && (
                <Link
                  href={`/baca?surah=${surahNumber}&ayah=${ayahNumber}`}
                  onClick={onClose}
                  className="text-xs text-primary hover:underline font-semibold inline-flex items-center space-x-1"
                >
                  <span>Buka di Mushaf</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {renderHighlightedAyah()}

            {ayahIndo && (
              <div className="pt-2 border-t border-hairline space-y-1">
                <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider block">
                  Terjemahan Kemenag RI:
                </span>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-normal">
                  &ldquo;{ayahIndo}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. Collapsible Detail Corpus (Depth on Demand) */}
        <div className="border-t border-hairline pt-2">
          <button
            onClick={() => setIsCorpusOpen(!isCorpusOpen)}
            className="w-full flex items-center justify-between py-2 text-xs text-ink-mute hover:text-ink-primary font-medium font-sans transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Detail Corpus (QAC v0.4 · University of Leeds)</span>
            </span>
            {isCorpusOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isCorpusOpen && (
            <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline text-xs font-mono space-y-1.5 mt-2 animate-in fade-in duration-150">
              <div className="flex justify-between">
                <span className="text-ink-mute">Lemma:</span>
                <span className="text-ink-primary">{isParticle ? '-' : (wordDetail.rootLatin || '-')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-mute">Root:</span>
                <span className="text-ink-primary">{isParticle ? 'Tidak berakar (Partikel / Harf)' : (displayRootLetters || '-')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-mute">POS Category:</span>
                <span className="text-ink-primary">{displayPosTag}</span>
              </div>
              {surahNumber && ayahNumber && (
                <div className="flex justify-between">
                  <span className="text-ink-mute">QAC Coordinate:</span>
                  <span className="text-ink-primary">{surahNumber}:{ayahNumber}:{wordIndex || 1}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
