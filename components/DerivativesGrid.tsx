'use client';

import { useState } from 'react';
import { Layers, BookOpen, Sparkles } from 'lucide-react';
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Derivasi Bentuk Kata (Kata Kerja &amp; Benda)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Penjelasan tata bahasa Sharaf per turunan kata dalam Al-Qur&apos;an</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Semua ({verbs.length + nouns.length})
          </button>
          <button
            onClick={() => setActiveTab('verbs')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
              activeTab === 'verbs'
                ? 'bg-emerald-500 text-obsidian-950 font-bold shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kata Kerja ({verbs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('nouns')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 ${
              activeTab === 'nouns'
                ? 'bg-amber-500 text-obsidian-950 font-bold shadow-glow-amber'
                : 'text-slate-400 hover:text-white'
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
              className={`p-4 rounded-xl glass-panel border transition-all hover:scale-[1.01] ${
                isVerb 
                  ? 'border-slate-800 hover:border-emerald-500/40 bg-slate-900/60' 
                  : 'border-slate-800 hover:border-amber-500/40 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-semibold ${
                  isVerb 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {item.posTag} {item.form ? `• ${item.form}` : ''}
                </span>

                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {item.frequency}x
                </span>
              </div>

              {/* Arabic Derivative Text */}
              <div className="text-right my-2">
                <span className="font-arabic text-2xl font-bold text-white">
                  {item.arabic}
                </span>
                <span className="block text-[11px] font-mono text-slate-400 italic">
                  {item.transliteration}
                </span>
              </div>

              {/* Meaning in Indonesian */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 block">Arti Bahasa Indonesia:</span>
                <span className="font-medium">{item.meaningIndo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
