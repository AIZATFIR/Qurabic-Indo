'use client';

import React, { useState } from 'react';
import { ExternalLink, Smartphone, Tablet, Monitor, Sparkles, CheckCircle, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { RECOMMENDED_APPS } from '@/lib/data/recommended-apps';
import Link from 'next/link';

export default function KalaamShowcaseFrame() {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const app = RECOMMENDED_APPS[0];

  const getFrameWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[380px]';
      case 'tablet':
        return 'max-w-[620px]';
      case 'desktop':
      default:
        return 'max-w-4xl';
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Title & Tagline Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary-subdued text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Showcase Rekomendasi Belajar Harian</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          KALAAM • <span className="font-semibold text-primary">QURANIC ARABIC</span>
        </h2>
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
          {app.tagline}. Aplikasi pendukung untuk melatih pemahaman kosakata harian yang melengkapi riset morfologi di Qurabic.
        </p>
      </div>

      {/* macOS-style Window Frame Container */}
      <div className="flex flex-col items-center">
        
        {/* Device Mode Switcher */}
        <div className="flex items-center space-x-1.5 p-1 bg-canvas-soft border border-hairline rounded-full mb-4 shadow-subtle">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              deviceMode === 'desktop'
                ? 'bg-canvas-surface text-primary shadow-subtle font-semibold'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => setDeviceMode('tablet')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              deviceMode === 'tablet'
                ? 'bg-canvas-surface text-primary shadow-subtle font-semibold'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              deviceMode === 'mobile'
                ? 'bg-canvas-surface text-primary shadow-subtle font-semibold'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* macOS Browser Mockup Window */}
        <div className={`w-full ${getFrameWidth()} bg-canvas-surface border border-hairline rounded-3xl shadow-hover overflow-hidden transition-all duration-300`}>
          
          {/* macOS Top Bar */}
          <div className="px-4 py-3 bg-canvas-soft border-b border-hairline flex items-center justify-between gap-3">
            {/* Traffic Light Dots */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-auto flex items-center space-x-2 bg-canvas-surface px-3.5 py-1.5 rounded-xl border border-hairline/80 text-xs text-ink-mute font-mono truncate">
              <span className="text-primary select-none">🔒</span>
              <span className="truncate">https://www.kalaamapp.com/</span>
            </div>

            {/* External Direct Action */}
            <a
              href="https://www.kalaamapp.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-1 text-xs font-semibold text-primary hover:underline shrink-0"
              title="Buka Website Resmi Kalaam App"
            >
              <span>Kunjungi</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Window Body: Interactive Showcase Hero Frame */}
          <div className="p-6 sm:p-10 bg-gradient-to-b from-canvas-surface to-canvas-soft space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="space-y-4 max-w-xl text-left">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <span>{app.badgeText}</span>
                  <span>•</span>
                  <span>{app.rating}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans leading-tight">
                  Kuasai 85% Bahasa Al-Qur&apos;an <br />
                  <span className="font-semibold text-primary">Cukup 10 Menit Setiap Hari</span>
                </h3>

                <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                  {app.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 text-xs sm:text-sm text-ink-secondary font-sans">
                  {app.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* Store Action Links */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={app.appUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full shadow-subtle transition-all font-sans"
                  >
                    <span>Buka Kalaam App</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {app.appleStoreUrl && (
                    <a
                      href={app.appleStoreUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-canvas-surface hover:bg-canvas-soft border border-hairline text-ink-primary text-xs font-medium px-4 py-2.5 rounded-full transition-all font-sans"
                    >
                      <span>App Store (iOS)</span>
                    </a>
                  )}

                  {app.googlePlayUrl && (
                    <a
                      href={app.googlePlayUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center space-x-1.5 bg-canvas-surface hover:bg-canvas-soft border border-hairline text-ink-primary text-xs font-medium px-4 py-2.5 rounded-full transition-all font-sans"
                    >
                      <span>Google Play (Android)</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Visual Decorative Mini Card */}
              <div className="w-full md:w-64 p-5 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle space-y-3 shrink-0">
                <div className="flex items-center justify-between border-b border-hairline pb-2">
                  <span className="text-xs font-bold text-ink-primary uppercase tracking-wider font-sans">Sinergi Belajar</span>
                  <span className="text-[10px] text-primary font-semibold bg-primary-subdued px-2 py-0.5 rounded-md">Qurabic + Kalaam</span>
                </div>
                
                <div className="space-y-2 text-xs text-ink-secondary font-sans leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-canvas-soft border border-hairline">
                    <strong className="text-ink-primary block text-[11px]">1. Hafalkan di Kalaam</strong>
                    <span>Latihan repetisi 5-10 kata baru harian.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-canvas-soft border border-hairline">
                    <strong className="text-ink-primary block text-[11px]">2. Bedah di Qurabic</strong>
                    <span>Eksplorasi akar kata &amp; gramatika Sharaf dalam konteks ayat.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* 3-Column Structured Breakdown (Inspired by User's Portfolio Structure) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        
        {/* Column 1: WHAT IT IS */}
        <div className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline space-y-3 shadow-subtle">
          <span className="text-[11px] font-bold text-primary uppercase tracking-widest block font-sans">
            01 • APA ITU KALAAM APP
          </span>
          <h4 className="text-base sm:text-lg font-bold text-ink-primary font-sans">
            Micro-Learning Kosakata Qur&apos;an
          </h4>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
            {app.whatItIs}
          </p>
        </div>

        {/* Column 2: WHY IT WORKS */}
        <div className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline space-y-3 shadow-subtle">
          <span className="text-[11px] font-bold text-primary uppercase tracking-widest block font-sans">
            02 • MENGAPA EFEKTIF
          </span>
          <h4 className="text-base sm:text-lg font-bold text-ink-primary font-sans">
            Spaced Repetition &amp; Gamifikasi
          </h4>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
            {app.whyItWorks}
          </p>
        </div>

        {/* Column 3: HOW TO COMBINE */}
        <div className="p-6 sm:p-7 rounded-3xl bg-canvas-surface border border-hairline space-y-3 shadow-subtle">
          <span className="text-[11px] font-bold text-primary uppercase tracking-widest block font-sans">
            03 • KOMBINASI DENGAN QURABIC
          </span>
          <h4 className="text-base sm:text-lg font-bold text-ink-primary font-sans">
            Alur Belajar Menyeluruh
          </h4>
          <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
            {app.howToUse}
          </p>
        </div>

      </div>

    </div>
  );
}
