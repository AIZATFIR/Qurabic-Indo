import React from 'react';
import { RootDistributionStats } from '@/lib/morphology/canonical-service';
import { BarChart3, PieChart, Layers } from 'lucide-react';

interface MorphologyDistributionProps {
  statistics: RootDistributionStats;
  rootArabic: string;
}

export default function MorphologyDistribution({ statistics, rootArabic }: MorphologyDistributionProps) {
  const { totalOccurrences, verbsCount, nounsCount, lemmaDistribution, formDistribution, uniqueSurahs } = statistics;

  const verbPercent = totalOccurrences > 0 ? Math.round((verbsCount / totalOccurrences) * 100) : 0;
  const nounPercent = totalOccurrences > 0 ? 100 - verbPercent : 0;

  return (
    <div className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h2 className="text-lg sm:text-xl font-semibold text-ink-primary font-sans">
            Distribusi Morfologi &amp; Frekuensi Korpus
          </h2>
        </div>
        <span className="text-xs text-ink-mute font-medium">
          {uniqueSurahs} Surah Tersebar
        </span>
      </div>

      {/* 1. POS Ratio Bar (Verba vs Nomina) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-ink-secondary">
          <span>Verba / Fi&apos;il: {verbsCount} ({verbPercent}%)</span>
          <span>Nomina / Isim: {nounsCount} ({nounPercent}%)</span>
        </div>
        <div className="h-3 w-full bg-canvas-soft rounded-full overflow-hidden flex border border-hairline">
          <div
            style={{ width: `${verbPercent}%` }}
            className="bg-primary transition-all duration-300"
            title={`Verba: ${verbsCount}`}
          />
          <div
            style={{ width: `${nounPercent}%` }}
            className="bg-primary-subdued border-l border-white/20 transition-all duration-300"
            title={`Nomina: ${nounsCount}`}
          />
        </div>
      </div>

      {/* 2. Grid: Lemma Distribution & Top Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Lemma Breakdown */}
        {lemmaDistribution && lemmaDistribution.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink-primary uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Distribusi Lemma ({lemmaDistribution.length} Leksikal Dasar)</span>
            </h3>

            <div className="space-y-2">
              {lemmaDistribution.map((lem, idx) => {
                const percent = Math.round((lem.count / totalOccurrences) * 100);
                const posLabel = lem.pos === 'V' ? "Fi'il" : 'Isim';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-canvas-soft border border-hairline flex items-center justify-between hover:border-primary/40 transition-colors text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-subdued text-primary font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-arabic text-lg font-bold text-primary mr-1" dir="rtl">
                        {lem.lemmaArabic}
                      </span>
                      <span className="text-[10px] text-ink-mute font-mono hidden sm:inline">
                        ({lem.lemmaBw})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-right">
                      <span className="px-2 py-0.5 rounded-md bg-canvas-surface border border-hairline text-[10px] text-ink-secondary">
                        {posLabel}
                      </span>
                      <span className="font-semibold text-ink-primary">
                        {lem.count} <span className="text-ink-mute font-normal text-[10px]">({percent}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Forms Breakdown */}
        {formDistribution && formDistribution.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-ink-primary uppercase tracking-wider flex items-center space-x-1.5">
              <PieChart className="w-3.5 h-3.5 text-primary" />
              <span>Bentuk Permukaan Terbanyak (Top {formDistribution.length})</span>
            </h3>

            <div className="space-y-2">
              {formDistribution.map((f, idx) => {
                const percent = Math.round((f.count / totalOccurrences) * 100);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-canvas-soft border border-hairline flex items-center justify-between hover:border-primary/40 transition-colors text-xs"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="font-arabic text-lg font-bold text-ink-primary mr-1" dir="rtl">
                        {f.formArabic}
                      </span>
                      <span className="text-[10px] text-ink-mute font-mono hidden sm:inline">
                        ({f.formBw})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-ink-primary">
                        {f.count} <span className="text-ink-mute font-normal text-[10px]">kali ({percent}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
