'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, ArrowRight, CornerDownLeft } from 'lucide-react';
import { searchRoots } from '@/lib/search/root-search';
import { RootWord } from '@/lib/types/morphology';

interface OmniSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OmniSearch({ isOpen, onClose }: OmniSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RootWord[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const triggerBtn = document.querySelector('header button');
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResults(searchRoots(''));
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleSearchChange = (val: string) => {
    setQuery(val);
    setResults(searchRoots(val));
  };

  const handleSelectRoot = (slug: string) => {
    onClose();
    router.push(`/akar/${slug}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-ink-primary/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      
      {/* Backdrop Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-white border border-hairline rounded-2xl shadow-hover overflow-hidden z-10 flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex items-center px-5 py-4 border-b border-hairline bg-white">
          <Search className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari akar kata (Contoh: sabar, ص-ب-ر, kataba, batu, tulis)..."
            className="w-full bg-transparent text-ink-primary placeholder:text-ink-mute text-base focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="p-1 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs rounded-full bg-canvas-soft border border-hairline text-ink-mute hover:text-ink-primary"
          >
            ESC
          </button>
        </form>

        {/* Quick Search Tag Filters */}
        <div className="px-5 py-2.5 bg-canvas-soft border-b border-hairline flex items-center space-x-2 text-xs overflow-x-auto">
          <span className="text-ink-mute font-medium whitespace-nowrap">Saran Cepat:</span>
          <button
            type="button"
            onClick={() => handleSearchChange('sabar')}
            className="px-3 py-1 rounded-full bg-primary-subdued text-primary-deep font-semibold hover:bg-primary-soft hover:text-white transition-colors"
          >
            sabar (ص-ب-ر)
          </button>
          <button
            type="button"
            onClick={() => handleSearchChange('batu')}
            className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200 transition-colors font-medium"
          >
            sobaro (batu keras)
          </button>
          <button
            type="button"
            onClick={() => handleSearchChange('kataba')}
            className="px-3 py-1 rounded-full bg-white text-ink-secondary border border-hairline hover:border-primary transition-colors font-medium"
          >
            kataba (ك-ت-ب)
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-ink-mute space-y-3">
              <BookOpen className="w-10 h-10 mx-auto text-ink-mute opacity-50" />
              <p className="font-medium text-sm">Akar kata tidak ditemukan di cache lokal</p>
              <button
                type="button"
                onClick={handleFormSubmit}
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-4 py-2 rounded-full text-xs font-semibold shadow-soft transition-all"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari di Live Quran API (&ldquo;{query}&rdquo;)</span>
              </button>
            </div>
          ) : (
            results.slice(0, 10).map((root) => (
              <div
                key={root.id}
                onClick={() => handleSelectRoot(root.id)}
                className="group p-4 rounded-xl bg-white border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-canvas-soft border border-hairline flex items-center justify-center text-primary font-arabic text-2xl font-bold group-hover:scale-105 transition-transform">
                    {root.rootArabicJoined}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-ink-primary text-sm group-hover:text-primary transition-colors">
                        {root.titleIndo}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-canvas-soft text-ink-mute font-mono">
                        {root.totalOccurrences}x di Qur&apos;an
                      </span>
                    </div>
                    <p className="text-xs text-ink-secondary mt-1 line-clamp-1">
                      {root.meaningsIndonesian[0]}
                    </p>
                    {root.etymologyNote && (
                      <p className="text-[11px] text-amber-800 mt-1 line-clamp-1 italic">
                        💡 {root.etymologyNote.slice(0, 85)}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 pl-3">
                  <div className="hidden sm:flex flex-col text-right text-[11px] font-mono text-ink-mute">
                    <span className="text-primary font-semibold">{root.verbsCount} Fi&apos;il</span>
                    <span className="text-amber-700 font-semibold">{root.nounsCount} Isim</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-canvas-soft group-hover:bg-primary group-hover:text-white text-ink-mute flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info & Submit Link */}
        <div className="px-5 py-3 bg-canvas-soft border-t border-hairline text-xs text-ink-mute flex items-center justify-between">
          <button
            type="button"
            onClick={handleFormSubmit}
            className="flex items-center space-x-1.5 hover:text-primary transition-colors"
          >
            <CornerDownLeft className="w-3.5 h-3.5 text-primary" />
            <span>Tekan <strong className="text-ink-primary">Enter</strong> untuk lihat semua hasil pencarian</span>
          </button>
          <span className="font-semibold text-primary">Qubaric (Indo)</span>
        </div>

      </div>
    </div>
  );
}
