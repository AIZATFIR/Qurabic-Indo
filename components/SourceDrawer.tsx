'use client';

import React, { useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { X, ShieldCheck, ExternalLink, BookOpen, Layers, Award } from 'lucide-react';
import { SourceRegistry } from '@/lib/lexicon/types';
import { useModalBackHandler } from '@/lib/hooks/useModalBackHandler';

interface SourceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sources: SourceRegistry[];
  initialSourceId?: string;
}

export default function SourceDrawer({
  isOpen,
  onClose,
  sources,
  initialSourceId
}: SourceDrawerProps) {
  const { t, language } = useLanguage();
  const { layoutMode } = useTheme();
  const classic = layoutMode === 'classic';
  const { handleClose } = useModalBackHandler(isOpen, onClose, { modalName: 'source_drawer' });

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-primary/50 backdrop-blur-sm animate-fade-in font-sans"
      dir="ltr"
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="word-source-title"
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain bg-[var(--bg-surface)] text-[var(--color-ink-primary)] border border-hairline ${classic ? 'rounded-2xl' : 'rounded-none'} shadow-2xl p-6 sm:p-7 space-y-5 animate-scale-up text-left opacity-100`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 id="word-source-title" className="text-base font-bold text-ink-primary">
              {t('Sumber data', 'Data sources')}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline"
            title={t('Tutup', 'Close')}
            aria-label={t('Tutup sumber data', 'Close data sources')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          {t('Terjemahan kata, terjemahan ayat, anotasi tata bahasa, dan definisi kamus adalah sumber yang berbeda. Definisi Lane ditampilkan dalam bahasa Inggris aslinya. Transkripsi digital dapat mengandung kesalahan; periksa halaman rujukan untuk kajian lebih lanjut.', 'Word translations, verse translations, grammar annotations and dictionary definitions are different sources. Lane definitions retain their original English. Digital transcriptions can contain errors; consult the referenced page for further study.')}
        </p>

        {/* Sources List */}
        <div className="space-y-3.5">
          {sources.map((src) => {
            const isHighlighted = initialSourceId && src.id === initialSourceId;
            return (
              <div
                key={src.id}
                className={`py-4 border-b transition-all space-y-2 ${
                  isHighlighted
                    ? 'bg-primary-subdued/30 border-primary/40'
                    : 'bg-canvas-soft border-hairline'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-ink-primary">
                      {language === 'en' ? (src.nameEnglish || src.name) : src.name}
                    </h4>
                    {src.edition && (
                      <p className="text-sm text-ink-mute font-medium">
                        {src.edition}
                      </p>
                    )}
                  </div>
                  {src.license && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-canvas-surface border border-hairline text-ink-secondary whitespace-nowrap font-medium">
                      {src.license}
                    </span>
                  )}
                </div>

                {src.description && (
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {language === 'en' ? (src.descriptionEnglish || src.description) : src.description}
                  </p>
                )}

                {src.url && (
                  <div className="pt-1 flex items-center justify-end">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary hover:text-primary-deep inline-flex items-center space-x-1"
                    >
                      <span>{t('Buka sumber', 'Open source')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className={`p-3 bg-canvas-soft ${classic ? 'rounded-xl' : 'rounded-none'} border border-hairline text-sm text-ink-mute text-center`}>
          {t('Entry ini menampilkan terjemahan per kata dan anotasi sumber; narasi akar dan tasrif otomatis yang belum ditinjau tidak disertakan.', 'This entry shows sourced word translations and annotations. Unreviewed generated root narratives and conjugations are excluded.')}
        </div>
      </div>
    </div>
  );
}
