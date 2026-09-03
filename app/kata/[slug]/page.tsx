import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCanonicalWordDetail } from '@/lib/morphology/canonical-service';
import { ArrowLeft, BookOpen, Layers, ExternalLink, ShieldCheck, Hash, GitCommit, Compass } from 'lucide-react';
import { SURAH_LIST } from '@/lib/data/surah-list';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

export default function WordDetailPage({ params }: PageProps) {
  const rawSlug = decodeURIComponent(params.slug).trim();
  if (!rawSlug) notFound();

  // 1. Resolve Word Detail using Single Canonical Service
  const wordModel = getCanonicalWordDetail(rawSlug);
  if (!wordModel) notFound();

  const isParticle = wordModel.morphology.isParticle;
  const rootArabic = wordModel.lexical.rootArabic;
  const rootSlug = wordModel.lexical.rootSlug;
  const lemmaArabic = wordModel.lexical.lemmaArabic;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/baca"
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
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* 1. Main Word Hero Card */}
      <section className="text-center py-8 sm:py-12 px-6 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-4">
        {/* Arabic Word Display (RTL-Safe, Large, No Clipping) */}
        <div className="py-2" dir="rtl">
          <span
            className="font-arabic text-6xl sm:text-7xl font-bold text-primary tracking-wide block leading-[2.2] sm:leading-[2.6]"
            dir="rtl"
          >
            {wordModel.identity.arabic}
          </span>
        </div>

        {/* Transliteration */}
        {wordModel.identity.transliteration && (
          <span className="text-sm font-medium text-ink-mute font-sans tracking-wide block">
            — {wordModel.identity.transliteration} —
          </span>
        )}

        {/* Primary Indonesian Meaning */}
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight font-sans max-w-2xl mx-auto">
          &ldquo;{wordModel.translation.primaryMeaning}&rdquo;
        </h1>

        {/* Morphological Role Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="px-3.5 py-1 rounded-full bg-primary-subdued text-primary text-xs font-semibold">
            {wordModel.morphology.posLabelIndo}
          </span>
          {wordModel.morphology.wazanOrForm && (
            <span className="px-3.5 py-1 rounded-full bg-canvas-soft border border-hairline text-ink-secondary text-xs font-medium">
              {wordModel.morphology.wazanOrForm}
            </span>
          )}
          {!isParticle && wordModel.totalRootOccurrences > 0 && (
            <span className="px-3.5 py-1 rounded-full bg-canvas-soft border border-hairline text-ink-secondary text-xs font-medium">
              {wordModel.totalRootOccurrences} Kemunculan Morfologis
            </span>
          )}
        </div>
      </section>

      {/* 2. Detail Morfologi & Struktur Gramatikal */}
      <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-5">
        <h2 className="text-lg font-semibold text-ink-primary font-sans flex items-center space-x-2 border-b border-hairline pb-3">
          <Layers className="w-4 h-4 text-primary" />
          <span>Analisis Morfologi &amp; Struktur Kata</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Kategori Gramatikal (POS):</span>
            <span className="text-ink-primary font-semibold text-base">{wordModel.morphology.grammaticalRole}</span>
          </div>

          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Wazan / Bentuk Sharaf:</span>
            <span className="text-ink-primary font-semibold text-base">
              {wordModel.morphology.wazanOrForm || (isParticle ? 'Mabni (Tetap)' : 'Bentuk Leksikal Standar')}
            </span>
          </div>

          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Lemma (Leksikal Dasar):</span>
            <span className="text-ink-primary font-semibold text-base">
              {lemmaArabic ? (
                <span className="font-arabic text-lg font-bold text-primary mr-2" dir="rtl">{lemmaArabic}</span>
              ) : null}
              <span className="text-xs text-ink-mute">({wordModel.lexical.lemma || '-'})</span>
            </span>
          </div>

          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Akar Kata (Triliteral Root):</span>
            {isParticle || !rootArabic ? (
              <span className="text-ink-secondary text-sm italic">
                Partikel / Harf (Tidak memiliki akar triliteral)
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-arabic text-lg font-bold text-primary" dir="rtl">{rootArabic}</span>
                {rootSlug && (
                  <Link
                    href={`/akar/${rootSlug}`}
                    className="text-xs text-primary hover:underline font-semibold inline-flex items-center space-x-0.5"
                  >
                    <span>Detail Akar</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Multi-layer Meanings */}
        {wordModel.translation.meanings && wordModel.translation.meanings.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-hairline">
            <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider block">
              Cakupan Makna &amp; Karakteristik Penggunaan:
            </span>
            <ul className="space-y-2 text-sm text-ink-secondary">
              {wordModel.translation.meanings.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3. Relasi Konkordansi Ayat Relevan */}
      {!isParticle && wordModel.relatedOccurrences.length > 0 && (
        <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="text-lg font-semibold text-ink-primary font-sans flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Contoh Konkordansi Ayat dalam Mushaf</span>
            </h2>
            {rootSlug && (
              <Link
                href={`/akar/${rootSlug}#concordance`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center space-x-1"
              >
                <span>Lihat Semua ({wordModel.totalRootOccurrences})</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="space-y-3">
            {wordModel.relatedOccurrences.map((occ, idx) => {
              const surahInfo = SURAH_LIST.find(s => s.number === occ.surahNumber);
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-canvas-soft border border-hairline hover:border-primary/40 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-ink-mute font-sans">
                    <span className="font-semibold text-ink-primary">
                      Q.S. {surahInfo?.nameIndo || occ.surahNumber} [{occ.surahNumber}]:{occ.ayahNumber}
                    </span>
                    <Link
                      href={`/baca?surah=${occ.surahNumber}&ayah=${occ.ayahNumber}`}
                      className="text-primary hover:underline font-semibold inline-flex items-center space-x-1"
                    >
                      <span>Buka Ayat</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <p className="font-arabic text-lg sm:text-xl text-ink-primary text-right leading-[2.4]" dir="rtl">
                    {occ.verseArabic}
                  </p>

                  <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                    &ldquo;{occ.verseIndo}&rdquo;
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Advanced Corpus Data (Collapsible / Transparent) */}
      <section className="p-6 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-ink-primary font-semibold pb-2 border-b border-hairline">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-sans text-sm">Otoritas Data &amp; Bukti Korpus (QAC v0.4)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink-secondary">
          <div><span className="text-ink-mute">Sumber Otoritatif:</span> The Quranic Arabic Corpus v0.4 (Univ. of Leeds)</div>
          <div><span className="text-ink-mute">Terjemahan Resmi:</span> Lajnah Pentashihan Mushaf Al-Qur&apos;an (Kemenag RI)</div>
          {wordModel.identity.coordinate && (
            <div><span className="text-ink-mute">Koordinat Korpus:</span> {wordModel.identity.coordinate}</div>
          )}
          {wordModel.corpus.buckwalter && (
            <div><span className="text-ink-mute">Transliterasi Buckwalter:</span> {wordModel.corpus.buckwalter}</div>
          )}
          {wordModel.morphology.rawTag && (
            <div><span className="text-ink-mute">Tag POS Mentah:</span> {wordModel.morphology.rawTag}</div>
          )}
          {wordModel.morphology.rawFeatures && (
            <div className="col-span-full"><span className="text-ink-mute">Fitur Morfologis:</span> {wordModel.morphology.rawFeatures}</div>
          )}
        </div>
      </section>
    </div>
  );
}
