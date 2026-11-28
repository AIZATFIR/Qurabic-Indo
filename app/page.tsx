import HomePageClient from './HomePageClient';
import { ROOT_DATABASE } from '@/lib/data/roots';
import type { RootCardData } from '@/components/RootCard';

const STARTING_ROOT_IDS = ['S-l-w', 'S-b-r', 'E-l-m', 'r-H-m', 'k-t-b', 'q-w-l'];
const STARTING_ROOTS: RootCardData[] = STARTING_ROOT_IDS.flatMap((id) => {
  const root = ROOT_DATABASE.find((entry) => entry.id === id);
  return root ? [{
    id: root.id,
    rootArabic: root.rootArabic,
    rootLatin: root.rootLatin,
    totalOccurrences: root.totalOccurrences,
    verbsCount: root.verbsCount,
    nounsCount: root.nounsCount,
  }] : [];
});

// Vercel can retain prerendered home HTML between deployments. Revalidate it
// periodically so UI updates reach the production domain without stale markup.
export const revalidate = 60;

export default function HomePage() {
  return <HomePageClient startingRoots={STARTING_ROOTS} />;
}
