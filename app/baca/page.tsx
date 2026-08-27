'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Layers,
  Volume2,
  BookMarked,
  Shuffle,
  ArrowLeft
} from 'lucide-react';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import { fetchSurahWithWBW, FullAyahWBW } from '@/lib/api/quran-corpus-api';
import { useTheme } from '@/lib/context/ThemeContext';

const SURAH_SEED_DEFAULT = [
  { number: 1, nameIndo: 'Al-Fatihah', nameArabic: 'الفاتحة', ayahsCount: 7, revelationType: 'Meccan' },
  { number: 2, nameIndo: 'Al-Baqarah', nameArabic: 'البقرة', ayahsCount: 286, revelationType: 'Medinan' },
  { number: 3, nameIndo: 'Ali \'Imran', nameArabic: 'آل عمران', ayahsCount: 200, revelationType: 'Medinan' },
  { number: 18, nameIndo: 'Al-Kahf', nameArabic: 'الكهف', ayahsCount: 110, revelationType: 'Meccan' },
  { number: 36, nameIndo: 'Yasin', nameArabic: 'يس', ayahsCount: 83, revelationType: 'Meccan' },
  { number: 55, nameIndo: 'Ar-Rahman', nameArabic: 'الرحمن', ayahsCount: 78, revelationType: 'Medinan' },
  { number: 56, nameIndo: 'Al-Waqi\'ah', nameArabic: 'الواقعة', ayahsCount: 96, revelationType: 'Meccan' },
  { number: 67, nameIndo: 'Al-Mulk', nameArabic: 'الملك', ayahsCount: 30, revelationType: 'Meccan' },
  { number: 112, nameIndo: 'Al-Ikhlas', nameArabic: 'الإخلاص', ayahsCount: 4, revelationType: 'Meccan' },
  { number: 113, nameIndo: 'Al-Falaq', nameArabic: 'الفلق', ayahsCount: 5, revelationType: 'Meccan' },
  { number: 114, nameIndo: 'An-Nas', nameArabic: 'الناس', ayahsCount: 6, revelationType: 'Meccan' },
];

export default function BacaQuranPage() {
  const [surahList, setSurahList] = useState(SURAH_SEED_DEFAULT);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const { theme, setTheme, options } = useTheme();
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [showTranslation, setShowTranslation] = useState(true);
  const [ayahs, setAyahs] = useState<FullAyahWBW[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch FULL 114 Surahs list dynamically
  useEffect(() => {
    async function loadAll114Surahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        if (res.ok) {
          const json = await res.json();
          const fullSurahs = json.data.map((s: any) => ({
            number: s.number,
            nameIndo: s.englishName,
            nameArabic: s.name,
            ayahsCount: s.numberOfAyahs,
            revelationType: s.revelationType
          }));
          setSurahList(fullSurahs);
        }
      } catch (err) {
        console.warn('Using seed surahs fallback', err);
      }
    }
    loadAll114Surahs();
  }, []);

  // 2. Fetch selected Surah with real Word-by-Word (WBW) data
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

  const currentSurahMeta = surahList.find((s) => s.number === selectedSurah) || surahList[0];

  // High-impact font size scaling
  const fontArabicClass =
    fontSize === 'sm'
      ? 'text-2xl sm:text-3xl leading-[2.2]'
      : fontSize === 'md'
      ? 'text-3xl sm:text-4xl leading-[2.4]'
      : fontSize === 'lg'
      ? 'text-5xl sm:text-6xl leading-[2.6]'
      : 'text-6xl sm:text-7xl leading-[2.8]';

  return (
    <div className="min-h-screen transition-colors duration-200 bg-canvas text-ink-primary">
      
      {/* Reader Headbar - Non-sticky, Solid Opaque */}
      <div className="w-full border-b border-hairline px-4 py-2.5 transition-colors duration-200 shadow-subtle bg-canvas">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* LEFT SIDE: Surah Selector & Random Ayah Button */}
          <div className="flex items-center space-x-2">
            <BookMarked className="w-4 h-4 text-primary shrink-0" />
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              className="font-medium rounded-xl px-3 py-1.5 text-xs border border-hairline bg-canvas-surface text-ink-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer font-sans shadow-subtle"
            >
              {surahList.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. Surah {s.nameIndo} ({s.nameArabic}) - {s.ayahsCount} Ayat
                </option>
              ))}
            </select>

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
            
            {/* 1. Theme Toggle Tabs (4 Options: Bookpaper, Terang, Hijau, Malam) */}
            <div className="flex items-center p-0.5 rounded-lg border border-hairline bg-canvas-soft">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={`px-2 py-1 rounded-md text-[11px] font-sans transition-all ${
                    theme === opt.id
                      ? 'bg-canvas-surface text-primary font-bold shadow-subtle'
                      : 'text-ink-mute hover:text-ink-primary'
                  }`}
                  title={`Tema ${opt.label}`}
                >
                  {opt.shortLabel}
                </button>
              ))}
            </div>

            {/* 2. Font Size Scaling */}
            <div className="flex items-center space-x-0.5 p-0.5 rounded-lg border border-hairline bg-canvas-soft">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-1 rounded text-[10px] font-sans font-bold transition-all ${
                    fontSize === sz
                      ? 'bg-primary text-white shadow-subtle'
                      : 'text-ink-mute hover:text-ink-primary'
                  }`}
                  title={`Ukuran Huruf ${sz.toUpperCase()}`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>

            {/* 3. Translation Toggle Button */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-medium transition-all font-sans ${
                showTranslation
                  ? 'bg-primary text-white border-primary shadow-subtle'
                  : 'bg-canvas-surface border-hairline text-ink-secondary'
              }`}
            >
              Terjemahan
            </button>
          </div>

        </div>
      </div>

      {/* Main Quran Reader Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Surah Header Card */}
        <div className="p-6 sm:p-7 rounded-2xl border border-hairline bg-canvas-surface text-center space-y-2 shadow-subtle">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-md bg-primary-subdued text-primary text-xs font-semibold uppercase tracking-wider font-sans">
              Surah Ke-{currentSurahMeta.number} • {currentSurahMeta.revelationType}
            </span>
          </div>

          <h1 className="font-arabic-lg text-4xl sm:text-5xl font-bold text-primary">
            {currentSurahMeta.nameArabic}
          </h1>

          <h2 className="text-lg sm:text-xl font-light font-sans tracking-tight text-ink-primary">
            Surah {currentSurahMeta.nameIndo} ({currentSurahMeta.ayahsCount} Ayat)
          </h2>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-sans text-ink-mute">Memuat teks Al-Qur&apos;an &amp; analisis kata...</p>
          </div>
        ) : (
          /* Ayah Reader List */
          <div className="space-y-5">
            {ayahs.map((ayah) => (
              <div
                key={ayah.ayahNumber}
                className="p-6 sm:p-7 rounded-2xl border border-hairline bg-canvas-surface transition-all shadow-subtle"
              >
                {/* Ayah Header Number */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-hairline">
                  <span className="w-6 h-6 rounded-full bg-primary-subdued text-primary text-xs font-bold font-sans flex items-center justify-center">
                    {ayah.ayahNumber}
                  </span>

                  <span className="text-xs text-ink-mute font-sans">
                    {currentSurahMeta.nameIndo} : {ayah.ayahNumber}
                  </span>
                </div>

                {/* Arabic Text with Interactive Clickable Words */}
                <div className={`font-arabic ${fontArabicClass} text-ink-primary text-right space-x-2 space-x-reverse flex flex-wrap flex-row-reverse items-center justify-start`}>
                  {ayah.words.map((word, wIdx) => {
                    if (word.charType === 'end') {
                      return (
                        <span key={wIdx} className="text-primary font-bold text-xl px-2 font-arabic">
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
                        surahNameIndo={currentSurahMeta.nameIndo}
                      />
                    );
                  })}
                </div>

                {/* Indonesian Translation Kemenag RI */}
                {showTranslation && ayah.textIndo && (
                  <div className="mt-5 pt-3 border-t border-hairline">
                    <p className="text-xs sm:text-sm leading-relaxed font-sans text-ink-secondary">
                      &ldquo;{ayah.textIndo}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
