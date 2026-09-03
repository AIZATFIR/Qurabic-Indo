'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Volume2,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  GitFork,
  Compass
} from 'lucide-react';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import SourceDrawer from './SourceDrawer';

interface WordStudyProps {
  study: WordStudyViewModel;
  onClose?: () => void;
  isModalMode?: boolean;
}

export default function WordStudy({ study, onClose, isModalMode = false }: WordStudyProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSyntaxOpen, setIsSyntaxOpen] = useState(false);
  const [isOccurrencesOpen, setIsOccurrencesOpen] = useState(false);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>();

  const {
    identity,
    primaryMeaning,
    morphology,
    lexical,
    wordFamily,
    occurrences,
    syntax,
    provenance,
    context
  } = study;

  const handlePlayAudio = () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    let audioSrc = '';
    if (context?.surahNumber && context?.ayahNumber && context?.wordIndex) {
      const sPad = String(context.surahNumber).padStart(3, '0');
      const aPad = String(context.ayahNumber).padStart(3, '0');
      const wPad = String(context.wordIndex).padStart(3, '0');
      audioSrc = `https://audio.qurancdn.com/wbw/${sPad}_${aPad}_${wPad}.mp3`;
    } else {
      audioSrc = `https://audio.qurancdn.com/wbw/001_001_001.mp3`;
    }

    const audio = new Audio(audioSrc);
    audio.play()
      .then(() => {
        audio.onended = () => setIsPlayingAudio(false);
      })
      .catch((err) => {
        console.warn('Audio playback notice:', err);
        setIsPlayingAudio(false);
      });
  };

  const openSourceDrawer = (sourceId?: string) => {
    setSelectedSourceId(sourceId);
    setIsSourceDrawerOpen(true);
  };

  return (
    <div className="space-y-6 font-sans text-left" dir="ltr">
      {/* 1. LEVEL 1: HERO & PRIMARY MEANING */}
      <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4 text-center">
        <div className="flex items-center justify-between border-b border-hairline pb-3 text-left">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Bedah Kata Al-Qur&apos;an
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
              {morphology.posLabelIndo}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              title="Dengarkan pengucapan kata"
              className={`p-2 rounded-full transition-all border border-hairline ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-105 shadow-subtle animate-pulse'
                  : 'bg-canvas-soft hover:bg-canvas-page text-ink-secondary hover:text-primary'
              }`}
            >
              <Volume2 aria-hidden="true" className="w-4 h-4" />
            </button>
            <button
              onClick={() => openSourceDrawer()}
              title="Lihat Otoritas Sumber Data"
              className="p-2 rounded-full bg-canvas-soft hover:bg-canvas-page text-ink-mute hover:text-primary transition-colors border border-hairline"
            >
              <ShieldCheck aria-hidden="true" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Arabic Word Display */}
        <div className="py-2" dir="rtl">
          <span
            className="font-arabic text-5xl sm:text-6xl font-bold text-primary tracking-wide block leading-[2.2] sm:leading-[2.4]"
            title={identity.arabic}
          >
            {identity.arabic}
          </span>
        </div>

        {/* Transliteration */}
        {identity.transliteration && (
          <p className="text-xs sm:text-sm text-ink-mute font-mono tracking-wider">
            — {identity.transliteration} —
          </p>
        )}

        {/* Primary Readable Meaning */}
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-mute">
              Makna Utama
            </span>
            <button
              onClick={() => openSourceDrawer(primaryMeaning.isEditorialSummary ? 'kemenag-translation' : 'lane-arabic-english-lexicon')}
              className="text-[10px] px-2 py-0.5 rounded-full bg-canvas-surface border border-hairline text-ink-secondary hover:text-primary hover:border-primary transition-colors font-medium inline-flex items-center space-x-1"
            >
              <span>{primaryMeaning.sourceBadge}</span>
              <ShieldCheck className="w-2.5 h-2.5" />
            </button>
          </div>
          <p className="text-base sm:text-lg font-bold text-ink-primary leading-snug">
            {primaryMeaning.text}
          </p>
        </div>

        {/* Context Ayah Navigation */}
        {context?.surahNumber && context?.ayahNumber && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/baca?surah=${context.surahNumber}&ayah=${context.ayahNumber}`}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center space-x-1.5"
            >
              <span>Buka di Mushaf ({context.surahNumber}:{context.ayahNumber})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {lexical.rootSlug && !morphology.isParticle && (
              <Link
                href={`/akar/${lexical.rootSlug}`}
                className="px-4 py-2 rounded-full bg-canvas-surface hover:bg-canvas-page border border-hairline text-ink-primary hover:text-primary text-xs font-semibold transition-all inline-flex items-center space-x-1.5"
              >
                <span>Lihat Indeks Akar ({lexical.rootArabic})</span>
                <Compass className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </section>

      {/* 2. BEDAH KATA (MORPHOLOGY BREAKDOWN) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
            <Layers className="w-4 h-4 text-primary" />
            <span>Bedah Kata (Dekomposisi Morfologi)</span>
          </h3>
          <button
            onClick={() => openSourceDrawer('quranic-arabic-corpus')}
            className="text-xs text-ink-mute hover:text-primary flex items-center space-x-1 transition-colors"
          >
            <span>QAC v0.4</span>
            <ShieldCheck className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs sm:text-sm">
          {/* Root */}
          <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline space-y-1">
            <span className="text-[11px] text-ink-mute font-medium block">Akar Kata</span>
            {lexical.rootArabic ? (
              <span className="font-arabic font-bold text-base text-primary block" dir="rtl">
                {lexical.rootArabic}
              </span>
            ) : (
              <span className="text-ink-mute font-medium">Tanpa Akar (Harf)</span>
            )}
          </div>

          {/* Lemma */}
          <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline space-y-1">
            <span className="text-[11px] text-ink-mute font-medium block">Lema (Bentuk Dasar)</span>
            <span className="font-arabic font-bold text-base text-ink-primary block" dir="rtl">
              {lexical.lemmaArabic || lexical.lemma || '—'}
            </span>
          </div>

          {/* POS */}
          <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline space-y-1">
            <span className="text-[11px] text-ink-mute font-medium block">Kelas Kata (POS)</span>
            <span className="font-semibold text-ink-primary block">
              {morphology.pos}
            </span>
          </div>

          {/* Wazan / Form */}
          <div className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline space-y-1">
            <span className="text-[11px] text-ink-mute font-medium block">Bentuk / Wazan</span>
            <span className="font-semibold text-ink-primary block">
              {morphology.wazanOrForm || 'Bentuk Baku'}
            </span>
          </div>
        </div>

        <p className="text-xs text-ink-secondary leading-relaxed bg-canvas-soft p-3.5 rounded-2xl border border-hairline">
          <strong>Peran Morfologi:</strong> {morphology.grammaticalRole}
        </p>
      </section>

      {/* 3. MAKNA KLASIK (LANE'S ARABIC-ENGLISH LEXICON) */}
      {(lexical.senses.length > 0 || !morphology.isParticle) && (
        <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>
                {lexical.isRootEntry
                  ? "Makna Berdasarkan Akar Kata (Lane's Lexicon)"
                  : "Definisi Leksikal Kata (Lane's Lexicon)"}
              </span>
            </h3>

            <div className="flex items-center space-x-1.5">
              {lexical.isRootEntry ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-canvas-soft border border-hairline text-ink-secondary font-medium">
                  Entri Akar
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
                  Definisi Lemma
                </span>
              )}
              <button
                onClick={() => openSourceDrawer('lane-arabic-english-lexicon')}
                className="p-1 rounded hover:bg-canvas-soft text-ink-mute hover:text-primary transition-colors"
                title="Lihat Otoritas Lane's Lexicon"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {lexical.senses.length > 0 ? (
            <div className="space-y-3">
              {lexical.senses.map((sense, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-2"
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

              <div className="p-3 bg-canvas-surface rounded-2xl border border-hairline text-xs text-ink-mute flex flex-wrap items-center justify-between gap-2">
                <span><strong>Otoritas Sumber:</strong> Edward William Lane, <em>An Arabic-English Lexicon</em> (Perseus Digital Library &amp; Alpheios Project)</span>
                <span>Lisensi Digital: CC BY-SA 3.0</span>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-canvas-soft rounded-2xl border border-hairline text-center space-y-1">
              <p className="text-sm text-ink-mute italic">
                {morphology.isParticle
                  ? "Kata ini adalah Partikel (Harf) yang memiliki peran gramatikal tetap dalam kaidah Nahwu Al-Qur'an."
                  : "Makna leksikal terverifikasi belum terindeks untuk kata ini."}
              </p>
              <p className="text-xs text-ink-mute">
                Qurabic memegang prinsip keaslian data: Zero AI hallucination, hanya menyajikan kutipan leksikografi asli yang terverifikasi.
              </p>
            </div>
          )}
        </section>
      )}

      {/* 4. KELUARGA KATA (WORD FAMILY FROM QURAN CORPUS) */}
      {!morphology.isParticle && wordFamily.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
              <GitFork className="w-4 h-4 text-primary" />
              <span>Keluarga Kata dalam Al-Qur&apos;an ({wordFamily.length} Bentuk)</span>
            </h3>
            <span className="text-xs text-ink-mute">
              Berdasarkan Akar {lexical.rootArabic}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {wordFamily.map((item, idx) => (
              <Link
                key={idx}
                href={`/kata/${encodeURIComponent(item.arabic)}`}
                className="p-3 rounded-2xl bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/40 transition-all text-center space-y-1 group"
              >
                <span className="font-arabic text-xl font-bold text-ink-primary group-hover:text-primary transition-colors block" dir="rtl">
                  {item.arabic}
                </span>
                <div className="flex items-center justify-between text-[11px] text-ink-mute pt-1 border-t border-hairline/60">
                  <span>{item.pos}</span>
                  <span className="font-semibold text-primary">{item.count}×</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. KEMUNCULAN DI AL-QUR'AN (OCCURRENCES CONCORDANCE) */}
      {!morphology.isParticle && occurrences.items.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Kemunculan di Al-Qur&apos;an ({occurrences.totalCount} Ayat)</span>
            </h3>
            <button
              onClick={() => setIsOccurrencesOpen(!isOccurrencesOpen)}
              className="text-xs font-semibold text-primary hover:text-primary-deep inline-flex items-center space-x-1"
            >
              <span>{isOccurrencesOpen ? 'Tutup Daftar' : 'Buka Semua'}</span>
              {isOccurrencesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="space-y-3">
            {(isOccurrencesOpen ? occurrences.items : occurrences.items.slice(0, 3)).map((occ, idx) => (
              <Link
                key={idx}
                href={`/baca?surah=${occ.surahNumber}&ayah=${occ.ayahNumber}`}
                className="block p-4 rounded-2xl bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/30 transition-all space-y-2 text-left group"
              >
                <div className="flex items-center justify-between text-xs text-ink-mute">
                  <span className="font-semibold text-primary group-hover:underline">
                    QS. {occ.surahNameIndo || `Surah ${occ.surahNumber}`} : {occ.ayahNumber}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-canvas-surface border border-hairline">
                    Buka Ayat →
                  </span>
                </div>
                <p className="font-arabic text-lg sm:text-xl text-ink-primary leading-relaxed text-right" dir="rtl">
                  {occ.verseArabic}
                </p>
                {occ.verseIndo && (
                  <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2">
                    {occ.verseIndo}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. SINTAKSIS & MORFOLOGI LANJUTAN (ACCORDION) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
        <button
          onClick={() => setIsSyntaxOpen(!isSyntaxOpen)}
          className="w-full flex items-center justify-between text-left text-base font-bold text-ink-primary hover:text-primary transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-primary" />
            <span>Sintaksis &amp; Analisis I&apos;rab Lanjutan</span>
          </div>
          {isSyntaxOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isSyntaxOpen && (
          <div className="pt-3 border-t border-hairline space-y-4 animate-fade-in text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5">
                <span className="text-xs font-semibold text-ink-mute">Peran I&apos;rab Tradisional:</span>
                <p className="font-bold text-ink-primary">{syntax.irabRoleIndo}</p>
                {syntax.caseEnding && (
                  <p className="text-xs text-ink-secondary">Hala I&apos;rab: {syntax.caseEnding}</p>
                )}
                {syntax.mood && (
                  <p className="text-xs text-ink-secondary">Aspek Waktu / Mood: {syntax.mood}</p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5">
                <span className="text-xs font-semibold text-ink-mute">Fitur Morfosintaksis:</span>
                <ul className="space-y-1 text-xs text-ink-secondary list-disc list-inside">
                  {syntax.syntacticFeatures.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                  {morphology.rawTag && (
                    <li>Tag QAC: <code className="px-1.5 py-0.5 rounded bg-canvas-surface border border-hairline text-primary font-mono">{morphology.rawTag}</code></li>
                  )}
                  {morphology.rawFeatures && (
                    <li>Raw Features: <code className="px-1.5 py-0.5 rounded bg-canvas-surface border border-hairline text-ink-mute font-mono">{morphology.rawFeatures}</code></li>
                  )}
                </ul>
              </div>
            </div>

            <div className="p-3.5 bg-canvas-soft rounded-2xl border border-hairline text-xs text-ink-mute flex items-center justify-between">
              <span>Metodologi: QAC Computational Arabic Treebank &amp; Traditional Nahwu Analysis</span>
              <button
                onClick={() => openSourceDrawer('quranic-arabic-corpus')}
                className="text-primary hover:underline font-semibold"
              >
                Lihat Dokumentasi QAC
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Provenance Drawer Modal */}
      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        sources={provenance}
        initialSourceId={selectedSourceId}
      />
    </div>
  );
}
