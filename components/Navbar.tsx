'use client';

import Link from 'next/link';
import { BookOpen, Search, Bookmark, BookMarked, Shuffle } from 'lucide-react';
import OmniSearch from './OmniSearch';
import ThemeSelector from './ThemeSelector';
import { useState } from 'react';
import { useBookmarks } from '@/lib/hooks/useBookmarks';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarkedIds } = useBookmarks();

  return (
    <>
      {/* Static Solid Headbar - Non-sticky, Solid Color, Stays at the top */}
      <header className="w-full bg-canvas border-b border-hairline transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo Branding (Clean Minimalist Typographic) */}
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
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-fixed"
              >
                <BookMarked className="w-3.5 h-3.5 text-primary" />
                <span>Baca Qur&apos;an</span>
              </Link>
              
              <Link
                href="/ayat-random"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-fixed"
              >
                <Shuffle className="w-3.5 h-3.5 text-primary" />
                <span>Ayat Acak</span>
              </Link>

              <Link
                href="/morfologi"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-fixed"
              >
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Katalog Morfologi</span>
              </Link>

              <Link
                href="/favorit"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-lg hover:bg-primary-fixed relative"
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
                className="hidden sm:flex items-center space-x-2 bg-canvas-soft hover:bg-canvas-surface border border-hairline text-ink-mute px-3.5 py-1.5 rounded-full text-xs transition-all shadow-subtle hover:border-primary/40"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Cari kata atau akar kata...</span>
                <kbd className="hidden lg:inline-block bg-canvas-surface text-ink-mute text-[9px] px-1.5 py-0.5 rounded border border-hairline font-sans ml-1">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-1.5 rounded-full text-ink-secondary hover:bg-primary-fixed border border-hairline"
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

      {/* OmniSearch Modal Overlay */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
