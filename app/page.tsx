'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, BookOpen, Layers, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import OmniSearch from '@/components/OmniSearch';

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="space-y-12 py-4">
      
      {/* HERO SECTION */}
      <section className="relative rounded-3xl p-8 sm:p-12 glass-panel border border-slate-800 overflow-hidden text-center sm:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Background Glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-5 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Versi Bahasa Indonesia • Quranic Arabic Corpus</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Eksplorasi Morfologi &amp; Akar Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Al-Qur&apos;an</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Temukan makna mendalam setiap kata Al-Qur&apos;an lewat database akar kata ber-transliterasi Latin, penjelasan etimologi klasik, klasifikasi Fi&apos;il &amp; Isim, serta kemunculan ayat secara presisi.
          </p>

          {/* Large Hero Search Input Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full sm:w-auto flex-1 flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-900/90 border border-emerald-500/40 hover:border-emerald-400 text-slate-300 hover:text-white transition-all shadow-glow-emerald group"
            >
              <div className="flex items-center space-x-3">
                <Search className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Cari akar kata (Arab / Latin &quot;sabar&quot; / Indo)...</span>
              </div>
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/akar/s-b-r"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <span>Lihat Akar Sabar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Tag suggestions */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 pt-2">
            <span className="text-slate-500 font-medium">Pencarian Populer:</span>
            <button onClick={() => setIsSearchOpen(true)} className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-emerald-400 border border-slate-700/60">
              ص-ب-ر (Sabar)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-amber-400 border border-slate-700/60">
              batu (sobaro)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60">
              ك-ت-ب (Kitab/Tulis)
            </button>
            <button onClick={() => setIsSearchOpen(true)} className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60">
              ر-ح-م (Rahmah)
            </button>
          </div>
        </div>

        {/* Feature Hero Card Graphic */}
        <div className="relative z-10 w-full lg:w-80 p-6 rounded-2xl glass-panel border border-emerald-500/30 bg-slate-900/80 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-amber-400 flex items-center justify-center text-obsidian-950 font-bold font-arabic text-3xl shadow-glow-emerald">
            صبر
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Akar Utama</span>
            <h2 className="text-xl font-bold text-white mt-1">S-B-R (Sabar)</h2>
            <p className="text-xs text-amber-300/90 mt-1 italic">
              &quot;Batu yang sangat keras &amp; kekokohan jiwa di tengah pahitnya ujian&quot;
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="block text-emerald-400 font-bold text-sm">46x</span>
              <span className="text-[10px] text-slate-400">Kata Kerja (Fi&apos;il)</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-800/60">
              <span className="block text-amber-400 font-bold text-sm">57x</span>
              <span className="text-[10px] text-slate-400">Kata Benda (Isim)</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ROOTS BENTO GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Database Akar Kata Utama</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">Katalog Morfologi Pilihan</h2>
          </div>
          <Link
            href="/morfologi"
            className="text-xs text-slate-300 hover:text-emerald-400 flex items-center space-x-1 font-semibold transition-colors"
          >
            <span>Lihat Semua Akar Kata</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROOT_DATABASE.map((root) => (
            <RootCard key={root.id} root={root} />
          ))}
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Pencarian Multi-Bahasa</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cari menggunakan huruf Hijaiyah, transliterasi Latin (&quot;sabar&quot;, &quot;kataba&quot;), Bahasa Indonesia (&quot;batu&quot;, &quot;tulis&quot;), maupun Bahasa Inggris.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Wawasan Etimologi Klasik</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Memahami asal-usul kosa kata klasik Arab (misal akar kata *sobaro* sebagai batu keras atau tanaman pahit) yang memperkaya wawasan tadabbur Al-Qur&apos;an.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Pemisahan Fi&apos;il &amp; Isim</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Klasifikasi kata kerja (Fi&apos;il Madhi, Mudhari&apos;, Amr, Form I-X) dan kata benda (Masdar, Isim Fa&apos;il, Mubalaghah) secara terstruktur.
          </p>
        </div>
      </section>

      {/* OmniSearch Modal Trigger */}
      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
