import { expect, test } from '@playwright/test';

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

test('word meanings can be hidden and restored from reading settings', async ({ page }) => {
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
  await mockVerseAudio(page, 1);
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await waitForReader(page);
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await page.getByRole('button', { name: 'Ringkas pemutar' }).click();
  await expect(player).toHaveAttribute('data-player-mode', 'compact');
  expect(await player.evaluate(element => element.getBoundingClientRect().width)).toBeLessThanOrEqual(260);

  await page.getByRole('button', { name: 'Sembunyikan pemutar' }).click();
  await expect(player).toHaveAttribute('data-player-mode', 'hidden');
  await expect(page.getByRole('button', { name: 'Tampilkan pemutar audio' })).toBeVisible();
  await page.getByRole('button', { name: 'Tampilkan pemutar audio' }).click();
  await expect(page.getByRole('button', { name: 'Jeda', exact: true })).toBeVisible();
});

test('audio jumps align the beginning of the verse below the sticky header', async ({ page }) => {
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
  await player.getByRole('button', { name: 'Simpan semua 4 ayat offline' }).click();
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
