'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import type { RootDetailModel } from '@/lib/morphology/canonical-service';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { SOURCES_REGISTRY } from '@/lib/data/sources';
import { transliterateRootArabic } from '@/lib/morphology/transliteration';

export interface RootLemmaSample {
  coordinate: string;
  formArabic: string;
  verbForm?: string;
  meaningIndo?: string;
  meaningEnglish?: string;
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
  const [selectedPos, setSelectedPos] = useState<'all' | 'V' | 'N'>('all');
  const [root, setRoot] = useState(initialRoot);
  const [lemmaSamples, setLemmaSamples] = useState(initialLemmaSamples);
  const [rootDataLoading, setRootDataLoading] = useState(initialRoot.statistics.uniqueAyahs === 0 || !initialRoot.lexicon);
  const [rootDataError, setRootDataError] = useState(false);
  const { statistics } = root;
  const { lexicon } = root;
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
  const laneDefinition = lexicon?.entries
    .flatMap((entry) => entry.senses.map((sense) => ({ entry, sense })))
    .find(({ sense }) => Boolean(sense.englishText || sense.text));

  useEffect(() => {
    if (initialRoot.statistics.uniqueAyahs > 0 && initialRoot.lexicon?.entries?.length) {
      setRoot(initialRoot);
      setLemmaSamples(initialLemmaSamples);
      setRootDataLoading(false);
      setRootDataError(false);
      return;
    }

    let active = true;
    setRootDataLoading(true);
    setRootDataError(false);
    fetch(`/api/root-detail?root=${encodeURIComponent(initialRoot.id)}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Root data unavailable')))
      .then((data) => {
        if (!active) return;
        setRoot(data.root);
        setLemmaSamples(data.lemmaSamples || {});
      })
      .catch(() => {
        if (active) setRootDataError(true);
      })
      .finally(() => {
        if (active) setRootDataLoading(false);
      });

    return () => { active = false; };
  }, [initialRoot, initialLemmaSamples]);

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
            <h2 id="root-meaning-heading" className="text-xl font-semibold text-ink-primary">{t('Makna inti akar', 'Root meaning')}</h2>
            <p className="mt-1 text-sm text-ink-secondary">{t('Ringkasan editorial Qurabic · dibantu AI', 'Qurabic editorial summary · AI-assisted')}</p>
          </div>
        </div>
        <p className="max-w-4xl text-lg leading-relaxed text-ink-primary">{root.coreMeaning || t('Ringkasan akar belum tersedia.', 'A root summary is not available yet.')}</p>
        {laneDefinition && (
          <details className="border-l-2 border-primary/50 pl-4 sm:pl-5">
            <summary className="min-h-11 cursor-pointer py-2 text-base font-medium text-ink-secondary focus-visible:outline-primary">{t('Buka kutipan asli · Lane’s Arabic-English Lexicon', 'Open original entry · Lane’s Arabic-English Lexicon')}</summary>
            <p className="mb-2 text-sm font-medium text-ink-secondary">{t('Teks sumber asli dalam bahasa Inggris', 'Original source text in English')}</p>
            <p lang="en" dir="auto" className="max-w-prose whitespace-pre-line break-words text-base leading-relaxed text-ink-primary">{laneDefinition.sense.englishText || laneDefinition.sense.text}</p>
            <p className="mt-2 text-sm text-ink-secondary">Book I, Part {laneDefinition.sense.citation?.volume || laneDefinition.entry.volume}, p. {laneDefinition.sense.citation?.page || laneDefinition.entry.page}</p>
          </details>
        )}
        {rootDataLoading && <p role="status" className="text-base text-ink-secondary">{t('Memuat kutipan leksikon Lane…', 'Loading the Lane lexicon entry…')}</p>}
      </section>

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
                  <div className="mb-1 flex justify-between gap-4 text-sm"><span className="text-ink-primary">{item.labelIndo}</span><span className="tabular-nums text-ink-secondary">{number(item.count)}</span></div>
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
        <p className="max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Teks kamus asli berbahasa Inggris. Setiap entri dan sense di bawah merupakan makna leksikal; tidak semuanya berlaku pada setiap ayat.', 'Original English dictionary text. Each entry and sense below is a lexical meaning; not every sense applies to every verse.')}</p>
        {lexicon?.entries?.length ? (
          <div className="divide-y divide-hairline border-y border-hairline">
            {lexicon.entries.map((entry, entryIndex) => (
              <details key={entry.entryId || entryIndex} open={entryIndex === 0} className="py-4">
                <summary className="cursor-pointer text-base text-ink-primary focus-visible:outline-primary">
                  <span lang="ar" dir="rtl" className="ml-2 font-arabic text-2xl leading-loose">{entry.headwordArabic}</span>{' '}
                  {entry.itype && <span>{t('Bentuk', 'Form')} {entry.itype} · </span>}
                  <span className="text-ink-secondary">Book I, Part {entry.volume}, p. {entry.page} · {entry.senses.length} {t('sense', 'senses')}</span>
                </summary>
                <div className="mt-4 space-y-4 sm:pl-5">
                  {entry.senses.length ? entry.senses.map((sense, senseIndex) => (
                    <details key={sense.id || senseIndex} open={entryIndex === 0 && senseIndex === 0} className="border-t border-hairline pt-4">
                      <summary className="cursor-pointer text-base font-medium text-primary focus-visible:outline-primary">{t('Sense', 'Sense')} {senseIndex + 1} <span className="font-normal text-ink-secondary">· Book I, Part {sense.citation?.volume || entry.volume}, p. {sense.citation?.page || entry.page}</span></summary>
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
                {sample ? <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"><p className="text-base leading-relaxed text-ink-primary">{gloss || t('Terjemahan kata belum tersedia.', 'Word translation is not available.')}<span className="ml-2 text-sm text-ink-secondary">Quran.com · {sample.coordinate}</span></p><Link href={`/kata/${encodeURIComponent(sample.formArabic || lemma.lemmaArabic)}?location=${encodeURIComponent(sample.coordinate)}`} className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">{t('Buka kata pada ayat', 'Open word in verse')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div> : <p className="mt-3 text-base text-ink-secondary">{t('Contoh ayat belum tersedia.', 'An example verse is not available.')}</p>}
              </li>
            );
          })}
        </ul>
        {!lemmas.length && <p className="text-base text-ink-secondary">{t('Tidak ada lemma untuk filter ini.', 'There are no lemmas for this filter.')}</p>}
        <a href={`https://corpus.quran.com/qurandictionary.jsp?q=${encodeURIComponent(root.id.replace(/-/g, ''))}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base text-primary underline underline-offset-4 focus-visible:outline-primary">{t('Bandingkan di Quranic Arabic Corpus', 'Compare with Quranic Arabic Corpus')}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
      </section>

      <section id="concordance" aria-labelledby="verses-heading" className={`scroll-mt-24 space-y-5 ${classic ? 'border-t border-hairline pt-8' : ''}`}>
        <h2 id="verses-heading" className="text-2xl font-semibold text-ink-primary">{t('Ayat penggunaan', 'Verse occurrences')}</h2>
        <p className="text-base leading-relaxed text-ink-secondary">{t('Buka mushaf untuk membaca ayat lengkap dan terjemahannya.', 'Open the reader for the full verse and its translation.')}</p>
        <ol className="divide-y divide-hairline border-y border-hairline">
          {verses.slice(0, visibleVerses).map((verse) => <li key={`${verse.surahNumber}:${verse.ayahNumber}`}><Link href={`/baca?surah=${verse.surahNumber}&ayah=${verse.ayahNumber}`} className="flex flex-wrap items-center justify-between gap-4 py-4 text-base text-primary hover:bg-canvas-soft focus-visible:outline-primary"><span>QS. {verse.surahNumber}:{verse.ayahNumber}</span><span lang="ar" dir="rtl" className="font-arabic text-2xl leading-loose text-ink-primary">{verse.matchedWordArabic}</span><span className="inline-flex items-center gap-2">{t('Baca ayat', 'Read verse')}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span></Link></li>)}
        </ol>
        {visibleVerses < verses.length && <button type="button" onClick={() => setVisibleVerses((count) => count + 20)} className="min-h-11 rounded-sm border border-hairline px-5 py-3 text-base text-primary hover:bg-canvas-soft focus-visible:outline-primary">{t('Tampilkan ayat lainnya', 'Show more verses')} ({number(verses.length - visibleVerses)})</button>}
        {!verses.length && <p className="text-base text-ink-secondary">{t('Daftar ayat belum tersedia pada indeks lokal ini.', 'Verse occurrences are not available in this local index.')}</p>}
      </section>
    </div>
  );
}
