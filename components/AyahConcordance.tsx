'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VerseOccurrence, WordSegment } from '@/lib/types/morphology';
import { fetchVerseWords } from '@/lib/api/quran-corpus-api';
import WordByWordViewer from './WordByWordViewer';
import { Copy, Check, BookOpen, ChevronDown, ChevronUp, ExternalLink, ArrowDown } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabic: string;
  rootLatin: string;
}

const INITIAL_VISIBLE_COUNT = 8;

export default function AyahConcordance({ occurrences = [], rootArabic, rootLatin }: AyahConcordanceProps) {
  const [openInterlinearId, setOpenInterlinearId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [segmentsMap, setSegmentsMap] = useState<Record<string, WordSegment[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_VISIBLE_COUNT);

  if (!occurrences || occurrences.length === 0) {
    return (
      <div className="p-8 text-center bg-canvas-surface border border-hairline rounded-2xl text-ink-mute font-sans shadow-subtle">
        Belum ada contoh kemunculan ayat yang terdaftar untuk akar kata ini.
      </div>
    );
  }

  const displayedOccurrences = occurrences.slice(0, visibleCount);
  const hasMore = visibleCount < occurrences.length;

  const toggleInterlinear = async (item: VerseOccurrence, key: string) => {
    if (openInterlinearId === key) {
      setOpenInterlinearId(null);
      return;
    }

    setOpenInterlinearId(key);

    if (segmentsMap[key] || (item.wordSegments && item.wordSegments.length > 0)) {
      if (item.wordSegments && !segmentsMap[key]) {
        setSegmentsMap((prev) => ({ ...prev, [key]: item.wordSegments! }));
      }
      return;
    }

    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    try {
      const verseKey = `${item.surahNumber}:${item.ayahNumber}`;
      const data = await fetchVerseWords(verseKey);
      setSegmentsMap((prev) => ({ ...prev, [key]: data }));
    } catch (err) {
      console.error('Error loading verse words:', err);
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleCopyVerse = (item: VerseOccurrence, key: string) => {
    const textToCopy = `${item.verseArabic}\n\n"${item.verseIndo}"\n\n(Q.S. ${item.surahNameIndo} [${item.surahNumber}]: ${item.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, occurrences.length));
  };

  const handleShowAll = () => {
    setVisibleCount(occurrences.length);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Count Summary */}
      <div className="flex items-center justify-between text-xs text-ink-mute pb-3 border-b border-hairline">
        <span>
          Menampilkan <strong className="text-ink-primary font-semibold">{displayedOccurrences.length}</strong> dari{' '}
          <strong className="text-ink-primary font-semibold">{occurrences.length}</strong> ayat kemunculan otentik
        </span>
        {hasMore && (
          <button
            onClick={handleShowAll}
            className="text-primary hover:underline font-medium text-xs transition-colors"
          >
            Buka Seluruh ({occurrences.length}) Ayat
          </button>
        )}
      </div>

      {/* List of Verified Verses */}
      <div className="space-y-5">
        {displayedOccurrences.map((item, idx) => {
          const itemKey = `${item.surahNumber}-${item.ayahNumber}-${idx}`;
          const isInterlinearOpen = openInterlinearId === itemKey;
          const isCopied = copiedKey === itemKey;
          const isLoadingSegments = loadingMap[itemKey];
          const activeSegments = segmentsMap[itemKey] || item.wordSegments;

          return (
            <div
              key={itemKey}
              className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle hover:border-primary/30 transition-all space-y-4"
            >
              {/* Header Badge & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3.5">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 rounded-xl bg-primary-subdued text-primary font-semibold text-xs flex items-center justify-center font-sans">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-ink-primary text-sm sm:text-base font-sans">
                      Q.S. {item.surahNameIndo} [{item.surahNumber}]: {item.ayahNumber}
                    </h4>
                    {item.matchedWordArabic && (
                      <span className="text-xs text-ink-mute font-sans">
                        Kata: <strong className="text-primary font-arabic text-sm" dir="rtl">{item.matchedWordArabic}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button Group */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/baca?surah=${item.surahNumber}&ayah=${item.ayahNumber}`}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-canvas-soft hover:bg-canvas-page border border-hairline text-xs font-medium text-ink-secondary hover:text-primary transition-all font-sans"
                  >
                    <span>Buka di Mushaf</span>
                    <ExternalLink className="w-3 h-3 text-ink-mute" />
                  </Link>

                  <button
                    onClick={() => handleCopyVerse(item, itemKey)}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all font-sans ${
                      isCopied
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-secondary'
                    }`}
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-ink-mute" />}
                    <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                  </button>

                  <button
                    onClick={() => toggleInterlinear(item, itemKey)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-primary-subdued text-primary hover:bg-primary/20 text-xs font-medium transition-all font-sans"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{isInterlinearOpen ? 'Tutup Analisis' : 'Analisis Kata'}</span>
                    {isInterlinearOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Verse Arabic Text with Generous Line-Height & RTL */}
              <div className="py-2 text-right" dir="rtl">
                <p
                  className="font-arabic text-2xl sm:text-3xl text-ink-primary leading-[2.6] sm:leading-[2.8] tracking-wide"
                  dir="rtl"
                >
                  {item.verseArabic}
                </p>
              </div>

              {/* Indonesian Translation */}
              <div className="bg-canvas-soft border border-hairline rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-ink-secondary leading-relaxed font-sans space-y-1">
                <span className="font-semibold text-ink-primary block text-[11px] uppercase tracking-wider font-sans">
                  Terjemahan Kemenag RI:
                </span>
                <p className="font-normal text-ink-primary leading-relaxed">&ldquo;{item.verseIndo}&rdquo;</p>
              </div>

              {/* Interlinear Accordion */}
              {isInterlinearOpen && (
                <div className="pt-2 border-t border-hairline">
                  {isLoadingSegments ? (
                    <div className="p-6 text-center text-xs text-ink-mute font-sans flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Memuat analisis morfologi perkata...</span>
                    </div>
                  ) : activeSegments && activeSegments.length > 0 ? (
                    <WordByWordViewer segments={activeSegments} />
                  ) : (
                    <div className="p-4 text-center text-xs text-ink-mute font-sans">
                      Data morfologi perkata tersedia melalui tampilan Mushaf.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progressive Load More Buttons */}
      {hasMore && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleLoadMore}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-canvas-surface hover:bg-canvas-soft border border-hairline text-ink-primary text-xs sm:text-sm font-semibold shadow-subtle transition-all flex items-center justify-center space-x-2"
          >
            <ArrowDown className="w-4 h-4 text-primary" />
            <span>Tampilkan 10 Ayat Lagi</span>
          </button>
          <button
            onClick={handleShowAll}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all"
          >
            Tampilkan Seluruh ({occurrences.length}) Ayat
          </button>
        </div>
      )}
    </div>
  );
}
