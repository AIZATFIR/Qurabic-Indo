'use client';

import React, { useState, useEffect } from 'react';
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
  Library,
  Tag,
  Check,
  Copy,
  Sparkles,
  ArrowDown,
  Info
} from 'lucide-react';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import { parseLexiconSenseTokens } from '@/lib/lexicon/lexicon-formatter';
import { getAuthenticWordMeaning, getRootTranslationProfile } from '@/lib/morphology/root-dictionary';
import { isRawBuckwalterRoot, transliterateArabic } from '@/lib/morphology/transliteration';
import SourceDrawer from './SourceDrawer';

interface WordStudyProps {
  study: WordStudyViewModel;
  onClose?: () => void;
  isModalMode?: boolean;
}

export default function WordStudy({ study, onClose, isModalMode = false }: WordStudyProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'penggunaan'>('detail');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isGrammarOpen, setIsGrammarOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [isOccurrencesOpen, setIsOccurrencesOpen] = useState(false);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>();
  const [tafsirData, setTafsirData] = useState<{ source: string; text: string } | null>(
    study.context?.ayahTafsir || null
  );
  const [isLoadingTafsir, setIsLoadingTafsir] = useState(false);
  const [isTafsirExpanded, setIsTafsirExpanded] = useState(false);

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

  // Fetch authentic Kemenag RI Tafsir for current verse context
  useEffect(() => {
    if (context?.ayahTafsir) {
      setTafsirData(context.ayahTafsir);
      return;
    }
    if (!context?.surahNumber || !context?.ayahNumber) return;

    let isMounted = true;
    setIsLoadingTafsir(true);
    fetch(`/api/tafsir?surah=${context.surahNumber}&ayah=${context.ayahNumber}`)
      .then(res => res.ok ? res.json() : null)
      .then(json => {
        if (isMounted && json?.data) {
          setTafsirData({
            source: json.data.sourceTitle || 'Tafsir Kemenag RI',
            text: json.data.text
          });
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingTafsir(false);
      });

    return () => {
      isMounted = false;
    };
  }, [context?.surahNumber, context?.ayahNumber, context?.ayahTafsir]);

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
            <strong key={i} className="font-extrabold text-primary bg-primary/10 px-1.5 py-0.5 rounded-lg underline decoration-primary/40 underline-offset-4">
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

  return (
    <div className="space-y-6 font-sans text-left" dir="ltr">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Mode Baca Word Identity: Gede, Jelas, Nyaman) */}
      {/* ========================================================================= */}
      <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-5 text-center">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3 text-left">
          <div className="flex items-center space-x-2">
            {context?.surahNumber && context?.ayahNumber && context?.wordIndex ? (
              <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                ({context.surahNumber}:{context.ayahNumber}:{context.wordIndex})
              </span>
            ) : !isModalMode ? (
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Bedah Kata Al-Qur&apos;an
              </span>
            ) : null}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio}
              title="Dengarkan pengucapan kata"
              className={`p-2.5 rounded-full transition-all border border-hairline ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-105 shadow-subtle animate-pulse'
                  : 'bg-canvas-soft hover:bg-canvas-page text-ink-secondary hover:text-primary'
              }`}
            >
              <Volume2 aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => openSourceDrawer()}
              title="Lihat Otoritas Sumber Data"
              className="p-2.5 rounded-full bg-canvas-soft hover:bg-canvas-page text-ink-mute hover:text-primary transition-colors border border-hairline"
            >
              <ShieldCheck aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Big Crisp Arabic Word Display */}
        <div className="py-2" dir="rtl">
          <span
            className="font-arabic text-6xl sm:text-7xl font-bold text-primary tracking-wide block leading-[2.6] sm:leading-[2.8] select-text"
            title={identity.arabic}
          >
            {identity.arabic}
          </span>
        </div>

        {/* Transliteration */}
        {displayTransliteration && (
          <p className="text-sm sm:text-base text-ink-mute font-mono tracking-wider">
            — {displayTransliteration} —
          </p>
        )}

        {/* Primary Readable Meaning Banner (Bahasa Indonesia) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-primary/10 border border-primary/20 space-y-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Terjemahan Kata
            </span>
            <button
              onClick={() => openSourceDrawer(primaryMeaning.isEditorialSummary ? 'kemenag-translation' : 'quranic-arabic-corpus')}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-canvas-surface border border-hairline text-ink-secondary hover:text-primary hover:border-primary transition-colors font-medium inline-flex items-center space-x-1 shadow-subtle"
            >
              <span>{primaryMeaning.sourceBadge || 'Kemenag RI'}</span>
              <ShieldCheck className="w-3 h-3 text-primary" />
            </button>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight leading-snug select-text">
            {primaryMeaning.text}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TAB CONTROLS (Leksikon & Tata Bahasa | Penggunaan di Al-Qur'an) */}
      {/* ========================================================================= */}
      <div className="flex items-center p-1.5 bg-canvas-soft rounded-2xl border border-hairline font-sans">
        <button
          onClick={() => setActiveTab('detail')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'detail'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Leksikon &amp; Tata Bahasa</span>
        </button>

        <button
          onClick={() => setActiveTab('penggunaan')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm sm:text-base font-bold transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'penggunaan'
              ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
              : 'text-ink-mute hover:text-ink-primary'
          }`}
        >
          <GitFork className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Penggunaan ({occurrences.totalCount || wordFamily.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LEKSIKON & TATA BAHASA (Utuh, Otentik, Tanpa Template Generik) */}
      {/* ========================================================================= */}
      {activeTab === 'detail' && (
        <div className="space-y-6 animate-fade-in">
          {/* 3.1 Konteks Ayat Lengkap dengan Penanda Kata Aktif */}
          {context?.ayahArabic && context?.ayahIndo && (
            <section className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle text-left space-y-4">
              <div className="flex items-center justify-between text-xs sm:text-sm text-ink-mute border-b border-hairline pb-3">
                <span className="font-bold text-primary flex items-center space-x-2 text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <span>Konteks Ayat (QS. {context.surahNameIndo || `Surah ${context.surahNumber}`}: {context.ayahNumber})</span>
                </span>
                <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-md bg-canvas-soft border border-hairline text-ink-secondary">
                  Mushaf Kemenag RI
                </span>
              </div>
              <p className="font-arabic text-3xl sm:text-4xl leading-[2.6] sm:leading-[2.8] text-right text-ink-primary select-text" dir="rtl">
                {context.ayahArabic}
              </p>
              <div className="text-base sm:text-lg text-ink-secondary leading-relaxed pt-2 border-t border-hairline/60 font-sans select-text">
                {renderHighlightedVerseIndo(context.ayahIndo, primaryMeaning.text)}
              </div>
            </section>
          )}

          {/* 3.1.2 TAFSIR & KANDUNGAN AYAT RESMI KEMENAG RI (6.236 Ayat Otomatis) */}
          {(tafsirData || isLoadingTafsir) && (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="text-lg sm:text-xl font-bold text-ink-primary">
                    Tafsir &amp; Kandungan Ayat
                  </h3>
                </div>
                <span className="text-xs font-sans font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Kementerian Agama RI
                </span>
              </div>

              {isLoadingTafsir ? (
                <div className="animate-pulse space-y-2 py-2">
                  <div className="h-4 bg-canvas-soft rounded w-3/4"></div>
                  <div className="h-4 bg-canvas-soft rounded w-full"></div>
                  <div className="h-4 bg-canvas-soft rounded w-5/6"></div>
                </div>
              ) : tafsirData?.text ? (
                <div className="space-y-3">
                  <div
                    className={`text-base sm:text-lg text-ink-primary leading-relaxed sm:leading-loose font-sans text-justify sm:text-left whitespace-pre-line select-text ${
                      !isTafsirExpanded && tafsirData.text.length > 360 ? 'line-clamp-4' : ''
                    }`}
                  >
                    {tafsirData.text}
                  </div>
                  {tafsirData.text.length > 360 && (
                    <button
                      onClick={() => setIsTafsirExpanded(!isTafsirExpanded)}
                      className="text-xs sm:text-sm font-semibold text-primary hover:underline pt-1 inline-flex items-center space-x-1"
                    >
                      <span>{isTafsirExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Tafsir Lengkap...'}</span>
                    </button>
                  )}
                </div>
              ) : null}
            </section>
          )}

          {/* 3.2 Catatan Tadabbur & Linguistik (HANYA Jika Ada Profil Kurasi Otentik) */}
          {linguisticExplanation?.isCurated && (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-ink-primary flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span>Kajian Linguistik &amp; Makna Akar</span>
                </h3>
                <button
                  onClick={handleCopyExplanation}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-canvas-soft hover:bg-canvas-page border border-hairline text-xs sm:text-sm font-semibold text-ink-secondary hover:text-primary transition-all shadow-subtle"
                  title="Salin penjelasan ke papan klip"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>

              {/* Narrative Paragraph */}
              <p className="text-base sm:text-lg text-ink-primary leading-relaxed sm:leading-loose font-sans text-justify sm:text-left select-text">
                {linguisticExplanation.narrativeText}
              </p>

              {/* Quranic Theme Note */}
              {linguisticExplanation.quranicThemeText && (
                <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2 text-sm sm:text-base text-ink-secondary leading-relaxed">
                  <span className="font-bold text-primary block uppercase tracking-wider text-xs sm:text-sm">
                    Refleksi dalam Al-Qur&apos;an:
                  </span>
                  <p className="select-text">{linguisticExplanation.quranicThemeText}</p>
                </div>
              )}
            </section>
          )}

          {/* 3.3 LEKSIKON KLASIK: Lane's Arabic-English Lexicon (Full English, Mode Baca) */}
          <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-lg sm:text-xl font-bold text-ink-primary flex items-center space-x-2">
                <Library className="w-5 h-5 text-primary" />
                <span>
                  {lexical.isRootEntry
                    ? "Kamus & Leksikon Klasik (Lane's Lexicon)"
                    : "Definisi Leksikal Klasik (Lane's Lexicon)"}
                </span>
              </h3>

              <div className="flex items-center space-x-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold font-mono">
                  {lexical.volume ? `Part ${lexical.volume}, p. ${lexical.page}` : "Arsip 1863"}
                </span>
                <button
                  onClick={() => openSourceDrawer('lane-arabic-english-lexicon')}
                  className="p-1.5 rounded-lg hover:bg-canvas-soft text-ink-mute hover:text-primary transition-colors border border-hairline"
                  title="Lihat Otoritas Lane's Lexicon"
                >
                  <ShieldCheck className="w-4 h-4" />
                </button>
              </div>
            </div>

            {lexical.senses.length > 0 ? (
              <div className="space-y-4">
                <div className="text-xs sm:text-sm text-ink-mute flex items-center justify-between px-1">
                  <span className="font-semibold text-ink-secondary">
                    {lexical.rootArabic ? `Akar: ${lexical.rootArabic} · ` : ''}
                    Entri Otentik Edward William Lane (London, 1863):
                  </span>
                  <span className="text-primary font-medium">Mode Baca</span>
                </div>

                {lexical.senses.map((sense, idx) => {
                  const tokens = parseLexiconSenseTokens(sense.text);

                  return (
                    <div
                      key={idx}
                      className="p-5 sm:p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-xs space-y-3 border-l-4 border-l-primary"
                    >
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-hairline/60">
                        <span className="font-bold text-primary text-xs sm:text-sm flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                          <span>Sense #{idx + 1}</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-canvas-soft border border-hairline text-xs font-mono font-semibold text-ink-primary">
                          Book I, Part {sense.citation.volume}, p. {sense.citation.page}
                        </span>
                      </div>

                      {/* Reading-Mode Typography with BiDi Isolated Arabic */}
                      <p className="text-base sm:text-lg text-ink-primary font-normal leading-relaxed sm:leading-loose tracking-normal font-sans select-text">
                        {tokens.map((tok, tIdx) => (
                          tok.type === 'arabic' ? (
                            <bdi
                              key={tIdx}
                              dir="rtl"
                              className="font-arabic text-2xl sm:text-3xl font-bold text-primary px-1.5 py-0.5 inline-block leading-normal align-baseline select-text"
                            >
                              {tok.content}
                            </bdi>
                          ) : (
                            <span key={tIdx}>{tok.content}</span>
                          )
                        ))}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-canvas-soft border border-hairline text-center space-y-1.5 text-sm text-ink-secondary">
                <p className="font-bold text-ink-primary">Kajian Leksikografi &amp; Morfologi</p>
                <p>Kosakata ini dipetakan secara lengkap melalui basis data morfologi QAC dan kaidah Nahwu Al-Qur&apos;an di bawah ini.</p>
              </div>
            )}
          </section>

          {/* 3.4 BAGIAN TATA BAHASA & MORFOLOGI QAC */}
          {grammarDerivation && (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-5">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-lg sm:text-xl font-bold text-ink-primary flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <span>Tata Bahasa &amp; Derivasi Morfologi (QAC)</span>
                </h3>
                <button
                  onClick={() => setIsGrammarOpen(!isGrammarOpen)}
                  className="p-2 rounded-xl hover:bg-canvas-soft text-ink-mute hover:text-ink-primary transition-colors border border-hairline"
                  title={isGrammarOpen ? 'Tutup Tata Bahasa' : 'Buka Tata Bahasa'}
                >
                  {isGrammarOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isGrammarOpen && (
                <div className="space-y-4 animate-fade-in">
                  {/* Card 1: Bentuk Dasar / Kata Kerja Asal */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-hairline text-center space-y-2 relative group hover:border-primary/30 transition-all">
                    <span className="absolute top-3 right-3 text-ink-mute" title="Bentuk Asal / Lemma">
                      <Info className="w-4 h-4" />
                    </span>
                    <span className="text-4xl sm:text-5xl font-arabic font-bold text-emerald-600 dark:text-emerald-400 block py-2 select-text" dir="rtl">
                      {grammarDerivation.baseLemma.arabic}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-ink-primary select-text">
                      {grammarDerivation.baseLemma.meaning}
                    </p>
                    <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-xl mx-auto select-text">
                      {grammarDerivation.baseLemma.formationNote}
                    </p>
                  </div>

                  {/* Connecting Arrow */}
                  <div className="flex items-center justify-center py-1">
                    <div className="flex flex-col items-center text-primary">
                      <div className="w-0.5 h-5 bg-primary/40" />
                      <ArrowDown className="w-5 h-5 text-primary" />
                    </div>
                  </div>

                  {/* Card 2: Bentuk Kata dalam Ayat Ini */}
                  <div className="p-6 sm:p-7 rounded-2xl bg-canvas-soft border border-hairline text-center space-y-4 relative group hover:border-primary/30 transition-all">
                    <span className="absolute top-3 right-3 text-ink-mute" title="Bentuk dalam Ayat Al-Qur'an">
                      <Info className="w-4 h-4" />
                    </span>

                    {/* Full Connected Arabic Word */}
                    <span className="text-5xl sm:text-6xl font-arabic font-bold text-ink-primary block py-2 select-text" dir="rtl">
                      {identity.arabic}
                    </span>

                    {/* Morphemes Pills Breakdown */}
                    {grammarDerivation.verseForm.morphemes.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1" dir="rtl">
                        {grammarDerivation.verseForm.morphemes.map((m, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center space-x-1.5 space-x-reverse px-3 py-1 rounded-xl bg-canvas-surface border border-hairline shadow-xs"
                            title={`${m.label}: ${m.meaning || ''}`}
                          >
                            <span className={`font-arabic text-2xl font-bold ${m.colorClass}`}>
                              {m.text}
                            </span>
                            <span className="text-xs font-sans font-medium text-ink-secondary">
                              {m.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-base sm:text-lg font-bold text-ink-primary select-text">
                      {grammarDerivation.verseForm.contextMeaning}
                    </p>

                    {/* Concise Nahwu & I'rab Explanation */}
                    <div className="text-sm sm:text-base text-ink-secondary leading-relaxed text-left sm:text-center max-w-xl mx-auto bg-canvas-surface p-4 rounded-2xl border border-hairline select-text">
                      {grammarDerivation.verseForm.grammarExplanation}
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* 3.5 TIGA CHIPS MORFOLOGI RINGKAS (Ukuran Besar & Jelas) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 text-left">
            {/* Chip 1: Kelas Kata */}
            <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline space-y-1.5 text-center sm:text-left shadow-subtle">
              <span className="text-xs text-ink-mute font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                <Tag className="w-3.5 h-3.5 text-primary hidden sm:inline" />
                <span>Kelas Kata</span>
              </span>
              <span className="text-sm sm:text-base font-bold text-ink-primary block truncate select-text">
                {morphology.pos === "Fi'il" ? (morphology.verbType ? `Fi'il ${morphology.verbType}` : "Fi'il") : (morphology.nounType || morphology.posLabelIndo || morphology.pos)}
              </span>
            </div>

            {/* Chip 2: Akar Kata */}
            <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline space-y-1.5 text-center sm:text-left shadow-subtle">
              <span className="text-xs text-ink-mute font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                <Compass className="w-3.5 h-3.5 text-primary hidden sm:inline" />
                <span>Akar Kata</span>
              </span>
              {lexical.rootArabic ? (
                <div className="space-y-0.5">
                  <span className="font-arabic font-bold text-base sm:text-lg text-primary block truncate select-text" dir="rtl">
                    {lexical.rootArabic} {occurrences.totalCount > 0 && <span className="text-xs font-sans font-normal text-ink-mute">({occurrences.totalCount}×)</span>}
                  </span>
                  {rootTrans && (
                    <span className="text-xs text-ink-secondary block truncate font-sans select-text" title={rootTrans}>
                      {rootTrans}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-semibold text-ink-mute block truncate">Tanpa Akar</span>
              )}
            </div>

            {/* Chip 3: Bentuk / Wazan */}
            <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-hairline space-y-1.5 text-center sm:text-left shadow-subtle">
              <span className="text-xs text-ink-mute font-semibold uppercase tracking-wider flex items-center justify-center sm:justify-start space-x-1">
                <Layers className="w-3.5 h-3.5 text-primary hidden sm:inline" />
                <span>Wazan (Pola)</span>
              </span>
              <span className="text-sm sm:text-base font-bold text-ink-primary block truncate select-text">
                {morphology.wazanOrForm || (morphology.isParticle ? 'Mabni (Tetap)' : 'Bentuk Baku')}
              </span>
            </div>
          </div>

          {/* 3.6 Sintaksis & Analisis I'rab Lanjutan (Treebank QAC) */}
          <section className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h3 className="text-base sm:text-lg font-bold text-ink-primary flex items-center space-x-2">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span>Sintaksis &amp; Analisis I&apos;rab Lanjutan</span>
              </h3>
              <button
                onClick={() => openSourceDrawer('quranic-arabic-corpus')}
                className="text-xs text-ink-mute hover:text-primary flex items-center space-x-1"
              >
                <span>Treebank QAC</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm sm:text-base">
              <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2">
                <span className="text-xs font-semibold text-ink-mute">Peran I&apos;rab Tradisional:</span>
                <p className="font-bold text-ink-primary select-text">{syntax.irabRoleIndo}</p>
                {syntax.caseEnding && (
                  <p className="text-xs sm:text-sm text-ink-secondary">Hala I&apos;rab: {syntax.caseEnding}</p>
                )}
                {syntax.mood && (
                  <p className="text-xs sm:text-sm text-ink-secondary">Aspek Waktu / Mood: {syntax.mood}</p>
                )}
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2">
                <span className="text-xs font-semibold text-ink-mute">Fitur Morfosintaksis:</span>
                <ul className="space-y-1.5 text-xs sm:text-sm text-ink-secondary list-disc list-inside select-text">
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

          {/* Context Ayah Navigation Buttons */}
          {context?.surahNumber && context?.ayahNumber && (
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/baca?surah=${context.surahNumber}&ayah=${context.ayahNumber}`}
                className="px-6 py-3 rounded-full bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all inline-flex items-center space-x-2"
              >
                <span>Buka di Mushaf (QS. {context.surahNumber}:{context.ayahNumber})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {lexical.rootSlug && !morphology.isParticle && (
                <Link
                  href={`/akar/${lexical.rootSlug}`}
                  className="px-6 py-3 rounded-full bg-canvas-surface hover:bg-canvas-page border border-hairline text-ink-primary hover:text-primary text-xs sm:text-sm font-semibold transition-all inline-flex items-center space-x-2 shadow-subtle"
                >
                  <span>Jelajahi Indeks Akar ({lexical.rootArabic})</span>
                  <Compass className="w-4 h-4 text-primary" />
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
                <h3 className="text-base sm:text-lg font-bold text-ink-primary flex items-center space-x-2">
                  <GitFork className="w-5 h-5 text-primary shrink-0" />
                  <span>Keluarga Kata dalam Al-Qur&apos;an ({wordFamily.length} Bentuk)</span>
                </h3>
                <span className="text-xs sm:text-sm text-ink-mute font-medium">
                  Akar {lexical.rootArabic} {rootTrans ? `· ${rootTrans}` : ''}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {wordFamily.map((item, idx) => {
                  const displayMeaning = (item.meaningIndo && !item.meaningIndo.startsWith('Bentuk Kata') && !item.meaningIndo.startsWith('Nomina (') && !item.meaningIndo.startsWith('Verba ('))
                    ? item.meaningIndo
                    : getAuthenticWordMeaning(item.arabic, lexical.rootSlug || lexical.root);

                  return (
                    <Link
                      key={idx}
                      href={`/kata/${encodeURIComponent(item.arabic)}`}
                      className="p-4 rounded-2xl bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/40 transition-all text-center space-y-2 group flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="font-arabic text-2xl sm:text-3xl font-bold text-ink-primary group-hover:text-primary transition-colors block leading-relaxed" dir="rtl">
                          {item.arabic}
                        </span>
                        {displayMeaning && (
                          <p className="text-xs sm:text-sm text-ink-secondary group-hover:text-primary transition-colors line-clamp-2 leading-snug font-sans">
                            {displayMeaning}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-ink-mute pt-2 border-t border-hairline/60">
                        <span>{item.pos}</span>
                        <span className="font-bold text-primary">{item.count}×</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="p-8 rounded-3xl bg-canvas-surface border border-hairline text-center text-sm text-ink-mute">
              Tidak ada data keluarga kata turunan untuk partikel ini.
            </div>
          )}

          {/* Section: Kemunculan di Al-Qur'an */}
          {!morphology.isParticle && occurrences.items.length > 0 && (
            <section className="p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <h3 className="text-base sm:text-lg font-bold text-ink-primary flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span>Kemunculan di Al-Qur&apos;an ({occurrences.totalCount} Ayat)</span>
                </h3>
                <button
                  onClick={() => setIsOccurrencesOpen(!isOccurrencesOpen)}
                  className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-deep inline-flex items-center space-x-1"
                >
                  <span>{isOccurrencesOpen ? 'Tutup Daftar' : 'Lihat Semua'}</span>
                  {isOccurrencesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              <div className="space-y-3.5">
                {(isOccurrencesOpen ? occurrences.items : occurrences.items.slice(0, 5)).map((occ, idx) => (
                  <Link
                    key={idx}
                    href={`/baca?surah=${occ.surahNumber}&ayah=${occ.ayahNumber}`}
                    className="block p-4 sm:p-5 rounded-2xl bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/30 transition-all space-y-2.5 text-left group"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm text-ink-mute">
                      <span className="font-semibold text-primary group-hover:underline">
                        QS. {occ.surahNameIndo || `Surah ${occ.surahNumber}`} : {occ.ayahNumber}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-canvas-surface border border-hairline">
                        Buka Ayat →
                      </span>
                    </div>
                    <p className="font-arabic text-xl sm:text-2xl text-ink-primary leading-loose text-right" dir="rtl">
                      {occ.verseArabic}
                    </p>
                    {occ.verseIndo && (
                      <p className="text-sm sm:text-base text-ink-secondary line-clamp-2 font-sans">
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
