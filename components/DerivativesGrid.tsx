'use client';

import { useState } from 'react';
import { Layers, BookOpen } from 'lucide-react';
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
    <div className="space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-hairline">
        <div>
          <h3 className="text-xl font-light text-ink-primary flex items-center space-x-2">
            <Layers className="w-5 h-5 text-primary" />
            <span>Derivasi Bentuk Kata (Kata Kerja &amp; Benda)</span>
          </h3>
          <p className="text-xs text-ink-mute mt-0.5">Penjelasan tata bahasa Sharaf per turunan kata dalam Al-Qur&apos;an</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 p-1 rounded-full bg-canvas-soft border border-hairline text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            Semua ({verbs.length + nouns.length})
          </button>
          <button
            onClick={() => setActiveTab('verbs')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center space-x-1 ${
              activeTab === 'verbs'
                ? 'bg-primary text-white font-semibold shadow-sm'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kata Kerja ({verbs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('nouns')}
            className={`px-3.5 py-1.5 rounded-full font-medium transition-all flex items-center space-x-1 ${
              activeTab === 'nouns'
                ? 'bg-amber-600 text-white font-semibold shadow-sm'
                : 'text-ink-mute hover:text-ink-primary'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kata Benda ({nouns.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Derivative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedItems.map((item) => {
          const isVerb = item.type === 'verb';
          return (
            <div
              key={item.id}
              className="bg-white p-5 rounded-xl border border-hairline shadow-soft hover:shadow-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                    isVerb 
                      ? 'bg-primary-subdued text-primary-deep' 
                      : 'bg-amber-100 text-amber-900 border border-amber-200'
                  }`}>
                    {item.posTag} {item.form ? `• ${item.form}` : ''}
                  </span>

                  <span className="font-mono text-xs text-ink-mute bg-canvas-soft px-2 py-0.5 rounded">
                    {item.frequency}x
                  </span>
                </div>

                {/* Arabic Derivative Text */}
                <div className="text-right my-2">
                  <span className="font-arabic text-2xl font-bold text-ink-primary">
                    {item.arabic}
                  </span>
                  <span className="block text-[11px] font-mono text-ink-mute italic">
                    {item.transliteration}
                  </span>
                </div>
              </div>

              {/* Meaning in Indonesian */}
              <div className="mt-3 pt-2.5 border-t border-hairline text-xs text-ink-secondary">
                <span className="text-[10px] text-ink-mute block">Arti Bahasa Indonesia:</span>
                <span className="font-medium">{item.meaningIndo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
