import { searchRoots } from '@/lib/search/root-search';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import RootCard from '@/components/RootCard';
import AyahConcordance from '@/components/AyahConcordance';
import Link from 'next/link';
import { Search, ArrowLeft, Radio, BookOpen, Layers, ShieldCheck } from 'lucide-react';

interface PageProps {
  searchParams: {
    q?: string;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-ink-mute hover:text-primary transition-colors font-medium font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Search Header Banner */}
      <div className="bg-canvas-surface border border-hairline rounded-3xl p-8 sm:p-10 shadow-subtle space-y-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-primary-subdued text-primary text-xs font-semibold rounded-full uppercase tracking-wider font-sans">
            <Search className="w-3.5 h-3.5" />
            <span>Hasil Pencarian Akar Kata &amp; Ayat</span>
          </span>

          {isLiveFetched && (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-primary-fixed text-primary-deep text-xs font-semibold rounded-full font-sans">
              <Radio className="w-3 h-3 text-primary animate-pulse" />
              <span>Pencarian Ayat Al-Qur&apos;an (Live API)</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Hasil Pencarian untuk &ldquo;<span className="font-semibold text-primary">{query || 'Semua Kata'}</span>&rdquo;
        </h1>

        {/* Dynamic Search Input Bar */}
        <form action="/cari" method="GET" className="pt-2 max-w-2xl">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-mute absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Cari akar kata (contoh: sabar, كتب, batu, sholat)..."
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

      {/* Results Content */}
      {!query ? (
        <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-3xl text-ink-mute font-sans shadow-subtle">
          Silakan masukkan kata kunci pencarian pada kotak di atas.
        </div>
      ) : localResults.length > 0 ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-ink-mute font-sans border-b border-hairline pb-3">
            <span>Ditemukan <strong className="text-ink-primary">{localResults.length}</strong> akar kata cocok dalam database</span>
            <span>Diurutkan berdasarkan kemunculan terbanyak</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {localResults.map((root) => (
              <RootCard key={root.id} root={root} />
            ))}
          </div>
        </div>
      ) : liveRoot ? (
        <div className="space-y-8">
          <div className="p-6 bg-primary-fixed/50 border border-primary/20 rounded-3xl text-ink-primary space-y-2 font-sans">
            <div className="flex items-center space-x-2 text-xs font-bold text-primary">
              <Radio className="w-4 h-4 text-primary animate-pulse" />
              <span>Ditemukan dari Pencarian Al-Qur&apos;an Live</span>
            </div>
            <h3 className="text-xl font-bold font-sans">{liveRoot.titleIndo}</h3>
            <p className="text-xs text-ink-secondary leading-relaxed font-sans">{liveRoot.etymologyNote}</p>
          </div>

          {/* Live Ayah Occurrences */}
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
      ) : (
        <div className="p-12 sm:p-16 text-center bg-canvas-surface border border-hairline rounded-3xl space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-2xl bg-canvas-soft text-ink-mute flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-ink-primary font-sans">Tidak Ada Hasil Ditemukan</h3>
          <p className="text-sm text-ink-mute max-w-md mx-auto font-sans leading-relaxed">
            Kata kunci &ldquo;{query}&rdquo; tidak menghasilkan data. Cobalah kata kunci Latin (contoh: &quot;sholat&quot;), Arab (contoh: &quot;صبر&quot;), atau akar kata lainnya.
          </p>
          <div className="pt-2">
            <Link
              href="/morfologi"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-subtle transition-all font-sans"
            >
              <BookOpen className="w-4 h-4" />
              <span>Lihat Katalog Morfologi Lengkap</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
