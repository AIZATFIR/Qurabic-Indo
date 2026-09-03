'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, BookOpen, Volume2, ArrowRight, Layers, ChevronDown, ChevronUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { getCanonicalWordDetail } from '@/lib/morphology/canonical-service';
import { stripArabicHarakat } from '@/lib/search/root-search';

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
  surahNumber?: number;
  ayahNumber?: number;
  wordIndex?: number;
  surahNameIndo?: string;
  ayahArabic?: string;
  ayahIndo?: string;
}

export default function WordEtymologyModal({
  isOpen,
  onClose,
  wordArabic,
  transliteration,
  meaningIndo,
  audioUrl,
  surahNumber,
  ayahNumber,
  wordIndex,
  surahNameIndo,
  ayahArabic,
  ayahIndo,
}: WordEtymologyModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCorpusOpen, setIsCorpusOpen] = useState(false);
  const [asyncModel, setAsyncModel] = useState<any>(null);

  // Fetch authoritative server-side CanonicalWordDetail when modal opens
  useEffect(() => {
    if (!isOpen || !wordArabic) return;
    let isMounted = true;

    const locParam = (surahNumber && ayahNumber && wordIndex) ? `${surahNumber}:${ayahNumber}:${wordIndex}` : '';
    const query = new URLSearchParams({
      word: wordArabic,
      location: locParam,
      surah: surahNumber ? String(surahNumber) : '',
      ayah: ayahNumber ? String(ayahNumber) : '',
      wordIndex: wordIndex ? String(wordIndex) : ''
    });

    fetch(`/api/word-detail?${query.toString()}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (isMounted && data && !data.error) {
          setAsyncModel(data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [isOpen, wordArabic, surahNumber, ayahNumber, wordIndex]);

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

  // 1. Single Canonical Word Detail Resolver (Async authoritative server model prioritized)
  const wordModel = asyncModel || getCanonicalWordDetail(wordArabic, {
    surahNumber,
    ayahNumber,
    wordIndex,
    ayahArabic,
    ayahIndo
  });

  const isParticle = wordModel.morphology.isParticle;
  const displayPosTag = wordModel.morphology.pos;
  const displayGrammar = wordModel.morphology.grammaticalRole;
  const wazanOrForm = wordModel.morphology.wazanOrForm;
  const displayRootLetters = wordModel.lexical.rootArabic;
  const rootSlug = wordModel.lexical.rootSlug;
  const lemmaArabic = wordModel.lexical.lemmaArabic;
  const primaryMeaningClean = wordModel.translation.primaryMeaning || meaningIndo || 'Kosakata Al-Qur\'an';

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

  // Safe highlighted ayah context
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-primary/40 backdrop-blur-sm animate-fade-in font-sans" dir="ltr">
      <div
        className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-canvas-surface border border-hairline rounded-3xl shadow-float p-5 sm:p-7 space-y-6 animate-scale-up font-sans text-left"
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3.5" dir="ltr">
          <div className="flex items-center space-x-2 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-primary font-sans">
              Analisis Morfologi Kata
            </span>
            <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
              {displayPosTag}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Audio Pronunciation Button */}
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              title="Dengarkan pengucapan kata"
              className={`p-2 rounded-full transition-all border border-hairline ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-105 shadow-subtle animate-pulse'
                  : 'bg-canvas-soft hover:bg-canvas-page text-ink-secondary hover:text-primary'
              }`}
            >
              <Volume2 aria-hidden="true" className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline"
              title="Tutup (ESC)"
            >
              <X aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Main Word Header Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-canvas-soft border border-hairline space-y-3.5 text-center font-sans" dir="ltr">
          <div className="py-1" dir="rtl">
            <span
              className="font-arabic text-5xl sm:text-6xl font-bold text-primary tracking-wide block leading-[2.2] sm:leading-[2.4]"
              dir="rtl"
            >
              {wordArabic}
            </span>
          </div>

          {transliteration && (
            <span className="text-xs sm:text-sm font-medium text-ink-mute font-sans tracking-wide block">
              — {transliteration} —
            </span>
          )}

          {primaryMeaningClean && (
            <h3 className="text-lg sm:text-xl font-bold text-ink-primary tracking-tight font-sans">
              &ldquo;{primaryMeaningClean}&rdquo;
            </h3>
          )}

          {/* Word Actions & Root Link Banner */}
          <div className="pt-2 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-xs font-sans" dir="ltr">
            <div className="flex items-center space-x-2 text-left">
              <span className="text-ink-mute font-medium">Akar:</span>
              {isParticle ? (
                <span className="text-ink-mute italic">
                  Partikel / Harf (Tidak memiliki akar kata)
                </span>
              ) : displayRootLetters ? (
                <span className="font-arabic text-base font-bold text-primary" dir="rtl">
                  {displayRootLetters}
                </span>
              ) : (
                <span className="text-ink-mute">
                  —
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href={`/kata/${encodeURIComponent(wordArabic.trim())}${surahNumber && ayahNumber ? `?surah=${surahNumber}&ayah=${ayahNumber}&wordIndex=${wordIndex || 1}` : ''}`}
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center space-x-1.5"
              >
                <span>Buka Detail Kata</span>
                <ArrowRight aria-hidden="true" className="w-3 h-3" />
              </Link>
              {rootSlug && !isParticle && (
                <Link
                  href={`/akar/${rootSlug}`}
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

        {/* 2. Makna Leksikal Klasik (Lane's Arabic-English Lexicon) */}
        {(wordModel.lexicon?.hasLexicalData || !isParticle) && wordModel.lexicon && (
          <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline space-y-2.5 text-xs sm:text-sm font-sans text-left" dir="ltr">
            <div className="flex items-center justify-between font-semibold text-ink-primary border-b border-hairline pb-2">
              <span className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>
                  {wordModel.lexicon.isRootEntry
                    ? "Makna Berdasarkan Akar Kata (Lane's Lexicon)"
                    : "Definisi Leksikal Kata (Lane's Lexicon)"}
                </span>
              </span>
              <div className="flex items-center space-x-1.5">
                {wordModel.lexicon.isRootEntry ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-canvas-soft border border-hairline text-ink-secondary font-medium">
                    Entri Akar
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
                    Definisi Lemma
                  </span>
                )}
                {wordModel.lexicon.matchedForm && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
                    {wordModel.lexicon.matchedForm}
                  </span>
                )}
              </div>
            </div>

            {wordModel.lexicon.hasLexicalData && wordModel.lexicon.senses.length > 0 ? (
              <div className="space-y-2 pt-1">
                {wordModel.lexicon.senses.slice(0, 2).map((s: any, idx: number) => (
                  <p key={idx} className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-serif italic">
                    &ldquo;{s.text}&rdquo;
                  </p>
                ))}
                <div className="pt-2 border-t border-hairline text-[11px] text-ink-mute flex items-center justify-between">
                  <span>Edward William Lane, An Arabic-English Lexicon · Book I, Part {wordModel.lexicon.volume}, p. {wordModel.lexicon.page}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-ink-mute italic py-1">
                Makna leksikal klasik belum terindeks untuk kata ini.
              </p>
            )}
          </div>
        )}

        {/* 3. Bentuk Kata & Peran Morfologis */}
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline space-y-2 text-xs sm:text-sm font-sans text-left" dir="ltr">
          <div className="flex items-center space-x-2 font-semibold text-ink-primary">
            <Layers className="w-4 h-4 text-primary" />
            <span>Bentuk Kata &amp; Peran Morfologi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-canvas-soft rounded-xl border border-hairline text-left">
              <span className="text-ink-mute block text-[11px]">Kategori Gramatikal:</span>
              <span className="font-semibold text-ink-primary">{displayGrammar}</span>
            </div>
            <div className="p-2.5 bg-canvas-soft rounded-xl border border-hairline text-left">
              <span className="text-ink-mute block text-[11px]">Wazan / Pola:</span>
              <span className="font-semibold text-ink-primary">{wazanOrForm || (isParticle ? 'Mabni (Tetap)' : '—')}</span>
            </div>
          </div>
        </div>

        {/* 4. Konteks Ayat & Terjemahan Kemenag RI */}
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
                  <ExternalLink aria-hidden="true" className="w-3 h-3" />
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
                <span className="text-ink-primary">
                  {lemmaArabic ? `${lemmaArabic} ` : ''}({wordModel.lexical.lemma || '-'})
                </span>
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
              {wordModel.corpus.buckwalter && (
                <div className="flex justify-between">
                  <span className="text-ink-mute">Buckwalter Stem:</span>
                  <span className="text-ink-primary">{wordModel.corpus.buckwalter}</span>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
