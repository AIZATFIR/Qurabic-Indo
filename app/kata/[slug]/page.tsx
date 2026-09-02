import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getWordDetailedExplanation } from '@/lib/search/word-dictionary';
import { findBestMatchingRoot } from '@/lib/search/root-search';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { ArrowLeft, BookOpen, Layers, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

export const dynamicParams = true;

export default function WordDetailPage({ params }: PageProps) {
  const rawSlug = decodeURIComponent(params.slug).trim();
  if (!rawSlug) notFound();

  // 1. Get detailed word info
  const wordInfo = getWordDetailedExplanation(rawSlug);
  
  // 2. Find exact associated root word (Strict matching only)
  let matchedRoot = wordInfo.rootSlug
    ? ROOT_DATABASE.find(r => r.id === wordInfo.rootSlug)
    : findBestMatchingRoot(rawSlug);

  if (!matchedRoot && wordInfo.rootLetters) {
    const cleanLetters = wordInfo.rootLetters.replace(/\s+/g, '');
    matchedRoot = ROOT_DATABASE.find(r => r.rootArabicJoined === cleanLetters);
  }

  // Related occurrences from exact root
  const relatedOccurrences = (matchedRoot?.occurrences || []).slice(0, 8);

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

        {matchedRoot && (
          <Link
            href={`/akar/${matchedRoot.id}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-canvas-surface border border-hairline text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all shadow-subtle"
          >
            <span>Akar: {matchedRoot.rootArabic} ({matchedRoot.rootLatin})</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* 1. Main Word Hero Card */}
      <section className="text-center py-8 sm:py-12 px-6 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-4">
        {/* Arabic Word Display */}
        <div className="py-2" dir="rtl">
          <span
            className="font-arabic text-6xl sm:text-7xl font-bold text-primary tracking-wide block leading-[2.2] sm:leading-[2.6]"
            dir="rtl"
          >
            {wordInfo.wordArabic || rawSlug}
          </span>
        </div>

        {/* Primary Indonesian Meaning */}
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-primary tracking-tight font-sans">
          &ldquo;{wordInfo.primaryMeaning}&rdquo;
        </h1>

        {/* Morphological Role Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="px-3 py-1 rounded-full bg-primary-subdued text-primary text-xs font-semibold">
            {wordInfo.posTag}
          </span>
          {wordInfo.wazanOrForm && (
            <span className="px-3 py-1 rounded-full bg-canvas-soft border border-hairline text-ink-secondary text-xs font-medium">
              {wordInfo.wazanOrForm}
            </span>
          )}
          {matchedRoot && (
            <span className="px-3 py-1 rounded-full bg-canvas-soft border border-hairline text-ink-secondary text-xs font-medium">
              {matchedRoot.totalOccurrences} Kemunculan Morfologis
            </span>
          )}
        </div>
      </section>

      {/* 2. Detail Morfologi & Gramatikal */}
      <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-5">
        <h2 className="text-lg font-semibold text-ink-primary font-sans flex items-center space-x-2 border-b border-hairline pb-3">
          <Layers className="w-4 h-4 text-primary" />
          <span>Analisis Gramatikal &amp; Struktur Kata</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Kategori Gramatikal (POS):</span>
            <span className="text-ink-primary font-semibold text-base">{wordInfo.grammaticalRole}</span>
          </div>
          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Wazan / Bentuk Sharaf:</span>
            <span className="text-ink-primary font-semibold text-base">{wordInfo.wazanOrForm || (wordInfo.posTag === 'Harf' ? 'Mabni (Tetap)' : 'Bentuk Standar')}</span>
          </div>
        </div>

        {wordInfo.meanings && wordInfo.meanings.length > 1 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider block">
              Cakupan Makna dalam Konteks Al-Qur&apos;an:
            </span>
            <ul className="space-y-2 text-sm text-ink-secondary">
              {wordInfo.meanings.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 3. Hubungan ke Akar Kata (Root Connection) */}
      {matchedRoot ? (
        <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="text-lg font-semibold text-ink-primary font-sans flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Akar Kata Pembentuk</span>
            </h2>
            <Link
              href={`/akar/${matchedRoot.id}`}
              className="text-xs text-primary font-semibold hover:underline inline-flex items-center space-x-1.5"
            >
              <span>Eksplorasi Lengkap</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-canvas-soft rounded-2xl border border-hairline">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="font-arabic text-3xl font-bold text-primary" dir="rtl">
                  {matchedRoot.rootArabic}
                </span>
                <span className="text-sm font-semibold text-ink-primary font-sans">
                  ({matchedRoot.rootLatin})
                </span>
              </div>
              <p className="text-xs text-ink-secondary font-sans leading-relaxed">
                {matchedRoot.coreMeaning || matchedRoot.titleIndo}
              </p>
            </div>

            <Link
              href={`/akar/${matchedRoot.id}`}
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs font-semibold transition-all shadow-subtle shrink-0 text-center"
            >
              Lihat {matchedRoot.totalOccurrences} Ayat Turunan →
            </Link>
          </div>
        </section>
      ) : (
        <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-3">
          <h2 className="text-base font-semibold text-ink-primary font-sans flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Karakteristik Morfologi</span>
          </h2>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
            Kata ini tergolong sebagai <strong>Harf / Partikel</strong> (kata tugas / penghubung / syarat / zharf) dalam tata bahasa Arab dan tidak memiliki akar kata triliteral mandiri.
          </p>
        </section>
      )}

      {/* 4. Contoh Ayat Terkait (Hanya jika memiliki akar kata yang sah) */}
      {matchedRoot && relatedOccurrences.length > 0 && (
        <section className="space-y-4">
          <div className="border-b border-hairline pb-2.5">
            <h2 className="text-xl font-light text-ink-primary tracking-tight flex items-center space-x-2 font-sans">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Contoh Penggunaan dalam Ayat Al-Qur&apos;an</span>
            </h2>
          </div>

          <div className="space-y-4">
            {relatedOccurrences.map((occ, idx) => (
              <div
                key={idx}
                className="p-6 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-3"
              >
                <div className="flex items-center justify-between border-b border-hairline pb-2 text-xs text-ink-mute">
                  <span className="font-semibold text-ink-primary font-sans">
                    Q.S. {occ.surahNameIndo} [{occ.surahNumber}]: {occ.ayahNumber}
                  </span>
                  <Link
                    href={`/baca?surah=${occ.surahNumber}&ayah=${occ.ayahNumber}`}
                    className="text-primary hover:underline font-medium inline-flex items-center space-x-1.5"
                  >
                    <span>Buka di Mushaf</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <p className="font-arabic text-2xl text-ink-primary text-right leading-[2.6]" dir="rtl">
                  {occ.verseArabic}
                </p>

                <div className="p-3.5 bg-canvas-soft rounded-xl text-xs text-ink-secondary leading-relaxed font-sans">
                  &ldquo;{occ.verseIndo}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Attribution & Integrity Footer */}
      <section className="pt-4 border-t border-hairline">
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-mute font-sans">
          <span className="inline-flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Otoritas Morfologi: The Quranic Arabic Corpus v0.4</span>
          </span>
          <span>Terjemahan Resmi: Kementerian Agama RI</span>
        </div>
      </section>
    </div>
  );
}
