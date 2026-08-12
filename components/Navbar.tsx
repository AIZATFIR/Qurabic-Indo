'use client';

import Link from 'next/link';
import { Search, Sparkles, Layers, BookOpen } from 'lucide-react';
import { useState } from 'react';
import OmniSearch from './OmniSearch';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <nav className="bg-white font-sans text-sm w-full sticky top-0 z-50 border-b border-hairline shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center px-6 sm:px-12 py-3.5 max-w-7xl mx-auto">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="font-extrabold text-2xl text-primary tracking-tight">
              Qubaric <span className="text-xs px-2 py-0.5 rounded-full bg-primary-subdued text-primary-deep font-semibold">Indo</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            <Link href="/" className="text-primary border-b-2 border-primary pb-1 font-semibold">
              Roots
            </Link>
            <Link href="/morfologi" className="text-ink-secondary hover:text-primary transition-colors flex items-center space-x-1">
              <Layers className="w-4 h-4 text-primary" />
              <span>Katalog Morfologi</span>
            </Link>
            <Link href="/akar/s-b-r" className="text-ink-secondary hover:text-primary transition-colors flex items-center space-x-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Akar &quot;Sabar&quot;</span>
            </Link>
          </div>

          {/* Actions & Search Trigger */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-canvas-soft border border-hairline-input text-ink-mute hover:text-ink-primary transition-all text-xs"
            >
              <Search className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Cari akar kata...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-hairline rounded font-mono">
                ⌘K
              </kbd>
            </button>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="bg-primary text-white hover:bg-primary-deep font-semibold text-xs px-5 py-2 rounded-full transition-colors shadow-sm"
            >
              Cari Sekarang
            </button>
          </div>
        </div>
      </nav>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
