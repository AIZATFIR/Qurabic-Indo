'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import { Search, X, BookOpen, Check } from 'lucide-react';
import { SURAH_LIST, searchSurahs, SurahMeta } from '@/lib/data/surah-list';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useModalBackHandler } from '@/lib/hooks/useModalBackHandler';

interface SurahSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurah: number;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
}

export default function SurahSearchModal({
  isOpen,
  onClose,
  selectedSurah,
  onSelectSurah,
}: SurahSearchModalProps) {
  const { language, t } = useLanguage();
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SurahMeta[]>(SURAH_LIST);
  const inputRef = useRef<HTMLInputElement>(null);

  const { handleClose } = useModalBackHandler(isOpen, onClose, { modalName: 'surah_search' });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults(SURAH_LIST);
      const previousFocus = document.activeElement as HTMLElement | null;
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 50);

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { e.preventDefault(); handleClose(); }
        if (e.key === 'Tab') {
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), [tabindex="0"]');
          if (!focusable?.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(focusTimer);
        previousFocus?.focus();
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleClose]);

  useEffect(() => {
    setResults(searchSurahs(query));
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (surahNumber: number) => {
    onSelectSurah(surahNumber);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overscroll-contain">
      <div className="fixed inset-0" onClick={handleClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-[82vh] flex flex-col bg-[var(--bg-surface)] text-ink-primary border border-hairline shadow-hover z-10 overflow-hidden overscroll-contain animate-in zoom-in-95 duration-150"
      >
        
        {/* Search Header */}
        <div className="p-4 border-b border-hairline space-y-3 bg-canvas-surface">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <h2 id={headingId} className="font-semibold text-base text-ink-primary font-sans">
                {t('Pilih surah', 'Choose a surah')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              aria-label={t('Tutup pencarian surah', 'Close surah search')}
              className="min-h-11 min-w-11 flex items-center justify-center p-1  text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('Cari surah', 'Search surahs')}
              placeholder={t('Cari nomor atau nama surah…', 'Search by surah number or name…')}
              className="w-full pl-10 pr-9 py-2.5  border border-hairline bg-canvas-soft text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label={t('Hapus pencarian', 'Clear search')}
                className="min-h-11 min-w-9 flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Surah Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-sm text-ink-mute font-medium mr-1 font-sans">{t('Cepat:', 'Quick access:')}</span>
            {[
              { num: 1, name: 'Al-Fatihah' },
              { num: 2, name: 'Al-Baqarah' },
              { num: 18, name: 'Al-Kahf' },
              { num: 36, name: 'Yasin' },
              { num: 55, name: 'Ar-Rahman' },
              { num: 56, name: 'Al-Waqi\'ah' },
              { num: 67, name: 'Al-Mulk' },
            ].map((qs) => (
              <button
                key={qs.num}
                onClick={() => handleSelect(qs.num)}
                className={`px-2 min-h-11 py-1 text-sm font-medium transition-all font-sans ${
                  selectedSurah === qs.num
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-canvas-soft hover:bg-primary-fixed text-ink-secondary'
                }`}
              >
                {qs.num}. {qs.name}
              </button>
            ))}
          </div>
        </div>

        {/* Surah List Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-hairline/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-ink-mute text-xs space-y-1 font-sans">
              <p>{t('Surah tidak ditemukan untuk', 'No surah found for')} &ldquo;{query}&rdquo;</p>
              <p className="text-sm opacity-75">{t('Coba nomor surah (1–114) atau ejaan Latin / Arab lainnya.', 'Try a surah number (1–114) or another Latin / Arabic spelling.')}</p>
            </div>
          ) : (
            results.map((surah) => {
              const isSelected = selectedSurah === surah.number;

              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelect(surah.number)}
                  aria-pressed={isSelected}
                  className={`w-full flex items-center justify-between p-3  transition-all text-left ${
                    isSelected
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-canvas-soft text-ink-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-sans flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-primary text-white shadow-subtle'
                          : 'bg-canvas-soft text-ink-secondary border border-hairline'
                      }`}
                    >
                      {surah.number}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold font-sans leading-tight">
                          Surah {language === 'en' ? surah.transliteration : surah.nameIndo}
                        </span>
                        <span className="text-xs text-ink-mute font-sans">
                          • {surah.ayahsCount} {t('ayat', 'verses')}
                        </span>
                      </div>
                      <p className="text-sm text-ink-mute font-sans">
                        {language === 'id' && <>{surah.translationId} · </>}{language === 'en' ? (surah.revelationType === 'Makkiyyah' ? 'Meccan' : 'Medinan') : surah.revelationType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <span className="font-arabic text-xl font-bold text-primary group-hover:scale-105 transition-transform" dir="rtl" lang="ar">
                      {surah.nameArabic}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-2.5 bg-canvas-soft border-t border-hairline text-center text-sm text-ink-mute font-sans">
          {t('114 surah Al-Qur’an · Pilih untuk membuka ayat dan makna kata', '114 surahs of the Quran · Choose one to read verses and explore words')}
        </div>

      </div>
    </div>
  );
}
