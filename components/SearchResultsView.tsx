'use client';

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { RootWord } from '@/lib/types/morphology';
import VirtualQuranSearchResults from './VirtualQuranSearchResults';
import AyahConcordance from './AyahConcordance';

interface SearchResultsViewProps {
  query: string;
  localResults: RootWord[];
  liveRoot: RootWord | null;
}

export default function SearchResultsView({ query, localResults, liveRoot }: SearchResultsViewProps) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 pb-24 space-y-8 font-sans">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-base text-primary hover:underline underline-offset-4 focus-visible:outline-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('Kembali ke beranda', 'Back to home')}
      </Link>
      <header className="space-y-5 border-b border-hairline pb-6">
        <h1 className="text-2xl font-medium text-ink-primary sm:text-3xl">{query ? t(`Hasil pencarian: “${query}”`, `Search results: “${query}”`) : t('Cari kata atau akar', 'Search words and roots')}</h1>
        <form action="/cari" method="GET" className="flex max-w-2xl gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" aria-hidden="true" />
            <input name="q" type="search" dir="auto" defaultValue={query} aria-label={t('Cari kata atau akar', 'Search for a word or root')} placeholder={t('Kata, akar, atau nama surah', 'Word, root, or surah name')} className="w-full min-h-12 rounded-xl border border-hairline bg-canvas-surface py-3 ps-11 pe-3 text-base text-ink-primary placeholder:text-ink-secondary focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" className="min-h-12 rounded-xl bg-primary px-5 py-3 text-base font-medium text-white hover:bg-primary-deep focus-visible:outline-primary">{t('Cari', 'Search')}</button>
        </form>
      </header>
      {/[؀-ۿ]/.test(query) && (
        <Link
          href={`/kamus?q=${encodeURIComponent(query)}`}
          className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          {t('Buka kamus kata dan partikel Arab', 'Look up Arabic words and particles')}
        </Link>
      )}
      {liveRoot && (
        <section aria-labelledby="live-root-heading" className="space-y-5">
          <h2 id="live-root-heading" className="text-2xl font-semibold text-ink-primary">{t('Akar ditemukan', 'Root found')}: <span lang="ar" dir="rtl" className="font-arabic">{liveRoot.rootArabic}</span></h2>
          <p className="text-base text-ink-secondary">{t('Ayat yang memuat akar ini', 'Verses containing this root')}</p>
          <AyahConcordance occurrences={liveRoot.occurrences} rootArabic={liveRoot.rootArabic} rootLatin={liveRoot.rootLatin} />
        </section>
      )}
      <VirtualQuranSearchResults query={query} initialRoots={localResults} liveRoot={liveRoot} />
    </div>
  );
}
