'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ThemeType } from '@/lib/context/theme-config';

export default function ThemeSelector() {
  const { theme, setTheme, layoutMode, setLayoutMode, options } = useTheme();
  const { t } = useLanguage();
  const optionsId = useId();
  const themeLabels: Record<ThemeType, string> = {
    bookpaper: t('Bookpaper klasik', 'Classic Bookpaper'),
    linen: 'Linen',
    mist: t('Kabut', 'Mist'),
    sage: t('Sage muda', 'Soft sage'),
    blend: t('Krem hangat', 'Warm cream'),
    sand: t('Pasir', 'Sand'),
    paperwhite: t('Putih', 'White'),
    simple: t('Sederhana', 'Simple'),
    modern: t('Modern', 'Modern'),
  };
  const themeDescriptions: Record<ThemeType, string> = {
    bookpaper: t('Warna kertas lama dengan aksen hijau teduh', 'The original paper tone with quiet green accents'),
    linen: t('Krem sangat terang dan lembut', 'Soft, very light cream'),
    mist: t('Putih sejuk dengan sentuhan hijau', 'Cool white with a hint of green'),
    sage: t('Hijau pucat yang nyaman untuk membaca', 'Pale green made for comfortable reading'),
    blend: t('Bookpaper dengan aksen cokelat hangat', 'Warm cream with gentle brown accents'),
    sand: t('Kertas pasir hangat', 'Warm sand paper'),
    paperwhite: t('Putih bersih dengan kontras lembut', 'Clean white with soft contrast'),
    simple: t('Ringan dan minimal', 'Light and minimal'),
    modern: t('Warna lebih berani, bentuk lebih lembut', 'Stronger color and softer shapes'),
  };
  const themeLabel = (id: ThemeType) => themeLabels[id];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    const handleEscape = (event: KeyboardEvent) => { if (isOpen && event.key === 'Escape') { setIsOpen(false); dropdownRef.current?.querySelector('button')?.focus(); } };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', handleEscape); };
  }, [isOpen]);

  const currentOption = options.find((o) => o.id === theme) || options[0];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 min-h-10 px-3 py-1.5 rounded-full border border-transparent bg-transparent hover:bg-canvas-surface/70 text-xs text-ink-secondary transition-colors"
        title={t('Pilih tema tampilan', 'Choose a theme')}
        aria-label={t('Pilih tema tampilan', 'Choose a theme')}
        aria-expanded={isOpen}
        aria-controls={optionsId}
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: currentOption.primaryHex }}
        />
        <span className="font-medium font-sans text-sm hidden sm:inline">
          {themeLabel(currentOption.id)}
        </span>
        <Palette className="w-3.5 h-3.5 text-ink-mute ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div id={optionsId} role="group" aria-label={t('Pilihan tampilan', 'Appearance')} className="absolute right-0 mt-2 max-h-[80dvh] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-hairline bg-canvas-surface p-2 shadow-hover z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 pb-2 pt-1 text-sm font-semibold text-ink-primary font-sans">
            {t('Warna', 'Colors')}
          </div>

          <div className="space-y-1">
            {options.map((opt) => {
              const isSelected = opt.id === theme;

              return (
                <button
                  key={opt.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 min-h-14 px-3 py-2 text-left font-sans transition-colors ${
                    isSelected
                      ? 'bg-primary-fixed text-primary-deep'
                      : 'text-ink-secondary hover:bg-canvas-soft'
                  }`}
                  style={{ borderRadius: 'var(--radius-control)' }}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center border border-hairline bg-[var(--preview-bg)]" style={{ borderRadius: 'calc(var(--radius-control) * 0.8)', '--preview-bg': opt.bgHex } as React.CSSProperties}>
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: opt.primaryHex }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{themeLabels[opt.id]}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-mute">{themeDescriptions[opt.id]}</span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 border-t border-hairline px-3 pb-1 pt-3">
            <p className="mb-2 text-sm font-semibold text-ink-primary">{t('Tata letak', 'Layout')}</p>
            <div className="grid grid-cols-2 gap-1 rounded-[var(--radius-control)] bg-canvas-soft p-1">
              {([
                ['classic', t('Bookpaper', 'Bookpaper')],
                ['minimal', t('Modern', 'Modern')],
              ] as const).map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={layoutMode === mode}
                  onClick={() => setLayoutMode(mode)}
                  className={`min-h-11 rounded-[var(--radius-control)] px-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${layoutMode === mode ? 'bg-canvas-surface text-primary shadow-subtle' : 'text-ink-secondary hover:text-ink-primary'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
