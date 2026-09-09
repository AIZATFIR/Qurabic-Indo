'use client';

import React, { useState, memo } from 'react';
import WordEtymologyModal from './WordEtymologyModal';

export interface QuranWordClickData {
  wordArabic: string;
  transliteration?: string;
  meaningIndo?: string;
  posTag?: string;
  posDetail?: string;
  matchedRootSlug?: string;
  rootLetters?: string;
  audioUrl?: string;
  ayahArabic?: string;
  ayahIndo?: string;
  surahNumber?: number;
  ayahNumber?: number;
  wordIndex?: number;
  surahNameIndo?: string;
}

export interface QuranWordInteractiveProps {
  wordArabic: string;
  transliteration?: string;
  meaningIndo?: string;
  posTag?: string;
  posDetail?: string;
  matchedRootSlug?: string;
  rootLetters?: string;
  audioUrl?: string;
  ayahArabic?: string;
  ayahIndo?: string;
  surahNumber?: number;
  ayahNumber?: number;
  wordIndex?: number;
  surahNameIndo?: string;
  mode?: 'stacked' | 'inline';
  showInlineMeaning?: boolean;
  fontSize?: 'sm' | 'md' | 'lg' | 'xl';
  onWordClick?: (data: QuranWordClickData) => void;
}

export function getArabicWordTransliteration(arabic: string): string {
  const clean = arabic.replace(/[ًٌٍَُِّْٰٓ]/g, '');
  if (clean.includes('الله')) return 'Allāh';
  if (clean.includes('رحمن')) return 'ar-Raḥmān';
  if (clean.includes('رحيم')) return 'ar-Raḥīm';
  if (clean.includes('حمد')) return 'al-Ḥamdu';
  if (clean.includes('رب')) return 'Rabbi';
  if (clean.includes('عالمين')) return 'al-ʿĀlamīn';
  if (clean.includes('مالك')) return 'Māliki';
  if (clean.includes('دين')) return 'ad-Dīn';
  if (clean.includes('إياك')) return 'Iyyāka';
  if (clean.includes('نعبد')) return 'naʿbudu';
  if (clean.includes('نستعين')) return 'nastaʿīn';
  if (clean.includes('اهدنا')) return 'Ihdinā';
  if (clean.includes('صراط')) return 'aṣ-Ṣirāṭ';
  if (clean.includes('مستقيم')) return 'al-Mustaqīm';
  if (clean.includes('صلاة') || clean.includes('صلو')) return 'aṣ-Ṣalāh';
  if (clean.includes('صبر')) return 'aṣ-Ṣabr';
  if (clean.includes('كتاب')) return 'al-Kitāb';
  
  const lat = clean
    .replace(/أ|إ|آ|ء/g, '\'')
    .replace(/ب/g, 'b')
    .replace(/ت/g, 't')
    .replace(/ث/g, 'th')
    .replace(/ج/g, 'j')
    .replace(/ح/g, 'ḥ')
    .replace(/خ/g, 'kh')
    .replace(/د/g, 'd')
    .replace(/ذ/g, 'dh')
    .replace(/ر/g, 'r')
    .replace(/ز/g, 'z')
    .replace(/س/g, 's')
    .replace(/ش/g, 'sh')
    .replace(/ص/g, 'ṣ')
    .replace(/ض/g, 'ḍ')
    .replace(/ط/g, 'ṭ')
    .replace(/ظ/g, 'ẓ')
    .replace(/ع/g, 'ʿ')
    .replace(/غ/g, 'gh')
    .replace(/ف/g, 'f')
    .replace(/ق/g, 'q')
    .replace(/ك/g, 'k')
    .replace(/ل/g, 'l')
    .replace(/م/g, 'm')
    .replace(/ن/g, 'n')
    .replace(/هـ|ه/g, 'h')
    .replace(/و/g, 'w')
    .replace(/ي|ى/g, 'y');

  return lat || '';
}

function QuranWordInteractiveComponent({
  wordArabic,
  transliteration,
  meaningIndo,
  posTag,
  posDetail,
  matchedRootSlug,
  rootLetters,
  audioUrl,
  ayahArabic,
  ayahIndo,
  surahNumber,
  ayahNumber,
  wordIndex,
  surahNameIndo,
  mode = 'stacked',
  showInlineMeaning = false,
  fontSize = 'lg',
  onWordClick,
}: QuranWordInteractiveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayTransliteration = transliteration && !transliteration.startsWith('Kata ')
    ? transliteration
    : getArabicWordTransliteration(wordArabic);

  // Scaled typography & card dimensions for Mode Tadabbur Cards
  // Scales Arabic, Latin transliteration, and Indonesian meaning simultaneously
  const stackedArabicSize =
    fontSize === 'sm'
      ? 'text-2xl sm:text-3xl'
      : fontSize === 'md'
      ? 'text-3xl sm:text-4xl'
      : fontSize === 'lg'
      ? 'text-5xl sm:text-6xl'
      : 'text-6xl sm:text-7xl lg:text-8xl';

  const stackedTranslitSize =
    fontSize === 'sm'
      ? 'text-xs'
      : fontSize === 'md'
      ? 'text-sm sm:text-base'
      : fontSize === 'lg'
      ? 'text-base sm:text-lg font-medium'
      : 'text-xl sm:text-2xl font-semibold';

  const stackedMeaningSize =
    fontSize === 'sm'
      ? 'text-[11px]'
      : fontSize === 'md'
      ? 'text-xs sm:text-sm font-medium'
      : fontSize === 'lg'
      ? 'text-sm sm:text-base font-semibold'
      : 'text-lg sm:text-xl font-bold';

  const stackedCardPadding =
    fontSize === 'sm'
      ? 'px-2.5 py-2 min-w-[85px] sm:min-w-[100px]'
      : fontSize === 'md'
      ? 'px-3.5 py-3 min-w-[110px] sm:min-w-[130px]'
      : fontSize === 'lg'
      ? 'px-4.5 py-4 min-w-[140px] sm:min-w-[165px]'
      : 'px-6 py-5 min-w-[180px] sm:min-w-[215px]';

  const handleClick = () => {
    if (onWordClick) {
      onWordClick({
        wordArabic,
        transliteration: displayTransliteration,
        meaningIndo,
        posTag,
        posDetail,
        matchedRootSlug,
        rootLetters,
        audioUrl,
        ayahArabic,
        ayahIndo,
        surahNumber,
        ayahNumber,
        wordIndex,
        surahNameIndo,
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only handle Enter for word interaction so Space is exclusively reserved for Audio Play/Pause
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  const a11yLabel = `Bedah kata: ${wordArabic}, ${displayTransliteration}${meaningIndo ? `, arti: ${meaningIndo}` : ''}`;

  return (
    <>
      {mode === 'inline' ? (
        /* Mode Baca: Seamless, Non-Border, Natural Quranic Calligraphy Flow */
        <span
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label={a11yLabel}
          className="inline-block px-1 sm:px-1.5 py-0.5 my-0.5 rounded-lg border-0 bg-transparent hover:bg-primary-subdued/50 hover:text-primary transition-all cursor-pointer select-none active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary group font-arabic"
          title="Klik untuk Bedah Leksikal & Arti Kata"
          dir="rtl"
        >
          <span className="font-arabic text-inherit group-hover:text-primary transition-colors" dir="rtl">
            {wordArabic}
          </span>
        </span>
      ) : (
        /* Mode Tadabbur: Spacious, Touch-Friendly Interactive Analytical Cards */
        <span
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          aria-label={a11yLabel}
          className={`inline-flex flex-col items-center justify-between ${stackedCardPadding} rounded-2xl bg-canvas-soft/90 hover:bg-primary-subdued/90 border border-hairline/90 hover:border-primary/50 transition-all cursor-pointer select-none active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-center group my-1.5 mx-1 shadow-sm hover:shadow-subtle`}
          title="Klik untuk Bedah Leksikal & Morfologi"
        >
          <span className={`font-arabic ${stackedArabicSize} text-ink-primary group-hover:text-primary transition-colors leading-[2.2] sm:leading-[2.4]`} dir="rtl">
            {wordArabic}
          </span>
          {displayTransliteration && (
            <span className={`${stackedTranslitSize} font-sans text-ink-mute group-hover:text-primary transition-colors mt-1 italic opacity-95`}>
              {displayTransliteration}
            </span>
          )}
          {showInlineMeaning && meaningIndo && (
            <span
              className={`${stackedMeaningSize} font-sans text-ink-secondary group-hover:text-primary transition-colors mt-1 max-w-[200px] leading-snug block text-center line-clamp-2`}
              title={meaningIndo}
            >
              {meaningIndo}
            </span>
          )}
        </span>
      )}

      {!onWordClick && (
        <WordEtymologyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          wordArabic={wordArabic}
          transliteration={displayTransliteration}
          meaningIndo={meaningIndo}
          posTag={posTag}
          posDetail={posDetail}
          matchedRootSlug={matchedRootSlug}
          rootLetters={rootLetters}
          audioUrl={audioUrl}
          ayahArabic={ayahArabic}
          ayahIndo={ayahIndo}
          surahNumber={surahNumber}
          ayahNumber={ayahNumber}
          wordIndex={wordIndex}
          surahNameIndo={surahNameIndo}
        />
      )}
    </>
  );
}

export const QuranWordInteractive = memo(QuranWordInteractiveComponent);
export default QuranWordInteractive;
