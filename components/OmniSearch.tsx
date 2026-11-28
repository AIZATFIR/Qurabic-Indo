'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft, History, Trash2 } from 'lucide-react';
import { searchRoots } from '@/lib/search/root-search';
import { RootWord } from '@/lib/types/morphology';
import { useLanguage } from '@/lib/context/LanguageContext';

interface OmniSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'qurabic_search_history';

export default function OmniSearch({ isOpen, onClose }: OmniSearchProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RootWord[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load search history from localStorage on open
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setSearchHistory(parsed);
          }
        }
      } catch (e) {}

      setTimeout(() => inputRef.current?.focus(), 100);
      setResults(searchRoots(''));

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const triggerBtn = document.querySelector('[data-search-trigger]');
          if (triggerBtn) (triggerBtn as HTMLButtonElement).click();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const saveToHistory = (item: string) => {
    const clean = item.trim();
    if (!clean) return;
    try {
      const updated = [clean, ...searchHistory.filter((h) => h.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      setSearchHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem('qurabic_last_search', clean);
    } catch (e) {}
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      localStorage.removeItem(STORAGE_KEY);
      setSearchHistory([]);
    } catch (e) {}
  };

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setResults(searchRoots(val));
  };

  const handleSelectRoot = (root: RootWord) => {
    saveToHistory(`${root.rootArabic} (${root.rootLatin})`);
    onClose();
    router.push(`/akar/${root.id}`);
  };

  const handleSelectHistoryItem = (item: string) => {
    setQuery(item);
    setResults(searchRoots(item));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      saveToHistory(query);
    }
    if (results.length > 0) {
      handleSelectRoot(results[0]);
    } else if (query.trim()) {
      onClose();
      router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[calc(var(--qurabic-safe-area-top)_+_1rem)] sm:pt-24 bg-ink-primary/50 transition-opacity animate-in fade-in duration-200 font-sans overscroll-contain">
      
      {/* Backdrop Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Search Modal Box */}
      <div role="dialog" aria-modal="true" aria-label={t('Cari kata atau akar', 'Search words and roots')} className="relative z-10 flex max-h-[min(82vh,44rem)] w-full max-w-2xl flex-col overflow-hidden overscroll-contain rounded-[var(--radius-surface)] border border-hairline bg-canvas-surface shadow-soft">
        
        {/* Search Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex min-h-16 items-center gap-3 border-b border-hairline bg-canvas-surface px-4 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-ink-mute" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            dir="auto"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={t('Cari kata atau akar', 'Search for a word or root')}
            placeholder={t('Cari kata atau akar, contoh: sabar, كتب', 'Search a word or root, for example: كتب, rahman')}
            className="min-w-0 w-full bg-transparent text-base text-ink-primary placeholder:text-ink-mute focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              aria-label={t('Hapus pencarian', 'Clear search')}
              onClick={() => handleSearchChange('')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-ink-mute transition-colors hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Tutup pencarian', 'Close search')}
            className="min-h-11 min-w-11 rounded-[var(--radius-control)] border border-hairline bg-canvas-soft px-3 text-sm text-ink-secondary transition-colors hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans"
          >
            ESC
          </button>
        </form>

        {/* Dynamic Last Search Bar (Clean, no fake suggestions) */}
        {searchHistory.length > 0 && !query && (
          <div className="flex items-center justify-between gap-3 border-b border-hairline bg-canvas-soft/80 px-4 py-3 text-sm font-sans sm:px-5">
            <div className="flex min-w-0 items-center gap-2 overflow-x-auto pe-2">
              <span className="flex shrink-0 items-center gap-2 font-medium text-ink-mute">
                <History className="w-3 h-3 text-primary" />
                <span>{t('Pencarian terakhir:', 'Recent searches:')}</span>
              </span>
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectHistoryItem(item)}
                  className="min-h-11 shrink-0 rounded-[var(--radius-control)] border border-hairline bg-canvas-surface px-3 text-sm font-medium text-ink-secondary transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans"
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={clearHistory}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-control)] text-ink-mute transition-colors hover:bg-canvas-surface hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              title={t('Hapus riwayat pencarian', 'Clear search history')}
              aria-label={t('Hapus riwayat pencarian', 'Clear search history')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 space-y-2 overflow-y-auto p-4 sm:p-5">
          {results.length === 0 ? (
            <div className="py-12 text-center text-ink-mute space-y-3 font-sans">
              <BookOpen className="w-10 h-10 mx-auto text-ink-mute opacity-50" />
              <p className="font-medium text-sm">{t('Akar kata tidak ditemukan dalam indeks', 'No roots found in the index')}</p>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-sans"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('Cari di seluruh ayat', 'Search all verses')} (&ldquo;{query}&rdquo;)</span>
              </button>
            </div>
          ) : (
            results.slice(0, 10).map((root) => (
              <button
                key={root.id}
                type="button"
                onClick={() => handleSelectRoot(root)}
                className="group flex min-h-[4.5rem] w-full items-center justify-between gap-4 rounded-[var(--radius-control)] border-b border-hairline px-3 py-3 text-start transition-colors hover:bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-3xl leading-loose text-ink-primary group-hover:text-primary">{root.rootArabicJoined}</span>
                <span className="min-w-0 flex-1 text-base text-ink-secondary">
                  <span className="block">{root.rootLatin}</span>
                  <span className="mt-1 block">{root.totalOccurrences} {t('kemunculan', 'occurrences')}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              </button>
            ))
          )}
        </div>

        {/* Footer info & Submit Link */}
        <div className="flex items-center justify-between gap-4 border-t border-hairline bg-canvas-soft px-4 py-3 text-sm text-ink-mute font-sans sm:px-5">
          <button
            type="button"
            onClick={handleFormSubmit}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-2 transition-colors hover:bg-canvas-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-sans"
          >
            <CornerDownLeft className="w-3.5 h-3.5 text-primary" />
            <span>{t('Buka hasil pertama', 'Open first result')}</span>
          </button>
          <span className="font-semibold text-primary font-sans">Qurabic (Indo)</span>
        </div>

      </div>
    </div>
  );
}
