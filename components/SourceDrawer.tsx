'use client';

import React from 'react';
import { X, ShieldCheck, ExternalLink, BookOpen, Layers, Award } from 'lucide-react';
import { SourceRegistry } from '@/lib/lexicon/types';

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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-ink-primary/50 backdrop-blur-sm animate-fade-in font-sans"
      dir="ltr"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-canvas-surface border border-hairline rounded-3xl shadow-float p-6 sm:p-7 space-y-5 animate-scale-up text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-base font-bold text-ink-primary">
              Otoritas &amp; Provenansi Data
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          Setiap data linguistik, leksikografi, dan teks di Qurabic bersumber dari repositori terverifikasi dan dapat ditelusuri langsung ke publikasi akademis aslinya.
        </p>

        {/* Sources List */}
        <div className="space-y-3.5">
          {sources.map((src) => {
            const isHighlighted = initialSourceId && src.id === initialSourceId;
            return (
              <div
                key={src.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 ${
                  isHighlighted
                    ? 'bg-primary-subdued/30 border-primary/40'
                    : 'bg-canvas-soft border-hairline'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-ink-primary">
                      {src.name}
                    </h4>
                    {src.edition && (
                      <p className="text-[11px] text-ink-mute font-medium">
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
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    {src.description}
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
                      <span>Lihat Rujukan Asli</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-canvas-soft rounded-2xl border border-hairline text-[11px] text-ink-mute text-center">
          Prinsip Integritas Qurabic: Zero AI-generated classical citations. Semua kutipan terikat ke edisi digital resmi.
        </div>
      </div>
    </div>
  );
}
