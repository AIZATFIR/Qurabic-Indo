'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Volume2,
  Play,
  Pause,
  Loader2,
  BookMarked,
  Shuffle,
  ArrowLeft,
  Search,
  ChevronDown
} from 'lucide-react';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import SurahSearchModal from '@/components/SurahSearchModal';
import QuranAudioPlayer from '@/components/QuranAudioPlayer';
import { fetchSurahWithWBW, FullAyahWBW } from '@/lib/api/quran-corpus-api';
import { SURAH_LIST, getSurahByNumber } from '@/lib/data/surah-list';
import { useTheme } from '@/lib/context/ThemeContext';
import { useQuranAudio } from '@/lib/hooks/useQuranAudio';

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
  const [ayahs, setAyahs] = useState<FullAyahWBW[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAyahNum, setFilterAyahNum] = useState<string>('');

  const currentSurahMeta = getSurahByNumber(selectedSurah) || SURAH_LIST[0];

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
  }, [surahQuery]);

  // Fetch selected Surah with real Word-by-Word (WBW) data
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

  // Handle URL Ayah auto-scroll and highlight
  useEffect(() => {
    if (!loading && ayahQuery && ayahs.length > 0) {
      const targetAyah = parseInt(ayahQuery, 10);
      if (targetAyah >= 1) {
        const timer = setTimeout(() => {
          const el = document.getElementById(`ayah-${targetAyah}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-2', 'ring-primary', 'bg-primary-subdued/30');
            setTimeout(() => {
              el.classList.remove('ring-2', 'ring-primary', 'bg-primary-subdued/30');
            }, 3500);
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, ayahQuery, ayahs]);

  // Handle Surah & target Ayah selection from Search Modal
  const handleSelectSurah = (surahNum: number, targetAyah?: number) => {
    setSelectedSurah(surahNum);
    if (targetAyah) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${targetAyah}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-primary', 'bg-primary-subdued/30');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-primary', 'bg-primary-subdued/30');
          }, 3500);
        }
      }, 500);
    }
  };

  // Filter Ayahs if user entered specific number in quick filter
  const displayedAyahs = filterAyahNum.trim()
    ? ayahs.filter(a => a.ayahNumber.toString() === filterAyahNum.trim() || a.textIndo.toLowerCase().includes(filterAyahNum.toLowerCase()))
    : ayahs;

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
      <div className="w-full border-b border-hairline px-4 py-2.5 transition-colors duration-200 shadow-subtle bg-canvas">
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

            {/* Quick Ayah Filter/Search */}
            <div className="relative hidden md:flex items-center">
              <Search className="w-3 h-3 absolute left-2.5 text-ink-mute" />
              <input
                type="text"
                value={filterAyahNum}
                onChange={(e) => setFilterAyahNum(e.target.value)}
                placeholder="Cari / No. Ayat..."
                className="w-28 pl-7 pr-2 py-1.5 rounded-lg border border-hairline bg-canvas-surface text-[11px] text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-1 focus:ring-primary font-sans"
              />
              {filterAyahNum && (
                <button
                  onClick={() => setFilterAyahNum('')}
                  className="text-[10px] text-ink-mute hover:text-ink-primary ml-1"
                >
                  Reset
                </button>
              )}
            </div>

            <Link
              href="/ayat-random"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent hover:border-hairline transition-all text-ink-secondary hover:text-primary"
              title="Buka Ayat Acak"
            >
              <Shuffle className="w-3.5 h-3.5 text-primary" />
              <span>Ayat Acak</span>
            </Link>
          </div>

          {/* RIGHT SIDE: Theme Selector, Font Size Controls & Translation Toggle */}
          <div className="flex flex-wrap items-center space-x-2 text-xs ml-auto">
            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
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
      </div>

      {/* Main Quran Reader Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Continuous Scholarly Reading Surface */}
        <div className="bg-canvas-surface rounded-2xl border border-hairline shadow-subtle overflow-hidden">
          
          {/* Surah Header */}
          <div className="p-8 sm:p-12 text-center space-y-4 border-b border-hairline bg-canvas-soft/40">
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

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-7 h-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-sans text-ink-mute">Memuat teks Al-Qur&apos;an &amp; analisis kata...</p>
            </div>
          ) : (
            /* Continuous Ayah List with Subtle Dividers */
            <div className="divide-y divide-hairline">
              {displayedAyahs.map((ayah) => {
                const isActiveAyah = audio.currentAyah === ayah.ayahNumber;

                return (
                  <div
                    key={ayah.ayahNumber}
                    id={`ayah-${ayah.ayahNumber}`}
                    className={`p-6 sm:p-8 md:p-10 transition-all space-y-5 ${
                      isActiveAyah
                        ? 'bg-primary-subdued/25 border-l-4 border-l-primary shadow-subtle'
                        : 'hover:bg-canvas-soft/20'
                    }`}
                  >
                    {/* Ayah Header Bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-semibold font-sans flex items-center justify-center transition-colors ${
                            isActiveAyah
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
                            <span key={wIdx} className="text-primary font-bold text-xl px-2 font-arabic shrink-0 select-none" dir="rtl">
                              {word.arabic || `﴿${ayah.ayahNumber}﴾`}
                            </span>
                          );
                        }

                        return (
                          <QuranWordInteractive
                            key={wIdx}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Surah Navigation (Prev & Next) */}
        <div className="flex items-center justify-between pt-4">
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
        </div>

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
