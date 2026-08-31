'use client';

import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';
import AmbientHeroCanvas from '@/components/AmbientHeroCanvas';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <header className="relative pt-20 pb-24 sm:pt-28 sm:pb-32 bg-canvas border-b border-hairline transition-colors">
        <AmbientHeroCanvas />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-7">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary-fixed text-primary-deep border border-primary/20 text-xs sm:text-sm font-semibold font-sans shadow-subtle">
            <BookOpen className="w-4 h-4 text-primary" />
            <span>Eksplorasi Bahasa Arab Al-Qur&apos;an Berbahasa Indonesia</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light text-ink-primary tracking-tight font-sans leading-[1.15]">
            Membedah Kedalaman <br />
            <span className="font-semibold text-primary">Bahasa Al-Qur&apos;an</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-ink-secondary font-normal max-w-2xl mx-auto leading-relaxed font-sans">
            Jelajahi akar kata, analisis per kata, morfologi Sharaf, dan tafsir linguistik klasik Al-Qur&apos;an secara jernih, terstruktur, dan mendalam.
          </p>

          {/* Search Input Bar */}
          <div className="max-w-2xl mx-auto relative group pt-3">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-ink-mute group-hover:text-primary transition-colors" />
            <input
              onClick={() => setIsSearchOpen(true)}
              readOnly
              type="text"
              placeholder="Cari kata atau akar kata (contoh: sabar, كتب, sholat)..."
              className="w-full pl-14 pr-32 py-4 rounded-full border border-hairline bg-canvas-surface shadow-subtle hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans text-base text-ink-primary cursor-pointer transition-all placeholder:text-ink-mute"
            />
            <button
              onClick={() => setIsSearchOpen(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary-deep text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-all flex items-center space-x-2 shadow-subtle hover:shadow-soft"
            >
              <span>Cari</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-ink-mute pt-2 font-sans">
            <span className="font-medium text-ink-secondary">Populer:</span>
            {['ص-ب-ر (Sabar)', 'ص-ل-و (Sholat)', 'ك-ت-ب (Kitab)', 'ع-ل-م (Ilmu)'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setIsSearchOpen(true)}
                className="px-3 py-1.5 rounded-xl text-ink-secondary hover:text-primary hover:bg-primary-fixed border border-transparent hover:border-hairline transition-all font-sans"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </header>

      {/* FEATURED FEATURES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Mode Baca */}
          <Link
            href="/baca"
            className="p-7 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle hover:shadow-hover hover:border-primary/40 transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
              <BookMarked className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Mode Baca &amp; Bedah Kata
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed font-sans">
              Mushaf Al-Qur&apos;an interaktif dengan ukuran huruf nyaman. Klik kata manapun untuk membuka definisi, audio pelafalan, dan bedah akar kata.
            </p>
          </Link>

          {/* Card 2: Ayat Acak */}
          <Link
            href="/ayat-random"
            className="p-7 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle hover:shadow-hover hover:border-primary/40 transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
              <Shuffle className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Ayat Acak &amp; Tadabbur
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed font-sans">
              Inspirasi ayat Al-Qur&apos;an pilihan lengkap dengan audio murottal qari dan analisis kata perkata untuk tadabbur harian.
            </p>
          </Link>

          {/* Card 3: Katalog Morfologi */}
          <Link
            href="/morfologi"
            className="p-7 sm:p-8 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle hover:shadow-hover hover:border-primary/40 transition-all group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-subdued text-primary flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-ink-primary group-hover:text-primary transition-colors font-sans">
              Katalog Morfologi &amp; Akar Kata
            </h3>
            <p className="text-sm text-ink-mute leading-relaxed font-sans">
              Indeks 154 akar kata Al-Qur&apos;an terorganisasi berdasarkan abjad hijaiyyah, frekuensi kemunculan, dan wazan Sharaf.
            </p>
          </Link>

        </div>
      </section>

      {/* CATALOG SECTION: EXPLORE ROOT WORDS */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-hairline pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
              Akar Kata Populer Al-Qur&apos;an
            </h2>
            <p className="text-sm text-ink-mute mt-1 font-sans">
              Etimologi dan turunan kata kerja (Fi&apos;il) serta kata benda (Isim) dalam Bahasa Indonesia.
            </p>
          </div>
          <Link
            href="/morfologi"
            className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1.5 transition-colors font-sans"
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
                Kajian Etimologi Klasik Pilihan
              </h2>
              <p className="text-sm text-ink-mute mt-1 font-sans">
                Wawasan etimologis mendalam dari Lisan al-&apos;Arab &amp; Mu&apos;jam Maqayis al-Lughah.
              </p>
            </div>
            <Link
              href="/akar/s-b-r"
              className="text-sm font-semibold text-primary hover:underline flex items-center space-x-1.5 transition-colors font-sans"
            >
              <span>Detail Etimologi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Lemma 1 */}
            <Link
              href="/akar/s-l-w"
              className="bg-canvas-surface p-6 rounded-3xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَلَاة</span>
                <span className="text-xs text-primary bg-primary-fixed px-2.5 py-0.5 rounded-md font-semibold font-sans">99x</span>
              </div>
              <h4 className="text-sm font-bold text-ink-primary font-sans">Sholat (ص-ل-و)</h4>
              <p className="text-xs sm:text-sm text-ink-mute line-clamp-2 font-sans leading-relaxed">Shalawain (urat punggung yang menyambungkan). Tali penyambung ruhani hamba dengan Sang Khaliq.</p>
            </Link>

            {/* Lemma 2 */}
            <Link
              href="/akar/s-b-r"
              className="bg-canvas-surface p-6 rounded-3xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">صَبْر</span>
                <span className="text-xs text-primary bg-primary-fixed px-2.5 py-0.5 rounded-md font-semibold font-sans">103x</span>
              </div>
              <h4 className="text-sm font-bold text-ink-primary font-sans">Sabar (ص-ب-ر)</h4>
              <p className="text-xs sm:text-sm text-ink-mute line-clamp-2 font-sans leading-relaxed">Shobarah (batu padat yang kokoh) dan obat pahit penyembuh. Ketabahan jiwa yang tidak goyah.</p>
            </Link>

            {/* Lemma 3 */}
            <Link
              href="/akar/a-l-m"
              className="bg-canvas-surface p-6 rounded-3xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">عِلْم</span>
                <span className="text-xs text-primary bg-primary-fixed px-2.5 py-0.5 rounded-md font-semibold font-sans">854x</span>
              </div>
              <h4 className="text-sm font-bold text-ink-primary font-sans">Ilmu (ع-ل-م)</h4>
              <p className="text-xs sm:text-sm text-ink-mute line-clamp-2 font-sans leading-relaxed">&apos;Alam (tanda penunjuk). Pengetahuan hakiki yang menyingkap kebenaran dan memberi arah jalan hidup.</p>
            </Link>

            {/* Lemma 4 */}
            <Link
              href="/akar/r-h-m"
              className="bg-canvas-surface p-6 rounded-3xl border border-hairline hover:border-primary/40 shadow-subtle hover:shadow-soft transition-all group space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold font-arabic text-ink-primary group-hover:text-primary transition-colors" dir="rtl">رَحْمَة</span>
                <span className="text-xs text-primary bg-primary-fixed px-2.5 py-0.5 rounded-md font-semibold font-sans">339x</span>
              </div>
              <h4 className="text-sm font-bold text-ink-primary font-sans">Rahmat (ر-ح-م)</h4>
              <p className="text-xs sm:text-sm text-ink-mute line-clamp-2 font-sans leading-relaxed">Rahim (kandungan ibu). Kasih sayang mendalam yang melindungi, memelihara, dan memberi kehidupan.</p>
            </Link>
          </div>
        </div>

        {/* DEDICATED INSPIRATION & ATTRIBUTION SECTION WITH EDITORIAL MANUSCRIPT IMAGE */}
        <section className="p-8 sm:p-12 rounded-3xl bg-canvas-surface border border-hairline shadow-subtle space-y-8">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-primary-subdued text-primary text-xs font-semibold rounded-full uppercase tracking-wider font-sans">
              <ShieldCheck className="w-4 h-4" />
              <span>Sumber Data &amp; Inspirasi Proyek</span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-light text-ink-primary tracking-tight font-sans">
                Terinspirasi dari <span className="font-semibold text-primary">Quranic Arabic Corpus</span>
              </h3>
              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-sans">
                <strong>Qurabic (Indo)</strong> dibangun untuk menjembatani penutur Bahasa Indonesia dengan keindahan linguistik Al-Qur&apos;an. Proyek ini mengadaptasi dan merujuk anotasi morfologi gramatikal dari <strong>Quranic Arabic Corpus</strong> (University of Leeds), dipadukan dengan leksikografi klasik mu&apos;tabar dan terjemahan resmi Kementerian Agama Republik Indonesia.
              </p>
            </div>

            {/* Editorial Manuscript Image Layer */}
            <div className="lg:col-span-5 relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-hairline shadow-subtle group">
              <Image
                src="/images/quran-manuscript.jpg"
                alt="Manuskrip Al-Qur'an Klasik"
                fill
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter contrast-[0.95]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-sans font-medium">
                  Rujukan morfologi &amp; leksikografi klasik Al-Qur&apos;an
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-hairline text-xs sm:text-sm font-sans">
            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2">
              <span className="font-bold text-ink-primary block text-sm">Morfologi &amp; Sintaksis:</span>
              <p className="text-ink-mute leading-relaxed text-xs sm:text-sm">
                Quranic Arabic Corpus (University of Leeds) untuk penandaan akar kata, lemma, dan part-of-speech.
              </p>
              <a
                href="https://corpus.quran.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-primary hover:underline font-semibold pt-1 text-xs"
              >
                <span>corpus.quran.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2">
              <span className="font-bold text-ink-primary block text-sm">Etimologi Klasik:</span>
              <p className="text-ink-mute leading-relaxed text-xs sm:text-sm">
                Lisan al-&apos;Arab (Ibn Manzhur), Mu&apos;jam Maqayis al-Lughah (Ibn Faris), dan Al-Mufradat (Ar-Raghib Al-Isfahani).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-soft border border-hairline space-y-2">
              <span className="font-bold text-ink-primary block text-sm">Mushaf &amp; Terjemahan:</span>
              <p className="text-ink-mute leading-relaxed text-xs sm:text-sm">
                Mushaf Standar Indonesia Kemenag RI &amp; Quran.com API v4 untuk teks Utsmani dan audio per kata.
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
