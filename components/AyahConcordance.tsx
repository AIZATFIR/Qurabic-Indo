'use client';

import React, { useState } from 'react';
import { VerseOccurrence, WordSegment } from '@/lib/types/morphology';
import WordByWordViewer from './WordByWordViewer';
import { Copy, Check, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabic: string;
  rootLatin: string;
}

export default function AyahConcordance({ occurrences, rootArabic, rootLatin }: AyahConcordanceProps) {
  const [openInterlinearId, setOpenInterlinearId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!occurrences || occurrences.length === 0) {
    return (
      <div className="p-8 text-center bg-canvas-soft border border-hairline rounded-2xl text-slate-500 font-sans">
        Belum ada contoh kemunculan ayat yang terdaftar untuk akar kata ini.
      </div>
    );
  }

  const toggleInterlinear = (key: string) => {
    setOpenInterlinearId(openInterlinearId === key ? null : key);
  };

  const handleCopyVerse = (item: VerseOccurrence, key: string) => {
    const textToCopy = `${item.verseArabic}\n\n"${item.verseIndo}"\n\n(Q.S. ${item.surahNameIndo} [${item.surahNumber}]: ${item.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-6">
      {occurrences.map((item, idx) => {
        const itemKey = `${item.surahNumber}-${item.ayahNumber}-${idx}`;
        const isInterlinearOpen = openInterlinearId === itemKey;
        const isCopied = copiedKey === itemKey;

        // Generate synthetic interlinear segments for demo
        const words = item.verseArabic.split(/\s+/);
        const segments: WordSegment[] = words.map((w, i) => {
          const tagCode: 'N' | 'V' | 'P' = i % 3 === 0 ? 'N' : i % 3 === 1 ? 'V' : 'P';
          return {
            wordIndex: i + 1,
            arabic: w,
            transliteration: i % 2 === 0 ? 'ism' : 'fi\'il',
            posTagCode: tagCode,
            posTag: tagCode === 'N' ? 'Isim' : tagCode === 'V' ? "Fi'il" : 'Haraf',
            meaningIndo: item.matchedWordIndo || 'Terjemahan kata',
            wordLocation: `${item.surahNumber}:${item.ayahNumber}:${i + 1}`
          };
        });

        return (
          <div
            key={itemKey}
            className="p-6 sm:p-8 bg-white border border-hairline rounded-3xl shadow-soft hover:border-slate-300 transition-all space-y-4"
          >
            {/* Header Badge & Copy Button */}
            <div className="flex items-center justify-between border-b border-hairline pb-4">
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 rounded-full bg-primary-subdued text-primary font-bold font-mono text-xs flex items-center justify-center">
                  {item.surahNumber}
                </span>
                <div>
                  <h4 className="font-semibold text-ink-primary text-base font-sans">
                    Q.S. {item.surahNameIndo} ({item.surahNameArabic}) : Ayat {item.ayahNumber}
                  </h4>
                  <span className="text-xs text-slate-500 font-mono">
                    Akar Kata Terkait: <strong className="text-primary font-arabic text-sm">{rootArabic}</strong> ({rootLatin})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyVerse(item, itemKey)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isCopied
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-canvas-soft hover:bg-slate-100 border border-hairline text-slate-600'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin Ayat'}</span>
                </button>

                <button
                  onClick={() => toggleInterlinear(itemKey)}
                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full bg-primary-subdued text-primary-deep hover:bg-primary/20 text-xs font-semibold transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{isInterlinearOpen ? 'Tutup Interlinear' : 'Analisis Per Kata'}</span>
                  {isInterlinearOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Verse Arabic Utsmani Text */}
            <div className="py-2 text-right dir-rtl">
              <p className="font-arabic text-2xl sm:text-4xl text-ink-primary leading-loose tracking-wide">
                {item.verseArabic}
              </p>
            </div>

            {/* Indonesian Translation */}
            <div className="bg-canvas-soft border border-hairline rounded-2xl p-4 text-sm text-slate-700 leading-relaxed font-sans">
              <span className="font-semibold text-ink-primary block mb-1 text-xs uppercase tracking-wider font-mono">
                Terjemahan Bahasa Indonesia (Kemenag RI):
              </span>
              &ldquo;{item.verseIndo}&rdquo;
            </div>

            {/* Interlinear Accordion */}
            {isInterlinearOpen && (
              <WordByWordViewer segments={segments} />
            )}
          </div>
        );
      })}
    </div>
  );
}
