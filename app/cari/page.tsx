import { searchRoots } from '@/lib/search/root-search';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import VirtualQuranSearchResults from '@/components/VirtualQuranSearchResults';
import AyahConcordance from '@/components/AyahConcordance';
import Link from 'next/link';
import { Search, ArrowLeft, Radio, BookOpen, Layers } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  searchParams: {
    q?: string;
  };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = (searchParams.q || '').trim();
  return {
    title: query ? `Hasil Pencarian: "${query}" - Qurabic (Indo)` : 'Pencarian Korpus - Qurabic (Indo)',
    description: `Hasil pencarian akar kata, surah, dan morfologi Al-Qur'an untuk kata kunci "${query}".`,
  };
}

export default async function SearchResultsPage({ searchParams }: PageProps) {
  const query = (searchParams.q || '').trim();
  let localResults = searchRoots(query);
  let liveRoot = null;
  let isLiveFetched = false;

  // Sort local results by frequency
  localResults = [...localResults].sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  // If query exists and local results are sparse or query wasn't matched locally, attempt dynamic live fetch
  if (query && localResults.length === 0) {
    liveRoot = await fetchLiveRoot(query);
    if (liveRoot) {
      isLiveFetched = true;
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans pb-24">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-ink-mute hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Search Header Banner */}
      <div className="bg-canvas-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-subtle space-y-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-primary-subdued text-primary text-xs font-semibold rounded-full uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Pencarian Korpus &amp; Morfologi</span>
          </span>

          {isLiveFetched && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-fixed text-primary-deep text-xs font-semibold rounded-full">
              <Radio className="w-3 h-3 text-primary animate-pulse" />
              <span>Live API Fetch</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Hasil Pencarian untuk &ldquo;<span className="font-semibold text-primary">{query || 'Semua Akar Kata'}</span>&rdquo;
        </h1>

        {/* Dynamic Search Input Bar */}
        <form action="/cari" method="GET" className="pt-2 max-w-2xl">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-mute absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari akar kata, surah, atau kata (contoh: sabar, كتب, sholat, al-baqarah)..."
              className="w-full pl-11 pr-28 py-3 rounded-full bg-canvas-surface border border-hairline text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-subtle font-sans"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-deep text-white px-5 py-2 rounded-full text-xs font-semibold shadow-subtle transition-all font-sans"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* Live API Root Special Result */}
      {liveRoot && (
        <div className="space-y-6">
          <div className="p-6 bg-primary-fixed/50 border border-primary/20 rounded-3xl text-ink-primary space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span>Ditemukan dari Korpus Al-Qur&apos;an Live</span>
            </div>
            <h3 className="text-xl font-bold font-sans">{liveRoot.titleIndo}</h3>
            <p className="text-xs text-ink-secondary leading-relaxed font-sans">{liveRoot.etymologyNote}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Ayat Kemunculan dalam Al-Qur&apos;an</span>
            </h2>
            <AyahConcordance
              occurrences={liveRoot.occurrences}
              rootArabic={liveRoot.rootArabic}
              rootLatin={liveRoot.rootLatin}
            />
          </div>
        </div>
      )}

      {/* Virtualized Multi-dimensional Search Results */}
      <VirtualQuranSearchResults
        query={query}
        initialRoots={localResults}
        liveRoot={liveRoot}
      />
    </div>
  );
}
