'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAds, hideBanner, isAdFreePath, isNativeApp } from '@/lib/ads/admob';

export default function AdsController() {
  const pathname = usePathname();

  // Inisialisasi AdMob saat aplikasi dibuka di native Android
  useEffect(() => {
    if (!isNativeApp()) return;
    initializeAds().catch(() => {});
  }, []);

  // Proteksi rute otomatis: sembunyikan banner seketika saat masuk ke rute suci / membaca
  useEffect(() => {
    if (!isNativeApp() || !pathname) return;

    if (isAdFreePath(pathname)) {
      hideBanner().catch(() => {});
    }
  }, [pathname]);

  return null;
}
