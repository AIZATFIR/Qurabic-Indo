import React from 'react';

interface GrammarBadgeProps {
  posTagCode: 'N' | 'V' | 'P' | 'PRON' | string;
  posTag: string;
  className?: string;
}

export default function GrammarBadge({ posTagCode, posTag, className = '' }: GrammarBadgeProps) {
  let badgeStyle = 'bg-primary-subdued text-primary-deep border-primary-subdued';

  if (posTagCode === 'V' || posTag.includes('Fi\'il')) {
    badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-200';
  } else if (posTagCode === 'P' || posTag.includes('Haraf')) {
    badgeStyle = 'bg-amber-100 text-amber-900 border-amber-200';
  } else if (posTagCode === 'PRON' || posTag.includes('Dhamir')) {
    badgeStyle = 'bg-purple-100 text-purple-900 border-purple-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${badgeStyle} ${className}`}
      title={posTag}
    >
      {posTagCode} • {posTag.slice(0, 14)}
    </span>
  );
}
