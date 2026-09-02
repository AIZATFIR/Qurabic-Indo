'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Layers, BookOpen, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { DerivativeWord } from '@/lib/types/morphology';

interface DerivativesGridProps {
  verbs: DerivativeWord[];
  nouns: DerivativeWord[];
}

export default function DerivativesGrid({ verbs = [], nouns = [] }: DerivativesGridProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'verbs' | 'nouns'>('all');
  const [expandedCorpusIds, setExpandedCorpusIds] = useState<Record<string, boolean>>({});

  const displayedItems =
    activeTab === 'verbs'
      ? verbs
      : activeTab === 'nouns'
      ? nouns
      : [...verbs, ...nouns];

  if (verbs.length === 0 && nouns.length === 0) {
    return null;
  }

  const toggleCorpusDetail = (id: string) => {
    setExpandedCorpusIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-hairline">
        <div>
          <h3 className="text-xl sm:text-2xl font-light text-ink-primary flex items-center space-x-2.5 font-sans">
            <Layers className="w-5 h-5 text-primary" />
            <span>Bentuk dalam Al-Qur&apos;an</span>
          </h3>
          <p className="text-xs sm:text-sm text-ink-mute mt-1 font-sans">
            Daftar bentuk kata verba (fi&apos;il) dan nomina (isim) yang teridentifikasi dalam korpus
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
          const isExpanded = expandedCorpusIds[item.id] || false;

          return (
            <div
              key={item.id}
              className="bg-canvas-surface p-5 sm:p-6 rounded-3xl border border-hairline shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge & Frequency */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-xl font-semibold font-sans ${
                      isVerb
                        ? 'bg-primary-subdued text-primary'
                        : 'bg-primary-fixed text-primary-deep'
                    }`}
                  >
                    {item.posTag || (isVerb ? "Fi'il" : 'Isim')} {item.form ? `· ${item.form}` : ''}
                  </span>

                  <span className="text-xs text-ink-mute font-sans font-medium">
                    {item.frequency} kemunculan
                  </span>
                </div>

                {/* Arabic Word Display (Large, Clean RTL) */}
                <div className="text-right py-1" dir="rtl">
                  <span
                    className="font-arabic text-3xl sm:text-4xl font-bold text-ink-primary block leading-[2.0]"
                    dir="rtl"
                  >
                    {item.arabic}
                  </span>
                </div>

                {/* Primary Indonesian Meaning */}
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-semibold text-ink-primary font-sans">
                    {item.meaningIndo}
                  </p>
                </div>
              </div>

              {/* Bottom Actions & Collapsible Corpus Detail */}
              <div className="pt-2 border-t border-hairline space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/kata/${encodeURIComponent(item.arabic)}`}
                      className="text-ink-primary hover:text-primary font-semibold font-sans hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Detail Kata</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <span className="text-ink-mute">·</span>
                    <a
                      href="#concordance"
                      className="text-primary hover:underline font-medium font-sans"
                    >
                      <span>{item.frequency} ayat</span>
                    </a>
                  </div>

                  <button
                    onClick={() => toggleCorpusDetail(item.id)}
                    className="text-ink-mute hover:text-ink-primary inline-flex items-center space-x-1 font-medium font-sans"
                  >
                    <span>Detail Corpus</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Collapsed Technical Corpus Detail */}
                {isExpanded && (
                  <div className="p-3 bg-canvas-soft rounded-2xl text-[11px] text-ink-secondary font-mono space-y-1 mt-2">
                    <div>
                      <span className="text-ink-mute">Buckwalter:</span> {item.buckwalter || item.transliteration}
                    </div>
                    {item.qacPos && (
                      <div>
                        <span className="text-ink-mute">QAC POS:</span> {item.qacPos}
                      </div>
                    )}
                    {item.qacFeatures && (
                      <div>
                        <span className="text-ink-mute">Normalized:</span> {item.qacFeatures}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
