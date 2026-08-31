'use client';

import Link from 'next/link';
import { BookOpen, Search, Bookmark, BookMarked, Shuffle, Sparkles } from 'lucide-react';
import OmniSearch from './OmniSearch';
import ThemeSelector from './ThemeSelector';
import { useState } from 'react';
import { useBookmarks } from '@/lib/hooks/useBookmarks';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarkedIds } = useBookmarks();

  return (
    <>
      {/* Hermes-style Floating Translucent Headbar with Soft Glassmorphic Fade */}
      <header className="sticky top-0 z-40 w-full bg-canvas-page/75 backdrop-blur-md border-b border-hairline/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo Branding */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="flex flex-col">
                  <span className="font-sans font-bold text-base text-ink-primary tracking-tight leading-none group-hover:text-primary transition-colors">
                    Qurabic <span className="text-primary font-normal">(Indo)</span>
                  </span>
                  <span className="text-[10px] text-ink-mute font-sans mt-0.5 tracking-wide">
                    Corpus &amp; Morfologi
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 text-xs font-medium text-ink-secondary">
              <Link
                href="/baca"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-canvas-surface/80"
              >
                <BookMarked className="w-3.5 h-3.5 text-primary" />
                <span>Baca Qur&apos;an</span>
              </Link>
              
              <Link
                href="/ayat-random"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-canvas-surface/80"
              >
                <Shuffle className="w-3.5 h-3.5 text-primary" />
                <span>Ayat Acak</span>
              </Link>

              <Link
                href="/morfologi"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-canvas-surface/80"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Katalog Morfologi</span>
              </Link>

              <Link
                href="/rekomendasi"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-canvas-surface/80"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Rekomendasi</span>
              </Link>

              <Link
                href="/favorit"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-canvas-surface/80 relative"
              >
                <Bookmark className="w-3.5 h-3.5 text-primary" />
                <span>Tersimpan</span>
                {bookmarkedIds.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center ml-0.5">
                    {bookmarkedIds.length}
                  </span>
                )}
              </Link>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center space-x-2 bg-canvas-surface/80 hover:bg-canvas-surface border border-hairline/60 text-ink-mute px-3.5 py-1.5 rounded-full text-xs transition-all shadow-subtle hover:border-primary/40"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Cari akar kata...</span>
                <kbd className="hidden lg:inline-block bg-canvas-soft text-ink-mute text-[9px] px-1.5 py-0.5 rounded border border-hairline/50 font-sans ml-1">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-1.5 rounded-full text-ink-secondary hover:bg-canvas-surface border border-hairline/60"
                aria-label="Cari"
              >
                <Search className="w-4 h-4 text-primary" />
              </button>

              {/* Global Theme Selector Dropdown */}
              <ThemeSelector />
            </div>

          </div>
        </div>
      </header>

      {/* Global OmniSearch Modal Dialog */}
      <OmniSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
