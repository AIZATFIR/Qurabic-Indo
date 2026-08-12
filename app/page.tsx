'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION WITH ATMOSPHERIC GRADIENT MESH */}
      <header className="relative pt-20 pb-20 overflow-hidden bg-white gradient-mesh border-b border-hairline">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary-subdued text-primary-deep text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versi Bahasa Indonesia • Quranic Arabic Corpus</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-light text-ink-primary tracking-tight font-sans">
            Qurabic
          </h1>

          <p className="text-lg sm:text-xl text-ink-mute font-light max-w-2xl mx-auto leading-relaxed">
            Quranic Arabic Corpus &amp; Root Word Explorer (Bahasa Indonesia)
          </p>

          {/* Search Pill Input */}
          <div className="max-w-2xl mx-auto relative group pt-2">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              onClick={() => setIsSearchOpen(true)}
              readOnly
              type="text"
              placeholder="Cari akar kata (Arab / Latin 'sabar' / Indonesia 'batu')..."
              className="w-full pl-14 pr-36 py-4 rounded-full border border-hairline-input bg-white shadow-soft hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-primary font-sans text-base text-ink-primary cursor-pointer transition-all placeholder:text-ink-mute"
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white hover:bg-primary-deep font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shadow-sm flex items-center space-x-1"
            >
              <span>Cari</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-ink-mute pt-2">
            <span className="font-medium">Populer:</span>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-canvas-soft border border-hairline hover:border-primary text-primary font-medium">
              ص-ب-ر (Sabar / Batu)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-canvas-soft border border-hairline hover:border-primary text-ink-secondary">
              ك-ت-ب (Kitab/Tulis)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-canvas-soft border border-hairline hover:border-primary text-ink-secondary">
              ع-ل-م (Ilmu/Alam)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-canvas-soft border border-hairline hover:border-primary text-ink-secondary">
              ر-ح-م (Rahmah)
            </button>
          </div>

        </div>
      </header>

      {/* CATALOG SECTION: EXPLORE ROOT WORDS */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-light text-ink-primary tracking-tight">Explore Root Words</h2>
            <p className="text-sm text-ink-mute mt-1">Browse the fundamental building blocks of the Quranic text dalam Bahasa Indonesia.</p>
          </div>
          <Link
            href="/morfologi"
            className="text-sm font-semibold text-primary hover:text-primary-deep flex items-center space-x-1 transition-colors"
          >
            <span>View All Roots</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Root Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOT_DATABASE.map((root) => (
            <RootCard key={root.id} root={root} />
          ))}
        </div>

        {/* FEATURED LEMMAS SECTION */}
        <div className="pt-12 border-t border-hairline space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-light text-ink-primary tracking-tight">Featured Lemmas</h2>
              <p className="text-sm text-ink-mute mt-1">Specific word forms and their contextual definitions in the Quran.</p>
            </div>
            <Link
              href="/akar/s-b-r"
              className="text-sm font-semibold text-primary hover:text-primary-deep flex items-center space-x-1 transition-colors"
            >
              <span>View All Lemmas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Lemma 1 */}
            <Link href="/akar/k-t-b" className="bg-white p-5 rounded-lg border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">كِتَاب</span>
                <span className="font-mono text-xs text-ink-mute bg-canvas-soft px-2.5 py-1 rounded">261</span>
              </div>
              <p className="text-xs text-ink-secondary">Kitab, buku, ketetapan hukum.</p>
            </Link>

            {/* Lemma 2 */}
            <Link href="/akar/s-b-r" className="bg-white p-5 rounded-lg border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَبْر</span>
                <span className="font-mono text-xs text-ink-mute bg-canvas-soft px-2.5 py-1 rounded">103</span>
              </div>
              <p className="text-xs text-ink-secondary">Kesabaran, ketabahan (etimologi sobaro batu).</p>
            </Link>

            {/* Lemma 3 */}
            <Link href="/akar/a-l-m" className="bg-white p-5 rounded-lg border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">عِلْم</span>
                <span className="font-mono text-xs text-ink-mute bg-canvas-soft px-2.5 py-1 rounded">854</span>
              </div>
              <p className="text-xs text-ink-secondary">Ilmu, pengetahuan, tanda.</p>
            </Link>

            {/* Lemma 4 */}
            <Link href="/akar/r-h-m" className="bg-white p-5 rounded-lg border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">رَحْمَة</span>
                <span className="font-mono text-xs text-ink-mute bg-canvas-soft px-2.5 py-1 rounded">339</span>
              </div>
              <p className="text-xs text-ink-secondary">Kasih sayang, rahmat, rahim.</p>
            </Link>
          </div>
        </div>

      </main>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
