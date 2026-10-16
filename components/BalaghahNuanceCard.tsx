'use client';

import React from 'react';
import { Compass, BookOpen, ChevronRight, HelpCircle, GitFork } from 'lucide-react';
import { getBalaghahComparison, SynonymComparison } from '@/lib/morphology/balaghah-database';

export type { SynonymComparison };

interface BalaghahNuanceCardProps {
  rootSlug?: string;
  customComparison?: SynonymComparison;
}

export default function BalaghahNuanceCard({ rootSlug, customComparison }: BalaghahNuanceCardProps) {
  const comparison = customComparison || getBalaghahComparison(rootSlug);

  if (!comparison) return null;

  return (
    <div className="bg-canvas-surface border border-hairline rounded-3xl p-5 sm:p-7 space-y-5 shadow-subtle font-sans">
      {/* Card Header */}
      <div className="flex items-center space-x-2 pb-3 border-b border-hairline">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <GitFork className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary block font-sans">
            Tadabbur Balaghah &amp; Pilihan Kata Al-Qur&apos;an
          </span>
          <h3 className="text-base font-bold text-ink-primary font-sans">
            {comparison.topicTitle}
          </h3>
        </div>
      </div>

      {/* Main Insight */}
      <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed bg-canvas-soft p-4 rounded-2xl border border-hairline font-sans">
        <strong className="text-primary font-semibold">Keindahan Pilihan Kata: </strong>
        {comparison.balaghahInsight}
      </p>

      {/* Two Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: Primary Word */}
        <div className="p-4 bg-canvas-soft border border-hairline rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <span className="font-arabic text-2xl font-bold text-primary" dir="rtl">
              {comparison.primaryWord.arabic}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-sans">
              {comparison.primaryWord.translit} ({comparison.primaryWord.root})
            </span>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed font-sans">
            {comparison.primaryNuance}
          </p>
          <div className="p-3 bg-canvas-surface border border-hairline rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-ink-mute uppercase block font-sans">
              Contoh Ayat ({comparison.primaryVerseExample.verseRef}):
            </span>
            <p className="font-arabic text-lg font-bold text-ink-primary" dir="rtl">
              {comparison.primaryVerseExample.textArabic}
            </p>
            <p className="text-[11px] text-ink-mute italic font-sans">
              &ldquo;{comparison.primaryVerseExample.translationIndo}&rdquo;
            </p>
          </div>
        </div>

        {/* Column 2: Compared Word */}
        <div className="p-4 bg-canvas-soft border border-hairline rounded-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <span className="font-arabic text-2xl font-bold text-ink-primary" dir="rtl">
              {comparison.comparedWord.arabic}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-canvas-surface text-ink-secondary border border-hairline font-sans">
              {comparison.comparedWord.translit} ({comparison.comparedWord.root})
            </span>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed font-sans">
            {comparison.comparedNuance}
          </p>
          <div className="p-3 bg-canvas-surface border border-hairline rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-ink-mute uppercase block font-sans">
              Contoh Ayat ({comparison.comparedVerseExample.verseRef}):
            </span>
            <p className="font-arabic text-lg font-bold text-ink-primary" dir="rtl">
              {comparison.comparedVerseExample.textArabic}
            </p>
            <p className="text-[11px] text-ink-mute italic font-sans">
              &ldquo;{comparison.comparedVerseExample.translationIndo}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
