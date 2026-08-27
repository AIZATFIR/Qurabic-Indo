'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, ArrowRight, Check, Hash, Sparkles } from 'lucide-react';
import { SURAH_LIST, searchSurahs, SurahMeta } from '@/lib/data/surah-list';

interface SurahSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurah: number;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
}

export default function SurahSearchModal({
  isOpen,
  onClose,
  selectedSurah,
  onSelectSurah,
}: SurahSearchModalProps) {
  const [query, setQuery] = useState('');
  const [targetAyahInput, setTargetAyahInput] = useState('');
  const [results, setResults] = useState<SurahMeta[]>(SURAH_LIST);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTargetAyahInput('');
      setResults(SURAH_LIST);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setResults(searchSurahs(query));
  }, [query]);

  if (!isOpen) return null;

  const currentSelectedMeta = SURAH_LIST.find((s) => s.number === selectedSurah) || SURAH_LIST[0];

  const handleSelect = (surahNumber: number) => {
    const ayahNum = parseInt(targetAyahInput, 10);
    onSelectSurah(surahNumber, !isNaN(ayahNum) && ayahNum > 0 ? ayahNum : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[82vh] flex flex-col bg-canvas-surface text-ink-primary border border-hairline rounded-2xl shadow-hover z-10 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Search Header */}
        <div className="p-4 border-b border-hairline space-y-3 bg-canvas-surface">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-ink-primary font-sans">
                Pilih Surah &amp; Loncat Ayat
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-ink-mute hover:text-ink-primary hover:bg-canvas-soft transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nomor surah atau nama (contoh: 55, Rahman, Kahfi, البقرة)..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-hairline bg-canvas-soft text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-mute hover:text-ink-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Surah Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] text-ink-mute font-medium mr-1 font-sans">Cepat:</span>
            {[
              { num: 1, name: 'Al-Fatihah' },
              { num: 2, name: 'Al-Baqarah' },
              { num: 18, name: 'Al-Kahf' },
              { num: 36, name: 'Yasin' },
              { num: 55, name: 'Ar-Rahman' },
              { num: 56, name: 'Al-Waqi\'ah' },
              { num: 67, name: 'Al-Mulk' },
            ].map((qs) => (
              <button
                key={qs.num}
                onClick={() => handleSelect(qs.num)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all font-sans ${
                  selectedSurah === qs.num
                    ? 'bg-primary text-white font-semibold'
                    : 'bg-canvas-soft hover:bg-primary-fixed text-ink-secondary'
                }`}
              >
                {qs.num}. {qs.name}
              </button>
            ))}
          </div>
        </div>

        {/* Surah List Results */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-hairline/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-ink-mute text-xs space-y-1 font-sans">
              <p>Surah tidak ditemukan untuk pencarian &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] opacity-75">Coba masukkan nomor surah (1 - 114) atau ejaan Latin / Arab lainnya.</p>
            </div>
          ) : (
            results.map((surah) => {
              const isSelected = selectedSurah === surah.number;

              return (
                <button
                  key={surah.number}
                  onClick={() => handleSelect(surah.number)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-canvas-soft text-ink-primary'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold font-sans flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-primary text-white shadow-subtle'
                          : 'bg-canvas-soft text-ink-secondary border border-hairline'
                      }`}
                    >
                      {surah.number}
                    </span>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold font-sans leading-tight">
                          Surah {surah.nameIndo}
                        </span>
                        <span className="text-[10px] text-ink-mute font-sans">
                          • {surah.ayahsCount} Ayat
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-mute font-sans">
                        {surah.translationId} • {surah.revelationType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-right">
                    <span className="font-arabic text-xl font-bold text-primary group-hover:scale-105 transition-transform" dir="rtl">
                      {surah.nameArabic}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Info */}
        <div className="p-2.5 bg-canvas-soft border-t border-hairline text-center text-[11px] text-ink-mute font-sans">
          Total 114 Surah Al-Qur&apos;an • Pilih untuk langsung memuat ayat &amp; bedah kata
        </div>

      </div>
    </div>
  );
}
