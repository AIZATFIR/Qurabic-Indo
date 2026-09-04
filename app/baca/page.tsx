'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Navigation,
  X
} from 'lucide-react';
import QuranWordInteractive, { QuranWordClickData } from '@/components/QuranWordInteractive';
import WordEtymologyModal from '@/components/WordEtymologyModal';
import SurahSearchModal from '@/components/SurahSearchModal';
import QuranAudioPlayer from '@/components/QuranAudioPlayer';
import { fetchSurahWithWBW, FullAyahWBW } from '@/lib/api/quran-corpus-api';
import { SURAH_LIST, getSurahByNumber } from '@/lib/data/surah-list';
import { useTheme } from '@/lib/context/ThemeContext';
import { useQuranAudio } from '@/lib/hooks/useQuranAudio';
import { useReadingSearch } from '@/lib/hooks/useReadingSearch';

function BacaQuranPageContent() {
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
  const [showTranslation, setShowTranslation] = useState(true);
  const [showInlineMeaning, setShowInlineMeaning] = useState(false);
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
    chunkSize: 26,
    debounceMs: 180,
  });

  // Quran Audio Recitation Hook (Ayah-by-Ayah with Auto-Advance & Sync)
  const audio = useQuranAudio({
    surahNumber: selectedSurah,
    totalAyahs: currentSurahMeta.ayahsCount,
    autoScroll: true,
  });

  // Sync with URL query parameters
  useEffect(() => {
    if (surahQuery) {
      const sNum = parseInt(surahQuery, 10);
      if (sNum >= 1 && sNum <= 114 && sNum !== selectedSurah) {
        setSelectedSurah(sNum);
      }
    }
  }, [surahQuery, selectedSurah]);

  // Fetch selected Surah with in-memory caching
  useEffect(() => {
    async function loadSurahData() {
      setLoading(true);
      try {
        const data = await fetchSurahWithWBW(selectedSurah);
        setAyahs(data);
      } catch (err) {
        console.error('Error fetching surah data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSurahData();
  }, [selectedSurah]);

  // Handle URL Ayah auto-jump
  useEffect(() => {
    if (!loading && ayahQuery && ayahs.length > 0) {
      const target = parseInt(ayahQuery, 10);
      if (target >= 1 && target <= currentSurahMeta.ayahsCount) {
        selectAndJumpAyah(target);
      }
    }
  }, [loading, ayahQuery, ayahs.length, currentSurahMeta.ayahsCount, selectAndJumpAyah]);

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

  // Handle Surah & target Ayah selection from Search Modal
  const handleSelectSurah = (surahNum: number, targetAyah?: number) => {
    setSelectedSurah(surahNum);
    if (targetAyah) {
      setTimeout(() => {
        selectAndJumpAyah(targetAyah);
      }, 350);
    }
  };

  // Word click handler targeting single shared modal
  const handleWordClick = useCallback((data: QuranWordClickData) => {
    setActiveWordData(data);
  }, []);

  // High-impact font size scaling
  const fontArabicClass =
    fontSize === 'sm'
      ? 'text-2xl sm:text-3xl leading-[2.2]'
      : fontSize === 'md'
      ? 'text-3xl sm:text-4xl leading-[2.4]'
      : fontSize === 'lg'
      ? 'text-4xl sm:text-5xl lg:text-6xl leading-[2.6]'
      : 'text-5xl sm:text-6xl lg:text-7xl leading-[2.8]';

  return (
    <div className="min-h-screen transition-colors duration-200 bg-canvas text-ink-primary">
      
      {/* Reader Headbar - Non-sticky, Solid Opaque */}
      <header className="w-full border-b border-hairline px-4 py-2.5 transition-colors duration-200 shadow-subtle bg-canvas">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* LEFT SIDE: Searchable Surah Trigger Button & Random Ayah Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSurahModalOpen(true)}
              className="flex items-center space-x-2 font-medium rounded-xl px-3.5 py-1.5 text-xs border border-hairline bg-canvas-surface text-ink-primary hover:border-primary/50 transition-all font-sans shadow-subtle group"
              title="Klik untuk Cari & Ganti Surah"
            >
              <BookMarked className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-bold text-ink-primary">
                {currentSurahMeta.number}. Surah {currentSurahMeta.nameIndo}
              </span>
              <span className="font-arabic font-bold text-sm text-primary" dir="rtl">
                ({currentSurahMeta.nameArabic})
              </span>
              <span className="text-[10px] text-ink-mute hidden sm:inline">
                - {currentSurahMeta.ayahsCount} Ayat
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-ink-mute group-hover:text-primary transition-colors" />
            </button>

            <Link
              href="/ayat-random"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent hover:border-hairline transition-all text-ink-secondary hover:text-primary"
              title="Buka Ayat Acak"
            >
              <Shuffle className="w-3.5 h-3.5 text-primary" />
              <span>Ayat Acak</span>
            </Link>
          </div>

          {/* RIGHT SIDE: Controls (Inline Meaning, Translation, Font Size, Theme) */}
          <div className="flex flex-wrap items-center space-x-1.5 sm:space-x-2 text-xs ml-auto">
            {/* Inline Word-by-Word Meaning Toggle */}
            <button
              onClick={() => setShowInlineMeaning(!showInlineMeaning)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
                showInlineMeaning
                  ? 'bg-primary-subdued text-primary font-semibold ring-1 ring-primary/40'
                  : 'text-ink-mute hover:bg-canvas-soft'
              }`}
              title="Tampilkan / Sembunyikan Terjemahan Per Kata di Bawah Lafaz"
            >
              Arti Kata
            </button>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition-all ${
                showTranslation
                  ? 'bg-primary-subdued text-primary font-semibold'
                  : 'text-ink-mute hover:bg-canvas-soft'
              }`}
              title="Sembunyikan / Tampilkan Terjemahan Kemenag"
            >
              Terjemahan
            </button>

            {/* Font Size Adjusters */}
            <div className="flex items-center bg-canvas-soft border border-hairline rounded-lg p-0.5">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    fontSize === size
                      ? 'bg-canvas-surface text-primary shadow-subtle font-bold'
                      : 'text-ink-mute hover:text-ink-primary'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Selectors */}
            <div className="flex items-center space-x-1 bg-canvas-soft border border-hairline rounded-lg p-0.5">
              {options.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`w-5 h-5 rounded-md transition-all flex items-center justify-center ${
                    theme === t.id ? 'ring-2 ring-primary ring-offset-1 scale-105' : 'opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: t.bgHex }}
                  title={`Tema: ${t.label}`}
                  aria-label={`Pilih Tema ${t.label}`}
                />
              ))}
            </div>
          </div>

        </div>
      </header>

      {/* Main Quran Reader Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Continuous Scholarly Reading Surface */}
        <div className="bg-canvas-surface rounded-2xl border border-hairline shadow-subtle overflow-hidden">
          
          {/* Surah Header */}
          <div className="p-6 sm:p-10 text-center space-y-4 border-b border-hairline bg-canvas-soft/40">
            <span className="text-xs text-ink-mute font-medium font-sans uppercase tracking-wider">
              Surah Ke-{currentSurahMeta.number} • {currentSurahMeta.revelationType}
            </span>

            <h1 className="font-arabic text-4xl sm:text-5xl lg:text-6xl font-bold text-primary leading-[2.2] sm:leading-[2.6]" dir="rtl">
              سُورَةُ {currentSurahMeta.nameArabic}
            </h1>

            <h2 className="text-lg sm:text-xl font-medium font-sans text-ink-primary">
              Surah {currentSurahMeta.nameIndo} ({currentSurahMeta.ayahsCount} Ayat)
            </h2>
            <p className="text-xs sm:text-sm text-ink-mute font-sans">
              Arti: &ldquo;{currentSurahMeta.translationId}&rdquo;
            </p>

            {/* Audio Recitation Trigger */}
            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={audio.togglePlayPause}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-deep text-white text-xs font-semibold shadow-subtle transition-all font-sans"
                title={audio.isPlaying ? 'Jeda Tilawah' : 'Putar Tilawah Surah Ini (Space)'}
              >
                {audio.isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : audio.isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
                <span>{audio.isPlaying ? 'Jeda Tilawah' : 'Putar Tilawah'}</span>
              </button>
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
                <span>Lompat Ayat</span>
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
                <span>Cari Kata / Makna</span>
              </button>
            </div>

            {/* Active Mode Controls */}
            <div className="w-full md:w-auto flex items-center space-x-2">
              {searchMode === 'ayah' ? (
                /* Mode B: Lompat Nomor Ayat (Dropdown / Selector with 7-ayah context window) */
                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <span className="text-xs text-ink-mute hidden sm:inline whitespace-nowrap">
                    Pilih Ayat (1 - {currentSurahMeta.ayahsCount}):
                  </span>
                  <div className="relative flex-1 md:w-44">
                    <select
                      value={selectedAyah || ''}
                      onChange={(e) => {
                        const val = e.target.value ? parseInt(e.target.value, 10) : null;
                        if (val) {
                          selectAndJumpAyah(val);
                        }
                      }}
                      className="w-full pl-3 pr-8 py-1.5 rounded-xl border border-hairline bg-canvas-soft hover:bg-canvas-page text-xs font-semibold text-ink-primary appearance-none focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="">-- Ke Nomor Ayat --</option>
                      {Array.from({ length: currentSurahMeta.ayahsCount }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          Ayat {num}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-mute pointer-events-none" />
                  </div>
                  {isAyahContextWindow && (
                    <button
                      onClick={clearSearch}
                      className="p-1.5 rounded-lg border border-hairline bg-canvas-soft hover:bg-canvas-page text-xs text-ink-secondary hover:text-primary transition-colors"
                      title="Kembalikan ke Tampilan Seluruh Surah"
                    >
                      Buka Semua
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
                    placeholder="Ketik kata Arab, latin, atau arti..."
                    className="w-full pl-8 pr-8 py-1.5 rounded-xl border border-hairline bg-canvas-soft text-xs text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {wordQuery && (
                    <button
                      onClick={clearSearch}
                      className="p-1 text-ink-mute hover:text-ink-primary absolute right-2 rounded-full hover:bg-canvas-surface"
                      title="Hapus Pencarian"
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
                Menampilkan <strong>{totalMatchesCount} ayat</strong> yang memuat &ldquo;{wordQuery}&rdquo; dalam Surah {currentSurahMeta.nameIndo}.
              </span>
              <button
                onClick={clearSearch}
                className="font-semibold underline hover:text-primary-deep"
              >
                Tampilkan Semua Ayat
              </button>
            </div>
          )}

          {isAyahContextWindow && (
            <div className="p-3.5 bg-primary-subdued/30 border-b border-hairline flex items-center justify-between text-xs text-primary font-sans px-6">
              <span>
                Fokus Ayat <strong>{selectedAyah}</strong> (Menampilkan Konteks Ayat {visibleRange.start} - {visibleRange.end} dari {currentSurahMeta.ayahsCount} Ayat).
              </span>
              <button
                onClick={clearSearch}
                className="font-semibold underline hover:text-primary-deep"
              >
                Tampilkan Seluruh Surah
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-sans text-ink-mute">Memuat teks Al-Qur&apos;an &amp; analisis kata...</p>
            </div>
          ) : displayedAyahs.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-semibold text-ink-primary">Tidak ada ayat yang cocok</p>
              <p className="text-xs text-ink-mute">Coba gunakan kata kunci lain atau bersihkan pencarian.</p>
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
                    className={`p-6 sm:p-8 md:p-10 transition-all space-y-5 ${
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
                          title={isActiveAyah && audio.isPlaying ? 'Jeda Ayat Ini' : 'Putar Tilawah Ayat Ini'}
                          aria-label={`Putar Tilawah Ayat ${ayah.ayahNumber}`}
                        >
                          {isActiveAyah && audio.isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                          ) : isActiveAyah && audio.isPlaying ? (
                            <Pause className="w-3.5 h-3.5 fill-current" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <span className="text-xs text-ink-mute font-sans font-medium">
                        {currentSurahMeta.nameIndo} : {ayah.ayahNumber}
                      </span>
                    </div>

                    {/* Arabic Text with Interactive Clickable Words */}
                    <div
                      dir="rtl"
                      className={`font-arabic ${fontArabicClass} text-ink-primary text-right flex flex-wrap items-center justify-start gap-x-2 gap-y-3 leading-loose`}
                    >
                      {ayah.words.map((word, wIdx) => {
                        if (word.charType === 'end') {
                          return (
                            <span key={`end-${wIdx}`} className="text-primary font-bold text-xl px-2 font-arabic shrink-0 select-none" dir="rtl">
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
                            showInlineMeaning={showInlineMeaning}
                            onWordClick={handleWordClick}
                          />
                        );
                      })}
                    </div>

                    {/* Indonesian Translation Kemenag RI */}
                    {showTranslation && ayah.textIndo && (
                      <div className="pt-2">
                        <p className="text-sm sm:text-base translation-kemenag leading-relaxed font-sans text-ink-secondary">
                          &ldquo;{ayah.textIndo}&rdquo;
                        </p>
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
                className="px-5 py-2.5 rounded-xl bg-canvas-surface hover:bg-canvas-page border border-hairline text-xs font-semibold text-primary transition-all shadow-subtle"
              >
                Muat 26 Ayat Berikutnya (Menampilkan {visibleRange.end} dari {ayahs.length} Ayat)
              </button>
            </div>
          )}
        </div>

        {/* Bottom Surah Navigation (Prev & Next) */}
        <nav aria-label="Navigasi Surah" className="flex items-center justify-between pt-4">
          {selectedSurah > 1 ? (
            <button
              onClick={() => handleSelectSurah(selectedSurah - 1)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-hairline bg-canvas-surface hover:border-primary text-xs font-semibold text-ink-primary hover:text-primary transition-all shadow-subtle font-sans"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Surah Sebelumnya ({selectedSurah - 1}. {SURAH_LIST[selectedSurah - 2]?.nameIndo})</span>
            </button>
          ) : <div />}

          {selectedSurah < 114 ? (
            <button
              onClick={() => handleSelectSurah(selectedSurah + 1)}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-hairline bg-canvas-surface hover:border-primary text-xs font-semibold text-ink-primary hover:text-primary transition-all shadow-subtle font-sans"
            >
              <span>Surah Berikutnya ({selectedSurah + 1}. {SURAH_LIST[selectedSurah]?.nameIndo})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : <div />}
        </nav>

      </main>

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
