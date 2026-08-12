import { ROOT_DATABASE } from '@/lib/data/roots';
import { getRootBySlug } from '@/lib/search/root-search';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import { notFound } from 'next/navigation';
import EtymologyCard from '@/components/EtymologyCard';
import DerivativesGrid from '@/components/DerivativesGrid';
import AyahConcordance from '@/components/AyahConcordance';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers, Radio } from 'lucide-react';

export function generateStaticParams() {
  return ROOT_DATABASE.map((root) => ({
    slug: root.id,
  }));
}

// Allow dynamic params so queries beyond pre-seeded roots fetch live from API
export const dynamicParams = true;

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function RootDetailPage({ params }: PageProps) {
  let root = getRootBySlug(params.slug);
  let isLiveFetched = false;

  // Real-time Live API Fallback if root is not pre-seeded in static database
  if (!root) {
    root = (await fetchLiveRoot(params.slug)) || undefined;
    isLiveFetched = true;
  }

  if (!root) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-primary transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Root Banner */}
      <div className="gradient-mesh bg-white border border-hairline rounded-3xl p-8 sm:p-12 mb-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-subdued text-primary-deep text-xs font-mono font-bold rounded-full">
                <span>AKAR KATA AL-QUR'AN</span>
                <span>•</span>
                <span>{root.totalOccurrences} KEMUNCULAN</span>
              </span>

              {isLiveFetched && (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-semibold rounded-full animate-pulse">
                  <Radio className="w-3 h-3 text-amber-600" />
                  <span>REAL-TIME LIVE API FETCH</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-light text-ink-primary tracking-tight mb-2">
              Akar Kata <span className="font-semibold text-primary">{root.rootArabic}</span> ({root.rootLatin})
            </h1>

            <p className="text-lg text-slate-600 font-sans">
              {root.titleIndo}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-canvas-soft border border-hairline rounded-2xl p-4">
            <div className="text-center px-4 border-r border-hairline">
              <span className="block text-2xl font-bold font-mono text-ink-primary">{root.verbsCount}</span>
              <span className="text-xs text-slate-500 font-mono">Kata Kerja</span>
            </div>
            <div className="text-center px-4">
              <span className="block text-2xl font-bold font-mono text-ink-primary">{root.nounsCount}</span>
              <span className="text-xs text-slate-500 font-mono">Kata Benda</span>
            </div>
          </div>
        </div>
      </div>

      {/* Etymology Section */}
      <div className="mb-8">
        <EtymologyCard
          rootArabic={root.rootArabic}
          rootLatin={root.rootLatin}
          etymologyNote={root.etymologyNote}
          meaningsIndonesian={root.meaningsIndonesian}
        />
      </div>

      {/* Derivatives Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-light text-ink-primary tracking-tight mb-4 flex items-center space-x-2">
          <Layers className="w-6 h-6 text-primary" />
          <span>Katalog Turunan Kata (Derivatives)</span>
        </h2>
        <DerivativesGrid verbs={root.verbs} nouns={root.nouns} />
      </div>

      {/* Ayah Concordance Section */}
      <h2 className="text-2xl font-light text-ink-primary tracking-tight mb-4 flex items-center space-x-2">
        <BookOpen className="w-6 h-6 text-primary" />
        <span>Ayah Concordance & Analysis Per Kata</span>
      </h2>
      <AyahConcordance
        occurrences={root.occurrences}
        rootArabic={root.rootArabic}
        rootLatin={root.rootLatin}
      />
    </div>
  );
}
