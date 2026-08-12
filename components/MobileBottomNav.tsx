'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Heart, Search } from 'lucide-react';
import OmniSearch from './OmniSearch';
import { useBookmarks } from '@/lib/hooks/useBookmarks';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { bookmarkedIds } = useBookmarks();

  const navItems = [
    { label: 'Beranda', href: '/', icon: Home },
    { label: 'Katalog', href: '/morfologi', icon: BookOpen },
    { label: 'Favorit', href: '/favorit', icon: Heart, badge: bookmarkedIds.length },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-hairline px-4 py-2 shadow-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-2xl transition-all relative ${
                  isActive ? 'text-primary font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive && item.href === '/favorit' ? 'fill-current' : ''}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium font-sans">{item.label}</span>
              </Link>
            );
          })}

          {/* Search Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center space-y-0.5 py-1 px-3 rounded-2xl text-slate-500 hover:text-primary transition-all"
          >
            <Search className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-medium font-sans">Cari</span>
          </button>
        </div>
      </div>

      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
