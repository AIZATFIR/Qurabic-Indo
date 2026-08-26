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
    <div className="group bg-canvas-surface border border-hairline rounded-2xl p-5 shadow-subtle hover:shadow-soft hover:border-primary/40 transition-all duration-200 flex flex-col justify-between relative">
      
      {/* Bookmark Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(root.id);
        }}
        title={bookmarked ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
        className={`absolute top-4 right-4 p-1.5 rounded-full border transition-all z-10 ${
          bookmarked
            ? 'bg-primary-subdued border-primary/30 text-primary'
            : 'bg-canvas-soft border-hairline text-ink-mute hover:text-primary'
        }`}
      >
        <Heart className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
      </button>

      <div>
        {/* Occurrences Badge */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-primary-subdued text-primary text-[11px] font-semibold rounded-md mb-3 font-sans">
          <span>{root.totalOccurrences} Kemunculan</span>
        </div>

        {/* Arabic Root & Title Link */}
        <Link href={`/akar/${root.id}`} className="block group-hover:text-primary transition-colors">
          <div className="flex items-baseline space-x-2.5 mb-2">
            <h3 className="font-arabic text-2xl font-bold text-ink-primary group-hover:text-primary transition-colors">
              {root.rootArabic}
            </h3>
            <span className="text-sm font-medium text-ink-mute font-sans">
              ({root.rootLatin})
            </span>
          </div>

          {/* Primary Definition Block */}
          <div className="mb-2.5 p-2.5 rounded-xl bg-canvas-soft border border-hairline space-y-0.5">
            <span className="text-[10px] font-semibold text-ink-mute uppercase tracking-wider block font-sans">
              Arti Utama:
            </span>
            <p className="text-xs font-bold text-ink-primary font-sans leading-snug line-clamp-2">
              {primaryMeaning}
            </p>
          </div>

          {/* Etymology Description */}
          <div className="text-xs text-ink-secondary leading-relaxed line-clamp-2 mb-3 font-sans italic">
            &ldquo;{displayEtymology}&rdquo;
          </div>

          {/* Derivatives Preview Chips */}
          {(root.verbs?.length > 0 || root.nouns?.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {root.verbs?.slice(0, 2).map((v, idx) => (
                <span
                  key={`v-${idx}`}
                  className="px-2 py-0.5 rounded bg-canvas-soft text-ink-secondary text-[10px] font-medium font-sans"
                >
                  Fi&apos;il: {v.arabic} ({v.meaningIndo})
                </span>
              ))}
              {root.nouns?.slice(0, 2).map((n, idx) => (
                <span
                  key={`n-${idx}`}
                  className="px-2 py-0.5 rounded bg-canvas-soft text-ink-secondary text-[10px] font-medium font-sans"
                >
                  Isim: {n.arabic} ({n.meaningIndo})
                </span>
              ))}
            </div>
          )}
        </Link>
      </div>

      {/* Derivatives Counter & Action Link */}
      <div className="pt-3 border-t border-hairline flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-ink-mute font-sans">
          <span className="flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-ink-secondary">{root.verbsCount} Fi&apos;il</span>
          </span>
          <span>•</span>
          <span className="font-medium text-ink-secondary">{root.nounsCount} Isim</span>
        </div>

        <Link
          href={`/akar/${root.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline transition-colors"
        >
          <span>Detail</span>
          <BookOpen className="w-3 h-3" />
        </Link>
      </div>

    </div>
  );
}
