'use client';

import { useState } from 'react';
import { Layers, BookOpen, ShieldCheck } from 'lucide-react';
import { DerivativeWord } from '@/lib/types/morphology';

interface DerivativesGridProps {
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
}

export default function DerivativesGrid({ verbs, nouns }: DerivativesGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verbs' | 'nouns'>('all');

  const displayedItems = 
    activeTab === 'verbs' ? verbs :
    activeTab === 'nouns' ? nouns :
    [...verbs, ...nouns];

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-hairline">
        <div>
          <h3 className="text-2xl font-light text-ink-primary flex items-center space-x-2.5 font-sans">
            <Layers className="w-6 h-6 text-primary" />
            <span>Bentuk Kata Kerja &amp; Kata Benda</span>
          </h3>
          <p className="text-sm text-ink-mute mt-1 font-sans">Penjelasan tata bahasa Sharaf per turunan kata dalam Al-Qur&apos;an</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 p-1.5 rounded-full bg-canvas-soft border border-hairline text-xs sm:text-sm font-sans">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white font-semibold shadow-subtle'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            Semua ({verbs.length + nouns.length})
          </button>
          <button
            onClick={() => setActiveTab('verbs')}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'verbs'
                ? 'bg-primary text-white font-semibold shadow-subtle'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kata Kerja ({verbs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('nouns')}
            className={`px-4 py-2 rounded-full font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'nouns'
                ? 'bg-primary text-white font-semibold shadow-subtle'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kata Benda ({nouns.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Derivative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedItems.map((item) => {
          const isVerb = item.type === 'verb';
          return (
            <div
              key={item.id}
              className="bg-canvas-surface p-6 rounded-3xl border border-hairline shadow-subtle hover:shadow-soft hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-3 py-1 rounded-xl font-bold font-sans ${
                    isVerb 
                      ? 'bg-primary-subdued text-primary' 
                      : 'bg-primary-fixed text-primary-deep'
                  }`}>
                    {item.posTag} {item.form ? `• ${item.form}` : ''}
                  </span>

                  <span className="text-xs text-ink-mute bg-canvas-soft px-2.5 py-1 rounded-lg font-sans font-semibold">
                    {item.frequency}x
                  </span>
                </div>

                {/* Arabic Derivative Text */}
                <div className="text-right my-2">
                  <span className="font-arabic text-3xl sm:text-4xl font-bold text-ink-primary block leading-tight" dir="rtl">
                    {item.arabic}
                  </span>
                  <span className="block text-xs sm:text-sm text-ink-mute italic font-sans mt-1">
                    {item.transliteration}
                  </span>
                </div>
              </div>

              {/* Meaning in Indonesian */}
              <div className="pt-3 border-t border-hairline space-y-1 font-sans">
                <span className="text-xs text-ink-mute block font-semibold uppercase tracking-wider">Arti Bahasa Indonesia:</span>
                <span className="text-sm sm:text-base font-bold text-ink-primary block">{item.meaningIndo}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Small Reference Badge in Bottom Corner */}
      <div className="pt-2 flex justify-end">
        <span className="inline-flex items-center space-x-1.5 text-xs text-ink-mute font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Sumber: Morfologi Sharaf Quranic Arabic Corpus (Univ. of Leeds)</span>
        </span>
      </div>
    </div>
  );
}
