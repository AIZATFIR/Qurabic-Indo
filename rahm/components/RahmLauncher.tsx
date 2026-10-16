'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  BookOpen,
  Clock,
  Layers,
  Sun,
  Heart,
  Calendar,
  X,
  ArrowRight,
  Compass,
  Command,
} from 'lucide-react';
import { ASMAUL_HUSNA_DATA, CURATED_HADITHS, getPrayerTimes, PrayerTimesResult } from '../lib/api-expansion';
import { SURAH_LIST } from '@/lib/data/surah-list';

interface LauncherItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Quran' | 'Muraqabah' | 'Sadar' | 'Asmaul Husna' | 'Hadith' | 'Sholat';
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

interface RahmLauncherProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFocusClock?: () => void;
  onOpenSadar?: (topicId?: string) => void;
}

export default function RahmLauncher({
  isOpen,
  onClose,
  onOpenFocusClock,
  onOpenSadar,
}: RahmLauncherProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResult | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Fetch prayer times on launcher load
  useEffect(() => {
    if (isOpen) {
      getPrayerTimes().then(setPrayerTimes).catch(() => {});
    }
  }, [isOpen]);

  // Focus input automatically on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Core Launcher Registry Items
  const staticItems: LauncherItem[] = useMemo(() => {
    const list: LauncherItem[] = [
      {
        id: 'clock-15',
        title: 'Mulai Sesi Muraqabah (15 Menit)',
        subtitle: 'Latihan keheningan, nafas rohani, dan dzikir kalbu',
        category: 'Muraqabah',
        icon: <Clock className="w-4 h-4 text-emerald-500" />,
        action: () => {
          onClose();
          onOpenFocusClock?.();
        },
        badge: 'Focus',
      },
      {
        id: 'clock-25',
        title: 'Fokus Khusyu’ Pomodoro (25 Menit)',
        subtitle: 'Sesi tilawah dan perenungan mendalam bebas distraksi',
        category: 'Muraqabah',
        icon: <Clock className="w-4 h-4 text-emerald-500" />,
        action: () => {
          onClose();
          onOpenFocusClock?.();
        },
        badge: 'Khusyu',
      },
      {
        id: 'sadar-cemas',
        title: 'Sadar: Menghadapi Cemas & Was-was',
        subtitle: 'Transmutasi kegundahan menjadi As-Sakīnah dengan Ya Salam',
        category: 'Sadar',
        icon: <Heart className="w-4 h-4 text-rose-500" />,
        action: () => {
          onClose();
          onOpenSadar?.('cemas');
        },
        badge: 'Nafs',
      },
      {
        id: 'sadar-arah',
        title: 'Sadar: Mengatasi Kehilangan Arah',
        subtitle: 'Menemukan kompas nurani dan bimbingan Al-Hadi',
        category: 'Sadar',
        icon: <Compass className="w-4 h-4 text-amber-500" />,
        action: () => {
          onClose();
          onOpenSadar?.('arah');
        },
        badge: 'Petunjuk',
      },
      {
        id: 'sadar-marah',
        title: 'Sadar: Meredakan Api Amarah',
        subtitle: 'Mengubah impuls kemarahan menjadi kesantunan Al-Halim',
        category: 'Sadar',
        icon: <Heart className="w-4 h-4 text-orange-500" />,
        action: () => {
          onClose();
          onOpenSadar?.('marah');
        },
        badge: 'Tazkiyah',
      },
      {
        id: 'baca-kahf',
        title: 'Baca Surah Al-Kahf (Ayat 1-110)',
        subtitle: 'Sunnah hari Jumat, perlindungan dari fitnah akhir zaman',
        category: 'Quran',
        icon: <BookOpen className="w-4 h-4 text-blue-500" />,
        action: () => {
          onClose();
          router.push('/baca?surah=18');
        },
        badge: 'QS 18',
      },
      {
        id: 'baca-mulk',
        title: 'Baca Surah Al-Mulk (Ayat 1-30)',
        subtitle: 'Penyelamat dari siksa kubur sebelum tidur',
        category: 'Quran',
        icon: <BookOpen className="w-4 h-4 text-blue-500" />,
        action: () => {
          onClose();
          router.push('/baca?surah=67');
        },
        badge: 'QS 67',
      },
      {
        id: 'morfologi-akar',
        title: 'Eksplorasi Morfologi & Akar Kata',
        subtitle: 'Pencarian 1.642 akar kata Al-Qur\'an dan analisis sharaf',
        category: 'Quran',
        icon: <Layers className="w-4 h-4 text-primary" />,
        action: () => {
          onClose();
          router.push('/morfologi');
        },
        badge: 'Corpus',
      },
    ];

    // Add prayer times entry if available
    if (prayerTimes) {
      list.unshift({
        id: 'jadwal-sholat',
        title: `Jadwal Sholat ${prayerTimes.locationName}: Dzuhur ${prayerTimes.dhuhr} • Ashar ${prayerTimes.asr} • Maghrib ${prayerTimes.maghrib}`,
        subtitle: `Tanggal Hijriah: ${prayerTimes.dateHijri} (${prayerTimes.dateGregorian})`,
        category: 'Sholat',
        icon: <Calendar className="w-4 h-4 text-emerald-600" />,
        action: () => {
          onClose();
          router.push('/rahm');
        },
        badge: 'Waktu',
      });
    }

    return list;
  }, [prayerTimes, onClose, onOpenFocusClock, onOpenSadar, router]);

  // Dynamic search across Surah list, Asmaul Husna, and Hadith
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staticItems;

    const dynamicResults: LauncherItem[] = [];

    // 1. Search Surah
    SURAH_LIST.forEach((s) => {
      if (
        s.nameIndo.toLowerCase().includes(q) ||
        s.number.toString() === q ||
        s.translationId.toLowerCase().includes(q)
      ) {
        dynamicResults.push({
          id: `surah-${s.number}`,
          title: `Surah ${s.nameIndo} (${s.nameArabic})`,
          subtitle: `${s.ayahsCount} Ayat • ${s.translationId} (${s.revelationType})`,
          category: 'Quran',
          icon: <BookOpen className="w-4 h-4 text-blue-500" />,
          action: () => {
            onClose();
            router.push(`/baca?surah=${s.number}`);
          },
          badge: `QS ${s.number}`,
        });
      }
    });

    // 2. Search Asmaul Husna
    ASMAUL_HUSNA_DATA.forEach((item) => {
      if (
        item.transliteration.toLowerCase().includes(q) ||
        item.meaningId.toLowerCase().includes(q) ||
        item.arabic.includes(q)
      ) {
        dynamicResults.push({
          id: `asma-${item.number}`,
          title: `${item.arabic} (${item.transliteration})`,
          subtitle: `${item.meaningId} • Kategori ${item.category}`,
          category: 'Asmaul Husna',
          icon: <Sun className="w-4 h-4 text-amber-500" />,
          action: () => {
            onClose();
            router.push(`/rahm?asma=${item.number}`);
          },
          badge: `#${item.number}`,
        });
      }
    });

    // 3. Search Hadith
    CURATED_HADITHS.forEach((h) => {
      if (
        h.indoText.toLowerCase().includes(q) ||
        h.theme.toLowerCase().includes(q) ||
        h.sourceBook.toLowerCase().includes(q)
      ) {
        dynamicResults.push({
          id: h.id,
          title: `Hadits: ${h.theme} (${h.sourceBook.split(' ')[0]})`,
          subtitle: h.indoText.slice(0, 75) + '...',
          category: 'Hadith',
          icon: <Heart className="w-4 h-4 text-rose-500" />,
          action: () => {
            onClose();
            router.push(`/rahm?hadith=${h.id}`);
          },
          badge: h.narrator.split(' ')[0],
        });
      }
    });

    // Also include matched static items
    const matchedStatics = staticItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );

    return [...dynamicResults.slice(0, 6), ...matchedStatics];
  }, [query, staticItems, onClose, router]);

  // Keyboard navigation: Arrow Up, Arrow Down, Enter, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl rounded-3xl bg-canvas-surface/95 dark:bg-canvas-dark-surface/95 backdrop-blur-2xl border border-hairline shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col font-sans text-ink-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-hairline gap-3">
          <Search className="w-5 h-5 text-ink-mute shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Ketik apa saja: Surah, Ayat, Muraqabah, Nafs, Asmaul Husna..."
            className="w-full bg-transparent text-sm sm:text-base text-ink-primary placeholder:text-ink-mute outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-ink-mute bg-canvas-soft border border-hairline px-2 py-0.5 rounded-lg">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-mute hover:text-ink-primary hover:bg-canvas-soft"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-hairline/40">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-ink-mute">
              Tidak ada hasil yang cocok dengan "{query}". Coba cari "Kahf", "Cemas", atau "Muraqabah".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`px-3.5 py-2.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-100 ${
                    isSelected
                      ? 'bg-primary-subdued/80 dark:bg-primary-deep/20 text-ink-primary scale-[0.99]'
                      : 'hover:bg-canvas-soft text-ink-secondary'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2 rounded-xl bg-canvas-soft border border-hairline shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="font-semibold text-xs sm:text-sm text-ink-primary truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-md bg-canvas-soft border border-hairline text-[10px] font-bold text-primary shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-ink-mute truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-opacity ${
                      isSelected ? 'opacity-100 text-primary' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Quick Help Bar */}
        <div className="px-4 py-2.5 border-t border-hairline bg-canvas-soft/40 flex items-center justify-between text-[11px] text-ink-mute">
          <div className="flex items-center space-x-3">
            <span>Navigasi: ↑ ↓</span>
            <span>Pilih: Enter</span>
          </div>
          <div className="flex items-center space-x-1.5 text-primary font-medium">
            <Command className="w-3 h-3" />
            <span>Rahm Spiritual Operating System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
