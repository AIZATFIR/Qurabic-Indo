'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ArrowRight,
  BookOpen,
  Layers,
  BookMarked,
  Shuffle,
  ShieldCheck,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';
import AmbientHeroCanvas from '@/components/AmbientHeroCanvas';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastSearch, setLastSearch] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qurabic_last_search');
      if (saved) setLastSearch(saved);
    } catch (e) {}
  }, [isSearchOpen]);

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION - SPACIOUS, ELEGANT, UNCOMPRESSED */}
      <header className="relative pt-32 pb-40 sm:pt-40 sm:pb-52 min-h-[580px] sm:min-h-[680px] flex flex-col justify-center overflow-hidden border-b border-hairline transition-colors">
        <AmbientHeroCanvas />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-7">
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-ink-primary tracking-tight font-sans leading-[1.15] drop-shadow-sm">
            Membedah Kedalaman <br />
            <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-ink-secondary font-normal max-w-2xl mx-auto leading-relaxed font-sans">
            Jelajahi akar kata, analisis per kata, morfologi Sharaf, dan tafsir linguistik klasik Al-Qur&apos;an secara jernih, terstruktur, dan mendalam.
          </p>

          {/* Hero Action Button Group (Spacious & Majestic) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/baca"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-deep text-white font-medium text-sm sm:text-base px-8 py-3.5 rounded-full shadow-subtle hover:shadow-soft transition-all active:scale-95 font-sans"
            >
              <BookMarked className="w-4 h-4" />
              <span>Mulai Membaca &amp; Mentadabburi</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-canvas-surface/90 hover:bg-canvas-surface border border-hairline hover:border-primary/40 text-ink-primary font-medium text-sm sm:text-base px-6 py-3.5 rounded-full shadow-subtle transition-all font-sans"
            >
              <Search className="w-4 h-4 text-primary" />
              <span>Cari Akar Kata (⌘K)</span>
            </button>
          </div>

          {/* Last Search (Quiet & Functional) */}
          {lastSearch && (
            <div className="flex items-center justify-center space-x-2 text-xs text-ink-mute font-sans pt-2">
              <span>Pencarian terakhir:</span>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-primary hover:underline font-medium"
              >
                {lastSearch}
              </button>
            </div>
          )}

        </div>
      </header>

      {/* FEATURED FEATURES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Mode Baca */}
          <Link
            href="/baca"
            className="p-6 sm:p-7 rounded-2xl bg-canvas-surface border border-hairline hover:border-primary/40 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center">
              <BookMarked className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Baca Qur&apos;an &amp; Bedah Kata
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed font-sans">
              Mushaf Al-Qur&apos;an dengan ukuran huruf nyaman. Klik kata manapun untuk membuka definisi, audio pelafalan, dan akar kata.
            </p>
          </Link>

          {/* Card 2: Ayat Acak */}
          <Link
            href="/ayat-random"
            className="p-6 sm:p-7 rounded-2xl bg-canvas-surface border border-hairline hover:border-primary/40 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center">
              <Shuffle className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Ayat Acak
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed font-sans">
              Ayat Al-Qur&apos;an pilihan lengkap dengan audio murottal dan analisis per kata untuk tadabbur harian.
            </p>
          </Link>

          {/* Card 3: Katalog Morfologi */}
          <Link
            href="/morfologi"
            className="p-6 sm:p-7 rounded-2xl bg-canvas-surface border border-hairline hover:border-primary/40 transition-all group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Katalog Morfologi
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed font-sans">
              Indeks akar kata Al-Qur&apos;an terorganisasi berdasarkan abjad hijaiyyah, frekuensi kemunculan, dan wazan Sharaf.
            </p>
          </Link>

        </div>
      </section>

      {/* CATALOG SECTION: EXPLORE ROOT WORDS */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
              Akar Kata Populer
            </h2>
            <p className="text-sm text-ink-mute mt-1 font-sans">
              Etimologi dan turunan kata kerja (Fi&apos;il) serta kata benda (Isim) dalam Bahasa Indonesia.
            </p>
          </div>
          <Link
            href="/morfologi"
            className="text-sm font-medium text-primary hover:underline flex items-center space-x-1 transition-colors font-sans"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
                Kajian Etimologi Klasik
              </h2>
              <p className="text-sm text-ink-mute mt-1 font-sans">
                Wawasan etimologis mendalam dari Lisan al-&apos;Arab &amp; Mu&apos;jam Maqayis al-Lughah.
              </p>
            </div>
            <Link
              href="/akar/s-b-r"
              className="text-sm font-medium text-primary hover:underline flex items-center space-x-1 transition-colors font-sans"
            >
              <span>Detail Etimologi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Lemma 1 */}
            <Link
              href="/akar/s-l-w"
              className="bg-canvas-surface p-6 rounded-2xl border border-hairline hover:border-primary/40 transition-all group space-y-2.5"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَلَاة</span>
                <span className="text-xs text-ink-mute font-medium font-sans">99x</span>
              </div>
              <h4 className="text-sm font-semibold text-ink-primary font-sans">Sholat (ص-ل-و)</h4>
              <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 font-sans leading-relaxed">Shalawain (urat punggung yang menyambungkan). Tali penyambung ruhani hamba dengan Sang Khaliq.</p>
            </Link>

            {/* Lemma 2 */}
            <Link
              href="/akar/s-b-r"
              className="bg-canvas-surface p-6 rounded-2xl border border-hairline hover:border-primary/40 transition-all group space-y-2.5"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَبْر</span>
                <span className="text-xs text-ink-mute font-medium font-sans">103x</span>
              </div>
              <h4 className="text-sm font-semibold text-ink-primary font-sans">Sabar (ص-ب-ر)</h4>
              <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 font-sans leading-relaxed">Shobarah (batu padat yang kokoh) dan obat pahit penyembuh. Ketabahan jiwa yang tidak goyah.</p>
            </Link>

            {/* Lemma 3 */}
            <Link
              href="/akar/a-l-m"
              className="bg-canvas-surface p-6 rounded-2xl border border-hairline hover:border-primary/40 transition-all group space-y-2.5"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">عِلْم</span>
                <span className="text-xs text-ink-mute font-medium font-sans">854x</span>
              </div>
              <h4 className="text-sm font-semibold text-ink-primary font-sans">Ilmu (ع-ل-م)</h4>
              <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 font-sans leading-relaxed">&apos;Alam (tanda penunjuk). Pengetahuan hakiki yang menyingkap kebenaran dan memberi arah jalan hidup.</p>
            </Link>

            {/* Lemma 4 */}
            <Link
              href="/akar/r-h-m"
              className="bg-canvas-surface p-6 rounded-2xl border border-hairline hover:border-primary/40 transition-all group space-y-2.5"
            >
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">رَحْمَة</span>
                <span className="text-xs text-ink-mute font-medium font-sans">339x</span>
              </div>
              <h4 className="text-sm font-semibold text-ink-primary font-sans">Rahmat (ر-ح-م)</h4>
              <p className="text-xs sm:text-sm text-ink-secondary line-clamp-2 font-sans leading-relaxed">Rahim (kandungan ibu). Kasih sayang mendalam yang melindungi, memelihara, dan memberi kehidupan.</p>
            </Link>
          </div>
        </div>

        {/* REKOMENDASI & SHOWCASE BELAJAR BANNER */}
        <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-primary-subdued/40 via-canvas-surface to-primary-subdued/20 border border-hairline relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-subdued text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rekomendasi Tambahan Ilmu</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
                Kajian Video Bedah Kata &amp; <br />
                <span className="font-semibold text-primary">Aplikasi Belajar Harian (Kalaam)</span>
              </h3>
              <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
                Tonton kurasi video favorit yang membedah rahasia bahasa Al-Qur&apos;an dan jelajahi showcase aplikasi belajar kosakata harian.
              </p>
            </div>

            <Link
              href="/rekomendasi"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-subtle hover:shadow-soft transition-all shrink-0 font-sans"
            >
              <span>Buka Halaman Rekomendasi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* PROVENANCE & REFERENCES SECTION (Source of Truth) */}
        <section className="p-7 sm:p-10 rounded-2xl bg-canvas-surface border border-hairline space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-4">
            <div>
              <h3 className="text-lg font-semibold text-ink-primary font-sans">
                Sumber Rujukan &amp; Provenance Data
              </h3>
              <p className="text-xs text-ink-mute font-sans mt-0.5">
                Setiap informasi dan konten dalam Qurabic terhubung langsung ke sumber rujukan otentik.
              </p>
            </div>
            <span className="text-xs text-primary font-semibold font-sans px-3 py-1 bg-primary-subdued rounded-lg self-start sm:self-auto">
              Source-Grounded Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm font-sans">
            <div className="space-y-2">
              <span className="font-semibold text-ink-primary block text-sm">
                1. Teks &amp; Terjemahan:
              </span>
              <p className="text-ink-secondary leading-relaxed">
                Teks Rasm Utsmani (Madinah) dan Terjemahan Bahasa Indonesia resmi dari Kementerian Agama RI &amp; Quran.com API v4.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-ink-primary block text-sm">
                2. Leksikografi Klasik:
              </span>
              <p className="text-ink-secondary leading-relaxed">
                Kajian etimologi berlandaskan <em>Lisān al-&apos;Arab</em> (Ibn Manzhur), <em>Maqāyīs al-Lughah</em> (Ibn Faris), dan <em>Al-Mufradāt</em> (Ar-Raghib Al-Isfahani).
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-ink-primary block text-sm">
                3. Quranic Arabic Corpus:
              </span>
              <p className="text-ink-secondary leading-relaxed">
                Anotasi part-of-speech (POS) dan dekomposisi morfologi Sharaf dari riset komputasi bahasa University of Leeds.
              </p>
              <a
                href="https://corpus.quran.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-primary hover:underline font-medium text-xs pt-1"
              >
                <span>corpus.quran.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2">
              <span className="font-semibold text-ink-primary block text-sm">
                4. Tilawah Per-Ayat:
              </span>
              <p className="text-ink-secondary leading-relaxed">
                Audio tilawah otentik Syaikh Mishary Rashid Al-Afasy bersumber dari repository EveryAyah dengan sinkronisasi per ayat.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* OmniSearch Modal */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
