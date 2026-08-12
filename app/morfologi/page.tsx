'use client';

import { useState } from 'react';
import { Layers, Search, Filter, Compass } from 'lucide-react';
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
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
          <Layers className="w-3.5 h-3.5" />
          <span>Katalog Index Morfologi</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Database Akar Kata Al-Qur&apos;an
        </h1>

        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Koleksi indeks akar kata Al-Qur&apos;an berbahasa Indonesia. Jelajahi turunan kata kerja (Fi&apos;il), kata benda (Isim), dan wawasan etimologi secara instan.
        </p>

        {/* Filter & Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter akar kata (contoh: sabar, كتب, batu)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs w-full sm:w-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-emerald-500 text-obsidian-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({ROOT_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedCategory('high_verbs')}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'high_verbs'
                  ? 'bg-emerald-500 text-obsidian-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Banyak Fi&apos;il
            </button>
            <button
              onClick={() => setSelectedCategory('high_nouns')}
              className={`px-3 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === 'high_nouns'
                  ? 'bg-amber-500 text-obsidian-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Banyak Isim
            </button>
          </div>
        </div>
      </div>

      {/* Root Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Menampilkan <strong>{filteredRoots.length}</strong> akar kata</span>
          <span>Diurutkan berdasarkan relevansi</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoots.map((root) => (
            <RootCard key={root.id} root={root} />
          ))}
        </div>
      </div>
    </div>
  );
}
