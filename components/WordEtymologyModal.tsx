'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getWordStudy } from '@/lib/morphology/word-study-service';
import WordStudy from './WordStudy';
import { WordStudyViewModel } from '@/lib/lexicon/types';

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
  posTag,
  posDetail,
  matchedRootSlug,
  rootLetters,
  surahNumber,
  ayahNumber,
  wordIndex,
  ayahArabic,
  ayahIndo,
  surahNameIndo,
}: WordEtymologyModalProps) {
  const [asyncStudy, setAsyncStudy] = useState<WordStudyViewModel | null>(null);

  // Reset asyncStudy when wordArabic changes or modal closes
  useEffect(() => {
    setAsyncStudy(null);
  }, [isOpen, wordArabic]);

  // Fetch authoritative server-side WordStudy when modal opens
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
      .then(json => {
        const payload = json?.data?.study || json?.study;
        if (isMounted && payload) {
          setAsyncStudy(payload);
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Resolve base study model
  const initialStudy = getWordStudy(wordArabic, {
    surahNumber,
    ayahNumber,
    wordIndex,
    ayahArabic,
    ayahIndo,
    surahNameIndo
  });

  const baseStudy = asyncStudy ? { ...asyncStudy } : { ...initialStudy };

  // Invariant: Ensure Arabic text is always the genuine Arabic word, never a coordinate or number
  if (!baseStudy.identity.arabic || baseStudy.identity.arabic.includes(':') || /^\d+$/.test(baseStudy.identity.arabic)) {
    baseStudy.identity.arabic = wordArabic;
  }

  // If transliteration provided from reader, attach to identity
  if (transliteration && (!baseStudy.identity.transliteration || baseStudy.identity.transliteration.startsWith('Kata '))) {
    baseStudy.identity.transliteration = transliteration;
  }

  // Always prioritize authentic meaningIndo from WBW reader as the primary meaning
  if (meaningIndo && meaningIndo.trim()) {
    baseStudy.primaryMeaning.text = meaningIndo.charAt(0).toUpperCase() + meaningIndo.slice(1);
    baseStudy.primaryMeaning.sourceBadge = 'Terjemahan Kata';
    baseStudy.primaryMeaning.isEditorialSummary = false;
  }

  // Ensure context contains all verse and ayah references
  if (!baseStudy.context) {
    baseStudy.context = {};
  }
  if (surahNumber) baseStudy.context.surahNumber = surahNumber;
  if (ayahNumber) baseStudy.context.ayahNumber = ayahNumber;
  if (wordIndex) baseStudy.context.wordIndex = wordIndex;
  if (ayahArabic) baseStudy.context.ayahArabic = ayahArabic;
  if (ayahIndo) baseStudy.context.ayahIndo = ayahIndo;
  if (surahNameIndo) baseStudy.context.surahNameIndo = surahNameIndo;

  // If reader provided root or grammar, ensure they populate if missing from initial study
  if (rootLetters && !baseStudy.lexical.rootArabic) {
    baseStudy.lexical.rootArabic = rootLetters;
    baseStudy.lexical.rootSlug = matchedRootSlug;
  }
  if (posTag && (!baseStudy.morphology.pos || baseStudy.morphology.pos === 'Isim')) {
    if (posTag === "Fi'il" || posTag === 'Harf') {
      baseStudy.morphology.pos = posTag;
    }
  }
  if (posDetail && (!baseStudy.morphology.grammaticalRole || baseStudy.morphology.grammaticalRole.includes('Kosakata Terindeks'))) {
    baseStudy.morphology.grammaticalRole = posDetail;
  }

  const study = baseStudy;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-primary/60 backdrop-blur-md animate-fade-in font-sans"
      dir="ltr"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-study-modal-title"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto overscroll-contain bg-[var(--bg-surface)] text-[var(--color-ink-primary)] border border-hairline rounded-3xl shadow-2xl p-5 sm:p-7 space-y-6 animate-scale-up font-sans text-left opacity-100"
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <span id="word-study-modal-title" className="text-xs font-bold uppercase tracking-wider text-primary">
            Bedah Kata &amp; Leksikon
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Tutup (ESC)"
            aria-label="Tutup Jendela Eksplorasi Kata"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Word Study Card */}
        <WordStudy study={study} onClose={onClose} isModalMode={true} />
      </div>
    </div>
  );
}
