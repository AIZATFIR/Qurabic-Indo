'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import type { RootDetailModel } from '@/lib/morphology/canonical-service';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { SOURCES_REGISTRY } from '@/lib/data/sources';
import { transliterateRootArabic } from '@/lib/morphology/transliteration';
import { fetchRootOccurrences } from '@/lib/api/root-occurrences';
import { fetchRootDetail } from '@/lib/api/root-detail-client';
import { getRootEntryLoadState } from '@/lib/api/root-entry-load-state';
import { filterOtherArabicForms, type ArramoozForm } from '@/lib/lexicon/arramooz-shared';
import { parseLexiconSenseTokens } from '@/lib/lexicon/lexicon-formatter';
import TajRootFormsPanel from '@/components/TajRootFormsPanel';

export interface RootLemmaSample {
  coordinate: string;
  formArabic: string;
  verbForm?: string;
  meaningIndo?: string;
  meaningEnglish?: string;
  qabasLemmaId?: string;
}

function LaneSourceText({ text, className }: { text: string; className: string }) {
  return (
    <p lang="en" className={className}>
      {parseLexiconSenseTokens(text).map((token, index) => token.type === 'arabic'
        ? <bdi key={index} lang="ar" dir="rtl" className="font-arabic text-xl align-baseline">{token.content}</bdi>
        : <span key={index}>{token.content}</span>)}
    </p>
  );
}

function lanePreview(text: string, limit = 760): string {
  const source = text.trim();
  if (source.length <= limit) return source;
  const boundary = source.lastIndexOf(' ', limit);
  return `${source.slice(0, boundary > limit * 0.75 ? boundary : limit).trimEnd()}…`;
}

interface RootDetailViewProps {
  root: RootDetailModel;
  lemmaSamples: Record<string, RootLemmaSample>;
}

export default function RootDetailView({ root: initialRoot, lemmaSamples: initialLemmaSamples }: RootDetailViewProps) {
  const { language, t } = useLanguage();
  const { layoutMode } = useTheme();
  const classic = layoutMode === 'classic';
  const [visibleVerses, setVisibleVerses] = useState(20);
  const [familyPage, setFamilyPage] = useState(0);
  const [selectedPos, setSelectedPos] = useState<'all' | 'V' | 'N'>('all');
  const [root, setRoot] = useState(initialRoot);
  const [lemmaSamples, setLemmaSamples] = useState(initialLemmaSamples);
  const [lemmaGlossLoading, setLemmaGlossLoading] = useState(false);
  const [lemmaGlossError, setLemmaGlossError] = useState(false);
  const [retryLemmaGloss, setRetryLemmaGloss] = useState(0);
  const initialLoadState = getRootEntryLoadState(initialRoot.statistics.uniqueAyahs, initialRoot.lexicon !== undefined, initialRoot.occurrences.length);
  const [rootDataLoading, setRootDataLoading] = useState(initialLoadState.rootData);
  const [occurrencesLoading, setOccurrencesLoading] = useState(initialLoadState.occurrences);
  const [rootDataError, setRootDataError] = useState(false);
  const [occurrencesError, setOccurrencesError] = useState(false);
  const [englishTranslations, setEnglishTranslations] = useState<Record<string, string>>({});
  const [englishUnavailable, setEnglishUnavailable] = useState<Set<string>>(() => new Set());
  const [englishFailed, setEnglishFailed] = useState<Set<string>>(() => new Set());
  const [englishLoading, setEnglishLoading] = useState(false);
  const [retryEnglishTranslations, setRetryEnglishTranslations] = useState(0);
  const englishPending = useRef(new Set<string>());
  const englishAttempted = useRef(new Set<string>());
  const englishControllers = useRef(new Set<AbortController>());
  const englishMounted = useRef(false);
  const [otherForms, setOtherForms] = useState<ArramoozForm[]>([]);
  const [otherFormsTotal, setOtherFormsTotal] = useState(0);
  const [otherFormsHasMore, setOtherFormsHasMore] = useState(false);
  const [otherFormsState, setOtherFormsState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [otherFormsOpen, setOtherFormsOpen] = useState(false);
  const [showAllOtherForms, setShowAllOtherForms] = useState(false);
  const otherFormsController = useRef<AbortController | null>(null);
  const { statistics } = root;
  const { lexicon } = root;
  const meaningSource = root.meaningSource;
  const rootTransliteration = transliterateRootArabic(root.rootArabic);
  const number = (value: number) => value.toLocaleString(language === 'en' ? 'en-US' : 'id-ID');
  const lemmas = statistics.lemmaDistribution.filter((lemma) => selectedPos === 'all' || (selectedPos === 'V' ? lemma.pos === 'V' : lemma.pos !== 'V'));
  const verses = useMemo(() => {
    const unique = new Map<string, RootDetailModel['occurrences'][number]>();
    for (const occurrence of root.occurrences) {
      const key = `${occurrence.surahNumber}:${occurrence.ayahNumber}`;
      if (!unique.has(key)) unique.set(key, occurrence);
    }
    return [...unique.values()];
  }, [root.occurrences]);
  const posLabel = (pos: string) => pos === 'V' ? t("Fi'il · kata kerja", 'Verb') : pos === 'ADJ' ? t('Sifat', 'Adjective') : pos === 'PN' ? t('Nama diri', 'Proper noun') : t('Isim · nomina', 'Noun');
  const posEnglish = (pos: string) => pos === 'V' ? 'Verb' : pos === 'ADJ' ? 'Adjective' : pos === 'PN' ? 'Proper noun' : 'Noun';
  const familyLemmas = statistics.lemmaDistribution;
  const familyPageSize = 6;
  const familyPageCount = Math.ceil(familyLemmas.length / familyPageSize);
  const visibleFamilyLemmas = familyLemmas.slice(familyPage * familyPageSize, (familyPage + 1) * familyPageSize);
  const visibleSamples = visibleFamilyLemmas.flatMap((lemma) => {
    const key = `${lemma.pos}:${lemma.lemmaBw}`;
    const sample = lemmaSamples[key];
    return sample ? [{ key, sample }] : [];
  });
  const visibleGlossSignature = visibleSamples.map(({ key, sample }) => `${key}:${sample.coordinate}`).join('|');
  const firstQabasLemmaId = familyLemmas
    .map((lemma) => lemmaSamples[`${lemma.pos}:${lemma.lemmaBw}`]?.qabasLemmaId)
    .find(Boolean);
  const laneDefinition = lexicon?.entries
    .flatMap((entry) => entry.senses.map((sense) => ({ entry, sense })))
    .find(({ sense }) => Boolean(sense.englishText || sense.text));
  const hasLaneDefinition = Boolean(laneDefinition);

  useEffect(() => {
    const loadState = getRootEntryLoadState(initialRoot.statistics.uniqueAyahs, initialRoot.lexicon !== undefined, initialRoot.occurrences.length);
    const needsRootData = loadState.rootData;
    const needsOccurrences = loadState.occurrences;
    let active = true;
    const detailController = new AbortController();
    setRoot(initialRoot);
    setLemmaSamples(initialLemmaSamples);
    setRootDataLoading(needsRootData);
    setOccurrencesLoading(needsOccurrences);
    setRootDataError(false);
    setOccurrencesError(false);
    if (needsRootData) {
      fetchRootDetail<{ root: RootDetailModel; lemmaSamples: Record<string, RootLemmaSample> }>(initialRoot.id, detailController.signal)
        .then((data) => {
          if (!active) return;
          setRoot((current) => ({ ...data.root, occurrences: current.occurrences }));
          setLemmaSamples((current) => ({ ...data.lemmaSamples, ...current }));
        })
        .catch((error) => { if (active && error?.name !== 'AbortError') setRootDataError(true); })
        .finally(() => { if (active) setRootDataLoading(false); });
    }
    if (needsOccurrences) {
      fetchRootOccurrences(initialRoot.id)
        .then((occurrences) => {
          if (active) setRoot((current) => ({ ...current, occurrences }));
        })
        .catch(() => { if (active) setOccurrencesError(true); })
        .finally(() => { if (active) setOccurrencesLoading(false); });
    }

    return () => { active = false; detailController.abort(); };
  }, [initialRoot, initialLemmaSamples]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const missingSamples = visibleSamples.filter(({ sample }) => !(language === 'en' ? sample.meaningEnglish : sample.meaningIndo));
    if (!missingSamples.length) {
      setLemmaGlossLoading(false);
      return () => controller.abort();
    }
    setLemmaGlossLoading(true);
    setLemmaGlossError(false);
    const params = new URLSearchParams({
      language,
      locations: missingSamples.map(({ sample }) => sample.coordinate).join(','),
    });
    fetch(`/api/word-glosses?${params}`, { signal: controller.signal, cache: 'force-cache' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Word glosses unavailable');
        return await response.json() as { meanings?: Record<string, string> };
      })
      .then((data) => {
        if (!active) return;
        setLemmaSamples((current) => {
          const next = { ...current };
          let changed = false;
          for (const { key, sample } of missingSamples) {
            const gloss = data.meanings?.[sample.coordinate];
            if (gloss && (language === 'en' ? next[key]?.meaningEnglish : next[key]?.meaningIndo) !== gloss) {
              changed = true;
              next[key] = language === 'en'
                ? { ...next[key], meaningEnglish: gloss }
                : { ...next[key], meaningIndo: gloss };
            }
          }
          return changed ? next : current;
        });
      })
      .catch((error) => {
        if (active && error?.name !== 'AbortError') setLemmaGlossError(true);
      })
      .finally(() => { if (active) setLemmaGlossLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [initialRoot.id, language, visibleGlossSignature, retryLemmaGloss]);

  useEffect(() => {
    englishMounted.current = true;
    return () => {
      englishMounted.current = false;
      for (const controller of englishControllers.current) controller.abort();
      englishControllers.current.clear();
      englishPending.current.clear();
      englishAttempted.current.clear();
    };
  }, []);

  useEffect(() => {
    if (language !== 'en' || !verses.length) return;
    const visibleKeys = verses.slice(0, visibleVerses)
      .map((verse) => `${verse.surahNumber}:${verse.ayahNumber}`)
      .filter((key) => !englishAttempted.current.has(key));
    if (!visibleKeys.length) return;

    const batches: string[][] = [];
    for (let index = 0; index < visibleKeys.length; index += 20) batches.push(visibleKeys.slice(index, index + 20));
    setEnglishLoading(true);
    for (const key of visibleKeys) {
      englishPending.current.add(key);
      englishAttempted.current.add(key);
    }

    void (async () => {
      for (const verseKeys of batches) {
        if (!englishMounted.current) break;
        const controller = new AbortController();
        englishControllers.current.add(controller);
        try {
          const response = await fetch('/api/verse-translation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ verseKeys }),
            signal: controller.signal,
          });
          if (!response.ok) throw new Error('Translation request failed.');
          const result = await response.json() as {
            translations?: Record<string, string>;
            unavailable?: string[];
            failed?: string[];
          };
          if (!englishMounted.current) continue;
          setEnglishTranslations((current) => ({ ...current, ...(result.translations || {}) }));
          setEnglishUnavailable((current) => new Set([...current, ...(result.unavailable || [])]));
          setEnglishFailed((current) => new Set([...current, ...(result.failed || [])]));
        } catch (error) {
          if (englishMounted.current && (error as { name?: string })?.name !== 'AbortError') {
            setEnglishFailed((current) => new Set([...current, ...verseKeys]));
          }
        } finally {
          englishControllers.current.delete(controller);
          for (const key of verseKeys) englishPending.current.delete(key);
        }
      }
      if (englishMounted.current) setEnglishLoading(englishPending.current.size > 0);
    })();
  }, [language, verses, visibleVerses, retryEnglishTranslations]);

  useEffect(() => {
    setFamilyPage(0);
  }, [initialRoot.id]);

  useEffect(() => {
    otherFormsController.current?.abort();
    otherFormsController.current = null;
    setOtherForms([]);
    setOtherFormsTotal(0);
    setOtherFormsHasMore(false);
    setOtherFormsState('idle');
    setOtherFormsOpen(false);
    setShowAllOtherForms(false);
    return () => otherFormsController.current?.abort();
  }, [initialRoot.id]);

  const loadOtherForms = useCallback((offset = 0) => {
    if (otherFormsController.current) return;
    const controller = new AbortController();
    otherFormsController.current = controller;
    setOtherFormsState('loading');
    fetch(`/api/arramooz/search?root=${encodeURIComponent(root.rootArabic)}&offset=${offset}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Request failed')))
      .then((payload) => {
        const group = Array.isArray(payload.groups) ? payload.groups[0] : undefined;
        const page = Array.isArray(group?.forms) ? group.forms : [];
        setOtherForms((current) => offset ? [...current, ...page] : page);
        setOtherFormsTotal(Number(group?.total) || 0);
        setOtherFormsHasMore(group?.hasMore === true);
        setOtherFormsState('done');
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setOtherFormsState('error');
      })
      .finally(() => {
        if (otherFormsController.current === controller) otherFormsController.current = null;
      });
  }, [root.rootArabic]);

  useEffect(() => {
    if (rootDataLoading || hasLaneDefinition || otherFormsState !== 'idle') return;
    setOtherFormsOpen(true);
    loadOtherForms();
  }, [rootDataLoading, hasLaneDefinition, otherFormsState, loadOtherForms]);

  return (
    <div className={`mx-auto max-w-6xl px-5 py-8 font-sans sm:px-8 sm:py-12 ${classic ? 'space-y-14 pb-28' : 'space-y-12 pb-24'}`}>
      <Link href="/morfologi" className="inline-flex min-h-11 items-center gap-2 text-base text-primary hover:underline underline-offset-4 focus-visible:outline-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('Kembali ke indeks akar', 'Back to the root index')}</Link>
      {rootDataLoading && <p role="status" className="text-base text-ink-secondary">{t('Memuat data akar dan kamus…', 'Loading root and dictionary data…')}</p>}
      {rootDataError && <p role="alert" className="text-base text-ink-secondary">{t('Data lengkap akar belum termuat. Coba muat ulang halaman.', 'The full root entry could not be loaded. Please reload the page.')}</p>}
      {classic ? (
        <header className="rounded-3xl border border-hairline bg-canvas-surface px-6 py-8 text-center shadow-subtle sm:px-10 sm:py-10">
          <h1 className="font-arabic text-6xl leading-relaxed text-primary sm:text-8xl" lang="ar" dir="rtl">{root.rootArabic}</h1>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-primary">{rootTransliteration}</p>
          <dl className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-x-7 gap-y-3 text-sm tabular-nums sm:gap-x-10">
            {[
              [t('Kemunculan', 'Occurrences'), number(statistics.totalOccurrences)],
              [t('Ayat', 'Verses'), number(statistics.uniqueAyahs)],
              [t('Surah', 'Surahs'), number(statistics.uniqueSurahs)],
              [t('Lemma', 'Lemmas'), number(statistics.uniqueLemmas)],
            ].map(([label, value]) => <div key={label} className="flex items-baseline gap-1.5"><dd className="font-semibold text-ink-primary">{rootDataLoading ? '…' : value}</dd><dt className="text-ink-secondary">{label}</dt></div>)}
          </dl>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Data akar, lemma, dan frekuensi berasal dari anotasi Quranic Arabic Corpus (University of Leeds). Kutipan Lane ditampilkan sebagai sumber kamus tersendiri.', 'Root, lemma, and frequency data come from the Quranic Arabic Corpus (University of Leeds). Lane quotations are shown separately as dictionary sources.')}</p>
          <nav aria-label={t('Bagian entri akar', 'Root entry sections')} className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1 text-base font-medium text-primary">
            <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#leksikon">{t('Leksikon Lane', "Lane's Lexicon")}</a>
            <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#distribusi">{t('Distribusi', 'Distribution')}</a>
            <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#bentuk">{t('Bentuk kata', 'Word forms')}</a>
            <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#concordance">{t('Ayat penggunaan', 'Verse occurrences')}</a>
          </nav>
        </header>
      ) : (
        <header>
          <h1 className="text-2xl font-semibold text-ink-primary">{t('Akar kata', 'Root')}: <span lang="ar" dir="rtl" className="mt-3 block font-arabic text-5xl leading-loose font-normal sm:text-6xl">{root.rootArabic}</span></h1>
          <p className="mt-2 text-lg text-ink-secondary">{rootTransliteration}</p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Data akar, lemma, dan frekuensi berikut berasal dari anotasi Quranic Arabic Corpus (University of Leeds). Kutipan definisi Lane ditampilkan terpisah agar arti leksikal tidak tercampur dengan pemakaian kata di ayat.', 'Root, lemma, and frequency data below come from Quranic Arabic Corpus (University of Leeds). Lane quotations are kept separate so lexical definitions are not confused with a word’s use in a verse.')}</p>
        </header>
      )}

      <section aria-labelledby="root-meaning-heading" className={`scroll-mt-24 space-y-5 ${classic ? 'rounded-3xl border border-hairline bg-canvas-surface p-6 shadow-subtle sm:p-8' : 'border-y border-hairline py-7'}`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-hairline pb-4">
          <BookOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          <div>
            <h2 id="root-meaning-heading" className="text-xl font-semibold text-ink-primary">{t('Makna leksikal dan sumber', 'Lexical meaning and sources')}</h2>
            <p className="mt-1 text-sm text-ink-secondary">{meaningSource
              ? `${language === 'id' ? 'Glos bentuk korpus · ' : 'Corpus word-form gloss · '}${meaningSource.name}`
              : laneDefinition
              ? language === 'id' ? 'Kutipan asli Lane · bahasa Inggris · belum diterjemahkan' : 'Original English dictionary entry · Lane, 1863'
              : root.coreMeaningEnglish
                ? t('Ringkasan Quran bil-Quran · English · asal penulisan dan telaah per entri tidak dijelaskan', 'Quran bil-Quran summary · English · authorship and entry-level review are undocumented')
                : t('Definisi dari sumber leksikal belum tersedia', 'No sourced dictionary definition is indexed')}</p>
          </div>
        </div>
        {meaningSource && root.coreMeaningEnglish ? (
          <div className="max-w-4xl space-y-3">
            <p lang="en" className="text-lg leading-relaxed text-ink-primary">{root.coreMeaningEnglish}</p>
            {language === 'id' && root.coreMeaning && <p lang="id" className="text-base leading-relaxed text-ink-primary">{root.coreMeaning}</p>}
            <p className="text-base leading-relaxed text-ink-secondary">{language === 'id' ? meaningSource.noteIndonesian : meaningSource.noteEnglish}</p>
            <a href={meaningSource.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <span>{`${language === 'id' ? 'Buka sumber · ' : 'Open source · '}${meaningSource.name}`}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            {meaningSource.relatedSourceUrl && <a href={meaningSource.relatedSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
              <span>{language === 'id' ? meaningSource.relatedSourceLabelIndonesian : meaningSource.relatedSourceLabelEnglish}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>}
          </div>
        ) : laneDefinition ? (
          <div className="max-w-4xl space-y-2">
            <p className="text-base font-medium text-ink-secondary">Edward William Lane, <i>An Arabic-English Lexicon</i></p>
            <LaneSourceText text={lanePreview(laneDefinition.sense.englishText || laneDefinition.sense.text)} className="text-lg leading-relaxed text-ink-primary" />
            <p className="text-base text-ink-secondary">{language === 'en' ? `Book I, Part ${laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, p. ${laneDefinition.sense.citation?.page || laneDefinition.entry.page}` : `Buku I, Bagian ${laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, hlm. ${laneDefinition.sense.citation?.page || laneDefinition.entry.page}`}</p>
          </div>
        ) : root.coreMeaningEnglish ? (
          <div className="max-w-4xl space-y-3">
            <p lang="en" className="text-lg leading-relaxed text-ink-primary">{root.coreMeaningEnglish}</p>
            {language === 'id' && root.coreMeaning && <p lang="id" className="text-base leading-relaxed text-ink-primary">{root.coreMeaning}</p>}
            <p className="text-base leading-relaxed text-ink-secondary">{meaningSource
              ? language === 'id' ? meaningSource.noteIndonesian : meaningSource.noteEnglish
              : t('Dataset Quran bil-Quran mengaitkan ringkasan akar dengan Lane dan keluarga semantik dengan Lane serta Maqāyīs al-Lugha. Tidak ada rujukan halaman per akar atau penjelasan apakah ringkasan ditulis atau ditelaah manusia maupun AI. Cocokkan dengan kutipan Lane di bawah jika tersedia.', 'The Quran bil-Quran dataset credits root summaries to Lane and semantic families to Lane and Maqāyīs al-Lugha. It gives no page citation per root and does not say whether summaries were written or reviewed by people or AI. Compare with the Lane excerpt below when available.')}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <a href={meaningSource?.url || SOURCES_REGISTRY.quranBilQuran.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <span>{meaningSource
                  ? `${language === 'id' ? 'Buka sumber · ' : 'Open source · '}${meaningSource.name}`
                  : t('Buka proyek sumber · Quran bil-Quran', 'Open source project · Quran bil-Quran')}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
              {meaningSource?.relatedSourceUrl && <a href={meaningSource.relatedSourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                <span>{language === 'id' ? meaningSource.relatedSourceLabelIndonesian : meaningSource.relatedSourceLabelEnglish}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>}
            </div>
          </div>
        ) : (
          <p className="max-w-4xl text-base leading-relaxed text-ink-secondary">{t('Definisi akar dari sumber kamus belum tersedia pada indeks lokal.', 'A sourced root definition is not available in the local index.')}</p>
        )}
        {laneDefinition && root.coreMeaningEnglish && !meaningSource && <details className="max-w-4xl border-l-2 border-primary/40 pl-4 sm:pl-5">
          <summary className="min-h-11 cursor-pointer py-2 text-base font-medium text-ink-secondary focus-visible:outline-primary">{t('Buka ringkasan dataset · proses penulisan tidak terdokumentasi', 'Open dataset summary · authorship is undocumented')}</summary>
          <p lang="en" className="py-2 text-base leading-relaxed text-ink-primary">{root.coreMeaningEnglish}</p>
          {language === 'id' && root.coreMeaning && <p lang="id" className="text-base leading-relaxed text-ink-primary">{root.coreMeaning}</p>}
          <p className="text-base leading-relaxed text-ink-secondary">{t('Quran bil-Quran mengaitkan ringkasan ini dengan Lane, tetapi tidak mencantumkan rujukan halaman per akar atau menjelaskan apakah ringkasan ditulis atau ditelaah manusia maupun AI.', 'Quran bil-Quran credits this summary to Lane, but gives no root-level page citation and does not say whether people or AI wrote or reviewed it.')}</p>
          <a href={SOURCES_REGISTRY.quranBilQuran.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            <span>{t('Buka proyek sumber · Quran bil-Quran', 'Open source project · Quran bil-Quran')}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </details>}
        {meaningSource && laneDefinition && <details className="max-w-4xl border-l-2 border-primary/40 pl-4 sm:pl-5">
          <summary className="min-h-11 cursor-pointer py-2 text-base font-medium text-ink-secondary focus-visible:outline-primary">{t('Baca entri Lane selengkapnya · bahasa Inggris', 'Read the Lane entry · English')}</summary>
          <p className="text-sm font-medium text-ink-secondary">Edward William Lane, <i>An Arabic-English Lexicon</i></p>
          <LaneSourceText text={laneDefinition.sense.englishText || laneDefinition.sense.text} className="py-2 text-base leading-relaxed text-ink-primary" />
          <p className="text-sm text-ink-secondary">{language === 'en' ? `Book I, Part ${laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, p. ${laneDefinition.sense.citation?.page || laneDefinition.entry.page}` : `Buku I, Bagian ${laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, hlm. ${laneDefinition.sense.citation?.page || laneDefinition.entry.page}`}</p>
        </details>}
        {laneDefinition && !meaningSource && <details className="max-w-4xl border-l-2 border-primary/40 pl-4 sm:pl-5">
          <summary className="min-h-11 cursor-pointer py-2 text-base font-medium text-ink-secondary focus-visible:outline-primary">{t('Baca kutipan Lane selengkapnya · bahasa Inggris', 'Read the full Lane excerpt · English')}</summary>
          <p className="text-sm font-medium text-ink-secondary">Edward William Lane, <i>An Arabic-English Lexicon</i></p>
          <LaneSourceText text={laneDefinition.sense.englishText || laneDefinition.sense.text} className="py-2 text-base leading-relaxed text-ink-primary" />
          <p className="text-sm text-ink-secondary">{language === 'en' ? `Book I, Part ${laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, p. ${laneDefinition.sense.citation?.page || laneDefinition.entry.page}` : `Buku I, Bagian ${laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, hlm. ${laneDefinition.sense.citation?.page || laneDefinition.entry.page}`}</p>
        </details>}
        {firstQabasLemmaId && <a href={`https://sina.birzeit.edu/qabas/lemma/${firstQabasLemmaId}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <span>{t('Lihat lema terkait di Qabas · Birzeit', 'Open a related Qur’anic lemma in Qabas · Birzeit')}</span><ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>}
        {root.classicalArabicExcerpt && <details className="border-l-2 border-primary/40 pl-4 sm:pl-5">
          <summary className="min-h-11 cursor-pointer py-2 text-base font-medium text-ink-secondary focus-visible:outline-primary">{t('Buka kutipan Arab · Al-Mufradat karya al-Raghib', 'Open Arabic excerpt · al-Raghib’s Al-Mufradat')}</summary>
          <p lang="ar" dir="rtl" className="max-h-48 overflow-y-auto whitespace-pre-line break-words py-2 text-lg leading-9 text-ink-primary">{root.classicalArabicExcerpt}</p>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-secondary">Al-Raghib al-Isfahani, <i>Al-Mufradat fi Gharib al-Qur’an</i>. {t('Ini kutipan Arab dari dataset Quran bil-Quran; sebagian kutipan terpotong dan tidak disertai nomor halaman per akar. Bukan teks entri lengkap.', 'This Arabic excerpt comes from the Quran bil-Quran dataset; some excerpts are truncated and no root-level page citation is provided. It is not the complete dictionary entry.')}</p>
          <a href={SOURCES_REGISTRY.quranBilQuran.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {t('Periksa dataset sumber', 'Open the source dataset')}<ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </details>}
        {rootDataLoading && <p role="status" className="text-base text-ink-secondary">{t('Memuat kutipan leksikon Lane…', 'Loading the Lane lexicon entry…')}</p>}
      </section>

      {familyLemmas.length > 0 && <section aria-labelledby="word-family-heading" className={`scroll-mt-24 space-y-5 ${classic ? 'border-b border-hairline pb-10' : 'border-b border-hairline pb-8'}`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="word-family-heading" className="text-2xl font-semibold tracking-tight text-ink-primary">{t('Keluarga kata dalam Al-Qur’an', 'Word family in the Quran')}</h2>
            <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Lemma yang berbagi akar ini, diurutkan berdasarkan frekuensi Quranic Arabic Corpus. Glos per kata berasal dari Quran.com dan bukan definisi akar. Pilih bentuk untuk melihat ayatnya.', 'Lemmas sharing this root, ordered by Quranic Arabic Corpus frequency. Word glosses come from Quran.com and are not root definitions. Select a form to see its verse.')}</p>
          </div>
          <span className="text-sm text-ink-secondary">QAC · {number(statistics.uniqueLemmas)} {t('lemma', 'lemmas')}</span>
        </div>
        <div className="overflow-x-auto pb-2" aria-label={t('Diagram keluarga kata', 'Word family diagram')}>
          <div className="relative min-w-[42rem] px-4 pb-3 pt-2">
            <svg aria-hidden="true" viewBox="0 0 960 112" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-12 h-20 w-full text-primary/45">
              {visibleFamilyLemmas.map((lemma, index) => {
                const x = ((index + 0.5) / visibleFamilyLemmas.length) * 960;
                return <path key={`${lemma.pos}:${lemma.lemmaBw}`} d={`M480 2 C480 42 ${x} 36 ${x} 108`} fill="none" stroke="currentColor" strokeWidth="2" />;
              })}
              <circle cx="480" cy="3" r="5" fill="currentColor" />
            </svg>
            <div className="relative mx-auto mb-6 flex w-fit items-center gap-3 border border-primary/25 bg-primary/10 px-4 py-2" style={{ borderRadius: 'var(--radius-control)' }}>
              <span lang="ar" dir="rtl" className="font-arabic text-2xl text-primary">{root.rootArabic}</span>
              <span className="text-sm font-medium text-ink-primary">{rootTransliteration}</span>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${visibleFamilyLemmas.length}, minmax(0, 1fr))` }}>
              {visibleFamilyLemmas.map((lemma) => {
                const sample = lemmaSamples[`${lemma.pos}:${lemma.lemmaBw}`];
                const indoMeaning = sample?.meaningIndo?.trim();
                const englishMeaning = sample?.meaningEnglish?.trim();
                const displayMeaning = language === 'en' ? englishMeaning : indoMeaning || englishMeaning;
                const meaningLanguage = language === 'en' || !indoMeaning ? 'en' : 'id';
                return <Link key={`${lemma.pos}:${lemma.lemmaBw}`} href={sample ? `/kata/${encodeURIComponent(sample.formArabic || lemma.lemmaArabic)}?location=${encodeURIComponent(sample.coordinate)}` : '#bentuk'} className="flex min-h-28 flex-col items-center justify-center border border-hairline bg-canvas-surface px-2 py-3 text-center transition-colors hover:border-primary/50 hover:bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" style={{ borderRadius: 'var(--radius-control)' }}>
                  <span lang="ar" dir="rtl" className="font-arabic text-2xl leading-relaxed text-ink-primary">{lemma.lemmaArabic}</span>
                  <span className="mt-1 text-xs text-ink-secondary">{t(posLabel(lemma.pos), posEnglish(lemma.pos))} · {number(lemma.count)}×</span>
                  {displayMeaning
                    ? <span lang={meaningLanguage} className="mt-2 text-sm leading-snug text-ink-secondary">{displayMeaning}{language === 'id' && !indoMeaning ? ' · English' : ''}</span>
                    : <span className="mt-2 text-sm leading-snug text-ink-mute">{lemmaGlossLoading ? t('Memuat glos…', 'Loading gloss…') : t('Glos belum tersedia', 'Gloss unavailable')}</span>}
                </Link>;
              })}
            </div>
          </div>
        </div>
        {lemmaGlossError && <div className="flex flex-wrap items-center gap-3" role="alert">
          <p className="text-sm text-ink-secondary">{t('Glos belum termuat; data akar dan keluarga kata tetap tersedia.', 'Word glosses did not load; root and word-family data remain available.')}</p>
          <button type="button" onClick={() => setRetryLemmaGloss((value) => value + 1)} className="min-h-11 text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline-primary">{t('Coba lagi', 'Retry')}</button>
        </div>}
        {familyPageCount > 1 && <nav aria-label={t('Halaman keluarga kata', 'Word family pages')} className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink-secondary">{number(familyPage * familyPageSize + 1)}–{number(Math.min((familyPage + 1) * familyPageSize, familyLemmas.length))} {t('dari', 'of')} {number(familyLemmas.length)} {t('lemma', 'lemmas')}</p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={familyPage === 0} onClick={() => setFamilyPage((page) => Math.max(0, page - 1))} className="min-h-11 rounded-sm border border-hairline px-4 text-base text-primary disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('Sebelumnya', 'Previous')}</button>
            <button type="button" disabled={familyPage + 1 >= familyPageCount} onClick={() => setFamilyPage((page) => Math.min(familyPageCount - 1, page + 1))} className="min-h-11 rounded-sm border border-hairline px-4 text-base text-primary disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('Berikutnya', 'Next')}</button>
          </div>
        </nav>}
      </section>}

      <section aria-labelledby="other-root-forms-heading" className={`scroll-mt-24 space-y-4 ${classic ? 'border-b border-hairline pb-10' : 'border-b border-hairline pb-8'}`}>
        <div>
          <h2 id="other-root-forms-heading" className="text-2xl font-semibold text-ink-primary">{t('Bentuk lain yang tercatat', 'Other recorded forms')}</h2>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Bentuk Arramooz untuk akar ini mencakup kata yang tidak muncul di Al-Qur’an. Definisi tetap dalam bahasa Arab asli dan tidak tersedia untuk setiap bentuk.', 'Arramooz forms for this root include words that do not occur in the Quran. Definitions remain in the original Arabic and are not available for every form.')}</p>
        </div>
        <a href="https://github.com/linuxscout/arramooz" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4 focus-visible:outline-primary">Arramooz · GPL-2 <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
        <button type="button" aria-expanded={otherFormsOpen} onClick={() => {
          const open = !otherFormsOpen;
          setOtherFormsOpen(open);
          if (open && otherFormsState === 'idle') loadOtherForms(otherForms.length);
          if (!open && otherFormsState === 'loading') {
            otherFormsController.current?.abort();
            otherFormsController.current = null;
            setOtherFormsState('idle');
          }
        }} className="min-h-11 text-base font-medium text-primary hover:underline focus-visible:outline-primary">{otherFormsOpen ? t('Sembunyikan bentuk', 'Hide forms') : t('Tampilkan bentuk tambahan', 'Show additional forms')}</button>
        {otherFormsOpen && otherFormsState === 'loading' && <p role="status" className="text-base text-ink-secondary">{t('Memuat data Arramooz…', 'Loading Arramooz data…')}</p>}
        {otherFormsOpen && otherFormsState === 'error' && otherForms.length === 0 && <div className="flex flex-wrap items-center gap-3 text-base"><p role="alert" className="text-ink-secondary">{t('Data bentuk belum termuat.', 'The forms could not be loaded.')}</p><button type="button" className="text-primary underline" onClick={() => loadOtherForms(0)}>{t('Coba lagi', 'Retry')}</button></div>}
        {otherFormsOpen && otherFormsState === 'done' && otherForms.length === 0 && <p className="text-base text-ink-secondary">{t('Belum ada bentuk tambahan yang tercatat untuk akar ini.', 'No additional forms are indexed for this root.')}</p>}
        {otherFormsOpen && (otherFormsState === 'done' || otherFormsState === 'loading' || otherFormsState === 'error') && otherForms.length > 0 && (() => {
          const forms = filterOtherArabicForms(otherForms, statistics.lemmaDistribution.map((lemma) => lemma.lemmaArabic));
          const visible = showAllOtherForms ? forms : forms.slice(0, 12);
          return <>
            {otherFormsState === 'error' && <p role="alert" className="text-base text-ink-secondary">{t('Bentuk berikutnya belum termuat. Data yang sudah dimuat tetap tersedia.', 'The next forms did not load. Previously loaded forms are still available.')}</p>}
            <p className="text-sm text-ink-secondary">{t(`${number(otherForms.length)} dari ${number(otherFormsTotal)} bentuk termuat`, `${number(otherForms.length)} of ${number(otherFormsTotal)} forms loaded`)}</p>
            {forms.length ? <ul className="divide-y divide-hairline border-y border-hairline">
              {visible.map((form, index) => <li key={`${form.pos}:${form.arabic}:${index}`} className="flex flex-wrap items-start justify-between gap-x-6 gap-y-1 py-3">
                <div><p lang="ar" dir="rtl" className="font-arabic text-2xl leading-relaxed text-ink-primary">{form.arabic}</p><p className="text-sm text-ink-secondary">{form.pos === 'verb' ? t("Fi'il", 'Verb') : t('Isim', 'Noun')}{form.wordType ? ` · ${form.wordType}` : ''}{form.wazn ? ` · ${form.wazn}` : ''}</p></div>
                {form.definition && <p lang="ar" dir="rtl" className="max-w-prose text-base leading-relaxed text-ink-secondary">{form.definition}</p>}
              </li>)}
            </ul> : <p className="text-base text-ink-secondary">{t('Belum ada bentuk tambahan yang tercatat untuk akar ini.', 'No additional forms are indexed for this root.')}</p>}
            {forms.length > 12 && <button type="button" onClick={() => setShowAllOtherForms((value) => !value)} className="min-h-11 text-base text-primary underline underline-offset-4">{showAllOtherForms ? t('Tampilkan lebih sedikit', 'Show fewer') : t(`Tampilkan ${forms.length - 12} bentuk lagi`, `Show ${forms.length - 12} more forms`)}</button>}
            {otherFormsHasMore && <button type="button" disabled={otherFormsState === 'loading'} onClick={() => loadOtherForms(otherForms.length)} className="min-h-11 text-base text-primary underline underline-offset-4 disabled:opacity-60">{otherFormsState === 'loading' ? t('Memuat…', 'Loading…') : otherFormsState === 'error' ? t('Coba lagi', 'Retry') : t(`Muat ${number(Math.min(60, otherFormsTotal - otherForms.length))} bentuk berikutnya`, `Load ${number(Math.min(60, otherFormsTotal - otherForms.length))} more forms`)}</button>}
            <p className="text-sm text-ink-secondary">{t('Bentuk dan definisi berasal dari Arramooz; bentuk non-Quran tetap ditampilkan dalam bahasa Arab asli.', 'Forms and definitions come from Arramooz; non-Quran forms remain in their original Arabic source.')}</p>
          </>;
        })()}
      </section>

      <TajRootFormsPanel rootArabic={root.rootArabic} />

      <section aria-labelledby="root-distribution-heading" id="distribusi" className={`scroll-mt-24 space-y-5 ${classic ? 'border-y border-hairline py-8' : ''}`}>
        <div>
          <h2 id="root-distribution-heading" className="text-2xl font-semibold text-ink-primary">{t('Peta penggunaan akar', 'Root usage')}</h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Distribusi part of speech dan lemma dihitung dari anotasi korpus; setiap bentuk dapat dibuka pada ayat contohnya.', 'Part of speech and lemma distributions come from corpus annotations; each form links to an example verse.')}</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <h3 className="mb-3 text-base font-semibold text-ink-primary">{t('Kelas kata', 'Word classes')}</h3>
            <ul className="space-y-4">
              {statistics.posDistribution.map((item) => {
                const width = statistics.totalOccurrences > 0 ? Math.max(2, (item.count / statistics.totalOccurrences) * 100) : 0;
                return <li key={item.pos}>
                  <div className="mb-1 flex justify-between gap-4 text-sm"><span className="text-ink-primary">{language === 'en' ? posEnglish(item.pos) : item.labelIndo}</span><span className="tabular-nums text-ink-secondary">{number(item.count)}</span></div>
                  <div className="h-2 overflow-hidden bg-canvas-soft" style={{ borderRadius: 'var(--radius-control)' }}><div className="h-full bg-primary" style={{ width: `${width}%` }} /></div>
                </li>;
              })}
            </ul>
          </div>
          <div>
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-base font-semibold text-ink-primary">{t('Lemma yang paling sering muncul', 'Most frequent lemmas')}</h3>
              <span className="text-sm text-ink-secondary">{t('Urutan frekuensi · QAC', 'Frequency order · QAC')}</span>
            </div>
            <ul className="grid gap-x-8 sm:grid-cols-2">
              {statistics.lemmaDistribution.slice(0, 8).map((lemma) => <li key={`${lemma.pos}:${lemma.lemmaBw}`} className="flex min-h-14 items-center justify-between gap-4 border-b border-hairline py-2">
                <span className="flex min-w-0 items-center gap-3"><span lang="ar" dir="rtl" className="shrink-0 font-arabic text-2xl leading-relaxed text-ink-primary">{lemma.lemmaArabic}</span><span className="truncate text-sm text-ink-secondary">{posLabel(lemma.pos)}</span></span>
                <span className="shrink-0 text-sm tabular-nums text-ink-secondary">{number(lemma.count)}×</span>
              </li>)}
            </ul>
          </div>
        </div>
      </section>

      <section id="leksikon" aria-labelledby="lane-heading" className={`scroll-mt-24 space-y-5 ${classic ? 'rounded-[var(--radius-surface)] bg-canvas-soft px-5 py-6 sm:px-8 sm:py-8' : ''}`}>
        <h2 id="lane-heading" className="text-2xl font-semibold text-ink-primary">Lane&apos;s Arabic-English Lexicon</h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Teks kamus asli berbahasa Inggris. Setiap entri memuat satu atau beberapa arti leksikal; tidak semuanya berlaku pada setiap ayat.', 'Original English dictionary text. Each entry contains one or more lexical senses; not every sense applies to every verse.')}</p>
        {lexicon?.entries?.length ? (
          <div className="divide-y divide-hairline border-y border-hairline">
            {lexicon.entries.map((entry, entryIndex) => (
              <details key={entry.entryId || entryIndex} open={entryIndex === 0} className="py-4">
                <summary className="cursor-pointer text-base text-ink-primary focus-visible:outline-primary">
                  <span lang="ar" dir="rtl" className="ml-2 font-arabic text-2xl leading-loose">{entry.headwordArabic}</span>{' '}
                  {entry.itype && <span>{t('Bentuk', 'Form')} {entry.itype} · </span>}
                  <span className="text-ink-secondary">{language === 'en' ? `Book I, Part ${entry.volume}, p. ${entry.page} · ${entry.senses.length} ${entry.senses.length === 1 ? 'sense' : 'senses'}` : `Buku I, Bagian ${entry.volume}, hlm. ${entry.page} · ${entry.senses.length} makna`}</span>
                </summary>
                <div className="mt-4 space-y-4 sm:pl-5">
                  {entry.senses.length ? entry.senses.map((sense, senseIndex) => (
                    <details key={sense.id || senseIndex} open={entryIndex === 0 && senseIndex === 0} className="border-t border-hairline pt-4">
                      <summary className="cursor-pointer text-base font-medium text-primary focus-visible:outline-primary">{t('Makna', 'Sense')} {senseIndex + 1} <span className="font-normal text-ink-secondary">· {language === 'en' ? `Book I, Part ${sense.citation?.volume || entry.volume}, p. ${sense.citation?.page || entry.page}` : `Buku I, Bagian ${sense.citation?.volume || entry.volume}, hlm. ${sense.citation?.page || entry.page}`}</span></summary>
                      <p lang="en" dir="auto" className="mt-4 max-w-prose whitespace-pre-line break-words text-base sm:text-lg leading-relaxed text-ink-primary">{sense.englishText || sense.text}</p>
                    </details>
                  )) : <p lang="en" dir="auto" className="max-w-prose whitespace-pre-line break-words text-base sm:text-lg leading-relaxed text-ink-primary">{entry.sourceDefinition || entry.originalText || entry.definition || t('Teks entri belum tersedia.', 'Entry text is not available.')}</p>}
                  {entry.entryUrl?.startsWith('https://') && <a href={entry.entryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base text-primary underline underline-offset-4 focus-visible:outline-primary">{t('Buka sumber entri', 'Open the source entry')}<ExternalLink className="h-4 w-4" aria-hidden="true" /><span className="sr-only">{t('(tab baru)', '(new tab)')}</span></a>}
                </div>
              </details>
            ))}
          </div>
        ) : <p className="text-base text-ink-secondary">{rootDataLoading ? t('Memuat entri Lane…', 'Loading Lane entry…') : t('Entri Lane untuk akar ini belum terindeks. Definisi kamus belum tersedia.', 'A Lane entry for this root has not been indexed. A dictionary definition is not available yet.')}</p>}
        <p className="max-w-prose text-sm leading-relaxed text-ink-secondary">{t(SOURCES_REGISTRY.laneLexicon.description, SOURCES_REGISTRY.laneLexicon.descriptionEnglish || SOURCES_REGISTRY.laneLexicon.name)}{' '}<a href={SOURCES_REGISTRY.laneLexicon.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 focus-visible:outline-primary">{t('Sumber digital Alpheios', 'Alpheios digital source')}</a>.</p>
      </section>

      <section id="bentuk" aria-labelledby="forms-heading" className={`scroll-mt-24 space-y-5 ${classic ? 'border-t border-hairline pt-8' : ''}`}>
        <h2 id="forms-heading" className="text-2xl font-semibold text-ink-primary">{t("Bentuk dalam Al-Qur'an", 'Forms in the Quran')}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Lemma dan frekuensi dari Quranic Arabic Corpus. Arti di setiap baris adalah terjemahan kata pada contoh ayat yang ditautkan, bukan definisi tunggal seluruh akar.', 'Lemmas and frequencies from Quranic Arabic Corpus. Each meaning below is the word translation in the linked example verse, not a single definition for the whole root.')}</p>
        <div className="flex flex-wrap gap-2" aria-label={t('Filter kelas kata', 'Filter word class')}>
          {(['all', 'V', 'N'] as const).map((pos) => <button key={pos} type="button" aria-pressed={selectedPos === pos} onClick={() => setSelectedPos(pos)} className={`min-h-11 rounded-sm border px-4 py-2 text-base focus-visible:outline-primary ${selectedPos === pos ? 'border-primary bg-primary text-white' : 'border-hairline text-ink-primary hover:bg-canvas-soft'}`}>{pos === 'all' ? t('Semua', 'All') : pos === 'V' ? t("Fi'il", 'Verbs') : t('Isim', 'Nouns')}</button>)}
        </div>
        <ul className="divide-y divide-hairline border-y border-hairline">
          {lemmas.map((lemma) => {
            const sample = lemmaSamples[`${lemma.pos}:${lemma.lemmaBw}`];
            const gloss = language === 'en' ? sample?.meaningEnglish : sample?.meaningIndo;
            return (
              <li key={`${lemma.pos}:${lemma.lemmaBw}`} className="py-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div><p lang="ar" dir="rtl" className="font-arabic text-3xl leading-loose text-ink-primary">{lemma.lemmaArabic}</p><p className="text-sm text-ink-secondary">{posLabel(lemma.pos)}{sample?.verbForm ? ` · ${sample.verbForm}` : ''}</p></div>
                  <p className="text-base tabular-nums text-ink-secondary">{number(lemma.count)} {t('kemunculan', 'occurrences')}</p>
                </div>
                {sample ? <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"><p className="text-base leading-relaxed text-ink-primary">{gloss || (lemmaGlossLoading ? t('Memuat glos…', 'Loading gloss…') : t('Terjemahan kata belum tersedia.', 'Word translation is not available.'))}{gloss && <span className="ml-2 text-sm text-ink-secondary">Quran.com · {sample.coordinate}</span>}</p><Link href={`/kata/${encodeURIComponent(sample.formArabic || lemma.lemmaArabic)}?location=${encodeURIComponent(sample.coordinate)}`} className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">{t('Buka kata pada ayat', 'Open word in verse')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div> : <p className="mt-3 text-base text-ink-secondary">{t('Contoh ayat belum tersedia.', 'An example verse is not available.')}</p>}
              </li>
            );
          })}
        </ul>
        {!lemmas.length && <p className="text-base text-ink-secondary">{t('Tidak ada lemma untuk filter ini.', 'There are no lemmas for this filter.')}</p>}
        <a href={`https://corpus.quran.com/qurandictionary.jsp?q=${encodeURIComponent(root.id.replace(/-/g, ''))}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base text-primary underline underline-offset-4 focus-visible:outline-primary">{t('Bandingkan di Quranic Arabic Corpus', 'Compare with Quranic Arabic Corpus')}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
      </section>

      <section id="concordance" aria-labelledby="verses-heading" className={`scroll-mt-24 space-y-5 ${classic ? 'border-t border-hairline pt-8' : ''}`}>
        <h2 id="verses-heading" className="text-2xl font-semibold text-ink-primary">{t('Ayat penggunaan', 'Verse occurrences')}</h2>
        <p className="text-base leading-relaxed text-ink-secondary">{t('Ayat Arab dan terjemahan Kemenag RI ditampilkan bersama. Bentuk akar ditandai di tiap rujukan.', 'Arabic verses and Saheeh International translations appear here. Root forms are marked in each reference.')}</p>
        {occurrencesLoading && <p role="status" className="text-base text-ink-secondary">{t('Memuat ayat penggunaan…', 'Loading verse occurrences…')}</p>}
        {occurrencesError && <p role="alert" className="text-base text-ink-secondary">{t('Ayat lengkap belum termuat. Coba muat ulang halaman.', 'Full verses could not be loaded. Please reload the page.')}</p>}
        <ol className="divide-y divide-hairline border-y border-hairline">
          {verses.slice(0, visibleVerses).map((verse) => <li key={`${verse.surahNumber}:${verse.ayahNumber}`}>
            <Link href={`/baca?surah=${verse.surahNumber}&ayah=${verse.ayahNumber}`} className="block space-y-2 py-4 text-primary hover:bg-canvas-soft focus-visible:outline-primary">
              <span className="flex flex-wrap items-center justify-between gap-3 text-base">
                <span>{language === 'en' ? 'Qur’an' : 'QS.'} {verse.surahNumber}:{verse.ayahNumber} · <span lang="ar" dir="rtl" className="font-arabic">{verse.matchedWordArabic}</span></span>
                <span className="inline-flex items-center gap-2">{t('Baca ayat', 'Read verse')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </span>
              <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose text-ink-primary">{verse.verseArabic || verse.matchedWordArabic}</p>
              {language === 'id' && verse.verseIndo && <p className="text-base leading-relaxed text-ink-secondary">{verse.verseIndo}</p>}
              {language === 'en' && (englishTranslations[`${verse.surahNumber}:${verse.ayahNumber}`]
                ? <><p lang="en" className="text-base leading-relaxed text-ink-secondary">{englishTranslations[`${verse.surahNumber}:${verse.ayahNumber}`]}</p><span className="text-sm text-ink-secondary">Saheeh International · Quran.com</span></>
                : <p className="text-sm text-ink-secondary">{englishUnavailable.has(`${verse.surahNumber}:${verse.ayahNumber}`)
                  ? t('Terjemahan Inggris tidak tersedia untuk ayat ini.', 'English translation is unavailable for this verse.')
                  : englishFailed.has(`${verse.surahNumber}:${verse.ayahNumber}`)
                    ? t('Terjemahan gagal dimuat.', 'Translation could not be loaded.')
                    : null}</p>)}
            </Link>
          </li>)}
        </ol>
        {language === 'en' && englishFailed.size > 0 && <button type="button" onClick={() => {
          for (const key of englishFailed) englishAttempted.current.delete(key);
          setEnglishFailed(new Set());
          setRetryEnglishTranslations((attempt) => attempt + 1);
        }} className="min-h-11 rounded-sm border border-hairline px-5 py-3 text-base text-primary hover:bg-canvas-soft focus-visible:outline-primary">{t('Coba lagi', 'Retry failed translations')}</button>}
        {language === 'en' && englishLoading && <p role="status" className="text-base text-ink-secondary">{t('Memuat terjemahan Inggris…', 'Loading English translations…')}</p>}
        {visibleVerses < verses.length && <button type="button" onClick={() => setVisibleVerses((count) => count + 20)} className="min-h-11 rounded-sm border border-hairline px-5 py-3 text-base text-primary hover:bg-canvas-soft focus-visible:outline-primary">{t('Tampilkan ayat lainnya', 'Show more verses')} ({number(verses.length - visibleVerses)})</button>}
        {!occurrencesLoading && !occurrencesError && !verses.length && <p className="text-base text-ink-secondary">{t('Daftar ayat belum tersedia pada indeks lokal ini.', 'Verse occurrences are not available in this local index.')}</p>}
      </section>
    </div>
  );
}
