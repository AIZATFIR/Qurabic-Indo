'use client';

import React, { useState } from 'react';
import GrammarLegendModal from './GrammarLegendModal';

interface GrammarBadgeProps {
  posTagCode?: string;
  posTag?: string;
  className?: string;
}

export default function GrammarBadge({ posTagCode = 'N', posTag, className = '' }: GrammarBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const label = posTag || (codeUpper === 'V' ? "Fi'il" : codeUpper === 'N' ? 'Isim' : codeUpper === 'P' ? 'Haraf' : 'Dhamir');

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        title="Klik untuk melihat panduan tata bahasa Sharaf & Nahwu"
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
