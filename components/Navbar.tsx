'use client';

import Link from 'next/link';
import { BookOpen, Search, Heart, BookMarked, Sparkles, LogOut, User, CheckCircle2 } from 'lucide-react';
import OmniSearch from './OmniSearch';
import GoogleAuthModal from './GoogleAuthModal';
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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md border-b border-hairline dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Branding - Qurabic */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2.5 group">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-soft group-hover:scale-105 transition-transform">
                  Q
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-lg text-ink-primary dark:text-white tracking-tight leading-none group-hover:text-primary transition-colors">
                    Qurabic <span className="text-primary font-normal">(Indo)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-0.5 flex items-center space-x-1">
                    <span>Quranic Arabic Corpus</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-1" title="API Live Connected" />
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link
                href="/baca"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 font-semibold dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900/50"
              >
                <BookMarked className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Baca Qur&apos;an (114 Surah)</span>
              </Link>
              <Link
                href="/morfologi"
                className="hover:text-primary transition-colors flex items-center space-x-1.5"
              >
                <BookOpen className="w-4 h-4 text-primary" />
                <span>Katalog Morfologi</span>
              </Link>
              <Link
                href="/ayat-random"
                className="hover:text-primary transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Ayat Acak</span>
              </Link>
              <Link
                href="/favorit"
                className="hover:text-primary transition-colors flex items-center space-x-1.5 relative"
              >
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                <span>Akar Tersimpan</span>
                {bookmarkedIds.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                    {bookmarkedIds.length}
                  </span>
                )}
              </Link>
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center space-x-2 bg-canvas-soft dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-hairline dark:border-slate-700 text-slate-500 dark:text-slate-300 px-3.5 py-2 rounded-full text-xs transition-all shadow-soft"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>Cari 6.236 Ayat (e.g. sabar, ص-ل-و)...</span>
                <kbd className="hidden lg:inline-block bg-white dark:bg-slate-900 text-slate-400 text-[10px] px-1.5 py-0.5 rounded border border-hairline dark:border-slate-800 font-mono ml-2">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="sm:hidden p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-canvas-soft border border-hairline dark:border-slate-700"
                aria-label="Cari"
              >
                <Search className="w-4 h-4 text-primary" />
              </button>

              {/* Login / User Profile Toggle */}
              {user ? (
                <div className="flex items-center space-x-2 bg-canvas-soft dark:bg-slate-800 border border-hairline dark:border-slate-700 p-1 pr-3 rounded-full">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full bg-primary-subdued border border-primary/20"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    title="Keluar"
                    className="text-slate-400 hover:text-rose-500 ml-1 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-primary hover:bg-primary-deep text-white text-xs font-semibold px-4 py-2 rounded-full shadow-soft hover:shadow-hover transition-all flex items-center space-x-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Masuk Google</span>
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
