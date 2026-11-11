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
// Start everyone on the restored classic interface once. The previous key may
// contain `minimal` from the interim redesign and would otherwise keep the
// restored interface hidden after deployment.

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('blend');
  const [layoutMode, setLayoutModeState] = useState<'classic' | 'minimal'>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const normalized = saved ? normalizeTheme(saved) : null;
      if (normalized) setThemeState(normalized);
      // The restored bookpaper interface has one shared visual language.
      // Clear the interim layout preference so an older "minimal" choice
      // cannot leave isolated square panels in an otherwise classic reader.
      localStorage.removeItem('qurabic_layout_preference_v2');
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
    document.documentElement.setAttribute('data-layout', 'classic');
  }, [mounted]);

  const setTheme = (nextTheme: ThemeType) => {
    setThemeState(nextTheme);
  };

  const setLayoutMode = () => {
    setLayoutModeState('classic');
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
