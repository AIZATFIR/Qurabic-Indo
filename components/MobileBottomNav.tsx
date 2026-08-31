'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Bookmark, Search, BookMarked, Shuffle, Sparkles } from 'lucide-react';
import OmniSearch from './OmniSearch';
import { useBookmarks } from '@/lib/hooks/useBookmarks';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarkedIds } = useBookmarks();

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Baca', href: '/baca', icon: BookMarked },
    { label: 'Katalog', href: '/morfologi', icon: BookOpen },
    { label: 'Rekomendasi', href: '/rekomendasi', icon: Sparkles },
    { label: 'Tersimpan', href: '/favorit', icon: Bookmark, badge: bookmarkedIds.length },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-md border-t border-hairline px-2 py-1.5 shadow-subtle">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-2 rounded-xl transition-all relative ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-ink-mute hover:text-ink-primary'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 ${isActive && item.href === '/favorit' ? 'fill-current' : ''}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-medium font-sans">{item.label}</span>
              </Link>
            );
          })}

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center space-y-0.5 py-1 px-2 rounded-xl text-ink-mute hover:text-primary transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="text-[9px] font-medium font-sans">Cari</span>
          </button>
        </div>
      </div>

      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
