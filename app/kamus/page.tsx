'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, BookOpen, Search } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import WordEtymologyModal from '@/components/WordEtymologyModal';
import TajRootFormsPanel from '@/components/TajRootFormsPanel';

interface ArramoozForm {
  arabic: string;
  unvocalized: string;
  pos: 'noun' | 'verb';
  wordType?: string;
  wazn?: string;
  definition?: string;
}
interface ArramoozGroup {
  root: string;
  total: number;
  truncated: boolean;
  forms: ArramoozForm[];
}
interface ParticleForm {
  word: string;
  vocalized: string;
  category: string;
  procletic: string;
  stem: string;
  encletic: string;
  tags: string;
}
interface ParticleGroup {
  lemma: string;
  total: number;
  truncated: boolean;
  offset: number;
  hasMore: boolean;
  forms: ParticleForm[];
}
interface TajLookupGroup {
  root: string;
  totalForms: number;
  matchType: 'exact-root' | 'normalized-root' | 'word-form';
  wordMatches: number;
}

function ArabicDictionaryContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { language, t } = useLanguage();
  const query = params.get('q') || '';
  const root = params.get('root') || '';
  const isSingleArabicWord = /^[\p{Script=Arabic}\u064B-\u065F\u0670\u06D6-\u06ED\u0640]+$/u.test(query.trim());
  const isArabicSearch = /^[\p{Script=Arabic}\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]+$/u.test(query.trim());
  const lookupTerm = root || query;
  const isArabicLookup = /^[\p{Script=Arabic}\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]+$/u.test(lookupTerm.trim());
  const [term, setTerm] = useState(root || query);
  const [groups, setGroups] = useState<ArramoozGroup[]>([]);
  const [totalRootMatches, setTotalRootMatches] = useState(0);
  const [hasMoreRootMatches, setHasMoreRootMatches] = useState(false);
  const [nextRootOffset, setNextRootOffset] = useState(0);
  const [loadingMoreRootMatches, setLoadingMoreRootMatches] = useState(false);
  const [rootMatchesError, setRootMatchesError] = useState(false);
  const [particleGroups, setParticleGroups] = useState<ParticleGroup[]>([]);
  const [loadingParticleLemma, setLoadingParticleLemma] = useState<string | null>(null);
  const [particlePageError, setParticlePageError] = useState<string | null>(null);
  const [tajLookupGroups, setTajLookupGroups] = useState<TajLookupGroup[]>([]);
  const [tajLookupLoading, setTajLookupLoading] = useState(false);
  const [tajLookupError, setTajLookupError] = useState(false);
  const [tajLookupTotal, setTajLookupTotal] = useState(0);
  const [tajLookupHasMore, setTajLookupHasMore] = useState(false);
  const [tajLookupNextOffset, setTajLookupNextOffset] = useState(0);
  const [tajLookupMoreLoading, setTajLookupMoreLoading] = useState(false);
  const [tajLookupMoreError, setTajLookupMoreError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [particleError, setParticleError] = useState(false);
  const [expandedRoots, setExpandedRoots] = useState<string[]>([]);
  const [expandedParticles, setExpandedParticles] = useState<string[]>([]);
  const [retry, setRetry] = useState(0);
  const [activeWordStudy, setActiveWordStudy] = useState<string | null>(null);
  const rootPageController = useRef<AbortController | null>(null);
  const particlePageController = useRef<AbortController | null>(null);
  const tajLookupPageController = useRef<AbortController | null>(null);
  const formatNumber = (value: number) => value.toLocaleString(language === 'en' ? 'en-US' : 'id-ID');

  useEffect(() => {
    setTerm(root || query);
    setActiveWordStudy(null);
  }, [root, query]);
  useEffect(() => {
    if (!root && !query) {
      tajLookupPageController.current?.abort();
      tajLookupPageController.current = null;
      particlePageController.current?.abort();
      particlePageController.current = null;
      setGroups([]);
      setTotalRootMatches(0);
      setHasMoreRootMatches(false);
      setNextRootOffset(0);
      setLoadingMoreRootMatches(false);
      setRootMatchesError(false);
      setParticleGroups([]);
      setLoadingParticleLemma(null);
      setParticlePageError(null);
      setTajLookupGroups([]);
      setTajLookupTotal(0);
      setTajLookupHasMore(false);
      setTajLookupNextOffset(0);
      setTajLookupMoreLoading(false);
      setTajLookupMoreError(false);
      setLoading(false);
      setTajLookupLoading(false);
      setError(false);
      setParticleError(false);
      setTajLookupError(false);
      return;
    }
    const controller = new AbortController();
    rootPageController.current?.abort();
    rootPageController.current = null;
    particlePageController.current?.abort();
    particlePageController.current = null;
    tajLookupPageController.current?.abort();
    tajLookupPageController.current = null;
    setLoading(true);
    setError(false);
    setParticleError(false);
    setTajLookupError(false);
    setTajLookupTotal(0);
    setTajLookupHasMore(false);
    setTajLookupNextOffset(0);
    setTajLookupMoreLoading(false);
    setTajLookupMoreError(false);
    setGroups([]);
    setTotalRootMatches(0);
    setExpandedRoots([]);
    setExpandedParticles([]);
    setHasMoreRootMatches(false);
    setNextRootOffset(0);
    setLoadingMoreRootMatches(false);
    setRootMatchesError(false);
    setParticleGroups([]);
    setLoadingParticleLemma(null);
    setParticlePageError(null);
    setTajLookupGroups([]);
    setTajLookupLoading(Boolean(!root && isArabicSearch));
    const search = root ? `root=${encodeURIComponent(root)}` : `q=${encodeURIComponent(query)}`;
    const normalizedLookupLength = lookupTerm.normalize('NFD').replace(/\p{M}/gu, '').replace(/[\u0640\s]/g, '').length;
    const arramoozRequest = isArabicLookup && normalizedLookupLength >= 2 && normalizedLookupLength <= 48
      ? fetch(`/api/arramooz/search?${search}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Arramooz search failed')))
      : Promise.resolve({ groups: [] });
    const particlesRequest = root
      ? Promise.resolve({ groups: [] })
      : fetch(`/api/arabic-stopwords/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Particle search failed')));
    const tajLookupRequest = !root && isArabicSearch
      ? fetch(`/api/taj-roots/lookup?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Root index lookup failed')))
      : Promise.resolve({ results: [] });
    Promise.allSettled([arramoozRequest, particlesRequest, tajLookupRequest])
      .then(([arramooz, particles, tajLookup]) => {
        if (controller.signal.aborted) return;
        if (arramooz.status === 'fulfilled') {
          setGroups(Array.isArray(arramooz.value.groups) ? arramooz.value.groups : []);
          setTotalRootMatches(Number(arramooz.value.totalRoots) || 0);
          setHasMoreRootMatches(!root && arramooz.value.hasMoreRoots === true);
          setNextRootOffset(Number(arramooz.value.nextRootOffset) || 0);
        } else {
          setGroups([]);
          setHasMoreRootMatches(false);
          setError(true);
        }
        if (particles.status === 'fulfilled') {
          setParticleGroups(Array.isArray(particles.value.groups) ? particles.value.groups : []);
        } else {
          setParticleGroups([]);
          setParticleError(true);
        }
        if (tajLookup.status === 'fulfilled') {
          setTajLookupGroups(Array.isArray(tajLookup.value.results) ? tajLookup.value.results : []);
          setTajLookupTotal(Number(tajLookup.value.total) || 0);
          setTajLookupHasMore(tajLookup.value.hasMore === true);
          setTajLookupNextOffset(Number(tajLookup.value.nextOffset) || 0);
        } else {
          setTajLookupGroups([]);
          setTajLookupHasMore(false);
          setTajLookupError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
          setTajLookupLoading(false);
        }
      });
    return () => {
      controller.abort();
      rootPageController.current?.abort();
      rootPageController.current = null;
      particlePageController.current?.abort();
      particlePageController.current = null;
      tajLookupPageController.current?.abort();
      tajLookupPageController.current = null;
    };
  }, [query, root, retry, isArabicSearch, isArabicLookup, lookupTerm]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = term.trim();
    if (!value) return;
    const destination = `/kamus?q=${encodeURIComponent(value)}`;
    if (`/kamus?q=${encodeURIComponent(query)}` === destination && !root) setRetry((value) => value + 1);
    else router.push(destination);
  };

  const openRoot = (value: string) => {
    setTerm(value);
    router.push(`/kamus?root=${encodeURIComponent(value)}`);
  };

  const loadMoreRootMatches = async () => {
    if (loadingMoreRootMatches || !hasMoreRootMatches || rootPageController.current) return;
    const controller = new AbortController();
    rootPageController.current = controller;
    setLoadingMoreRootMatches(true);
    setRootMatchesError(false);
    try {
      const response = await fetch(`/api/arramooz/search?q=${encodeURIComponent(query)}&offset=${nextRootOffset}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Arramooz root results could not be loaded');
      const payload = await response.json();
      if (controller.signal.aborted) return;
      const nextGroups = Array.isArray(payload.groups) ? payload.groups as ArramoozGroup[] : [];
      setGroups((current) => [...current, ...nextGroups]);
      setTotalRootMatches(Number(payload.totalRoots) || 0);
      setHasMoreRootMatches(payload.hasMoreRoots === true);
      setNextRootOffset(Number(payload.nextRootOffset) || 0);
    } catch (error) {
      if ((error as { name?: string })?.name !== 'AbortError') setRootMatchesError(true);
    } finally {
      if (rootPageController.current === controller) {
        rootPageController.current = null;
        setLoadingMoreRootMatches(false);
      }
    }
  };

  const loadMoreTajMatches = async () => {
    if (tajLookupMoreLoading || !tajLookupHasMore || tajLookupPageController.current) return;
    const controller = new AbortController();
    tajLookupPageController.current = controller;
    setTajLookupMoreLoading(true);
    setTajLookupMoreError(false);
    try {
      const params = new URLSearchParams({ q: query, offset: String(tajLookupNextOffset) });
      const response = await fetch(`/api/taj-roots/lookup?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Tāj al-ʿArūs matches could not be loaded');
      const payload = await response.json();
      if (controller.signal.aborted) return;
      if (!Array.isArray(payload.results)) throw new Error('Tāj al-ʿArūs returned invalid matches');
      setTajLookupGroups((current) => {
        const seen = new Set(current.map((item) => item.root));
        return [...current, ...payload.results.filter((item: TajLookupGroup) => !seen.has(item.root))];
      });
      setTajLookupTotal(Number(payload.total) || 0);
      setTajLookupHasMore(payload.hasMore === true);
      setTajLookupNextOffset(Number(payload.nextOffset) || 0);
    } catch (error) {
      if ((error as { name?: string })?.name !== 'AbortError') setTajLookupMoreError(true);
    } finally {
      if (tajLookupPageController.current === controller) {
        tajLookupPageController.current = null;
        setTajLookupMoreLoading(false);
      }
    }
  };

  const loadMoreParticleForms = async (lemma: string) => {
    const group = particleGroups.find((item) => item.lemma === lemma);
    if (!group?.hasMore || particlePageController.current) return;
    const controller = new AbortController();
    particlePageController.current = controller;
    setLoadingParticleLemma(lemma);
    setParticlePageError(null);
    try {
      const params = new URLSearchParams({ q: query, lemma, offset: String(group.forms.length) });
      const response = await fetch(`/api/arabic-stopwords/search?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Particle forms could not be loaded');
      const payload = await response.json();
      if (controller.signal.aborted) return;
      const next = Array.isArray(payload.groups) ? payload.groups.find((item: ParticleGroup) => item.lemma === lemma) : undefined;
      if (!next || !Array.isArray(next.forms)) throw new Error('Particle source returned no matching group');
      setExpandedParticles((current) => current.includes(lemma) ? current : [...current, lemma]);
      setParticleGroups((current) => current.map((item) => item.lemma === lemma
        ? { ...item, total: next.total, offset: next.offset, hasMore: next.hasMore, truncated: next.truncated, forms: [...item.forms, ...next.forms] }
        : item));
    } catch (error) {
      if ((error as { name?: string })?.name !== 'AbortError') setParticlePageError(lemma);
    } finally {
      if (particlePageController.current === controller) {
        particlePageController.current = null;
        setLoadingParticleLemma(null);
      }
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-5 py-8 pb-20 sm:px-8">
      <Link href="/morfologi" className="inline-flex min-h-11 items-center gap-2 text-base text-primary hover:underline underline-offset-4 focus-visible:outline-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('Kembali ke indeks akar Quran', 'Back to Quran root index')}
      </Link>
      <header className="space-y-4 border-b border-hairline pb-6">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
          <a href="https://github.com/linuxscout/arramooz" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Arramooz · GPL-2</a>
          <a href="https://github.com/linuxscout/arabicstopwords/tree/f6018e22e02067022231d4dbda0e46b4b1b7e1e7" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Arabic Stop Words · GPL-2</a>
          <a href="https://sina.birzeit.edu/qabas" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t('Cari makna di Qabas', 'Look up meanings in Qabas')}</a>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-primary">{t('Kamus kata dan partikel Arab', 'Arabic words and particles')}</h1>
        <p className="max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Cari akar dan bentuk kata Arab, termasuk kata di luar Al-Qur’an. Definisi Arramooz tetap dalam bahasa Arab asli; kata tugas dilengkapi klasifikasi bentuk dari sumber terpisah.', 'Search Arabic roots and word forms, including words outside the Quran. Arramooz definitions remain in Arabic; function words include form classifications from a separate source.')}</p>
        <form onSubmit={submit} className="flex max-w-2xl gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" aria-hidden="true" />
            <input value={term} onChange={(event) => setTerm(event.target.value)} type="search" dir="auto" aria-label={t('Cari akar atau kata Arab', 'Search Arabic root or word')} placeholder={t('Contoh: صبر atau صَبْرٌ', 'For example: صبر or صَبْرٌ')} className="min-h-12 w-full rounded-[var(--radius-control)] border border-hairline bg-canvas-surface py-3 ps-11 pe-3 text-lg text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" className="min-h-12 rounded-xl bg-primary px-5 text-base font-medium text-white hover:bg-primary-deep focus-visible:outline-primary">{t('Cari', 'Search')}</button>
        </form>
      </header>

      <p className="text-sm text-ink-secondary">{language === 'id'
        ? 'Akar dan bentuk kata bersumber dari Arramooz. Bentuk partikel dilengkapi klasifikasi morfologi Arabic Stop Words; klasifikasi bukan definisi makna.'
        : 'Roots and forms come from Arramooz. Particle forms include morphology classifications from Arabic Stop Words; classifications are not lexical definitions.'}</p>
      {root && <TajRootFormsPanel rootArabic={root} />}
      {isSingleArabicWord && <button type="button" onClick={() => setActiveWordStudy(query.trim())} className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        {t('Bedah kata yang dicari', 'Study searched word')}: <bdi className="ms-1 font-arabic text-base" dir="rtl">{query}</bdi>
      </button>}

      {loading && <p role="status" className="py-8 text-base text-ink-secondary">{t('Mencari kamus…', 'Searching dictionary…')}</p>}
      {particleError && !error && <div role="status" className="flex flex-wrap items-center gap-3 text-sm"><p className="text-ink-secondary">{t('Klasifikasi partikel belum dapat dimuat.', 'Particle classifications could not be loaded.')}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="text-primary underline">{t('Coba lagi', 'Retry')}</button></div>}
      {tajLookupLoading && <p role="status" className="text-sm text-ink-secondary">{t('Mencari bentuk dan akar di indeks Tāj al-ʿArūs…', 'Searching forms and roots in the Tāj al-ʿArūs index…')}</p>}
      {tajLookupError && <div role="status" className="flex flex-wrap items-center gap-3 text-sm"><p className="text-ink-secondary">{t('Indeks bentuk belum dapat dimuat.', 'The root form index could not be loaded.')}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="text-primary underline">{t('Coba lagi', 'Retry')}</button></div>}
      {error && <div role="alert" className="flex flex-wrap items-center gap-3 py-6 text-base"><p className="text-ink-secondary">{t('Kamus belum dapat dimuat.', 'The dictionary could not be loaded.')}</p><button type="button" onClick={() => setRetry((value) => value + 1)} className="text-primary underline">{t('Coba lagi', 'Retry')}</button></div>}
      {!loading && !tajLookupLoading && !error && !tajLookupError && (query || root) && groups.length === 0 && particleGroups.length === 0 && tajLookupGroups.length === 0 && <p className="py-8 text-base text-ink-secondary">{t('Tidak ada bentuk yang cocok. Coba akar atau kata Arab tanpa harakat.', 'No matching forms. Try the Arabic root or word without diacritics.')}</p>}

      <div className="space-y-10">
        {tajLookupGroups.length > 0 && <section className="space-y-4 border-b border-hairline pb-8" aria-labelledby="taj-lookup-heading">
          <div>
            <h2 id="taj-lookup-heading" className="text-2xl font-semibold text-ink-primary">{t('Akar dan bentuk dalam indeks Tāj al-ʿArūs', 'Roots and forms in the Tāj al-ʿArūs index')}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-secondary">{t('Indeks beta berisi bentuk dan stem, bukan definisi. Buka satu akar untuk menelusuri bentuk yang tercatat di dalamnya.', 'This beta index contains forms and stems, not definitions. Open a root to browse its recorded forms.')}{' '}<a href="https://sourceforge.net/projects/arabicrootsandderivatives/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">{t('Sumber · CC BY-SA 3.0', 'Source · CC BY-SA 3.0')}</a></p>
          </div>
          <ul className="divide-y divide-hairline border-y border-hairline">
            {tajLookupGroups.map((match) => <li key={match.root} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p lang="ar" dir="rtl" className="font-arabic text-3xl leading-relaxed text-ink-primary">{match.root}</p>
                <p className="text-sm text-ink-secondary">
                  {match.matchType === 'exact-root' ? t('Akar cocok tepat', 'Exact root match') : match.matchType === 'normalized-root' ? t('Padanan ejaan akar', 'Normalized root match') : `${match.wordMatches} ${t('bentuk cocok', 'matching word forms')}`}
                  {' · '}{formatNumber(match.totalForms)} {t('bentuk tercatat', 'recorded forms')}
                </p>
              </div>
              <Link href={`/kamus?root=${encodeURIComponent(match.root)}`} prefetch={false} className="inline-flex min-h-11 items-center text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{t('Telusuri bentuk akar', 'Browse root forms')}</Link>
            </li>)}
          </ul>
          {tajLookupHasMore && <div className="space-y-2">
            <p className="text-sm text-ink-secondary">{t(`${formatNumber(tajLookupGroups.length)} dari ${formatNumber(tajLookupTotal)} akar cocok`, `${formatNumber(tajLookupGroups.length)} of ${formatNumber(tajLookupTotal)} matching roots`)}</p>
            {tajLookupMoreError && <p role="alert" className="text-sm text-ink-secondary">{t('Akar berikutnya belum termuat; hasil yang ada tetap tersedia.', 'The next roots did not load; existing results remain available.')}</p>}
            {tajLookupMoreLoading && <p role="status" className="text-sm text-ink-secondary">{t('Memuat akar…', 'Loading roots…')}</p>}
            <button type="button" disabled={tajLookupMoreLoading} onClick={loadMoreTajMatches} className="min-h-11 text-base text-primary underline underline-offset-4 disabled:opacity-60">{tajLookupMoreLoading ? t('Memuat…', 'Loading…') : tajLookupMoreError ? t('Coba lagi', 'Retry') : t('Muat akar berikutnya', 'Load more roots')}</button>
          </div>}
        </section>}
        {groups.map((group) => {
          const expanded = expandedRoots.includes(group.root) || Boolean(root);
          const forms = expanded ? group.forms : group.forms.slice(0, 12);
          return <section key={group.root} className="space-y-4 border-b border-hairline pb-8" aria-labelledby={`root-${group.root}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id={`root-${group.root}`} lang="ar" dir="rtl" className="font-arabic text-4xl leading-relaxed text-ink-primary">{group.root}</h2>
                <p className="text-sm text-ink-secondary">{group.total} {t('bentuk dalam Arramooz', 'Arramooz forms')}{group.truncated ? ` · ${t('hasil dibatasi', 'results capped')}` : ''}</p>
              </div>
              {!root && <button type="button" onClick={() => openRoot(group.root)} className="min-h-11 text-sm font-medium text-primary underline underline-offset-4">{t('Lihat semua bentuk akar ini', 'View all forms for this root')}</button>}
            </div>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {forms.map((form, index) => <li key={`${form.pos}-${form.arabic}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[minmax(10rem,0.65fr)_minmax(0,1.35fr)] sm:gap-6">
                <div>
                  <p lang="ar" dir="rtl" className="font-arabic text-2xl leading-relaxed text-ink-primary">{form.arabic}</p>
                  <p className="text-sm text-ink-secondary">{form.pos === 'verb' ? t("Fi'il", 'Verb') : t('Isim', 'Noun')}{form.wordType ? ` · ${form.wordType}` : ''}{form.wazn ? ` · ${form.wazn}` : ''}</p>
                </div>
                {form.definition
                  ? <p lang="ar" dir="rtl" className="text-start font-arabic text-lg leading-[1.9] text-ink-primary">{form.definition}</p>
                  : <p className="text-sm text-ink-mute">{t('Definisi kamus belum tersedia untuk bentuk ini.', 'No dictionary definition is available for this form.')}</p>}
              </li>)}
            </ul>
            {!expanded && group.forms.length > 12 && <button type="button" onClick={() => setExpandedRoots((values) => [...values, group.root])} className="min-h-11 text-base text-primary underline underline-offset-4">{t(`Tampilkan ${group.forms.length - 12} bentuk yang cocok`, `Show ${group.forms.length - 12} matching forms`)}</button>}
          </section>;
        })}
        {hasMoreRootMatches && <div className="space-y-2">
          <p className="text-sm text-ink-secondary">{t(`${formatNumber(groups.length)} dari ${formatNumber(totalRootMatches)} akar cocok`, `${formatNumber(groups.length)} of ${formatNumber(totalRootMatches)} matching roots`)}</p>
          {rootMatchesError && <p role="alert" className="text-base text-ink-secondary">{t('Akar berikutnya belum termuat; hasil yang sudah ada tetap tersedia.', 'The next roots did not load; existing results remain available.')}</p>}
          <button type="button" disabled={loadingMoreRootMatches} onClick={loadMoreRootMatches} className="min-h-11 text-base text-primary underline underline-offset-4 disabled:opacity-60">
            {loadingMoreRootMatches ? t('Memuat akar…', 'Loading roots…') : rootMatchesError ? t('Coba lagi', 'Retry') : t('Muat akar berikutnya', 'Load more roots')}
          </button>
        </div>}
        {particleGroups.map((group) => {
          const expanded = expandedParticles.includes(group.lemma);
          const forms = expanded ? group.forms : group.forms.slice(0, 12);
          return <section key={`particle-${group.lemma}`} className="space-y-4 border-b border-hairline pb-8" aria-labelledby={`particle-${group.lemma}`}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id={`particle-${group.lemma}`} lang="ar" dir="rtl" className="font-arabic text-4xl leading-relaxed text-ink-primary">{group.lemma}</h2>
                <p className="text-sm text-ink-secondary">{group.total} {t('bentuk kata tugas dalam Arabic Stop Words', 'function-word forms in Arabic Stop Words')}</p>
                {group.hasMore && <p className="text-sm text-ink-secondary">{t(`${formatNumber(group.forms.length)} bentuk termuat`, `${formatNumber(group.forms.length)} forms loaded`)}</p>}
              </div>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Sumber ini mencatat kelas dan susunan partikel, bukan artinya. Bedah kata menampilkan entri Lane jika tersedia; Qabas menjadi rujukan kamus Arab tambahan.', 'This source records particle classes and form segments, not meanings. Word study shows a Lane entry when available; Qabas is an additional Arabic dictionary reference.')}</p>
            <ul className="divide-y divide-hairline border-y border-hairline">
              {forms.map((form, index) => {
                const segments = [form.procletic, form.stem, form.encletic].filter((part) => part && part !== '-');
                return <li key={`${form.word}-${form.vocalized}-${form.category}-${index}`} className="grid gap-2 py-4 sm:grid-cols-[minmax(10rem,0.65fr)_minmax(0,1.35fr)] sm:gap-6">
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveWordStudy(form.vocalized || form.word)}
                      aria-label={t(`Bedah kata ${form.vocalized}`, `Study the word ${form.vocalized}`)}
                      className="inline-flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-[var(--radius-control)] text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      <span lang="ar" dir="rtl" className="font-arabic text-2xl leading-relaxed text-ink-primary">{form.vocalized}</span>
                      <span className="inline-flex items-center gap-2 text-base text-primary"><BookOpen className="h-4 w-4" aria-hidden="true" />{t('Bedah kata', 'Study word')}</span>
                    </button>
                    <p lang="ar" dir="rtl" className="font-arabic text-sm leading-relaxed text-ink-secondary">{form.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-ink-secondary">{t('Susunan bentuk', 'Form segments')}: <bdi lang="ar" dir="rtl" className="font-arabic text-base text-ink-primary">{segments.join(' + ')}</bdi></p>
                    {form.tags && <p lang="ar" dir="rtl" className="font-arabic text-sm leading-relaxed text-ink-secondary">{form.tags}</p>}
                  </div>
                </li>;
              })}
            </ul>
            {!expanded && group.forms.length > 12 && <button type="button" onClick={() => setExpandedParticles((values) => [...values, group.lemma])} className="min-h-11 text-base text-primary underline underline-offset-4">{t(`Tampilkan ${group.forms.length - 12} bentuk lainnya`, `Show ${group.forms.length - 12} more forms`)}</button>}
            {group.hasMore && <div className="space-y-2">
              {particlePageError === group.lemma && <p role="alert" className="text-sm text-ink-secondary">{t('Bentuk berikutnya belum termuat; data yang ada tetap tersedia.', 'The next forms did not load; existing forms remain available.')}</p>}
              {loadingParticleLemma === group.lemma && <p role="status" className="text-sm text-ink-secondary">{t('Memuat bentuk…', 'Loading forms…')}</p>}
              <button type="button" disabled={Boolean(loadingParticleLemma)} onClick={() => loadMoreParticleForms(group.lemma)} className="min-h-11 text-base text-primary underline underline-offset-4 disabled:opacity-60">
                {loadingParticleLemma === group.lemma ? t('Memuat…', 'Loading…') : particlePageError === group.lemma ? t('Coba lagi', 'Retry') : t('Muat bentuk berikutnya', 'Load more forms')}
              </button>
            </div>}
          </section>;
        })}
      </div>
      <WordEtymologyModal
        isOpen={Boolean(activeWordStudy)}
        onClose={() => setActiveWordStudy(null)}
        wordArabic={activeWordStudy || ''}
        entryMode="dictionary"
      />
    </main>
  );
}

export default function ArabicDictionaryPage() {
  const { t } = useLanguage();
  return <Suspense fallback={<main className="mx-auto max-w-5xl px-5 py-8 text-base text-ink-secondary" role="status">{t('Memuat kamus…', 'Loading dictionary…')}</main>}>
    <ArabicDictionaryContent />
  </Suspense>;
}
