import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWordStudy } from '@/lib/morphology/word-study-service';
import WordStudy from '@/components/WordStudy';
import { ArrowLeft, Compass } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    surah?: string;
    ayah?: string;
    wordIndex?: string;
  };
}

export const dynamicParams = true;

export default function WordDetailPage({ params, searchParams }: PageProps) {
  const rawSlug = decodeURIComponent(params.slug).trim();
  if (!rawSlug) notFound();

  const surahNumber = searchParams?.surah ? parseInt(searchParams.surah, 10) : undefined;
  const ayahNumber = searchParams?.ayah ? parseInt(searchParams.ayah, 10) : undefined;
  const wordIndex = searchParams?.wordIndex ? parseInt(searchParams.wordIndex, 10) : undefined;

  // 1. Resolve Word Study ViewModel using Central WordStudyService
  const study = getWordStudy(rawSlug, {
    surahNumber,
    ayahNumber,
    wordIndex
  });
  if (!study) notFound();

  const isParticle = study.morphology.isParticle;
  const rootArabic = study.lexical.rootArabic;
  const rootSlug = study.lexical.rootSlug;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 font-sans">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={surahNumber && ayahNumber ? `/baca?surah=${surahNumber}&ayah=${ayahNumber}` : '/baca'}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm text-ink-mute hover:text-primary transition-colors font-medium font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Mushaf</span>
        </Link>

        {rootSlug && !isParticle && (
          <Link
            href={`/akar/${rootSlug}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-canvas-surface border border-hairline text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all shadow-subtle"
          >
            <span>Akar Kata: {rootArabic}</span>
            <Compass className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Main Unified Word Study Component */}
      <WordStudy study={study} />
    </div>
  );
}
