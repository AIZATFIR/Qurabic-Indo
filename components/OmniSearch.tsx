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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-ink-primary/50 transition-opacity animate-in fade-in duration-200 font-sans overscroll-contain">
      
      {/* Backdrop Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Search Modal Box */}
      <div role="dialog" aria-modal="true" aria-label={t('Cari kata atau akar', 'Search words and roots')} className="relative w-full max-w-2xl bg-canvas-surface border border-hairline rounded-sm shadow-2xl overflow-hidden overscroll-contain z-10 flex flex-col max-h-[82vh]">
        
        {/* Search Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex items-center px-5 py-4 border-b border-hairline bg-canvas-surface">
          <Search className="w-4 h-4 text-ink-mute mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={t('Cari kata atau akar', 'Search for a word or root')}
            placeholder={t('Cari kata atau akar, contoh: sabar, كتب', 'Search a word or root, for example: كتب, rahman')}
            className="w-full bg-transparent text-ink-primary placeholder:text-ink-mute text-base focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              aria-label={t('Hapus pencarian', 'Clear search')}
              onClick={() => handleSearchChange('')}
              className="p-1 rounded-sm text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label={t('Tutup pencarian', 'Close search')}
            className="px-2.5 py-1 text-sm rounded-sm bg-canvas-soft border border-hairline text-ink-mute hover:text-ink-primary font-sans"
          >
            ESC
          </button>
        </form>

        {/* Dynamic Last Search Bar (Clean, no fake suggestions) */}
        {searchHistory.length > 0 && !query && (
          <div className="px-5 py-2.5 bg-canvas-soft/80 border-b border-hairline flex items-center justify-between text-sm font-sans">
            <div className="flex items-center space-x-2 overflow-x-auto pr-2">
              <span className="text-ink-mute font-medium flex items-center space-x-1 shrink-0">
                <History className="w-3 h-3 text-primary" />
                <span>{t('Pencarian terakhir:', 'Recent searches:')}</span>
              </span>
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectHistoryItem(item)}
                  className="px-2.5 py-1 rounded-sm bg-canvas-surface border border-hairline hover:border-primary/50 text-ink-secondary hover:text-primary transition-colors text-sm shrink-0 font-medium font-sans"
                >
                  {item}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={clearHistory}
              className="text-ink-mute hover:text-red-500 transition-colors p-1 shrink-0"
              title={t('Hapus riwayat pencarian', 'Clear search history')}
              aria-label={t('Hapus riwayat pencarian', 'Clear search history')}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-ink-mute space-y-3 font-sans">
              <BookOpen className="w-10 h-10 mx-auto text-ink-mute opacity-50" />
              <p className="font-medium text-sm">{t('Akar kata tidak ditemukan dalam indeks', 'No roots found in the index')}</p>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-4 py-2 rounded-sm text-sm font-semibold transition-all font-sans"
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
                className="group flex w-full items-center justify-between gap-4 border-b border-hairline px-3 py-4 text-left hover:bg-canvas-soft focus-visible:outline-primary"
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
        <div className="px-5 py-3 bg-canvas-soft border-t border-hairline text-sm text-ink-mute flex items-center justify-between font-sans">
          <button
            type="button"
            onClick={handleFormSubmit}
            className="flex items-center space-x-1.5 hover:text-primary transition-colors font-sans"
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
