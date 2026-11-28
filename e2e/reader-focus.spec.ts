import { expect, test } from '@playwright/test';
import { mockQuranFoundationAudio } from './helpers/mock-qf-audio';

function silentWav(durationSeconds = 10): Buffer {
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

async function mockVerseAudio(page: import('@playwright/test').Page, ayah: number) {
  const verse = String(ayah).padStart(3, '0');
  await page.route(`**/verses.quran.com/Alafasy/mp3/018${verse}.mp3`, route => route.fulfill({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
    body: silentWav(),
  }));
}

async function waitForReader(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const button = document.querySelector('button[aria-label="Masuk mode fokus"]');
    return button && Object.keys(button).some(key => key.startsWith('__reactProps$'));
  });
  await expect(page.locator('#ayah-1')).toBeVisible();
}

test('tafsir load failure offers a retry and recovers without reopening the verse', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  let requests = 0;
  await page.route('**/api/tafsir*', route => {
    requests += 1;
    return requests === 1
      ? route.fulfill({ status: 503, json: { error: 'Tafsir unavailable' } })
      : route.fulfill({ status: 200, json: { data: { text: 'Tafsir text from the configured source.', sourceTitle: 'Pinned archive' } } });
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Tafsir', exact: true }).first().click();

  await expect(page.getByRole('alert').getByText('Tafsir gagal dimuat. Periksa koneksi lalu coba lagi.')).toBeVisible();
  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await expect(page.getByText('Tafsir text from the configured source.')).toBeVisible();
  expect(requests).toBe(2);
});

test('word meanings can be hidden and restored from reading settings', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Pengaturan Tampilan' }).click();

  const meanings = page.locator('[data-inline-meaning]');
  const toggle = page.getByRole('button', { name: 'Arti Per Kata' });
  await expect(meanings.first()).toBeVisible();
  await toggle.click();
  await expect(meanings).toHaveCount(0);
  await toggle.click();
  await expect(meanings.first()).toBeVisible();
});

test('focus mode leaves the reader and a compact header visible', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await mockVerseAudio(page, 1);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  await page.getByRole('button', { name: 'Masuk mode fokus' }).click();

  await expect(page.locator('[data-reader-focus="true"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lompat Ayat' })).toHaveCount(0);
  await expect(page.locator('#ayah-1')).toBeVisible();
  await expect(page.getByLabel('Pemutar audio Al-Qur’an')).toHaveAttribute('data-player-mode', 'compact');
  const headerFits = await page.locator('#reader-headbar > div').evaluate(element => element.scrollWidth <= element.clientWidth);
  expect(headerFits).toBe(true);
  await page.getByRole('button', { name: 'Keluar dari mode fokus' }).click();
  await expect(page.getByRole('button', { name: 'Lompat Ayat' })).toBeVisible();
});

test('audio player can shrink to a small control and hide without stopping', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await mockVerseAudio(page, 1);
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await page.getByRole('button', { name: 'Ringkas pemutar' }).click();
  await expect(player).toHaveAttribute('data-player-mode', 'compact');
  expect(await player.evaluate(element => element.getBoundingClientRect().width)).toBeLessThanOrEqual(280);
  await expect(page.getByRole('button', { name: 'Ayat sebelumnya' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Ayat selanjutnya' })).toBeVisible();

  await page.getByRole('button', { name: 'Sembunyikan pemutar' }).click();
  await expect(player).toHaveAttribute('data-player-mode', 'hidden');
  await expect(page.getByRole('button', { name: 'Tampilkan pemutar audio' })).toBeVisible();
  await page.getByRole('button', { name: 'Tampilkan pemutar audio' }).click();
  await expect(page.getByRole('button', { name: 'Jeda', exact: true })).toBeVisible();
});

test('ayah repeat offers a chosen total play count', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await mockVerseAudio(page, 1);
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const repeatMode = page.getByRole('combobox', { name: 'Ulangi' });
  await repeatMode.selectOption('ayah');
  const repeatCount = page.getByRole('combobox', { name: 'Jumlah pengulangan ayat' });
  await expect(repeatCount).toBeVisible();
  await repeatCount.selectOption('5');
  await expect(repeatCount).toHaveValue('5');
});

test('ayah repeat plays the selected verse twice before advancing', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await page.route('**/verses.quran.com/Alafasy/mp3/018001.mp3', route => route.fulfill({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
    body: silentWav(4),
  }));
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.evaluate(() => {
    const audioWindow = window as typeof window & { __audioPlaySources?: string[] };
    audioWindow.__audioPlaySources = [];
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      if (this instanceof HTMLAudioElement) audioWindow.__audioPlaySources?.push(this.currentSrc || this.src);
      return originalPlay.call(this);
    };
  });
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  const pause = player.getByRole('button', { name: 'Jeda', exact: true });
  await expect(pause).toBeVisible();
  await pause.click();
  const resume = player.getByRole('button', { name: 'Putar', exact: true });
  await expect(resume).toBeVisible();
  await player.getByRole('combobox', { name: 'Ulangi' }).selectOption('ayah');
  await player.getByRole('combobox', { name: 'Jumlah pengulangan ayat' }).selectOption('2');

  const previousSources = await page.evaluate(() => (window as typeof window & { __audioPlaySources?: string[] }).__audioPlaySources || []);
  const verseSource = previousSources.at(-1);
  expect(verseSource).toBeTruthy();
  await resume.click();
  await expect.poll(async () => page.evaluate(({ source, previousLength }) => {
    const played = (window as typeof window & { __audioPlaySources?: string[] }).__audioPlaySources || [];
    return played.slice(previousLength).filter(item => item === source).length;
  }, { source: verseSource, previousLength: previousSources.length }), { timeout: 10000 }).toBeGreaterThanOrEqual(2);
});

test('audio jumps align the beginning of the verse below the sticky header', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await mockVerseAudio(page, 2);
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 2', exact: true }).click();
  const verse = page.locator('#ayah-2');
  await expect(verse).toBeVisible();
  await expect.poll(async () => {
    const [verseTop, headerBottom] = await Promise.all([
      verse.evaluate(element => element.getBoundingClientRect().top),
      page.locator('#reader-headbar').evaluate(element => element.getBoundingClientRect().bottom),
    ]);
    return verseTop - headerBottom;
  }).toBeGreaterThanOrEqual(-2);
  await expect.poll(async () => {
    const [verseTop, headerBottom] = await Promise.all([
      verse.evaluate(element => element.getBoundingClientRect().top),
      page.locator('#reader-headbar').evaluate(element => element.getBoundingClientRect().bottom),
    ]);
    return verseTop - headerBottom;
  }).toBeLessThanOrEqual(16);
});

test('verse audio can be saved to persistent app storage', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await mockVerseAudio(page, 1);
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();
  await player.getByRole('checkbox').uncheck();
  await player.getByRole('button', { name: 'Simpan ayat 1 offline' }).click();
  await expect(player.getByRole('status')).toContainText('tersimpan');
  const cached = await page.evaluate(async () => {
    const keys = await caches.keys();
    const cache = await caches.open(keys.find(key => key === 'qurabic-audio-cache-v1')!);
    return Boolean(await cache.match('https://verses.quran.com/Alafasy/mp3/018001.mp3'));
  });
  expect(cached).toBe(true);

  await player.getByRole('button', { name: 'Jeda', exact: true }).click();
  await page.unroute('**/verses.quran.com/Alafasy/mp3/018001.mp3');
  await page.context().setOffline(true);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  await expect(page.getByLabel('Pemutar audio Al-Qur’an').getByRole('button', { name: 'Jeda', exact: true })).toBeVisible({ timeout: 5000 });
  await page.context().setOffline(false);
});

test('short surahs can be saved one verse at a time before playback', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  await page.route('**/verses.quran.com/Alafasy/mp3/112*.mp3', route => route.fulfill({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
    body: silentWav(),
  }));
  await page.goto('/baca?surah=112', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();
  await player.getByRole('button', { name: 'Simpan seluruh surah · 4 ayat' }).click();
  await expect(player.getByRole('status')).toContainText('tersimpan');
  const count = await page.evaluate(async () => {
    const cache = await caches.open('qurabic-audio-cache-v1');
    return (await cache.keys()).filter(request => /11200[1-4]\.mp3$/.test(request.url)).length;
  });
  expect(count).toBe(4);
});

test('reader offers nine paper colours with an accessible selected state', async ({ page }) => {
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Pengaturan Tampilan' }).click();
  const swatches = page.getByRole('button', { name: /^Warna kertas:/ });
  await expect(swatches).toHaveCount(9);
  await swatches.nth(1).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'linen');
  await page.getByRole('button', { name: /^Warna kertas: Bookpaper klasik$/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'bookpaper');
  await expect(page.locator('body')).toHaveCSS('background-image', /repeating-linear-gradient/);
});
