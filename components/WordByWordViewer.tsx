import React from 'react';
import { WordSegment } from '@/lib/types/morphology';
import GrammarBadge from './GrammarBadge';

interface WordByWordViewerProps {
  segments: WordSegment[];
}

export default function WordByWordViewer({ segments }: WordByWordViewerProps) {
  if (!segments || segments.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-hairline">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Analisis Morfologi Per Kata (Word-by-Word Interlinear)
        </span>
        <span className="text-[11px] font-mono text-primary bg-primary-subdued px-2.5 py-0.5 rounded-full font-medium">
          Quranic Corpus Parity
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {segments.map((seg) => (
          <div
            key={seg.wordIndex}
            className="p-3 bg-canvas-soft border border-hairline rounded-xl hover:border-primary-deep transition-all duration-200 flex flex-col justify-between text-center"
          >
            {/* Arabic Word */}
            <div className="font-arabic text-2xl font-bold text-ink-primary mb-1">
              {seg.arabic}
            </div>

            {/* Transliteration */}
            <div className="text-xs font-mono font-medium text-slate-700 italic mb-1.5">
              {seg.transliteration}
            </div>

            {/* POS Tag Badge */}
            <div className="mb-2 flex justify-center">
              <GrammarBadge posTagCode={seg.posTagCode} posTag={seg.posTag} />
            </div>

            {/* Indonesian Meaning */}
            <div className="text-xs font-sans text-ink-primary font-medium border-t border-hairline/60 pt-1.5 mt-auto">
              {seg.meaningIndo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
