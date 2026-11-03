'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import type { RootDetailModel } from '@/lib/morphology/canonical-service';
import { useLanguage } from '@/lib/context/LanguageContext';
import { SOURCES_REGISTRY } from '@/lib/data/sources';

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

export default function RootDetailView({ root, lemmaSamples }: RootDetailViewProps) {
  const { language, t } = useLanguage();
  const [visibleVerses, setVisibleVerses] = useState(20);
  const [selectedPos, setSelectedPos] = useState<'all' | 'V' | 'N'>('all');
  const { statistics, lexicon } = root;
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

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 sm:py-12 pb-24 space-y-12 font-sans">
      <Link href="/morfologi" className="inline-flex min-h-11 items-center gap-2 text-base text-primary hover:underline underline-offset-4 focus-visible:outline-primary"><ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('Kembali ke indeks akar', 'Back to the root index')}</Link>
      <header>
        <h1 className="text-2xl font-semibold text-ink-primary">{t('Akar kata', 'Root')}: <span lang="ar" dir="rtl" className="mt-3 block font-arabic text-5xl sm:text-6xl leading-loose font-normal">{root.rootArabic}</span></h1>
        <p className="mt-2 text-lg text-ink-secondary">{root.rootLatin}</p>
        <p className="mt-4 text-base leading-relaxed tabular-nums text-ink-secondary">{number(statistics.totalOccurrences)} {t('kemunculan', 'occurrences')} · {number(statistics.uniqueAyahs)} {t('ayat', 'verses')} · {number(statistics.uniqueSurahs)} {t('surah', 'surahs')} · {number(statistics.uniqueLemmas)} {t('lemma', 'lemmas')}</p>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Satu akar dapat membentuk beberapa kata dengan makna berbeda. Bandingkan definisi kamus dengan penggunaan kata pada ayatnya.', 'A root can produce several words with different meanings. Compare dictionary definitions with how each word is used in its verse.')}</p>
        <nav aria-label={t('Bagian entri akar', 'Root entry sections')} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium text-primary">
          <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#leksikon">{t('Leksikon Lane', "Lane's Lexicon")}</a>
          <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#bentuk">{t('Bentuk kata', 'Word forms')}</a>
          <a className="min-h-11 inline-flex items-center hover:underline underline-offset-4 focus-visible:outline-primary" href="#concordance">{t('Ayat penggunaan', 'Verse occurrences')}</a>
        </nav>
      </header>

      <section id="leksikon" aria-labelledby="lane-heading" className="scroll-mt-24 space-y-5">
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
        ) : <p className="text-base text-ink-secondary">{t('Entri Lane untuk akar ini belum terindeks. Definisi kamus belum tersedia.', 'A Lane entry for this root has not been indexed. A dictionary definition is not available yet.')}</p>}
        <p className="max-w-prose text-sm leading-relaxed text-ink-secondary">{t(SOURCES_REGISTRY.laneLexicon.description, SOURCES_REGISTRY.laneLexicon.descriptionEnglish || SOURCES_REGISTRY.laneLexicon.name)}{' '}<a href={SOURCES_REGISTRY.laneLexicon.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 focus-visible:outline-primary">{t('Sumber digital Alpheios', 'Alpheios digital source')}</a>.</p>
      </section>

      <section id="bentuk" aria-labelledby="forms-heading" className="scroll-mt-24 space-y-5">
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

      <section id="concordance" aria-labelledby="verses-heading" className="scroll-mt-24 space-y-5">
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
