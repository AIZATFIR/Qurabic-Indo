'use client';

import React from 'react';

export default function AmbientHeroCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Subtle organic warmth without rainbow or flashy blurs */}
      <div className="absolute inset-0 bg-[#FAF8F5] dark:bg-[#11171D]" />
      
      {/* Very soft subtle micro-grid for structure */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #1C1917 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
