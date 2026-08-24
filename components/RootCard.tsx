'use client';

import React from 'react';
import Link from 'next/link';
import { RootWord } from '@/lib/types/morphology';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { Heart, BookOpen, Layers, BookMarked } from 'lucide-react';

interface RootCardProps {
  root: RootWord;
}

export default function RootCard({ root }: RootCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(root.id);

  // Format definition text
  const primaryMeaning =
    root.meaningsIndonesian && root.meaningsIndonesian.length > 0
      ? root.meaningsIndonesian.join(' • ')
      : root.titleIndo;

  // Format etymology / detail note
  const isGenericEtymology =
    !root.etymologyNote ||
    root.etymologyNote.startsWith("Penyusunan etimologi dan morfologi");

  const displayEtymology = isGenericEtymology
    ? `Akar kata ${root.rootArabic} (${root.rootLatin}) membentuk ${root.verbsCount} bentuk Fi'il (kata kerja) dan ${root.nounsCount} bentuk Isim (kata benda) dengan total ${root.totalOccurrences} kemunculan dalam Al-Qur'an.`
    : root.etymologyNote;

  return (
    <div className="group bg-white dark:bg-[#131b2e] border border-hairline dark:border-slate-800 rounded-3xl p-6 shadow-soft hover:shadow-hover hover:border-primary/40 transition-all duration-300 flex flex-col justify-between relative">
      
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
            ? 'bg-rose-50 border-rose-200 text-rose-500 scale-110 shadow-sm dark:bg-rose-950/40 dark:border-rose-900/60'
            : 'bg-canvas-soft dark:bg-slate-800 border-hairline dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
        }`}
      >
        <Heart className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      </button>

      <div>
        {/* Occurrences Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-subdued dark:bg-primary-deep/30 text-primary-deep dark:text-primary-light text-xs font-mono font-bold rounded-full mb-4">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>{root.totalOccurrences} KEMUNCULAN</span>
        </div>

        {/* Arabic Root & Title Link */}
        <Link href={`/akar/${root.id}`} className="block group-hover:text-primary transition-colors">
          
          <div className="flex items-baseline space-x-3 mb-3">
            <h3 className="font-arabic text-3xl font-bold text-ink-primary dark:text-white group-hover:text-primary transition-colors">
              {root.rootArabic}
            </h3>
            <span className="text-base font-medium text-slate-500 dark:text-slate-400 font-sans">
              ({root.rootLatin})
            </span>
          </div>

          {/* Primary Definition Badge */}
          <div className="mb-3 p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-0.5">
            <span className="text-[10px] font-mono font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider block">
              Definisi &amp; Arti Utama:
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-amber-100 font-sans leading-snug line-clamp-2">
              {primaryMeaning}
            </p>
          </div>

          {/* Etymology Description */}
          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4 font-sans italic">
            &ldquo;{displayEtymology}&rdquo;
          </div>

          {/* Derivatives Preview Chips */}
          {(root.verbs?.length > 0 || root.nouns?.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {root.verbs?.slice(0, 2).map((v, idx) => (
                <span
                  key={`v-${idx}`}
                  className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/40 text-[10px] font-mono font-semibold"
                >
                  Fi&apos;il: {v.arabic} ({v.meaningIndo})
                </span>
              ))}
              {root.nouns?.slice(0, 2).map((n, idx) => (
                <span
                  key={`n-${idx}`}
                  className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40 text-[10px] font-mono font-semibold"
                >
                  Isim: {n.arabic} ({n.meaningIndo})
                </span>
              ))}
            </div>
          )}

        </Link>
      </div>

      {/* Derivatives Counter & Action Link */}
      <div className="pt-4 border-t border-hairline dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{root.verbsCount} Fi&apos;il</span>
          </span>
          <span>•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{root.nounsCount} Isim</span>
        </div>

        <Link
          href={`/akar/${root.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:text-primary-deep transition-colors"
        >
          <span>Jelajahi Akar</span>
          <BookOpen className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
