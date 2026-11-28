import { expect, test } from '@playwright/test';

test('reader refuses a Quran pack whose multi-resource sync did not finish', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
  await page.goto('/baca?surah=1', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    const request = indexedDB.open('qurabic-quran-content', 3);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('content')) {
        const content = database.createObjectStore('content', {
          keyPath: ['resourceGroup', 'resourceId', 'recordType', 'recordKey'],
        });
        content.createIndex('by-resource', ['resourceGroup', 'resourceId'], { unique: false });
        content.createIndex('by-chapter', ['resourceGroup', 'resourceId', 'chapterId'], { unique: false });
      }
      if (!database.objectStoreNames.contains('staged-content')) {
        const staging = database.createObjectStore('staged-content', { keyPath: ['snapshotId', 'recordType', 'recordKey'] });
        staging.createIndex('by-snapshot', 'snapshotId', { unique: false });
      }
      if (!database.objectStoreNames.contains('sync-state')) database.createObjectStore('sync-state', { keyPath: 'resourcesFilter' });
      if (!database.objectStoreNames.contains('offline-package')) database.createObjectStore('offline-package', { keyPath: 'id' });
    };
    request.onerror = () => reject(new Error('Could not open offline Quran database'));
    request.onsuccess = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains('offline-package')) {
        database.close();
        reject(new Error('Offline package store was not initialized'));
        return;
      }
      const transaction = database.transaction('offline-package', 'readwrite');
      transaction.objectStore('offline-package').put({
        id: 'quran-content',
        resourcesFilter: 'quran_core:1;translations:20,33;recitations:7',
        savedAt: '2026-01-01T00:00:00.000Z',
        lastSuccessfulSyncAt: '2026-01-01T00:00:00.000Z',
        isConsistent: false,
      });
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => { database.close(); reject(new Error('Could not seed offline package state')); };
    };
  }));

  await page.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname;
    if (['api.quran.com', 'equran.id', 'api.quran.gading.dev', 'api.alquran.cloud'].includes(host)) {
      return route.abort();
    }
    return route.continue();
  });

  await page.goto('/baca?surah=1', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(
    'An offline pack is stored, but its previous sync did not finish. Connect to the internet and update the pack before reading offline.',
  )).toBeVisible({ timeout: 15000 });
});
