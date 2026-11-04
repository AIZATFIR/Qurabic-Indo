'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Volume2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  GitFork,
  Compass,
  Library,
  Tag,
  Bookmark
} from 'lucide-react';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import { parseLexiconSenseTokens } from '@/lib/lexicon/lexicon-formatter';
import { isRawBuckwalterRoot, transliterateArabic } from '@/lib/morphology/transliteration';
import { stripArabicHarakat } from '@/lib/search/root-search';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import SourceDrawer from './SourceDrawer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';

interface WordStudyProps {
  study: WordStudyViewModel;
  onClose?: () => void;
  isModalMode?: boolean;
}

function toRomanNumeral(value: number): string {
  const numerals: Array<[number, string]> = [[1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'], [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'], [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
  let remaining = value;
  return numerals.reduce((result, [number, numeral]) => {
    while (remaining >= number) {
      result += numeral;
      remaining -= number;
    }
    return result;
  }, '');
}

function senseReferencesVerse(text: string, surahNumber?: number, ayahNumber?: number): boolean {
  if (!surahNumber || !ayahNumber) return false;
  const surahRoman = toRomanNumeral(surahNumber);
  return new RegExp(`\\b${surahRoman}\\.\\s*${ayahNumber}\\b`, 'i').test(text);
}

export default function WordStudy({ study, onClose, isModalMode = false }: WordStudyProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { language, t } = useLanguage();
  const { layoutMode } = useTheme();
  const classic = layoutMode === 'classic';
  const [isOccurrencesOpen, setIsOccurrencesOpen] = useState(false);
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);
  const [isWordFamilyExpanded, setIsWordFamilyExpanded] = useState(false);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const activeBookmarkSlug = study.lexical.rootSlug;
  const isSavedBookmark = activeBookmarkSlug ? isBookmarked(activeBookmarkSlug) : false;

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

  const displayPrimary = language === 'en' ? (primaryMeaning.textEnglish || 'Word translation unavailable') : primaryMeaning.text;
  const displaySourceBadge = language === 'en' ? (primaryMeaning.sourceBadgeEnglish || 'Quran.com · English') : primaryMeaning.sourceBadge;
  const displaySourceId = language === 'en' ? primaryMeaning.sourceIdEnglish : primaryMeaning.sourceId;

  const visibleWordFamily = isModalMode && !isWordFamilyExpanded
    ? wordFamily.slice(0, 6)
    : wordFamily;

  const displayTransliteration = (identity.transliteration && !isRawBuckwalterRoot(identity.transliteration))
    ? identity.transliteration
    : transliterateArabic(identity.arabic);

  const rawRootLetters = lexical.rootArabic ? lexical.rootArabic.trim() : '';
  const rootLettersList = rawRootLetters.includes(' ')
    ? rawRootLetters.split(/\s+/).filter(Boolean)
    : rawRootLetters.split('').filter(ch => !/[\u0610-\u061A\u0640\u064B-\u065F\u0670\u06D6-\u06ED\s]/.test(ch));
  const cleanActiveArabic = stripArabicHarakat(identity.arabic.replace(/\u0670/g, '\u0627'));

  // Fallback context resolution from occurrences if direct ayahArabic/ayahIndo not provided
  const fallbackOccurrence = (context?.surahNumber && context?.ayahNumber)
    ? occurrences.items.find(o => o.surahNumber === context.surahNumber && o.ayahNumber === context.ayahNumber)
    : (occurrences.items && occurrences.items.length > 0 ? occurrences.items[0] : undefined);

  const resolvedAyahArabic = context?.ayahArabic || fallbackOccurrence?.verseArabic;
  const resolvedAyahIndo = context?.ayahIndo || fallbackOccurrence?.verseIndo;
  const resolvedSurahNumber = context?.surahNumber || fallbackOccurrence?.surahNumber;
  const resolvedAyahNumber = context?.ayahNumber || fallbackOccurrence?.ayahNumber;
  const resolvedSurahNameIndo = context?.surahNameIndo || fallbackOccurrence?.surahNameIndo;
  const relevantLaneSenseIndex = lexical.senses.findIndex((sense) =>
    senseReferencesVerse(sense.text, resolvedSurahNumber, resolvedAyahNumber)
  );

  const handlePlayAudio = () => {
    if (isPlayingAudio || !resolvedSurahNumber || !resolvedAyahNumber || !context?.wordIndex) return;
    setIsPlayingAudio(true);

    let audioSrc = '';
    if (resolvedSurahNumber && resolvedAyahNumber && context?.wordIndex) {
      const sPad = String(resolvedSurahNumber).padStart(3, '0');
      const aPad = String(resolvedAyahNumber).padStart(3, '0');
      const wPad = String(context.wordIndex).padStart(3, '0');
      audioSrc = `https://audio.qurancdn.com/wbw/${sPad}_${aPad}_${wPad}.mp3`;
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

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapeRegex(matchedToken)})`, 'gi');
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
    <div className="space-y-6 sm:space-y-7 font-sans text-left" dir="ltr">
      {/* ========================================================================= */}
      {/* 1. HERO WORD SECTION (Identity, Crisp Arabic, Pronunciation & Meaning)     */}
      {/* ========================================================================= */}
      <section className={`p-6 sm:p-8 ${classic ? 'rounded-3xl' : 'rounded-none'} bg-canvas-surface border border-hairline shadow-subtle space-y-5 text-center relative overflow-hidden`}>
        {/* Top Control Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-3.5 text-left">
          <div className="flex items-center space-x-2">
            {context?.surahNumber && context?.ayahNumber && context?.wordIndex && !isModalMode ? (
              <span className="text-xs sm:text-sm font-mono font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                QS. {context.surahNumber}:{context.ayahNumber} (Kata #{context.wordIndex})
              </span>
            ) : !isModalMode ? (
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>{t('Bedah kata Al-Qur’an', 'Quran word study')}</span>
              </span>
            ) : (
              <span className="text-xs text-ink-mute font-medium">
                Kajian Morfologi &amp; Semantik Kata
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {activeBookmarkSlug && (
              <button
                onClick={() => toggleBookmark(activeBookmarkSlug, lexical.rootArabic || identity.arabic)}
                title={isSavedBookmark ? t('Hapus dari tersimpan', 'Remove bookmark') : t('Simpan akar ini', 'Bookmark root')}
                className={`p-2.5 sm:px-3.5 sm:py-2 ${classic ? 'rounded-xl' : 'rounded-none'} transition-all duration-200 border flex items-center space-x-1.5 ${
                  isSavedBookmark
                    ? 'bg-primary text-white border-primary shadow-subtle'
                    : 'bg-canvas-soft hover:bg-canvas-page text-ink-mute hover:text-primary border-hairline shadow-xs'
                }`}
              >
                <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSavedBookmark ? 'fill-current' : ''}`} />
                <span className="text-xs font-semibold hidden sm:inline">
                  {isSavedBookmark ? t('Tersimpan', 'Saved') : t('Simpan', 'Save')}
                </span>
              </button>
            )}
            <button
              onClick={handlePlayAudio}
              disabled={isPlayingAudio || !resolvedSurahNumber || !resolvedAyahNumber || !context?.wordIndex}
              title={t('Dengarkan rekaman kata ini', 'Play word recording')}
              className={`p-2.5 sm:px-3.5 sm:py-2 ${classic ? 'rounded-xl' : 'rounded-none'} transition-all duration-200 border flex items-center space-x-1.5 ${
                isPlayingAudio
                  ? 'bg-primary text-white scale-105 shadow-md border-primary animate-pulse'
                  : 'bg-canvas-soft hover:bg-canvas-page text-ink-secondary hover:text-primary border-hairline shadow-xs'
              }`}
            >
              <Volume2 aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs font-semibold hidden sm:inline">
                {isPlayingAudio ? t('Memutar…', 'Playing…') : 'Audio'}
              </span>
            </button>
            <button
              onClick={() => openSourceDrawer()}
              title={t('Lihat sumber data', 'View data sources')}
              className={`p-2.5 ${classic ? 'rounded-xl' : 'rounded-none'} bg-canvas-soft hover:bg-canvas-page text-ink-mute hover:text-primary transition-colors border border-hairline shadow-xs`}
            >
              <ShieldCheck aria-hidden="true" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Crisp Grand Arabic Word Display with Soft Ambient Glow */}
        <div className={`relative py-4 my-1 flex items-center justify-center overflow-hidden ${classic ? 'rounded-2xl' : 'rounded-none'} bg-gradient-to-b from-primary/5 via-canvas-soft/40 to-transparent border border-hairline/40`}>
          <span
            className="font-arabic text-6xl sm:text-7xl lg:text-8xl font-bold text-primary tracking-wide block leading-[2.6] sm:leading-[2.8] select-text transition-transform duration-300 hover:scale-[1.02]"
            title={identity.arabic}
            dir="rtl"
          >
            {identity.arabic}
          </span>
        </div>

        {/* Phonetic Transliteration */}
        {displayTransliteration && (
          <p className="text-sm sm:text-base text-ink-mute font-mono tracking-wider">
            — {displayTransliteration} —
          </p>
        )}

        {/* Primary Readable Meaning Banner (Bahasa Indonesia) */}
        <div className={`p-5 sm:p-6 ${classic ? 'rounded-2xl' : 'rounded-none'} bg-primary/10 border border-primary/25 space-y-2 text-center shadow-xs`}>
          <div className="flex items-center justify-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Makna Kata
            </span>
            <button
              onClick={() => openSourceDrawer(displaySourceId)}
              className="text-[11px] px-2.5 py-0.5 rounded-full bg-canvas-surface border border-hairline text-ink-secondary hover:text-primary hover:border-primary transition-colors font-medium inline-flex items-center space-x-1 shadow-subtle"
            >
              <span>{displaySourceBadge}</span>
              <ShieldCheck className="w-3 h-3 text-primary" />
            </button>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-ink-primary tracking-tight leading-snug select-text">
            {displayPrimary}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ROOT CONCEPT BANNER (Akar Kata & Filosofi Makna) — KALAAM BEST PRACTICE */}
      {/* ========================================================================= */}
      {!morphology.isParticle && lexical.rootArabic && (
        <section className="py-6 border-t border-hairline space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3.5">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-mute flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-primary" />
                <span>{t('Akar Kata', 'Root')}</span>
              </span>

              {/* Distinct Arabic Root Letter Tiles */}
              <div className="flex items-center space-x-2" dir="rtl">
                {rootLettersList.map((letter, idx) => (
                  <div
                    key={idx}
                    className={`w-10 h-10 sm:w-11 sm:h-11 ${classic ? 'rounded-xl' : 'rounded-none'} bg-primary/10 border border-primary/25 text-primary font-arabic text-2xl font-extrabold flex items-center justify-center shadow-xs transition-transform hover:-translate-y-0.5 select-text`}
                  >
                    {letter}
                  </div>
                ))}
              </div>

              {lexical.root && (
                <span className="text-xs font-mono font-semibold text-ink-mute">
                  ({lexical.root})
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2.5">
              {occurrences.totalCount > 0 && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-canvas-soft border border-hairline text-ink-secondary">
                  {occurrences.totalCount}× {t('di Al-Qur’an', 'in the Quran')}
                </span>
              )}
              {lexical.rootSlug && (
                <Link
                  href={`/akar/${lexical.rootSlug}`}
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center space-x-1"
                >
                  <span>{t('Indeks Akar', 'Root index')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {isModalMode && (
            <p className="text-sm text-ink-secondary leading-relaxed">
              {t('Arti tiap turunan mengikuti contoh ayatnya. Akar yang sama dapat membentuk kata dengan arti berbeda.', 'Each form is translated in its sample verse. Words sharing a root can have different meanings.')}
            </p>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. KELUARGA KATA DALAM AL-QUR'AN (WORD FAMILY) — THE CENTERPIECE AT TOP    */}
      {/* ========================================================================= */}
      {!morphology.isParticle && wordFamily.length > 0 && (
        <section className="py-6 border-t border-hairline space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3.5">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink-primary flex items-center space-x-2">
                <GitFork className="w-5 h-5 text-primary shrink-0" />
                <span>{t('Keluarga Kata dalam Al-Qur’an', 'Word family in the Quran')}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                  {wordFamily.length} {t('bentuk', 'forms')}
                </span>
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary pt-1 font-sans">
                {t('Bentuk yang tercatat dalam QAC. Arti per kata dari Quran.com mengikuti contoh ayatnya.', 'Forms recorded in QAC. Quran.com word meanings follow each sample verse.')}
              </p>
            </div>

            {lexical.rootSlug && (
              <Link
                href={`/akar/${lexical.rootSlug}`}
                className="text-xs font-semibold text-primary hover:underline shrink-0 inline-flex items-center space-x-1 self-start sm:self-center"
              >
                <span>{t('Buka Kamus Akar', 'Open root dictionary')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {/* Spacious Responsive Grid (2 cols mobile, 3 cols desktop for generous breathing room) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
            {visibleWordFamily.map((item, idx) => {
              const displayMeaning = language === 'en' ? (item.meaningEnglish || 'Translation unavailable') : (item.meaningIndo || 'Makna belum tersedia');
              const isVerb = item.pos === "Fi'il";
              const cleanItemArabic = stripArabicHarakat(item.arabic.replace(/\u0670/g, '\u0627'));
              const isCurrentWord = cleanItemArabic === cleanActiveArabic;

              return (
                <Link
                  key={idx}
                  href={`/kata/${encodeURIComponent(item.arabic)}${item.sampleCoordinate ? `?location=${item.sampleCoordinate.split(':').slice(0, 3).join(':')}` : ''}`}
                  className={`py-5 transition-colors text-center space-y-2.5 group flex flex-col justify-between border-b ${
                    isCurrentWord
                      ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
                      : 'bg-canvas-soft hover:bg-canvas-page border-hairline hover:border-primary/40'
                  }`}
                >
                  {/* Top Row: POS Tag & Frequency Badge */}
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      isVerb
                        ? 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20'
                    }`}>
                      {language === 'en' ? (isVerb ? 'Verb' : 'Noun') : item.pos}
                    </span>

                    <div className="flex items-center space-x-1.5">
                      {isCurrentWord && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/20 px-1.5 py-0.5 rounded-md">
                          {t('Kata ini', 'This word')}
                        </span>
                      )}
                      <span className="font-mono font-bold text-xs text-ink-mute group-hover:text-primary transition-colors bg-canvas-surface px-2 py-0.5 rounded-full border border-hairline">
                        {item.count}×
                      </span>
                    </div>
                  </div>

                  {/* Arabic Word Display in Large Calligraphic Typography */}
                  <div className="py-1">
                    <span
                      className="font-arabic text-3xl sm:text-4xl font-bold text-ink-primary group-hover:text-primary transition-colors block leading-relaxed select-text"
                      dir="rtl"
                    >
                      {item.arabic}
                    </span>
                  </div>

                  {/* Clear Authentic Indonesian Definition */}
                  <div className="pt-2 border-t border-hairline/60">
                    <p className="text-sm sm:text-base font-semibold text-ink-primary group-hover:text-primary transition-colors line-clamp-3 leading-snug font-sans select-text">
                      {displayMeaning}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {isModalMode && wordFamily.length > 6 && (
            <button
              type="button"
              onClick={() => setIsWordFamilyExpanded((expanded) => !expanded)}
              className="w-full py-2 text-sm font-semibold text-primary hover:underline"
            >
              {isWordFamilyExpanded ? t('Tampilkan lebih sedikit', 'Show fewer') : t(`Lihat ${wordFamily.length - 6} turunan lainnya`, `Show ${wordFamily.length - 6} more forms`)}
            </button>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. KONTEKS AYAT LENGKAP DENGAN PENANDA KATA AKTIF                          */}
      {/* ========================================================================= */}
      {resolvedAyahArabic && resolvedAyahIndo && (
        <section className="py-6 border-t border-hairline text-left space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm text-ink-mute border-b border-hairline pb-3">
            <span className="font-bold text-primary flex items-center space-x-2 text-sm sm:text-base">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span>{t('Konteks ayat', 'Verse context')} (QS. {resolvedSurahNameIndo || (resolvedSurahNumber ? `Surah ${resolvedSurahNumber}` : '')}: {resolvedAyahNumber})</span>
            </span>
            <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-md bg-canvas-soft border border-hairline text-ink-secondary">
              {t('Teks ayat', 'Verse text')}
            </span>
          </div>
          <p className="font-arabic text-3xl sm:text-4xl leading-[2.6] sm:leading-[2.8] text-right text-ink-primary select-text" dir="rtl">
            {resolvedAyahArabic}
          </p>
          <div className="text-base sm:text-lg text-ink-secondary leading-relaxed pt-2 border-t border-hairline/60 font-sans select-text">
            {language === 'id' ? renderHighlightedVerseIndo(resolvedAyahIndo, primaryMeaning.text) : t('', 'Open the reader for the English verse translation.')}
          </div>
          {resolvedSurahNumber && resolvedAyahNumber && (
            <div className="pt-2 flex justify-end">
              <Link
                href={`/baca?surah=${resolvedSurahNumber}&ayah=${resolvedAyahNumber}`}
                className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold shadow-subtle transition-all inline-flex items-center space-x-2"
              >
                <span>{t('Buka di Mushaf', 'Open reader')} (QS. {resolvedSurahNumber}:{resolvedAyahNumber})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 6. STRUKTUR TATA BAHASA & DERIVASI MORFOLOGI (Nahwu, Sharaf & QAC)        */}
      {/* ========================================================================= */}
      {(
        <section className="py-6 border-t border-hairline space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-ink-primary">{t('Struktur kata', 'Word structure')}</h3>
          <dl className="grid grid-cols-2 gap-3 text-sm sm:text-base">
            <div className="border-b border-hairline py-3">
              <dt className="text-xs text-ink-mute">{t('Kelas kata', 'Word class')}</dt>
              <dd className="mt-1 font-semibold text-ink-primary">{language === 'en' ? (morphology.pos === 'Harf' ? 'Particle' : morphology.pos === "Fi'il" ? 'Verb' : 'Noun') : (morphology.posLabelIndo || morphology.pos)}</dd>
            </div>
            {!morphology.isParticle && <div className="border-b border-hairline py-3">
              <dt className="text-xs text-ink-mute">{t('Akar', 'Root')}</dt>
              <dd className="mt-1 font-arabic text-lg font-bold text-primary" dir="rtl">{lexical.rootArabic}</dd>
            </div>}
            {morphology.verbForm && <div className="border-b border-hairline py-3">
              <dt className="text-xs text-ink-mute">{t('Bentuk', 'Form')}</dt>
              <dd className="mt-1 font-semibold text-ink-primary">{morphology.verbForm}</dd>
            </div>}
            {syntax.caseEnding && <div className="border-b border-hairline py-3">
              <dt className="text-xs text-ink-mute">{t('I‘rab', 'Inflection')}</dt>
              <dd className="mt-1 font-semibold text-ink-primary">{language === 'en' ? (morphology.rawFeatures?.includes('NOM') ? 'Nominative' : morphology.rawFeatures?.includes('ACC') ? 'Accusative' : 'Genitive') : syntax.caseEnding}</dd>
            </div>}
          </dl>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 7. SEMUA KEMUNCULAN DI AL-QUR'AN (CONCORDANCE OCCURRENCES)                */}
      {/* ========================================================================= */}
      {!isModalMode && !morphology.isParticle && occurrences.items.length > 0 && (
        <section className="py-6 border-t border-hairline space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-base sm:text-lg font-bold text-ink-primary flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>{t('Kemunculan akar', 'Root occurrences')} ({occurrences.totalCount})</span>
            </h3>
            <button
              onClick={() => setIsOccurrencesOpen(!isOccurrencesOpen)}
              className="text-xs sm:text-sm font-semibold text-primary hover:text-primary-deep inline-flex items-center space-x-1"
            >
              <span>{isOccurrencesOpen ? t('Tutup daftar', 'Close list') : t('Buka daftar', 'Open list')}</span>
              {isOccurrencesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="space-y-3">
            {(isOccurrencesOpen ? occurrences.items : occurrences.items.slice(0, 3)).map((occ, idx) => (
              <Link
                key={idx}
                href={`/baca?surah=${occ.surahNumber}&ayah=${occ.ayahNumber}`}
                className={`block p-4 sm:p-5 ${classic ? 'rounded-2xl' : 'rounded-none'} bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/30 transition-all space-y-2 text-left group`}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm text-ink-mute">
                  <span className="font-semibold text-primary group-hover:underline">
                    QS. {occ.surahNameIndo || `Surah ${occ.surahNumber}`} : {occ.ayahNumber}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-canvas-surface border border-hairline">
                    {t('Buka ayat', 'Open verse')} →
                  </span>
                </div>
                <p className="font-arabic text-xl sm:text-2xl text-ink-primary leading-loose text-right" dir="rtl">
                  {occ.verseArabic}
                </p>
                {language === 'id' && occ.verseIndo && (
                  <p className="text-sm sm:text-base text-ink-secondary line-clamp-2 font-sans">
                    {occ.verseIndo}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. RUJUKAN LEKSIKON KLASIK: Edward William Lane (London, 1863)            */}
      {/* ========================================================================= */}
      {lexical.senses.length > 0 && (
        <section className="py-6 border-t border-hairline space-y-4">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <h3 className="text-base sm:text-lg font-bold text-ink-primary flex items-center space-x-2">
              <Library className="w-5 h-5 text-primary" />
              <span>{t('Definisi klasik · Lane’s Lexicon (English)', 'Classical definitions · Lane’s Lexicon (English)')}</span>
            </h3>

            <div className="flex items-center space-x-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold font-mono">
                {lexical.volume ? `Part ${lexical.volume}, p. ${lexical.page}` : "Arsip 1863"}
              </span>
              <button
                onClick={() => openSourceDrawer('lane-arabic-english-lexicon')}
                className="p-1.5 rounded-lg hover:bg-canvas-soft text-ink-mute hover:text-primary transition-colors border border-hairline"
                title={t('Sumber Lane’s Lexicon', 'Lane’s Lexicon source')}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLexiconOpen(!isLexiconOpen)}
                className="p-1.5 rounded-lg hover:bg-canvas-soft text-ink-mute hover:text-primary transition-colors border border-hairline"
                title={isLexiconOpen ? t('Tutup leksikon', 'Close lexicon') : t('Buka leksikon', 'Open lexicon')}
              >
                {isLexiconOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isLexiconOpen ? (
            lexical.senses.length > 0 ? (
              <div className="space-y-4 animate-fade-in">
                <p className="text-sm text-ink-secondary leading-relaxed">{lexical.isRootEntry ? t('Ini entri akar. Tidak semua maknanya berlaku untuk kata dalam ayat ini.', 'This is a root entry. Not every sense applies to the selected word in this verse.') : t('Definisi kamus asli ditampilkan dalam bahasa Inggris. Pemetaan entri dan transkripsi digital dapat mengandung kesalahan.', 'Original dictionary definitions are in English. Entry matching and digital transcription may contain errors.')}</p>
                <div className="text-xs sm:text-sm text-ink-mute flex items-center justify-between px-1">
                  <span className="font-semibold text-ink-secondary">
                    {lexical.rootArabic ? `${t('Akar', 'Root')}: ${lexical.rootArabic} · ` : ''}
                    Edward William Lane (1863):
                  </span>
                  <span className="text-primary font-medium">{t('Teks Inggris', 'English source')}</span>
                </div>
                {relevantLaneSenseIndex >= 0 && (
                  <p className={`text-sm sm:text-base text-ink-secondary ${classic ? 'rounded-xl' : 'rounded-none'} bg-primary/5 p-3`}>
                    Sense #{relevantLaneSenseIndex + 1} {t('menyebut QS.', 'references Quran')} {resolvedSurahNumber}:{resolvedAyahNumber}.
                  </p>
                )}

                {lexical.senses.map((sense, idx) => {
                  const tokens = parseLexiconSenseTokens(sense.text);
                  const isRelevant = idx === relevantLaneSenseIndex;

                  return (
                    <details
                      key={idx}
                      open={isRelevant}
                      className={`group p-4 sm:p-5 ${classic ? 'rounded-2xl' : 'rounded-none'} bg-canvas-surface border border-hairline shadow-subtle`}
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm sm:text-base font-semibold text-ink-primary">
                        <span className="flex items-center gap-2">
                          <span>Sense #{idx + 1}</span>
                          {isRelevant && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs text-primary">{t('Relevan dengan ayat ini', 'References this verse')}</span>}
                        </span>
                        <span className="flex items-center gap-2 text-xs text-ink-mute">
                          {sense.citation.volume ? `Part ${sense.citation.volume}, p. ${sense.citation.page}` : `p. ${sense.citation.page}`}
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </span>
                      </summary>

                      <div className="mt-4 border-t border-hairline/60 pt-4 text-base sm:text-lg leading-relaxed sm:leading-loose text-ink-primary font-serif select-text">
                        {tokens.map((token, tIdx) => {
                          if (token.type === 'arabic') {
                            return (
                              <bdi
                                key={tIdx}
                                className="font-arabic font-bold text-xl sm:text-2xl text-primary px-1 inline-block align-baseline"
                                dir="rtl"
                              >
                                {token.content}
                              </bdi>
                            );
                          }
                          if (token.type === 'citation') {
                            return (
                              <span key={tIdx} className="font-sans font-semibold text-xs text-ink-secondary">
                                {token.content}
                              </span>
                            );
                          }
                          return <span key={tIdx}>{token.content}</span>;
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
            ) : (
              <div className={`p-6 ${classic ? 'rounded-2xl' : 'rounded-none'} bg-canvas-soft border border-hairline text-center space-y-1.5 text-sm text-ink-secondary`}>
                <p className="font-bold text-ink-primary">Kajian Leksikografi &amp; Morfologi</p>
                <p>{t('Definisi kamus belum terindeks untuk kata ini.', 'No dictionary definition is indexed for this word yet.')}</p>
              </div>
            )
          ) : (
            <button
              onClick={() => setIsLexiconOpen(true)}
              className={`w-full py-3 px-4 ${classic ? 'rounded-xl' : 'rounded-none'} bg-canvas-soft hover:bg-canvas-page border border-hairline text-xs sm:text-sm text-ink-secondary hover:text-primary font-semibold transition-all flex items-center justify-between`}
            >
              <span>{t('Baca definisi asli Lane · English', 'Read Lane’s original definitions · English')}</span>
              <ChevronDown className="w-4 h-4 text-primary" />
            </button>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 9. PROVENANCE DRAWER MODAL                                                */}
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
