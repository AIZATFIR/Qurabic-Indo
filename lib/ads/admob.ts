/**
 * Google AdMob Integration for Qurabic Android (Capacitor)
 * Pre-configured with official Google Sample Test IDs for safe development & testing.
 * When going to production, set NEXT_PUBLIC_ADMOB_BANNER_ID & NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID in .env
 */

import { Capacitor } from '@capacitor/core';

// Official Google Sample Ad Unit IDs for Android Testing
export const ADMOB_TEST_IDS = {
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
} as const;

let isInitialized = false;

/**
 * Checks whether the app is running as a native Android/iOS mobile application
 */
export function isNativeApp(): boolean {
  return typeof window !== 'undefined' && Capacitor.isNativePlatform();
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
      initializeForTesting: process.env.NODE_ENV !== 'production',
    });
    isInitialized = true;
    return true;
  } catch (err) {
    console.warn('[Qurabic AdMob] Initialization error:', err);
    return false;
  }
}

/**
 * Displays a bottom banner ad
 */
export async function showBanner(
  position: 'BOTTOM_CENTER' | 'TOP_CENTER' = 'BOTTOM_CENTER'
): Promise<boolean> {
  if (!isNativeApp()) return false;

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
 * Hides the active banner ad
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
 * Removes the banner ad completely from the DOM/view
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

/**
 * Prepares and displays an interstitial interstitial ad (e.g. between surah transitions or after completed quiz)
 */
export async function showInterstitial(): Promise<boolean> {
  if (!isNativeApp()) return false;

  try {
    await initializeAds();
    const { AdMob } = await import('@capacitor-community/admob');

    const adId = process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || ADMOB_TEST_IDS.INTERSTITIAL;

    await AdMob.prepareInterstitial({
      adId,
      isTesting: process.env.NODE_ENV !== 'production' || !process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID,
    });

    await AdMob.showInterstitial();
    return true;
  } catch (err) {
    console.warn('[Qurabic AdMob] Show interstitial failed:', err);
    return false;
  }
}
