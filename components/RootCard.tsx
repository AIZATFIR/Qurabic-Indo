'use client';

import React from 'react';
import Link from 'next/link';
import { RootWord } from '@/lib/types/morphology';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { Bookmark, BookOpen, Layers } from 'lucide-react';

interface RootCardProps {
  root: RootWord;
}

export default function RootCard({ root }: RootCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(root.id);

  const primaryMeaning =
    root.meaningsIndonesian && root.meaningsIndonesian.length > 0
      ? root.meaningsIndonesian.join(' • ')
      : root.titleIndo;

  const isGenericEtymology =
    !root.etymologyNote ||
    root.etymologyNote.startsWith("Penyusunan etimologi dan morfologi");

  const displayEtymology = isGenericEtymology
    ? `Akar kata ${root.rootArabic} (${root.rootLatin}) membentuk ${root.verbsCount} bentuk Fi'il dan ${root.nounsCount} bentuk Isim dengan total ${root.totalOccurrences} kemunculan dalam Al-Qur'an.`
    : root.etymologyNote;

  return (
    <div className="group bg-canvas-surface border border-hairline rounded-3xl p-6 sm:p-7 shadow-subtle hover:shadow-soft hover:border-primary/40 transition-all duration-200 flex flex-col justify-between relative space-y-4">
      
      {/* Bookmark Button (YouTube / Modern UI standard saved ribbon) */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(root.id);
        }}
        title={bookmarked ? 'Hapus dari Kata Tersimpan' : 'Simpan Kata Ini'}
        className={`absolute top-5 right-5 p-2 rounded-2xl border transition-all z-10 ${
          bookmarked
            ? 'bg-primary-subdued border-primary/30 text-primary shadow-subtle'
            : 'bg-canvas-soft border-hairline text-ink-mute hover:text-primary hover:bg-canvas-surface'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      </button>

      <div>
        {/* Occurrences Badge */}
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-subdued text-primary text-xs font-semibold rounded-lg mb-3 font-sans">
          <span>{root.totalOccurrences} Kemunculan</span>
        </div>

        {/* Arabic Root & Title Link */}
        <Link href={`/akar/${root.id}`} className="block group-hover:text-primary transition-colors">
          <div className="flex items-baseline space-x-3 mb-3">
            <h3 className="font-arabic text-3xl sm:text-4xl font-bold text-ink-primary group-hover:text-primary transition-colors" dir="rtl">
              {root.rootArabic}
            </h3>
            <span className="text-base font-semibold text-ink-mute font-sans">
              ({root.rootLatin})
            </span>
          </div>

          {/* Primary Definition Block */}
          <div className="mb-3 p-3.5 rounded-2xl bg-canvas-soft border border-hairline space-y-1">
            <span className="text-[11px] font-semibold text-ink-mute uppercase tracking-wider block font-sans">
              Arti Utama:
            </span>
            <p className="text-sm sm:text-base font-bold text-ink-primary font-sans leading-snug line-clamp-2">
              {primaryMeaning}
            </p>
          </div>

          {/* Etymology Description */}
          <div className="text-xs sm:text-sm text-ink-secondary leading-relaxed line-clamp-2 mb-3 font-sans italic">
            &ldquo;{displayEtymology}&rdquo;
          </div>

          {/* Derivatives Preview Chips */}
          {(root.verbs?.length > 0 || root.nouns?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {root.verbs?.slice(0, 2).map((v, idx) => (
                <span
                  key={`v-${idx}`}
                  className="px-2.5 py-1 rounded-xl bg-canvas-soft text-ink-secondary text-xs font-medium font-sans"
                >
                  Fi&apos;il: {v.arabic} ({v.meaningIndo})
                </span>
              ))}
              {root.nouns?.slice(0, 2).map((n, idx) => (
                <span
                  key={`n-${idx}`}
                  className="px-2.5 py-1 rounded-xl bg-canvas-soft text-ink-secondary text-xs font-medium font-sans"
                >
                  Isim: {n.arabic} ({n.meaningIndo})
                </span>
              ))}
            </div>
          )}
        </Link>
      </div>

      {/* Derivatives Counter & Action Link */}
      <div className="pt-4 border-t border-hairline flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-ink-mute font-sans">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-semibold text-ink-secondary">{root.verbsCount} Fi&apos;il</span>
          </span>
          <span>•</span>
          <span className="font-semibold text-ink-secondary">{root.nounsCount} Isim</span>
        </div>

        <Link
          href={`/akar/${root.id}`}
          className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-primary hover:underline transition-colors"
        >
          <span>Detail Morfologi</span>
          <BookOpen className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
