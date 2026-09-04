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
  ShieldCheck,
  Sparkles,
  GitFork,
  Compass,
  Quote,
  ScrollText,
  Library,
  Tag,
  Flame,
  Check
} from 'lucide-react';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import SourceDrawer from './SourceDrawer';

interface WordStudyProps {
  study: WordStudyViewModel;
  onClose?: () => void;
  isModalMode?: boolean;
}

export default function WordStudy({ study, onClose, isModalMode = false }: WordStudyProps) {
  const [activeTab, setActiveTab] = useState<'makna' | 'keluarga' | 'klasik'>('makna');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
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

  const classicalCit = lexical.classicalCitation;

  return (
    <div className="space-y-6 font-sans text-left" dir="ltr">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION & PRIMARY MEANING (Kalaam Style) */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-5 text-center">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3 text-left">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bedah Kata Al-Qur&apos;an</span>
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
              {morphology.pos}
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

        {/* Primary Readable Meaning Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-mute">
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

        {/* 3 Crisp Info Chips */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 text-left">
          {/* Chip 1: Kelas Kata */}
          <div className="p-3 rounded-2xl bg-canvas-soft border border-hairline space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider block flex items-center justify-center sm:justify-start space-x-1">
              <Tag className="w-3 h-3 text-primary hidden sm:inline" />
              <span>Kelas Kata</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-ink-primary block truncate">
              {morphology.nounType || morphology.verbType || morphology.posLabelIndo || morphology.pos}
            </span>
          </div>

          {/* Chip 2: Akar Kata */}
          <div className="p-3 rounded-2xl bg-canvas-soft border border-hairline space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider block flex items-center justify-center sm:justify-start space-x-1">
              <Compass className="w-3 h-3 text-primary hidden sm:inline" />
              <span>Akar Kata</span>
            </span>
            {lexical.rootArabic ? (
              <span className="font-arabic font-bold text-sm sm:text-base text-primary block truncate" dir="rtl">
                {lexical.rootArabic} {occurrences.totalCount > 0 && <span className="text-[11px] font-sans font-normal text-ink-mute">({occurrences.totalCount}×)</span>}
              </span>
            ) : (
              <span className="text-xs font-semibold text-ink-mute block truncate">Tanpa Akar</span>
            )}
          </div>

          {/* Chip 3: Bentuk / Wazan */}
          <div className="p-3 rounded-2xl bg-canvas-soft border border-hairline space-y-0.5 text-center sm:text-left">
            <span className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider block flex items-center justify-center sm:justify-start space-x-1">
              <Layers className="w-3 h-3 text-primary hidden sm:inline" />
              <span>Wazan (Pola Bentuk)</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-ink-primary block truncate">
              {morphology.wazanOrForm || 'Bentuk Baku'}
            </span>
          </div>
        </div>

        {/* Context Ayah Navigation Buttons */}
        {context?.surahNumber && context?.ayahNumber && (
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Link
              href={`/baca?surah=${context.surahNumber}&ayah=${context.ayahNumber}`}
              className="px-4 py-2 rounded-full bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center space-x-1.5"
            >
              <span>Buka di Mushaf (QS. {context.surahNumber}:{context.ayahNumber})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            {lexical.rootSlug && !morphology.isParticle && (
              <Link
                href={`/akar/${lexical.rootSlug}`}
                className="px-4 py-2 rounded-full bg-canvas-surface hover:bg-canvas-page border border-hairline text-ink-primary hover:text-primary text-xs font-semibold transition-all inline-flex items-center space-x-1.5"
              >
                <span>Jelajahi Indeks Akar ({lexical.rootArabic})</span>
                <Compass className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 2. SEGMENTED 3-TAB SWITCHER */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1.5 bg-canvas-soft rounded-2xl border border-hairline">
        <button
          onClick={() => setActiveTab('makna')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'makna'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bedah Makna</span>
        </button>

        <button
          onClick={() => setActiveTab('keluarga')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'keluarga'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Keluarga Kata {wordFamily.length > 0 && `(${wordFamily.length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('klasik')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'klasik'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <Library className="w-4 h-4" />
          <span>Kamus &amp; I&apos;rab</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: BEDAH MAKNA & FILOSOFI AKAR (DEFAULT) */}
      {/* ========================================================================= */}
      {activeTab === 'makna' && (
        <div className="space-y-6 animate-fade-in">
          {/* Card 1: Rincian & Nuansa Makna Kata */}
          <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                <ScrollText className="w-4 h-4 text-primary" />
                <span>Rincian &amp; Nuansa Makna Kata</span>
              </h3>
              <button
                onClick={() => openSourceDrawer('quranic-arabic-corpus')}
                className="text-xs text-ink-mute hover:text-primary flex items-center space-x-1 transition-colors"
              >
                <span>Kemenag &amp; QAC</span>
                <ShieldCheck className="w-3 h-3" />
              </button>
            </div>

            {/* Meanings List */}
            {lexical.meanings && lexical.meanings.length > 0 ? (
              <div className="space-y-2.5">
                {lexical.meanings.map((meaning, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-canvas-soft border border-hairline flex items-start space-x-3 text-xs sm:text-sm text-ink-primary">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{meaning}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline text-xs sm:text-sm text-ink-primary leading-relaxed">
                {primaryMeaning.text}
              </div>
            )}

            {/* Grammatical Role Note */}
            <div className="p-3.5 bg-canvas-soft rounded-2xl border border-hairline text-xs text-ink-secondary leading-relaxed">
              <strong className="text-ink-primary">Peran Gramatikal:</strong> {morphology.grammaticalRole}
            </div>

            {/* Quranic Nuances */}
            {lexical.usageNuances && lexical.usageNuances.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold text-ink-primary block uppercase tracking-wider">
                  Nuansa Penggunaan dalam Al-Qur&apos;an:
                </span>
                <ul className="space-y-1.5 text-xs text-ink-secondary list-disc list-inside">
                  {lexical.usageNuances.map((nuance, idx) => (
                    <li key={idx} className="leading-relaxed">{nuance}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Card 2: Bedah Filosofi Akar Kata (Kutipan Kitab Klasik) */}
          <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                <Quote className="w-4 h-4 text-primary" />
                <span>
                  {lexical.rootArabic
                    ? `Bedah Filosofi Akar (${lexical.rootArabic})`
                    : 'Karakter Leksikal Kata'}
                </span>
              </h3>
            </div>

            {classicalCit ? (
              <div className="space-y-4">
                {/* Classical Quote Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline space-y-3">
                  {/* Book Citation Header */}
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-ink-mute border-b border-hairline/60 pb-2">
                    <span className="font-bold text-primary">
                      {classicalCit.book} — {classicalCit.author}
                    </span>
                    {classicalCit.volumePage && (
                      <span className="text-[11px] font-mono">{classicalCit.volumePage}</span>
                    )}
                  </div>

                  {/* Original Arabic Quote */}
                  {classicalCit.originalArabic && (
                    <p className="font-arabic text-base sm:text-lg text-ink-primary leading-loose text-right pt-1" dir="rtl">
                      «{classicalCit.originalArabic}»
                    </p>
                  )}

                  {/* Indonesian Translation Quote */}
                  <blockquote className="text-xs sm:text-sm text-ink-secondary leading-relaxed italic border-l-2 border-primary pl-3">
                    &ldquo;{classicalCit.indonesianQuote}&rdquo;
                  </blockquote>
                </div>

                {/* Core Philosophy Card */}
                {classicalCit.corePhilosophy && (
                  <div className="p-4 rounded-2xl bg-canvas-surface border border-hairline space-y-1.5">
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider flex items-center space-x-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Intisari Filosofis</span>
                    </span>
                    <p className="text-xs sm:text-sm text-ink-primary leading-relaxed">
                      {classicalCit.corePhilosophy}
                    </p>
                  </div>
                )}
              </div>
            ) : lexical.rootPhilosophy ? (
              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2">
                <span className="text-xs font-bold text-ink-primary block uppercase tracking-wider">
                  Konsep Akar Kata:
                </span>
                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
                  {lexical.rootPhilosophy}
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline text-center text-xs text-ink-mute italic">
                {morphology.isParticle
                  ? "Kata ini adalah Partikel (Harf) yang memiliki peran gramatikal tetap dalam kaidah Nahwu Al-Qur'an."
                  : "Kajian filosofi akar kata terindeks melalui Quranic Arabic Corpus dan leksikografi klasik."}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KELUARGA KATA & OCCURRENCES */}
      {/* ========================================================================= */}
      {activeTab === 'keluarga' && (
        <div className="space-y-6 animate-fade-in">
          {/* Section: Keluarga Kata dalam Al-Qur'an */}
          {!morphology.isParticle && wordFamily.length > 0 ? (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                  <GitFork className="w-4 h-4 text-primary" />
                  <span>Keluarga Kata dalam Al-Qur&apos;an ({wordFamily.length} Bentuk)</span>
                </h3>
                <span className="text-xs text-ink-mute">
                  Akar {lexical.rootArabic}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {wordFamily.map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/kata/${encodeURIComponent(item.arabic)}`}
                    className="p-3.5 rounded-2xl bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/40 transition-all text-center space-y-1.5 group flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="font-arabic text-xl font-bold text-ink-primary group-hover:text-primary transition-colors block leading-relaxed" dir="rtl">
                        {item.arabic}
                      </span>
                      {item.meaningIndo && (
                        <p className="text-[11px] text-ink-secondary group-hover:text-primary transition-colors line-clamp-1 italic">
                          {item.meaningIndo}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-ink-mute pt-1 border-t border-hairline/60">
                      <span>{item.pos}</span>
                      <span className="font-bold text-primary">{item.count}×</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <div className="p-8 rounded-3xl bg-canvas-surface border border-hairline text-center text-xs text-ink-mute">
              Tidak ada data keluarga kata turunan untuk partikel atau kata ini.
            </div>
          )}

          {/* Section: Kemunculan di Al-Qur'an */}
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
                  <span>{isOccurrencesOpen ? 'Tutup Daftar' : 'Lihat Semua'}</span>
                  {isOccurrencesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="space-y-3">
                {(isOccurrencesOpen ? occurrences.items : occurrences.items.slice(0, 4)).map((occ, idx) => (
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
                    <p className="font-arabic text-lg sm:text-xl text-ink-primary leading-loose text-right" dir="rtl">
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: KAMUS KLASIK & I'RAB */}
      {/* ========================================================================= */}
      {activeTab === 'klasik' && (
        <div className="space-y-6 animate-fade-in">
          {/* Lane's Arabic-English Lexicon */}
          <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span>
                  {lexical.isRootEntry
                    ? "Entri Akar (Lane's Lexicon)"
                    : "Definisi Kata (Lane's Lexicon)"}
                </span>
              </h3>

              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subdued text-primary font-semibold">
                  {lexical.isRootEntry ? 'Entri Akar' : 'Definisi Leksikal'}
                </span>
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
                  <span><strong>Otoritas:</strong> Edward William Lane, <em>An Arabic-English Lexicon</em> (Perseus &amp; Alpheios Project)</span>
                  <span>Lisensi: CC BY-SA 3.0</span>
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

          {/* Advanced Syntax & I'rab */}
          <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                <Compass className="w-4 h-4 text-primary" />
                <span>Sintaksis &amp; Analisis I&apos;rab Lanjutan</span>
              </h3>
              <button
                onClick={() => openSourceDrawer('quranic-arabic-corpus')}
                className="text-xs text-ink-mute hover:text-primary flex items-center space-x-1"
              >
                <span>Treebank QAC</span>
                <ShieldCheck className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
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
              <span>Metodologi: QAC Computational Arabic Treebank &amp; Nahwu Tradisional</span>
              <button
                onClick={() => openSourceDrawer('quranic-arabic-corpus')}
                className="text-primary hover:underline font-semibold"
              >
                Lihat Otoritas QAC
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PROVENANCE DRAWER MODAL */}
      {/* ========================================================================= */}
      <SourceDrawer
        isOpen={isSourceDrawerOpen}
        onClose={() => setIsSourceDrawerOpen(false)}
        sources={provenance}
        initialSourceId={selectedSourceId}
      />
    </div>
  );
}
