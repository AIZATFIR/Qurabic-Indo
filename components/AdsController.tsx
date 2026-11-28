'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { hideBanner, isAdFreePath, isNativeApp, requestAdConsent } from '@/lib/ads/admob';

export default function AdsController() {
  const pathname = usePathname();

  // AdMob initializes at request time; this controller only hides banners on protected routes.

  useEffect(() => {
    if (!isNativeApp()) return;
    void requestAdConsent(true);
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
