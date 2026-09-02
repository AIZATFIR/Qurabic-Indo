import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';

interface EtymologyCardProps {
  rootArabic: string;
  rootLatin: string;
  etymologyNote?: string;
  meaningsIndonesian?: string[];
}

export default function EtymologyCard({
  rootArabic,
  rootLatin,
  etymologyNote,
  meaningsIndonesian = [],
}: EtymologyCardProps) {
  // Filter out redundant template generic text
  const cleanMeanings = meaningsIndonesian.filter(
    (m) => m && !m.startsWith('Makna terkait akar kata')
  );

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-hairline pb-3.5">
        <div className="flex items-center space-x-2.5">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-base sm:text-lg text-ink-primary font-sans">
            Makna &amp; Konteks
          </h3>
        </div>
        <span className="text-xs text-ink-mute font-sans">
          Akar: <strong className="text-primary font-arabic text-sm" dir="rtl">{rootArabic}</strong> ({rootLatin})
        </span>
      </div>

      {/* Semantic Overview Note */}
      {etymologyNote && (
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
          {etymologyNote}
        </p>
      )}

      {/* Primary Meaning Points if Available */}
      {cleanMeanings.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <span className="text-xs font-semibold text-ink-mute uppercase tracking-wider block font-sans">
            Cakupan Makna Pokok:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm font-sans">
            {cleanMeanings.map((meaning, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3.5 rounded-2xl bg-canvas-soft border border-hairline text-ink-primary"
              >
                <span className="w-5 h-5 rounded-full bg-primary-subdued text-primary flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 font-sans">
                  {idx + 1}
                </span>
                <span className="leading-relaxed font-medium">{meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Honest & Transparent Attribution Footer */}
      <div className="pt-2 flex justify-end border-t border-hairline">
        <span className="inline-flex items-center space-x-1.5 text-xs text-ink-mute font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>
            Catatan makna editorial (AI-assisted context). Morfologi &amp; konkordansi: QAC v0.4 (University of Leeds).
          </span>
        </span>
      </div>
    </div>
  );
}
