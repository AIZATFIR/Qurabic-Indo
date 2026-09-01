'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const BOOKMARKS_KEY = 'qurabic_indo_bookmarked_roots';

export function useBookmarks() {
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

  const toggleBookmark = (rootId: string, title?: string) => {
    setBookmarkedIds((prev) => {
      let updated: string[];
      if (prev.includes(rootId)) {
        updated = prev.filter((id) => id !== rootId);
        toast.info(title ? `Dihapus dari simpanan: ${title}` : 'Dihapus dari daftar tersimpan');
      } else {
        updated = [...prev, rootId];
        toast.success(title ? `Tersimpan: ${title}` : 'Disimpan ke daftar favorit');
      }
      try {
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save bookmark:', e);
      }
      return updated;
    });
  };

  const isBookmarked = (rootId: string) => bookmarkedIds.includes(rootId);

  return { bookmarkedIds, toggleBookmark, isBookmarked, isLoaded };
}
