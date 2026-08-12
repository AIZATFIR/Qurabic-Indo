import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen, Layers, Share2 } from 'lucide-react';
import { getRootBySlug } from '@/lib/search/root-search';
import { ROOT_DATABASE } from '@/lib/data/roots';
import EtymologyCard from '@/components/EtymologyCard';
import DerivativesGrid from '@/components/DerivativesGrid';
import AyahConcordance from '@/components/AyahConcordance';

export async function generateStaticParams() {
  return ROOT_DATABASE.map((root) => ({
    slug: root.id,
  }));
}

export default function RootDetailPage({ params }: { params: { slug: string } }) {
  const root = getRootBySlug(params.slug);

  if (!root) {
    notFound();
  }

  return (
    <div className="space-y-8 py-4">
      
      {/* Back & Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-xs text-slate-500 font-mono">
          Corpus ID: {root.id}
        </span>
      </div>

      {/* Root Banner Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/30 overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-xs">
              AKAR: {root.rootLatin.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-xs font-semibold">
              {root.totalOccurrences}x di Al-Qur&apos;an
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {root.titleIndo}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400">
            {root.titleEnglish} • {root.verbsCount} Kata Kerja • {root.nounsCount} Kata Benda
          </p>
        </div>

        {/* Large Arabic Root Display */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-0.5 shadow-glow-emerald flex-shrink-0">
          <div className="w-full h-full rounded-[14px] bg-obsidian-950 flex flex-col items-center justify-center text-emerald-400">
            <span className="font-arabic text-4xl sm:text-5xl font-bold pt-1">
              {root.rootArabicJoined}
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1">
              {root.rootArabic}
            </span>
          </div>
        </div>
      </div>

      {/* Classical Etymology Card */}
      <EtymologyCard
        rootArabic={root.rootArabicJoined}
        rootLatin={root.rootLatin}
        etymologyNote={root.etymologyNote}
        meaningsIndonesian={root.meaningsIndonesian}
      />

      {/* Derivatives Section (Fi'il & Isim) */}
      <DerivativesGrid verbs={root.verbs} nouns={root.nouns} />

      {/* Ayah Concordance Player */}
      <AyahConcordance occurrences={root.occurrences} rootArabicJoined={root.rootArabicJoined} />
    </div>
  );
}
