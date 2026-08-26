'use client';

import React from 'react';
import { useTheme } from '@/lib/context/ThemeContext';

export default function AmbientHeroCanvas() {
  const { theme } = useTheme();

  // Subtle aura calibrated for each theme
  const auraStyle =
    theme === 'bookpaper'
      ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(214, 187, 149, 0.25), rgba(45, 90, 67, 0.04) 50%, transparent 80%)'
      : theme === 'green'
      ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.18), rgba(4, 120, 87, 0.05) 55%, transparent 80%)'
      : theme === 'dark'
      ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.08) 50%, transparent 80%)'
      : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(5, 150, 105, 0.08), transparent 70%)';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Theme-aware ambient glow */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ background: auraStyle }}
      />
      
      {/* Soft micro-grid structure */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, var(--color-primary, #059669) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
