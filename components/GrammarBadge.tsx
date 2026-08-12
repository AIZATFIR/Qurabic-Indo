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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
      case 'N':
      case 'ISIM':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'P':
      case 'HARAF':
      case 'HARF':
        return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100';
      case 'PRON':
      case 'DHAMIR':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
    }
  };

  const label = posTag || (codeUpper === 'V' ? "Fi'il" : codeUpper === 'N' ? 'Isim' : codeUpper === 'P' ? 'Haraf' : 'Dhamir');

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        title="Klik untuk melihat penjelasan tata bahasa"
        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border transition-all cursor-pointer ${getStyle(codeUpper)} ${className}`}
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
