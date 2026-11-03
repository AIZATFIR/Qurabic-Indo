'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type Language = 'id' | 'en';
const STORAGE_KEY = 'qurabic_language';
const LanguageContext = createContext({
  language: 'id' as Language,
  setLanguage: (_language: Language) => {},
  t: (indonesian: string, _english: string) => indonesian,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'id' || saved === 'en') setLanguageState(saved);
    } catch { /* Language selection still works when storage is unavailable. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Keep the session preference. */ }
  }, []);
  const t = useCallback((indonesian: string, english: string) => language === 'en' ? english : indonesian, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() { return useContext(LanguageContext); }
