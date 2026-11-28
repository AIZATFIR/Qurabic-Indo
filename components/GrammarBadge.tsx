'use client';

import React, { useState } from 'react';
import GrammarLegendModal from './GrammarLegendModal';
import { useLanguage } from '@/lib/context/LanguageContext';

interface GrammarBadgeProps {
  posTagCode?: string;
  posTag?: string;
  className?: string;
}

export default function GrammarBadge({ posTagCode = 'N', posTag, className = '' }: GrammarBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { language, t } = useLanguage();
  const codeUpper = posTagCode.toUpperCase();

  const getStyle = (code: string) => {
    switch (code) {
      case 'V':
      case "FI'IL":
        return 'bg-primary-subdued text-primary border-primary/20 hover:bg-primary/20';
      case 'N':
      case 'ISIM':
        return 'bg-primary-fixed text-primary-deep border-primary/20 hover:bg-primary/20';
      case 'P':
      case 'HARAF':
      case 'HARF':
        return 'bg-canvas-soft text-ink-primary border-hairline hover:bg-primary-fixed';
      case 'PRON':
      case 'DHAMIR':
        return 'bg-primary-subdued text-primary border-primary/20 hover:bg-primary/20';
      default:
        return 'bg-canvas-soft text-ink-mute border-hairline hover:text-ink-primary';
    }
  };

  const localizedLabels: Record<string, string> = language === 'en'
    ? { V: 'Verb', N: 'Noun', P: 'Particle', PRON: 'Pronoun', "FI'IL": 'Verb', ISIM: 'Noun', HARAF: 'Particle', HARF: 'Particle', DHAMIR: 'Pronoun' }
    : { V: "Fi'il", N: 'Isim', P: 'Harf', PRON: 'Dhamir', "FI'IL": "Fi'il", ISIM: 'Isim', HARAF: 'Harf', HARF: 'Harf', DHAMIR: 'Dhamir' };
  const label = localizedLabels[codeUpper] || posTag || codeUpper;

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        title={t('Buka panduan Nahwu dan Sharaf', 'Open the Nahw and Sarf guide')}
        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-sans font-semibold border transition-all cursor-pointer ${getStyle(codeUpper)} ${className}`}
      >
        <span className="font-bold">{codeUpper}</span>
        <span>•</span>
        <span>{label}</span>
      </button>

      <GrammarLegendModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTagCode={codeUpper}
      />
    </>
  );
}
