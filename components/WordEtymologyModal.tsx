'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import WordStudy from './WordStudy';
import { useLanguage } from '@/lib/context/LanguageContext';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import { useModalBackHandler } from '@/lib/hooks/useModalBackHandler';

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
  const { t } = useLanguage();
  const [loadError, setLoadError] = useState(false);
  const [asyncStudy, setAsyncStudy] = useState<WordStudyViewModel | null>(null);

  // Reset asyncStudy when wordArabic changes or modal closes
  useEffect(() => {
    setAsyncStudy(null);
    setLoadError(false);
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
      wordIndex: wordIndex ? String(wordIndex) : '',
      meaning: meaningIndo || '',
      surahNameIndo: surahNameIndo || '',
      ayahArabic: ayahArabic || '',
      ayahIndo: ayahIndo || ''
    });

    fetch(`/api/word-detail?${query.toString()}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        const payload = json?.data?.study || json?.study;
        if (isMounted && payload) {
          setAsyncStudy(payload);
        } else if (isMounted) { setLoadError(true); }
      })
      .catch(() => { if (isMounted) setLoadError(true); });

    return () => {
      isMounted = false;
    };
  }, [isOpen, wordArabic, surahNumber, ayahNumber, wordIndex, meaningIndo, surahNameIndo, ayahArabic, ayahIndo]);

  // Mobile Back Button / Browser History Interception
  const { handleClose } = useModalBackHandler(isOpen, onClose, { modalName: 'word_study' });

  // Body scroll lock & ESC keyboard dismissal
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-primary/60 backdrop-blur-md animate-fade-in font-sans"
      dir="ltr"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-study-modal-title"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain bg-[var(--bg-surface)] text-[var(--color-ink-primary)] border border-hairline rounded-none shadow-2xl p-5 sm:p-8 space-y-6 animate-scale-up font-sans text-left opacity-100"
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Control Bar (Sticky with Glassmorphism) */}
        <div className="sticky top-0 z-20 -mx-5 -mt-5 sm:-mx-8 sm:-mt-8 px-5 py-4 sm:px-8 sm:py-4.5 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-hairline/80 flex items-center justify-between rounded-none shadow-xs">
          <div className="flex items-center space-x-2.5">
            <span id="word-study-modal-title" className="text-xs font-bold uppercase tracking-wider text-primary flex items-center space-x-1.5">
              <span>{t('Bedah kata Al-Qur’an', 'Quran word study')}</span>
            </span>
            {surahNumber && ayahNumber && wordIndex ? (
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                QS. {surahNumber}:{ayahNumber} (#{wordIndex})
              </span>
            ) : null}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-all border border-hairline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary flex items-center space-x-1"
            title={t('Tutup jendela (ESC)', 'Close window (ESC)')}
            aria-label={t('Tutup bedah kata', 'Close word study')}
          >
            <span className="text-xs font-semibold hidden sm:inline">{t('Tutup', 'Close')}</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Word Study Card */}
        {asyncStudy ? <WordStudy study={asyncStudy} onClose={handleClose} isModalMode={true} /> : <p role={loadError ? 'alert' : 'status'} className="py-12 text-center text-ink-secondary">{loadError ? t('Data kata tidak dapat dimuat. Tutup lalu buka kembali untuk mencoba lagi.', 'Word data could not be loaded. Close and reopen to retry.') : t('Memuat sumber kata…', 'Loading word sources…')}</p>}
      </div>
    </div>
  );
}
