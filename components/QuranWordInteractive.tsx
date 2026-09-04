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
  onWordClick,
}: QuranWordInteractiveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayTransliteration = transliteration && !transliteration.startsWith('Kata ')
    ? transliteration
    : getArabicWordTransliteration(wordArabic);

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

  return (
    <>
      {mode === 'inline' ? (
        <span
          onClick={handleClick}
          className="inline-block px-1.5 py-0.5 my-1 mx-0.5 rounded-xl hover:bg-primary-subdued hover:text-primary transition-all cursor-pointer select-none active:scale-95 group font-arabic"
          title="Klik untuk Bedah Akar Kata & Definisi"
          dir="rtl"
        >
          <span className="font-arabic text-inherit group-hover:text-primary transition-colors" dir="rtl">
            {wordArabic}
          </span>
        </span>
      ) : (
        <span
          onClick={handleClick}
          className="inline-flex flex-col items-center justify-center px-1.5 py-1 rounded-2xl hover:bg-primary-subdued/80 hover:ring-2 hover:ring-primary/40 dark:hover:bg-slate-800 transition-all cursor-pointer select-none active:scale-95 text-center group my-1.5 mx-0.5"
          title="Klik untuk Bedah Akar Kata & Definisi"
        >
          <span className="font-arabic text-inherit group-hover:text-primary transition-colors leading-[2.2] sm:leading-[2.4]" dir="rtl">
            {wordArabic}
          </span>
          {displayTransliteration && (
            <span className="text-[10px] sm:text-[11px] font-sans text-ink-mute group-hover:text-primary transition-colors mt-0.5 font-medium italic opacity-85">
              {displayTransliteration}
            </span>
          )}
          {showInlineMeaning && meaningIndo && (
            <span className="text-[10px] font-sans text-ink-secondary group-hover:text-primary transition-colors mt-0.5 font-normal max-w-[85px] truncate block opacity-90" title={meaningIndo}>
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
