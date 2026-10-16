'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Clock,
  Heart,
  Search,
  BookOpen,
  ArrowLeft,
  Calendar,
  Sun,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import FocusClock from '@/rahm/components/FocusClock';
import SadarModule from '@/rahm/components/SadarModule';
import RahmLauncher from '@/rahm/components/RahmLauncher';
import {
  ASMAUL_HUSNA_DATA,
  fetchPrayerTimes,
  PrayerTimesResult,
  CURATED_HADITHS,
  AsmaulHusnaItem,
} from '@/rahm/lib/api-expansion';
import { NAFS_STAGES } from '@/rahm/lib/spiritual-framework';

export default function RahmPage() {
  const [activeTab, setActiveTab] = useState<'focus' | 'sadar' | 'asma' | 'prayer'>('focus');
  const [isLauncherOpen, setIsLauncherOpen] = useState(false);
  const [prayerData, setPrayerData] = useState<PrayerTimesResult | null>(null);
  const [isLoadingPrayer, setIsLoadingPrayer] = useState(true);
  const [asmaFilter, setAsmaFilter] = useState('');
  const [selectedAsmaCategory, setSelectedAsmaCategory] = useState<'All' | 'Jamal' | 'Jalal' | 'Kamal'>('All');

  // Load prayer times
  useEffect(() => {
    let isMounted = true;
    fetchPrayerTimes()
      .then((data) => {
        if (isMounted) {
          setPrayerData(data);
          setIsLoadingPrayer(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsLoadingPrayer(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Global keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsLauncherOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredAsma = ASMAUL_HUSNA_DATA.filter((item) => {
    const matchCat = selectedAsmaCategory === 'All' || item.category === selectedAsmaCategory;
    const matchText =
      !asmaFilter ||
      item.transliteration.toLowerCase().includes(asmaFilter.toLowerCase()) ||
      item.meaningId.toLowerCase().includes(asmaFilter.toLowerCase()) ||
      item.arabic.includes(asmaFilter) ||
      item.rootLatin.toLowerCase().includes(asmaFilter.toLowerCase());
    return matchCat && matchText;
  });

  return (
    <div className="min-h-screen bg-canvas text-ink-primary font-sans antialiased selection:bg-primary-subdued selection:text-primary-deep">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-30 w-full bg-canvas-page/80 backdrop-blur-xl border-b border-hairline/60 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 text-xs text-ink-mute hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-canvas-surface"
              title="Kembali ke Qurabic"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Qurabic</span>
            </Link>
            <div className="h-4 w-px bg-hairline" />
            <div className="flex items-center space-x-2">
              <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-primary to-primary-light text-white flex items-center justify-center font-serif text-sm font-bold shadow-subtle">
                ر
              </span>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-ink-primary flex items-center gap-1.5">
                  Rahm <span className="text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">Spiritual Engine</span>
                </h1>
                <p className="text-[10px] text-ink-mute hidden sm:block">
                  Tazkiyatun Nafs &amp; Kesadaran Batin Terpadu
                </p>
              </div>
            </div>
          </div>

          {/* Quick Launcher Trigger Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsLauncherOpen(true)}
              className="flex items-center space-x-2 bg-canvas-surface/90 hover:bg-canvas-surface border border-hairline hover:border-primary/40 px-3 py-1.5 rounded-full text-xs text-ink-secondary shadow-subtle transition-all active:scale-[0.98]"
              aria-label="Buka Rahm Command Palette"
            >
              <Search className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Cari Panduan &amp; Dzikir</span>
              <kbd className="text-[9px] px-1.5 py-0.5 bg-canvas-soft border border-hairline/60 rounded text-ink-mute">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Tab Navigation Controls (Apple Segments Style) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-2.5">
          <div className="flex items-center p-1 bg-canvas-soft/70 border border-hairline/60 rounded-2xl max-w-xl mx-auto overflow-x-auto shadow-inner">
            <button
              onClick={() => setActiveTab('focus')}
              className={`flex-1 min-w-[90px] py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'focus'
                  ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline/40'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Muraqabah</span>
            </button>
            <button
              onClick={() => setActiveTab('sadar')}
              className={`flex-1 min-w-[90px] py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'sadar'
                  ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline/40'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Sadar Nafs</span>
            </button>
            <button
              onClick={() => setActiveTab('asma')}
              className={`flex-1 min-w-[110px] py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'asma'
                  ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline/40'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Asmaul Husna</span>
            </button>
            <button
              onClick={() => setActiveTab('prayer')}
              className={`flex-1 min-w-[100px] py-1.5 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'prayer'
                  ? 'bg-canvas-surface text-primary shadow-subtle border border-hairline/40'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Jadwal Shalat</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20">
        {/* TAB 1: FOCUS CLOCK */}
        {activeTab === 'focus' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto mb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-primary">
                Muraqabah &amp; Ritme Nafas Rohani
              </h2>
              <p className="text-xs text-ink-mute mt-1">
                Latihan hening kehadiran batin (Ibn &apos;Arabi: <em>Khalwa</em> &amp; Jim Francis: <em>Art of Stillness</em>).
                Pusatkan kesadaran pada Dzat Yang Maha Menatap.
              </p>
            </div>
            <FocusClock />
          </div>
        )}

        {/* TAB 2: SADAR MODULE */}
        {activeTab === 'sadar' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto mb-4">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-primary">
                Sadar &amp; Transmutasi Nafs
              </h2>
              <p className="text-xs text-ink-mute mt-1">
                Kenali tingkat jiwa Anda saat ini (1–7 Nafs) dan ubah energi bayangan (<em>Not-Self / Bayangan</em>)
                menjadi hikmah dan cahaya ilahi.
              </p>
            </div>
            <SadarModule />
          </div>
        )}

        {/* TAB 3: ASMAUL HUSNA EXPLORER */}
        {activeTab === 'asma' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-ink-primary">
                  Asmaul Husna &amp; Kunci Kontemplasi
                </h2>
                <p className="text-xs text-ink-mute mt-0.5">
                  99 Nama Keagungan dengan akar kata Arab dan petunjuk perenungan batin.
                </p>
              </div>

              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {(['All', 'Jamal', 'Jalal', 'Kamal'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedAsmaCategory(cat)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all active:scale-95 ${
                      selectedAsmaCategory === cat
                        ? 'bg-primary text-white border-primary shadow-subtle'
                        : 'bg-canvas-surface text-ink-secondary border-hairline hover:border-primary/40'
                    }`}
                  >
                    {cat === 'All' ? 'Semua' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Input */}
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-ink-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={asmaFilter}
                onChange={(e) => setAsmaFilter(e.target.value)}
                placeholder="Cari nama, arti, atau akar kata (cth: Rahman, r-h-m, Kasih)..."
                className="w-full pl-9 pr-4 py-2 bg-canvas-surface border border-hairline rounded-xl text-xs text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredAsma.map((item) => (
                <div
                  key={item.number}
                  className="p-4 rounded-2xl bg-canvas-surface border border-hairline/80 hover:border-primary/30 shadow-subtle transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-canvas-soft border border-hairline/60 text-ink-mute">
                        #{item.number}
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
                          item.category === 'Jamal'
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            : item.category === 'Jalal'
                            ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                            : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-1.5">
                      <h3 className="text-sm font-bold text-ink-primary">{item.transliteration}</h3>
                      <span className="font-arabic text-xl font-bold text-primary">{item.arabic}</span>
                    </div>

                    <p className="text-xs text-ink-secondary mb-2.5 line-clamp-2">{item.meaningId}</p>

                    <div className="p-2.5 rounded-xl bg-canvas-soft/60 border border-hairline/50 text-[11px] text-ink-mute italic mb-3">
                      &quot;{item.contemplationKey}&quot;
                    </div>
                  </div>

                  <div className="pt-2 border-t border-hairline/50 flex items-center justify-between text-[10px] text-ink-mute">
                    <span>Akar: <strong className="text-primary font-mono">{item.rootLatin}</strong> ({item.rootArabic})</span>
                    <Link
                      href={`/morfologi?root=${encodeURIComponent(item.rootArabic)}`}
                      className="inline-flex items-center text-primary hover:underline font-semibold"
                    >
                      Telusuri Morfologi &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRAYER & HADITH */}
        {activeTab === 'prayer' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Prayer Times Showcase */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-primary/10 via-canvas-surface to-canvas-surface border border-primary/20 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                    Ritme Kosmik &amp; Waktu Shalat
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-ink-primary mt-0.5">
                    {prayerData?.locationName || 'Jakarta'} &bull; {prayerData?.dateHijri || '1448 H'}
                  </h2>
                  <p className="text-xs text-ink-mute">{prayerData?.dateGregorian}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 text-xs text-ink-mute bg-canvas-surface px-2.5 py-1 rounded-full border border-hairline">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Metode Kemenag RI</span>
                  </span>
                </div>
              </div>

              {isLoadingPrayer ? (
                <div className="flex items-center justify-center py-8 text-xs text-ink-mute">
                  <RefreshCw className="w-4 h-4 animate-spin mr-2 text-primary" />
                  Sinkronisasi waktu shalat...
                </div>
              ) : prayerData ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {[
                    { name: 'Subuh', time: prayerData.fajr },
                    { name: 'Terbit', time: prayerData.sunrise },
                    { name: 'Dzuhur', time: prayerData.dhuhr },
                    { name: 'Ashar', time: prayerData.asr },
                    { name: 'Maghrib', time: prayerData.maghrib },
                    { name: 'Isya', time: prayerData.isha },
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="p-3 rounded-2xl bg-canvas-surface border border-hairline/80 text-center shadow-subtle"
                    >
                      <span className="text-[10px] text-ink-mute font-medium block mb-1">{p.name}</span>
                      <span className="text-base sm:text-lg font-bold font-mono text-ink-primary">
                        {p.time}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Curated Authentic Hadiths */}
            <div>
              <div className="mb-3">
                <h3 className="text-sm font-bold text-ink-primary">Koleksi Hadits Shahih Terpilih</h3>
                <p className="text-xs text-ink-mute">
                  Landasan sunnah untuk ketenangan jiwa, muraqabah, dan pengendalian hawa nafsu.
                </p>
              </div>

              <div className="space-y-3">
                {CURATED_HADITHS.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-2xl bg-canvas-surface border border-hairline/80 shadow-subtle"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                        {h.theme}
                      </span>
                      <span className="text-[10px] text-ink-mute">{h.narrator}</span>
                    </div>
                    <p className="font-arabic text-sm text-right text-ink-primary mb-2 leading-relaxed" dir="rtl">
                      {h.arabicText}
                    </p>
                    <p className="text-xs text-ink-secondary italic mb-2">
                      &quot;{h.indoText}&quot;
                    </p>
                    <div className="text-[10px] text-ink-mute flex items-center justify-between pt-2 border-t border-hairline/50">
                      <span>Sumber: {h.reference}</span>
                      <span className="font-semibold text-emerald-600">&bull; {h.authenticity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Rahm Launcher Modal */}
      <RahmLauncher isOpen={isLauncherOpen} onClose={() => setIsLauncherOpen(false)} />
    </div>
  );
}
