'use client';

import React, { useState } from 'react';
import { VerseOccurrence } from '@/lib/types/morphology';
import { BookOpen, Layers } from 'lucide-react';
import WordByWordViewer from './WordByWordViewer';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabic: string;
  rootLatin: string;
}

export default function AyahConcordance({
  occurrences,
  rootArabic,
  rootLatin
}: AyahConcordanceProps) {
  const [showInterlinear, setShowInterlinear] = useState<Record<number, boolean>>({});

  const toggleInterlinear = (index: number) => {
    setShowInterlinear((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!occurrences || occurrences.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white border border-hairline rounded-2xl">
        Belum ada data sampel ayat untuk akar ini.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {occurrences.map((occ, idx) => {
        const isExpanded = showInterlinear[idx] ?? true;

        return (
          <div
            key={`${occ.surahNumber}-${occ.ayahNumber}-${idx}`}
            className="p-6 bg-white border border-hairline rounded-2xl shadow-soft hover:shadow-hover transition-all duration-200"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-hairline">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-primary-subdued text-primary-deep text-xs font-mono font-bold rounded-full">
                  QS. {occ.surahNameIndo} ({occ.surahNumber}) : {occ.ayahNumber}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {occ.surahNameArabic}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-400">
                  Lokasi: {occ.wordLocation}
                </span>
                {occ.wordSegments && (
                  <button
                    onClick={() => toggleInterlinear(idx)}
                    className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border border-hairline hover:bg-canvas-soft text-slate-700 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-primary" />
                    <span>{isExpanded ? 'Sembunyikan Per Kata' : 'Tampilkan Per Kata'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Arabic Verse */}
            <div className="text-right font-arabic text-2xl sm:text-3xl leading-loose text-ink-primary mb-4 dir-rtl">
              {occ.verseArabic}
            </div>

            {/* Highlighted matched word */}
            <div className="mb-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-center justify-between">
              <span className="font-semibold">Kata Terkait Akar [{rootArabic} / {rootLatin}]:</span>
              <span className="font-arabic text-base font-bold text-amber-950">
                {occ.matchedWordArabic} ({occ.matchedWordIndo})
              </span>
            </div>

            {/* Kemenag Indonesian Translation */}
            <p className="text-sm text-slate-700 leading-relaxed font-sans mb-2">
              <span className="font-semibold text-ink-primary">Terjemahan: </span>
              "{occ.verseIndo}"
            </p>

            {/* Interlinear Breakdown */}
            {occ.wordSegments && isExpanded && (
              <WordByWordViewer segments={occ.wordSegments} />
            )}
          </div>
        );
      })}
    </div>
  );
}
