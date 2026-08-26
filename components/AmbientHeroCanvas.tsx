'use client';

import React from 'react';

export default function AmbientHeroCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Fresh, Elegant Quranic Emerald Ambient Glow */}
      <div
        className="absolute inset-0 opacity-70 dark:opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -15%, rgba(16, 185, 129, 0.16), rgba(5, 150, 105, 0.05) 55%, transparent 85%)',
        }}
      />
      
      {/* Very soft micro-grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #059669 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
