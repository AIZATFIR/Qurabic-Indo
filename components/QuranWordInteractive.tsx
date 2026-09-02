'use client';

import React, { useState } from 'react';
import WordEtymologyModal from './WordEtymologyModal';

interface QuranWordInteractiveProps {
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
  surahNameIndo?: string;
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
  
  let lat = clean
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

export default function QuranWordInteractive({
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
  surahNameIndo,
}: QuranWordInteractiveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const displayTransliteration = transliteration && !transliteration.startsWith('Kata ')
    ? transliteration
    : getArabicWordTransliteration(wordArabic);

  return (
    <>
      <span
        onClick={() => setIsModalOpen(true)}
        className="inline-flex flex-col items-center justify-center px-1.5 py-1 rounded-2xl hover:bg-primary-subdued/80 hover:ring-2 hover:ring-primary/40 dark:hover:bg-slate-800 transition-all cursor-pointer select-none active:scale-95 text-center group my-1.5 mx-1"
        title="Klik untuk Bedah Akar Kata & Definisi"
      >
        <span className="font-arabic text-inherit group-hover:text-primary transition-colors leading-[2.2] sm:leading-[2.4]" dir="rtl">
          {wordArabic}
        </span>
        {displayTransliteration && (
          <span className="text-[11px] sm:text-xs font-sans text-ink-mute group-hover:text-primary transition-colors mt-0.5 font-medium italic opacity-85">
            {displayTransliteration}
          </span>
        )}
      </span>

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
        surahNameIndo={surahNameIndo}
      />
    </>
  );
}
