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
  surahNumber,
  ayahNumber,
  wordIndex,
  ayahArabic,
  ayahIndo,
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
      .then(data => {
        if (isMounted && data && data.study) {
          setAsyncStudy(data.study);
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
    ayahIndo
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

  // If meaningIndo provided from WBW reader, use as primary meaning if study meaning is generic or raw citation
  if (meaningIndo && (!baseStudy.primaryMeaning.text || baseStudy.primaryMeaning.text.startsWith(': see') || baseStudy.primaryMeaning.text.startsWith('; see') || baseStudy.primaryMeaning.text.startsWith('and ') || baseStudy.primaryMeaning.text === 'Makna Leksikal Terindeks')) {
    baseStudy.primaryMeaning.text = meaningIndo;
    baseStudy.primaryMeaning.sourceBadge = 'Terjemahan Kata';
  }

  const study = baseStudy;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-primary/50 backdrop-blur-sm animate-fade-in font-sans"
      dir="ltr"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-canvas-page border border-hairline rounded-3xl shadow-float p-5 sm:p-7 space-y-6 animate-scale-up font-sans text-left"
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Eksplorasi Kata &amp; Leksikon
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline"
            title="Tutup (ESC)"
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
