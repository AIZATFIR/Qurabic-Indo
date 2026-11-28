'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookMarked, Search } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { useLanguage } from '@/lib/context/LanguageContext';

interface IlluminatedQuranHeroProps {
  onOpenSearch: () => void;
  lastSearch?: string;
}

export default function ClassicIlluminatedQuranHero({ onOpenSearch, lastSearch }: IlluminatedQuranHeroProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const legacyTheme: string = theme === 'blend' ? 'bookpaper' : theme === 'modern' ? 'green' : 'light';
  const imageTone = legacyTheme === 'green'
    ? 'brightness-[0.94] contrast-[1.06]'
    : 'brightness-[0.98] contrast-[1.04]';

  return (
    <header className="mx-auto grid w-full max-w-7xl items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:px-8 lg:py-14">
      <div className="max-w-xl">
        <h1 className="font-sans text-4xl font-normal leading-[1.12] text-ink-primary sm:text-5xl lg:text-[3.5rem]">
          {t('Dari ayat, telusuri', 'From each verse, trace')}<br />
          <span className="font-medium text-primary">{t('akar katanya.', 'the words to their roots.')}</span>
        </h1>

        <p className="mt-5 max-w-lg font-sans text-base leading-7 text-ink-secondary sm:text-lg">
          {t('Baca Al-Qur’an, pelajari makna kata dalam konteks, lalu periksa akar dan rujukan kamusnya.', 'Read the Quran, study each word in context, then explore its root and dictionary references.')}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/baca"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] bg-primary px-5 py-3 font-sans text-base font-medium text-white shadow-subtle transition-colors hover:bg-primary-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <BookMarked className="h-4 w-4" aria-hidden="true" />
            <span>{t('Mulai membaca', 'Start reading')}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] border border-hairline bg-canvas-surface px-5 py-3 font-sans text-base font-medium text-ink-primary transition-colors hover:bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Search className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>{t('Cari kata atau akar', 'Find a word or root')}</span>
          </button>
        </div>

        {lastSearch && (
          <p className="mt-5 font-sans text-sm text-ink-secondary">
            {t('Pencarian terakhir:', 'Last search:')}{' '}
            <button type="button" onClick={onOpenSearch} className="font-medium text-primary underline underline-offset-4 focus-visible:outline-primary">
              {lastSearch}
            </button>
          </p>
        )}
      </div>

      <div className="relative aspect-[4/3] min-h-56 overflow-hidden rounded-[var(--radius-surface)] border border-hairline bg-canvas-soft shadow-soft sm:aspect-[16/10] lg:aspect-[1.08/1]">
        <Image
          src="/images/quran.jpg"
          alt={t('Mushaf terbuka di atas rehal', 'An open Quran resting on a wooden stand')}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          className={`object-cover object-[50%_62%] ${imageTone}`}
        />
      </div>
    </header>
  );
}
