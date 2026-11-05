'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';

interface IlluminatedQuranHeroProps {
  onOpenSearch: () => void;
  lastSearch?: string;
}

export default function IlluminatedQuranHero({ onOpenSearch, lastSearch }: IlluminatedQuranHeroProps) {
  const { t } = useLanguage();
  const { theme, layoutMode } = useTheme();
  const framed = theme !== 'simple';
  const modern = theme === 'modern';

  if (layoutMode === 'classic') {
    return (
      <header className="relative isolate flex min-h-[38rem] items-center justify-center overflow-hidden border-b border-hairline text-center sm:min-h-[45rem]">
        <Image
          src="/images/quran.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-[50%_42%]"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: theme === 'modern' ? 'radial-gradient(ellipse 90% 82% at 50% 42%, rgba(7,22,16,.76), rgba(7,22,16,.9) 72%, #071610)' : 'radial-gradient(ellipse 90% 78% at 50% 40%, rgba(249,246,239,.74), rgba(249,246,239,.91) 67%, var(--bg-page))' }} />
        <div className="mx-auto w-full max-w-5xl px-5 py-24 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-4xl">
            <h1 className={`text-4xl font-light leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl ${theme === 'modern' ? 'text-white' : 'text-ink-primary'}`}>
              {t('Membedah Kedalaman', 'Explore the depth of')}<br />
              <span className="font-semibold text-primary">{t("Bahasa Al-Qur'an", 'Quranic Arabic')}</span>
            </h1>
            <p className={`mx-auto mt-6 max-w-2xl text-base leading-relaxed sm:text-lg ${theme === 'modern' ? 'text-white/85' : 'text-ink-secondary'}`}>
              {t('Telusuri akar kata, bentuk dalam ayat, dan rujukan leksikon klasik dengan sumber yang jelas.', 'Explore word roots, forms in context, and classical lexicon sources with clear citations.')}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/baca" className={`inline-flex min-h-12 items-center gap-3 px-7 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${theme === 'modern' ? 'bg-white text-primary-deep hover:bg-primary-fixed' : 'bg-primary text-white hover:bg-primary-deep'}`} style={{ borderRadius: 'var(--radius-control)' }}>
                {t("Buka Al-Qur'an", 'Open the Quran')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button type="button" onClick={onOpenSearch} className={`inline-flex min-h-12 items-center gap-3 border px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${theme === 'modern' ? 'border-white/50 text-white hover:bg-white/10' : 'border-hairline bg-canvas-surface/85 text-ink-primary hover:bg-canvas-surface'}`} style={{ borderRadius: 'var(--radius-control)' }}>
                <Search className="h-4 w-4" aria-hidden="true" /> {t('Cari kata atau akar', 'Find a word or root')}
              </button>
            </div>
            {lastSearch && <p className={`mt-5 text-sm ${theme === 'modern' ? 'text-white/80' : 'text-ink-secondary'}`}>{t('Pencarian terakhir:', 'Last search:')} <button type="button" onClick={onOpenSearch} className="underline underline-offset-4">{lastSearch}</button></p>}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`relative isolate my-6 sm:my-10 overflow-hidden transition-colors ${framed ? 'px-5 py-6 sm:px-10 sm:py-12' : 'py-8 sm:py-16'}`}
      style={framed ? { borderRadius: 'var(--radius-surface)', backgroundColor: modern ? 'var(--color-primary)' : 'var(--color-primary-subdued)', color: modern ? '#FFFFFF' : 'var(--color-ink-primary)' } : undefined}
    >
      {framed && <span aria-hidden="true" lang="ar" dir="rtl" className={`pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 select-none font-arabic text-[10rem] leading-none lg:block ${modern ? 'text-white/10' : 'text-primary/10'}`}>اقرأ</span>}
      <div className="relative max-w-3xl">
        <h1 className={`max-w-2xl text-3xl sm:text-[2.65rem] font-semibold tracking-tight leading-[1.16] ${modern ? 'text-white' : 'text-ink-primary'}`}>
          {t("Baca Al-Qur'an.", 'Read the Quran.')}<br />
          {t('Pelajari katanya.', 'Explore every word.')}
        </h1>
        <p className={`mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${modern ? 'text-white/85' : 'text-ink-secondary'}`}>
          {t('Buka makna kata saat membaca, telusuri akar dan turunannya, lalu lihat rujukannya.', 'Read word meanings in context, explore roots and their forms, and consult the sources.')}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <Link
          href="/baca"
          className={`inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${modern ? 'bg-white text-primary-deep hover:bg-primary-fixed' : 'bg-primary text-white hover:bg-primary-deep focus-visible:ring-offset-canvas'}`}
          style={{ borderRadius: 'var(--radius-control)' }}
        >
          {t("Buka Al-Qur'an", 'Open the Quran')}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={onOpenSearch}
          className={`inline-flex min-h-12 items-center justify-center gap-3 border px-6 py-3 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 ${modern ? 'border-white/35 text-white hover:bg-white/10 focus-visible:ring-offset-primary' : 'border-hairline text-ink-primary hover:bg-canvas-surface focus-visible:ring-offset-canvas'}`}
          style={{ borderRadius: 'var(--radius-control)' }}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {t('Cari kata atau akar', 'Find a word or root')}
        </button>
        </div>
        {lastSearch && (
        <p className={`mt-5 text-base ${modern ? 'text-white/85' : 'text-ink-secondary'}`}>
          {t('Pencarian terakhir:', 'Last search:')}{' '}
          <button type="button" onClick={onOpenSearch} className={`underline underline-offset-4 focus-visible:outline-primary ${modern ? 'text-white' : 'text-primary'}`}>
            {lastSearch}
          </button>
        </p>
        )}
      </div>
    </header>
  );
}
