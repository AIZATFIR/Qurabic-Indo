import { expect, test } from '@playwright/test';
import { mockQuranFoundationAudio } from './helpers/mock-qf-audio';

function silentWav(durationSeconds: number): Buffer {
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

test('surah picker follows the selected paper theme and shared surface shape', async ({ page }) => {
  await page.goto('/baca', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const picker = document.querySelector('button[title="Ganti Surah"]');
    return picker && Object.keys(picker).some((key) => key.startsWith('__reactProps$'));
  });
  await page.locator('button[title="Ganti Surah"]').click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const currentSurah = dialog.locator('button[aria-pressed="true"]');
  const themeTokens = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      surfaceRadius: `${parseFloat(root.getPropertyValue('--radius-surface')) * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`,
      controlRadius: `${parseFloat(root.getPropertyValue('--radius-control')) * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`,
      primary: root.getPropertyValue('--color-primary').trim(),
      primaryFixed: root.getPropertyValue('--color-primary-fixed').trim(),
    };
  });
  const toRgb = (hex: string) => `rgb(${hex.match(/[\da-f]{2}/gi)?.map((value) => parseInt(value, 16)).join(', ')})`;
  await expect(dialog).toHaveCSS('border-radius', themeTokens.surfaceRadius);
  await expect(dialog.getByRole('textbox')).toHaveCSS('border-radius', themeTokens.controlRadius);
  await expect(currentSurah).toHaveCSS('color', toRgb(themeTokens.primary));
  await expect(currentSurah).toHaveCSS('background-color', toRgb(themeTokens.primaryFixed));
  await expect(page.locator('#reader-headbar > div')).toHaveCSS('border-radius', themeTokens.surfaceRadius);
});

test('home navigation uses one paper capsule and omits the corpus badge', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Korpus Bahasa Al-Qur’an')).toHaveCount(0);

  const navigation = page.locator('[data-ui="primary-navigation"] > div');
  const surfaceRadius = await page.evaluate(() => `${parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--radius-surface')) * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`);
  await expect(navigation).toHaveCSS('border-radius', surfaceRadius);
  await expect(navigation.locator('select')).toHaveClass(/rounded-full/);
});

test('about page links to distinct classical and broader Arabic lexicons', async ({ page }) => {
  await page.goto('/tentang', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Al-Mufradāt fī Gharīb al-Qur’ān · al-Rāghib al-Iṣfahānī' })).toHaveAttribute('href', /sites\.dlib\.nyu\.edu/);
  await expect(page.getByRole('link', { name: 'Qabas · Birzeit University' })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas');
  await expect(page.getByText(/Qurabic belum menyalin datanya/)).toBeVisible();
});

test('mobile reader keeps the Surah picker inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/baca', { waitUntil: 'domcontentloaded' });
  const picker = page.locator('button[title="Ganti Surah"]');
  await page.waitForFunction(() => {
    const button = document.querySelector('button[title="Ganti Surah"]');
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
  });
  await picker.waitFor();
  await picker.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds!.x).toBeGreaterThanOrEqual(8);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(382);
  await page.keyboard.press('Escape');
  const headerFits = await page.locator('#reader-headbar > div').evaluate((element) => element.scrollWidth <= element.clientWidth);
  expect(headerFits).toBe(true);
});

test('audio tracker moves its thumb with a compositor transform', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  const wav = silentWav(6);
  await page.route('**/verses.quran.com/Alafasy/mp3/018001.mp3', route => route.fulfill({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
    body: wav,
  }));
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();

  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  const thumb = player.locator('[data-audio-progress] > span').nth(1);
  const position = player.getByRole('slider', { name: 'Posisi audio' });
  await expect.poll(async () => Number(await position.getAttribute('value')), { timeout: 8000 }).toBeGreaterThan(0);
  await expect.poll(() => thumb.evaluate(element => (element as HTMLElement).style.transform), { timeout: 8000 })
    .toMatch(/translateX\(/);
  const currentTransform = () => thumb.evaluate(element => (element as HTMLElement).style.transform);
  const firstTransform = await currentTransform();
  await expect.poll(currentTransform, { timeout: 1500 }).not.toBe(firstTransform);
});

test('translation playback stays human-only and handles missing Indonesian recordings', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  let generatedRequests = 0;
  await page.addInitScript(() => {
    localStorage.setItem('qurabic_language', 'id');
    localStorage.setItem('qurabic_audio_translation_voice', 'ai-fallback');
  });
  await page.route('**/quran-terjemahan-indonesia-audio-by-ayah/**', route => {
    generatedRequests++;
    return route.abort();
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await expect(page.locator('#ayah-1')).toBeVisible();
  await page.getByRole('button', { name: 'Putar Tilawah', exact: true }).click();

  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();
  const voiceMode = player.getByRole('combobox', { name: 'Audio terjemahan' });
  await expect(voiceMode).toHaveValue('human');
  await expect(voiceMode.locator('option')).toHaveCount(2);
  await player.getByRole('combobox', { name: 'Mode handsfree' }).selectOption('reverse');
  await expect(player.getByRole('status')).toContainText(/Rekaman terjemahan manusia(?: untuk ayat \d+)? tidak tersedia/);
  expect(generatedRequests).toBe(0);
});

test('English handsfree follows the interface language and respects translation-audio rights', async ({ page }) => {
  await mockQuranFoundationAudio(page);
  const requests: string[] = [];
  await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
  await page.route('**/verses.quran.com/Alafasy/mp3/018001.mp3', route => route.fulfill({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
    body: silentWav(3),
  }));
  await page.route('**/everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/018001.mp3', async route => {
    requests.push(route.request().url());
    await route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
      body: silentWav(3),
    });
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await expect(page.locator('#ayah-1')).toBeVisible();
  await page.getByRole('button', { name: 'Handsfree', exact: true }).click();
  await page.getByRole('button', { name: /English → Arabic/ }).click();
  const player = page.getByLabel('Quran audio player');
  await expect(player).toBeVisible();
  await expect(player.getByRole('combobox', { name: 'Handsfree mode' })).toHaveValue('reverse');
  await expect(player.getByRole('status')).toContainText('Human translation audio for verse 1 is unavailable. Quran recitation remains available.');
  expect(requests).toEqual([]);
});

test('word study modal leaves loading state and renders the source-backed entry', async ({ page }) => {
  test.setTimeout(60000);
  const extraExcerptRequests: string[] = [];
  page.on('request', (request) => {
    if (new URL(request.url()).searchParams.get('excerpt') === 'lane-root-v1') extraExcerptRequests.push(request.url());
  });
  await page.route('**/api/word-detail?*', async (route) => {
    if (new URL(route.request().url()).searchParams.has('excerpt')) return route.continue();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  // Wait for client hydration through a real, reversible control interaction.
  await page.getByRole('button', { name: 'Pengaturan Tampilan' }).click();
  await expect(page.getByText('Pengaturan Bacaan', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Tutup pengaturan' }).click();
  const firstWord = page.locator('[role="button"][aria-label^="Bedah kata:"]').first();
  await firstWord.waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForFunction(() => {
    const button = document.querySelector('[role="button"][aria-label^="Bedah kata:"]');
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
  });
  const detailResponse = page.waitForResponse(response => response.url().includes('/api/word-detail?') && !response.url().includes('excerpt='));
  await firstWord.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Padanan kata dalam ayat|Word gloss in this verse/, { exact: true })).toBeVisible();
  await expect(dialog.getByRole('status')).toContainText(/Memuat akar|Loading root/);
  const response = await detailResponse;
  expect(response.ok()).toBe(true);
  const requestParams = new URL(response.url()).searchParams;
  expect([...requestParams.keys()]).toEqual(['location']);
  expect(requestParams.get('location')).toMatch(/^18:\d+:\d+$/);
  const payload = await response.json();
  expect(payload.data?.study?.primaryMeaning?.text).toBeTruthy();
  await expect(dialog.getByText(/Makna Kata|Word meaning/, { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(dialog.getByRole('link', { name: /Qabas/ })).toHaveAttribute('href', /^https:\/\/sina\.birzeit\.edu\/qabas\/lemma\/\d+$/);
  await expect(dialog.getByTitle('Dengarkan rekaman kata ini')).toBeEnabled();
  await expect(dialog.getByRole('status')).toHaveCount(0);
  expect(extraExcerptRequests).toHaveLength(0);
});

test('word study modal reports a stalled detail request and offers retry', async ({ page }) => {
  test.setTimeout(25000);
  let releaseRequest!: () => void;
  const stalledRequest = new Promise<void>((resolve) => { releaseRequest = resolve; });
  await page.route('**/api/word-detail?*', async (route) => {
    await stalledRequest;
    await route.fulfill({ status: 503, json: { error: 'test request released' } }).catch(() => {});
  });

  try {
    await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
    await page.waitForFunction(() => {
      const button = document.querySelector('button[aria-label="Pengaturan Tampilan"]');
      return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
    });
    await page.getByRole('button', { name: 'Pengaturan Tampilan' }).click();
    await expect(page.getByText('Pengaturan Bacaan', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Tutup pengaturan' }).click();
    const firstWord = page.locator('[role="button"][aria-label^="Bedah kata:"]').first();
    await firstWord.waitFor({ state: 'visible', timeout: 30000 });
    await firstWord.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel(/Akar Kata|Root/)).toContainText(/ح م د|حمد/);
    await expect(dialog.getByRole('alert')).toContainText(/full analysis did not load|Analisis lengkap belum termuat/, { timeout: 9500 });
    await expect(dialog.getByRole('button', { name: /Try again|Coba lagi/ })).toBeVisible();
  } finally {
    releaseRequest();
  }
});
