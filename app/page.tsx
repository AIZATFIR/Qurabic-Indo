'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Sparkles, BookOpen, Layers, Compass, Heart, BookMarked, Globe, ShieldCheck } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';
import AmbientHeroCanvas from '@/components/AmbientHeroCanvas';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="space-y-16 pb-16">
      
      {/* IMMERSIVE GOOGLE-FLOW INSPIRED HERO SECTION */}
      <header className="relative pt-24 pb-24 overflow-hidden bg-white border-b border-hairline">
        
        {/* Ambient Video & Light Mesh Flow Canvas */}
        <AmbientHeroCanvas />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/90 border border-hairline shadow-soft text-ink-primary text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Quranic Arabic Corpus • Versi Bahasa Indonesia</span>
          </div>

          {/* Main Editorial Title */}
          <h1 className="text-5xl sm:text-7xl font-light text-ink-primary tracking-tight font-sans leading-tight">
            Membedah Kedalaman <br />
            <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 font-light max-w-2xl mx-auto leading-relaxed font-sans">
            Jelajahi hubungan morfologi, etimologi klasik, dan analisis per kata dengan pengalaman membaca yang bersahabat, jernih, dan mendalam.
          </p>

          {/* Search Pill Input */}
          <div className="max-w-2xl mx-auto relative group pt-2">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
            <input
              onClick={() => setIsSearchOpen(true)}
              readOnly
              type="text"
              placeholder="Cari akar kata (Arab / Latin 'sabar' / Indonesia 'batu')..."
              className="w-full pl-14 pr-36 py-4 rounded-full border border-hairline bg-white/95 shadow-soft hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-primary font-sans text-base text-ink-primary cursor-pointer transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white hover:bg-primary-deep font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <span>Cari</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Tags (No Emojis) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 pt-2 font-mono">
            <span className="font-medium">Populer:</span>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white border border-hairline hover:border-primary text-primary font-medium shadow-sm transition-all">
              ص-ب-ر (Sabar / Batu)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white border border-hairline hover:border-primary text-slate-700 shadow-sm transition-all">
              ص-ل-و (Sholat / Hubungan)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white border border-hairline hover:border-primary text-slate-700 shadow-sm transition-all">
              ك-ت-ب (Kitab / Ketetapan)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white border border-hairline hover:border-primary text-slate-700 shadow-sm transition-all">
              ع-ل-م (Ilmu / Tanda)
            </button>
          </div>

        </div>
      </header>

      {/* FEATURED FEATURES HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/baca" className="p-8 rounded-3xl bg-amber-50/70 border border-amber-200/80 hover:shadow-hover transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-amber-200 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookMarked className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors font-sans">
              Mode Baca Bookpaper
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Tampilan membaca mushaf klasik yang lembut di mata. Klik kata manapun untuk membedah akar kata &amp; makna etimologinya secara instant.
            </p>
          </Link>

          <Link href="/morfologi" className="p-8 rounded-3xl bg-indigo-50/70 border border-indigo-200/80 hover:shadow-hover transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-indigo-200 text-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors font-sans">
              Katalog Index Morfologi
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Filter abjad Arab (أ - ي) dan urutkan 154+ akar kata berdasarkan frekuensi kemunculan terbanyak di Al-Qur&apos;an.
            </p>
          </Link>

          <Link href="/cari?q=sholat" className="p-8 rounded-3xl bg-rose-50/70 border border-rose-200/80 hover:shadow-hover transition-all group space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors font-sans">
              Live Quran API Integration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              Menghubungkan pencarian ke AlQuran Cloud &amp; Quran.com API v4 untuk mencari seluruh kata dari 6.236 Ayat tanpa batas.
            </p>
          </Link>

        </div>
      </section>

      {/* CATALOG SECTION: EXPLORE ROOT WORDS */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline pb-4">
          <div>
            <h2 className="text-3xl font-light text-ink-primary tracking-tight font-sans">Akar Kata Populer Al-Qur&apos;an</h2>
            <p className="text-sm text-slate-500 mt-1">Inti etimologi dan turunan kata kerja (Fi&apos;il) serta kata benda (Isim) dalam Bahasa Indonesia.</p>
          </div>
          <Link
            href="/morfologi"
            className="text-sm font-semibold text-primary hover:text-primary-deep flex items-center space-x-1 transition-colors"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Column Root Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOT_DATABASE.slice(0, 9).map((root) => (
            <RootCard key={root.id} root={root} />
          ))}
        </div>

        {/* FEATURED LEMMAS SECTION */}
        <div className="pt-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline pb-4">
            <div>
              <h2 className="text-3xl font-light text-ink-primary tracking-tight font-sans">Etimologi Klasik Terpilih</h2>
              <p className="text-sm text-slate-500 mt-1">Etimologi mendalam untuk bentuk-bentuk kata kunci utama Al-Qur&apos;an.</p>
            </div>
            <Link
              href="/akar/s-b-r"
              className="text-sm font-semibold text-primary hover:text-primary-deep flex items-center space-x-1 transition-colors"
            >
              <span>Detail Etimologi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Lemma 1 */}
            <Link href="/akar/s-l-w" className="bg-white p-6 rounded-2xl border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَلَاة</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued px-2.5 py-1 rounded-full font-bold">99x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 font-sans">Sholat (ص-ل-و)</h4>
              <p className="text-xs text-slate-600 line-clamp-2">Shalawain (urat punggung yang terhubung). Hubungan spiritual hamba dengan Allah.</p>
            </Link>

            {/* Lemma 2 */}
            <Link href="/akar/s-b-r" className="bg-white p-6 rounded-2xl border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَبْر</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued px-2.5 py-1 rounded-full font-bold">103x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 font-sans">Sabar (ص-ب-ر)</h4>
              <p className="text-xs text-slate-600 line-clamp-2">Sobaro (batu licin yang sangat padat) &amp; obat pahit yang menyembuhkan.</p>
            </Link>

            {/* Lemma 3 */}
            <Link href="/akar/a-l-m" className="bg-white p-6 rounded-2xl border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">عِلْم</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued px-2.5 py-1 rounded-full font-bold">854x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 font-sans">Ilmu (ع-ل-م)</h4>
              <p className="text-xs text-slate-600 line-clamp-2">Alam (tanda penunjuk jalan). Pengetahuan mendalam yang memberi arah.</p>
            </Link>

            {/* Lemma 4 */}
            <Link href="/akar/r-h-m" className="bg-white p-6 rounded-2xl border border-hairline hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">رَحْمَة</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued px-2.5 py-1 rounded-full font-bold">339x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 font-sans">Rahmat (ر-ح-م)</h4>
              <p className="text-xs text-slate-600 line-clamp-2">Rahim (kandungan ibu). Kasih sayang yang memberi kehidupan dan pelindungan.</p>
            </Link>
          </div>
        </div>

      </main>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
