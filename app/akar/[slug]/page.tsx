import React from 'react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { getCanonicalRootDetail } from '@/lib/morphology/canonical-service';
import { fetchLiveRoot } from '@/lib/api/quran-corpus-api';
import { notFound } from 'next/navigation';
import EtymologyCard from '@/components/EtymologyCard';
import DerivativesGrid from '@/components/DerivativesGrid';
import AyahConcordance from '@/components/AyahConcordance';
import MorphologyDistribution from '@/components/MorphologyDistribution';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Layers, ShieldCheck, Database, Radio, Sparkles, BarChart3, BookMarked } from 'lucide-react';

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
  let rootModel = getCanonicalRootDetail(params.slug);
  let isLiveFetched = false;

  // Real-time Live API Fallback if root is not in static bundle
  if (!rootModel) {
    const liveRoot = await fetchLiveRoot(params.slug);
    if (liveRoot) {
      rootModel = getCanonicalRootDetail(liveRoot.id);
      isLiveFetched = true;
    }
  }

  if (!rootModel) {
    notFound();
  }

  const { statistics, occurrences, verbs, nouns, lexicon } = rootModel;
  const totalForms = (verbs?.length || 0) + (nouns?.length || 0);

  // Representative examples: Pick first 2-3 occurrences
  const exampleOccurrences = (occurrences || []).slice(0, 3);

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
            href="#leksikon"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Leksikon Lane
          </a>
          <a
            href="#distribusi"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle hidden sm:inline-flex"
          >
            Distribusi ({statistics.uniqueLemmas} Lemma)
          </a>
          <a
            href="#bentuk"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Bentuk ({totalForms})
          </a>
          <a
            href="#concordance"
            className="px-3 py-1.5 rounded-full bg-canvas-surface border border-hairline hover:border-primary text-ink-secondary hover:text-primary transition-all shadow-subtle"
          >
            Konkordansi ({statistics.totalOccurrences})
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
            {rootModel.rootArabic}
          </span>
        </div>

        {/* Latin Transliteration */}
        <h1 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
          {rootModel.rootLatin}
        </h1>

        {/* Deterministic Statistics Header */}
        <p className="text-sm sm:text-base text-ink-mute font-sans max-w-2xl mx-auto">
          <strong className="text-ink-primary font-semibold">{statistics.totalOccurrences.toLocaleString('id-ID')}</strong> kemunculan ·{' '}
          <strong className="text-ink-primary font-semibold">{statistics.uniqueAyahs.toLocaleString('id-ID')}</strong> ayat ·{' '}
          <strong className="text-ink-primary font-semibold">{statistics.uniqueSurahs}</strong> surah ·{' '}
          <strong className="text-ink-primary font-semibold">{statistics.uniqueLemmas}</strong> lemma ·{' '}
          <strong className="text-ink-primary font-semibold">{statistics.uniqueForms}</strong> bentuk
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
            <span>Baca Ayat ({statistics.uniqueAyahs.toLocaleString('id-ID')})</span>
          </a>
          <a
            href="#distribusi"
            className="px-6 py-2.5 rounded-full bg-canvas-soft hover:bg-canvas-page border border-hairline text-ink-secondary hover:text-primary text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Lihat Distribusi ({statistics.uniqueLemmas} Lemma)</span>
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

      {/* 2. Leksikon Klasik (Lane's Arabic-English Lexicon) */}
      <section id="leksikon" className="scroll-mt-24 p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <h2 className="text-lg sm:text-xl font-semibold text-ink-primary font-sans flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-primary" />
            <span>Kajian Leksikografi Klasik (Lane&apos;s Lexicon)</span>
          </h2>
          {lexicon && (
            <span className="text-xs text-ink-mute font-medium">
              Book I, Part {lexicon.volume}, p. {lexicon.page}
            </span>
          )}
        </div>

        {lexicon && lexicon.entries.length > 0 ? (
          <div className="space-y-6">
            {lexicon.overview && (
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider block">Ikhtisar Akar Leksikal:</span>
                <p className="text-sm text-ink-secondary leading-relaxed font-serif italic">
                  &ldquo;{lexicon.overview}&rdquo;
                </p>
              </div>
            )}

            <div className="space-y-4">
              <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider block">
                Entri Leksikon Berdasarkan Wazan &amp; Bentuk Kata ({lexicon.entries.length} Entri Terindeks):
              </span>

              <div className="grid grid-cols-1 gap-4">
                {lexicon.entries.map((entry, eIdx) => (
                  <div
                    key={eIdx}
                    className="p-5 rounded-2xl bg-canvas-soft border border-hairline hover:border-primary/40 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-2.5">
                      <div className="flex items-center space-x-3">
                        <span className="font-arabic text-xl font-bold text-primary" dir="rtl">
                          {entry.headwordArabic}
                        </span>
                        {entry.itype && (
                          <span className="px-2.5 py-0.5 rounded-full bg-primary-subdued text-primary text-xs font-semibold">
                            Form {entry.itype}
                          </span>
                        )}
                        {entry.pos && (
                          <span className="px-2 py-0.5 rounded-full bg-canvas-surface border border-hairline text-ink-secondary text-[11px]">
                            {entry.pos}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-ink-mute">
                        Book I, Part {entry.volume}, p. {entry.page}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {entry.senses.map((sense, sIdx) => (
                        <div key={sIdx} className="text-xs sm:text-sm text-ink-secondary font-serif leading-relaxed italic pl-2 border-l-2 border-primary/30">
                          {sense.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-canvas-surface rounded-2xl border border-hairline text-xs text-ink-mute flex flex-wrap items-center justify-between gap-2">
              <span><strong>Otoritas Sumber:</strong> {lexicon.sourceCitation}</span>
              <span>Lisensi Digital: CC BY-SA 3.0</span>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-canvas-soft rounded-2xl border border-hairline text-center space-y-1">
            <p className="text-sm text-ink-mute italic">
              Entri kamus klasik belum terindeks untuk akar ini.
            </p>
            <p className="text-xs text-ink-mute">
              Qurabic menyajikan data leksikon otentik secara transparan dan tidak mengarang definisi.
            </p>
          </div>
        )}
      </section>

      {/* 3. Distribusi Morfologi & Frekuensi Korpus */}
      <section id="distribusi" className="scroll-mt-24">
        <MorphologyDistribution statistics={statistics} rootArabic={rootModel.rootArabic} />
      </section>

      {/* 4. Bentuk dalam Al-Qur'an (Morphology Forms) */}
      <section id="bentuk" className="scroll-mt-24">
        <DerivativesGrid verbs={verbs} nouns={nouns} />
      </section>

      {/* 5. Contoh Ayat (Representative Quranic Usage Examples) */}
      {exampleOccurrences.length > 0 && (
        <section id="contoh" className="scroll-mt-24 space-y-4">
          <div className="border-b border-hairline pb-2.5">
            <h2 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Contoh Penggunaan Ayat</span>
            </h2>
            <p className="text-xs sm:text-sm text-ink-mute mt-0.5 font-sans">
              Cuplikan ayat representatif yang memuat kata dari akar <strong className="text-primary font-arabic text-sm" dir="rtl">{rootModel.rootArabic}</strong>
            </p>
          </div>
          <AyahConcordance
            occurrences={exampleOccurrences}
            rootArabic={rootModel.rootArabic}
            rootLatin={rootModel.rootLatin}
            isExampleSection={true}
          />
        </section>
      )}

      {/* 6. Konkordansi Lengkap */}
      <section id="concordance" className="scroll-mt-24 space-y-4">
        <div className="border-b border-hairline pb-2.5">
          <h2 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Konkordansi Lengkap ({occurrences.length.toLocaleString('id-ID')} Ayat)</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-mute mt-0.5 font-sans">
            Daftar seluruh ayat Al-Qur&apos;an yang memuat turunan kata dari akar <strong className="text-primary font-arabic text-sm" dir="rtl">{rootModel.rootArabic}</strong>
          </p>
        </div>
        <AyahConcordance
          occurrences={occurrences}
          rootArabic={rootModel.rootArabic}
          rootLatin={rootModel.rootLatin}
        />
      </section>

      {/* 7. Analisis Corpus (Depth on Demand - Bottom Collapsed Section) */}
      <section className="pt-6 border-t border-hairline">
        <div className="p-6 sm:p-7 rounded-3xl bg-canvas-soft border border-hairline space-y-4 text-xs sm:text-sm font-sans">
          <div className="flex items-center space-x-2 text-ink-primary font-semibold">
            <Database className="w-4 h-4 text-primary" />
            <span>Analisis Korpus &amp; Otoritas QAC v0.4</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-ink-secondary">
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Total Segmen Korpus:</span>
              <span className="text-base font-semibold text-ink-primary">{statistics.totalOccurrences.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Segmen Verba (Fi&apos;il):</span>
              <span className="text-base font-semibold text-ink-primary">{statistics.verbsCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Segmen Nomina (Isim):</span>
              <span className="text-base font-semibold text-ink-primary">{statistics.nounsCount.toLocaleString('id-ID')}</span>
            </div>
            <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline">
              <span className="text-ink-mute block text-[11px]">Total Ayat Unik:</span>
              <span className="text-base font-semibold text-ink-primary">{statistics.uniqueAyahs.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-ink-mute border-t border-hairline">
            <span className="inline-flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Otoritas Korpus: The Quranic Arabic Corpus v0.4 (University of Leeds)</span>
            </span>
            <span>Teks &amp; Terjemahan: Lajnah Pentashihan Mushaf Al-Qur&apos;an (LPMQ) / Kementerian Agama RI</span>
          </div>
        </div>
      </section>
    </div>
  );
}
