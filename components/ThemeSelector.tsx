'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ThemeType } from '@/lib/context/theme-config';

export default function ThemeSelector() {
  const { theme, setTheme, options } = useTheme();
  const { t } = useLanguage();
  const optionsId = useId();
  const themeLabel = (id: ThemeType) => ({ bookpaper: t('Kertas buku', 'Book paper'), light: t('Terang', 'Light'), green: t('Hijau zamrud', 'Emerald'), dark: t('Malam', 'Dark') })[id];
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
        className="flex items-center space-x-1.5 min-h-11 px-2.5 py-1.5 border border-hairline dark:border-hairline-dark bg-white dark:bg-canvas-dark-surface hover:border-primary/40 text-xs text-ink-secondary dark:text-stone-300 transition-all shadow-subtle"
        title={t('Pilih tema tampilan', 'Choose a theme')}
        aria-label={t('Pilih tema tampilan', 'Choose a theme')}
        aria-expanded={isOpen}
        aria-controls={optionsId}
      >
        <span
          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: currentOption.primaryHex }}
        />
        <span className="font-medium font-sans text-sm hidden sm:inline">
          {themeLabel(currentOption.id)}
        </span>
        <Palette className="w-3 h-3 text-ink-mute ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div id={optionsId} className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#12221B] border border-hairline dark:border-hairline-dark shadow-hover py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-hairline dark:border-hairline-dark text-xs uppercase font-semibold text-ink-mute tracking-wider font-sans">
            {t('Pilihan tema', 'Themes')}
          </div>

          <div className="p-1 space-y-0.5">
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
                  className={`w-full flex items-center justify-between min-h-11 px-2.5 py-2 text-sm font-sans transition-all ${
                    isSelected
                      ? 'bg-primary-fixed dark:bg-primary/20 text-primary-deep dark:text-primary-light font-bold'
                      : 'text-ink-secondary dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-subtle shrink-0"
                      style={{ backgroundColor: opt.bgHex, borderColor: opt.borderHex }}
                    >
                      <span
                        className="block w-1.5 h-1.5 rounded-full m-auto mt-[3px]"
                        style={{ backgroundColor: opt.primaryHex }}
                      />
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span>{themeLabel(opt.id)}</span>
                    </span>
                  </div>

                  {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
