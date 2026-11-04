'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ThemeType } from '@/lib/context/theme-config';

export default function ThemeSelector() {
  const { theme, setTheme, options, layoutMode, setLayoutMode } = useTheme();
  const { t } = useLanguage();
  const optionsId = useId();
  const themeLabels: Record<ThemeType, string> = {
    blend: t('Gabungan', 'Blend'),
    simple: t('Sederhana', 'Simple'),
    modern: t('Modern', 'Modern'),
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
        className="flex items-center space-x-2 min-h-11 px-3 py-1.5 border border-hairline bg-canvas-surface hover:border-primary/50 text-xs text-ink-secondary transition-colors"
        style={{ borderRadius: 'var(--radius-control)' }}
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
        <div id={optionsId} role="group" aria-label={t('Pilihan tampilan', 'Appearance')} className="absolute right-0 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-hairline bg-canvas-surface p-2 shadow-hover z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 pb-2 pt-1 text-sm font-semibold text-ink-primary font-sans">
            {t('Gaya antarmuka', 'Interface style')}
          </div>
          <div className="space-y-1">
            {([
              { id: 'classic' as const, idLabel: t('Klasik', 'Classic'), desc: t('Hero foto dan kajian akar lebih lengkap', 'Photo hero and fuller root studies') },
              { id: 'minimal' as const, idLabel: t('Ringkas', 'Minimal'), desc: t('Tampilan baru yang lebih sederhana', 'The newer, simpler layout') },
            ]).map((mode) => (
              <button
                key={mode.id}
                type="button"
                aria-pressed={layoutMode === mode.id}
                onClick={() => setLayoutMode(mode.id)}
                className={`w-full flex items-center gap-3 min-h-12 px-3 py-2 text-left font-sans transition-colors ${layoutMode === mode.id ? 'bg-primary-fixed text-primary-deep' : 'text-ink-secondary hover:bg-canvas-soft'}`}
                style={{ borderRadius: 'var(--radius-control)' }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{mode.idLabel}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-mute">{mode.desc}</span>
                </span>
                {layoutMode === mode.id && <Check className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className="mx-3 my-2 border-t border-hairline" aria-hidden="true" />
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
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-mute">{t(opt.description, opt.id === 'blend' ? 'A quiet base with modern green accents' : opt.id === 'simple' ? 'Light and minimal' : 'Stronger color and softer shapes')}</span>
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
