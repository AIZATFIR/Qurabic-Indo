'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Volume2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
  GitFork,
  Library,
  Tag,
  Bookmark
} from 'lucide-react';
import { WordStudyViewModel } from '@/lib/lexicon/types';
import type { ArramoozForm } from '@/lib/lexicon/arramooz-shared';
import { filterOtherArabicForms } from '@/lib/lexicon/arramooz-shared';
import { parseLexiconSenseTokens } from '@/lib/lexicon/lexicon-formatter';
import { isRawBuckwalterRoot, transliterateArabic } from '@/lib/morphology/transliteration';
import { stripArabicHarakat } from '@/lib/search/root-search';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import SourceDrawer from './SourceDrawer';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { SOURCES_REGISTRY } from '@/lib/data/sources';
import { getOfflineQuranVerseTranslation } from '@/lib/offline/quran-content-reader';
import { getOfflineMaqamGlosses } from '@/lib/offline/maqam-glosses';
import { registerQuranAudio } from '@/lib/audio/active-audio-registry';
import { MAX_QURAN_WORD_GLOSS_LOCATIONS } from '@/lib/api/quran-word-gloss-limits';

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
  const wordAudioRef = useRef<HTMLAudioElement | null>(null);
  const unregisterWordAudioRef = useRef<(() => void) | null>(null);
  const [englishVerseTranslation, setEnglishVerseTranslation] = useState<string | null>(null);
  const [englishVerseStatus, setEnglishVerseStatus] = useState<'idle' | 'loading' | 'available' | 'unavailable'>('idle');
  const [liveWordGlosses, setLiveWordGlosses] = useState<Record<string, string>>({});
  const [liveWordGlossSources, setLiveWordGlossSources] = useState<Record<string, string>>({});
  const [wordGlossLoading, setWordGlossLoading] = useState(false);
  const [wordGlossError, setWordGlossError] = useState(false);
  const [wordFamilyGlossLoading, setWordFamilyGlossLoading] = useState(false);
  const [wordFamilyGlossError, setWordFamilyGlossError] = useState(false);
  const [wordGlossRetry, setWordGlossRetry] = useState(0);
  const { language, t } = useLanguage();
  const { layoutMode } = useTheme();
  const classic = layoutMode === 'classic';
  const formatVerseReference = (surah: number, ayah: number) => language === 'en'
    ? `Qur’an ${surah}:${ayah}`
    : `QS. ${surah}:${ayah}`;
  const [isOccurrencesOpen, setIsOccurrencesOpen] = useState(false);
  const [isLexiconOpen, setIsLexiconOpen] = useState(false);
  const [isWordFamilyExpanded, setIsWordFamilyExpanded] = useState(false);
  const [wordFamilyPage, setWordFamilyPage] = useState(0);
  const [isOtherFormsOpen, setIsOtherFormsOpen] = useState(false);
  const [isOtherFormsExpanded, setIsOtherFormsExpanded] = useState(false);
  const [otherFormsState, setOtherFormsState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [otherForms, setOtherForms] = useState<ArramoozForm[]>([]);
  const [otherFormsTotal, setOtherFormsTotal] = useState(0);
  const [otherFormsTruncated, setOtherFormsTruncated] = useState(false);
  const otherFormsController = useRef<AbortController | null>(null);
  const [isSourceDrawerOpen, setIsSourceDrawerOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string | undefined>();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    setWordFamilyPage(0);
    setIsWordFamilyExpanded(false);
  }, [study.lexical.rootSlug]);
  const loadOtherForms = () => {
    if (!study.lexical.rootSlug || otherFormsController.current) return;
    const controller = new AbortController();
    otherFormsController.current = controller;
    setOtherFormsState('loading');
    fetch(`/api/arramooz?root=${encodeURIComponent(study.lexical.rootSlug)}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Request failed')))
      .then((payload) => {
        setOtherForms(Array.isArray(payload.forms) ? payload.forms : []);
        setOtherFormsTotal(Number(payload.total) || 0);
        setOtherFormsTruncated(Boolean(payload.truncated));
        setOtherFormsState('done');
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setOtherFormsState('error');
      })
      .finally(() => {
        if (otherFormsController.current === controller) otherFormsController.current = null;
      });
  };

  useEffect(() => {
    otherFormsController.current?.abort();
    otherFormsController.current = null;
    setIsOtherFormsOpen(false);
    setIsOtherFormsExpanded(false);
    setOtherFormsState('idle');
    setOtherForms([]);
    setOtherFormsTotal(0);
    setOtherFormsTruncated(false);
  }, [study.lexical.rootSlug]);

  useEffect(() => () => otherFormsController.current?.abort(), []);
  useEffect(() => () => {
    wordAudioRef.current?.pause();
    wordAudioRef.current = null;
    unregisterWordAudioRef.current?.();
    unregisterWordAudioRef.current = null;
  }, []);

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

  const primaryLocation = identity.coordinate?.split(':').slice(0, 3).join(':') || '';
  const wordFamilyPageSize = 12;
  const wordFamilyPageCount = Math.ceil(wordFamily.length / wordFamilyPageSize);
  const activeWordFamilyPage = Math.min(wordFamilyPage, Math.max(0, wordFamilyPageCount - 1));
  const currentWordFamily = useMemo(() => wordFamily.slice(
    activeWordFamilyPage * wordFamilyPageSize,
    (activeWordFamilyPage + 1) * wordFamilyPageSize
  ), [activeWordFamilyPage, wordFamily]);
  const visibleWordFamily = useMemo(() => isModalMode && !isWordFamilyExpanded
    ? currentWordFamily.slice(0, 6)
    : currentWordFamily, [currentWordFamily, isModalMode, isWordFamilyExpanded]);

  useEffect(() => {
    const normalizeLocation = (coordinate?: string) => {
      const normalized = coordinate?.split(':').slice(0, 3).join(':');
      return normalized && /^\d{1,3}:\d{1,3}:\d{1,3}$/.test(normalized) ? normalized : '';
    };
    const primary = normalizeLocation(identity.coordinate);
    const familyLocations = [...new Set(visibleWordFamily
      .map((item) => normalizeLocation(item.sampleCoordinate))
      .filter((location) => location && location !== primary))];

    const controller = new AbortController();
    setLiveWordGlosses({});
    setLiveWordGlossSources({});
    setWordGlossLoading(Boolean(primary));
    setWordGlossError(false);
    setWordFamilyGlossLoading(familyLocations.length > 0);
    setWordFamilyGlossError(false);

    const loadGlosses = async (locations: string[], finish: () => void, markError: () => void) => {
      if (!locations.length) {
        finish();
        return;
      }
      try {
        for (let offset = 0; offset < locations.length; offset += MAX_QURAN_WORD_GLOSS_LOCATIONS) {
          if (controller.signal.aborted) return;
          const batch = locations.slice(offset, offset + MAX_QURAN_WORD_GLOSS_LOCATIONS);
          const params = new URLSearchParams({ language, locations: batch.join(',') });
          try {
            const response = await fetch(`/api/word-glosses?${params}`, { signal: controller.signal });
            if (!response.ok) throw new Error('Word gloss request failed.');
            const payload = await response.json();
            if (!controller.signal.aborted && payload?.meanings && typeof payload.meanings === 'object') {
              setLiveWordGlosses((current) => ({ ...current, ...payload.meanings }));
              if (payload?.sources && typeof payload.sources === 'object') {
                setLiveWordGlossSources((current) => ({ ...current, ...payload.sources }));
              }
            }
          } catch {
            if (controller.signal.aborted) return;
            try {
              const offlineMeanings = await getOfflineMaqamGlosses(batch);
              if (controller.signal.aborted) return;
              const offlineLocations = Object.keys(offlineMeanings);
              if (offlineLocations.length) {
                setLiveWordGlosses((current) => ({ ...current, ...offlineMeanings }));
                setLiveWordGlossSources((current) => ({
                  ...current,
                  ...Object.fromEntries(offlineLocations.map((location) => [location, 'maqam-english-gloss'])),
                }));
              }
              if (offlineLocations.length < batch.length) markError();
            } catch {
              markError();
            }
          }
        }
      } finally {
        if (!controller.signal.aborted) finish();
      }
    };

    void loadGlosses(primary ? [primary] : [], () => setWordGlossLoading(false), () => setWordGlossError(true));
    void loadGlosses(familyLocations, () => setWordFamilyGlossLoading(false), () => setWordFamilyGlossError(true));
    return () => controller.abort();
  }, [identity.coordinate, language, visibleWordFamily, wordGlossRetry]);

  const livePrimaryMeaning = liveWordGlosses[primaryLocation];
  const livePrimarySource = liveWordGlossSources[primaryLocation];
  const displayPrimary = livePrimaryMeaning || (wordGlossLoading
    ? t('Memuat makna kata…', 'Loading word meaning…')
    : language === 'en' ? (primaryMeaning.textEnglish || 'Word translation unavailable') : primaryMeaning.text);
  const displaySourceBadge = livePrimaryMeaning
    ? livePrimarySource === 'maqam-english-gloss'
      ? language === 'en' ? 'MAQAM · English stem gloss' : 'MAQAM · glos bentuk dasar (Inggris)'
      : language === 'en' ? 'Quran.com · English' : 'Quran.com · Indonesia'
    : language === 'en' ? (primaryMeaning.sourceBadgeEnglish || 'Source unavailable') : primaryMeaning.sourceBadge;
  const displaySourceId = livePrimaryMeaning
    ? livePrimarySource === 'maqam-english-gloss' ? SOURCES_REGISTRY.maqamGloss.id : 'quran-com-wbw'
    : language === 'en' ? primaryMeaning.sourceIdEnglish : primaryMeaning.sourceId;
  const hasLiveMaqamGloss = Object.values(liveWordGlossSources).some((source) => source === 'maqam-english-gloss');
  const displayProvenance = livePrimaryMeaning
    ? provenance.filter((source) => source.id !== SOURCES_REGISTRY.editorialWordGloss.id)
    : [...provenance];
  if (livePrimaryMeaning) {
    const primarySource = livePrimarySource === 'maqam-english-gloss'
      ? [SOURCES_REGISTRY.maqamGloss, SOURCES_REGISTRY.maqamTextBasis]
      : [SOURCES_REGISTRY.wordTranslation];
    for (const source of primarySource) {
      if (!displayProvenance.some((entry) => entry.id === source.id)) displayProvenance.push(source);
    }
  }
  if (hasLiveMaqamGloss) {
    for (const source of [SOURCES_REGISTRY.maqamGloss, SOURCES_REGISTRY.maqamTextBasis]) {
      if (!displayProvenance.some((entry) => entry.id === source.id)) displayProvenance.push(source);
    }
  }

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

  useEffect(() => {
    if (language !== 'en' || !resolvedSurahNumber || !resolvedAyahNumber) {
      setEnglishVerseTranslation(null);
      setEnglishVerseStatus('idle');
      return;
    }

    let active = true;
    const controller = new AbortController();
    setEnglishVerseTranslation(null);
    setEnglishVerseStatus('loading');

    void (async () => {
      try {
        const offlineTranslation = await getOfflineQuranVerseTranslation(resolvedSurahNumber, resolvedAyahNumber, 'en').catch(() => null);
        if (offlineTranslation) {
          if (active) {
            setEnglishVerseTranslation(offlineTranslation);
            setEnglishVerseStatus('available');
          }
          return;
        }

        const params = new URLSearchParams({ surah: String(resolvedSurahNumber), ayah: String(resolvedAyahNumber) });
        const response = await fetch(`/api/verse-translation?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error('Verse translation unavailable');
        const payload = await response.json();
        if (typeof payload.translation !== 'string' || !payload.translation.trim()) throw new Error('Verse translation unavailable');
        if (active) {
          setEnglishVerseTranslation(payload.translation.trim());
          setEnglishVerseStatus('available');
        }
      } catch {
        if (active && !controller.signal.aborted) setEnglishVerseStatus('unavailable');
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [language, resolvedSurahNumber, resolvedAyahNumber]);

  const relevantLaneSenseIndex = lexical.senses.findIndex((sense) =>
    senseReferencesVerse(sense.text, resolvedSurahNumber, resolvedAyahNumber)
  );
  const laneCitation = lexical.volume && lexical.page
    ? `Part ${lexical.volume}, p. ${lexical.page}`
    : lexical.senses[0]?.citation?.page
      ? `p. ${lexical.senses[0].citation.page}`
      : undefined;

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
    wordAudioRef.current = audio;
    unregisterWordAudioRef.current = registerQuranAudio(audio);
    const releaseAudio = () => {
      if (wordAudioRef.current !== audio) return;
      wordAudioRef.current = null;
      unregisterWordAudioRef.current?.();
      unregisterWordAudioRef.current = null;
      setIsPlayingAudio(false);
    };
    audio.onended = releaseAudio;
    audio.onerror = releaseAudio;
    audio.play()
      .catch((err) => {
        console.warn('Audio playback notice:', err);
        releaseAudio();
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
                {formatVerseReference(context.surahNumber, context.ayahNumber)} · {t('Kata', 'Word')} #{context.wordIndex}
              </span>
            ) : !isModalMode ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>{t('Bedah kata Al-Qur’an', 'Quran word study')}</span>
              </span>
            ) : (
              <span className="text-xs text-ink-mute font-medium">
                {t('Kajian Morfologi & Semantik Kata', 'Morphology & word meaning')}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {activeBookmarkSlug && (
              <button
                onClick={() => toggleBookmark(activeBookmarkSlug, lexical.rootArabic || identity.arabic)}
                title={isSavedBookmark ? t('Hapus dari tersimpan', 'Remove bookmark') : t('Simpan akar ini', 'Bookmark root')}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 ${classic ? 'rounded-xl' : 'rounded-none'} transition-colors border ${
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
              className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 px-3 ${classic ? 'rounded-xl' : 'rounded-none'} transition-colors border ${
                isPlayingAudio
                ? 'bg-primary text-white border-primary'
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

        {/* The verse word stays the visual focus; the surface remains quiet. */}
        <div className={`relative my-1 flex items-center justify-center overflow-hidden border border-hairline bg-canvas-surface py-4 ${classic ? 'rounded-2xl' : 'rounded-none'}`}>
          <span
            className="block select-text font-arabic text-6xl font-semibold leading-[2.6] text-ink-primary sm:text-7xl sm:leading-[2.8] lg:text-8xl"
            title={identity.arabic}
            dir="rtl"
          >
            {identity.arabic}
          </span>
        </div>

        {/* Phonetic Transliteration */}
        {displayTransliteration && (
          <p className="text-base text-ink-secondary font-mono">
            — {displayTransliteration} —
          </p>
        )}

        {/* Primary readable meaning */}
        <div className={`space-y-3 border border-hairline bg-canvas-surface p-5 text-center sm:p-6 ${classic ? 'rounded-2xl' : 'rounded-none'}`}>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-ink-secondary">
              {t('Makna Kata', 'Word meaning')}
            </span>
            <button
              onClick={() => openSourceDrawer(displaySourceId)}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <span>{displaySourceBadge}</span>
              <Info aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <p className="select-text text-xl font-semibold leading-snug text-ink-primary sm:text-2xl">
            {displayPrimary}
          </p>
          {wordGlossError && (
            <div role="status" className="flex flex-wrap items-center justify-center gap-2 text-sm text-ink-secondary">
              <span>{t('Makna kata gagal dimuat.', 'The word meaning could not be loaded.')}</span>
              {!wordFamilyGlossError && (
                <button
                  type="button"
                  onClick={() => setWordGlossRetry((retry) => retry + 1)}
                  className="inline-flex min-h-11 items-center px-2 font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  {t('Coba lagi', 'Retry')}
                </button>
              )}
            </div>
          )}
          {morphology.isParticle && (
            <p className="text-sm text-ink-secondary">
              {language === 'en'
                ? `Particle${morphology.rawTag ? ' · Quranic Arabic Corpus' : ''}`
                : `Harf${morphology.rawTag ? ' · Quranic Arabic Corpus' : ''}`}
            </p>
          )}
          {morphology.isParticle && lexical.particleMeaning && (
            <div className="mx-auto max-w-2xl border-s-2 border-primary/40 ps-4 text-start">
              <p className="text-sm font-medium text-ink-secondary">{t('Catatan berbantuan AI · belum ditelaah ahli', 'AI-assisted note · not scholar-reviewed')}</p>
              <p className="mt-1 text-base leading-relaxed text-ink-primary">
                {language === 'en' ? lexical.particleMeaning.en : lexical.particleMeaning.id}
              </p>
              <button
                type="button"
                onClick={() => openSourceDrawer(SOURCES_REGISTRY.particleGloss.id)}
                className="mt-1 inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {t('Tentang catatan ini', 'About this note')}
              </button>
            </div>
          )}
          {lexical.senses.length > 0 && (
            <a href="#lane-heading" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              {t('Lihat definisi asli Lane · English', 'Read Lane’s original definition · English')}
              {laneCitation && <span className="text-ink-secondary">· {laneCitation}</span>}
            </a>
          )}
          <a href={identity.qabasLemmaId ? `https://sina.birzeit.edu/qabas/lemma/${identity.qabasLemmaId}` : 'https://sina.birzeit.edu/qabas'} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-1 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {t('Arti kamus & bentuk kata di Qabas · Birzeit', 'Dictionary senses & word forms in Qabas · Birzeit')} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ROOT CONCEPT BANNER (Akar Kata & Filosofi Makna) — KALAAM BEST PRACTICE */}
      {/* ========================================================================= */}
      {!morphology.isParticle && lexical.rootArabic && (
        <section className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} space-y-4`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3.5">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-ink-secondary">
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
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. KELUARGA KATA DALAM AL-QUR'AN (WORD FAMILY) — THE CENTERPIECE AT TOP    */}
      {/* ========================================================================= */}
      {!morphology.isParticle && wordFamily.length > 0 && (
        <section className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} space-y-4`}>
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
                {t('QAC mencatat bentuk dan kategorinya. Glos kata Quran.com mengikuti konteks ayat, sehingga bentuk dari akar yang sama dapat berbeda makna.', 'QAC records the forms and categories. Quran.com’s word glosses follow verse context, so forms from one root can carry different meanings.')}
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
          <div className={classic ? "grid grid-cols-2 sm:grid-cols-3 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0"}>
            {visibleWordFamily.map((item, idx) => {
              const itemLocation = item.sampleCoordinate?.split(':').slice(0, 3).join(':') || '';
              const liveMeaning = liveWordGlosses[itemLocation];
              const liveSource = liveWordGlossSources[itemLocation];
              const displayMeaning = liveMeaning || (wordFamilyGlossLoading
                ? t('Memuat makna…', 'Loading meaning…')
                : language === 'en' ? (item.meaningEnglish || 'Translation unavailable') : (item.meaningIndo || 'Makna belum tersedia'));
              const isVerb = item.pos === "Fi'il";
              const cleanItemArabic = stripArabicHarakat(item.arabic.replace(/\u0670/g, '\u0627'));
              const isCurrentWord = cleanItemArabic === cleanActiveArabic;

              return (
                <Link
                  key={idx}
                  href={`/kata/${encodeURIComponent(item.arabic)}${item.sampleCoordinate ? `?location=${item.sampleCoordinate.split(':').slice(0, 3).join(':')}` : ''}`}
                  className={`${classic ? 'p-3 sm:p-4 rounded-2xl border' : 'py-5 border-b'} transition-colors text-center space-y-2.5 group flex flex-col justify-between ${
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
                        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
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
                    {liveMeaning && (
                      <button
                        type="button"
                        onClick={() => openSourceDrawer(liveSource === 'maqam-english-gloss' ? SOURCES_REGISTRY.maqamGloss.id : SOURCES_REGISTRY.wordTranslation.id)}
                        className="mt-1 min-h-8 text-xs text-ink-secondary underline underline-offset-2 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        {liveSource === 'maqam-english-gloss'
                          ? language === 'en' ? 'MAQAM · English stem gloss' : 'MAQAM · glos bentuk dasar (Inggris)'
                          : language === 'en' ? 'Quran.com · English' : 'Quran.com · Indonesia'}
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {wordFamilyPageCount > 1 && (
            <nav aria-label={t('Halaman keluarga kata', 'Word family pages')} className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-3">
              <button
                type="button"
                onClick={() => {
                  setWordFamilyPage(activeWordFamilyPage - 1);
                  setIsWordFamilyExpanded(false);
                }}
                disabled={activeWordFamilyPage === 0}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] px-3 text-sm font-medium text-ink-primary hover:bg-canvas-soft disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t('Sebelumnya', 'Previous')}
              </button>
              <p aria-live="polite" className="text-sm tabular-nums text-ink-secondary">
                {t(
                  `${activeWordFamilyPage * wordFamilyPageSize + 1}–${Math.min((activeWordFamilyPage + 1) * wordFamilyPageSize, wordFamily.length)} dari ${wordFamily.length} bentuk`,
                  `${activeWordFamilyPage * wordFamilyPageSize + 1}–${Math.min((activeWordFamilyPage + 1) * wordFamilyPageSize, wordFamily.length)} of ${wordFamily.length} forms`
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setWordFamilyPage(activeWordFamilyPage + 1);
                  setIsWordFamilyExpanded(false);
                }}
                disabled={activeWordFamilyPage >= wordFamilyPageCount - 1}
                className="inline-flex min-h-11 items-center rounded-[var(--radius-control)] px-3 text-sm font-medium text-primary hover:bg-canvas-soft disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t('Berikutnya', 'Next')}
              </button>
            </nav>
          )}

          {wordFamilyGlossError && (
            <div role="status" className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline pt-3 text-sm text-ink-secondary">
              <span>{t('Sebagian makna keluarga kata gagal dimuat.', 'Some word-family meanings could not be loaded.')}</span>
              <button
                type="button"
                onClick={() => setWordGlossRetry((retry) => retry + 1)}
                disabled={wordFamilyGlossLoading}
                className="inline-flex min-h-11 items-center px-1 font-medium text-primary underline underline-offset-4 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {wordFamilyGlossLoading ? t('Memuat…', 'Loading…') : t('Coba lagi', 'Retry')}
              </button>
            </div>
          )}

          {isModalMode && currentWordFamily.length > 6 && (
            <button
              type="button"
              onClick={() => setIsWordFamilyExpanded((expanded) => !expanded)}
              className="inline-flex min-h-11 w-full items-center justify-center py-2 text-sm font-semibold text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {isWordFamilyExpanded
                ? t('Tampilkan lebih sedikit', 'Show fewer')
                : t(`Lihat ${currentWordFamily.length - 6} bentuk lainnya`, `Show ${currentWordFamily.length - 6} more forms`)}
            </button>
          )}
        </section>
      )}

      {lexical.rootSlug && (
        <section className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} space-y-4`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-ink-primary">
                {t('Bentuk Arab lain dari akar ini', 'Other Arabic forms from this root')}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-ink-secondary">
                {t('Bentuk di luar daftar Al-Qur’an, dari kamus morfologi Arramooz. Definisi sumber dipertahankan dalam bahasa Arab.', 'Forms beyond the Quran list, from the Arramooz morphology dictionary. Source definitions remain in Arabic.')}
              </p>
            </div>
            <span className="shrink-0 text-xs text-ink-mute">Arramooz · GPL-2</span>
          </div>
          <button
            type="button"
            aria-expanded={isOtherFormsOpen}
            onClick={() => {
              if (isOtherFormsOpen) {
                setIsOtherFormsOpen(false);
                otherFormsController.current?.abort();
                otherFormsController.current = null;
                setOtherFormsState((state) => state === 'loading' ? 'idle' : state);
              } else {
                setIsOtherFormsOpen(true);
                if (otherFormsState === 'idle') loadOtherForms();
              }
            }}
            className="min-h-11 text-sm font-semibold text-primary hover:underline"
          >
            {isOtherFormsOpen ? t('Tutup bentuk tambahan', 'Hide additional forms') : t('Lihat bentuk tambahan', 'Show additional forms')}
          </button>
          {isOtherFormsOpen && otherFormsState === 'loading' && <p role="status" className="text-sm text-ink-secondary">{t('Memuat lema kamus…', 'Loading dictionary entries…')}</p>}
          {isOtherFormsOpen && otherFormsState === 'error' && (
            <div className="flex items-center gap-3 text-sm">
              <p role="status" className="text-ink-secondary">{t('Data kamus belum dapat dimuat.', 'Dictionary data could not be loaded.')}</p>
              <button type="button" className="font-semibold text-primary underline" onClick={loadOtherForms}>{t('Coba lagi', 'Retry')}</button>
            </div>
          )}
          {isOtherFormsOpen && otherFormsState === 'done' && (() => {
            const distinctForms = filterOtherArabicForms(otherForms, wordFamily.map((item) => item.arabic));
            const visibleForms = isOtherFormsExpanded ? distinctForms : distinctForms.slice(0, 12);
            return distinctForms.length === 0 ? (
              <p className="text-sm text-ink-secondary">{t('Belum ada bentuk tambahan yang tercatat untuk akar ini.', 'No additional forms are indexed for this root.')}</p>
            ) : (
              <>
                <p className="text-xs text-ink-mute">{t(`${distinctForms.length} bentuk ditemukan dalam data yang tersedia`, `${distinctForms.length} forms found in the available data`)}</p>
                <ul className="divide-y divide-hairline border-y border-hairline">
                  {visibleForms.map((form, index) => (
                    <li key={`${form.pos}-${form.arabic}-${index}`} className="py-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5">
                      <span className="font-arabic text-2xl text-ink-primary min-w-32" dir="rtl">{form.arabic}</span>
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="text-ink-secondary">
                          {form.pos === 'verb' ? t('Kata kerja', 'Verb') : t('Kata benda', 'Noun')}
                          {form.wordType ? ` · ${form.wordType}` : ''}
                          {form.wazn ? ` · ${t('wazan', 'pattern')} ${form.wazn}` : ''}
                        </p>
                        {form.definition && <p className="mt-1 font-arabic leading-relaxed text-ink-primary" dir="rtl" lang="ar">{form.definition}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
                {distinctForms.length > 12 && <button type="button" onClick={() => setIsOtherFormsExpanded((expanded) => !expanded)} className="text-sm font-semibold text-primary hover:underline">{isOtherFormsExpanded ? t('Tampilkan lebih sedikit', 'Show fewer') : t('Tampilkan bentuk lainnya', 'Show more forms')}</button>}
                {otherFormsTruncated && <p className="text-xs text-ink-mute">{t(`Sumber memuat ${otherFormsTotal} lema untuk akar ini; aplikasi menampilkan maksimal 120.`, `The source has ${otherFormsTotal} entries for this root; the app shows up to 120.`)}</p>}
              </>
            );
          })()}
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. KONTEKS AYAT LENGKAP DENGAN PENANDA KATA AKTIF                          */}
      {/* ========================================================================= */}
      {resolvedAyahArabic && (language === 'en' ? Boolean(resolvedSurahNumber && resolvedAyahNumber) : Boolean(resolvedAyahIndo)) && (
        <section className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} text-left space-y-4`}>
          <div className="flex items-center justify-between text-xs sm:text-sm text-ink-mute border-b border-hairline pb-3">
            <span className="font-bold text-primary flex items-center space-x-2 text-sm sm:text-base">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span>{t('Konteks ayat', 'Verse context')} ({formatVerseReference(resolvedSurahNumber!, resolvedAyahNumber!)})</span>
            </span>
            <span className="text-sm font-sans font-medium px-2.5 py-1 rounded-md bg-canvas-soft border border-hairline text-ink-secondary">
              {language === 'id' ? 'Mushaf Kemenag RI' : 'Saheeh International · Quran.com'}
            </span>
          </div>
          <p className="font-arabic text-3xl sm:text-4xl leading-[2.6] sm:leading-[2.8] text-right text-ink-primary select-text" dir="rtl">
            {resolvedAyahArabic}
          </p>
          {language === 'id' && resolvedAyahIndo && (
            <div className="text-base sm:text-lg text-ink-secondary leading-relaxed pt-2 border-t border-hairline/60 font-sans select-text">
              {renderHighlightedVerseIndo(resolvedAyahIndo, displayPrimary)}
            </div>
          )}
          {language === 'en' && (
            <div className="pt-2 border-t border-hairline/60 font-sans select-text">
              {englishVerseTranslation ? (
                <p lang="en" className="text-base sm:text-lg leading-relaxed text-ink-secondary">{englishVerseTranslation}</p>
              ) : (
                <p role="status" className="text-base text-ink-secondary">
                  {englishVerseStatus === 'loading'
                    ? 'Loading Saheeh International translation…'
                    : 'Saheeh International translation is unavailable for this verse.'}
                </p>
              )}
            </div>
          )}
          {resolvedSurahNumber && resolvedAyahNumber && (
            <div className="pt-2 flex justify-end">
              <Link
                href={`/baca?surah=${resolvedSurahNumber}&ayah=${resolvedAyahNumber}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary-deep"
              >
                <span>{t('Buka di Mushaf', 'Open reader')} ({formatVerseReference(resolvedSurahNumber, resolvedAyahNumber)})</span>
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
        <section className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} space-y-4`}>
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
        <section className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} space-y-4`}>
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
                className={`block p-4 sm:p-5 ${classic ? 'rounded-2xl' : 'rounded-none'} bg-canvas-soft hover:bg-canvas-page border border-hairline hover:border-primary/30 transition-colors space-y-2 text-left group`}
              >
                <div className="flex items-center justify-between text-xs sm:text-sm text-ink-mute">
                  <span className="font-semibold text-primary group-hover:underline">
                    {language === 'en'
                      ? formatVerseReference(occ.surahNumber, occ.ayahNumber)
                      : `QS. ${occ.surahNameIndo || `Surah ${occ.surahNumber}`} : ${occ.ayahNumber}`}
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
        <section id="lane-heading" className={`${classic ? 'p-6 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle' : 'py-6 border-t border-hairline'} space-y-4`}>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline pb-3">
            <h3 className="flex items-center gap-2 text-base font-medium text-ink-primary sm:text-lg">
              <Library className="w-5 h-5 text-primary" />
              <span>{t('Definisi klasik · Lane’s Lexicon (English)', 'Classical definitions · Lane’s Lexicon (English)')}</span>
            </h3>

            <div className="flex items-center space-x-2">
              <span className="text-sm tabular-nums text-ink-secondary">
                {lexical.volume
                  ? language === 'id' ? `Bagian ${lexical.volume}, hlm. ${lexical.page}` : `Part ${lexical.volume}, p. ${lexical.page}`
                  : language === 'id' ? 'Arsip 1863' : '1863 archive'}
              </span>
              <button
                onClick={() => openSourceDrawer('lane-arabic-english-lexicon')}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-hairline text-ink-secondary transition-colors hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={t('Lihat sumber Lane’s Lexicon', 'View Lane’s Lexicon source')}
                title={t('Sumber Lane’s Lexicon', 'Lane’s Lexicon source')}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsLexiconOpen(!isLexiconOpen)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] border border-hairline text-ink-secondary transition-colors hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label={isLexiconOpen ? t('Tutup leksikon', 'Close lexicon') : t('Buka leksikon', 'Open lexicon')}
                title={isLexiconOpen ? t('Tutup leksikon', 'Close lexicon') : t('Buka leksikon', 'Open lexicon')}
              >
                {isLexiconOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isLexiconOpen ? (
            lexical.senses.length > 0 ? (
              <div className="space-y-3">
                <p className="text-base leading-relaxed text-ink-secondary">{lexical.isRootEntry ? t('Ini entri akar. Tidak semua maknanya berlaku untuk kata dalam ayat ini.', 'This is a root entry. Not every sense applies to the selected word in this verse.') : t('Definisi kamus asli ditampilkan dalam bahasa Inggris. Pemetaan entri dan transkripsi digital dapat mengandung kesalahan.', 'Original dictionary definitions are in English. Entry matching and digital transcription may contain errors.')}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-ink-secondary">
                  <span className="font-semibold text-ink-secondary">
                    {lexical.rootArabic ? `${t('Akar', 'Root')}: ${lexical.rootArabic} · ` : ''}
                    Edward William Lane (1863):
                  </span>
                  <span>{t('Teks asli · English', 'Original text · English')}</span>
                </div>
                {relevantLaneSenseIndex >= 0 && (
                  <p className="border-s-2 border-primary py-2 ps-4 text-sm leading-relaxed text-ink-secondary sm:text-base">
                    {t(`Makna #${relevantLaneSenseIndex + 1} merujuk QS.`, `Sense #${relevantLaneSenseIndex + 1} references Quran`)} {resolvedSurahNumber}:{resolvedAyahNumber}.
                  </p>
                )}

                {lexical.senses.map((sense, idx) => {
                  const tokens = parseLexiconSenseTokens(sense.text);
                  const isRelevant = idx === relevantLaneSenseIndex;

                  return (
                    <details
                      key={idx}
                      open={isRelevant}
                      className={`group py-3 ${isRelevant ? 'border-s-2 border-primary ps-4' : 'border-b border-hairline'}`}
                    >
                      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-base font-medium text-ink-primary">
                        <span className="flex items-center gap-2">
                          <span>{t(`Makna #${idx + 1}`, `Sense #${idx + 1}`)}</span>
                          {isRelevant && <span className="text-sm text-primary">{t('Ayat ini', 'This verse')}</span>}
                        </span>
                        <span className="flex items-center gap-2 text-sm text-ink-secondary">
                          {sense.citation.volume
                            ? language === 'id' ? `Bagian ${sense.citation.volume}, hlm. ${sense.citation.page}` : `Part ${sense.citation.volume}, p. ${sense.citation.page}`
                            : language === 'id' ? `hlm. ${sense.citation.page}` : `p. ${sense.citation.page}`}
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </span>
                      </summary>

                      <div className="mt-3 max-w-4xl text-lg leading-relaxed text-ink-primary font-serif select-text sm:text-xl sm:leading-[1.8]">
                        {tokens.map((token, tIdx) => {
                          if (token.type === 'arabic') {
                            return (
                              <bdi
                                key={tIdx}
                                className="font-arabic inline-block px-1 text-xl font-semibold text-ink-primary align-baseline sm:text-2xl"
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
                <p className="font-bold text-ink-primary">{t('Kajian Leksikografi & Morfologi', 'Lexicography & morphology')}</p>
                <p>{t('Definisi kamus belum terindeks untuk kata ini.', 'No dictionary definition is indexed for this word yet.')}</p>
              </div>
            )
          ) : (
            <button
              onClick={() => setIsLexiconOpen(true)}
              className={`flex min-h-11 w-full items-center justify-between gap-3 border border-hairline bg-canvas-soft px-4 py-3 text-sm font-medium text-ink-secondary transition-colors hover:bg-canvas-page hover:text-ink-primary ${classic ? 'rounded-[var(--radius-control)]' : 'rounded-none'} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary`}
            >
              <span>
                {relevantLaneSenseIndex >= 0
                  ? t(
                    `Baca makna #${relevantLaneSenseIndex + 1} yang dirujuk ayat ini · ${lexical.senses.length} makna · Lane · English`,
                    `Read sense #${relevantLaneSenseIndex + 1} cited for this verse · ${lexical.senses.length} senses · Lane · English`
                  )
                  : t(
                    `Baca ${lexical.senses.length} definisi Lane · English`,
                    `Read ${lexical.senses.length} Lane definitions · English`
                  )}
              </span>
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
        sources={displayProvenance}
        initialSourceId={selectedSourceId}
      />
    </div>
  );
}
