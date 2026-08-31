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
        className="absolute -inset-x-0 -top-12 bottom-0 w-full h-[calc(100%+48px)] transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      >
        <Image
          src="/images/quran-hero.jpg"
          alt="Mushaf Al-Qur'anul Karim"
          fill
          sizes="100vw"
          priority
          className={`object-cover object-[50%_35%] sm:object-[50%_30%] filter ${
            theme === 'dark'
              ? 'brightness-[0.75] contrast-[1.1] saturate-[0.9]'
              : theme === 'green'
              ? 'brightness-[0.85] contrast-[1.05] saturate-[1.05]'
              : theme === 'bookpaper'
              ? 'brightness-[0.90] contrast-[1.05] sepia-[0.15]'
              : 'brightness-[0.92] contrast-[1.02]'
          }`}
        />
      </div>

      {/* 2. DIRECTIONAL DEPTH & TEXT CONTRAST SCRIM */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(11, 20, 16, 0.72) 0%, rgba(11, 20, 16, 0.85) 60%, rgba(11, 20, 16, 0.98) 100%)'
              : theme === 'green'
              ? 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(240, 249, 244, 0.80) 0%, rgba(240, 249, 244, 0.88) 55%, rgba(240, 249, 244, 0.98) 100%)'
              : theme === 'bookpaper'
              ? 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(250, 245, 237, 0.78) 0%, rgba(250, 245, 237, 0.86) 55%, rgba(250, 245, 237, 0.98) 100%)'
              : 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(250, 252, 250, 0.82) 0%, rgba(250, 252, 250, 0.90) 55%, rgba(250, 252, 250, 0.98) 100%)',
        }}
      />

      {/* 3. DEEP BOTTOM SEAMLESS TONAL TRANSITION (Continues until the bottom edge of the hero) */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 sm:h-56 pointer-events-none transition-all duration-300"
        style={{
          background:
            theme === 'dark'
              ? 'linear-gradient(to bottom, rgba(11, 20, 16, 0) 0%, rgba(11, 20, 16, 0.6) 40%, #0B1410 100%)'
              : theme === 'green'
              ? 'linear-gradient(to bottom, rgba(240, 249, 244, 0) 0%, rgba(240, 249, 244, 0.7) 40%, #F0F9F4 100%)'
              : theme === 'bookpaper'
              ? 'linear-gradient(to bottom, rgba(250, 245, 237, 0) 0%, rgba(250, 245, 237, 0.7) 40%, #FAF5ED 100%)'
              : 'linear-gradient(to bottom, rgba(250, 252, 250, 0) 0%, rgba(250, 252, 250, 0.7) 40%, #FAFCFA 100%)',
        }}
      />

      {/* 4. SUBTLE PERIMETER VIGNETTE */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/5 dark:to-black/30 pointer-events-none" />

    </div>
  );
}
