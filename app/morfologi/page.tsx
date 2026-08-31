'use client';

import { useState } from 'react';
import { Layers, Search, X, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { searchRoots, stripArabicHarakat } from '@/lib/search/root-search';
import RootCard from '@/components/RootCard';

const HIJAIYYAH_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

type SortOption = 'frequency_desc' | 'alphabet_ar' | 'alphabet_latin' | 'verbs_desc' | 'nouns_desc';

export default function MorfologiPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'high_verbs' | 'high_nouns'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('frequency_desc');

  let filteredRoots = searchRoots(filterQuery);

  if (selectedLetter) {
    const norm = (ch: string) => stripArabicHarakat(ch).replace(/[أإآٱ]/g, 'ا').trim();
    const targetNorm = norm(selectedLetter);

    filteredRoots = filteredRoots.filter((r) => {
      const letters = r.rootArabic.trim().split(/\s+/);
      const joined = stripArabicHarakat(r.rootArabicJoined.replace(/\s+/g, ''));
      const first = letters[0] || joined[0] || '';
      return norm(first) === targetNorm || norm(joined).startsWith(targetNorm);
    });
  }

  if (selectedCategory === 'high_verbs') {
    filteredRoots = filteredRoots.filter((r) => r.verbsCount >= r.nounsCount);
  } else if (selectedCategory === 'high_nouns') {
    filteredRoots = filteredRoots.filter((r) => r.nounsCount > r.verbsCount);
  }

  // Apply Sorting
  filteredRoots = [...filteredRoots].sort((a, b) => {
    switch (sortBy) {
      case 'frequency_desc':
        return b.totalOccurrences - a.totalOccurrences;
      case 'alphabet_ar':
        return a.rootArabicJoined.localeCompare(b.rootArabicJoined, 'ar');
      case 'alphabet_latin':
        return a.rootLatin.localeCompare(b.rootLatin, 'en');
      case 'verbs_desc':
        return b.verbsCount - a.verbsCount;
      case 'nouns_desc':
        return b.nounsCount - a.nounsCount;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle space-y-3">
        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Katalog Akar Kata <span className="font-semibold text-primary">Al-Qur&apos;an</span>
        </h1>

        <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed font-sans">
          Koleksi 154 indeks akar kata Al-Qur&apos;an berbahasa Indonesia. Jelajahi turunan kata kerja (Fi&apos;il), kata benda (Isim), dan intisari etimologi secara instan.
        </p>

        {/* Filter & Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-sans">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-mute absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Cari akar kata (contoh: sabar, كتب, batu)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-canvas-surface border border-hairline text-sm text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-subtle font-sans"
            />
          </div>

          <div className="flex items-center space-x-1 p-1 rounded-xl bg-canvas-soft border border-hairline text-xs w-full sm:w-auto font-sans">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-canvas-surface text-primary font-semibold shadow-subtle'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              Semua ({ROOT_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedCategory('high_verbs')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === 'high_verbs'
                  ? 'bg-canvas-surface text-primary font-semibold shadow-subtle'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              Banyak Fi&apos;il
            </button>
            <button
              onClick={() => setSelectedCategory('high_nouns')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedCategory === 'high_nouns'
                  ? 'bg-canvas-surface text-primary font-semibold shadow-subtle'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              Banyak Isim
            </button>
          </div>
        </div>

        {/* Arabic Hijaiyyah Index Filter Bar */}
        <div className="pt-3 border-t border-hairline font-sans">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-ink-mute uppercase tracking-wider">
              Filter Berdasarkan Huruf Abjad Arab (أ - ي):
            </span>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="inline-flex items-center space-x-1 text-xs text-primary hover:underline font-semibold"
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
                      ? 'bg-primary text-white shadow-subtle scale-105'
                      : 'bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-primary'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Root Grid Header with Sort Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans border-b border-hairline pb-3">
          <span className="text-ink-secondary">
            Menampilkan <strong className="text-ink-primary">{filteredRoots.length}</strong> akar kata
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <span className="text-ink-mute font-medium">Urutkan:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-canvas-surface border border-hairline rounded-xl px-3 py-1.5 text-xs text-ink-primary font-sans font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-subtle"
            >
              <option value="frequency_desc">Kemunculan Terbanyak</option>
              <option value="alphabet_ar">Abjad Arab (أ - ي)</option>
              <option value="alphabet_latin">Abjad Latin (A - Z)</option>
              <option value="verbs_desc">Fi&apos;il (Kata Kerja) Terbanyak</option>
              <option value="nouns_desc">Isim (Kata Benda) Terbanyak</option>
            </select>
          </div>
        </div>

        {filteredRoots.length === 0 ? (
          <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-3xl text-ink-mute font-sans shadow-subtle">
            Tidak ada akar kata yang cocok dengan filter. Cobalah reset huruf abjad atau kata kunci pencarian.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoots.map((root) => (
              <RootCard key={root.id} root={root} />
            ))}
          </div>
        )}

        {/* Subtle Citation Badge */}
        <div className="pt-4 flex justify-end">
          <span className="inline-flex items-center space-x-1 text-[11px] text-ink-mute font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>Sumber: Morfologi Quranic Arabic Corpus (Univ. of Leeds) &amp; Lisan al-&apos;Arab</span>
          </span>
        </div>
      </div>
    </div>
  );
}
