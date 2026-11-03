import SearchResultsView from '@/components/SearchResultsView';
import { searchRoots } from '@/lib/search/root-search';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import { Metadata } from 'next';

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export async function generateMetadata({ searchParams: searchParamsPromise }: PageProps): Promise<Metadata> {
  const searchParams = await searchParamsPromise;
  const query = (searchParams.q || '').trim();
  return {
    title: query ? `Hasil Pencarian: "${query}" - Qurabic (Indo)` : 'Pencarian Korpus - Qurabic (Indo)',
    description: `Hasil pencarian akar kata, surah, dan morfologi Al-Qur'an untuk kata kunci "${query}".`,
  };
}

export default async function SearchResultsPage({ searchParams: searchParamsPromise }: PageProps) {
  const searchParams = await searchParamsPromise;
  const query = (searchParams.q || '').trim();
  let localResults = searchRoots(query);
  let liveRoot = null;

  // Sort local results by frequency
  localResults = [...localResults].sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  // If query exists and local results are sparse or query wasn't matched locally, attempt dynamic live fetch
  if (query && localResults.length === 0) {
    liveRoot = await fetchLiveRoot(query);
  }

  return <SearchResultsView query={query} localResults={localResults} liveRoot={liveRoot} />;
}
