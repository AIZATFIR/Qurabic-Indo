'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  Volume2,
  Info,
  BookMarked,
  CheckCircle2,
  Globe,
  Shuffle,
  ArrowLeft
} from 'lucide-react';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import { fetchSurahWithWBW, FullAyahWBW } from '@/lib/api/quran-corpus-api';

// Seed list fallback while fetching all 114 Surahs
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
  const [theme, setTheme] = useState<'bookpaper' | 'white' | 'dark'>('bookpaper');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [showTranslation, setShowTranslation] = useState(true);
  const [ayahs, setAyahs] = useState<FullAyahWBW[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch FULL 114 Surahs list dynamically from Official AlQuran Cloud API
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

  // 2. Fetch selected Surah with real Word-by-Word (WBW) data from Quran.com API v4
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

  // Theme styles
  const themeBg =
    theme === 'bookpaper'
      ? 'bg-[#fcfaf2] text-[#2c2825]'
      : theme === 'white'
      ? 'bg-white text-slate-900'
      : 'bg-[#090d16] text-[#f8fafc]';

  const containerBorder =
    theme === 'bookpaper'
      ? 'border-[#e8e0cf]'
      : theme === 'white'
      ? 'border-slate-200'
      : 'border-slate-800';

  const cardBg =
    theme === 'bookpaper'
      ? 'bg-[#f5ebd7]/70 hover:bg-[#f5ebd7]'
      : theme === 'white'
      ? 'bg-white shadow-soft'
      : 'bg-[#131b2e] shadow-lg';

  const headbarBg =
    theme === 'bookpaper'
      ? 'bg-[#fcfaf2]/95 text-[#2c2825] border-[#e8e0cf]'
      : theme === 'dark'
      ? 'bg-[#090d16]/95 text-white border-slate-800'
      : 'bg-white/95 text-slate-900 border-slate-200';

  const selectBg =
    theme === 'bookpaper'
      ? 'bg-[#f5ebd7] border-[#e8e0cf] text-[#2c2825]'
      : theme === 'dark'
      ? 'bg-[#131b2e] border-slate-700 text-white'
      : 'bg-white border-hairline text-ink-primary';

  const textArabicColor =
    theme === 'dark' ? 'text-[#f8fafc]' : 'text-[#1e293b]';

  const textTranslationColor =
    theme === 'dark' ? 'text-[#cbd5e1]' : 'text-[#334155]';

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
    <div className={`min-h-screen transition-colors duration-300 ${themeBg}`}>
      
      {/* Sticky Reader Headbar */}
      <div className={`sticky top-14 z-30 border-b backdrop-blur-md px-4 py-2.5 transition-colors duration-300 ${headbarBg}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* 114 Surahs Dropdown Selector */}
          <div className="flex items-center space-x-2.5">
            <BookMarked className="w-4 h-4 text-primary" />
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              className={`font-semibold rounded-xl px-3 py-1.5 text-xs border focus:outline-none focus:ring-2 focus:ring-primary ${selectBg}`}
            >
              {surahList.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. Surah {s.nameIndo} ({s.nameArabic}) - {s.ayahsCount} Ayat
                </option>
              ))}
            </select>
          </div>

          {/* Quick Random Ayah Button */}
          <Link
            href="/ayat-random"
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold hover:scale-105 transition-all shadow-sm"
            title="Buka Ayat Acak"
          >
            <Shuffle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Ayat Acak</span>
          </Link>

          {/* Controls: Theme & Display Options */}
          <div className="flex items-center space-x-2 text-xs">
            {/* Theme Toggle */}
            <div className={`flex items-center p-1 rounded-full border ${containerBorder} ${theme === 'bookpaper' ? 'bg-[#f5ebd7]' : theme === 'dark' ? 'bg-[#131b2e]' : 'bg-canvas-soft'}`}>
              <button
                onClick={() => setTheme('bookpaper')}
                className={`px-2.5 py-1 rounded-full font-medium text-[11px] transition-all ${
                  theme === 'bookpaper' ? 'bg-[#e6d8bc] text-[#3a2c1d] font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                Bookpaper
              </button>
              <button
                onClick={() => setTheme('white')}
                className={`px-2.5 py-1 rounded-full font-medium text-[11px] transition-all ${
                  theme === 'white' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                Terang
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 rounded-full font-medium text-[11px] transition-all ${
                  theme === 'dark' ? 'bg-primary text-white font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                Malam
              </button>
            </div>

            {/* Font Size Toggle */}
            <div className={`flex items-center space-x-1 p-1 rounded-full border ${containerBorder} ${theme === 'bookpaper' ? 'bg-[#f5ebd7]' : theme === 'dark' ? 'bg-[#131b2e]' : 'bg-canvas-soft'}`}>
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all ${
                    fontSize === sz ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1 rounded-full border text-[11px] font-medium transition-all ${
                showTranslation ? 'bg-primary text-white border-primary' : 'border-hairline text-slate-500'
              }`}
            >
              Terjemahan
            </button>
          </div>

        </div>
      </div>

      {/* Main Quran Reader Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Surah Header Card & Official Live API Proof Badge */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-3 ${containerBorder} ${cardBg}`}>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-primary-subdued text-primary-deep text-[11px] font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SURAH KE-{currentSurahMeta.number} • {currentSurahMeta.revelationType.toUpperCase()}</span>
            </span>

            {/* Official API Live Proof Badge */}
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-mono font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Word-by-Word Live Data (Kemenag RI)</span>
            </span>
          </div>

          <h1 className="font-arabic-lg text-5xl sm:text-6xl font-bold text-primary">
            {currentSurahMeta.nameArabic}
          </h1>

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-tight">
            Surah {currentSurahMeta.nameIndo} ({currentSurahMeta.ayahsCount} Ayat)
          </h2>

          <div className="pt-1 flex items-center justify-center space-x-1.5 text-xs font-mono text-slate-500">
            <Info className="w-3.5 h-3.5 text-primary" />
            <span>Klik pada kata manapun untuk membuka kartu bedah akar kata, definisi, audio, dan morfologinya.</span>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-9 h-9 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-slate-500">Memuat teks Al-Qur&apos;an &amp; Analisis Per Kata...</p>
          </div>
        ) : (
          /* Ayah Reader List */
          <div className="space-y-6">
            {ayahs.map((ayah) => (
              <div
                key={ayah.ayahNumber}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${containerBorder} ${cardBg}`}
              >
                {/* Ayah Header Number */}
                <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-hairline/60">
                  <span className="w-7 h-7 rounded-full bg-primary-subdued text-primary-deep text-xs font-mono font-bold flex items-center justify-center border border-primary/20">
                    {ayah.ayahNumber}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    Surah {currentSurahMeta.nameIndo} : {ayah.ayahNumber}
                  </span>
                </div>

                {/* Arabic Text with Interactive Clickable Words & Interlinear Transliteration */}
                <div className={`font-arabic ${fontArabicClass} ${textArabicColor} text-right space-x-2 space-x-reverse flex flex-wrap flex-row-reverse items-center justify-start`}>
                  {ayah.words.map((word, wIdx) => {
                    if (word.charType === 'end') {
                      return (
                        <span key={wIdx} className="text-primary font-bold text-xl sm:text-2xl px-2">
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
                  <div className="mt-6 pt-4 border-t border-hairline/60">
                    <p className={`text-xs sm:text-sm md:text-base leading-relaxed ${textTranslationColor}`}>
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
