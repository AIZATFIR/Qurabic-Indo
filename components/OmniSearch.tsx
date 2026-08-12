'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, BookOpen, ArrowRight, CornerDownLeft } from 'lucide-react';
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

  // Listen to keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open search modal
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

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResults(searchRoots(''));
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Update search results on query change
  const handleSearchChange = (val: string) => {
    setQuery(val);
    setResults(searchRoots(val));
  };

  const handleSelectRoot = (slug: string) => {
    onClose();
    router.push(`/akar/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-obsidian-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200">
      
      {/* Backdrop Dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Search Modal Box */}
      <div className="relative w-full max-w-2xl bg-obsidian-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden glass-panel z-10 flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Cari akar kata (Contoh: sabar, ص-ب-ر, kataba, batu, tulis)..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => handleSearchChange('')}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Quick Search Tag Filters */}
        <div className="px-4 py-2 bg-obsidian-950/60 border-b border-slate-800/80 flex items-center space-x-2 text-xs overflow-x-auto">
          <span className="text-slate-500 font-medium whitespace-nowrap">Saran Cepat:</span>
          <button
            onClick={() => handleSearchChange('sabar')}
            className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            sabar (ص-ب-ر)
          </button>
          <button
            onClick={() => handleSearchChange('batu')}
            className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            sobaro (batu keras)
          </button>
          <button
            onClick={() => handleSearchChange('kataba')}
            className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            kataba (ك-ت-ب)
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="font-medium text-sm">Akar kata tidak ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba ketik kata kunci Latin (&quot;sabar&quot;), Arab (&quot;صبر&quot;), atau Indonesia (&quot;batu&quot;)</p>
            </div>
          ) : (
            results.map((root) => (
              <div
                key={root.id}
                onClick={() => handleSelectRoot(root.id)}
                className="group p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/90 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-arabic text-xl font-bold group-hover:scale-105 transition-transform">
                    {root.rootArabicJoined}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-emerald-300 transition-colors">
                        {root.titleIndo}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-mono">
                        {root.totalOccurrences}x di Qur&apos;an
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {root.meaningsIndonesian[0]}
                    </p>
                    {root.etymologyNote && (
                      <p className="text-[11px] text-amber-300/80 mt-1 line-clamp-1 italic">
                        💡 {root.etymologyNote.slice(0, 85)}...
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3 pl-3">
                  <div className="hidden sm:flex flex-col text-right text-[11px] text-slate-400">
                    <span className="text-emerald-400">{root.verbsCount} Kata Kerja</span>
                    <span className="text-amber-400">{root.nounsCount} Kata Benda</span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-emerald-500 group-hover:text-obsidian-950 text-slate-400 flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <CornerDownLeft className="w-3 h-3 text-emerald-400" />
            <span>Tekan <strong className="text-slate-300">Enter</strong> untuk memilih</span>
          </div>
          <span>Qurabic-Indo Root Word Engine</span>
        </div>

      </div>
    </div>
  );
}
