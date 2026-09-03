import React from 'react';
import { BookOpen, Sparkles, Compass, ShieldCheck } from 'lucide-react';
import { QuranicUsagePattern } from '@/lib/types/morphology';

interface EtymologyCardProps {
  rootArabic: string;
  rootLatin: string;
  coreMeaning?: string;
  usagePatterns?: QuranicUsagePattern[];
  contextualNote?: string;
  etymologyNote?: string;
  meaningsIndonesian?: string[];
}

export default function EtymologyCard({
  rootArabic,
  rootLatin,
  coreMeaning,
  usagePatterns = [],
  contextualNote,
  etymologyNote,
  meaningsIndonesian = [],
}: EtymologyCardProps) {
  const displayCoreMeaning = coreMeaning || etymologyNote;

  return (
    <div className="p-6 sm:p-9 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-7 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-primary-subdued text-primary flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg sm:text-xl text-ink-primary font-sans">
              Makna &amp; Konteks
            </h3>
            <p className="text-xs text-ink-mute font-sans">
              Tadabbur semantik akar kata <span className="font-arabic font-bold text-primary" dir="rtl">{rootArabic}</span> ({rootLatin})
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-canvas-soft border border-hairline text-ink-mute font-sans">
          Catatan Semantik
        </span>
      </div>

      {/* 1. Makna Inti */}
      {displayCoreMeaning && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-mute flex items-center space-x-1.5 font-sans">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Makna Inti</span>
          </h4>
          <p className="text-base sm:text-lg text-ink-primary leading-relaxed font-normal">
            {displayCoreMeaning}
          </p>
        </div>
      )}

      {/* 2. Penggunaan dalam Al-Qur'an (Pola Kontekstual) */}
      {usagePatterns && usagePatterns.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-mute flex items-center space-x-1.5 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Penggunaan dalam Al-Qur&apos;an</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {usagePatterns.map((pattern, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-primary-subdued text-primary flex items-center justify-center text-xs font-bold font-sans">
                    {idx + 1}
                  </span>
                  <h5 className="font-semibold text-sm sm:text-base text-ink-primary font-sans">
                    {pattern.title}
                  </h5>
                </div>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                  {pattern.description}
                </p>

                {pattern.examples && pattern.examples.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center gap-1.5" dir="rtl">
                    {pattern.examples.map((ex, exIdx) => (
                      <span
                        key={exIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-canvas-surface border border-hairline text-xs font-arabic font-semibold text-primary"
                        dir="rtl"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Catatan Kontekstual */}
      {contextualNote && (
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft/60 border border-hairline/80 space-y-1.5">
          <span className="text-xs font-semibold text-ink-mute uppercase tracking-wider block font-sans">
            Catatan Kontekstual:
          </span>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans italic">
            &ldquo;{contextualNote}&rdquo;
          </p>
        </div>
      )}

      {/* Transparent Authoritative Provenance Attribution */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-hairline text-[11px] text-ink-mute font-sans">
        <span className="inline-flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Rujukan: Leksikografi Mu&apos;jam Al-Qur&apos;an &amp; Hans Wehr Lexicon.</span>
        </span>
        <span>Data morfologi &amp; konkordansi: QAC v0.4 (University of Leeds).</span>
      </div>
    </div>
  );
}
