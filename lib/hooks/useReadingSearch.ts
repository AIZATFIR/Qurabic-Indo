import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { FullAyahWBW } from '../api/quran-corpus-api';

export type ReadingSearchMode = 'none' | 'word' | 'ayah';

export interface UseReadingSearchOptions {
  surahNumber: number;
  totalAyahs: number;
  initialAyah?: number;
  chunkSize?: number;
  debounceMs?: number;
}

export interface UseReadingSearchResult {
  searchMode: ReadingSearchMode;
  wordQuery: string;
  debouncedWordQuery: string;
  selectedAyah: number | null;
  focusedAyah: number | null;
  visibleRange: { start: number; end: number };
  displayedAyahs: FullAyahWBW[];
  isFilteringKata: boolean;
  isAyahContextWindow: boolean;
  totalMatchesCount: number;
  setSearchMode: (mode: ReadingSearchMode) => void;
  setWordQuery: (query: string) => void;
  selectAndJumpAyah: (targetAyah: number, options?: { forceContextWindow?: boolean }) => void;
  clearSearch: () => void;
  loadMoreAyahs: () => void;
}

const DEFAULT_CHUNK_SIZE = 30;
const DEFAULT_DEBOUNCE_MS = 180;
const CONTEXT_RADIUS = 3; // 3 before + target + 3 after = 7 ayahs

// Helper to compute initial or updated visible range end
// If surah has <= 42 verses (e.g. Al-Mulk, An-Naba, short surahs), load entirely immediately.
// For longer surahs, if remainder is <= 12 verses, absorb it to prevent orphan chunks of 3-4 verses.
export function computeAdaptiveEnd(
  totalAyahs: number,
  chunkSize: number = DEFAULT_CHUNK_SIZE,
  targetAyah?: number
): number {
  if (!totalAyahs || totalAyahs <= 42) {
    return totalAyahs || chunkSize;
  }

  if (targetAyah && targetAyah > 1) {
    const rawEnd = Math.max(chunkSize, Math.ceil(targetAyah / chunkSize) * chunkSize);
    if (totalAyahs - rawEnd <= 12) {
      return totalAyahs;
    }
    return Math.min(totalAyahs, rawEnd);
  }

  if (totalAyahs - chunkSize <= 12) {
    return totalAyahs;
  }

  return Math.min(chunkSize, totalAyahs);
}

export function useReadingSearch(
  allAyahs: FullAyahWBW[],
  options: UseReadingSearchOptions
): UseReadingSearchResult {
  const {
    surahNumber,
    totalAyahs,
    initialAyah,
    chunkSize = DEFAULT_CHUNK_SIZE,
    debounceMs = DEFAULT_DEBOUNCE_MS,
  } = options;

  const [searchMode, setSearchMode] = useState<ReadingSearchMode>('none');
  const [wordQuery, setWordQueryState] = useState<string>('');
  const [debouncedWordQuery, setDebouncedWordQuery] = useState<string>('');
  const [selectedAyah, setSelectedAyah] = useState<number | null>(initialAyah || null);
  const [focusedAyah, setFocusedAyah] = useState<number | null>(initialAyah || null);

  // Visible continuous slice [startAyahNumber, endAyahNumber]
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({
    start: 1,
    end: computeAdaptiveEnd(totalAyahs, chunkSize, initialAyah),
  });

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset states when surah changes
  useEffect(() => {
    setSearchMode('none');
    setWordQueryState('');
    setDebouncedWordQuery('');
    setSelectedAyah(null);
    setFocusedAyah(null);
    setVisibleRange({
      start: 1,
      end: computeAdaptiveEnd(totalAyahs, chunkSize),
    });
  }, [surahNumber, totalAyahs, chunkSize]);

  // Debounce word query updates
  const setWordQuery = useCallback((q: string) => {
    setWordQueryState(q);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!q.trim()) {
      setDebouncedWordQuery('');
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedWordQuery(q.trim());
    }, debounceMs);
  }, [debounceMs]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Jump to specific ayah with context window (Mode B) or continuous reading
  const selectAndJumpAyah = useCallback((targetAyah: number, options?: { forceContextWindow?: boolean }) => {
    if (!targetAyah || targetAyah < 1 || targetAyah > totalAyahs) return;

    if (options?.forceContextWindow) {
      setSearchMode('ayah');
      setSelectedAyah(targetAyah);
      setFocusedAyah(targetAyah);

      // Adaptive context window: target + 3 before + 3 after = 7 ayahs (capped at 9 hard max)
      const start = Math.max(1, targetAyah - CONTEXT_RADIUS);
      const end = Math.min(totalAyahs, targetAyah + CONTEXT_RADIUS);
      setVisibleRange({ start, end });
    } else {
      setSelectedAyah(targetAyah);
      setFocusedAyah(targetAyah);
      setVisibleRange((prev) => {
        const rawEnd = Math.max(prev.end, Math.ceil(targetAyah / chunkSize) * chunkSize);
        const finalEnd = totalAyahs - rawEnd <= 12 ? totalAyahs : Math.min(totalAyahs, rawEnd);
        return {
          start: 1,
          end: finalEnd,
        };
      });
    }

    // Smooth scroll and pulse highlight - aligned to top of the verse with DOM retry
    const tryScrollAndPulse = (attemptsLeft = 5) => {
      const el = document.getElementById(`ayah-${targetAyah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-primary', 'bg-primary-subdued/30');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-primary', 'bg-primary-subdued/30');
        }, 3500);
      } else if (attemptsLeft > 0) {
        setTimeout(() => tryScrollAndPulse(attemptsLeft - 1), 80);
      }
    };
    setTimeout(() => tryScrollAndPulse(), 120);
  }, [totalAyahs, chunkSize]);

  // Load more ayahs progressively in continuous reading mode
  const loadMoreAyahs = useCallback(() => {
    setVisibleRange((prev) => {
      if (prev.end < totalAyahs) {
        const nextEnd = prev.end + chunkSize;
        const finalEnd = totalAyahs - nextEnd <= 12 ? totalAyahs : Math.min(nextEnd, totalAyahs);
        return {
          start: 1,
          end: finalEnd,
        };
      }
      return prev;
    });
  }, [totalAyahs, chunkSize]);

  // Clear search and restore normal continuous reading
  const clearSearch = useCallback(() => {
    setSearchMode('none');
    setWordQueryState('');
    setDebouncedWordQuery('');
    setSelectedAyah(null);
    setFocusedAyah(null);
    setVisibleRange((prev) => ({
      start: 1,
      end: Math.max(prev.end, computeAdaptiveEnd(totalAyahs, chunkSize)),
    }));
  }, [totalAyahs, chunkSize]);

  // Compute displayed ayahs based on active mode
  const isFilteringKata = searchMode === 'word' && debouncedWordQuery.length > 0;
  const isAyahContextWindow = searchMode === 'ayah' && selectedAyah !== null;

  const { displayedAyahs, totalMatchesCount } = useMemo(() => {
    if (isFilteringKata) {
      const q = debouncedWordQuery.toLowerCase();
      const filtered = allAyahs.filter((a) => {
        return (
          a.ayahNumber.toString() === q ||
          a.textIndo.toLowerCase().includes(q) ||
          a.textArabic.includes(debouncedWordQuery) ||
          a.words.some(
            (w) =>
              w.transliteration?.toLowerCase().includes(q) ||
              w.meaningIndo?.toLowerCase().includes(q) ||
              w.arabic.includes(debouncedWordQuery)
          )
        );
      });
      return { displayedAyahs: filtered, totalMatchesCount: filtered.length };
    }

    if (isAyahContextWindow) {
      const sliced = allAyahs.filter(
        (a) => a.ayahNumber >= visibleRange.start && a.ayahNumber <= visibleRange.end
      );
      return { displayedAyahs: sliced, totalMatchesCount: sliced.length };
    }

    // Default continuous windowed reading
    const sliced = allAyahs.slice(0, visibleRange.end);
    return { displayedAyahs: sliced, totalMatchesCount: allAyahs.length };
  }, [allAyahs, isFilteringKata, debouncedWordQuery, isAyahContextWindow, visibleRange]);

  return {
    searchMode,
    wordQuery,
    debouncedWordQuery,
    selectedAyah,
    focusedAyah,
    visibleRange,
    displayedAyahs,
    isFilteringKata,
    isAyahContextWindow,
    totalMatchesCount,
    setSearchMode,
    setWordQuery,
    selectAndJumpAyah,
    clearSearch,
    loadMoreAyahs,
  };
}
