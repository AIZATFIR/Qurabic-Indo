import { expect, test } from '@playwright/test';
import { SURAH_LIST } from '../lib/data/surah-list';

test('English verse search falls back to the complete Saheeh pack saved offline', async ({ page }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('qurabic_language')) localStorage.setItem('qurabic_language', 'en');
  });
  await page.route('**/api/search/ayah**', (route) => route.fulfill({
    status: 503,
    json: { error: 'rate limit not configured', code: 'EDGE_RATE_LIMIT_REQUIRED' },
  }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const translations = SURAH_LIST.flatMap((surah) => Array.from({ length: surah.ayahsCount }, (_, index) => {
    const ayah = index + 1;
    const verseKey = `${surah.number}:${ayah}`;
    return {
      resourceGroup: 'translations',
      resourceId: 20,
      recordType: 'translation',
      recordKey: `translation:${verseKey}`,
      chapterId: surah.number,
      data: { verse_key: verseKey, text: verseKey === '1:1' ? 'Mercy is near.' : `Verse ${verseKey}.` },
      updatedAt: '2026-11-29T00:00:00.000Z',
    };
  }));
  const translationsId = SURAH_LIST.flatMap((surah) => Array.from({ length: surah.ayahsCount }, (_, index) => {
    const ayah = index + 1;
    const verseKey = `${surah.number}:${ayah}`;
    return {
      resourceGroup: 'translations',
      resourceId: 33,
      recordType: 'translation',
      recordKey: `translation:${verseKey}`,
      chapterId: surah.number,
      data: { verse_key: verseKey, text: verseKey === '1:1' ? 'Rahmat itu dekat.' : `Ayat ${verseKey}.` },
      updatedAt: '2026-11-29T00:00:00.000Z',
    };
  }));
  const core = Array.from({ length: SURAH_LIST[0].ayahsCount }, (_, index) => {
    const ayah = index + 1;
    return {
      resourceGroup: 'quran_core',
      resourceId: 1,
      recordType: 'verse',
      recordKey: `verse:${ayah}`,
      chapterId: 1,
      data: { verse_key: `1:${ayah}`, verse_number: ayah, text_uthmani: `آية ${ayah}` },
      updatedAt: '2026-11-28T00:00:00.000Z',
    };
  });

  const storedRows = await page.evaluate(async ({ translations, core }) => {
    const request = indexedDB.open('qurabic-quran-content', 3);
    request.onupgradeneeded = () => {
      const database = request.result;
      const content = database.createObjectStore('content', {
        keyPath: ['resourceGroup', 'resourceId', 'recordType', 'recordKey'],
      });
      content.createIndex('by-resource', ['resourceGroup', 'resourceId'], { unique: false });
      content.createIndex('by-chapter', ['resourceGroup', 'resourceId', 'chapterId'], { unique: false });
      const staging = database.createObjectStore('staged-content', { keyPath: ['snapshotId', 'recordType', 'recordKey'] });
      staging.createIndex('by-snapshot', 'snapshotId', { unique: false });
      database.createObjectStore('sync-state', { keyPath: 'resourcesFilter' });
      database.createObjectStore('offline-package', { keyPath: 'id' });
    };
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const transaction = database.transaction(['content', 'offline-package'], 'readwrite');
    const content = transaction.objectStore('content');
    for (const row of [...translations, ...core]) content.put(row);
    transaction.objectStore('offline-package').put({
      id: 'quran-content',
      resourcesFilter: 'quran_core:1;translations:20,33;recitations:7',
      savedAt: '2026-11-28T00:00:00.000Z',
      lastSuccessfulSyncAt: '2026-11-28T00:00:00.000Z',
      isConsistent: true,
    });
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    const storedCount = await new Promise<number>((resolve, reject) => {
      const transaction = database.transaction('content', 'readonly');
      const count = transaction.objectStore('content').count();
      count.onsuccess = () => resolve(count.result);
      count.onerror = () => reject(count.error);
    });
    database.close();
    return storedCount;
  }, { translations: [...translations, ...translationsId], core });
  expect(storedRows).toBe(translations.length + translationsId.length + core.length);

  await page.goto('/cari?q=mercy', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Offline results · Saheeh International translation saved on this device.'))
    .toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Mercy is near.', { exact: true })).toBeVisible();

  await page.getByLabel('Language').selectOption('id');
  await page.goto('/cari?q=rahmat', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Hasil offline · terjemahan Kemenag RI yang tersimpan di perangkat.'))
    .toBeVisible({ timeout: 15_000 });
  await expect(page.getByText('Rahmat itu dekat.', { exact: true })).toBeVisible();
});
