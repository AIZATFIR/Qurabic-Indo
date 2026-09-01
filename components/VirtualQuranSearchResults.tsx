'use client';

import React, { useState, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { RootWord } from '@/lib/types/morphology';
import { SURAH_LIST, SurahMeta } from '@/lib/data/surah-list';
import RootCard from './RootCard';
import Link from 'next/link';
import { BookOpen, Search, ArrowRight, Layers, BookMarked, Radio } from 'lucide-react';

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
    const list: Array<{ type: 'root' | 'surah' | 'live'; data: any }> = [];

    if (liveRoot) {
      list.push({ type: 'live', data: liveRoot });
    }

    if (activeFilter === 'all' || activeFilter === 'surahs') {
      matchingSurahs.forEach((s) => list.push({ type: 'surah', data: s }));
    }

    if (activeFilter === 'all' || activeFilter === 'roots') {
      initialRoots.forEach((r) => list.push({ type: 'root', data: r }));
    }

    return list;
  }, [activeFilter, matchingSurahs, initialRoots, liveRoot]);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Search Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-4">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-canvas-surface text-ink-mute hover:text-ink-primary border border-hairline'
            }`}
          >
            Semua ({combinedItems.length})
          </button>

          <button
            onClick={() => setActiveFilter('roots')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'roots'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-canvas-surface text-ink-mute hover:text-ink-primary border border-hairline'
            }`}
          >
            Akar Kata ({initialRoots.length})
          </button>

          <button
            onClick={() => setActiveFilter('surahs')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === 'surahs'
                ? 'bg-primary text-white shadow-subtle'
                : 'bg-canvas-surface text-ink-mute hover:text-ink-primary border border-hairline'
            }`}
          >
            Surah ({matchingSurahs.length})
          </button>
        </div>

        <span className="text-xs text-ink-mute">
          Virtualisasi Render &bull; <strong className="text-ink-primary">{combinedItems.length}</strong> Item
        </span>
      </div>

      {/* Empty State */}
      {combinedItems.length === 0 ? (
        <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-3xl space-y-3 shadow-subtle">
          <Search className="w-8 h-8 mx-auto text-ink-mute opacity-40" />
          <h3 className="text-base font-semibold text-ink-primary">Tidak Ada Hasil Ditemukan</h3>
          <p className="text-xs text-ink-mute max-w-md mx-auto">
            Tidak ditemukan data yang cocok dengan &ldquo;{query}&rdquo; pada kategori terpilih. Cobalah gunakan kata kunci lain.
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
                      className="p-5 rounded-2xl bg-canvas-surface border border-hairline hover:border-primary/40 hover:shadow-subtle transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center font-bold text-sm">
                          {surah.number}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-ink-primary group-hover:text-primary transition-colors text-sm">
                              Surah {surah.nameIndo}
                            </h4>
                            <span className="text-[11px] text-ink-mute">({surah.translationId})</span>
                          </div>
                          <p className="text-xs text-ink-mute mt-0.5">
                            {surah.ayahsCount} Ayat &bull; {surah.revelationType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-arabic text-xl font-bold text-ink-primary" dir="rtl">
                          {surah.nameArabic}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-canvas-soft group-hover:bg-primary group-hover:text-white text-ink-mute flex items-center justify-center transition-all">
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

    </div>
  );
}
