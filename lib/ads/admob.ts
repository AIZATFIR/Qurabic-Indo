/**
 * Google AdMob Integration for Qurabic Android (Capacitor)
 * 
 * Kebijakan Iklan Bersahaja & Hormat (Ethical & Respectful Ads Policy):
 * 1. ZERO ADS DI AREA BELAJAR AL-QUR'AN: Reader, bedah kata, indeks akar/morfologi,
 *    kamus, pencarian ayat, ayat acak, dan refleksi 100% BEBAS IKLAN.
 * 2. Strict Frequency Capping: Maksimal 1 interstitial per 8 menit, dan maksimal 3 per sesi.
 * 3. Audio Shield: Iklan TIDAK PERNAH muncul jika murottal/audio sedang aktif diputar.
 * 4. Natural Break Only: Hanya muncul saat jeda alami (selesai kuis di /latihan atau setelah kembali dari modal non-baca).
 */

import { Capacitor } from '@capacitor/core';
import { isQuranAudioPlaying } from '../audio/active-audio-registry';

// Official Google Sample Ad Unit IDs for Android Testing
export const ADMOB_TEST_IDS = {
  APP_ID: 'ca-app-pub-3940256099942544~3347511713',
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
} as const;

const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production';
const PRODUCTION_ADMOB_APP_ID = process.env.NEXT_PUBLIC_ADMOB_APP_ID;
const PRODUCTION_BANNER_ID = process.env.NEXT_PUBLIC_ADMOB_BANNER_ID;
const PRODUCTION_INTERSTITIAL_ID = process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID;

function hasProductionAdConfiguration(): boolean {
  return Boolean(PRODUCTION_ADMOB_APP_ID && (PRODUCTION_BANNER_ID || PRODUCTION_INTERSTITIAL_ID));
}

// Rute suci dan kontemplasi yang 100% BEBAS IKLAN
export const AD_FREE_ROUTE_PREFIXES = [
  '/baca',
  '/kata',
  '/akar',
  '/morfologi',
  '/kamus',
  '/cari',
  '/ayat-random',
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
type AdmobConsentSnapshot = {
  canRequestAds: boolean;
  isConsentFormAvailable?: boolean;
  status: string;
  privacyOptionsRequirementStatus?: string;
};

let consentInfo: AdmobConsentSnapshot | null = null;
let consentInfoRequest: Promise<AdmobConsentSnapshot> | null = null;
let consentFormRequest: Promise<boolean> | null = null;
let adsInitializationRequest: Promise<boolean> | null = null;

async function loadConsentInfo(): Promise<AdmobConsentSnapshot> {
  if (consentInfo) return consentInfo;
  if (!consentInfoRequest) {
    consentInfoRequest = (async () => {
      const { AdMob } = await import('@capacitor-community/admob');
      const nextInfo = await AdMob.requestConsentInfo();
      consentInfo = nextInfo;
      return nextInfo;
    })().finally(() => {
      consentInfoRequest = null;
    });
  }
  return consentInfoRequest;
}

async function showRequiredConsentForm(): Promise<boolean> {
  if (!consentFormRequest) {
    consentFormRequest = (async () => {
      const { AdMob } = await import('@capacitor-community/admob');
      const nextInfo = await AdMob.showConsentForm();
      consentInfo = nextInfo;
      return nextInfo.canRequestAds;
    })().finally(() => {
      consentFormRequest = null;
    });
  }
  return consentFormRequest;
}

/** Refresh consent at launch and block ad requests until UMP permits them. */
export async function requestAdConsent(showRequiredForm = false): Promise<boolean> {
  if (!isNativeApp() || (IS_PRODUCTION_BUILD && !hasProductionAdConfiguration())) return false;
  if (consentInfo?.canRequestAds && !showRequiredForm) return true;
  if (consentFormRequest) return consentFormRequest;

  try {
    const currentInfo = await loadConsentInfo();
    if (showRequiredForm && currentInfo.isConsentFormAvailable && currentInfo.status === 'REQUIRED') {
      return await showRequiredConsentForm();
    }
    return currentInfo.canRequestAds;
  } catch (error) {
    consentInfo = null;
    console.warn('[Qurabic AdMob] Consent check failed; ads are disabled:', error);
    return false;
  }
}

export async function hasAdPrivacyOptions(): Promise<boolean> {
  if (!isNativeApp()) return false;
  if (!consentInfo) await requestAdConsent(false);
  return consentInfo?.privacyOptionsRequirementStatus === 'REQUIRED';
}

export async function showAdPrivacyOptions(): Promise<boolean> {
  if (!(await hasAdPrivacyOptions())) return false;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.showPrivacyOptionsForm();
    consentInfo = null;
    await requestAdConsent(false);
    return true;
  } catch (error) {
    console.warn('[Qurabic AdMob] Privacy options form could not be shown:', error);
    return false;
  }
}

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
  return AD_FREE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Mengecek apakah ada pemutar audio yang sedang aktif bersuara di halaman
 */
function isAudioCurrentlyPlaying(): boolean {
  if (isQuranAudioPlaying()) return true;
  if (typeof document === 'undefined') return false;
  const audioElements = document.querySelectorAll('audio');
  for (let i = 0; i < audioElements.length; i++) {
    const el = audioElements[i];
    if (!el.paused && !el.ended) return true;
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
  if (IS_PRODUCTION_BUILD && !hasProductionAdConfiguration()) return false;
  if (adsInitializationRequest) return adsInitializationRequest;

  adsInitializationRequest = (async () => {
    if (!(await requestAdConsent(true))) return false;
    if (isInitialized) return true;

    try {
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.initialize({ initializeForTesting: !IS_PRODUCTION_BUILD });
      isInitialized = true;
      return true;
    } catch (err) {
      console.warn('[Qurabic AdMob] Initialization error:', err);
      return false;
    }
  })().finally(() => {
    adsInitializationRequest = null;
  });

  return adsInitializationRequest;
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
  if (isAudioCurrentlyPlaying()) return false;
  if (IS_PRODUCTION_BUILD && !PRODUCTION_BANNER_ID) return false;

  try {
    if (!(await initializeAds())) return false;
    if (isAudioCurrentlyPlaying()) return false;
    const { AdMob, BannerAdPosition, BannerAdSize } = await import('@capacitor-community/admob');

    if (isAdFreePath(window.location.pathname) || isAudioCurrentlyPlaying()) return false;

    const adId = PRODUCTION_BANNER_ID || ADMOB_TEST_IDS.BANNER;
    const adPosition =
      position === 'TOP_CENTER' ? BannerAdPosition.TOP_CENTER : BannerAdPosition.BOTTOM_CENTER;

    await AdMob.showBanner({
      adId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: adPosition,
      margin: 0,
      isTesting: !IS_PRODUCTION_BUILD,
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
  if (IS_PRODUCTION_BUILD && !PRODUCTION_INTERSTITIAL_ID) return false;

  try {
    if (!(await initializeAds())) return false;
    const { AdMob } = await import('@capacitor-community/admob');

    const adId = PRODUCTION_INTERSTITIAL_ID || ADMOB_TEST_IDS.INTERSTITIAL;

    await AdMob.prepareInterstitial({
      adId,
      isTesting: !IS_PRODUCTION_BUILD,
    });

    if (isAdFreePath(window.location.pathname) || isAudioCurrentlyPlaying()) return false;
    await AdMob.showInterstitial();
    lastAdTimestamp = Date.now();
    sessionAdsShown += 1;
    return true;
  } catch (err) {
    console.warn(`[Qurabic AdMob] Show interstitial skipped (${context}):`, err);
    return false;
  }
}
