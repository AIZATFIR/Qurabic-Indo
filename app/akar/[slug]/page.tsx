import React from 'react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { getRootBySlug } from '@/lib/search/root-search';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import { notFound } from 'next/navigation';
import EtymologyCard from '@/components/EtymologyCard';
import DerivativesGrid from '@/components/DerivativesGrid';
import AyahConcordance from '@/components/AyahConcordance';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers, ShieldCheck, Database, Radio, Sparkles } from 'lucide-react';

export function generateStaticParams() {
  // Prerender top 200 high-frequency roots at build time; dynamicParams = true handles all 1,642 roots seamlessly
  return ROOT_DATABASE.slice(0, 200).map((root) => ({
    slug: root.id,
  }));
}

// Allow dynamic params for all 1,642 roots on demand
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

  const occurrencesCount = root.occurrences?.length || 0;
  const totalForms = (root.verbs?.length || 0) + (root.nouns?.length || 0);

  // Representative examples: Pick first 2-3 occurrences
  const exampleOccurrences = (root.occurrences || []).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-sans">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm text-ink-mute hover:text-primary transition-colors font-medium font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        {/* Quick Section Anchor Navigation */}
        <div className="flex items-center space-x-2 text-xs font-sans">
          <a
            href="#makna"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Makna &amp; Konteks
          </a>
          <a
            href="#bentuk"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Bentuk ({totalForms})
          </a>
          <a
            href="#contoh"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle hidden sm:inline-flex"
          >
            Contoh Ayat
          </a>
          <a
            href="#concordance"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Konkordansi ({occurrencesCount})
          </a>
        </div>
      </div>

      {/* 1. Hero Section: Centered, Calm, Elegant Arabic & Transliteration */}
      <section className="text-center py-8 sm:py-12 px-4 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-4">
        {/* Arabic Root Display (Large, Centered, RTL-Safe) */}
        <div className="py-2" dir="rtl">
          <span
            className="font-arabic text-6xl sm:text-7xl lg:text-8xl font-bold text-primary tracking-wide block leading-[1.8]"
            dir="rtl"
          >
            {root.rootArabic}
          </span>
        </div>

        {/* Latin Transliteration */}
        <h1 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
          {root.rootLatin}
        </h1>

        {/* Compact Statistics Header */}
        <p className="text-sm sm:text-base text-ink-mute font-sans">
          <strong className="text-ink-primary font-semibold">{root.totalOccurrences.toLocaleString('id-ID')}</strong> kemunculan ·{' '}
          <strong className="text-ink-primary font-semibold">{occurrencesCount.toLocaleString('id-ID')}</strong> ayat ·{' '}
          <strong className="text-ink-primary font-semibold">{totalForms}</strong> bentuk
          {isLiveFetched && (
            <span className="inline-flex items-center space-x-1 ml-2 text-xs text-primary font-medium">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Pencarian Live API</span>
            </span>
          )}
        </p>

        {/* Quick CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <a
            href="#concordance"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold transition-all shadow-subtle flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Baca Ayat ({occurrencesCount.toLocaleString('id-ID')})</span>
          </a>
          <a
            href="#bentuk"
            className="px-6 py-2.5 rounded-full bg-canvas-soft hover:bg-canvas-page border border-hairline text-ink-secondary hover:text-primary text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5"
          >
            <Layers className="w-4 h-4" />
            <span>Eksplorasi Bentuk ({totalForms})</span>
          </a>
        </div>
      </section>

      {/* 2. Makna & Konteks Section (Tadabbur-Grade Insight) */}
      <section id="makna" className="scroll-mt-24">
        <EtymologyCard
          rootArabic={root.rootArabic}
          rootLatin={root.rootLatin}
          coreMeaning={root.coreMeaning}
          usagePatterns={root.usagePatterns}
          contextualNote={root.contextualNote}
          etymologyNote={root.etymologyNote}
          meaningsIndonesian={root.meaningsIndonesian}
        />
      </section>

      {/* 3. Bentuk dalam Al-Qur'an (Morphology Forms) */}
      <section id="bentuk" className="scroll-mt-24">
        <DerivativesGrid verbs={root.verbs} nouns={root.nouns} />
      </section>

      {/* 4. Contoh Ayat (Representative Quranic Usage Examples) */}
      {exampleOccurrences.length > 0 && (
        <section id="contoh" className="scroll-mt-24 space-y-4">
          <div className="border-b border-hairline pb-2.5">
            <h2 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Contoh Penggunaan Ayat</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-mute mt-0.5 font-sans">
              Cuplikan ayat representatif yang memuat kata dari akar <strong className="text-primary font-arabic text-sm" dir="rtl">{root.rootArabic}</strong>
            </p>
          </div>
          <AyahConcordance
            occurrences={exampleOccurrences}
            rootArabic={root.rootArabic}
            rootLatin={root.rootLatin}
            isExampleSection={true}
          />
        </section>
      )}

      {/* 5. Konkordansi Lengkap */}
      <section id="concordance" className="scroll-mt-24 space-y-4">
        <div className="border-b border-hairline pb-2.5">
          <h2 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Konkordansi Lengkap ({occurrencesCount.toLocaleString('id-ID')} Ayat)</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-mute mt-0.5 font-sans">
            Daftar seluruh ayat Al-Qur&apos;an yang memuat turunan kata dari akar <strong className="text-primary font-arabic text-sm" dir="rtl">{root.rootArabic}</strong>
          </p>
        </div>
        <AyahConcordance
          occurrences={root.occurrences}
          rootArabic={root.rootArabic}
          rootLatin={root.rootLatin}
        />
      </section>

      {/* 6. Analisis Corpus (Depth on Demand - Bottom Collapsed Section) */}
      <section className="pt-6 border-t border-hairline">
        <div className="p-6 sm:p-7 rounded-3xl bg-canvas-soft border border-hairline space-y-4 text-xs sm:text-sm font-sans">
          <div className="flex items-center space-x-2 text-ink-primary font-semibold">
            <Database className="w-4 h-4 text-primary" />
            <span>Analisis Corpus &amp; Metadata QAC v0.4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-ink-secondary">
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Total Segmen:</span>
              <span className="text-base font-semibold text-ink-primary">{root.totalOccurrences.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Segmen Verba (Fi&apos;il):</span>
              <span className="text-base font-semibold text-ink-primary">{root.verbsCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Segmen Nomina (Isim):</span>
              <span className="text-base font-semibold text-ink-primary">{root.nounsCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Total Ayat Unik:</span>
              <span className="text-base font-semibold text-ink-primary">{occurrencesCount.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-ink-mute border-t border-hairline">
            <span className="inline-flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Otoritas Korpus: The Quranic Arabic Corpus v0.4 (University of Leeds)</span>
            </span>
            <span>Teks &amp; Terjemahan: LPMQ / Kementerian Agama RI</span>
          </div>
        </div>
      </section>
    </div>
  );
}
