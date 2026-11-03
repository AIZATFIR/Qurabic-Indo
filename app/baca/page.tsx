'use client';

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Play,
  Pause,
  Loader2,
  BookMarked,
  Shuffle,
  Search,
  ChevronDown,
  ChevronUp,
  Navigation,
  SlidersHorizontal,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  Headphones
} from 'lucide-react';
import QuranWordInteractive, { QuranWordClickData } from '@/components/QuranWordInteractive';
import WordEtymologyModal from '@/components/WordEtymologyModal';
import SurahSearchModal from '@/components/SurahSearchModal';
import QuranAudioPlayer from '@/components/QuranAudioPlayer';
import { fetchSurahWithWBW, FullAyahWBW } from '@/lib/api/quran-corpus-api';
import { SURAH_LIST, getSurahByNumber } from '@/lib/data/surah-list';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import { useQuranAudio } from '@/lib/hooks/useQuranAudio';
import { useReadingSearch } from '@/lib/hooks/useReadingSearch';
import { preloadUpcomingAyahs } from '@/lib/audio/audio-preloader';

function BacaQuranPageContent() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const searchParams = useSearchParams();
  const surahQuery = searchParams.get('surah');
  const ayahQuery = searchParams.get('ayah');

  const initialSurah = surahQuery ? parseInt(surahQuery, 10) : 1;
  const [selectedSurah, setSelectedSurah] = useState<number>(
    initialSurah >= 1 && initialSurah <= 114 ? initialSurah : 1
  );
  const [isSurahModalOpen, setIsSurahModalOpen] = useState(false);
  const { theme, setTheme, options } = useTheme();
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [readingMode, setReadingMode] = useState<'baca' | 'tadabbur'>('tadabbur');
  const [showTranslation, setShowTranslation] = useState(true);
  const [showInlineMeaning, setShowInlineMeaning] = useState(false);
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false);
  const [ayahs, setAyahs] = useState<FullAyahWBW[]>([]);
  const [loading, setLoading] = useState(true);

  // Single shared Word Study modal state to minimize React node overhead
  const [activeWordData, setActiveWordData] = useState<QuranWordClickData | null>(null);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const currentSurahMeta = getSurahByNumber(selectedSurah) || SURAH_LIST[0];

  // Reading Search & Context Window Hook
  const {
    searchMode,
    wordQuery,
    selectedAyah,
    focusedAyah,
    visibleRange,
    displayedAyahs,
    isFilteringKata,
    isAyahContextWindow,
    totalMatchesCount,
    setSearchMode,
    setWordQuery,
    selectAndJumpAyah,
    clearSearch,
    loadMoreAyahs,
  } = useReadingSearch(ayahs, {
    surahNumber: selectedSurah,
    totalAyahs: currentSurahMeta.ayahsCount,
    initialAyah: ayahQuery ? parseInt(ayahQuery, 10) : undefined,
    chunkSize: 30,
    debounceMs: 180,
  });

  // Translation lookup for Tadarus Handsfree
  const getAyahTranslation = useCallback(
    (ayahNum: number) => {
      const found = ayahs.find((a) => a.ayahNumber === ayahNum);
      return found?.textIndo;
    },
    [ayahs]
  );

  // Quran Audio Recitation Hook (Ayah-by-Ayah with Tadarus Handsfree & Sync)
  const audio = useQuranAudio({
    surahNumber: selectedSurah,
    totalAyahs: currentSurahMeta.ayahsCount,
    autoScroll: true,
    getAyahTranslation,
    translationLanguage: language,
  });

  const [isHeaderHandsfreeOpen, setIsHeaderHandsfreeOpen] = useState(false);
  const headerHandsfreeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerHandsfreeRef.current && !headerHandsfreeRef.current.contains(e.target as Node)) {
        setIsHeaderHandsfreeOpen(false);
      }
    };
    if (isHeaderHandsfreeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isHeaderHandsfreeOpen]);

  // Tafsir per-Ayat state & handler
  const [expandedTafsirAyah, setExpandedTafsirAyah] = useState<number | null>(null);
  const [tafsirCache, setTafsirCache] = useState<Record<number, { text: string; source: string }>>({});
  const [loadingTafsirAyah, setLoadingTafsirAyah] = useState<number | null>(null);

  const handleToggleTafsir = useCallback(async (ayahNumber: number) => {
    if (expandedTafsirAyah === ayahNumber) {
      setExpandedTafsirAyah(null);
      return;
    }

    setExpandedTafsirAyah(ayahNumber);

    if (tafsirCache[ayahNumber]) return;

    setLoadingTafsirAyah(ayahNumber);
    try {
      const res = await fetch(`/api/tafsir?surah=${selectedSurah}&ayah=${ayahNumber}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          setTafsirCache((prev) => ({
            ...prev,
            [ayahNumber]: {
              text: json.data.text,
              source: json.data.sourceTitle || 'Tafsir Ringkas Kemenag RI',
            },
          }));
        }
      }
    } catch (err) {
      console.warn('Failed to load ayah tafsir:', err);
    } finally {
      setLoadingTafsirAyah(null);
    }
  }, [expandedTafsirAyah, tafsirCache, selectedSurah]);

  // Reset tafsir state on surah change
  useEffect(() => {
    setExpandedTafsirAyah(null);
    setTafsirCache({});
  }, [selectedSurah]);

  // Smart surah match when user types surah name in search bar
  const matchedSurahs = useMemo(() => {
    if (!wordQuery || wordQuery.trim().length < 2) return [];
    const q = wordQuery.trim().toLowerCase();
    return SURAH_LIST.filter(
      (s) =>
        s.number.toString() === q ||
        s.nameIndo.toLowerCase().includes(q) ||
        s.nameArabic.includes(q) ||
        s.translationId.toLowerCase().includes(q)
    );
  }, [wordQuery]);

  // Sync with URL query parameters safely without bouncing
  const prevSurahQueryRef = useRef<string | null>(surahQuery);
  useEffect(() => {
    if (surahQuery && surahQuery !== prevSurahQueryRef.current) {
      prevSurahQueryRef.current = surahQuery;
      const sNum = parseInt(surahQuery, 10);
      if (sNum >= 1 && sNum <= 114) {
        setSelectedSurah(sNum);
      }
    }
  }, [surahQuery]);

  // Fetch selected Surah with in-memory caching
  useEffect(() => {
    let cancelled = false;
    async function loadSurahData() {
      setLoading(true);
      try {
        const data = await fetchSurahWithWBW(selectedSurah, language);
        if (cancelled) return;
        setAyahs(data);
        // Instant audio & translation warm-up ("ngeload sekalian terjemahan")
        preloadUpcomingAyahs(selectedSurah, 1, data.length, (n) => data.find((a) => a.ayahNumber === n)?.textIndo, 'alafasy', 'human', language);
      } catch (err) {
        console.error('Error fetching surah data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSurahData();
    return () => { cancelled = true; };
  }, [selectedSurah, language]);

  // Handle URL Ayah auto-jump once surah data is ready
  const hasJumpedToUrlAyahRef = useRef<string | null>(null);
  useEffect(() => {
    if (!loading && ayahQuery && ayahs.length > 0) {
      const jumpKey = `${selectedSurah}:${ayahQuery}`;
      if (hasJumpedToUrlAyahRef.current !== jumpKey) {
        hasJumpedToUrlAyahRef.current = jumpKey;
        const target = parseInt(ayahQuery, 10);
        if (target >= 1 && target <= currentSurahMeta.ayahsCount) {
          selectAndJumpAyah(target);
        }
      }
    }
  }, [loading, ayahQuery, ayahs.length, selectedSurah, currentSurahMeta.ayahsCount, selectAndJumpAyah]);

  // Progressive infinite scroll intersection observer
  useEffect(() => {
    if (loading || isFilteringKata || isAyahContextWindow) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreAyahs();
        }
      },
      { rootMargin: '500px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, isFilteringKata, isAyahContextWindow, loadMoreAyahs]);

  // Auto-expand visible range if audio recitation approaches or reaches visible boundary
  useEffect(() => {
    if (audio.currentAyah && !isFilteringKata && !isAyahContextWindow) {
      if (audio.currentAyah >= visibleRange.end - 1 && visibleRange.end < ayahs.length) {
        loadMoreAyahs();
      }
    }
  }, [audio.currentAyah, visibleRange.end, ayahs.length, isFilteringKata, isAyahContextWindow, loadMoreAyahs]);

  // Handle Surah & target Ayah selection from Search Modal or Navigation buttons
  const handleSelectSurah = (surahNum: number, targetAyah?: number) => {
    if (surahNum < 1 || surahNum > 114) return;
    prevSurahQueryRef.current = surahNum.toString();
    setSelectedSurah(surahNum);

    // Synchronize the browser URL cleanly without resetting page state
    const newUrl = targetAyah 
      ? `/baca?surah=${surahNum}&ayah=${targetAyah}` 
      : `/baca?surah=${surahNum}`;
    
    try {
      router.replace(newUrl, { scroll: false });
    } catch {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', newUrl);
      }
    }

    if (targetAyah) {
      setTimeout(() => {
        selectAndJumpAyah(targetAyah);
      }, 350);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Word click handler targeting single shared modal
  const handleWordClick = useCallback((data: QuranWordClickData) => {
    setActiveWordData(data);
  }, []);

  // Scaled typography classes with SIGNIFICANT, HIGH-IMPACT differences (XL reaching 133%+)
  // Scales Arabic, Latin transliteration, and Indonesian translation simultaneously
  const fontArabicClass =
    fontSize === 'sm'
      ? 'text-2xl sm:text-3xl leading-[2.1]'
      : fontSize === 'md'
      ? 'text-3xl sm:text-4xl leading-[2.3]'
      : fontSize === 'lg'
      ? 'text-5xl sm:text-6xl leading-[2.5]'
      : 'text-6xl sm:text-7xl lg:text-8xl leading-[2.7]';

  const fontTranslitClass =
    fontSize === 'sm'
      ? 'text-xs sm:text-sm leading-relaxed'
      : fontSize === 'md'
      ? 'text-sm sm:text-base leading-relaxed'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl leading-relaxed font-medium'
      : 'text-xl sm:text-2xl lg:text-3xl leading-relaxed font-semibold';

  const fontTranslationClass =
    fontSize === 'sm'
      ? 'text-xs sm:text-sm leading-relaxed'
      : fontSize === 'md'
      ? 'text-sm sm:text-base leading-relaxed'
      : fontSize === 'lg'
      ? 'text-lg sm:text-xl lg:text-2xl leading-relaxed'
      : 'text-2xl sm:text-3xl lg:text-4xl leading-relaxed font-normal';

  return (
    <div className="min-h-screen transition-colors duration-200 bg-canvas text-ink-primary">
      
      {/* Sticky Unified Sleek Reader Headbar (Solid Canvas Surface, Zero Blur, Crisp H-14) */}
      <header
        id="reader-headbar"
        className="sticky top-0 z-30 w-full bg-canvas border-b border-hairline transition-all duration-150 shadow-subtle"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 font-sans">
          
          {/* LEFT: Back to Home & Surah Picker */}
          <div className="flex items-center space-x-1.5 shrink-0">
            <Link
              href="/"
              className="p-1.5 sm:p-2 rounded-xl text-ink-mute hover:text-primary hover:bg-canvas-soft transition-colors flex items-center justify-center"
              title={t('Kembali ke Beranda', 'Back to home')}
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsSurahModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-hairline bg-canvas-soft hover:border-primary/40 text-xs font-semibold text-ink-primary shadow-subtle transition-all group"
              title={t('Ganti Surah', 'Choose surah')}
            >
              <BookMarked className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-bold truncate max-w-[110px] xs:max-w-[140px] sm:max-w-none">
                {currentSurahMeta.number}. {currentSurahMeta.nameIndo}
              </span>
              <span className="font-arabic font-bold text-xs text-primary hidden md:inline" dir="rtl">
                ({currentSurahMeta.nameArabic})
              </span>
              <ChevronDown className="w-3 h-3 text-ink-mute group-hover:text-primary transition-colors shrink-0" />
            </button>
          </div>

          {/* CENTER: Compact Mode Switcher (Pill) */}
          <div className="flex items-center bg-canvas-soft border border-hairline rounded-xl p-0.5 shadow-subtle text-xs">
            <button
              onClick={() => setReadingMode('baca')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                readingMode === 'baca'
                  ? 'bg-primary text-white shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
              title={t('Mode Baca Mushaf Alami', 'Read Quran')}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">{t('Mode Baca', 'Read')}</span>
            </button>
            <button
              onClick={() => setReadingMode('tadabbur')}
              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                readingMode === 'tadabbur'
                  ? 'bg-primary text-white shadow-subtle'
                  : 'text-ink-secondary hover:text-ink-primary'
              }`}
              title={t('Mode Tadabbur Kata Interaktif', 'Explore words')}
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">{t('Mode Tadabbur', 'Explore')}</span>
            </button>
          </div>

          {/* RIGHT: Quick Ke Atas & Display Settings Popover */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs relative">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-1.5 sm:p-2 rounded-xl text-ink-mute hover:text-primary hover:bg-canvas-soft transition-all hidden xs:flex items-center justify-center"
              title={t('Kembali ke Awal Surah', 'Back to beginning')}
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsMobileControlsOpen(!isMobileControlsOpen)}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                isMobileControlsOpen
                  ? 'bg-primary text-white border-primary shadow-subtle'
                  : 'bg-canvas-soft border-hairline text-ink-primary hover:border-primary/40'
              }`}
              title={t('Pengaturan Tampilan & Warna Kertas', 'Reading settings')}
              aria-label={t('Pengaturan Tampilan', 'Reading settings')}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Floating Display & Theme Popover (Zero layout push, crisp floating card) */}
            {isMobileControlsOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/10"
                  onClick={() => setIsMobileControlsOpen(false)}
                />
                <div className="absolute right-0 top-12 z-50 w-72 sm:w-80 p-4 rounded-2xl bg-canvas-surface border border-hairline shadow-hover space-y-4 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                  <div className="flex items-center justify-between border-b border-hairline pb-2.5">
                    <span className="text-xs font-bold text-ink-primary">{t('Pengaturan Bacaan', 'Reading settings')}</span>
                    <button
                      onClick={() => setIsMobileControlsOpen(false)}
                      aria-label={t('Tutup pengaturan', 'Close settings')}
                      className="p-1 rounded-lg text-ink-mute hover:text-ink-primary"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <LanguageSelector />

                  {/* Mode Tadabbur Toggles */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-ink-mute block uppercase tracking-wider">
                      {t('Tampilan Teks', 'Text display')}
                    </span>
                    <div className="flex items-center gap-2">
                      {readingMode === 'tadabbur' && (
                        <button
                          onClick={() => setShowInlineMeaning(!showInlineMeaning)}
                          className={`flex-1 py-1.5 px-3 rounded-xl border text-xs transition-all ${
                            showInlineMeaning
                              ? 'bg-primary text-white border-primary font-semibold'
                              : 'bg-canvas-soft border-hairline text-ink-secondary hover:text-ink-primary'
                          }`}
                        >
                          Arti Per Kata
                        </button>
                      )}
                      <button
                        onClick={() => setShowTranslation(!showTranslation)}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs transition-all ${
                          showTranslation
                            ? 'bg-primary text-white border-primary font-semibold'
                            : 'bg-canvas-soft border-hairline text-ink-secondary hover:text-ink-primary'
                        }`}
                      >
                        Terjemahan
                      </button>
                    </div>
                  </div>

                  {/* Font Size Adjuster */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-ink-mute block uppercase tracking-wider">
                      {t('Ukuran Teks', 'Text size')}
                    </span>
                    <div className="flex items-center bg-canvas-soft border border-hairline rounded-xl p-1 justify-between">
                      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                            fontSize === size
                              ? 'bg-canvas-surface text-primary shadow-subtle'
                              : 'text-ink-mute hover:text-ink-primary'
                          }`}
                        >
                          {size.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme / Paper Selector */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold text-ink-mute block uppercase tracking-wider">
                      {t('Warna Kertas', 'Paper colour')}
                    </span>
                    <div className="flex items-center justify-between gap-1.5 p-1 bg-canvas-soft border border-hairline rounded-xl">
                      {options.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`flex-1 h-7 rounded-lg transition-all border flex items-center justify-center ${
                            theme === t.id
                              ? 'border-primary ring-2 ring-primary/30 scale-105 shadow-subtle'
                              : 'border-transparent opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: t.bgHex }}
                          title={t.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </header>

      {/* Main Quran Reader Container (Scaled to 125% Comfortable Look) */}
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        
        {/* Continuous Scholarly Reading Surface */}
        <div className="bg-canvas-surface overflow-hidden">
          
          {/* Surah Header */}
          <div className="p-6 sm:p-10 text-center space-y-4 border-b border-hairline bg-canvas-soft/40">
            <span className="text-xs text-ink-mute font-medium font-sans uppercase tracking-wider">
              {t('Surah ke-', 'Surah ')}{currentSurahMeta.number}
            </span>

            <h1 className="font-arabic text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[2.2] sm:leading-[2.6]" dir="rtl">
              سُورَةُ {currentSurahMeta.nameArabic}
            </h1>

            <h2 className="text-lg sm:text-xl font-medium font-sans text-ink-primary">
              Surah {currentSurahMeta.nameIndo} ({currentSurahMeta.ayahsCount} {t('Ayat', 'verses')})
            </h2>
            <p className="text-sm text-ink-secondary font-sans">
              {language === 'id' ? <>Arti: &ldquo;{currentSurahMeta.translationId}&rdquo; · Terjemahan ayat: Kemenag RI / Quran.com</> : 'Translation: Saheeh International · Quran.com'}
            </p>

            {/* Audio Recitation & Tadarus Handsfree Trigger */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={audio.togglePlayPause}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all font-sans"
                title={audio.isPlaying ? t('Jeda Tilawah', 'Pause recitation') : t('Putar Tilawah Surah Ini (Space)', 'Play recitation (Space)')}
              >
                {audio.isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : audio.isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
                <span>{audio.isPlaying ? t('Jeda Tilawah', 'Pause recitation') : t('Putar Tilawah', 'Play recitation')}</span>
              </button>

              <div className="relative" ref={headerHandsfreeRef}>
                <button
                  onClick={() => setIsHeaderHandsfreeOpen((prev) => !prev)}
                  className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all font-sans shadow-subtle ${
                    audio.handsfreeMode !== 'off'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 font-bold'
                      : 'bg-canvas-soft hover:bg-canvas-page text-ink-secondary hover:text-primary border-hairline'
                  }`}
                  title={t('Pilihan mode handsfree', 'Choose handsfree mode')}
                  aria-label={t('Tadarus Handsfree', 'Handsfree')}
                  aria-haspopup="true"
                  aria-expanded={isHeaderHandsfreeOpen}
                >
                  <Headphones className="w-3.5 h-3.5 shrink-0" />
                  {audio.handsfreeMode === 'normal' && (
                    <ArrowRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {audio.handsfreeMode === 'reverse' && (
                    <ArrowLeft className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span>
                    {audio.handsfreeMode === 'normal'
                      ? t('Handsfree: Arab → Terjemahan Indonesia', 'Handsfree: Arabic → English')
                      : audio.handsfreeMode === 'reverse'
                      ? t('Handsfree: Terjemahan Indonesia → Arab', 'Handsfree: English → Arabic')
                      : t('Tadarus Handsfree', 'Handsfree')}
                  </span>
                </button>

                {/* Pop-up Switcher in Header */}
                {isHeaderHandsfreeOpen && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-72 p-3 bg-canvas-surface/95 backdrop-blur-xl border border-hairline rounded-2xl shadow-hover z-50 animate-in fade-in zoom-in-95 duration-150 font-sans space-y-2 text-left">
                    <div className="flex items-center justify-between pb-2 border-b border-hairline">
                      <div className="flex items-center space-x-1.5">
                        <Headphones className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-xs font-semibold text-ink-primary">{t('Mode Tadarus Handsfree', 'Handsfree mode')}</span>
                      </div>
                      {audio.handsfreeMode !== 'off' && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                          {t('Aktif', 'Active')}
                        </span>
                      )}
                    </div>

                    {!audio.isHumanTranslationAvailableForCurrentSurah && <p className="text-sm text-ink-secondary">{t('Rekaman terjemahan manusia belum tersedia untuk surat ini. Tilawah Arab tetap berjalan.', 'A human English translation recording is unavailable for this surah. Arabic recitation will continue.')}</p>}
                    <div className="grid grid-cols-1 gap-1.5">
                      {/* Tombol Panah Kanan: Arab -> Makna (Normal) */}
                      <button
                        onClick={() => {
                          audio.setHandsfreeMode('normal');
                          setIsHeaderHandsfreeOpen(false);
                          if (!audio.isPlaying) {
                            audio.playAyah(audio.currentAyah || 1);
                          }
                        }}
                        className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between border ${
                          audio.handsfreeMode === 'normal'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-medium'
                            : 'hover:bg-canvas-soft border-transparent text-ink-secondary hover:text-ink-primary'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold">{t('Arab → Terjemahan Indonesia', 'Arabic → English')}</div>
                            <div className="text-[10px] text-ink-mute">{t('Tilawah Arab dulu, baru terjemahan', 'Arabic recitation, then English translation')}</div>
                          </div>
                        </div>
                        {audio.handsfreeMode === 'normal' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>

                      {/* Tombol Panah Kiri: Makna -> Arab (Reverse) */}
                      <button
                        onClick={() => {
                          audio.setHandsfreeMode('reverse');
                          setIsHeaderHandsfreeOpen(false);
                          if (!audio.isPlaying) {
                            audio.playAyah(audio.currentAyah || 1);
                          }
                        }}
                        className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between border ${
                          audio.handsfreeMode === 'reverse'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-800 dark:text-emerald-200 font-medium'
                            : 'hover:bg-canvas-soft border-transparent text-ink-secondary hover:text-ink-primary'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            <ArrowLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-semibold">{t('Terjemahan Indonesia → Arab', 'English → Arabic')}</div>
                            <div className="text-[10px] text-ink-mute">{t('Terjemahan dibacakan dulu, baru Arab', 'English translation, then Arabic recitation')}</div>
                          </div>
                        </div>
                        {audio.handsfreeMode === 'reverse' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    </div>

                    <div className="pt-1.5 border-t border-hairline">
                      <button
                        onClick={() => {
                          audio.setHandsfreeMode('off');
                          setIsHeaderHandsfreeOpen(false);
                        }}
                        className={`w-full py-1.5 px-2 rounded-lg text-xs font-medium text-center transition-colors ${
                          audio.handsfreeMode === 'off'
                            ? 'bg-canvas-soft text-ink-mute font-semibold'
                            : 'text-ink-mute hover:text-rose-600 hover:bg-rose-500/10'
                        }`}
                      >
                        {audio.handsfreeMode === 'off' ? t('Handsfree Nonaktif', 'Handsfree off') : t('Matikan Mode Handsfree', 'Turn handsfree off')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DUAL SEARCH & AYAH NAVIGATION TOOLBAR */}
          <div className="p-4 sm:p-5 border-b border-hairline bg-canvas-surface flex flex-col md:flex-row items-center justify-between gap-3 font-sans">
            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-canvas-soft rounded-xl border border-hairline w-full md:w-auto">
              <button
                onClick={() => {
                  setSearchMode(searchMode === 'ayah' ? 'none' : 'ayah');
                  if (searchMode === 'word') clearSearch();
                }}
                className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                  searchMode === 'ayah'
                    ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
                    : 'text-ink-mute hover:text-ink-primary'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{t('Lompat Ayat', 'Jump to verse')}</span>
              </button>

              <button
                onClick={() => {
                  setSearchMode(searchMode === 'word' ? 'none' : 'word');
                  if (searchMode === 'ayah') clearSearch();
                }}
                className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                  searchMode === 'word'
                    ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline'
                    : 'text-ink-mute hover:text-ink-primary'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>{t('Cari Kata / Makna', 'Search word / meaning')}</span>
              </button>
            </div>

            {/* Active Mode Controls */}
            <div className="w-full md:w-auto flex items-center space-x-2">
              {searchMode === 'ayah' ? (
                /* Mode B: Lompat Nomor Ayat (Dropdown / Selector with 7-ayah context window) */
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <span className="text-xs text-ink-mute hidden sm:inline whitespace-nowrap">
                    {t('Pilih Ayat', 'Choose verse')} (1–{currentSurahMeta.ayahsCount}):
                  </span>
                  <div className="relative flex-1 md:w-44">
                    <select
                      aria-label={t('Nomor ayat', 'Verse number')}
                      value={selectedAyah || ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : null;
                        if (val) {
                          selectAndJumpAyah(val);
                        }
                      }}
                      className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-hairline bg-canvas-soft hover:bg-canvas-page text-xs font-semibold text-ink-primary appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="">{t('Ke nomor ayat', 'Verse number')}</option>
                      {Array.from({ length: currentSurahMeta.ayahsCount }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {t('Ayat', 'Verse')} {num}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none" />
                  </div>
                  {isAyahContextWindow && (
                    <button
                      onClick={clearSearch}
                      className="p-1.5 rounded-lg border border-hairline bg-canvas-soft hover:bg-canvas-page text-xs text-ink-secondary hover:text-primary transition-colors"
                      title={t('Kembalikan ke Tampilan Seluruh Surah', 'Show the entire surah')}
                    >
                      {t('Buka Semua', 'Show all')}
                    </button>
                  )}
                </div>
              ) : (
                /* Mode A: Cari Kata / Terjemahan (Debounced Filtering) */
                <div className="relative flex items-center w-full md:w-72">
                  <Search className="w-3.5 h-3.5 absolute left-3 text-ink-mute" />
                  <input
                    type="text"
                    value={wordQuery}
                    onChange={(e) => setWordQuery(e.target.value)}
                    placeholder={t('Ketik kata Arab, latin, atau arti…', 'Search Arabic, transliteration, or meaning…')}
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-hairline bg-canvas-soft text-xs text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {wordQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-1 text-ink-mute hover:text-ink-primary absolute right-2 rounded-full hover:bg-canvas-surface"
                      title={t('Hapus Pencarian', 'Clear search')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status Notices */}
          {isFilteringKata && (
            <div className="p-3.5 bg-primary-subdued/40 border-b border-hairline flex items-center justify-between text-xs text-primary font-sans px-6">
              <span>
                {t('Menampilkan', 'Showing')} <strong>{totalMatchesCount} {t('ayat', 'verses')}</strong> · &ldquo;{wordQuery}&rdquo; · {currentSurahMeta.nameIndo}
              </span>
              <button
                onClick={clearSearch}
                className="font-semibold underline hover:text-primary-deep"
              >
                {t('Tampilkan Semua Ayat', 'Show all verses')}
              </button>
            </div>
          )}

          {isAyahContextWindow && (
            <div className="p-3.5 bg-primary-subdued/30 border-b border-hairline flex items-center justify-between text-xs text-primary font-sans px-6">
              <span>
                {t('Fokus ayat', 'Verse')} <strong>{selectedAyah}</strong> · {visibleRange.start}–{visibleRange.end} / {currentSurahMeta.ayahsCount}
              </span>
              <button
                onClick={clearSearch}
                className="font-semibold underline hover:text-primary-deep"
              >
                {t('Tampilkan Seluruh Surah', 'Show entire surah')}
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-sans text-ink-mute">{t('Memuat teks Al-Qur’an & analisis kata...', 'Loading Quran text and word analysis…')}</p>
            </div>
          ) : displayedAyahs.length === 0 ? (
            <div className="py-16 text-center space-y-4 max-w-lg mx-auto px-4">
              {matchedSurahs.length > 0 ? (
                <div className="p-5 rounded-2xl bg-canvas-soft border border-primary/20 shadow-subtle space-y-3 text-left">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-primary">
                    <BookOpen className="w-4 h-4" />
                    <span>{t('Ditemukan Nama Surah:', 'Matching surahs:')}</span>
                  </div>
                  <div className="space-y-2">
                    {matchedSurahs.slice(0, 3).map((s: (typeof SURAH_LIST)[number]) => (
                      <button
                        key={s.number}
                        onClick={() => {
                          clearSearch();
                          handleSelectSurah(s.number);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-canvas-surface hover:bg-primary-subdued/30 border border-hairline hover:border-primary/40 transition-all text-ink-primary group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="w-7 h-7 rounded-lg bg-canvas-soft border border-hairline text-xs font-semibold flex items-center justify-center text-ink-secondary">
                            {s.number}
                          </span>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-ink-primary group-hover:text-primary transition-colors">
                              Surah {s.nameIndo}
                            </p>
                            <p className="text-[11px] text-ink-mute">
                              {language === 'id' ? `${s.translationId} · ` : ''}{s.ayahsCount} {t('ayat', 'verses')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-ink-mute group-hover:text-primary">
                          <span className="font-arabic text-base">{s.nameArabic}</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-ink-mute text-center pt-1">
                    {t('Klik surah di atas untuk langsung membuka dan membaca.', 'Choose a surah above to read it.')}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-ink-primary">{t('Tidak ada ayat yang cocok', 'No matching verses')}</p>
                  <p className="text-xs text-ink-mute">{t('Coba gunakan kata kunci lain atau bersihkan pencarian.', 'Try another word or clear your search.')}</p>
                </>
              )}
            </div>
          ) : (
            /* Continuous Ayah List with Subtle Dividers */
            <div className="divide-y divide-hairline">
              {displayedAyahs.map((ayah) => {
                const isActiveAyah = audio.currentAyah === ayah.ayahNumber;
                const isTargetFocused = focusedAyah === ayah.ayahNumber;

                return (
                  <article
                    key={`${selectedSurah}:${ayah.ayahNumber}`}
                    id={`ayah-${ayah.ayahNumber}`}
                    className={`scroll-mt-14 p-6 sm:p-8 md:p-10 transition-all space-y-5 ${
                      isActiveAyah
                        ? 'bg-primary-subdued/25 border-l-4 border-l-primary shadow-subtle'
                        : isTargetFocused
                        ? 'bg-primary-subdued/15 border-l-4 border-l-primary'
                        : 'hover:bg-canvas-soft/20'
                    }`}
                  >
                    {/* Ayah Header Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-semibold font-sans flex items-center justify-center transition-colors ${
                            isActiveAyah || isTargetFocused
                              ? 'bg-primary text-white shadow-subtle'
                              : 'bg-canvas-soft border border-hairline text-ink-secondary'
                          }`}
                        >
                          {ayah.ayahNumber}
                        </span>

                        <button
                          onClick={() => {
                            if (isActiveAyah && audio.isPlaying) {
                              audio.pause();
                            } else {
                              audio.playAyah(ayah.ayahNumber);
                            }
                          }}
                          className={`p-1.5 rounded-lg text-xs transition-colors flex items-center space-x-1 ${
                            isActiveAyah && audio.isPlaying
                              ? 'text-primary bg-primary-subdued'
                              : 'text-ink-mute hover:text-primary hover:bg-canvas-soft'
                          }`}
                          title={isActiveAyah && audio.isPlaying ? t('Jeda Ayat Ini', 'Pause verse') : t('Putar Tilawah Ayat Ini', 'Play verse')}
                          aria-label={`${t('Putar Tilawah Ayat', 'Play verse')} ${ayah.ayahNumber}`}
                        >
                          {isActiveAyah && audio.isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          ) : isActiveAyah && audio.isReadingTranslation ? (
                            <Headphones className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                          ) : isActiveAyah && audio.isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isActiveAyah && audio.isReadingTranslation && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-semibold animate-pulse hidden sm:inline-flex">
                            {audio.handsfreeMode === 'reverse'
                              ? t('Terjemahan Indonesia dulu', 'English translation first')
                              : t('Membacakan terjemahan Indonesia', 'Playing English translation')}
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleTafsir(ayah.ayahNumber)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-colors flex items-center space-x-1.5 border ${
                            expandedTafsirAyah === ayah.ayahNumber
                              ? 'bg-primary text-white border-primary shadow-subtle'
                              : 'bg-canvas-surface border-hairline text-ink-secondary hover:text-primary hover:border-primary/40'
                          }`}
                          title={t('Buka Tafsir Kemenag RI untuk ayat ini', 'Read Indonesian Kemenag tafsir')}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{t('Tafsir', 'Tafsir · ID')}</span>
                        </button>
                      </div>

                      <span className="text-xs text-ink-mute font-sans font-medium">
                        {currentSurahMeta.nameIndo} : {ayah.ayahNumber}
                      </span>
                    </div>

                    {/* Arabic Text with Interactive Clickable Words */}
                    <div
                      dir="rtl"
                      className={`font-arabic ${fontArabicClass} text-ink-primary text-right flex flex-wrap items-center justify-start ${
                        readingMode === 'baca'
                          ? 'gap-x-2 sm:gap-x-3 gap-y-3 sm:gap-y-4 leading-loose'
                          : 'gap-2.5 sm:gap-3.5 leading-relaxed'
                      }`}
                    >
                      {ayah.words.map((word, wIdx) => {
                        if (word.charType === 'end') {
                          return (
                            <span key={`end-${wIdx}`} className="text-primary font-bold text-xl sm:text-2xl px-2 font-arabic shrink-0 select-none inline-flex items-center" dir="rtl">
                              {word.arabic || `﴿${ayah.ayahNumber}﴾`}
                            </span>
                          );
                        }

                        return (
                          <QuranWordInteractive
                            key={`${selectedSurah}:${ayah.ayahNumber}:${word.position || wIdx + 1}`}
                            wordArabic={word.arabic}
                            transliteration={word.transliteration}
                            meaningIndo={word.meaningIndo}
                            posTag={word.posTag}
                            posDetail={word.posDetail}
                            matchedRootSlug={word.rootSlug}
                            rootLetters={word.rootLetters}
                            audioUrl={word.audioUrl}
                            ayahArabic={ayah.textArabic}
                            ayahIndo={ayah.textIndo}
                            surahNumber={currentSurahMeta.number}
                            ayahNumber={ayah.ayahNumber}
                            wordIndex={word.position || (wIdx + 1)}
                            surahNameIndo={currentSurahMeta.nameIndo}
                            showInlineMeaning={readingMode === 'tadabbur' ? true : showInlineMeaning}
                            mode={readingMode === 'baca' ? 'inline' : 'stacked'}
                            fontSize={fontSize}
                            onWordClick={handleWordClick}
                          />
                        );
                      })}
                    </div>

                    {/* Latin Transliteration & Indonesian Translation (Both Scaled Simultaneously) */}
                    {showTranslation && (
                      <div className="pt-3 space-y-1.5 border-t border-hairline/60 mt-2">
                        {(() => {
                          const ayahTranslit = ayah.words
                            .filter((w) => w.charType !== 'end' && w.transliteration && !w.transliteration.startsWith('Kata '))
                            .map((w) => w.transliteration)
                            .join(' ');
                          return ayahTranslit ? (
                            <p className={`${fontTranslitClass} font-sans italic text-ink-mute font-normal tracking-wide transition-all select-text`}>
                              {ayahTranslit}
                            </p>
                          ) : null;
                        })()}
                        {ayah.textIndo && (
                          <p className={`${fontTranslationClass} translation-kemenag font-sans text-ink-secondary transition-all select-text`}>
                            &ldquo;{ayah.textIndo.replace(/^[“"']+|[”"']+$/g, '').trim()}&rdquo;
                          </p>
                        )}
                      </div>
                    )}

                    {/* Expandable Tafsir Kemenag RI Drawer */}
                    {expandedTafsirAyah === ayah.ayahNumber && (
                      <div className="mt-4 p-5 rounded-2xl bg-canvas-soft/70 border border-primary/20 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="flex items-center justify-between border-b border-hairline pb-2">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-xs font-bold font-sans text-ink-primary uppercase tracking-wider">
                              Tafsir Kemenag RI — QS. {currentSurahMeta.nameIndo}: {ayah.ayahNumber}
                            </span>
                          </div>
                          <button
                            onClick={() => setExpandedTafsirAyah(null)}
                            className="text-xs text-ink-mute hover:text-ink-primary font-medium"
                          >
                            {t('Tutup', 'Close')}
                          </button>
                        </div>

                        {loadingTafsirAyah === ayah.ayahNumber ? (
                          <div className="py-6 flex items-center justify-center space-x-2 text-ink-mute text-xs">
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                            <span>{t('Memuat penjelasan tafsir...', 'Loading Indonesian tafsir…')}</span>
                          </div>
                        ) : tafsirCache[ayah.ayahNumber]?.text ? (
                          <div className="text-base font-sans leading-relaxed text-ink-primary space-y-2 select-text">
                            <p className="whitespace-pre-line">{tafsirCache[ayah.ayahNumber].text}</p>
                            <p className="text-[11px] text-ink-mute pt-2 border-t border-hairline">
                              {t('Sumber', 'Source')}: {tafsirCache[ayah.ayahNumber].source}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-ink-mute italic">{t('Tafsir untuk ayat ini belum tersedia.', 'Indonesian tafsir is unavailable for this verse.')}</p>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Progressive Windowing Sentinel & Load More Action */}
          {!loading && !isFilteringKata && !isAyahContextWindow && visibleRange.end < ayahs.length && (
            <div className="p-6 text-center border-t border-hairline bg-canvas-soft/30 space-y-2">
              <div ref={sentinelRef} className="h-4 w-full" />
              <button
                onClick={loadMoreAyahs}
                className="px-5 py-2.5 rounded-xl bg-canvas-surface hover:bg-canvas-page border border-hairline text-xs font-semibold text-primary transition-all shadow-subtle inline-flex items-center space-x-2 font-sans"
              >
                <span>{t('Tampilkan Selanjutnya', 'Show more')}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-ink-mute block font-sans">
                {t('Menampilkan', 'Showing')} {visibleRange.end} / {ayahs.length} {t('ayat', 'verses')}
              </span>
            </div>
          )}

          {/* Context Window Full Surah Expansion Action */}
          {!loading && isAyahContextWindow && (
            <div className="p-6 text-center border-t border-hairline bg-canvas-soft/30 space-y-2">
              <button
                onClick={clearSearch}
                className="px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-deep text-xs font-semibold transition-all shadow-subtle inline-flex items-center space-x-2 font-sans"
              >
                <span>{t('Tampilkan seluruh surah', 'Show entire surah')} ({ayahs.length} {t('ayat', 'verses')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Surah Navigation (Prev & Next) */}
        <nav aria-label={t('Navigasi Surah', 'Surah navigation')} className="flex items-center justify-between pt-4">
          {selectedSurah > 1 ? (
            <button
              onClick={() => handleSelectSurah(selectedSurah - 1)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-hairline bg-canvas-surface hover:border-primary text-xs font-semibold text-ink-primary hover:text-primary transition-all shadow-subtle font-sans"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t('Surah sebelumnya', 'Previous surah')} ({selectedSurah - 1}. {SURAH_LIST[selectedSurah - 2]?.nameIndo})</span>
            </button>
          ) : <div />}

          {selectedSurah < 114 ? (
            <button
              onClick={() => handleSelectSurah(selectedSurah + 1)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-hairline bg-canvas-surface hover:border-primary text-xs font-semibold text-ink-primary hover:text-primary transition-all shadow-subtle font-sans"
            >
              <span>{t('Surah berikutnya', 'Next surah')} ({selectedSurah + 1}. {SURAH_LIST[selectedSurah]?.nameIndo})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : <div />}
        </nav>

      </div>

      {/* Floating Minimalist Audio Player */}
      <QuranAudioPlayer
        audio={audio}
        surahNameIndo={currentSurahMeta.nameIndo}
        surahNameArabic={currentSurahMeta.nameArabic}
        totalAyahs={currentSurahMeta.ayahsCount}
      />

      {/* Surah & Ayah Search Modal */}
      <SurahSearchModal
        isOpen={isSurahModalOpen}
        onClose={() => setIsSurahModalOpen(false)}
        selectedSurah={selectedSurah}
        onSelectSurah={handleSelectSurah}
      />

      {/* Single Shared Word Etymology Modal */}
      {activeWordData && (
        <WordEtymologyModal
          isOpen={Boolean(activeWordData)}
          onClose={() => setActiveWordData(null)}
          wordArabic={activeWordData.wordArabic}
          transliteration={activeWordData.transliteration}
          meaningIndo={activeWordData.meaningIndo}
          posTag={activeWordData.posTag}
          posDetail={activeWordData.posDetail}
          matchedRootSlug={activeWordData.matchedRootSlug}
          rootLetters={activeWordData.rootLetters}
          audioUrl={activeWordData.audioUrl}
          ayahArabic={activeWordData.ayahArabic}
          ayahIndo={activeWordData.ayahIndo}
          surahNumber={activeWordData.surahNumber}
          ayahNumber={activeWordData.ayahNumber}
          wordIndex={activeWordData.wordIndex}
          surahNameIndo={activeWordData.surahNameIndo}
        />
      )}
    </div>
  );
}

export default function BacaQuranPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-12 bg-canvas">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BacaQuranPageContent />
    </Suspense>
  );
}
