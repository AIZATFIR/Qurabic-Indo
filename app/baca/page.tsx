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

  // Theme-aware styles for seamless visual harmony
  const themeBg =
    theme === 'bookpaper'
      ? 'bg-[#fbf8ee] text-[#2c2825]'
      : theme === 'white'
      ? 'bg-[#f8fafc] text-slate-900'
      : 'bg-[#090d16] text-[#f8fafc]';

  const containerBorder =
    theme === 'bookpaper'
      ? 'border-[#e2d5bc]'
      : theme === 'white'
      ? 'border-slate-200'
      : 'border-slate-800';

  const cardBg =
    theme === 'bookpaper'
      ? 'bg-[#f5ebd7]/85 hover:bg-[#f5ebd7] border-[#e2d5bc]'
      : theme === 'white'
      ? 'bg-white shadow-soft border-slate-200'
      : 'bg-[#131b2e] shadow-lg border-slate-800';

  const headbarBg =
    theme === 'bookpaper'
      ? 'bg-[#f5ebd7]/95 text-[#2c2825] border-[#e2d5bc]'
      : theme === 'dark'
      ? 'bg-[#090d16]/95 text-white border-slate-800'
      : 'bg-white/95 text-slate-900 border-slate-200';

  const selectBg =
    theme === 'bookpaper'
      ? 'bg-[#ede1c7] border-[#d8c7a5] text-[#2c2825]'
      : theme === 'dark'
      ? 'bg-[#131b2e] border-slate-700 text-white'
      : 'bg-white border-slate-300 text-slate-900';

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
      
      {/* Sticky Reader Headbar - Seamless Theme Integration */}
      <div className={`sticky top-14 z-30 border-b backdrop-blur-md px-4 py-3 transition-colors duration-300 shadow-sm ${headbarBg}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3.5">
          
          {/* LEFT SIDE: Surah Selector & Random Ayah Button */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-2">
              <BookMarked className="w-4 h-4 text-primary shrink-0" />
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(Number(e.target.value))}
                className={`font-semibold rounded-2xl px-3 py-2 text-xs border focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all cursor-pointer ${selectBg}`}
              >
                {surahList.map((s) => (
                  <option key={s.number} value={s.number}>
                    {s.number}. Surah {s.nameIndo} ({s.nameArabic}) - {s.ayahsCount} Ayat
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/ayat-random"
              className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-sm ${
                theme === 'bookpaper'
                  ? 'bg-[#ede1c7] text-[#3a2c1d] border-[#d8c7a5] hover:bg-[#e4d6ba]'
                  : theme === 'dark'
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-800/80 hover:bg-indigo-900/60'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
              }`}
              title="Buka Ayat Acak"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Ayat Acak</span>
            </Link>
          </div>

          {/* RIGHT SIDE: Theme Selector, Font Size Controls & Translation Toggle */}
          <div className="flex flex-wrap items-center space-x-2.5 text-xs ml-auto">
            
            {/* 1. Theme Toggle (Bookpaper, Terang, Malam) */}
            <div className={`flex items-center p-1 rounded-full border shadow-sm ${containerBorder} ${
              theme === 'bookpaper' ? 'bg-[#ede1c7]' : theme === 'dark' ? 'bg-[#131b2e]' : 'bg-slate-100'
            }`}>
              <button
                onClick={() => setTheme('bookpaper')}
                className={`px-3 py-1 rounded-full font-semibold text-[11px] transition-all ${
                  theme === 'bookpaper'
                    ? 'bg-[#d8c7a5] text-[#2c2014] font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tema Kertas Bookpaper"
              >
                Bookpaper
              </button>
              <button
                onClick={() => setTheme('white')}
                className={`px-3 py-1 rounded-full font-semibold text-[11px] transition-all ${
                  theme === 'white'
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Tema Terang"
              >
                Terang
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-full font-semibold text-[11px] transition-all ${
                  theme === 'dark'
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'text-slate-500 hover:text-white'
                }`}
                title="Tema Malam"
              >
                Malam
              </button>
            </div>

            {/* 2. Font Size Scaling (SM, MD, LG, XL) */}
            <div className={`flex items-center space-x-0.5 p-1 rounded-full border shadow-sm ${containerBorder} ${
              theme === 'bookpaper' ? 'bg-[#ede1c7]' : theme === 'dark' ? 'bg-[#131b2e]' : 'bg-slate-100'
            }`}>
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                    fontSize === sz
                      ? 'bg-primary text-white shadow-sm scale-105'
                      : theme === 'bookpaper'
                      ? 'text-[#615243] hover:text-[#2c2014]'
                      : theme === 'dark'
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-500 hover:text-slate-900'
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
              className={`px-3 py-1.5 rounded-full border text-[11px] font-semibold transition-all shadow-sm ${
                showTranslation
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : theme === 'bookpaper'
                  ? 'bg-[#ede1c7] border-[#d8c7a5] text-[#615243]'
                  : theme === 'dark'
                  ? 'bg-[#131b2e] border-slate-700 text-slate-400'
                  : 'bg-white border-slate-300 text-slate-600'
              }`}
            >
              Terjemahan
            </button>
          </div>

        </div>
      </div>

      {/* Main Quran Reader Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Surah Header Card */}
        <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-3 ${containerBorder} ${cardBg}`}>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-primary-subdued text-primary-deep text-[11px] font-mono font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SURAH KE-{currentSurahMeta.number} • {currentSurahMeta.revelationType.toUpperCase()}</span>
            </span>

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
                <div className={`font-arabic ${fontArabicClass} ${textArabicColor} text-right dir-rtl leading-loose`}>
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
