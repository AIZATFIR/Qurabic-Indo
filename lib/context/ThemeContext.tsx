'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeType, THEME_OPTIONS, normalizeTheme } from './theme-config';

interface ThemeContextValue {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  layoutMode: 'classic' | 'minimal';
  setLayoutMode: (mode: 'classic' | 'minimal') => void;
  options: typeof THEME_OPTIONS;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'blend',
  setTheme: () => {},
  layoutMode: 'classic',
  setLayoutMode: () => {},
  options: THEME_OPTIONS,
});

const STORAGE_KEY = 'qurabic_theme_preference';
const LAYOUT_STORAGE_KEY = 'qurabic_layout_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('blend');
  const [layoutMode, setLayoutModeState] = useState<'classic' | 'minimal'>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const normalized = saved ? normalizeTheme(saved) : null;
      if (normalized) setThemeState(normalized);
      const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
      if (savedLayout === 'classic' || savedLayout === 'minimal') setLayoutModeState(savedLayout);
    } catch (e) {
      console.warn('LocalStorage theme access not permitted', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}

    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.classList.remove('dark');
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LAYOUT_STORAGE_KEY, layoutMode);
    } catch (e) {}
    document.documentElement.setAttribute('data-layout', layoutMode);
  }, [layoutMode, mounted]);

  const setTheme = (nextTheme: ThemeType) => {
    setThemeState(nextTheme);
  };

  const setLayoutMode = (nextMode: 'classic' | 'minimal') => {
    setLayoutModeState(nextMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, layoutMode, setLayoutMode, options: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
