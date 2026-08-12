'use client';

import Link from 'next/link';
import { BookOpen, Search, Sparkles, Layers } from 'lucide-react';
import { useState } from 'react';
import OmniSearch from './OmniSearch';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-obsidian-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-obsidian-950 font-bold text-xl shadow-glow-emerald group-hover:scale-105 transition-transform">
              <span className="font-arabic text-2xl pt-0.5">ق</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-white tracking-tight">Qurabic</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Indo</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Quranic Arabic Corpus &amp; Root Word Explorer</p>
            </div>
          </Link>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="text-slate-300 hover:text-emerald-400 transition-colors">
              Beranda
            </Link>
            <Link href="/morfologi" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center space-x-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Katalog Morfologi</span>
            </Link>
            <Link href="/akar/s-b-r" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Akar &quot;Sabar&quot;</span>
            </Link>
          </nav>

          {/* Search Trigger Button */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-all text-xs shadow-inner"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Cari akar kata (Arab/Latin/Indo)...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </header>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
