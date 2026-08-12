import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { RootWord } from '@/lib/types/morphology';

interface RootCardProps {
  root: RootWord;
}

export default function RootCard({ root }: RootCardProps) {
  return (
    <Link
      href={`/akar/${root.id}`}
      className="bg-white p-7 rounded-xl border border-hairline shadow-soft hover:shadow-hover transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top Badges */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-primary-subdued text-primary-deep px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
            AKAR: {root.rootLatin.toUpperCase()}
          </span>
          <span className="font-mono text-xs text-ink-mute">
            Occurrences: {root.totalOccurrences.toLocaleString()}
          </span>
        </div>

        {/* Arabic Root Display */}
        <h3 className="text-3xl font-bold font-arabic text-ink-primary mb-2 group-hover:text-primary transition-colors text-right" dir="rtl">
          {root.rootArabic}
        </h3>

        {/* Title & Meaning in Indonesian */}
        <h4 className="font-semibold text-base text-ink-primary group-hover:text-primary transition-colors mb-1">
          {root.titleIndo}
        </h4>
        <p className="text-xs text-ink-secondary mb-4 line-clamp-2 leading-relaxed">
          {root.meaningsIndonesian[0]}
        </p>

        {/* Etymology Note if available */}
        {root.etymologyNote && (
          <div className="mb-4 p-2.5 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed italic">
            <span className="font-semibold not-italic">💡 Etimologi Klasik: </span>
            {root.etymologyNote.length > 85 ? `${root.etymologyNote.slice(0, 85)}...` : root.etymologyNote}
          </div>
        )}
      </div>

      {/* Footer Info & Arrow */}
      <div className="pt-4 border-t border-hairline flex justify-between items-center text-xs text-ink-secondary">
        <span className="font-mono">
          Bentuk Kata: {root.verbsCount + root.nounsCount} ({root.verbsCount} Fi&apos;il, {root.nounsCount} Isim)
        </span>
        <ChevronRight className="w-4 h-4 text-ink-mute group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
