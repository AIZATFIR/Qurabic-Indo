'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { VerseOccurrence, WordSegment } from '@/lib/types/morphology';
import { fetchVerseWords } from '@/lib/api/quran-corpus-api';
import WordByWordViewer from './WordByWordViewer';
import { Copy, Check, BookOpen, ChevronDown, ChevronUp, ShieldCheck, Loader2, ArrowRight, ExternalLink } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabic: string;
  rootLatin: string;
}

const INITIAL_VISIBLE_COUNT = 5;

export default function AyahConcordance({ occurrences, rootArabic, rootLatin }: AyahConcordanceProps) {
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

    // If segments already loaded in cache or directly attached, reuse
    if (segmentsMap[key] || (item.wordSegments && item.wordSegments.length > 0)) {
      if (item.wordSegments && !segmentsMap[key]) {
        setSegmentsMap((prev) => ({ ...prev, [key]: item.wordSegments! }));
      }
      return;
    }

    // Fetch real word-by-word data from Quran.com API v4
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
      <div className="flex items-center justify-between text-xs text-ink-mute pb-2 border-b border-hairline">
        <span>
          Menampilkan <strong className="text-ink-primary font-semibold">{displayedOccurrences.length}</strong> dari{' '}
          <strong className="text-ink-primary font-semibold">{occurrences.length}</strong> ayat kemunculan otentik
        </span>
        {hasMore && (
          <button
            onClick={handleShowAll}
            className="text-primary hover:underline font-medium text-xs"
          >
            Buka Seluruh ({occurrences.length}) Ayat
          </button>
        )}
      </div>

      {/* List of Verified Verses */}
      <div className="space-y-6">
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-2xl bg-primary-subdued text-primary font-bold text-sm flex items-center justify-center font-sans">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-ink-primary text-base sm:text-lg font-sans">
                      Q.S. {item.surahNameIndo} {item.surahNameArabic && `(${item.surahNameArabic})`} &bull; Ayat {item.ayahNumber}
                    </h4>
                    <span className="text-xs sm:text-sm text-ink-mute font-sans">
                      Akar Kata Terkait: <strong className="text-primary font-arabic text-base">{rootArabic}</strong> ({rootLatin})
                    </span>
                  </div>
                </div>

                {/* Action Button Group */}
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/baca?surah=${item.surahNumber}`}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-canvas-soft hover:bg-canvas-page border border-hairline text-xs font-semibold text-ink-secondary hover:text-primary transition-all font-sans"
                  >
                    <span>Buka di Mushaf</span>
                    <ExternalLink className="w-3 h-3 text-ink-mute" />
                  </Link>

                  <button
                    onClick={() => handleCopyVerse(item, itemKey)}
                    className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all font-sans ${
                      isCopied
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                        : 'bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-secondary'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-ink-mute" />}
                    <span>{isCopied ? 'Tersalin!' : 'Salin'}</span>
                  </button>

                  <button
                    onClick={() => toggleInterlinear(item, itemKey)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-primary-subdued text-primary hover:bg-primary/20 text-xs font-semibold transition-all font-sans"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isInterlinearOpen ? 'Tutup Analisis' : 'Analisis Per Kata'}</span>
                    {isInterlinearOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Verse Arabic Utsmani Text */}
              <div className="py-3 text-right dir-rtl">
                <p className="font-arabic-lg text-3xl sm:text-4xl lg:text-5xl text-ink-primary leading-loose tracking-wide" dir="rtl">
                  {item.verseArabic}
                </p>
              </div>

              {/* Indonesian Translation */}
              <div className="bg-canvas-soft border border-hairline rounded-2xl p-5 text-base sm:text-lg text-ink-secondary leading-relaxed font-sans space-y-1.5">
                <span className="font-semibold text-ink-primary block text-xs uppercase tracking-wider font-sans">
                  Terjemahan Resmi Kemenag RI:
                </span>
                <p className="translation-kemenag">&ldquo;{item.verseIndo}&rdquo;</p>
              </div>

              {/* Interlinear Accordion */}
              {isInterlinearOpen && (
                <div className="pt-2">
                  {isLoadingSegments ? (
                    <div className="p-8 text-center bg-canvas-soft border border-hairline rounded-2xl flex items-center justify-center space-x-2 text-ink-mute text-xs font-sans">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Memuat analisis kata per kata otentik (Quran.com API v4)...</span>
                    </div>
                  ) : activeSegments && activeSegments.length > 0 ? (
                    <WordByWordViewer segments={activeSegments} />
                  ) : (
                    <div className="p-6 text-center bg-canvas-soft border border-hairline rounded-2xl text-ink-mute text-xs font-sans">
                      Analisis kata per kata belum tersedia dari sumber.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progressive Disclosure Action Bar */}
      {hasMore && (
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleLoadMore}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white font-semibold text-xs sm:text-sm px-8 py-3 rounded-full shadow-subtle hover:shadow-soft transition-all"
          >
            <span>Tampilkan 10 Ayat Berikutnya ({occurrences.length - visibleCount} Tersisa)</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <button
            onClick={handleShowAll}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-canvas-surface hover:bg-canvas-soft border border-hairline text-ink-primary font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all"
          >
            <span>Tampilkan Seluruh ({occurrences.length}) Ayat</span>
          </button>
        </div>
      )}

      {/* Bottom Provenance Attribution */}
      <div className="pt-4 flex justify-end">
        <span className="inline-flex items-center space-x-1.5 text-xs text-ink-mute font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Sumber: Mushaf Standar Indonesia (Kemenag RI) &amp; The Quranic Arabic Corpus (Univ. of Leeds)</span>
        </span>
      </div>

    </div>
  );
}
