'use client';

import React from 'react';
import Link from 'next/link';
import { X, Sparkles, BookOpen, Layers, ArrowRight, Compass, Info } from 'lucide-react';
import { searchRoots } from '@/lib/search/root-search';
import { RootWord } from '@/lib/types/morphology';

interface WordEtymologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  wordArabic: string;
  transliteration?: string;
  meaningIndo?: string;
  posTag?: string;
  matchedRootSlug?: string;
}

export default function WordEtymologyModal({
  isOpen,
  onClose,
  wordArabic,
  transliteration,
  meaningIndo,
  posTag,
  matchedRootSlug,
}: WordEtymologyModalProps) {
  if (!isOpen) return null;

  // Search local root database for matching root
  let root: RootWord | undefined;
  if (matchedRootSlug) {
    const searchRes = searchRoots(matchedRootSlug);
    root = searchRes[0];
  }

  // Fallback search with cleaned word if root slug not provided directly
  if (!root && wordArabic) {
    const cleanWord = wordArabic.replace(/[ًٌٍَُِّْٰٓ]/g, '').trim();
    const matches = searchRoots(cleanWord);
    if (matches.length > 0) {
      root = matches[0];
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white border border-hairline rounded-3xl shadow-hover overflow-hidden z-10 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-primary-subdued text-primary-deep">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-ink-primary text-base font-sans">
                Bedah Akar Kata Al-Qur&apos;an
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Etimologi &amp; Morphological Breakdown
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-ink-primary hover:bg-canvas-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Word Display Banner */}
        <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 text-xs font-mono font-bold">
                {posTag || 'Kata Al-Qur\'an'}
              </span>
              {transliteration && (
                <span className="text-xs text-amber-800 font-mono italic">
                  {transliteration}
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 font-sans">
              Arti: &ldquo;<span className="text-primary">{meaningIndo || 'Kemunculan Kata Al-Qur\'an'}</span>&rdquo;
            </p>
          </div>

          <div className="text-right">
            <span className="font-arabic-lg text-3xl sm:text-4xl font-bold text-primary block leading-none">
              {wordArabic}
            </span>
          </div>
        </div>

        {/* Matched Root Etymology Analysis */}
        {root ? (
          <div className="space-y-4 bg-canvas-soft border border-hairline p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                  AKAR KATA ASAL: <strong className="text-primary font-arabic text-base ml-1">{root.rootArabic}</strong> ({root.rootLatin})
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-subdued text-primary-deep font-mono font-bold">
                {root.totalOccurrences}x di Qur&apos;an
              </span>
            </div>

            {/* Etymology Note */}
            <div className="space-y-1.5 text-xs text-slate-700 font-sans leading-relaxed">
              <span className="font-semibold text-ink-primary flex items-center space-x-1.5 text-sm">
                <Info className="w-4 h-4 text-primary" />
                <span>Terbedah Makna Filosofis &amp; Etimologi:</span>
              </span>
              <p className="bg-white p-3 rounded-xl border border-hairline italic text-slate-600">
                {root.etymologyNote}
              </p>
            </div>

            {/* Direct Link to Database */}
            <div className="pt-2">
              <Link
                href={`/akar/${root.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white py-3 rounded-xl text-xs font-semibold shadow-soft hover:shadow-hover transition-all"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka Bedah Akar Kata Lengkap ({root.rootLatin})</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-canvas-soft border border-hairline rounded-2xl space-y-3">
            <p className="text-xs text-slate-600 font-sans">
              Kata ini terhubung dengan akar kata Al-Qur&apos;an. Anda dapat menelusuri pencarian etimologi lengkap di database corpus.
            </p>
            <Link
              href={`/cari?q=${encodeURIComponent(wordArabic)}`}
              onClick={onClose}
              className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full text-xs font-semibold shadow-soft"
            >
              <BookOpen className="w-4 h-4" />
              <span>Cari di Corpus ({wordArabic})</span>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
