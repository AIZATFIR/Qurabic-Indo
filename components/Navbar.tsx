'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useState } from 'react';
import OmniSearch from './OmniSearch';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  if (pathname === '/baca') return null;
  return <>
    <header data-ui="primary-navigation" className="sticky top-0 z-40 bg-canvas-page border-b border-hairline">
      <div className="mx-auto max-w-7xl min-h-16 px-4 sm:px-8 flex items-center justify-between gap-3">
        <Link href="/" className="text-xl font-semibold text-ink-primary tracking-tight">Qurabic</Link>
        <nav data-ui="primary-navigation-links" aria-label={t('Navigasi utama', 'Main navigation')} className="hidden lg:flex items-center gap-6 text-sm text-ink-primary">
          <Link href="/baca" className="min-h-11 flex items-center hover:text-primary">{t('Baca Al-Qur’an', 'Read Quran')}</Link>
          <Link href="/morfologi" className="min-h-11 flex items-center hover:text-primary">{t('Indeks akar', 'Root index')}</Link>
          <Link href="/favorit" className="min-h-11 flex items-center hover:text-primary">{t('Tersimpan', 'Saved')}</Link>
          <Link href="/tentang" className="min-h-11 flex items-center hover:text-primary">{t('Sumber', 'Sources')}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button data-search-trigger type="button" onClick={() => setIsSearchOpen(true)} aria-label={t('Cari', 'Search')} className="min-h-11 min-w-11 flex items-center justify-center text-ink-primary hover:bg-canvas-soft focus-visible:outline-primary"><Search className="w-5 h-5" /></button>
          <LanguageSelector />
          <ThemeSelector />
        </div>
      </div>
    </header>
    <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
  </>;
}
