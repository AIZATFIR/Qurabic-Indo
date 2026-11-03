'use client';

import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useLanguage } from '@/lib/context/LanguageContext';
import { RootWord } from '@/lib/types/morphology';
import { SURAH_LIST, SurahMeta } from '@/lib/data/surah-list';
import RootCard from './RootCard';
import Link from 'next/link';
import { Search, ArrowRight } from 'lucide-react';

interface VirtualQuranSearchResultsProps {
  query: string;
  initialRoots: RootWord[];
  liveRoot?: any;
}

type SearchFilterTab = 'all' | 'roots' | 'surahs';

export default function VirtualQuranSearchResults({
  query,
  initialRoots,
  liveRoot,
}: VirtualQuranSearchResultsProps) {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<SearchFilterTab>('all');

  // Filter surahs matching the query
  const matchingSurahs = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return SURAH_LIST.filter(
      (s) =>
        s.nameIndo.toLowerCase().includes(q) ||
        s.translationId.toLowerCase().includes(q) ||
        s.transliteration.toLowerCase().includes(q) ||
        s.number.toString() === q
    );
  }, [query]);

  // Combined Results list for virtualization
  const combinedItems = useMemo(() => {
    const list: Array<{ type: 'root' | 'surah'; data: any }> = [];

    if (activeFilter === 'all' || activeFilter === 'surahs') {
      matchingSurahs.forEach((s) => list.push({ type: 'surah', data: s }));
    }

    if (activeFilter === 'all' || activeFilter === 'roots') {
      initialRoots.forEach((r) => list.push({ type: 'root', data: r }));
    }

    return list;
  }, [activeFilter, matchingSurahs, initialRoots, liveRoot]);

  return (
    <section aria-labelledby="search-results-heading" className="space-y-6 font-sans">
      <h2 id="search-results-heading" className="sr-only">{t('Daftar hasil pencarian', 'Search results')}</h2>
      
      {/* Search Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-sm text-base font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-canvas-surface text-ink-mute hover:text-ink-primary border border-hairline'
            }`}
          >
            {t('Semua', 'All')} ({initialRoots.length + matchingSurahs.length})
          </button>

          <button
            onClick={() => setActiveFilter('roots')}
            className={`px-3.5 py-1.5 rounded-sm text-base font-semibold transition-all ${
              activeFilter === 'roots'
                ? 'bg-primary text-white'
                : 'bg-canvas-surface text-ink-mute hover:text-ink-primary border border-hairline'
            }`}
          >
            {t('Akar kata', 'Roots')} ({initialRoots.length})
          </button>

          <button
            onClick={() => setActiveFilter('surahs')}
            className={`px-3.5 py-1.5 rounded-sm text-base font-semibold transition-all ${
              activeFilter === 'surahs'
                ? 'bg-primary text-white'
                : 'bg-canvas-surface text-ink-mute hover:text-ink-primary border border-hairline'
            }`}
          >
            {t('Surah', 'Surahs')} ({matchingSurahs.length})
          </button>
        </div>

        <span className="text-base text-ink-mute">
          <strong className="text-ink-primary">{combinedItems.length}</strong> {t('hasil', 'results')}
        </span>
      </div>

      {/* Empty State */}
      {combinedItems.length === 0 ? (
        <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-sm space-y-3">
          <Search className="w-8 h-8 mx-auto text-ink-mute opacity-40" />
          <h3 className="text-base font-semibold text-ink-primary">{t('Tidak ada hasil', 'No results found')}</h3>
          <p className="text-base text-ink-mute max-w-md mx-auto">
            {t(`Tidak ada hasil untuk “${query}” pada kategori ini. Coba kata kunci lain.`, `No results for “${query}” in this category. Try another search.`)}
          </p>
        </div>
      ) : (
        /* React Virtuoso High Performance List Container */
        <div className="min-h-[500px]">
          <Virtuoso
            useWindowScroll
            data={combinedItems}
            itemContent={(index, item) => {
              if (item.type === 'surah') {
                const surah = item.data as SurahMeta;
                return (
                  <div className="pb-4" key={`surah-${surah.number}`}>
                    <Link
                      href={`/baca?surah=${surah.number}`}
                      aria-label={t(`Buka Surah ${surah.number}. ${surah.nameIndo}`, `Open Surah ${surah.number}. ${surah.transliteration}`)}
                      className="p-5 rounded-sm bg-canvas-surface border border-hairline hover:border-primary/40 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-sm bg-primary-subdued text-primary flex items-center justify-center font-bold text-sm">
                          {surah.number}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-ink-primary group-hover:text-primary transition-colors text-sm">
                              {t('Surah', 'Surah')} {language === 'en' ? surah.transliteration : surah.nameIndo}
                            </h3>
                            {language === 'id' && <span className="text-sm text-ink-secondary">({surah.translationId})</span>}
                          </div>
                          <p className="text-base text-ink-mute mt-0.5">
                            {surah.ayahsCount} {t('ayat', 'verses')} · {language === 'en' ? (surah.revelationType === 'Makkiyyah' ? 'Meccan' : 'Medinan') : surah.revelationType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-arabic text-xl font-bold text-ink-primary" dir="rtl">
                          {surah.nameArabic}
                        </span>
                        <div className="w-8 h-8 rounded-sm bg-canvas-soft group-hover:bg-primary group-hover:text-white text-ink-mute flex items-center justify-center transition-all">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              }

              if (item.type === 'root') {
                const root = item.data as RootWord;
                return (
                  <div className="pb-4" key={`root-${root.id}`}>
                    <RootCard root={root} />
                  </div>
                );
              }

              return null;
            }}
          />
        </div>
      )}

    </section>
  );
}
