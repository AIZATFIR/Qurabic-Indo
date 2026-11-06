import HomePageClient from './HomePageClient';

// Vercel can retain prerendered home HTML between deployments. Revalidate it
// periodically so UI updates reach the production domain without stale markup.
export const revalidate = 60;

export default function HomePage() {
  return <HomePageClient />;
}
