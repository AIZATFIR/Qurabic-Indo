'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { VerseOccurrence, WordSegment } from '@/lib/types/morphology';
import { fetchVerseWords } from '@/lib/api/quran-corpus-api';
import { stripArabicHarakat } from '@/lib/search/root-search';
import WordByWordViewer from './WordByWordViewer';
import WordEtymologyModal from './WordEtymologyModal';
import { Copy, Check, BookOpen, ChevronDown, ChevronUp, ExternalLink, ArrowDown, ShieldCheck, Filter } from 'lucide-react';

interface AyahConcordanceProps {
  occurrences: VerseOccurrence[];
  rootArabic: string;
  rootLatin: string;
  isExampleSection?: boolean;
}

const INITIAL_VISIBLE_COUNT = 8;

export default function AyahConcordance({
  occurrences = [],
  rootArabic,
  rootLatin,
  isExampleSection = false,
}: AyahConcordanceProps) {
  const [openInterlinearId, setOpenInterlinearId] = useState<string | null>(null);
  const [expandedCorpusIds, setExpandedCorpusIds] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [segmentsMap, setSegmentsMap] = useState<Record<string, WordSegment[]>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [visibleCount, setVisibleCount] = useState<number>(isExampleSection ? 3 : INITIAL_VISIBLE_COUNT);
  const [selectedSurahFilter, setSelectedSurahFilter] = useState<number | 'all'>('all');
  
  // Word Detail Modal state
  const [selectedWordForModal, setSelectedWordForModal] = useState<{
    wordArabic: string;
    surahNumber: number;
    ayahNumber: number;
    surahNameIndo: string;
    ayahArabic: string;
    ayahIndo: string;
    wordIndex?: number;
    rootLetters?: string;
    meaningIndo?: string;
  } | null>(null);

  // Extract unique surahs for filtering
  const availableSurahs = useMemo(() => {
    const map = new Map<number, { number: number; nameIndo: string; count: number }>();
    for (const occ of occurrences) {
      const existing = map.get(occ.surahNumber) || {
        number: occ.surahNumber,
        nameIndo: occ.surahNameIndo || `Surah ${occ.surahNumber}`,
        count: 0
      };
      existing.count++;
      map.set(occ.surahNumber, existing);
    }
    return Array.from(map.values()).sort((a, b) => a.number - b.number);
  }, [occurrences]);

  const filteredOccurrences = useMemo(() => {
    if (selectedSurahFilter === 'all') return occurrences;
    return occurrences.filter(o => o.surahNumber === selectedSurahFilter);
  }, [occurrences, selectedSurahFilter]);

  if (!occurrences || occurrences.length === 0) {
    return (
      <div className="p-8 text-center bg-canvas-surface border border-hairline rounded-2xl text-ink-mute font-sans shadow-subtle">
        Belum ada contoh kemunculan ayat yang terdaftar untuk akar kata ini.
      </div>
    );
  }

  const displayedOccurrences = filteredOccurrences.slice(0, visibleCount);
  const hasMore = !isExampleSection && visibleCount < filteredOccurrences.length;

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

  const toggleCorpusDetail = (key: string) => {
    setExpandedCorpusIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCopyVerse = (item: VerseOccurrence, key: string) => {
    const textToCopy = `${item.verseArabic}\n\n"${item.verseIndo}"\n\n(Q.S. ${item.surahNameIndo} [${item.surahNumber}]: ${item.ayahNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 10, filteredOccurrences.length));
  };

  const handleShowAll = () => {
    setVisibleCount(filteredOccurrences.length);
  };

  // Helper to render verse with exact target word highlight
  const renderHighlightedVerse = (verseText: string, targetWord?: string) => {
    if (!targetWord) {
      return (
        <p className="font-arabic text-2xl sm:text-3xl text-ink-primary leading-[2.6] sm:leading-[2.8] tracking-wide" dir="rtl">
          {verseText}
        </p>
      );
    }

    const cleanTarget = stripArabicHarakat(targetWord);
    const tokens = verseText.split(' ');

    return (
      <p className="font-arabic text-2xl sm:text-3xl text-ink-primary leading-[2.6] sm:leading-[2.8] tracking-wide" dir="rtl">
        {tokens.map((tok, idx) => {
          const cleanTok = stripArabicHarakat(tok);
          const isTarget = cleanTok === cleanTarget;

          if (isTarget) {
            return (
              <span
                key={idx}
                className="inline-block px-1.5 py-0.5 mx-0.5 rounded-lg bg-primary-subdued text-primary font-bold transition-colors"
              >
                {tok}
              </span>
            );
          }
          return <span key={idx} className="mx-0.5">{tok} </span>;
        })}
      </p>
    );
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Surah Filter Bar (When multiple surahs exist & not in example section) */}
      {!isExampleSection && availableSurahs.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-canvas-surface border border-hairline rounded-2xl shadow-subtle text-xs font-sans">
          <div className="flex items-center space-x-2 text-ink-secondary">
            <Filter aria-hidden="true" className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-ink-primary">Filter Berdasarkan Surah:</span>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedSurahFilter}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10);
                setSelectedSurahFilter(val);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
              className="px-3 py-1.5 rounded-xl bg-canvas-soft border border-hairline text-ink-primary text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">Semua Surah ({occurrences.length} Ayat)</option>
              {availableSurahs.map((s) => (
                <option key={s.number} value={s.number}>
                  Q.S. {s.nameIndo} [{s.number}] — {s.count} ayat
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Occurrences List */}
      <div className="space-y-4">
        {displayedOccurrences.map((item, idx) => {
          const itemKey = `${item.surahNumber}:${item.ayahNumber}_${idx}`;
          const isInterlinearOpen = openInterlinearId === itemKey;
          const isCorpusExpanded = !!expandedCorpusIds[itemKey];
          const isCopied = copiedKey === itemKey;
          const activeSegments = segmentsMap[itemKey] || item.wordSegments;
          const isLoadingSegments = loadingMap[itemKey];

          return (
            <div
              key={itemKey}
              className="p-5 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline hover:border-hairline-hover shadow-subtle transition-all space-y-4"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-hairline pb-3.5 font-sans">
                <div className="flex items-center space-x-2.5">
                  <span className="px-3 py-1 rounded-full bg-primary-subdued text-primary font-semibold text-xs">
                    Q.S. {item.surahNameIndo} [{item.surahNumber}]:{item.ayahNumber}
                  </span>
                  {item.matchedWordArabic && (
                    <span className="text-xs text-ink-mute hidden sm:inline-flex items-center space-x-1">
                      <span>Bentuk:</span>
                      <strong className="font-arabic text-sm text-primary" dir="rtl">{item.matchedWordArabic}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleCopyVerse(item, itemKey)}
                    className="p-2 rounded-xl bg-canvas-soft hover:bg-canvas-page text-ink-secondary hover:text-ink-primary transition-colors text-xs"
                    title="Salin Ayat &amp; Terjemahan"
                  >
                    {isCopied ? <Check aria-hidden="true" className="w-3.5 h-3.5 text-success" /> : <Copy aria-hidden="true" className="w-3.5 h-3.5" />}
                  </button>

                  <Link
                    href={`/baca?surah=${item.surahNumber}&ayah=${item.ayahNumber}`}
                    className="px-3 py-1.5 rounded-full bg-canvas-soft hover:bg-canvas-page border border-hairline text-ink-secondary hover:text-primary text-xs font-semibold transition-all inline-flex items-center space-x-1"
                    title="Buka dalam Mushaf Lengkap"
                  >
                    <span>Baca di Mushaf</span>
                    <ExternalLink aria-hidden="true" className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => toggleInterlinear(item, itemKey)}
                    className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all inline-flex items-center space-x-1 ${
                      isInterlinearOpen
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-canvas-soft hover:bg-canvas-page border-hairline text-ink-secondary hover:text-primary'
                    }`}
                  >
                    <span>{isInterlinearOpen ? 'Tutup Per Kata' : 'Per Kata'}</span>
                    {isInterlinearOpen ? <ChevronUp aria-hidden="true" className="w-3 h-3" /> : <ChevronDown aria-hidden="true" className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Verse Arabic Text with Subtly Highlighted Target Word */}
              <div className="py-2 text-right" dir="rtl">
                {renderHighlightedVerse(item.verseArabic, item.matchedWordArabic)}
              </div>

              {/* Indonesian Translation */}
              <div className="bg-canvas-soft border border-hairline rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-ink-secondary leading-relaxed font-sans space-y-1">
                <span className="font-semibold text-ink-primary block text-[11px] uppercase tracking-wider font-sans">
                  Terjemahan Resmi Kemenag RI:
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

              {/* Collapsed Detail Corpus (QAC v0.4) */}
              <div className="pt-1 flex items-center justify-between text-xs text-ink-mute font-sans">
                <button
                  onClick={() => toggleCorpusDetail(itemKey)}
                  className="inline-flex items-center space-x-1 hover:text-ink-primary transition-colors font-medium"
                >
                  <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-primary" />
                  <span>Detail Corpus ({item.wordLocation || `${item.surahNumber}:${item.ayahNumber}`})</span>
                  {isCorpusExpanded ? <ChevronUp aria-hidden="true" className="w-3 h-3" /> : <ChevronDown aria-hidden="true" className="w-3 h-3" />}
                </button>

                {isCorpusExpanded && (
                  <span className="font-mono text-[11px] text-ink-mute">
                    QAC v0.4 · University of Leeds
                  </span>
                )}
              </div>

              {isCorpusExpanded && (
                <div className="p-3.5 bg-canvas-soft rounded-2xl border border-hairline text-xs font-mono text-ink-secondary space-y-1 animate-in fade-in duration-150">
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Koordinat QAC:</span>
                    <span className="text-ink-primary font-semibold">{item.wordLocation || `${item.surahNumber}:${item.ayahNumber}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Akar Otoritatif:</span>
                    <span className="text-ink-primary font-arabic font-semibold" dir="rtl">{rootArabic}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Kata Sasaran:</span>
                    <span className="text-ink-primary font-arabic" dir="rtl">{item.matchedWordArabic}</span>
                  </div>
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
            <ArrowDown aria-hidden="true" className="w-4 h-4 text-primary" />
            <span>Tampilkan 10 Ayat Lagi</span>
          </button>
          <button
            onClick={handleShowAll}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all"
          >
            Tampilkan Seluruh ({filteredOccurrences.length}) Ayat
          </button>
        </div>
      )}

      {/* Word Etymology / Detail Modal */}
      {selectedWordForModal && (
        <WordEtymologyModal
          isOpen={!!selectedWordForModal}
          onClose={() => setSelectedWordForModal(null)}
          wordArabic={selectedWordForModal.wordArabic}
          surahNumber={selectedWordForModal.surahNumber}
          ayahNumber={selectedWordForModal.ayahNumber}
          surahNameIndo={selectedWordForModal.surahNameIndo}
          ayahArabic={selectedWordForModal.ayahArabic}
          ayahIndo={selectedWordForModal.ayahIndo}
          wordIndex={selectedWordForModal.wordIndex}
          rootLetters={selectedWordForModal.rootLetters}
          meaningIndo={selectedWordForModal.meaningIndo}
        />
      )}
    </div>
  );
}
