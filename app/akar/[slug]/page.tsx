import { ROOT_DATABASE } from '@/lib/data/roots';
import { getRootBySlug } from '@/lib/search/root-search';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import { notFound } from 'next/navigation';
import EtymologyCard from '@/components/EtymologyCard';
import DerivativesGrid from '@/components/DerivativesGrid';
import AyahConcordance from '@/components/AyahConcordance';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers, Radio, ShieldCheck } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm text-ink-mute hover:text-primary transition-colors font-medium font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Anchor Quick Links */}
        <div className="hidden sm:flex items-center space-x-2 text-xs font-sans">
          <a
            href="#etimologi"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Etimologi
          </a>
          <a
            href="#turunan"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Turunan Kata
          </a>
          <a
            href="#concordance"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Daftar Ayat
          </a>
        </div>
      </div>

      {/* Root Banner */}
      <div className="bg-canvas-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-subtle">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-xs text-ink-mute font-medium font-sans">
              <span>Akar Kata Al-Qur&apos;an</span>
              <span>•</span>
              <span>{root.totalOccurrences} Kemunculan</span>

              {isLiveFetched && (
                <span className="inline-flex items-center space-x-1 text-primary">
                  <Radio className="w-3 h-3 text-primary animate-pulse" />
                  <span>Pencarian Ayat (Live)</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-light text-ink-primary tracking-tight font-sans">
              Akar Kata <span className="font-arabic font-semibold text-primary">{root.rootArabic}</span> ({root.rootLatin})
            </h1>

            <p className="text-base sm:text-lg text-ink-secondary font-sans leading-relaxed">
              {root.titleIndo}
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-canvas-soft border border-hairline rounded-2xl p-4 font-sans">
            <div className="text-center px-4 border-r border-hairline">
              <span className="block text-2xl font-semibold text-ink-primary">{root.verbsCount}</span>
              <span className="text-xs text-ink-mute font-medium">Fi&apos;il (Kata Kerja)</span>
            </div>
            <div className="text-center px-4">
              <span className="block text-2xl font-semibold text-ink-primary">{root.nounsCount}</span>
              <span className="text-xs text-ink-mute font-medium">Isim (Kata Benda)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Etymology Section */}
      <section id="etimologi" className="scroll-mt-24">
        <EtymologyCard
          rootArabic={root.rootArabic}
          rootLatin={root.rootLatin}
          etymologyNote={root.etymologyNote}
          meaningsIndonesian={root.meaningsIndonesian}
        />
      </section>

      {/* Derivatives Section */}
      <section id="turunan" className="scroll-mt-24">
        <DerivativesGrid verbs={root.verbs} nouns={root.nouns} />
      </section>

      {/* Ayah Concordance Section */}
      <section id="concordance" className="scroll-mt-24 space-y-4">
        <div className="border-b border-hairline pb-2">
          <h2 className="text-2xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Daftar Ayat Kemunculan dalam Al-Qur&apos;an</span>
          </h2>
          <p className="text-xs text-ink-mute mt-0.5 font-sans">
            Teks Al-Qur&apos;an rujukan Mushaf Standar Kemenag RI berserta analisis perkata
          </p>
        </div>
        <AyahConcordance
          occurrences={root.occurrences}
          rootArabic={root.rootArabic}
          rootLatin={root.rootLatin}
        />
      </section>
    </div>
  );
}
