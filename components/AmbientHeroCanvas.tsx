'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/lib/context/ThemeContext';

export default function AmbientHeroCanvas() {
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Subconscious, very subtle parallax for the entire photographic environment (0.08x rate)
  const parallaxOffset = Math.min(scrollY * 0.08, 45);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      
      {/* 1. FULL-BLEED HIGH-CONTRAST PHOTOGRAPHIC ENVIRONMENT */}
      <div
        className="absolute -inset-x-0 -top-8 bottom-0 w-full h-[calc(100%+40px)] transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      >
        <Image
          src="/images/quran.jpg"
          alt="Mushaf Al-Qur'anul Karim"
          fill
          sizes="100vw"
          priority
          className={`object-cover object-[50%_22%] sm:object-[50%_20%] filter ${
            theme === 'modern'
              ? 'brightness-[0.88] contrast-[1.08] saturate-[1.04]'
              : theme === 'bookpaper' || theme === 'blend' || theme === 'sand' || theme === 'linen'
              ? 'brightness-[0.92] contrast-[1.06] sepia-[0.08]'
              : 'brightness-[0.96] contrast-[1.02]'
          }`}
        />
      </div>

      {/* 2. DIRECTIONAL DEPTH & TEXT CONTRAST SCRIM */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background: 'radial-gradient(ellipse 95% 75% at 50% 35%, color-mix(in srgb, var(--bg-page) 72%, transparent) 0%, color-mix(in srgb, var(--bg-page) 86%, transparent) 55%, var(--bg-page) 100%)',
        }}
      />

      {/* 3. DEEP BOTTOM SEAMLESS TONAL TRANSITION (Continues until the bottom edge of the hero) */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 sm:h-64 pointer-events-none transition-all duration-300"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--bg-page) 60%, transparent) 40%, var(--bg-page) 100%)',
        }}
      />

      {/* 4. SUBTLE PERIMETER VIGNETTE */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

{/*  */}    </div>
  );
}
