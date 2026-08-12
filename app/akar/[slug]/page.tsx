import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, BookOpen, Layers } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 space-y-8">
      
      {/* Back & Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-ink-secondary hover:text-primary transition-colors px-4 py-2 rounded-full bg-white border border-hairline shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <span className="text-xs text-ink-mute font-mono">
          Corpus ID: {root.id}
        </span>
      </div>

      {/* Root Banner Header */}
      <div className="relative p-8 sm:p-10 rounded-2xl bg-white border border-hairline shadow-soft gradient-mesh flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
        
        <div className="space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="px-3.5 py-1 rounded-full bg-primary-subdued text-primary-deep font-mono font-bold text-xs">
              AKAR: {root.rootLatin.toUpperCase()}
            </span>
            <span className="px-3.5 py-1 rounded-full bg-canvas-soft text-ink-mute border border-hairline font-mono text-xs font-semibold">
              {root.totalOccurrences}x di Al-Qur&apos;an
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light text-ink-primary tracking-tight">
            {root.titleIndo}
          </h1>

          <p className="text-xs sm:text-sm text-ink-mute">
            {root.titleEnglish} • {root.verbsCount} Kata Kerja • {root.nounsCount} Kata Benda
          </p>
        </div>

        {/* Large Arabic Root Display */}
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-primary to-primary-deep p-0.5 shadow-soft flex-shrink-0">
          <div className="w-full h-full rounded-[14px] bg-white flex flex-col items-center justify-center text-primary">
            <span className="font-arabic text-4xl sm:text-5xl font-bold pt-1">
              {root.rootArabicJoined}
            </span>
            <span className="text-[10px] font-mono text-ink-mute mt-1">
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
