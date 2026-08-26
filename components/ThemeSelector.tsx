'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/lib/context/ThemeContext';
import { Palette, Check, Sun, Moon, Sparkles, BookOpen } from 'lucide-react';
import { ThemeType } from '@/lib/context/theme-config';

const THEME_ICONS: Record<ThemeType, any> = {
  bookpaper: BookOpen,
  light: Sun,
  green: Sparkles,
  dark: Moon,
};

export default function ThemeSelector() {
  const { theme, setTheme, options } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find((o) => o.id === theme) || options[0];
  const CurrentIcon = THEME_ICONS[theme] || Palette;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full border border-hairline dark:border-hairline-dark bg-white dark:bg-canvas-dark-surface hover:border-primary/40 text-xs text-ink-secondary dark:text-stone-300 transition-all shadow-subtle"
        title="Pilih Tema Tampilan"
        aria-label="Pilih Tema Tampilan"
      >
        <span
          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
          style={{ backgroundColor: currentOption.primaryHex }}
        />
        <span className="font-medium font-sans text-[11px] hidden sm:inline">
          {currentOption.label}
        </span>
        <Palette className="w-3 h-3 text-ink-mute ml-0.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#12221B] border border-hairline dark:border-hairline-dark shadow-hover py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-hairline dark:border-hairline-dark text-[10px] uppercase font-semibold text-ink-mute tracking-wider font-sans">
            Pilihan Tema
          </div>

          <div className="p-1 space-y-0.5">
            {options.map((opt) => {
              const isSelected = opt.id === theme;
              const IconComp = THEME_ICONS[opt.id] || Palette;

              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-sans transition-all ${
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
                      <span>{opt.label}</span>
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
