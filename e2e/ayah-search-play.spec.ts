import { expect, test } from '@playwright/test';
import type { Route } from '@playwright/test';
import { mockQuranFoundationAudio } from './helpers/mock-qf-audio';

function silentWav(durationSeconds = 2): Buffer {
  const sampleRate = 8000;
  const sampleCount = sampleRate * durationSeconds;
  const wav = Buffer.alloc(44 + sampleCount, 128);
  wav.write('RIFF', 0);
  wav.writeUInt32LE(36 + sampleCount, 4);
  wav.write('WAVEfmt ', 8);
  wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20);
  wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(sampleRate, 24);
  wav.writeUInt32LE(sampleRate, 28);
  wav.writeUInt16LE(1, 32);
  wav.writeUInt16LE(8, 34);
  wav.write('data', 36);
  wav.writeUInt32LE(sampleCount, 40);
  return wav;
}

test('ayah search starts the selected recitation in its compact player', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  const fulfillAudio = (route: Route) => route.fulfill({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
    body: silentWav(60),
  });
  await page.route('**/verses.quran.com/Alafasy/mp3/*.mp3', fulfillAudio);
  await page.route('**/audio.qurancdn.com/Alafasy/mp3/*.mp3', fulfillAudio);
  await page.route('**/api/search/ayah**', route => route.fulfill({
    status: 200,
    json: { results: [{
      surah: 1,
      ayah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationId: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      surahName: 'Al-Fatihah',
      surahNameEnglish: 'Al-Fatihah',
    }] },
  }));
  await page.goto('/cari?q=Allah', { waitUntil: 'domcontentloaded' });
  const playButton = page.getByRole('button', { name: /Putar .*ayat/ }).first();
  await expect(playButton).toBeVisible({ timeout: 15000 });
  await playButton.click();
  await expect(page.getByLabel('Pemutar audio Al-Qur’an')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jeda', exact: true })).toBeVisible();
});

test('ayah search appends later pages and retries without losing the first page', async ({ page }) => {
  const firstPage = Array.from({ length: 30 }, (_, index) => ({
    surah: 2,
    ayah: index + 1,
    arabic: `آية ${index + 1}`,
    translationId: `Ayat hasil ${index + 1}`,
    surahName: 'Al-Baqarah',
    surahNameEnglish: 'Al-Baqarah',
  }));
  let secondPageAttempts = 0;
  await page.route('**/api/search/ayah**', async (route) => {
    const url = new URL(route.request().url());
    if (url.searchParams.get('page') === '2') {
      secondPageAttempts += 1;
      if (secondPageAttempts === 1) {
        await route.fulfill({ status: 503, json: { error: 'unavailable' } });
        return;
      }
      await route.fulfill({ status: 200, json: {
        page: 2,
        hasMore: false,
        results: [{
          surah: 2,
          ayah: 31,
          arabic: 'آية 31',
          translationId: 'Ayat hasil 31',
          surahName: 'Al-Baqarah',
          surahNameEnglish: 'Al-Baqarah',
        }],
      } });
      return;
    }
    await route.fulfill({ status: 200, json: { page: 1, hasMore: true, results: firstPage } });
  });

  await page.goto('/cari?q=hasil', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: /^Ayat/ }).click();
  const loadMore = page.getByRole('button', { name: 'Muat ayat berikutnya' });
  await expect(page.getByText('Ayat hasil 1', { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(loadMore).toBeVisible();
  await loadMore.click();
  await expect(page.getByText('Halaman berikutnya gagal dimuat.')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.getByText('Ayat hasil 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Coba lagi' }).click();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByText('Ayat hasil 31')).toBeVisible();
  await expect(loadMore).toHaveCount(0);
  expect(secondPageAttempts).toBe(2);
});

test('English ayah search loads English word meanings only when requested', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
  await page.route('**/api/search/ayah**', route => route.fulfill({
    status: 200,
    json: { results: [{
      surah: 1,
      ayah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationEnglish: 'In the name of Allah, the Most Merciful.',
      surahName: 'Al-Fatihah',
      surahNameEnglish: 'Al-Fatihah',
    }] },
  }));

  let requestedLanguage = '';
  await page.route('**/api/verse-words**', route => {
    const url = new URL(route.request().url());
    requestedLanguage = url.searchParams.get('language') || '';
    return route.fulfill({
      status: 200,
      json: {
        language: 'en',
        source: 'Quran.com Word-by-Word · API v4',
        tokens: [{ location: '1:1:1', arabic: 'بِسْمِ', transliteration: 'bismi', meaning: 'In the name' }],
      },
    });
  });

  await page.goto('/cari?q=mercy', { waitUntil: 'domcontentloaded' });
  const wordMeanings = page.getByRole('button', { name: 'Word meanings' }).first();
  await expect(wordMeanings).toBeVisible();
  expect(requestedLanguage, 'word meanings should not load before the reader asks for them').toBe('');
  await wordMeanings.click();
  await expect(page.getByText('In the name', { exact: true })).toBeVisible();
  expect(requestedLanguage).toBe('en');
  await expect(page.getByText('Arti belum tersedia')).toHaveCount(0);
});

test('Indonesian ayah search requests Indonesian word meanings', async ({ page }) => {
  await page.route('**/api/search/ayah**', route => route.fulfill({
    status: 200,
    json: { results: [{
      surah: 1,
      ayah: 1,
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translationId: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
      surahName: 'Al-Fatihah',
      surahNameEnglish: 'Al-Fatihah',
    }] },
  }));

  let requestedLanguage = '';
  await page.route('**/api/verse-words**', route => {
    const url = new URL(route.request().url());
    requestedLanguage = url.searchParams.get('language') || '';
    return route.fulfill({
      status: 200,
      json: {
        language: 'id',
        source: 'Quran.com Word-by-Word · API v4',
        tokens: [{ location: '1:1:1', arabic: 'بِسْمِ', transliteration: 'bismi', meaning: 'Dengan nama' }],
      },
    });
  });

  await page.goto('/cari?q=Allah', { waitUntil: 'domcontentloaded' });
  const wordMeanings = page.getByRole('button', { name: 'Arti per kata' }).first();
  await expect(wordMeanings).toBeVisible();
  expect(requestedLanguage).toBe('');
  await wordMeanings.click();
  await expect(page.getByText('Dengan nama', { exact: true })).toBeVisible();
  expect(requestedLanguage).toBe('id');
  await expect(page.getByText('Meaning unavailable')).toHaveCount(0);
});


test('English root occurrences load Saheeh in bounded batches and retry a failed request', async ({ page }) => {
  const requestedKeys: string[][] = [];
  let failFirstRequest = true;
  await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
  await page.route('**/api/verse-translation', async (route) => {
    const body = route.request().postDataJSON() as { verseKeys: string[] };
    requestedKeys.push(body.verseKeys);
    if (failFirstRequest) {
      failFirstRequest = false;
      await route.fulfill({ status: 502, json: { error: 'temporarily unavailable' } });
      return;
    }
    await route.fulfill({
      status: 200,
      json: {
        translations: Object.fromEntries(body.verseKeys.map((key) => [key, 'Mock Saheeh International translation.'])),
        unavailable: [],
        failed: [],
        source: 'Saheeh International · Quran.com',
      },
    });
  });

  await page.goto('/akar/r-H-m', { waitUntil: 'domcontentloaded' });
  const occurrences = page.locator('#concordance');
  await expect(occurrences.getByText('Translation could not be loaded.').first()).toBeVisible({ timeout: 20000 });
  expect(requestedKeys[0].length).toBeGreaterThan(0);
  expect(requestedKeys[0].length).toBeLessThanOrEqual(20);
  await occurrences.getByRole('button', { name: 'Retry failed translations' }).click();
  await expect(occurrences.getByText('Mock Saheeh International translation.').first()).toBeVisible();
  await expect(occurrences.getByText('Saheeh International · Quran.com').first()).toBeVisible();
  await expect(occurrences.getByText(/Kemenag RI/)).toHaveCount(0);
});


test('root family pagination exposes all QAC lemmas', async ({ page }) => {
  await page.goto('/akar/q-w-m', { waitUntil: 'networkidle' });
  const familyPages = page.getByRole('navigation', { name: 'Halaman keluarga kata' });
  await expect(familyPages.getByText(/1–6 dari 22 lemma/)).toBeVisible({ timeout: 20000 });
  await familyPages.getByRole('button', { name: 'Berikutnya' }).click();
  await expect(familyPages.getByText(/7–12 dari 22 lemma/)).toBeVisible();
  await familyPages.getByRole('button', { name: 'Berikutnya' }).click();
  await familyPages.getByRole('button', { name: 'Berikutnya' }).click();
  await expect(familyPages.getByText(/19–22 dari 22 lemma/)).toBeVisible();
  await expect(familyPages.getByRole('button', { name: 'Berikutnya' })).toBeDisabled();
});
