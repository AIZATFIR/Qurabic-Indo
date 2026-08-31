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
    <div className="group bg-canvas-surface border border-hairline rounded-2xl p-6 sm:p-7 shadow-subtle hover:border-primary/40 transition-all duration-200 flex flex-col justify-between relative space-y-4">
      
      {/* Bookmark Button (Quiet, subtle interaction) */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleBookmark(root.id);
        }}
        title={bookmarked ? 'Hapus dari Kata Tersimpan' : 'Simpan Kata Ini'}
        className={`absolute top-5 right-5 p-2 rounded-xl transition-colors z-10 ${
          bookmarked
            ? 'text-primary'
            : 'text-ink-mute hover:text-primary'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
      </button>

      <div className="space-y-3">
        {/* Quiet Scholarly Metadata (No loud badge pill) */}
        <div className="text-xs text-ink-mute font-medium font-sans tracking-wide">
          {root.totalOccurrences} kemunculan di Al-Qur&apos;an
        </div>

        {/* Root Word & Transliteration */}
        <Link href={`/akar/${root.id}`} className="block group-hover:text-primary transition-colors space-y-2">
          <div className="flex items-baseline space-x-3">
            <h3 className="font-arabic text-3xl sm:text-4xl font-semibold text-ink-primary group-hover:text-primary transition-colors" dir="rtl">
              {root.rootArabic}
            </h3>
            <span className="text-base font-medium text-ink-mute font-sans">
              ({root.rootLatin})
            </span>
          </div>

          {/* Primary Meaning (Direct, prominent, no redundant 'ARTI UTAMA:' label) */}
          <p className="text-base sm:text-lg font-semibold text-ink-primary font-sans leading-snug line-clamp-2">
            {primaryMeaning}
          </p>

          {/* Linguistic Evidence & Etymology */}
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed line-clamp-2 font-sans italic">
            &ldquo;{displayEtymology}&rdquo;
          </p>
        </Link>
      </div>

      {/* Morphology & Action Link */}
      <div className="pt-3.5 border-t border-hairline flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-medium text-ink-mute font-sans">
          <span className="text-ink-secondary">{root.verbsCount} Fi&apos;il</span>
          <span>•</span>
          <span className="text-ink-secondary">{root.nounsCount} Isim</span>
        </div>

        <Link
          href={`/akar/${root.id}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline transition-colors font-sans"
        >
          <span>Bedah Morfologi</span>
          <BookOpen className="w-3.5 h-3.5" />
        </Link>
      </div>

    </div>
  );
}
