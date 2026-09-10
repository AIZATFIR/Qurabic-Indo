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
  GitFork,
  Compass,
  Quote,
  ScrollText,
  Library,
  Tag,
  Flame,
  Check,
  Copy,
  Sparkles,
  ArrowDown,
  Info
} from 'lucide-react';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import { formatLexiconSenseText } from '@/lib/lexicon/lexicon-formatter';
import { getAuthenticWordMeaning, getRootTranslationProfile } from '@/lib/morphology/root-dictionary';
import { isRawBuckwalterRoot, transliterateArabic } from '@/lib/morphology/transliteration';
import SourceDrawer from './SourceDrawer';

interface WordStudyProps {
  study: WordStudyViewModel;
  onClose?: () => void;
  isModalMode?: boolean;
}

export default function WordStudy({ study, onClose, isModalMode = false }: WordStudyProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'penggunaan' | 'klasik'>('detail');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGrammarOpen, setIsGrammarOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
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
    context,
    linguisticExplanation,
    grammarDerivation
  } = study;

  const rootProfile = (lexical.rootSlug || lexical.root || lexical.rootArabic)
    ? getRootTranslationProfile(lexical.rootSlug || lexical.root || lexical.rootArabic)
    : null;
  const rootTrans = lexical.rootTranslation || rootProfile?.coreMeaning || (rootProfile?.titleIndo && !rootProfile.titleIndo.startsWith('Konsep') ? rootProfile.titleIndo.replace(/^Akar\s+[^\(]+\(/, '').replace(/\)$/, '') : undefined);

  const displayTransliteration = (identity.transliteration && !isRawBuckwalterRoot(identity.transliteration))
    ? identity.transliteration
    : transliterateArabic(identity.arabic);

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

  const handleCopyExplanation = () => {
    const textToCopy = linguisticExplanation?.fullText || primaryMeaning.text;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Highlights the active word in Indonesian verse context
  const renderHighlightedVerseIndo = (verseIndo: string, wordMeaning: string) => {
    if (!verseIndo) return null;
    const cleanVerse = verseIndo.replace(/^[“"']+|[”"']+$/g, '').trim();

    // Extract potential search tokens from word meaning
    const tokens = wordMeaning
      .split(/[\/\(\)\,\;]/)
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 2 && !['dia', 'kami', 'mereka', 'kalian', 'yang', 'dan', 'atau', 'dalam', 'atas', 'dengan'].includes(w));

    let matchedToken = '';
    for (const t of tokens) {
      if (cleanVerse.toLowerCase().includes(t)) {
        matchedToken = t;
        break;
      }
    }

    if (!matchedToken) {
      return <span>&ldquo;{cleanVerse}&rdquo;</span>;
    }

    const regex = new RegExp(`(${matchedToken})`, 'gi');
    const parts = cleanVerse.split(regex);

    return (
      <span>
        &ldquo;
        {parts.map((part, i) =>
          part.toLowerCase() === matchedToken.toLowerCase() ? (
            <strong key={i} className="font-extrabold text-primary bg-primary/10 px-1 py-0.5 rounded underline decoration-primary/40 underline-offset-2">
              {part}
            </strong>
          ) : (
            part
          )
        )}
        &rdquo;
      </span>
    );
  };

  const classicalCit = lexical.classicalCitation;

  return (
    <div className="space-y-6 font-sans text-left" dir="ltr">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Kalaam Inspired Clean Word Identity) */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4 text-center">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3 text-left">
          <div className="flex items-center space-x-2">
            {context?.surahNumber && context?.ayahNumber && context?.wordIndex ? (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                ({context.surahNumber}:{context.ayahNumber}:{context.wordIndex})
              </span>
            ) : !isModalMode ? (
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Bedah Kata Al-Qur&apos;an
              </span>
            ) : null}
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
        <div className="py-1" dir="rtl">
          <span
            className="font-arabic text-5xl sm:text-6xl font-bold text-primary tracking-wide block leading-[2.2] sm:leading-[2.4]"
            title={identity.arabic}
          >
            {identity.arabic}
          </span>
        </div>

        {/* Transliteration */}
        {displayTransliteration && (
          <p className="text-xs sm:text-sm text-ink-mute font-mono tracking-wider">
            — {displayTransliteration} —
          </p>
        )}

        {/* Primary Readable Meaning Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-primary/10 border border-primary/20 space-y-1.5 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Terjemahan Kata
            </span>
            <button
              onClick={() => openSourceDrawer(primaryMeaning.isEditorialSummary ? 'kemenag-translation' : 'quranic-arabic-corpus')}
              className="text-[10px] px-2 py-0.5 rounded-full bg-canvas-surface border border-hairline text-ink-secondary hover:text-primary hover:border-primary transition-colors font-medium inline-flex items-center space-x-1 shadow-subtle"
            >
              <span>{primaryMeaning.sourceBadge || 'Kemenag RI'}</span>
              <ShieldCheck className="w-3 h-3 text-primary" />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight leading-snug">
            {primaryMeaning.text}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TAB CONTROLS (Detail | Penggunaan | Leksikon Klasik) */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1.5 bg-canvas-soft rounded-2xl border border-hairline font-sans">
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'detail'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Detail &amp; Tata Bahasa</span>
        </button>

        <button
          onClick={() => setActiveTab('penggunaan')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'penggunaan'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <GitFork className="w-4 h-4" />
          <span>Penggunaan ({occurrences.totalCount || wordFamily.length})</span>
        </button>

        {!morphology.isParticle && (
          <button
            onClick={() => setActiveTab('klasik')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'klasik'
                ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Leksikon Klasik</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DETAIL & TATA BAHASA (Kalaam Paradigms) */}
      {/* ========================================================================= */}
      {activeTab === 'detail' && (
        <div className="space-y-6 animate-fade-in">
          {/* Konteks Ayat Lengkap dengan Penanda Kata Aktif */}
          {context?.ayahArabic && context?.ayahIndo && (
            <section className="p-5 sm:p-6 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle text-left space-y-3">
              <div className="flex items-center justify-between text-xs text-ink-mute border-b border-hairline pb-2.5">
                <span className="font-bold text-primary flex items-center space-x-1.5 text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>Konteks Ayat (QS. {context.surahNameIndo || `Surah ${context.surahNumber}`}: {context.ayahNumber})</span>
                </span>
                <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-md bg-canvas-soft border border-hairline text-ink-secondary">
                  Mushaf Kemenag RI
                </span>
              </div>
              <p className="font-arabic text-2xl sm:text-3xl leading-[2.4] sm:leading-[2.6] text-right text-ink-primary" dir="rtl">
                {context.ayahArabic}
              </p>
              <div className="text-xs sm:text-sm text-ink-secondary leading-relaxed pt-1 border-t border-hairline/60 font-sans">
                {renderHighlightedVerseIndo(context.ayahIndo, primaryMeaning.text)}
              </div>
            </section>
          )}

          {/* 3.1 BAGIAN PENJELASAN (Linguistic Narrative ala Kalaam) */}
          <section className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Penjelasan</span>
              </h3>
              <button
                onClick={handleCopyExplanation}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-canvas-soft hover:bg-canvas-page border border-hairline text-xs font-semibold text-ink-secondary hover:text-primary transition-all shadow-subtle"
                title="Salin penjelasan ke papan klip"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* Narrative Paragraph */}
            <p className="text-sm sm:text-base text-ink-primary leading-relaxed font-sans text-justify sm:text-left">
              {linguisticExplanation?.narrativeText}
            </p>

            {/* Quranic Theme Note */}
            {linguisticExplanation?.quranicThemeText && (
              <div className="p-4 rounded-2xl bg-canvas-soft border border-hairline space-y-1.5 text-xs sm:text-sm text-ink-secondary leading-relaxed">
                <span className="font-bold text-primary block uppercase tracking-wider text-[11px]">
                  Refleksi dalam Al-Qur&apos;an:
                </span>
                <p>{linguisticExplanation.quranicThemeText}</p>
              </div>
            )}
          </section>

          {/* 3.2 BAGIAN TATA BAHASA (Morphological Flowchart ala Kalaam) */}
          {grammarDerivation && (
            <section className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-5">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Tata bahasa</span>
                </h3>
                <button
                  onClick={() => setIsGrammarOpen(!isGrammarOpen)}
                  className="p-1.5 rounded-xl hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline"
                  title={isGrammarOpen ? 'Tutup Tata Bahasa' : 'Buka Tata Bahasa'}
                >
                  {isGrammarOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {isGrammarOpen && (
                <div className="space-y-4 animate-fade-in">
                  {/* Card 1: Bentuk Dasar / Kata Kerja Asal */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline text-center space-y-2 relative group hover:border-primary/30 transition-all">
                    <span className="absolute top-3 right-3 text-ink-mute" title="Bentuk Asal / Lemma">
                      <Info className="w-4 h-4" />
                    </span>
                    <span className="text-3xl sm:text-4xl font-arabic font-bold text-emerald-600 dark:text-emerald-400 block py-1" dir="rtl">
                      {grammarDerivation.baseLemma.arabic}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-ink-primary">
                      {grammarDerivation.baseLemma.meaning}
                    </p>
                    <p className="text-xs text-ink-secondary leading-relaxed max-w-lg mx-auto">
                      {grammarDerivation.baseLemma.formationNote}
                    </p>
                  </div>

                  {/* Connecting Arrow */}
                  <div className="flex items-center justify-center py-1">
                    <div className="flex flex-col items-center text-primary">
                      <div className="w-0.5 h-4 bg-primary/40" />
                      <ArrowDown className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Card 2: Bentuk Kata dalam Ayat Ini */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-canvas-soft border border-hairline text-center space-y-3 relative group hover:border-primary/30 transition-all">
                    <span className="absolute top-3 right-3 text-ink-mute" title="Bentuk dalam Ayat Al-Qur'an">
                      <Info className="w-4 h-4" />
                    </span>

                    {/* Morphemes colored display */}
                    <div className="flex items-center justify-center space-x-1 font-arabic text-3xl sm:text-4xl font-bold py-1 select-none" dir="rtl">
                      {grammarDerivation.verseForm.morphemes.map((m, idx) => (
                        <span key={idx} className={m.colorClass} title={`${m.label}: ${m.meaning || ''}`}>
                          {m.text}
                        </span>
                      ))}
                    </div>

                    <p className="text-sm sm:text-base font-bold text-ink-primary">
                      {grammarDerivation.verseForm.contextMeaning}
                    </p>

                    {/* Concise Nahwu & I'rab Explanation */}
                    <div className="text-xs sm:text-sm text-ink-secondary leading-relaxed text-left sm:text-center max-w-xl mx-auto bg-canvas-surface p-3.5 rounded-xl border border-hairline">
                      {grammarDerivation.verseForm.grammarExplanation}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 3.3 TIGA CHIPS MORFOLOGI RINGKAS */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-left">
            {/* Chip 1: Kelas Kata */}
            <div className="p-3.5 rounded-2xl bg-canvas-surface border border-hairline space-y-1 text-center sm:text-left shadow-subtle">
              <span className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                <Tag className="w-3 h-3 text-primary hidden sm:inline" />
                <span>Kelas Kata</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink-primary block truncate">
                {morphology.pos === "Fi'il" ? (morphology.verbType ? `Fi'il ${morphology.verbType}` : "Fi'il") : (morphology.nounType || morphology.posLabelIndo || morphology.pos)}
              </span>
            </div>

            {/* Chip 2: Akar Kata */}
            <div className="p-3.5 rounded-2xl bg-canvas-surface border border-hairline space-y-1 text-center sm:text-left shadow-subtle">
              <span className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                <Compass className="w-3 h-3 text-primary hidden sm:inline" />
                <span>Akar Kata</span>
              </span>
              {lexical.rootArabic ? (
                <div className="space-y-0.5">
                  <span className="font-arabic font-bold text-sm sm:text-base text-primary block truncate" dir="rtl">
                    {lexical.rootArabic} {occurrences.totalCount > 0 && <span className="text-[11px] font-sans font-normal text-ink-mute">({occurrences.totalCount}×)</span>}
                  </span>
                  {rootTrans && (
                    <span className="text-[10px] text-ink-secondary block truncate font-sans" title={rootTrans}>
                      {rootTrans}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs font-semibold text-ink-mute block truncate">Tanpa Akar</span>
              )}
            </div>

            {/* Chip 3: Bentuk / Wazan */}
            <div className="p-3.5 rounded-2xl bg-canvas-surface border border-hairline space-y-1 text-center sm:text-left shadow-subtle">
              <span className="text-[10px] text-ink-mute font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                <Layers className="w-3 h-3 text-primary hidden sm:inline" />
                <span>Wazan (Pola)</span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-ink-primary block truncate">
                {morphology.wazanOrForm || (morphology.isParticle ? 'Mabni (Bentuk Tetap)' : 'Bentuk Baku')}
              </span>
            </div>
          </div>

          {/* Context Ayah Navigation Buttons */}
          {context?.surahNumber && context?.ayahNumber && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <Link
                href={`/baca?surah=${context.surahNumber}&ayah=${context.ayahNumber}`}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all inline-flex items-center space-x-1.5"
              >
                <span>Buka di Mushaf (QS. {context.surahNumber}:{context.ayahNumber})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              {lexical.rootSlug && !morphology.isParticle && (
                <Link
                  href={`/akar/${lexical.rootSlug}`}
                  className="px-5 py-2.5 rounded-full bg-canvas-surface hover:bg-canvas-page border border-hairline text-ink-primary hover:text-primary text-xs font-semibold transition-all inline-flex items-center space-x-1.5 shadow-subtle"
                >
                  <span>Jelajahi Indeks Akar ({lexical.rootArabic})</span>
                  <Compass className="w-3.5 h-3.5 text-primary" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PENGGUNAAN (Keluarga Kata & Kemunculan di Al-Qur'an) */}
      {/* ========================================================================= */}
      {activeTab === 'penggunaan' && (
        <div className="space-y-6 animate-fade-in">
          {/* Section: Keluarga Kata dalam Al-Qur'an */}
          {!morphology.isParticle && wordFamily.length > 0 ? (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-hairline pb-3">
                <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                  <GitFork className="w-4 h-4 text-primary shrink-0" />
                  <span>Keluarga Kata dalam Al-Qur&apos;an ({wordFamily.length} Bentuk)</span>
                </h3>
                <span className="text-xs text-ink-mute font-medium">
                  Akar {lexical.rootArabic} {rootTrans ? `· ${rootTrans}` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {wordFamily.map((item, idx) => {
                  const displayMeaning = (item.meaningIndo && !item.meaningIndo.startsWith('Bentuk Kata') && !item.meaningIndo.startsWith('Nomina (') && !item.meaningIndo.startsWith('Verba ('))
                    ? item.meaningIndo
                    : getAuthenticWordMeaning(item.arabic, lexical.rootSlug || lexical.root);

                  return (
                    <Link
                      key={idx}
                      href={`/kata/${encodeURIComponent(item.arabic)}`}
                      className="p-3.5 rounded-2xl bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/40 transition-all text-center space-y-1.5 group flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="font-arabic text-xl font-bold text-ink-primary group-hover:text-primary transition-colors block leading-relaxed" dir="rtl">
                          {item.arabic}
                        </span>
                        {displayMeaning && (
                          <p className="text-xs text-ink-secondary group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                            {displayMeaning}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-ink-mute pt-1 border-t border-hairline/60">
                        <span>{item.pos}</span>
                        <span className="font-bold text-primary">{item.count}×</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="p-8 rounded-3xl bg-canvas-surface border border-hairline text-center text-xs text-ink-mute">
              Tidak ada data keluarga kata turunan untuk partikel ini.
            </div>
          )}

          {/* Section: Kemunculan di Al-Qur'an */}
          {!morphology.isParticle && occurrences.items.length > 0 && (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-base font-bold text-ink-primary flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-primary" />
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
                {(isOccurrencesOpen ? occurrences.items : occurrences.items.slice(0, 5)).map((occ, idx) => (
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
                      <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 font-sans">
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
      {/* TAB 3: KAMUS KLASIK & I'RAB LANJUTAN */}
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
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
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
                <div className="text-xs text-ink-mute flex items-center justify-between px-1">
                  <span className="font-semibold text-ink-secondary">Arsip Rujukan Leksikon Klasik:</span>
                  <span>Lane&apos;s Lexicon (1863)</span>
                </div>
                {lexical.senses.map((sense, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline shadow-xs space-y-2.5 border-l-4 border-l-primary"
                  >
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-hairline/60">
                      <span className="font-bold text-primary text-xs flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                        <span>Sense #{idx + 1}</span>
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-canvas-soft border border-hairline text-[11px] font-mono font-semibold text-ink-primary">
                        Book I, Part {sense.citation.volume}, p. {sense.citation.page}
                      </span>
                    </div>
                    <p className="text-sm sm:text-[15px] text-ink-primary font-normal leading-relaxed tracking-normal font-sans">
                      {formatLexiconSenseText(sense.text)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline text-center space-y-1 text-xs text-ink-secondary">
                <p>Kajian mendalam kata ini dipetakan secara lengkap melalui kaidah Nahwu QAC dan Leksikografi Klasik di tab Detail &amp; Tata Bahasa.</p>
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
                </ul>
              </div>
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
