/**
 * Google AdMob Integration for Qurabic Android (Capacitor)
 * 
 * Kebijakan Iklan Bersahaja & Hormat (Ethical & Respectful Ads Policy):
 * 1. ZERO ADS DI UI BACA QURAN: Halaman membaca Al-Qur'an (/baca), studi kata (/kata),
 *    akar kata (/akar), dan sufisme/meditasi (/rahm) 100% BEBAS IKLAN.
 * 2. Strict Frequency Capping: Maksimal 1 interstitial per 8 menit, dan maksimal 3 per sesi.
 * 3. Audio Shield: Iklan TIDAK PERNAH muncul jika murottal/audio sedang aktif diputar.
 * 4. Natural Break Only: Hanya muncul saat jeda alami (selesai kuis di /latihan atau setelah kembali dari modal non-baca).
 */

import { Capacitor } from '@capacitor/core';

// Official Google Sample Ad Unit IDs for Android Testing
export const ADMOB_TEST_IDS = {
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
} as const;

// Rute suci dan kontemplasi yang 100% BEBAS IKLAN
export const AD_FREE_ROUTE_PREFIXES = [
  '/baca',
  '/kata',
  '/akar',
  '/rahm',
] as const;

// Interval minimum antar-interstitial (8 menit)
const MIN_INTERSTITIAL_INTERVAL_MS = 8 * 60 * 1000;
// Waktu tenggang awal buka aplikasi sebelum iklan pertama boleh muncul (2 menit)
const INITIAL_GRACE_PERIOD_MS = 2 * 60 * 1000;
// Batas maksimal iklan per sesi
const MAX_ADS_PER_SESSION = 3;

let isInitialized = false;
let sessionAdsShown = 0;
let lastAdTimestamp = 0;
let appStartTimestamp = Date.now();

/**
 * Checks whether the app is running as a native Android/iOS mobile application
 */
export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
}

/**
 * Menentukan apakah halaman saat ini merupakan rute bebas iklan
 */
export function isAdFreePath(pathname: string): boolean {
  if (!pathname) return true;
  return AD_FREE_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Mengecek apakah ada pemutar audio yang sedang aktif bersuara di halaman
 */
function isAudioCurrentlyPlaying(): boolean {
  if (typeof document === 'undefined') return false;
  const audioElements = document.querySelectorAll('audio');
  for (let i = 0; i < audioElements.length; i++) {
    const el = audioElements[i];
    if (!el.paused && el.currentTime > 0 && !el.ended) {
      return true;
    }
  }
  return false;
}

/**
 * Initializes AdMob SDK safely on native Android platform
 */
export async function initializeAds(): Promise<boolean> {
  if (!isNativeApp()) {
    return false;
  }

  if (isInitialized) return true;

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.initialize({
      initializeForTesting: process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ADMOB_BANNER_ID,
    });
    isInitialized = true;
    return true;
  } catch (err) {
    console.warn('[Qurabic AdMob] Initialization error:', err);
    return false;
  }
}

/**
 * Menampilkan banner di bagian bawah HANYA pada rute yang diizinkan (non-Qur'an)
 */
export async function showBanner(
  currentPathname?: string,
  position: 'BOTTOM_CENTER' | 'TOP_CENTER' = 'BOTTOM_CENTER'
): Promise<boolean> {
  if (!isNativeApp()) return false;

  const path = currentPathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  if (isAdFreePath(path)) {
    // Pastikan banner tersembunyi di rute baca Quran / rahm
    await hideBanner();
    return false;
  }

  try {
    await initializeAds();
    const { AdMob, BannerAdPosition, BannerAdSize } = await import('@capacitor-community/admob');

    const adId = process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || ADMOB_TEST_IDS.BANNER;
    const adPosition =
      position === 'TOP_CENTER' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER;

    await AdMob.showBanner({
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: adPosition,
      margin: 0,
      isTesting: process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ADMOB_BANNER_ID,
    });
    return true;
  } catch (err) {
    console.warn('[Qurabic AdMob] Show banner failed:', err);
    return false;
  }
}

/**
 * Menyembunyikan banner iklan aktif (otomatis dipanggil saat masuk ke rute baca)
 */
export async function hideBanner(): Promise<boolean> {
  if (!isNativeApp()) return false;

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.hideBanner();
    return true;
  } catch {
    return false;
  }
}

/**
 * Menghapus elemen banner dari memori
 */
export async function removeBanner(): Promise<boolean> {
  if (!isNativeApp()) return false;

  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.removeBanner();
    return true;
  } catch {
    return false;
  }
}

export type AdTriggerContext = 'quiz_completed' | 'modal_back' | 'natural_break';

/**
 * Menampilkan Iklan Interstitial Secara Bersahaja & Menghormati Pengguna
 * - TIDAK PERNAH muncul di halaman baca Al-Qur'an (/baca, /kata, /akar, /rahm).
 * - TIDAK PERNAH memotong murottal tilawah audio.
 * - Mematuhi batas 8 menit antar-iklan dan maks 3 kali per sesi.
 */
export async function showRespectfulInterstitial(
  context: AdTriggerContext,
  currentPathname?: string
): Promise<boolean> {
  if (!isNativeApp()) return false;

  const path = currentPathname || (typeof window !== 'undefined' ? window.location.pathname : '');

  // 1. Pelindung Rute Baca Al-Qur'an & Kontemplasi
  if (isAdFreePath(path)) {
    return false;
  }

  // 2. Pelindung Audio Murottal (Jangan pernah ganggu jika audio sedang mengalun)
  if (isAudioCurrentlyPlaying()) {
    return false;
  }

  // 3. Batas Sesi & Grace Period
  const now = Date.now();
  if (now - appStartTimestamp < INITIAL_GRACE_PERIOD_MS) {
    return false;
  }

  if (sessionAdsShown >= MAX_ADS_PER_SESSION) {
    return false;
  }

  // 4. Cooldown 8 Menit
  if (lastAdTimestamp > 0 && now - lastAdTimestamp < MIN_INTERSTITIAL_INTERVAL_MS) {
    return false;
  }

  try {
    await initializeAds();
    const { AdMob } = await import('@capacitor-community/admob');

    const adId = process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || ADMOB_TEST_IDS.INTERSTITIAL;

    await AdMob.prepareInterstitial({
      adId,
      isTesting: process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID,
    });

    await AdMob.showInterstitial();
    lastAdTimestamp = Date.now();
    sessionAdsShown += 1;
    return true;
  } catch (err) {
    console.warn(`[Qurabic AdMob] Show interstitial skipped (${context}):`, err);
    return false;
  }
}
