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
              : theme === 'blend'
              ? 'brightness-[0.92] contrast-[1.06] sepia-[0.08]'
              : 'brightness-[0.96] contrast-[1.02]'
          }`}
        />
      </div>

      {/* 2. DIRECTIONAL DEPTH & TEXT CONTRAST SCRIM */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background:
            theme === 'modern'
              ? 'radial-gradient(ellipse 95% 75% at 50% 35%, rgba(238, 246, 241, 0.72) 0%, rgba(238, 246, 241, 0.84) 55%, rgba(238, 246, 241, 0.98) 100%)'
              : theme === 'blend'
              ? 'radial-gradient(ellipse 95% 75% at 50% 35%, rgba(245, 244, 239, 0.70) 0%, rgba(245, 244, 239, 0.82) 55%, rgba(245, 244, 239, 0.98) 100%)'
              : 'radial-gradient(ellipse 95% 75% at 50% 35%, rgba(250, 252, 250, 0.74) 0%, rgba(250, 252, 250, 0.86) 55%, rgba(250, 252, 250, 0.98) 100%)',
        }}
      />

      {/* 3. DEEP BOTTOM SEAMLESS TONAL TRANSITION (Continues until the bottom edge of the hero) */}
      <div
        className="absolute inset-x-0 bottom-0 h-48 sm:h-64 pointer-events-none transition-all duration-300"
        style={{
          background:
            theme === 'modern'
              ? 'linear-gradient(to bottom, rgba(238, 246, 241, 0) 0%, rgba(238, 246, 241, 0.6) 40%, #EEF6F1 100%)'
              : theme === 'blend'
              ? 'linear-gradient(to bottom, rgba(245, 244, 239, 0) 0%, rgba(245, 244, 239, 0.6) 40%, #F5F4EF 100%)'
              : 'linear-gradient(to bottom, rgba(247, 248, 246, 0) 0%, rgba(247, 248, 246, 0.6) 40%, #F7F8F6 100%)',
        }}
      />

      {/* 4. SUBTLE PERIMETER VIGNETTE */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

{/*  */}    </div>
  );
}
