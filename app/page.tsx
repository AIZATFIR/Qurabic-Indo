'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  BookOpen,
  Layers,
  Compass,
  Heart,
  BookMarked,
  Globe,
  Shuffle
} from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';
import AmbientHeroCanvas from '@/components/AmbientHeroCanvas';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="space-y-16 pb-16">
      
      {/* HERO SECTION */}
      <header className="relative pt-20 pb-20 overflow-hidden bg-white dark:bg-[#090d16] border-b border-hairline dark:border-slate-800">
        <AmbientHeroCanvas />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 border border-hairline dark:border-slate-700 shadow-soft text-ink-primary dark:text-slate-200 text-xs font-mono font-medium">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Quranic Corpus &amp; Morfologi Bahasa Indonesia</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-light text-ink-primary dark:text-white tracking-tight font-sans leading-tight">
            Membedah Kedalaman <br />
            <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-light max-w-xl mx-auto leading-relaxed font-sans">
            Eksplorasi etimologi klasik, akar kata, dan analisis per kata Al-Qur&apos;an dengan jernih dan mendalam.
          </p>

          {/* Search Pill Input */}
          <div className="max-w-2xl mx-auto relative group pt-1">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" />
            <input
              onClick={() => setIsSearchOpen(true)}
              readOnly
              type="text"
              placeholder="Cari kata atau akar kata (sabar, كتب, batu)..."
              className="w-full pl-14 pr-36 py-4 rounded-full border border-hairline dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 shadow-soft hover:shadow-hover focus:outline-none focus:ring-2 focus:ring-primary font-sans text-base text-ink-primary dark:text-white cursor-pointer transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white hover:bg-primary-deep font-semibold text-sm px-6 py-2.5 rounded-full transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <span>Cari</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 font-mono">
            <span className="font-medium">Populer:</span>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-hairline dark:border-slate-700 hover:border-primary text-primary font-medium shadow-sm transition-all">
              ص-ب-ر (Sabar)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-hairline dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300 shadow-sm transition-all">
              ص-ل-و (Sholat)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-hairline dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300 shadow-sm transition-all">
              ك-ت-ب (Kitab)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-hairline dark:border-slate-700 hover:border-primary text-slate-700 dark:text-slate-300 shadow-sm transition-all">
              ع-ل-م (Ilmu)
            </button>
          </div>

        </div>
      </header>

      {/* FEATURED FEATURES HIGHLIGHT BANNER */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link href="/baca" className="p-7 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 hover:shadow-hover transition-all group space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookMarked className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors font-sans">
              Mode Baca &amp; Bedah Kata
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Mushaf Al-Qur&apos;an interaktif dengan ukuran font besar. Klik kata manapun untuk membuka definisi, audio, dan bedah akar kata.
            </p>
          </Link>

          <Link href="/ayat-random" className="p-7 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/50 hover:shadow-hover transition-all group space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 text-indigo-800 dark:text-indigo-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Shuffle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors font-sans">
              Ayat Acak &amp; Tadabbur
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Inspirasi ayat Al-Qur&apos;an acak dari 6.236 ayat lengkap dengan audio qari dan analisis kata perkata.
            </p>
          </Link>

          <Link href="/morfologi" className="p-7 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 hover:shadow-hover transition-all group space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors font-sans">
              Katalog Index Morfologi
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              Indeks 154+ akar kata Al-Qur&apos;an berdasarkan abjad hijaiyyah, frekuensi kemunculan, dan derivasi Sharaf.
            </p>
          </Link>

        </div>
      </section>

      {/* QUICK AYAT ACAK CALLOUT SECTION */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-hover flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-800/50">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-mono font-semibold uppercase">
              <Shuffle className="w-3.5 h-3.5" />
              <span>Inspirasi Harian</span>
            </div>
            <h3 className="text-2xl font-light font-sans tracking-tight">
              Tadabbur Ayat Acak Al-Qur&apos;an
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl">
              Buka ayat secara acak untuk refleksi harian, audio murottal, dan bedah makna kata perkata.
            </p>
          </div>

          <Link
            href="/ayat-random"
            className="inline-flex items-center space-x-2 bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-6 py-3 rounded-full text-sm shadow-soft hover:shadow-hover transition-all whitespace-nowrap group"
          >
            <Shuffle className="w-4 h-4 text-indigo-600" />
            <span>Buka Ayat Acak</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CATALOG SECTION: EXPLORE ROOT WORDS */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-ink-primary dark:text-white tracking-tight font-sans">Akar Kata Populer Al-Qur&apos;an</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Etimologi dan turunan kata kerja (Fi&apos;il) serta kata benda (Isim) dalam Bahasa Indonesia.</p>
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
        <div className="pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-ink-primary dark:text-white tracking-tight font-sans">Etimologi Klasik Terpilih</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Wawasan etimologis mendalam dari Lisan al-Arab &amp; Mu&apos;jam Maqayis al-Lughah.</p>
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
            <Link href="/akar/s-l-w" className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-hairline dark:border-slate-800 hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary dark:text-white group-hover:text-primary transition-colors" dir="rtl">صَلَاة</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued dark:bg-primary/20 px-2.5 py-1 rounded-full font-bold">99x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">Sholat (ص-ل-و)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Shalawain (urat punggung yang terhubung). Hubungan spiritual hamba dengan Allah.</p>
            </Link>

            {/* Lemma 2 */}
            <Link href="/akar/s-b-r" className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-hairline dark:border-slate-800 hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary dark:text-white group-hover:text-primary transition-colors" dir="rtl">صَبْر</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued dark:bg-primary/20 px-2.5 py-1 rounded-full font-bold">103x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">Sabar (ص-ب-ر)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Sobaro (batu licin yang sangat padat) &amp; obat pahit yang menyembuhkan.</p>
            </Link>

            {/* Lemma 3 */}
            <Link href="/akar/a-l-m" className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-hairline dark:border-slate-800 hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary dark:text-white group-hover:text-primary transition-colors" dir="rtl">عِلْم</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued dark:bg-primary/20 px-2.5 py-1 rounded-full font-bold">854x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">Ilmu (ع-ل-م)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Alam (tanda penunjuk jalan). Pengetahuan mendalam yang memberi arah.</p>
            </Link>

            {/* Lemma 4 */}
            <Link href="/akar/r-h-m" className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-hairline dark:border-slate-800 hover:border-primary-subdued hover:shadow-soft transition-all group space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary dark:text-white group-hover:text-primary transition-colors" dir="rtl">رَحْمَة</span>
                <span className="font-mono text-xs text-primary bg-primary-subdued dark:bg-primary/20 px-2.5 py-1 rounded-full font-bold">339x</span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-sans">Rahmat (ر-ح-م)</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">Rahim (kandungan ibu). Kasih sayang yang memberi kehidupan dan perlindungan.</p>
            </Link>
          </div>
        </div>

      </main>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
