'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Moon, Sun, Type, ChevronLeft, ChevronRight, Layers, Volume2, Info, BookMarked } from 'lucide-react';
import QuranWordInteractive from '@/components/QuranWordInteractive';
import WordEtymologyModal from '@/components/WordEtymologyModal';

// Popular Quran Surahs Seeder
const SURAH_LIST = [
  { number: 1, nameIndo: 'Al-Fatihah', nameArabic: 'الفاتحة', ayahsCount: 7, juz: 1 },
  { number: 2, nameIndo: 'Al-Baqarah', nameArabic: 'البقرة', ayahsCount: 286, juz: 1 },
  { number: 3, nameIndo: 'Ali \'Imran', nameArabic: 'آل عمران', ayahsCount: 200, juz: 3 },
  { number: 18, nameIndo: 'Al-Kahf', nameArabic: 'الكهف', ayahsCount: 110, juz: 15 },
  { number: 36, nameIndo: 'Yasin', nameArabic: 'يس', ayahsCount: 83, juz: 22 },
  { number: 55, nameIndo: 'Ar-Rahman', nameArabic: 'الرحمن', ayahsCount: 78, juz: 27 },
  { number: 56, nameIndo: 'Al-Waqi\'ah', nameArabic: 'الواقعة', ayahsCount: 96, juz: 27 },
  { number: 67, nameIndo: 'Al-Mulk', nameArabic: 'الملك', ayahsCount: 30, juz: 29 },
  { number: 112, nameIndo: 'Al-Ikhlas', nameArabic: 'الإخلاص', ayahsCount: 4, juz: 30 },
  { number: 113, nameIndo: 'Al-Falaq', nameArabic: 'الفلق', ayahsCount: 5, juz: 30 },
  { number: 114, nameIndo: 'An-Nas', nameArabic: 'الناس', ayahsCount: 6, juz: 30 },
];

interface AyahData {
  numberInSurah: number;
  textArabic: string;
  textIndo: string;
  words: {
    wordIndex: number;
    arabic: string;
    transliteration: string;
    meaningIndo: string;
    posTag: string;
    rootSlug?: string;
  }[];
}

export default function BacaQuranPage() {
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [theme, setTheme] = useState<'bookpaper' | 'white' | 'dark'>('bookpaper');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [showTranslation, setShowTranslation] = useState(true);
  const [ayahs, setAyahs] = useState<AyahData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Surah Ayahs from AlQuran Cloud & Quran.com API
  useEffect(() => {
    async function loadSurahData() {
      setLoading(true);
      try {
        const [arRes, idRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}`),
          fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/id.indonesian`)
        ]);

        if (arRes.ok && idRes.ok) {
          const arJson = await arRes.json();
          const idJson = await idRes.json();

          const arAyahs = arJson.data.ayahs;
          const idAyahs = idJson.data.ayahs;

          const combined: AyahData[] = arAyahs.map((ar: any, idx: number) => {
            const verseText = ar.text;
            const wordsRaw = verseText.split(' ');

            const wordsParsed = wordsRaw.map((w: string, wIdx: number) => {
              let matchedRootSlug: string | undefined;
              const cleanW = w.replace(/[ًٌٍَُِّْٰٓ]/g, '');

              if (cleanW.includes('صلو') || cleanW.includes('صلا') || cleanW.includes('مصلى')) {
                matchedRootSlug = 's-l-w';
              } else if (cleanW.includes('صبر') || cleanW.includes('اصبر')) {
                matchedRootSlug = 's-b-r';
              } else if (cleanW.includes('رحم') || cleanW.includes('رحمن')) {
                matchedRootSlug = 'r-h-m';
              } else if (cleanW.includes('علم') || cleanW.includes('يعلم')) {
                matchedRootSlug = 'c-l-m';
              } else if (cleanW.includes('كتب') || cleanW.includes('كتاب')) {
                matchedRootSlug = 'k-t-b';
              } else if (cleanW.includes('الله') || cleanW.includes('إله')) {
                matchedRootSlug = 'a-l-h';
              } else if (cleanW.includes('هدى') || cleanW.includes('اهدم')) {
                matchedRootSlug = 'h-d-y';
              }

              return {
                wordIndex: wIdx + 1,
                arabic: w,
                transliteration: `Kata ${wIdx + 1}`,
                meaningIndo: `Potongan kata ${wIdx + 1}`,
                posTag: wIdx % 2 === 0 ? 'Isim' : "Fi'il",
                rootSlug: matchedRootSlug
              };
            });

            return {
              numberInSurah: ar.numberInSurah,
              textArabic: ar.text,
              textIndo: idAyahs[idx]?.text || '',
              words: wordsParsed
            };
          });

          setAyahs(combined);
        }
      } catch (err) {
        console.error('Error fetching surah data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSurahData();
  }, [selectedSurah]);

  const currentSurahMeta = SURAH_LIST.find((s) => s.number === selectedSurah) || SURAH_LIST[0];

  // Full Theme styling mapping
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
      ? 'bg-[#f5ebd7]/60 hover:bg-[#f5ebd7]'
      : theme === 'white'
      ? 'bg-white shadow-soft'
      : 'bg-[#131b2e] shadow-lg';

  const textArabicColor =
    theme === 'dark' ? 'text-[#f8fafc]' : 'text-[#1e293b]';

  const textTranslationColor =
    theme === 'dark' ? 'text-[#cbd5e1]' : 'text-[#334155]';

  const fontArabicClass =
    fontSize === 'sm'
      ? 'text-2xl leading-[2.2]'
      : fontSize === 'md'
      ? 'text-3xl leading-[2.4]'
      : fontSize === 'lg'
      ? 'text-4xl leading-[2.6]'
      : 'text-5xl leading-[2.8]';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeBg}`}>
      {/* Top Reading Navigation Bar */}
      <div className={`sticky top-16 z-30 border-b backdrop-blur-md px-4 py-3 ${containerBorder} ${theme === 'dark' ? 'bg-[#090d16]/95' : 'bg-[#fcfaf2]/95'}`}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Surah Selector */}
          <div className="flex items-center space-x-3">
            <BookMarked className="w-5 h-5 text-primary" />
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(Number(e.target.value))}
              className={`font-semibold rounded-xl px-3 py-2 text-sm border focus:outline-none focus:ring-2 focus:ring-primary ${
                theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-hairline text-ink-primary'
              }`}
            >
              {SURAH_LIST.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. Surah {s.nameIndo} ({s.nameArabic}) - {s.ayahsCount} Ayat
                </option>
              ))}
            </select>
          </div>

          {/* Controls: Theme & Display Options */}
          <div className="flex items-center space-x-3 text-xs">
            {/* Theme Toggle */}
            <div className="flex items-center p-1 rounded-full border border-hairline bg-canvas-soft">
              <button
                onClick={() => setTheme('bookpaper')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  theme === 'bookpaper' ? 'bg-[#e6d8bc] text-[#3a2c1d] font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                Bookpaper Full
              </button>
              <button
                onClick={() => setTheme('white')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  theme === 'white' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                Terang
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  theme === 'dark' ? 'bg-slate-800 text-white font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                Malam kontras
              </button>
            </div>

            {/* Font Size Toggle */}
            <div className="hidden sm:flex items-center space-x-1 p-1 rounded-full border border-hairline bg-canvas-soft">
              {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setFontSize(sz)}
                  className={`w-7 h-7 rounded-full text-xs font-mono font-bold transition-all ${
                    fontSize === sz ? 'bg-primary text-white shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                showTranslation ? 'bg-primary text-white border-primary' : 'border-hairline text-slate-500'
              }`}
            >
              Terjemahan
            </button>
          </div>

        </div>
      </div>

      {/* Main Quran Reader Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        
        {/* Surah Header Card */}
        <div className={`p-8 sm:p-10 rounded-3xl border text-center space-y-3 ${containerBorder} ${cardBg}`}>
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-primary-subdued text-primary-deep text-xs font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SURAH KE-{currentSurahMeta.number} • JUZ {currentSurahMeta.juz}</span>
          </span>

          <h1 className="font-arabic-lg text-4xl sm:text-5xl font-bold text-primary">
            {currentSurahMeta.nameArabic}
          </h1>

          <h2 className="text-xl sm:text-2xl font-light font-sans tracking-tight">
            Surah {currentSurahMeta.nameIndo} ({currentSurahMeta.ayahsCount} Ayat)
          </h2>

          <div className="pt-2 flex items-center justify-center space-x-2 text-xs font-mono text-slate-500">
            <Info className="w-4 h-4 text-primary" />
            <span>Fitur Bedah Akar Kata: Klik kata manapun untuk membedah etimologi &amp; asal-usul kata.</span>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-slate-500">Memuat Teks Al-Qur&apos;an Al-Karim...</p>
          </div>
        ) : (
          /* Ayah Reader List */
          <div className="space-y-8">
            {ayahs.map((ayah) => (
              <div
                key={ayah.numberInSurah}
                className={`p-6 sm:p-8 rounded-3xl border transition-all ${containerBorder} ${cardBg}`}
              >
                {/* Ayah Header Number */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-hairline/60">
                  <span className="w-8 h-8 rounded-full bg-primary-subdued text-primary-deep text-xs font-mono font-bold flex items-center justify-center border border-primary/20">
                    {ayah.numberInSurah}
                  </span>

                  <span className="text-xs text-slate-400 font-mono">
                    Surah {currentSurahMeta.nameIndo} : {ayah.numberInSurah}
                  </span>
                </div>

                {/* Arabic Text with Interactive Clickable Words */}
                <div className={`font-arabic ${fontArabicClass} ${textArabicColor} text-right space-x-2 space-x-reverse`}>
                  {ayah.words.map((word, wIdx) => (
                    <QuranWordInteractive
                      key={wIdx}
                      wordArabic={word.arabic}
                      transliteration={word.transliteration}
                      meaningIndo={word.meaningIndo}
                      posTag={word.posTag}
                      matchedRootSlug={word.rootSlug}
                    />
                  ))}
                </div>

                {/* Indonesian Translation Kemenag RI */}
                {showTranslation && (
                  <div className="mt-6 pt-4 border-t border-hairline/60">
                    <p className={`text-sm sm:text-base leading-relaxed ${textTranslationColor}`}>
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
