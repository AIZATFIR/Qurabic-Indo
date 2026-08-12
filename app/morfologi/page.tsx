'use client';

import { useState } from 'react';
import { Layers, Search, Compass } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { searchRoots } from '@/lib/search/root-search';
import RootCard from '@/components/RootCard';

export default function MorfologiPage() {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'high_verbs' | 'high_nouns'>('all');

  let filteredRoots = searchRoots(filterQuery);

  if (selectedCategory === 'high_verbs') {
    filteredRoots = filteredRoots.filter(r => r.verbsCount >= r.nounsCount);
  } else if (selectedCategory === 'high_nouns') {
    filteredRoots = filteredRoots.filter(r => r.nounsCount > r.verbsCount);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-white border border-hairline shadow-soft gradient-mesh space-y-4">
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
      </div>

      {/* Root Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-ink-mute font-mono">
          <span>Menampilkan <strong>{filteredRoots.length}</strong> akar kata</span>
          <span>Diurutkan berdasarkan relevansi</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoots.map((root) => (
            <RootCard key={root.id} root={root} />
          ))}
        </div>
      </div>
    </div>
  );
}
