'use client';

import React, { useState } from 'react';
import { Layers, BookOpen } from 'lucide-react';
import { DerivativeWord } from '@/lib/types/morphology';

interface DerivativesGridProps {
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
}

export default function DerivativesGrid({ verbs = [], nouns = [] }: DerivativesGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verbs' | 'nouns'>('all');

  const displayedItems =
    activeTab === 'verbs'
      ? verbs
      : activeTab === 'nouns'
      ? nouns
      : [...verbs, ...nouns];

  if (verbs.length === 0 && nouns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-hairline">
        <div>
          <h3 className="text-xl sm:text-2xl font-light text-ink-primary flex items-center space-x-2.5 font-sans">
            <Layers className="w-5 h-5 text-primary" />
            <span>Bentuk dalam Al-Qur&apos;an</span>
          </h3>
          <p className="text-xs sm:text-sm text-ink-mute mt-1 font-sans">
            Daftar bentuk verba (fi&apos;il) dan nomina (isim) yang teridentifikasi dalam korpus
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 p-1.5 rounded-full bg-canvas-soft border border-hairline text-xs font-sans">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white font-semibold shadow-subtle'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            Semua ({verbs.length + nouns.length})
          </button>
          {verbs.length > 0 && (
            <button
              onClick={() => setActiveTab('verbs')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'verbs'
                  ? 'bg-primary text-white font-semibold shadow-subtle'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Fi&apos;il ({verbs.length})</span>
            </button>
          )}
          {nouns.length > 0 && (
            <button
              onClick={() => setActiveTab('nouns')}
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'nouns'
                  ? 'bg-primary text-white font-semibold shadow-subtle'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Isim ({nouns.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Derivative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedItems.map((item) => {
          const isVerb = item.type === 'verb';
          return (
            <div
              key={item.id}
              className="bg-canvas-surface p-5 sm:p-6 rounded-3xl border border-hairline shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-lg font-semibold font-sans ${
                      isVerb
                        ? 'bg-primary-subdued text-primary'
                        : 'bg-primary-fixed text-primary-deep'
                    }`}
                  >
                    {item.posTag || (isVerb ? "Fi'il" : 'Isim')} {item.form ? `• ${item.form}` : ''}
                  </span>

                  <span className="text-xs text-ink-mute font-sans font-medium">
                    {item.frequency}x kemunculan
                  </span>
                </div>

                {/* Arabic Derivative Text with Proper Line Height & RTL */}
                <div className="text-right py-2" dir="rtl">
                  <span
                    className="font-arabic text-3xl sm:text-4xl font-bold text-ink-primary block leading-[2.0]"
                    dir="rtl"
                  >
                    {item.arabic}
                  </span>
                  <span className="block text-xs text-ink-mute font-sans font-medium mt-0.5 text-left" dir="ltr">
                    {item.transliteration}
                  </span>
                </div>
              </div>

              {/* Meaning Context */}
              {item.meaningIndo && !item.meaningIndo.startsWith('Bentuk kata') && (
                <div className="pt-2 border-t border-hairline text-xs text-ink-secondary font-sans leading-relaxed">
                  {item.meaningIndo}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
