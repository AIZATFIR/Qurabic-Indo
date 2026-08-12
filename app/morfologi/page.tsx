'use client';

import { useState } from 'react';
import { Layers, Search, Compass, X } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { searchRoots, stripArabicHarakat } from '@/lib/search/root-search';
import RootCard from '@/components/RootCard';

const HIJAIYYAH_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

export default function MorfologiPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'high_verbs' | 'high_nouns'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  let filteredRoots = searchRoots(filterQuery);

  if (selectedLetter) {
    filteredRoots = filteredRoots.filter((r) => {
      const firstChar = stripArabicHarakat(r.rootArabicJoined.trim())[0];
      return firstChar === selectedLetter || r.rootArabic.startsWith(selectedLetter);
    });
  }

  if (selectedCategory === 'high_verbs') {
    filteredRoots = filteredRoots.filter((r) => r.verbsCount >= r.nounsCount);
  } else if (selectedCategory === 'high_nouns') {
    filteredRoots = filteredRoots.filter((r) => r.nounsCount > r.verbsCount);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-hairline shadow-soft gradient-mesh space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary-subdued text-primary-deep text-xs font-semibold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          <span>Katalog Index Morfologi</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-light text-ink-primary tracking-tight font-sans">
          Database Akar Kata Al-Qur&apos;an
        </h1>

        <p className="text-sm text-ink-mute max-w-2xl leading-relaxed">
          Koleksi indeks akar kata Al-Qur&apos;an berbahasa Indonesia. Jelajahi turunan kata kerja (Fi&apos;il), kata benda (Isim), dan wawasan etimologi secara instan.
        </p>

        {/* Filter & Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-primary absolute left-4 top-3.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter akar kata (contoh: sabar, كتب, batu)..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-hairline-input text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-1 p-1 rounded-full bg-canvas-soft border border-hairline text-xs w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              Semua ({ROOT_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedCategory('high_verbs')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'high_verbs'
                  ? 'bg-primary text-white font-semibold shadow-sm'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              Banyak Fi&apos;il
            </button>
            <button
              onClick={() => setSelectedCategory('high_nouns')}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === 'high_nouns'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              Banyak Isim
            </button>
          </div>
        </div>

        {/* Arabic Hijaiyyah Index Filter Bar */}
        <div className="pt-3 border-t border-hairline">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Filter Berdasarkan Huruf Abjad Arab (أ - ي):
            </span>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="inline-flex items-center space-x-1 text-xs text-rose-500 hover:text-rose-600 font-mono font-semibold"
              >
                <X className="w-3 h-3" />
                <span>Reset Huruf ({selectedLetter})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 dir-rtl">
            {HIJAIYYAH_LETTERS.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(isSelected ? null : letter)}
                  className={`w-8 h-8 rounded-xl font-arabic text-lg font-bold transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary text-white shadow-md scale-110'
                      : 'bg-canvas-soft hover:bg-slate-100 border border-hairline text-ink-primary'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Root Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-ink-mute font-mono">
          <span>Menampilkan <strong>{filteredRoots.length}</strong> akar kata</span>
          <span>Diurutkan berdasarkan relevansi</span>
        </div>

        {filteredRoots.length === 0 ? (
          <div className="p-12 text-center bg-canvas-soft border border-hairline rounded-3xl text-slate-500 font-sans">
            Tidak ada akar kata yang cocok dengan filter. Cobalah reset huruf abjad atau kata kunci pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoots.map((root) => (
              <RootCard key={root.id} root={root} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
