'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Download, Loader2, RefreshCw, Trash2, X } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { syncOfflineQuranContent, withOfflineQuranLock } from '@/lib/offline/quran-content-sync';
import type { OfflineSyncProgress } from '@/lib/offline/quran-content-sync';
import { deleteOfflineQuranPackage, getOfflineQuranPackage } from '@/lib/offline/quran-content-store';
import type { OfflineQuranPackage } from '@/lib/offline/quran-content-store';

const READER_SHELL_CACHE = 'qurabic-reader-shell-v1';
const READER_RUNTIME_CACHE = 'qurabic-static-runtime-v1';

async function isOfflineReaderShellReady(): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window) || !('serviceWorker' in navigator)) return false;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration?.active) return false;
    const cacheNames = await window.caches.keys();
    if (!cacheNames.includes(READER_SHELL_CACHE)) return false;
    const cache = await window.caches.open(READER_SHELL_CACHE);
    const runtimeCache = cacheNames.includes(READER_RUNTIME_CACHE)
      ? await window.caches.open(READER_RUNTIME_CACHE)
      : null;
    const reader = await cache.match(new URL('/baca', window.location.origin).toString());
    if (!reader) return false;
    const html = await reader.text();
    const assets = [...new Set([...html.matchAll(/(?:src|href)=["']([^"']*\/_next\/static\/[^"']+)["']/g)]
      .map((match) => new URL(match[1], window.location.origin).toString()))];
    if (assets.length === 0) return false;
    const cachedAssets = await Promise.all(assets.map(async (asset) => (
      await cache.match(asset) || await runtimeCache?.match(asset)
    )));
    return cachedAssets.every((response) => Boolean(response));
  } catch {
    return false;
  }
}

function syncErrorMessage(
  error: unknown,
  t: (id: string, en: string) => string,
  hasSavedPack: boolean,
  savedPackIsConsistent = true,
): string {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('not configured')) {
    return t('Sinkronisasi offline belum diaktifkan pada server aplikasi.', 'Offline sync is not enabled on the app server.');
  }
  if (message.includes('Connect to the internet')) {
    return t('Hubungkan perangkat ke internet untuk mengunduh atau memperbarui paket.', 'Connect to the internet to download or update the pack.');
  }
  if (message.includes('busy in another Qurabic tab')) {
    return t('Penyimpanan sedang dipakai tab Qurabic lain. Tunggu sebentar, lalu coba lagi.', 'Another Qurabic tab is using storage. Wait a moment, then try again.');
  }
  if (message.includes('storage is already busy')) {
    return t('Penyimpanan sedang dipakai. Tunggu sebentar, lalu coba lagi.', 'Storage is busy. Wait a moment, then try again.');
  }
  if (message.includes('storage')) {
    return t('Penyimpanan perangkat tidak dapat digunakan. Periksa ruang yang tersedia.', 'Device storage is unavailable. Check the available space.');
  }
  if (message.includes('incomplete')) {
    return hasSavedPack && !savedPackIsConsistent
      ? t('Sumber belum mengirim perubahan lengkap. Data tetap tersimpan, tetapi selesaikan sinkronisasi sebelum membaca offline.', 'The source did not return all updates. Stored data remains, but finish syncing before reading offline.')
      : t('Sumber tidak mengirim paket lengkap. Paket baru tidak ditandai tersimpan.', 'The source did not return a complete pack. No new pack was marked as saved.');
  }
  return hasSavedPack
    ? savedPackIsConsistent
      ? t('Pembaruan belum selesai. Paket offline yang tersimpan tetap ada; coba sinkronkan lagi saat online.', 'The update did not finish. Your saved offline pack is still present; sync again when online.')
      : t('Paket tersimpan, tetapi perubahan belum lengkap. Selesaikan sinkronisasi sebelum membaca offline.', 'The saved pack has incomplete updates. Finish syncing before reading offline.')
    : t('Paket belum berhasil diunduh. Tidak ada paket yang ditandai tersimpan.', 'The pack could not be downloaded. No pack was marked as saved.');
}

export default function OfflineQuranPackActions() {
  const { language, t } = useLanguage();
  const [offlinePackage, setOfflinePackage] = useState<OfflineQuranPackage | null>(null);
  const [readerShellReady, setReaderShellReady] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);
  const [progress, setProgress] = useState<OfflineSyncProgress | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const controllerRef = useRef<AbortController | null>(null);

  const refreshPackageState = useCallback(async () => {
    try {
      setOfflinePackage((await getOfflineQuranPackage()) || null);
    } catch {
      setError(t('Penyimpanan offline tidak dapat dibaca.', 'Offline storage could not be read.'));
    } finally {
      setChecking(false);
    }
  }, [t]);

  const refreshReaderShellState = useCallback(async (waitForWorker = false) => {
    let timeout: number | undefined;
    if (waitForWorker && 'serviceWorker' in navigator && !navigator.serviceWorker.controller) {
      await Promise.race([
        navigator.serviceWorker.ready.then(() => undefined).catch(() => undefined),
        new Promise<void>((resolve) => { timeout = window.setTimeout(resolve, 3_000); }),
      ]);
      if (timeout !== undefined) window.clearTimeout(timeout);
    }
    setReaderShellReady(await isOfflineReaderShellReady());
  }, []);

  const refreshStalePackage = useCallback(async () => {
    if (controllerRef.current || !navigator.onLine || document.visibilityState !== 'visible') return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setError('');
    let savedPackage: OfflineQuranPackage | undefined;
    try {
      savedPackage = await getOfflineQuranPackage();
      if (!savedPackage || controller.signal.aborted) return;
      const result = await syncOfflineQuranContent(false, setProgress, controller.signal);
      if (result.status === 'updated') {
        setNotice(t('Paket offline diperbarui.', 'Offline pack updated.'));
      }
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(syncErrorMessage(caught, t, true, savedPackage?.isConsistent !== false));
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setProgress(null);
        await refreshPackageState();
      }
    }
  }, [refreshPackageState, t]);

  useEffect(() => {
    void refreshPackageState();
    void refreshStalePackage();
    void refreshReaderShellState(true);
    const refreshWhenControlled = () => { void refreshReaderShellState(); };
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', refreshWhenControlled);
      void navigator.serviceWorker.ready.then(refreshWhenControlled).catch(() => undefined);
    }
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void refreshStalePackage();
    };
    const refreshInterval = window.setInterval(refreshStalePackage, 12 * 60 * 60 * 1000);
    window.addEventListener('online', refreshStalePackage);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.clearInterval(refreshInterval);
      window.removeEventListener('online', refreshStalePackage);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      if ('serviceWorker' in navigator) navigator.serviceWorker.removeEventListener('controllerchange', refreshWhenControlled);
    };
  }, [refreshPackageState, refreshReaderShellState, refreshStalePackage]);
  useEffect(() => () => controllerRef.current?.abort(), []);

  const startSync = async () => {
    if (controllerRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    setError('');
    setNotice('');
    setProgress({ phase: 'sync', page: 1 });

    try {
      let persistentStorage = false;
      try {
        persistentStorage = await navigator.storage?.persist?.() || false;
      } catch {
        persistentStorage = false;
      }
      await syncOfflineQuranContent(true, setProgress, controller.signal);
      await refreshPackageState();
      await refreshReaderShellState();
      setNotice(persistentStorage
        ? t('Teks Al-Qur’an dan dua terjemahan sudah tersimpan di perangkat.', 'Quran text and both translations are saved on this device.')
        : t('Teks dan terjemahan tersimpan di perangkat. Sistem dapat mengelola ulang penyimpanan saat ruang sangat terbatas.', 'Text and translations are saved on this device. The system may reclaim storage when space is critically low.'));
    } catch (caught) {
      if (controller.signal.aborted) {
        setNotice(offlinePackage
          ? t('Pembaruan dihentikan. Paket offline tetap ada; selesaikan sinkronisasi sebelum mengandalkannya.', 'Update stopped. The offline pack is still present; finish syncing before relying on it.')
          : t('Proses dihentikan. Data unduhan yang belum lengkap sudah dibersihkan.', 'Download stopped. Incomplete downloaded data was removed.'));
      } else {
        setError(syncErrorMessage(caught, t, Boolean(offlinePackage), offlinePackage?.isConsistent !== false));
      }
    } finally {
      controllerRef.current = null;
      setProgress(null);
      await refreshPackageState();
    }
  };

  const deletePack = async () => {
    const approved = window.confirm(t(
      'Hapus teks dan dua terjemahan yang disimpan di perangkat ini?',
      'Remove the saved Quran text and both translations from this device?',
    ));
    if (!approved) return;
    setError('');
    setNotice('');
    try {
      await withOfflineQuranLock(() => deleteOfflineQuranPackage());
      setOfflinePackage(null);
      setNotice(t('Paket teks dan terjemahan dihapus dari perangkat.', 'The Quran text and translation pack was removed from this device.'));
    } catch {
      setError(t('Paket tidak dapat dihapus. Coba lagi.', 'The pack could not be removed. Try again.'));
    }
  };

  const progressLabel = progress?.phase === 'snapshot'
    ? progress.resourceGroup === 'quran_core'
      ? t('Menyimpan teks Al-Qur’an…', 'Saving Quran text…')
      : progress.resourceGroup === 'recitations'
        ? t('Menyelaraskan audio qari…', 'Syncing recitation audio…')
        : t('Menyimpan terjemahan…', 'Saving translations…')
    : t(`Menyelaraskan halaman ${progress?.page || 1}…`, `Syncing page ${progress?.page || 1}…`);
  const savedAt = offlinePackage?.lastSuccessfulSyncAt
    ? new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en', { dateStyle: 'medium' }).format(new Date(offlinePackage.lastSuccessfulSyncAt))
    : '';

  return (
    <section aria-labelledby="offline-quran-heading" className="space-y-3 border-t border-hairline pt-4">
      <div>
        <h3 id="offline-quran-heading" className="text-sm font-semibold text-ink-primary">
          {t('Baca tanpa internet', 'Read offline')}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
          {t(
            'Simpan teks Al-Qur’an dan terjemahan Indonesia Kemenag RI serta Saheeh International. Paket ini mencakup semua 114 surah; audio dan bedah kata tidak termasuk.',
            'Save Quran text and the Kemenag RI Indonesian and Saheeh International translations. The pack includes all 114 surahs; audio and word study are separate.',
          )}
        </p>
        <p className="mt-1 text-xs text-ink-mute">
          {t('Sumber: ', 'Sources: ')}
          <a href="https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink-primary">
            Quran Foundation Content Sync
          </a>
          {' · Kemenag RI · Saheeh International'}
        </p>
      </div>

      {checking ? (
        <p role="status" className="text-sm text-ink-secondary">{t('Memeriksa penyimpanan…', 'Checking saved content…')}</p>
      ) : progress ? (
        <div className="flex min-h-11 items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm text-ink-secondary">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />{progressLabel}
          </p>
          <button type="button" onClick={() => controllerRef.current?.abort()} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-3 text-sm text-ink-secondary hover:bg-canvas-soft">
            <X className="h-4 w-4" aria-hidden="true" />{t('Hentikan', 'Stop')}
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void startSync()}
            className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] bg-primary px-4 text-sm font-medium text-white hover:bg-primary-deep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
            disabled={checking}
          >
            {offlinePackage ? <RefreshCw className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
            {offlinePackage ? t('Perbarui paket', 'Update pack') : t('Simpan semua surah', 'Save all surahs')}
          </button>
          {offlinePackage && (
            <button type="button" onClick={() => void deletePack()} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] px-3 text-sm text-ink-secondary hover:bg-canvas-soft hover:text-ink-primary">
              <Trash2 className="h-4 w-4" aria-hidden="true" />{t('Hapus', 'Remove')}
            </button>
          )}
        </div>
      )}

      {offlinePackage && offlinePackage.isConsistent === false && !progress && (
        <p role="status" className="text-sm leading-relaxed text-ink-secondary">
          {t('Data paket tetap tersimpan, tetapi pembaruan sebelumnya belum tuntas. Sambungkan internet dan selesaikan sinkronisasi sebelum mengandalkan paket offline.', 'Pack data is still stored, but the previous update did not finish. Connect to the internet and complete sync before relying on offline reading.')}
        </p>
      )}
      {offlinePackage && offlinePackage.isConsistent !== false && !progress && (
        <p className="flex items-center gap-2 text-sm text-ink-secondary">
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          {t(`Tersimpan di perangkat · diperbarui ${savedAt}`, `Saved on this device · updated ${savedAt}`)}
        </p>
      )}
      {readerShellReady === false && !progress && (
        <p role="note" className="text-sm leading-relaxed text-ink-secondary">
          {t('Pembaca offline belum tersimpan lengkap. Muat ulang halaman baca saat online, lalu coba lagi.', 'The offline reader is not fully cached. Reload the reader while online, then try again.')}
        </p>
      )}
      {error && <p role="alert" className="text-sm leading-relaxed text-ink-secondary">{error}</p>}
      {notice && <p role="status" className="text-sm leading-relaxed text-ink-secondary">{notice}</p>}
    </section>
  );
}
