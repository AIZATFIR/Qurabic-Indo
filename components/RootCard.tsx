import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles, Layers } from 'lucide-react';
import { RootWord } from '@/lib/types/morphology';

interface RootCardProps {
  root: RootWord;
}

export default function RootCard({ root }: RootCardProps) {
  return (
    <Link
      href={`/akar/${root.id}`}
      className="group relative p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden"
    >
      {/* Accent Background Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
              {root.rootLatin.toUpperCase()}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700/80">
              {root.totalOccurrences}x di Qur&apos;an
            </span>
          </div>

          <div className="text-right">
            <span className="font-arabic text-2xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
              {root.rootArabicJoined}
            </span>
          </div>
        </div>

        {/* Title & Meaning */}
        <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors mb-1">
          {root.titleIndo}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {root.meaningsIndonesian[0]}
        </p>

        {/* Etymology Highlight note */}
        {root.etymologyNote && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px] text-amber-300/90 leading-relaxed italic">
            <span className="font-semibold not-italic">💡 Etimologi: </span>
            {root.etymologyNote.length > 90 ? `${root.etymologyNote.slice(0, 90)}...` : root.etymologyNote}
          </div>
        )}
      </div>

      {/* Footer stats */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1 text-emerald-400/90 font-medium">
            <Layers className="w-3.5 h-3.5" />
            <span>{root.verbsCount} Fi&apos;il</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-400/90 font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{root.nounsCount} Isim</span>
          </span>
        </div>

        <span className="flex items-center space-x-1 text-slate-400 group-hover:text-emerald-400 transition-colors font-medium text-[11px]">
          <span>Detail Morfologi</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </Link>
  );
}
