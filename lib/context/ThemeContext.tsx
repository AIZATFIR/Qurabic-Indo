'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeType, THEME_OPTIONS, normalizeTheme } from './theme-config';

interface ThemeContextValue {
  theme: ThemeType;
  setTheme: (t: ThemeType) => void;
  options: typeof THEME_OPTIONS;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'blend',
  setTheme: () => {},
  options: THEME_OPTIONS,
});

const STORAGE_KEY = 'qurabic_theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('blend');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const normalized = saved ? normalizeTheme(saved) : null;
      if (normalized) setThemeState(normalized);
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

  const setTheme = (nextTheme: ThemeType) => {
    setThemeState(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, options: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
