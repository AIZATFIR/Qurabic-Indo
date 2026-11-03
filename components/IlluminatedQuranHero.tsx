'use client';

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

interface IlluminatedQuranHeroProps {
  onOpenSearch: () => void;
  lastSearch?: string;
}

export default function IlluminatedQuranHero({ onOpenSearch, lastSearch }: IlluminatedQuranHeroProps) {
  const { t } = useLanguage();

  return (
    <header className="py-8 sm:py-16">
      <h1 className="max-w-2xl text-2xl sm:text-3xl font-semibold text-ink-primary tracking-tight leading-[1.2]">
        {t("Baca Al-Qur'an.", 'Read the Quran.')}<br />
        {t('Pelajari katanya.', 'Explore every word.')}
      </h1>
      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-ink-secondary">
        {t('Buka makna kata saat membaca, telusuri akar dan turunannya, lalu lihat rujukannya.', 'Read word meanings in context, explore roots and their forms, and consult the sources.')}
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <Link
          href="/baca"
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm bg-primary px-6 py-3 text-base font-medium text-white hover:bg-primary-deep transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
        >
          {t("Buka Al-Qur'an", 'Open the Quran')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-sm border border-hairline px-6 py-3 text-base font-medium text-ink-primary hover:bg-canvas-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {t('Cari kata atau akar', 'Find a word or root')}
        </button>
      </div>
      {lastSearch && (
        <p className="mt-5 text-base text-ink-secondary">
          {t('Pencarian terakhir:', 'Last search:')}{' '}
          <button type="button" onClick={onOpenSearch} className="text-primary underline underline-offset-4 focus-visible:outline-primary">
            {lastSearch}
          </button>
        </p>
      )}
    </header>
  );
}
