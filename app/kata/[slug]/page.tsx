import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCanonicalWordDetail } from '@/lib/morphology/canonical-service';
import { ArrowLeft, BookOpen, Layers, ExternalLink, ShieldCheck, Hash, GitCommit, Compass, Sparkles } from 'lucide-react';
import { SURAH_LIST } from '@/lib/data/surah-list';

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

  // 1. Resolve Word Detail using Single Canonical Service with exact coordinate context when available
  const wordModel = getCanonicalWordDetail(rawSlug, {
    surahNumber,
    ayahNumber,
    wordIndex
  });
  if (!wordModel) notFound();

  const isParticle = wordModel.morphology.isParticle;
  const rootArabic = wordModel.lexical.rootArabic;
  const rootSlug = wordModel.lexical.rootSlug;
  const lemmaArabic = wordModel.lexical.lemmaArabic;
  const lexicon = wordModel.lexicon;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-sans">
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

        {/* Primary Indonesian Meaning (Only if available) */}
        {wordModel.translation.primaryMeaning && (
          <h1 className="text-xl sm:text-2xl font-semibold text-ink-primary tracking-tight font-sans max-w-2xl mx-auto">
            &ldquo;{wordModel.translation.primaryMeaning}&rdquo;
          </h1>
        )}

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
      <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-6">
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
              {wordModel.morphology.wazanOrForm || (isParticle ? 'Mabni (Tetap)' : '—')}
            </span>
          </div>

          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Lemma (Leksikal Dasar):</span>
            <span className="text-ink-primary font-semibold text-base flex items-center space-x-2">
              {lemmaArabic ? (
                <span className="font-arabic text-lg font-bold text-primary mr-1" dir="rtl">{lemmaArabic}</span>
              ) : null}
              {wordModel.lexical.lemma && (
                <span className="text-xs text-ink-mute font-mono">({wordModel.lexical.lemma})</span>
              )}
              {!lemmaArabic && !wordModel.lexical.lemma && <span>—</span>}
            </span>
          </div>

          <div className="p-4 bg-canvas-soft rounded-2xl border border-hairline space-y-1">
            <span className="text-xs text-ink-mute block font-medium">Akar Kata (Triliteral Root):</span>
            {isParticle ? (
              <span className="text-ink-secondary text-sm italic">
                Partikel / Harf (Tidak memiliki akar kata)
              </span>
            ) : !rootArabic ? (
              <span className="text-ink-secondary text-sm italic">
                —
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

        {/* Related Words from Same Root (Kata Terkait dari Akar yang Sama) */}
        {!isParticle && wordModel.relatedLemmas && wordModel.relatedLemmas.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-hairline">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink-primary uppercase tracking-wider block">
                Kata-Kata Terkait dari Akar <span className="font-arabic text-primary text-sm font-bold" dir="rtl">{rootArabic}</span>:
              </span>
              {rootSlug && (
                <Link
                  href={`/akar/${rootSlug}#distribusi`}
                  className="text-xs text-primary hover:underline font-semibold inline-flex items-center space-x-1"
                >
                  <span>Lihat Semua Bentuk</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {wordModel.relatedLemmas.map((lem, idx) => (
                <Link
                  key={idx}
                  href={`/kata/${encodeURIComponent(lem.lemmaArabic)}`}
                  className="px-3 py-1.5 rounded-xl bg-canvas-soft hover:bg-primary-subdued border border-hairline hover:border-primary/40 transition-all flex items-center space-x-2 group"
                >
                  <span className="font-arabic text-base font-bold text-ink-primary group-hover:text-primary transition-colors" dir="rtl">
                    {lem.lemmaArabic}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-canvas-surface border border-hairline text-ink-secondary">
                    {lem.pos}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {lem.count}x
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. Makna Leksikal & Definisi Kamus Klasik (Lane's Arabic-English Lexicon) */}
      {!isParticle && (
        <section className="p-6 sm:p-8 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h2 className="text-lg font-semibold text-ink-primary font-sans flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Makna Leksikal Klasik (Lane&apos;s Lexicon)</span>
            </h2>
            {lexicon?.matchedForm && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
                {lexicon.matchedForm}
              </span>
            )}
          </div>

          {lexicon?.hasLexicalData && lexicon.senses.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-3">
                {lexicon.senses.map((sense, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs text-ink-mute">
                      <span className="font-semibold text-primary">Sense {idx + 1}</span>
                      <span>Book I, Part {sense.citation.volume}, p. {sense.citation.page}</span>
                    </div>
                    <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-serif italic">
                      &ldquo;{sense.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-canvas-surface rounded-2xl border border-hairline text-xs text-ink-mute flex flex-wrap items-center justify-between gap-2">
                <span><strong>Otoritas Sumber:</strong> Edward William Lane, <em>An Arabic-English Lexicon</em> (Perseus Digital Library &amp; Alpheios Project)</span>
                <span>Lisensi Digital: CC BY-SA 3.0</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-canvas-soft rounded-2xl border border-hairline text-center space-y-1">
              <p className="text-sm text-ink-mute italic">
                Makna leksikal dari kamus klasik belum terindeks untuk kata ini.
              </p>
              <p className="text-xs text-ink-mute">
                Qurabic hanya menyajikan kutipan leksikografi asli yang terverifikasi dan tidak membuat definisi sintetis.
              </p>
            </div>
          )}
        </section>
      )}

      {/* 4. Relasi Konkordansi Ayat Relevan */}
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

      {/* 5. Advanced Corpus Data & Provenance Manifest */}
      <section className="p-6 bg-canvas-surface border border-hairline rounded-3xl shadow-subtle space-y-3 text-xs font-mono">
        <div className="flex items-center space-x-2 text-ink-primary font-semibold pb-2 border-b border-hairline">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="font-sans text-sm">Otoritas Data &amp; Bukti Korpus (QAC v0.4)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-ink-secondary">
          <div><span className="text-ink-mute">Morfologi &amp; Sintaksis:</span> The Quranic Arabic Corpus v0.4 (Univ. of Leeds)</div>
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
