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
  selectAndJumpAyah: (targetAyah: number) => void;
  clearSearch: () => void;
  loadMoreAyahs: () => void;
}

const DEFAULT_CHUNK_SIZE = 26;
const DEFAULT_DEBOUNCE_MS = 180;
const CONTEXT_RADIUS = 3; // 3 before + target + 3 after = 7 ayahs

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
    end: Math.min(chunkSize, totalAyahs || chunkSize),
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
      end: Math.min(chunkSize, totalAyahs || chunkSize),
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

  // Jump to specific ayah with context window (Mode B)
  const selectAndJumpAyah = useCallback((targetAyah: number) => {
    if (!targetAyah || targetAyah < 1 || targetAyah > totalAyahs) return;

    setSearchMode('ayah');
    setSelectedAyah(targetAyah);
    setFocusedAyah(targetAyah);

    // Adaptive context window: target + 3 before + 3 after = 7 ayahs (capped at 9 hard max)
    const start = Math.max(1, targetAyah - CONTEXT_RADIUS);
    const end = Math.min(totalAyahs, targetAyah + CONTEXT_RADIUS);
    setVisibleRange({ start, end });

    // Smooth scroll and pulse highlight
    setTimeout(() => {
      const el = document.getElementById(`ayah-${targetAyah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-primary', 'bg-primary-subdued/30');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-primary', 'bg-primary-subdued/30');
        }, 3500);
      }
    }, 200);
  }, [totalAyahs]);

  // Load more ayahs progressively in continuous reading mode
  const loadMoreAyahs = useCallback(() => {
    setVisibleRange((prev) => {
      if (prev.end < totalAyahs) {
        return {
          start: 1,
          end: Math.min(prev.end + chunkSize, totalAyahs),
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
      end: Math.max(prev.end, chunkSize),
    }));
  }, [chunkSize]);

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
