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

  // Subtle image opacity & blend mode based on theme
  const imageOpacity =
    theme === 'dark'
      ? 'opacity-20 mix-blend-luminosity'
      : theme === 'green'
      ? 'opacity-15 mix-blend-multiply'
      : theme === 'bookpaper'
      ? 'opacity-20 mix-blend-multiply'
      : 'opacity-15 mix-blend-multiply';

  // Subconscious, very subtle parallax (0.12x rate)
  const parallaxOffset = Math.min(scrollY * 0.12, 60);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* 1. Quran Photographic Editorial Layer (Emerging naturally from page surface) */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${imageOpacity} hero-image-mask`}
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      >
        <div className="relative w-full max-w-4xl h-[480px] sm:h-[560px]">
          <Image
            src="/images/quran-hero.jpg"
            alt="Mushaf Al-Qur'an"
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            priority
            className="object-cover object-center filter grayscale-[25%] contrast-[0.95]"
          />
        </div>
      </div>

      {/* 2. Soft Ambient Vignette Aura */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background:
            theme === 'bookpaper'
              ? 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(214, 187, 149, 0.22), transparent 75%)'
              : theme === 'green'
              ? 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(16, 185, 129, 0.14), transparent 75%)'
              : theme === 'dark'
              ? 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(16, 185, 129, 0.10), transparent 75%)'
              : 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(5, 150, 105, 0.08), transparent 75%)',
        }}
      />
    </div>
  );
}
