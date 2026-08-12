'use client';

import React from 'react';
import Link from 'next/link';
import { RootWord } from '@/lib/types/morphology';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { Heart, BookOpen, Layers } from 'lucide-react';

interface RootCardProps {
  root: RootWord;
}

export default function RootCard({ root }: RootCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(root.id);

  return (
    <div className="group bg-white border border-hairline rounded-3xl p-6 shadow-soft hover:shadow-hover hover:border-primary/40 transition-all duration-300 flex flex-col justify-between relative">
      {/* Bookmark Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(root.id);
        }}
        title={bookmarked ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
        className={`absolute top-5 right-5 p-2 rounded-full border transition-all z-10 ${
          bookmarked
            ? 'bg-rose-50 border-rose-200 text-rose-500 scale-110 shadow-sm'
            : 'bg-canvas-soft border-hairline text-slate-400 hover:text-rose-500 hover:bg-rose-50'
        }`}
      >
        <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      </button>

      <div>
        {/* Occurrences Tag */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-subdued text-primary-deep text-xs font-mono font-bold rounded-full mb-4">
          <span>{root.totalOccurrences} KEMUNCULAN</span>
        </div>

        {/* Arabic Root & Title */}
        <Link href={`/akar/${root.id}`} className="block group-hover:text-primary transition-colors">
          <div className="flex items-baseline space-x-3 mb-2">
            <h3 className="font-arabic text-3xl font-bold text-ink-primary group-hover:text-primary transition-colors">
              {root.rootArabic}
            </h3>
            <span className="text-lg font-medium text-slate-500 font-sans">
              ({root.rootLatin})
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-800 line-clamp-1 mb-3">
            {root.titleIndo}
          </p>

          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4 font-sans">
            {root.etymologyNote}
          </p>
        </Link>
      </div>

      {/* Derivatives Counter & Action Link */}
      <div className="pt-4 border-t border-hairline flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
          <span className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>{root.verbsCount} Fi&apos;il</span>
          </span>
          <span>•</span>
          <span>{root.nounsCount} Isim</span>
        </div>

        <Link
          href={`/akar/${root.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:text-primary-deep transition-colors"
        >
          <span>Jelajahi</span>
          <BookOpen className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
