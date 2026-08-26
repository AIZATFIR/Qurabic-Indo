'use client';

import Link from 'next/link';
import { BookOpen, Search, Heart, BookMarked, Shuffle, LogOut, User } from 'lucide-react';
import OmniSearch from './OmniSearch';
import GoogleAuthModal from './GoogleAuthModal';
import ThemeSelector from './ThemeSelector';
import { useState } from 'react';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { bookmarkedIds } = useBookmarks();
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 bg-canvas/95 border-b border-hairline transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo Branding */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-soft group-hover:scale-105 transition-transform">
                  Q
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-base text-ink-primary tracking-tight leading-none group-hover:text-primary transition-colors">
                    Qurabic <span className="text-primary font-medium">(Indo)</span>
                  </span>
                  <span className="text-[10px] text-ink-mute font-sans mt-0.5">
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
                <Heart className="w-3.5 h-3.5 text-primary" />
                <span>Akar Tersimpan</span>
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
                className="hidden sm:flex items-center space-x-2 bg-canvas-soft hover:bg-white border border-hairline text-ink-mute px-3.5 py-1.5 rounded-full text-xs transition-all shadow-subtle hover:border-primary/40"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Cari akar kata (sabar, كتب)...</span>
                <kbd className="hidden lg:inline-block bg-white dark:bg-stone-800 text-stone-500 text-[9px] px-1.5 py-0.5 rounded border border-hairline font-sans ml-1">
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

              {/* Login / User Profile Toggle */}
              {user ? (
                <div className="flex items-center space-x-2 bg-white dark:bg-canvas-dark-surface border border-hairline p-1 pr-2.5 rounded-full shadow-subtle">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full bg-primary-subdued border border-primary/20"
                  />
                  <span className="text-xs font-semibold text-ink-primary max-w-[90px] truncate font-sans">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    title="Keluar"
                    className="text-stone-400 hover:text-primary ml-1 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-primary hover:bg-primary-deep text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-soft hover:shadow-hover transition-all flex items-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Masuk</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* OmniSearch Modal Overlay */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Google Auth Modal Overlay */}
      <GoogleAuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
