'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookMarked, Search, Compass, BookOpen } from 'lucide-react';
import { useTheme } from '@/lib/context/ThemeContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SlowMo } from 'gsap/EasePack';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SlowMo);
}

interface IlluminatedQuranHeroProps {
  onOpenSearch: () => void;
  lastSearch?: string;
}

export default function IlluminatedQuranHero({ onOpenSearch, lastSearch }: IlluminatedQuranHeroProps) {
  const { theme } = useTheme();
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);
  const lightBeamRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const lastSearchRef = useRef<HTMLDivElement | null>(null);
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // 1. GSAP CINEMATIC ENTRANCE & PARALLAX
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instantly set final state without animating
      if (imageWrapperRef.current) gsap.set(imageWrapperRef.current, { scale: 1, opacity: 1 });
      if (headingRef.current) gsap.set(headingRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Master Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Subtle slow scale-in on the Qur'an image (from 1.06 to 1.0)
      if (imageWrapperRef.current) {
        tl.fromTo(
          imageWrapperRef.current,
          { scale: 1.06, opacity: 0.7 },
          { scale: 1.0, opacity: 1.0, duration: 2.4, ease: 'power2.out' }
        );
      }

      // Subtle pulse on the illumination light beam
      if (lightBeamRef.current) {
        tl.fromTo(
          lightBeamRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1.0, duration: 2.0, ease: 'sine.out' },
          '-=2.0'
        );

        // Continuous slow, spiritual breathing light motion
        gsap.to(lightBeamRef.current, {
          opacity: 0.85,
          scale: 1.03,
          duration: 5.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Sequential text reveal
      const textElements = [
        badgeRef.current,
        headingRef.current,
        descriptionRef.current,
        actionsRef.current,
        lastSearchRef.current,
      ].filter(Boolean);

      tl.fromTo(
        textElements,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.16, ease: 'power3.out' },
        '-=1.8'
      );

      // 2. ScrollTrigger Parallax (Depth & Weight)
      if (imageWrapperRef.current && heroContainerRef.current) {
        gsap.to(imageWrapperRef.current, {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  // 2. SUBTLE FLOATING AMBIENT LIGHT PARTICLES (DUST IN LIGHT BEAM)
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    // Light particle objects
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: (Math.random() * 1.5 + 0.6) * dpr,
      alpha: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25 * dpr,
      speedY: -(Math.random() * 0.35 + 0.15) * dpr,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.fillStyle = `rgba(218, 165, 82, ${p.alpha})`; // Warm golden dust
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <header
      ref={heroContainerRef}
      className="relative min-h-[640px] sm:min-h-[740px] lg:min-h-[820px] w-full flex items-center justify-center overflow-hidden border-b border-hairline transition-colors"
    >
      {/* 1. PHOTOGRAPHIC ILLUMINATED QUR'AN ENVIRONMENT */}
      <div
        ref={imageWrapperRef}
        className="absolute -inset-x-0 -top-12 bottom-0 w-full h-[calc(100%+60px)] pointer-events-none select-none z-0"
      >
        <Image
          src="/images/quran.jpg"
          alt="Al-Qur'anul Karim Illuminated in Darkness"
          fill
          sizes="100vw"
          priority
          className={`object-cover object-[50%_24%] sm:object-[50%_22%] filter ${
            theme === 'dark'
              ? 'brightness-[0.72] contrast-[1.24] saturate-[0.95]'
              : theme === 'green'
              ? 'brightness-[0.88] contrast-[1.12] saturate-[1.05]'
              : theme === 'bookpaper'
              ? 'brightness-[0.92] contrast-[1.12] sepia-[0.14]'
              : 'brightness-[0.94] contrast-[1.08]'
          }`}
        />
      </div>

      {/* 2. DIRECTIONAL WARM LIGHT ILLUMINATION BEAM */}
      <div
        ref={lightBeamRef}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse 70% 60% at 50% 32%, rgba(212, 160, 80, 0.16) 0%, rgba(180, 130, 60, 0.05) 50%, transparent 85%)'
              : 'radial-gradient(ellipse 70% 60% at 50% 32%, rgba(200, 150, 70, 0.12) 0%, rgba(200, 150, 70, 0.04) 50%, transparent 85%)',
        }}
      />

      {/* 3. ATMOSPHERIC PARTICLES (WARM DUST IN LIGHT BEAM) */}
      <canvas
        ref={particlesCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-[2] opacity-75"
        aria-hidden="true"
      />

      {/* 4. HIGH-CONTRAST CONTEMPLATIVE SHADOWS & SCRIM */}
      <div
        className="absolute inset-0 pointer-events-none z-[3] transition-all duration-300"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse 95% 85% at 50% 38%, rgba(8, 14, 11, 0.58) 0%, rgba(8, 14, 11, 0.82) 60%, #080e0b 100%)'
              : theme === 'green'
              ? 'radial-gradient(ellipse 95% 85% at 50% 38%, rgba(238, 248, 242, 0.68) 0%, rgba(238, 248, 242, 0.86) 60%, #EEF8F2 100%)'
              : theme === 'bookpaper'
              ? 'radial-gradient(ellipse 95% 85% at 50% 38%, rgba(245, 239, 230, 0.65) 0%, rgba(245, 239, 230, 0.84) 60%, #F5EFE6 100%)'
              : 'radial-gradient(ellipse 95% 85% at 50% 38%, rgba(250, 252, 250, 0.70) 0%, rgba(250, 252, 250, 0.88) 60%, #FAFCFA 100%)',
        }}
      />

      {/* 5. DEEP BOTTOM SEAMLESS TONAL BLEND */}
      <div
        className="absolute inset-x-0 bottom-0 h-44 sm:h-60 pointer-events-none z-[4] transition-all duration-300"
        style={{
          background:
            theme === 'dark'
              ? 'linear-gradient(to bottom, transparent 0%, rgba(8, 14, 11, 0.65) 50%, #080e0b 100%)'
              : theme === 'green'
              ? 'linear-gradient(to bottom, transparent 0%, rgba(238, 248, 242, 0.7) 50%, #EEF8F2 100%)'
              : theme === 'bookpaper'
              ? 'linear-gradient(to bottom, transparent 0%, rgba(245, 239, 230, 0.7) 50%, #F5EFE6 100%)'
              : 'linear-gradient(to bottom, transparent 0%, rgba(250, 252, 250, 0.7) 50%, #FAFCFA 100%)',
        }}
      />

      {/* 6. CENTRAL HERO CONTENT (HIGH-LEGIBILITY TYPOGRAPHY) */}
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-7 py-20">
        
        {/* Badge Indicator */}
        <div ref={badgeRef} className="flex justify-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-canvas-surface/85 backdrop-blur-md border border-hairline text-ink-secondary text-xs font-medium shadow-subtle">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Corpus Morfologi &amp; Tadabbur Bahasa Al-Qur&apos;an</span>
          </div>
        </div>

        {/* Majestic Central Title */}
        <h1
          ref={headingRef}
          className="text-4xl sm:text-6xl lg:text-7xl font-light text-ink-primary tracking-tight font-sans leading-[1.12] drop-shadow-sm"
        >
          Membedah Kedalaman <br />
          <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
        </h1>

        {/* Contemplative Subtitle */}
        <p
          ref={descriptionRef}
          className="text-base sm:text-lg lg:text-xl text-ink-secondary font-normal max-w-2xl mx-auto leading-relaxed font-sans"
        >
          Jelajahi akar kata, analisis per kata, morfologi Sharaf, dan tafsir linguistik klasik Al-Qur&apos;an secara jernih, terstruktur, dan mendalam.
        </p>

        {/* Elegant Action Buttons */}
        <div
          ref={actionsRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3"
        >
          <Link
            href="/baca"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full shadow-subtle hover:shadow-soft transition-all active:scale-95 font-sans"
          >
            <BookMarked className="w-4 h-4" />
            <span>Mulai Membaca &amp; Mentadabburi</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <button
            onClick={onOpenSearch}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-canvas-surface/90 hover:bg-canvas-surface border border-hairline hover:border-primary/40 text-ink-primary font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-subtle transition-all font-sans"
          >
            <Search className="w-4 h-4 text-primary" />
            <span>Cari Akar Kata (⌘K)</span>
          </button>
        </div>

        {/* Quiet Real Last Search Link */}
        {lastSearch && (
          <div
            ref={lastSearchRef}
            className="flex items-center justify-center space-x-2 text-xs text-ink-mute font-sans pt-1"
          >
            <span>Pencarian terakhir:</span>
            <button
              onClick={onOpenSearch}
              className="text-primary hover:underline font-medium"
            >
              {lastSearch}
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
