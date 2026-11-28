'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useLanguage } from '@/lib/context/LanguageContext';
import { RootWord } from '@/lib/types/morphology';
import { SURAH_LIST, SurahMeta } from '@/lib/data/surah-list';
import { useQuranAudio } from '@/lib/hooks/useQuranAudio';
import RootCard from './RootCard';
import QuranAudioPlayer from './QuranAudioPlayer';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen, Play, Pause, Headphones, Loader2 } from 'lucide-react';
import QuranWordInteractive from './QuranWordInteractive';

interface VirtualQuranSearchResultsProps {
  query: string;
  initialRoots: RootWord[];
  liveRoot?: any;
}

type SearchFilterTab = 'all' | 'ayahs' | 'roots' | 'surahs';
interface AyahSearchResult {
  surah: number;
  ayah: number;
  arabic: string;
  translationId?: string;
  translationEnglish?: string;
  surahName: string;
  surahNameEnglish: string;
}

function SearchAyahWordStudy({ ayah, language }: { ayah: AyahSearchResult; language: 'id' | 'en' }) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<{ language: 'id' | 'en'; tokens: Array<{ location: string; arabic: string; transliteration: string; meaning: string }> } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);
  const currentResult = result?.language === language ? result.tokens : null;

  useEffect(() => {
    if (!open || currentResult) return;
    const controller = new AbortController();
    setStatus('loading');
    const params = new URLSearchParams({ surah: String(ayah.surah), ayah: String(ayah.ayah), language });
    fetch(`/api/verse-words?${params}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Word meanings unavailable')))
      .then((payload) => {
        if (!Array.isArray(payload.tokens) || payload.tokens.length === 0) throw new Error('No word data');
        setResult({ language, tokens: payload.tokens });
        setStatus('idle');
      })
      .catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, [open, currentResult, ayah.surah, ayah.ayah, language, retryCount]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-hairline bg-canvas-surface px-3 text-base text-ink-secondary transition-colors hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      ><BookOpen className="h-4 w-4" aria-hidden="true" />{open ? (language === 'id' ? 'Tutup arti per kata' : 'Hide word meanings') : (language === 'id' ? 'Arti per kata' : 'Word meanings')}</button>
      {open && status === 'loading' && <p role="status" className="text-base text-ink-secondary">{language === 'id' ? 'Memuat arti kata…' : 'Loading word meanings…'}</p>}
      {open && status === 'error' && <div className="flex flex-wrap items-center gap-3 text-base text-ink-secondary">
        <span>{language === 'id' ? 'Arti per kata belum dapat dimuat.' : 'Word meanings could not be loaded.'}</span>
        <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="min-h-11 text-primary underline underline-offset-4">{language === 'id' ? 'Coba lagi' : 'Retry'}</button>
      </div>}
      {open && currentResult && <div className="space-y-2">
        <p className="text-base text-ink-secondary">Quran.com · {language === 'id' ? 'terjemahan per kata' : 'word-by-word translation'}</p>
        <div lang="ar" dir="rtl" className="flex flex-wrap justify-start gap-x-2 gap-y-3 text-right">
          {currentResult.map((token) => {
            const wordIndex = Number(token.location.split(':').at(-1));
            return <span key={token.location} className="inline-flex max-w-full flex-col items-center">
              <QuranWordInteractive
                wordArabic={token.arabic}
                transliteration={token.transliteration}
                ayahArabic={ayah.arabic}
                surahNumber={ayah.surah}
                ayahNumber={ayah.ayah}
                wordIndex={wordIndex}
                surahNameIndo={language === 'en' ? ayah.surahNameEnglish : ayah.surahName}
                mode="inline"
                fontSize="md"
              />
              <span lang={language} dir="auto" className="max-w-32 text-center text-base leading-snug text-ink-secondary">{token.meaning || (language === 'id' ? 'Arti belum tersedia' : 'Meaning unavailable')}</span>
            </span>;
          })}
        </div>
      </div>}
    </div>
  );
}

function SearchAyahTafsir({ ayah, language }: { ayah: AyahSearchResult; language: 'id' | 'en' }) {
  const [open, setOpen] = useState(false);
  const [entry, setEntry] = useState<{ text: string; source: string } | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'unavailable' | 'error'>('idle');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!open || entry) return;
    const controller = new AbortController();
    setStatus('loading');
    fetch(`/api/tafsir?surah=${ayah.surah}&ayah=${ayah.ayah}`, { signal: controller.signal })
      .then((response) => {
        if (response.status === 404) return null;
        return response.ok ? response.json() : Promise.reject(new Error('Tafsir unavailable'));
      })
      .then((payload) => {
        if (!payload) {
          setStatus('unavailable');
          return;
        }
        const text = typeof payload?.data?.text === 'string' ? payload.data.text.trim() : '';
        if (!text) {
          setStatus('unavailable');
          return;
        }
        setEntry({
          text,
          source: typeof payload.data.sourceTitle === 'string' ? payload.data.sourceTitle : 'rioastamal/quran-json@73b1d52 · tafsir.id.kemenag',
        });
        setStatus('idle');
      })
      .catch(() => { if (!controller.signal.aborted) setStatus('error'); });
    return () => controller.abort();
  }, [open, entry, ayah.surah, ayah.ayah, retryCount]);

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-11 items-center text-base font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >{open ? (language === 'id' ? 'Tutup tafsir' : 'Hide tafsir') : (language === 'id' ? 'Tafsir' : 'Tafsir · Indonesian')}</button>
      {open && status === 'loading' && <p role="status" className="text-base text-ink-secondary">{language === 'id' ? 'Memuat tafsir…' : 'Loading Indonesian tafsir…'}</p>}
      {open && status === 'unavailable' && <p role="status" className="text-base text-ink-secondary">{language === 'id' ? 'Tafsir tidak tersedia untuk ayat ini.' : 'Indonesian tafsir is unavailable for this verse.'}</p>}
      {open && status === 'error' && <div className="flex flex-wrap items-center gap-3 text-base text-ink-secondary" role="alert">
        <span>{language === 'id' ? 'Tafsir gagal dimuat.' : 'Tafsir could not be loaded.'}</span>
        <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="min-h-11 text-primary underline underline-offset-4">{language === 'id' ? 'Coba lagi' : 'Retry'}</button>
      </div>}
      {open && entry && <div className="max-w-4xl space-y-3 border-s border-hairline ps-4">
        <p lang="id" className="text-base leading-relaxed text-ink-primary">{entry.text}</p>
        <p className="text-sm text-ink-secondary">{language === 'id' ? 'Arsip sumber' : 'Archive source'}: {entry.source}</p>
        <p className="text-sm leading-relaxed text-ink-secondary">{language === 'id'
          ? 'Arsip memberi label “Kemenag” pada teks ini; asal-usulnya belum diverifikasi secara independen.'
          : 'The archive labels this “Kemenag” tafsir; its provenance has not been independently verified.'}</p>
      </div>}
    </div>
  );
}

export default function VirtualQuranSearchResults({
  query,
  initialRoots,
  liveRoot,
}: VirtualQuranSearchResultsProps) {
  const { language, t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<SearchFilterTab>('all');
  const [ayahResults, setAyahResults] = useState<AyahSearchResult[]>([]);
  const [ayahSearchLoading, setAyahSearchLoading] = useState(false);
  const [ayahSearchError, setAyahSearchError] = useState(false);
  const [englishSearchNotConfigured, setEnglishSearchNotConfigured] = useState(false);
  const [ayahSearchHasMore, setAyahSearchHasMore] = useState(false);
  const [ayahSearchPage, setAyahSearchPage] = useState(1);
  const [ayahSearchMoreLoading, setAyahSearchMoreLoading] = useState(false);
  const [ayahSearchMoreError, setAyahSearchMoreError] = useState(false);
  const ayahMoreController = useRef<AbortController | null>(null);
  const [playbackSurah, setPlaybackSurah] = useState(1);
  const [pendingPlayback, setPendingPlayback] = useState<{ surah: number; ayah: number } | null>(null);
  const [verseReciterFallback, setVerseReciterFallback] = useState(false);
  const startedPlaybackKey = useRef<string | null>(null);
  const playbackMeta = SURAH_LIST.find((surah) => surah.number === playbackSurah) || SURAH_LIST[0];
  const audio = useQuranAudio({
    surahNumber: playbackSurah,
    totalAyahs: playbackMeta.ayahsCount,
    autoScroll: false,
    translationLanguage: language,
  });
  const showVerseReciterFallback = verseReciterFallback
    && audio.selectedQari === 'alafasy'
    && (audio.playbackState === 'loading' || audio.playbackState === 'playing' || audio.playbackState === 'paused');

  const playRequestedAyah = useCallback((ayah: number) => {
    if (audio.currentQariMeta.isSurahLevel) {
      // Search results promise a specific verse, so use a per-verse reciter
      // when the saved choice only has full-surah recordings.
      audio.setSelectedQari('alafasy', { persist: false, restartPlayback: false });
      setVerseReciterFallback(true);
    } else {
      setVerseReciterFallback(false);
    }
    audio.playAyah(ayah);
  }, [audio.currentQariMeta.isSurahLevel, audio.playAyah, audio.setSelectedQari]);

  useEffect(() => {
    if (!pendingPlayback || pendingPlayback.surah !== playbackSurah) return;
    const key = `${pendingPlayback.surah}:${pendingPlayback.ayah}`;
    if (startedPlaybackKey.current === key) return;
    startedPlaybackKey.current = key;
    playRequestedAyah(pendingPlayback.ayah);
    setPendingPlayback(null);
  }, [pendingPlayback, playbackSurah, playRequestedAyah]);

  const playSearchAyah = (surah: number, ayah: number) => {
    if (playbackSurah !== surah) {
      audio.stop();
      startedPlaybackKey.current = null;
      setPendingPlayback({ surah, ayah });
      setPlaybackSurah(surah);
      return;
    }
    const isSurahLevelPlayback = audio.currentQariMeta.isSurahLevel;
    if (!isSurahLevelPlayback && audio.currentAyah === ayah && (audio.playbackState === 'playing' || audio.playbackState === 'loading')) {
      audio.pause();
      return;
    }
    if (!isSurahLevelPlayback && audio.currentAyah === ayah && audio.playbackState === 'paused') {
      audio.resume();
      return;
    }
    playRequestedAyah(ayah);
  };

  useEffect(() => {
    setAyahResults([]);
    setAyahSearchError(false);
    setEnglishSearchNotConfigured(false);
    setAyahSearchHasMore(false);
    setAyahSearchPage(1);
    setAyahSearchMoreError(false);
    setAyahSearchMoreLoading(false);
    ayahMoreController.current?.abort();
    if (query.trim().length < 2) {
      setAyahSearchLoading(false);
      return;
    }
    setAyahSearchLoading(true);
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search/ayah?q=${encodeURIComponent(query)}&language=${language}&page=1`, { signal: controller.signal });
        if (!response.ok) {
          const payload = await response.json().catch(() => null) as { code?: string } | null;
          if (payload?.code === 'ENGLISH_SEARCH_NOT_CONFIGURED') setEnglishSearchNotConfigured(true);
          throw new Error('Ayah search unavailable');
        }
        const payload = await response.json();
        setAyahResults(Array.isArray(payload.results) ? payload.results : []);
        setAyahSearchHasMore(payload.hasMore === true);
        setAyahSearchPage(Number.isInteger(payload.page) ? payload.page : 1);
      } catch {
        if (!controller.signal.aborted) {
          setAyahResults([]);
          setAyahSearchError(true);
        }
      } finally {
        if (!controller.signal.aborted) setAyahSearchLoading(false);
      }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
      ayahMoreController.current?.abort();
    };
  }, [query, language]);

  const loadMoreAyahs = useCallback(async () => {
    if (ayahSearchMoreLoading || !ayahSearchHasMore) return;
    const requestedPage = ayahSearchPage + 1;
    const controller = new AbortController();
    ayahMoreController.current = controller;
    setAyahSearchMoreLoading(true);
    setAyahSearchMoreError(false);
    try {
      const params = new URLSearchParams({ q: query, language, page: String(requestedPage) });
      const response = await fetch(`/api/search/ayah?${params}`, { signal: controller.signal });
      if (!response.ok) throw new Error('Ayah search page unavailable');
      const payload = await response.json();
      const nextResults = Array.isArray(payload.results) ? payload.results as AyahSearchResult[] : [];
      setAyahResults((current) => {
        const keys = new Set(current.map((ayah) => `${ayah.surah}:${ayah.ayah}`));
        return [...current, ...nextResults.filter((ayah) => !keys.has(`${ayah.surah}:${ayah.ayah}`))];
      });
      setAyahSearchPage(Number.isInteger(payload.page) ? payload.page : requestedPage);
      setAyahSearchHasMore(payload.hasMore === true);
    } catch {
      if (!controller.signal.aborted) setAyahSearchMoreError(true);
    } finally {
      if (!controller.signal.aborted) {
        setAyahSearchMoreLoading(false);
        if (ayahMoreController.current === controller) ayahMoreController.current = null;
      }
    }
  }, [ayahSearchHasMore, ayahSearchMoreLoading, ayahSearchPage, query, language]);

  const matchingSurahs = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return SURAH_LIST.filter((s) =>
      s.nameIndo.toLowerCase().includes(q) ||
      s.translationId.toLowerCase().includes(q) ||
      s.transliteration.toLowerCase().includes(q) ||
      s.number.toString() === q
    );
  }, [query]);

  const filters: Array<{ id: SearchFilterTab; label: string; count: number }> = [
    { id: 'all', label: t('Semua', 'All'), count: initialRoots.length + matchingSurahs.length + ayahResults.length },
    { id: 'ayahs', label: t('Ayat', 'Verses'), count: ayahResults.length },
    { id: 'roots', label: t('Akar kata', 'Roots'), count: initialRoots.length },
    { id: 'surahs', label: t('Surah', 'Surahs'), count: matchingSurahs.length },
  ];

  const combinedItems = useMemo(() => {
    const list: Array<{ type: 'root' | 'surah' | 'ayah'; data: any }> = [];
    if (activeFilter === 'all' || activeFilter === 'ayahs') {
      ayahResults.forEach((ayah) => list.push({ type: 'ayah', data: ayah }));
    }
    if (activeFilter === 'all' || activeFilter === 'surahs') {
      matchingSurahs.forEach((surah) => list.push({ type: 'surah', data: surah }));
    }
    if (activeFilter === 'all' || activeFilter === 'roots') {
      initialRoots.forEach((root) => list.push({ type: 'root', data: root }));
    }
    return list;
  }, [activeFilter, matchingSurahs, initialRoots, liveRoot, ayahResults]);

  return (
    <section aria-labelledby="search-results-heading" className="space-y-6 font-sans">
      <h2 id="search-results-heading" className="sr-only">{t('Daftar hasil pencarian', 'Search results')}</h2>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline" aria-busy={ayahSearchLoading}>
        <div role="group" aria-label={t('Saring hasil pencarian', 'Filter search results')} className="flex max-w-full items-center gap-3 overflow-x-auto">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                aria-label={ayahSearchLoading && (filter.id === 'all' || filter.id === 'ayahs')
                  ? t(`${filter.label} (hasil masih dimuat)`, `${filter.label} (count loading)`)
                  : undefined}
                onClick={() => setActiveFilter(filter.id)}
                className={`-mb-px inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-2 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive ? 'border-primary text-primary' : 'border-transparent text-ink-secondary hover:text-ink-primary'
                }`}
              >
                <span>{filter.label}</span>
                <span
                  aria-hidden={ayahSearchLoading && (filter.id === 'all' || filter.id === 'ayahs')}
                  className={`min-w-4 text-center tabular-nums ${isActive ? 'text-primary' : 'text-ink-mute'}`}
                >
                  {ayahSearchLoading && (filter.id === 'all' || filter.id === 'ayahs') ? '—' : filter.count}
                </span>
              </button>
            );
          })}
        </div>
        <span className="text-base text-ink-secondary">
          {ayahSearchLoading ? t('Mencari ayat…', 'Searching verses…') : <><strong className="text-ink-primary">{combinedItems.length}</strong> {t('hasil', 'results')}</>}
        </span>
      </div>
      {query && <p className="text-base leading-relaxed text-ink-secondary">{language === 'en'
        ? 'Verse search matches Arabic and Saheeh International (Quran Foundation Search API).'
        : 'Pencarian ayat mencakup teks Arab dan terjemahan Kemenag RI.'}</p>}
      {ayahSearchError && combinedItems.length > 0 && <p role="status" className="text-base leading-relaxed text-ink-secondary">{englishSearchNotConfigured
        ? t('Pencarian terjemahan English belum dikonfigurasi di server. Hasil lain tetap bisa dibuka.', 'English verse search is not configured on the server yet. Other results are still available.')
        : t('Pencarian ayat sedang tidak tersedia. Hasil lain tetap bisa dibuka.', 'Verse search is temporarily unavailable. Other results are still available.')}</p>}
      {showVerseReciterFallback && <p role="status" className="text-sm leading-relaxed text-ink-secondary">{t('Qari pilihan hanya menyediakan rekaman satu surat penuh. Al-Afasy dipakai sementara agar ayat yang kamu tekan diputar tepat.', 'Your selected reciter only has full-surah recordings. Al-Afasy is used temporarily so the exact verse you chose can play.')}</p>}

      {combinedItems.length === 0 && ayahSearchLoading ? (
        <p role="status" className="py-10 text-center text-base text-ink-secondary">{t('Mencari ayat…', 'Searching verses…')}</p>
      ) : combinedItems.length === 0 && ayahSearchError ? (
        <p role="status" className="py-10 text-center text-base leading-relaxed text-ink-secondary">{englishSearchNotConfigured
          ? t('Pencarian terjemahan English belum dikonfigurasi di server. Hasil kata dan surah tetap tersedia.', 'English verse search is not configured on the server yet. Word and surah results are still available.')
          : t('Pencarian ayat sedang tidak tersedia. Coba lagi sebentar.', 'Verse search is temporarily unavailable. Please try again shortly.')}</p>
      ) : combinedItems.length === 0 ? (
        <div className="space-y-3 py-10 text-center sm:py-12">
          <Search className="mx-auto h-7 w-7 text-ink-mute" />
          <h3 className="text-base font-semibold text-ink-primary">{t('Tidak ada hasil', 'No results found')}</h3>
          <p className="mx-auto max-w-md text-base text-ink-mute">
            {language === 'id' ? <>Tidak ada hasil untuk “<bdi dir="auto">{query}</bdi>” pada kategori ini. Coba kata kunci lain.</> : <>No results for “<bdi dir="auto">{query}</bdi>” in this category. Try another search.</>}
          </p>
        </div>
      ) : (
        <>
        <div className="min-h-[500px]">
          <Virtuoso
            useWindowScroll
            data={combinedItems}
            itemContent={(_index, item) => {
              if (item.type === 'surah') {
                const surah = item.data as SurahMeta;
                return (
                  <div key={`surah-${surah.number}`}>
                    <Link
                      href={`/baca?surah=${surah.number}`}
                      aria-label={t(`Buka Surah ${surah.number}. ${surah.nameIndo}`, `Open Surah ${surah.number}. ${surah.transliteration}`)}
                      className="group flex items-center justify-between gap-4 border-b border-hairline py-4 transition-colors hover:bg-canvas-soft/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:py-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-8 shrink-0 items-center justify-center border-e border-hairline pe-3 text-base tabular-nums text-ink-secondary">{surah.number}</div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <h3 className="text-base font-medium text-ink-primary transition-colors group-hover:text-primary">
                              {t('Surah', 'Surah')} {language === 'en' ? surah.transliteration : surah.nameIndo}
                            </h3>
                            {language === 'id' && <span className="text-base text-ink-secondary">({surah.translationId})</span>}
                          </div>
                          <p className="mt-1 text-base text-ink-secondary">
                            {surah.ayahsCount} {t('ayat', 'verses')} · {language === 'en' ? (surah.revelationType === 'Makkiyyah' ? 'Meccan' : 'Medinan') : surah.revelationType}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-arabic text-xl font-bold text-ink-primary" dir="rtl">{surah.nameArabic}</span>
                        <div className="flex h-9 w-9 items-center justify-center text-ink-secondary transition-colors group-hover:text-primary"><ArrowRight className="h-4 w-4" /></div>
                      </div>
                    </Link>
                  </div>
                );
              }

              if (item.type === 'ayah') {
                const ayah = item.data as AyahSearchResult;
                const translation = language === 'en' ? ayah.translationEnglish : ayah.translationId;
                const isCurrentAyah = playbackSurah === ayah.surah && audio.currentAyah === ayah.ayah;
                const isPlayingThisAyah = isCurrentAyah && audio.isPlaying;
                const isLoadingThisAyah = isCurrentAyah && audio.isLoading;
                const isActivePlayback = isPlayingThisAyah || isLoadingThisAyah;
                return (
                  <article
                    key={`ayah-${ayah.surah}-${ayah.ayah}`}
                    aria-current={isCurrentAyah ? 'true' : undefined}
                    className={`space-y-4 border-b border-hairline px-4 py-5 transition-colors sm:space-y-5 sm:px-6 sm:py-6 md:px-8 ${
                      isCurrentAyah ? 'bg-primary-subdued/25' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-base text-ink-secondary">
                        <bdi>{language === 'en' ? ayah.surahNameEnglish : ayah.surahName}</bdi>
                        <span aria-hidden="true"> · </span>
                        <span className="tabular-nums">{t('Ayat', 'Verse')} {ayah.ayah}</span>
                      </p>
                      <div className="flex shrink-0 items-center gap-1" role="group" aria-label={t('Aksi ayat', 'Verse actions')}>
                        <Link
                          href={`/baca?surah=${ayah.surah}&ayah=${ayah.ayah}`}
                          aria-label={t(`Baca ${ayah.surahName} ayat ${ayah.ayah}`, `Read ${ayah.surahNameEnglish} verse ${ayah.ayah}`)}
                          title={t('Buka ayat di mode baca', 'Open verse in reader')}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-control)] text-ink-secondary transition-colors hover:bg-canvas-soft hover:text-ink-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        ><BookOpen className="h-4 w-4" aria-hidden="true" /></Link>
                        <button
                          type="button"
                          onClick={() => playSearchAyah(ayah.surah, ayah.ayah)}
                          aria-busy={isLoadingThisAyah}
                          aria-label={isActivePlayback
                            ? t(`Jeda ${ayah.surahName} ayat ${ayah.ayah}`, `Pause ${ayah.surahNameEnglish} verse ${ayah.ayah}`)
                            : t(`Putar ${ayah.surahName} ayat ${ayah.ayah}`, `Play ${ayah.surahNameEnglish} verse ${ayah.ayah}`)}
                          title={isActivePlayback ? t('Jeda ayat', 'Pause verse') : t('Putar ayat', 'Play verse')}
                          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-control)] px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${isActivePlayback ? 'bg-primary-subdued text-primary' : 'text-ink-secondary hover:bg-canvas-soft hover:text-primary'}`}
                        >
                          {isLoadingThisAyah
                            ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            : audio.isReadingTranslation && isCurrentAyah
                              ? <Headphones className="h-4 w-4" aria-hidden="true" />
                              : isPlayingThisAyah
                                ? <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
                                : <Play className="h-4 w-4" aria-hidden="true" />}
                          <span>{isActivePlayback ? t('Jeda', 'Pause') : t('Putar', 'Play')}</span>
                        </button>
                      </div>
                    </div>
                    <p lang="ar" dir="rtl" className="font-arabic text-right text-3xl leading-[2.1] text-ink-primary sm:text-4xl">{ayah.arabic}</p>
                    {translation
                      ? <p lang={language} className="max-w-4xl text-base leading-relaxed text-ink-secondary">{translation}</p>
                      : <p role="note" className="text-base leading-relaxed text-ink-secondary">{t('Terjemahan bahasa ini belum tersedia untuk ayat ini.', 'A translation in this language is not available for this verse.')}</p>}
                    <SearchAyahWordStudy ayah={ayah} language={language} />
                    <SearchAyahTafsir ayah={ayah} language={language} />
                  </article>
                );
              }

              if (item.type === 'root') {
                const root = item.data as RootWord;
                return <div key={`root-${root.id}`} className="pb-4"><RootCard root={root} /></div>;
              }
              return null;
            }}
          />
        </div>
        {(activeFilter === 'all' || activeFilter === 'ayahs') && ayahSearchHasMore && (
          <div className="flex justify-center py-6">
            <div className="flex flex-col items-center gap-2">
              {ayahSearchMoreError && <p role="status" className="text-base text-ink-secondary">{t('Halaman berikutnya gagal dimuat.', 'The next page could not be loaded.')}</p>}
              <button
                type="button"
                onClick={loadMoreAyahs}
                disabled={ayahSearchMoreLoading}
                className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-hairline bg-canvas-surface px-5 text-base font-medium text-ink-primary transition-colors hover:bg-canvas-soft disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {ayahSearchMoreLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {ayahSearchMoreLoading ? t('Memuat…', 'Loading…') : ayahSearchMoreError ? t('Coba lagi', 'Retry') : t('Muat ayat berikutnya', 'Load more verses')}
              </button>
            </div>
          </div>
        )}
        </>
      )}
      <QuranAudioPlayer
        audio={audio}
        surahNameIndo={playbackMeta.nameIndo}
        surahNameArabic={playbackMeta.nameArabic}
        surahNumber={playbackSurah}
        totalAyahs={playbackMeta.ayahsCount}
        initialMode="compact"
      />
    </section>
  );
}
