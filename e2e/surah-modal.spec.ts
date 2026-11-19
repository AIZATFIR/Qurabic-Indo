import { expect, test } from '@playwright/test';

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

test('AI translation fallback is disclosed and retained by handsfree', async ({ page }) => {
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await page.waitForFunction(() => {
    const button = [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === 'Putar Tilawah');
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps$'));
  });
  await page.getByRole('button', { name: 'Putar Tilawah', exact: true }).click();

  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await expect(player).toBeVisible();
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();

  const translationAudio = player.getByRole('combobox', { name: 'Audio terjemahan' });
  await expect(translationAudio).toHaveValue('ai-fallback');
  await translationAudio.selectOption('ai-fallback');
  await player.getByRole('combobox', { name: 'Mode handsfree' }).selectOption('normal');

  await expect(translationAudio).toHaveValue('ai-fallback');
  await expect(player.getByRole('link', { name: 'Sumber & batas penggunaan' })).toHaveAttribute('href', /huggingface\.co\/datasets\/insanalamin/);
  await expect(player.getByRole('status')).toContainText(/suara AI/i);
});

test('failed Indonesian translation audio is reported instead of silently skipping the verse', async ({ page }) => {
  let blockedTranslationRequests = 0;
  await page.route('**/quran-terjemahan-indonesia-audio-by-ayah/**', async (route) => {
    blockedTranslationRequests++;
    await route.abort();
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await page.getByRole('button', { name: 'Putar Tilawah', exact: true }).click();

  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();
  await player.getByRole('combobox', { name: 'Audio terjemahan' }).selectOption('ai-fallback');
  await player.getByRole('combobox', { name: 'Mode handsfree' }).selectOption('reverse');

  await expect.poll(() => blockedTranslationRequests).toBeGreaterThan(0);
  await expect(player.getByRole('alert')).toContainText(/Audio terjemahan ayat ini gagal dimuat/);
  await expect(player.getByText(/(?:Ayat|Verse) 1\/110/)).toBeVisible();
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
  const payload = await response.json();
  expect(payload.data?.study?.primaryMeaning?.text).toBeTruthy();
  await expect(dialog.getByText(/Makna Kata|Word meaning/, { exact: true })).toBeVisible({ timeout: 15000 });
  await expect(dialog.getByRole('link', { name: /Qabas/ })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas');
  await expect(dialog.getByRole('status')).toHaveCount(0);
  expect(extraExcerptRequests).toHaveLength(0);
});
