'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { toast } from 'sonner';

const BOOKMARKS_KEY = 'qurabic_indo_bookmarked_roots';

export function useBookmarks() {
  const { t } = useLanguage();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_KEY);
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load bookmarks from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      try { const values = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '[]'); if (Array.isArray(values)) setBookmarkedIds(values); } catch { /* Invalid saved data is ignored. */ }
    };
    window.addEventListener('qurabic-bookmarks', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('qurabic-bookmarks', sync); window.removeEventListener('storage', sync); };
  }, []);

  const toggleBookmark = (rootId: string, title?: string) => {
    setBookmarkedIds((prev) => {
      let updated: string[];
      if (prev.includes(rootId)) {
        updated = prev.filter((id) => id !== rootId);
        toast.info(title ? `${t('Dihapus dari simpanan', 'Removed from saved')}: ${title}` : t('Dihapus dari daftar tersimpan', 'Removed from saved'));
      } else {
        updated = [...prev, rootId];
        toast.success(title ? `${t('Tersimpan', 'Saved')}: ${title}` : t('Disimpan ke daftar favorit', 'Saved to favourites'));
      }
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
        queueMicrotask(() => window.dispatchEvent(new Event('qurabic-bookmarks')));
      } catch (e) {
        console.error('Failed to save bookmark:', e);
      }
      return updated;
    });
  };

  const isBookmarked = (rootId: string) => bookmarkedIds.includes(rootId);

  return { bookmarkedIds, toggleBookmark, isBookmarked, isLoaded };
}
