'use client';

import React, { useState } from 'react';
import WordEtymologyModal from './WordEtymologyModal';

interface QuranWordInteractiveProps {
  wordArabic: string;
  transliteration?: string;
  meaningIndo?: string;
  posTag?: string;
  matchedRootSlug?: string;
}

export default function QuranWordInteractive({
  wordArabic,
  transliteration,
  meaningIndo,
  posTag,
  matchedRootSlug,
}: QuranWordInteractiveProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <span
        onClick={() => setIsModalOpen(true)}
        className="inline-block px-1 py-0.5 rounded hover:bg-primary-subdued/60 hover:text-primary transition-all cursor-pointer font-arabic select-none active:scale-95"
        title="Klik untuk Bedah Akar Kata"
      >
        {wordArabic}
      </span>

      <WordEtymologyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wordArabic={wordArabic}
        transliteration={transliteration}
        meaningIndo={meaningIndo}
        posTag={posTag}
        matchedRootSlug={matchedRootSlug}
      />
    </>
  );
}
