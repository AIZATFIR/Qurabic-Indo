'use client';

import React, { useState } from 'react';
import { VerseOccurrence, WordSegment } from '@/lib/types/morphology';
import { fetchVerseWords } from '@/lib/api/quran-corpus-api';
import WordByWordViewer from './WordByWordViewer';
import { Copy, Check, BookOpen, ChevronDown, ChevronUp, ShieldCheck, Loader2 } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabic: string;
  rootLatin: string;
}

export default function AyahConcordance({ occurrences, rootArabic, rootLatin }: AyahConcordanceProps) {
  const [openInterlinearId, setOpenInterlinearId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [segmentsMap, setSegmentsMap] = useState<Record<string, WordSegment[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  if (!occurrences || occurrences.length === 0) {
    return (
      <div className="p-8 text-center bg-canvas-surface border border-hairline rounded-2xl text-ink-mute font-sans shadow-subtle">
        Belum ada contoh kemunculan ayat yang terdaftar untuk akar kata ini.
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {occurrences.map((item, idx) => {
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
            {/* Header Badge & Copy Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
              <div className="flex items-center space-x-3">
                <span className="w-9 h-9 rounded-2xl bg-primary-subdued text-primary font-bold text-sm flex items-center justify-center font-sans">
                  {item.surahNumber}
                </span>
                <div>
                  <h4 className="font-bold text-ink-primary text-base sm:text-lg font-sans">
                    Q.S. {item.surahNameIndo} {item.surahNameArabic && `(${item.surahNameArabic})`} • Ayat {item.ayahNumber}
                  </h4>
                  <span className="text-xs sm:text-sm text-ink-mute font-sans">
                    Akar Kata Terkait: <strong className="text-primary font-arabic text-base">{rootArabic}</strong> ({rootLatin})
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCopyVerse(item, itemKey)}
                  className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all font-sans ${
                    isCopied
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-secondary'
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-ink-mute" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin Ayat'}</span>
                </button>

                <button
                  onClick={() => toggleInterlinear(item, itemKey)}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-primary-subdued text-primary hover:bg-primary/20 text-xs font-semibold transition-all font-sans"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isInterlinearOpen ? 'Tutup Analisis' : 'Analisis Per Kata'}</span>
                  {isInterlinearOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

            {/* Small Reference Badge in Bottom Corner */}
            <div className="pt-2 flex justify-end">
              <span className="inline-flex items-center space-x-1.5 text-xs text-ink-mute font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Sumber: Mushaf Standar Indonesia (Kemenag RI) &amp; Quran.com API v4</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
