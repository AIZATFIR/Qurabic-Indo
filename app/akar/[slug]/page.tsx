import type { Metadata } from 'next';
import { getCanonicalRootDetail } from '@/lib/morphology/canonical-service';
import { getQACAuthoritativeIndex } from '@/lib/morphology/qac-parser';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import { notFound } from 'next/navigation';
import RootDetailView, { type RootLemmaSample } from '@/components/RootDetailView';
import wbwIndonesian from '@/lib/data/wbw-indonesian-glosses.json';
import wbwEnglish from '@/lib/data/wbw-english-glosses.json';

export function generateStaticParams() {
  // Render root pages on demand via dynamicParams = true to eliminate build-time CPU/memory locks
  return [];
}

// Allow dynamic params for all 1,642 roots on demand
export const dynamicParams = true;
// Root entries can be generated on demand and Vercel keeps ISR output across
// deployments, so periodically refresh cached HTML when the interface changes.
export const revalidate = 60;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params: paramsPromise }: PageProps): Promise<Metadata> {
  const params = await paramsPromise;
  let rootModel = getCanonicalRootDetail(params.slug);
  if (!rootModel) {
    const liveRoot = await fetchLiveRoot(params.slug);
    if (liveRoot) {
      rootModel = getCanonicalRootDetail(liveRoot.id);
    }
  }

  if (!rootModel) {
    return {
      title: `Akar Kata: ${params.slug} | Qurabic`,
      description: `Eksplorasi akar kata ${params.slug} dalam Al-Qur'an.`,
    };
  }

  const rootAr = rootModel.rootArabic || rootModel.rootArabicJoined || params.slug;
  const translit = rootModel.rootLatin || rootModel.id;
  const occ = rootModel.statistics.totalOccurrences;
  const lemmas = rootModel.statistics.uniqueLemmas;

  return {
    title: `${rootAr} (${translit}) — Bedah Akar Kata & Leksikon`,
    description: `Quran root ${rootAr} (${translit}): ${occ} QAC occurrences, ${lemmas} lemmas, contextual word translations and indexed Lane lexicon excerpts.`,
    alternates: {
      canonical: `/akar/${rootModel.id}`,
    },
    openGraph: {
      title: `${rootAr} (${translit}) — Bedah Akar Kata Al-Qur'an | Qurabic`,
      description: `Quran root ${rootAr}: ${occ} occurrences. QAC morphology, contextual word translations and indexed Lane lexicon excerpts.`,
    },
  };
}

export default async function RootDetailPage({ params: paramsPromise }: PageProps) {
  const params = await paramsPromise;
  let rootModel = getCanonicalRootDetail(params.slug);

  // Real-time Live API Fallback if root is not in static bundle
  if (!rootModel) {
    const liveRoot = await fetchLiveRoot(params.slug);
    if (liveRoot) {
      rootModel = getCanonicalRootDetail(liveRoot.id);
    }
  }

  if (!rootModel) {
    notFound();
  }

  const lemmaSamples: Record<string, RootLemmaSample> = {};
  const records = getQACAuthoritativeIndex().recordsByRoot.get(rootModel.id.replace(/-/g, '')) || [];
  const meaningsIndo = wbwIndonesian.meanings as Record<string, string>;
  const meaningsEnglish = wbwEnglish.meanings as Record<string, string>;
  for (const record of records) {
    if (!record.lemma) continue;
    const key = `${record.pos}:${record.lemma}`;
    if (lemmaSamples[key]) continue;
    lemmaSamples[key] = {
      coordinate: record.wordLocationKey,
      formArabic: record.formArabic,
      ...(record.verbForm ? { verbForm: record.verbForm } : {}),
      ...(meaningsIndo[record.wordLocationKey] ? { meaningIndo: meaningsIndo[record.wordLocationKey] } : {}),
      ...(meaningsEnglish[record.wordLocationKey] ? { meaningEnglish: meaningsEnglish[record.wordLocationKey] } : {}),
    };
  }

  return <RootDetailView root={rootModel} lemmaSamples={lemmaSamples} />;
}
