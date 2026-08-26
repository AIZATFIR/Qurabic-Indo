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
  Shuffle
} from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';
import AmbientHeroCanvas from '@/components/AmbientHeroCanvas';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="space-y-14 pb-16">
      
      {/* HERO SECTION */}
      <header className="relative pt-16 pb-16 bg-canvas border-b border-hairline transition-colors">
        <AmbientHeroCanvas />

        <div className="max-w-3xl mx-auto px-6 text-center relative z-10 space-y-5">
          
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary-deep border border-primary/20 text-xs font-semibold font-sans">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
            <span>Quranic Corpus &amp; Morfologi Bahasa Indonesia</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-ink-primary tracking-tight font-sans leading-tight">
            Membedah Kedalaman <br />
            <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
          </h1>

          <p className="text-sm sm:text-base text-ink-secondary font-light max-w-lg mx-auto leading-relaxed font-sans">
            Eksplorasi etimologi klasik, akar kata, dan analisis per kata Al-Qur&apos;an dengan jernih dan mendalam.
          </p>

          {/* Search Input */}
          <div className="max-w-xl mx-auto relative group pt-2">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute group-hover:text-primary transition-colors" />
            <input
              onClick={() => setIsSearchOpen(true)}
              readOnly
              type="text"
              placeholder="Cari kata atau akar kata (sabar, كتب, batu)..."
              className="w-full pl-11 pr-28 py-3.5 rounded-full border border-hairline bg-canvas-surface shadow-subtle hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans text-sm text-ink-primary cursor-pointer transition-all placeholder:text-ink-mute"
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-deep text-white font-medium text-xs px-5 py-2 rounded-full transition-all flex items-center space-x-1.5 shadow-soft hover:shadow-hover"
            >
              <span>Cari</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-ink-mute pt-1">
            <span className="font-medium">Populer:</span>
            {['ص-ب-ر (Sabar)', 'ص-ل-و (Sholat)', 'ك-ت-ب (Kitab)', 'ع-ل-م (Ilmu)'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setIsSearchOpen(true)}
                className="px-2.5 py-1 rounded-md text-ink-secondary hover:text-primary hover:bg-primary-fixed transition-colors font-sans"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* FEATURED FEATURES HIGHLIGHT (SEAMLESS MULTI-THEME CARDS) */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Mode Baca */}
          <Link
            href="/baca"
            className="p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle hover:shadow-soft hover:border-primary/40 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
              <BookMarked className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Mode Baca &amp; Bedah Kata
            </h3>
            <p className="text-xs text-ink-mute leading-relaxed font-sans">
              Mushaf Al-Qur&apos;an interaktif dengan ukuran font besar. Klik kata manapun untuk membuka definisi, audio, dan bedah akar kata.
            </p>
          </Link>

          {/* Card 2: Ayat Acak */}
          <Link
            href="/ayat-random"
            className="p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle hover:shadow-soft hover:border-primary/40 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
              <Shuffle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Ayat Acak &amp; Tadabbur
            </h3>
            <p className="text-xs text-ink-mute leading-relaxed font-sans">
              Inspirasi ayat Al-Qur&apos;an acak dari 6.236 ayat lengkap dengan audio qari dan analisis kata perkata.
            </p>
          </Link>

          {/* Card 3: Katalog Morfologi */}
          <Link
            href="/morfologi"
            className="p-6 rounded-2xl bg-canvas-surface border border-hairline shadow-subtle hover:shadow-soft hover:border-primary/40 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Katalog Index Morfologi
            </h3>
            <p className="text-xs text-ink-mute leading-relaxed font-sans">
              Indeks 154+ akar kata Al-Qur&apos;an berdasarkan abjad hijaiyyah, frekuensi kemunculan, dan derivasi Sharaf.
            </p>
          </Link>

        </div>
      </section>

      {/* QUICK AYAT ACAK CALLOUT - Theme Aware */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="p-6 sm:p-8 rounded-2xl bg-primary text-white shadow-soft flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-primary-fixed opacity-90 font-semibold font-sans">
              Inspirasi Harian
            </span>
            <h3 className="text-xl sm:text-2xl font-light font-sans tracking-tight">
              Tadabbur Ayat Acak Al-Qur&apos;an
            </h3>
            <p className="text-xs opacity-90 max-w-xl font-sans">
              Buka ayat secara acak untuk refleksi harian, audio murottal, dan bedah makna kata perkata.
            </p>
          </div>

          <Link
            href="/ayat-random"
            className="inline-flex items-center space-x-2 bg-canvas-surface text-primary hover:bg-canvas-soft font-bold px-5 py-2.5 rounded-full text-xs shadow-soft hover:shadow-hover transition-all whitespace-nowrap group"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Buka Ayat Acak</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* CATALOG SECTION: EXPLORE ROOT WORDS */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight font-sans">
              Akar Kata Populer Al-Qur&apos;an
            </h2>
            <p className="text-xs text-ink-mute mt-0.5 font-sans">
              Etimologi dan turunan kata kerja (Fi&apos;il) serta kata benda (Isim) dalam Bahasa Indonesia.
            </p>
          </div>
          <Link
            href="/morfologi"
            className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1 transition-colors"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Column Root Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROOT_DATABASE.slice(0, 9).map((root) => (
            <RootCard key={root.id} root={root} />
          ))}
        </div>

        {/* FEATURED LEMMAS SECTION */}
        <div className="pt-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 border-b border-hairline pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-light text-ink-primary tracking-tight font-sans">
                Etimologi Klasik Terpilih
              </h2>
              <p className="text-xs text-ink-mute mt-0.5 font-sans">
                Wawasan etimologis mendalam dari Lisan al-Arab &amp; Mu&apos;jam Maqayis al-Lughah.
              </p>
            </div>
            <Link
              href="/akar/s-b-r"
              className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1 transition-colors"
            >
              <span>Detail Etimologi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Lemma 1 */}
            <Link
              href="/akar/s-l-w"
              className="bg-canvas-surface p-5 rounded-2xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَلَاة</span>
                <span className="text-[11px] text-primary bg-primary-fixed px-2 py-0.5 rounded font-medium font-sans">99x</span>
              </div>
              <h4 className="text-xs font-bold text-ink-primary font-sans">Sholat (ص-ل-و)</h4>
              <p className="text-xs text-ink-mute line-clamp-2 font-sans">Shalawain (urat punggung yang terhubung). Hubungan spiritual hamba dengan Allah.</p>
            </Link>

            {/* Lemma 2 */}
            <Link
              href="/akar/s-b-r"
              className="bg-canvas-surface p-5 rounded-2xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَبْر</span>
                <span className="text-[11px] text-primary bg-primary-fixed px-2 py-0.5 rounded font-medium font-sans">103x</span>
              </div>
              <h4 className="text-xs font-bold text-ink-primary font-sans">Sabar (ص-ب-ر)</h4>
              <p className="text-xs text-ink-mute line-clamp-2 font-sans">Sobaro (batu licin yang sangat padat) &amp; obat pahit yang menyembuhkan.</p>
            </Link>

            {/* Lemma 3 */}
            <Link
              href="/akar/a-l-m"
              className="bg-canvas-surface p-5 rounded-2xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">عِلْم</span>
                <span className="text-[11px] text-primary bg-primary-fixed px-2 py-0.5 rounded font-medium font-sans">854x</span>
              </div>
              <h4 className="text-xs font-bold text-ink-primary font-sans">Ilmu (ع-ل-م)</h4>
              <p className="text-xs text-ink-mute line-clamp-2 font-sans">Alam (tanda penunjuk jalan). Pengetahuan mendalam yang memberi arah.</p>
            </Link>

            {/* Lemma 4 */}
            <Link
              href="/akar/r-h-m"
              className="bg-canvas-surface p-5 rounded-2xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">رَحْمَة</span>
                <span className="text-[11px] text-primary bg-primary-fixed px-2 py-0.5 rounded font-medium font-sans">339x</span>
              </div>
              <h4 className="text-xs font-bold text-ink-primary font-sans">Rahmat (ر-ح-م)</h4>
              <p className="text-xs text-ink-mute line-clamp-2 font-sans">Rahim (kandungan ibu). Kasih sayang yang memberi kehidupan dan perlindungan.</p>
            </Link>
          </div>
        </div>

      </main>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
