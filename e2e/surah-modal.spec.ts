import { expect, test } from '@playwright/test';

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

test('slow Indonesian human audio falls back to TTS within 1.2 seconds', async ({ page }) => {
  test.setTimeout(30000);
  await page.addInitScript(() => {
    const audioWindow = window as typeof window & { __audioSources?: string[] };
    audioWindow.__audioSources = [];
    const source = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    if (source?.set) Object.defineProperty(HTMLMediaElement.prototype, 'src', {
      ...source,
      set(value: string) {
        if (this instanceof HTMLAudioElement) audioWindow.__audioSources?.push(value);
        source.set!.call(this, value);
      },
    });
  });

  let humanAudioRequests = 0;
  await page.route(/archive\.org\/download\/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab\/002001\.mp3/, async route => {
    humanAudioRequests++;
    await new Promise(resolve => setTimeout(resolve, 6000));
    await route.abort();
  });
  await page.route('**/quran-terjemahan-indonesia-audio-by-ayah/**', route => route.abort());

  await page.addInitScript(() => {
    localStorage.setItem('qurabic_language', 'id');
    localStorage.setItem('qurabic_audio_translation_voice', 'ai-fallback');
  });
  await page.goto('/baca?surah=2', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Baqarah/ }).waitFor();
  const firstVersePlay = page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true });
  await firstVersePlay.waitFor({ state: 'visible', timeout: 30000 });
  await firstVersePlay.click();

  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await expect(player).toBeVisible();
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();
  await player.getByRole('combobox', { name: 'Audio terjemahan' }).selectOption('ai-fallback');
  await player.getByRole('combobox', { name: 'Mode handsfree' }).selectOption('reverse');
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __audioSources?: string[] }).__audioSources || []), { timeout: 5000 })
    .toContainEqual(expect.stringContaining('archive.org/download/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab/002001.mp3'));
  await expect.poll(() => page.evaluate(() => (window as typeof window & { __audioSources?: string[] }).__audioSources || []), { timeout: 2000 })
    .toContainEqual(expect.stringContaining('quran-terjemahan-indonesia-audio-by-ayah'));
  expect(humanAudioRequests).toBeGreaterThan(0);
});

test('handsfree status identifies AI audio while its file is loading', async ({ page }) => {
  let translationRequestStarted = false;
  await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
  await page.route('**/quran-terjemahan-indonesia-audio-by-ayah/**', async (route) => {
    translationRequestStarted = true;
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await route.continue();
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await page.getByRole('button', { name: 'Putar Tilawah', exact: true }).click();

  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await player.getByRole('button', { name: 'Pengaturan audio' }).click();
  await player.getByRole('combobox', { name: 'Audio terjemahan' }).selectOption('ai-fallback');
  await player.getByRole('combobox', { name: 'Mode handsfree' }).selectOption('reverse');

  await expect.poll(() => translationRequestStarted).toBe(true);
  await expect(player.locator('[aria-live="polite"]')).toContainText('Memuat suara AI · Gemini TTS');
});

test('focusing handsfree preloads the current verse translation before mode selection', async ({ page }) => {
  await page.addInitScript(() => {
    const appWindow = window as typeof window & { __qurabicAudioBlobs?: string[] };
    appWindow.__qurabicAudioBlobs = [];
    const createObjectUrl = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (object) => {
      const url = createObjectUrl(object);
      appWindow.__qurabicAudioBlobs?.push(url);
      return url;
    };
  });
  const translationRequests: string[] = [];
  const wav = silentWav(3);
  await page.route('**/quran-terjemahan-indonesia-audio-by-ayah/**', async (route) => {
    translationRequests.push(route.request().url());
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'audio/wav' },
      body: wav,
    });
  });

  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await page.getByRole('button', { name: 'Putar Tilawah', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await expect(player).toBeVisible();
  const expandPlayer = player.getByRole('button', { name: 'Perbesar pemutar' });
  if (await expandPlayer.isVisible()) await expandPlayer.click();
  const handsfree = player.getByRole('combobox', { name: 'Mode handsfree' });
  await handsfree.focus();

  await expect.poll(() => translationRequests.length, { timeout: 2000 }).toBeGreaterThan(0);
  expect(translationRequests[0]).toContain('/audio_m4a/018/018001.m4a');
  await handsfree.selectOption('reverse');
  await expect(player.locator('[aria-live="polite"]')).toContainText(/Suara AI|AI voice/, { timeout: 3000 });
  expect(translationRequests).toHaveLength(1);
});

test('slow translation preload does not delay direct audio startup', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('qurabic_language', 'id');
    localStorage.setItem('qurabic_audio_translation_voice', 'ai-fallback');
    const audioWindow = window as typeof window & { __translationSources?: Array<{ time: number; url: string }>; __translationSelectedAt?: number };
    audioWindow.__translationSources = [];
    const source = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'src');
    if (source?.set) Object.defineProperty(HTMLMediaElement.prototype, 'src', {
      ...source,
      set(value: string) {
        if (this instanceof HTMLAudioElement && value.includes('quran-terjemahan-indonesia-audio-by-ayah')) {
          audioWindow.__translationSources?.push({ time: performance.now(), url: value });
        }
        source.set!.call(this, value);
      },
    });
  });

  let preloadRequests = 0;
  await page.route('**/quran-terjemahan-indonesia-audio-by-ayah/**', async (route) => {
    preloadRequests++;
    if (preloadRequests === 1) await new Promise(resolve => setTimeout(resolve, 2000));
    await route.abort();
  });

  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
  const player = page.getByLabel('Pemutar audio Al-Qur’an');
  await expect(player).toBeVisible();
  const handsfree = player.getByRole('combobox', { name: 'Mode handsfree' });
  await handsfree.focus();
  await expect.poll(() => preloadRequests, { timeout: 2000 }).toBeGreaterThan(0);
  await page.evaluate(() => { (window as typeof window & { __translationSelectedAt?: number }).__translationSelectedAt = performance.now(); });
  await handsfree.selectOption('reverse');
  await expect.poll(async () => page.evaluate(() => {
    const target = window as typeof window & { __translationSelectedAt?: number; __translationSources?: Array<{ time: number; url: string }> };
    return target.__translationSources?.find(source => source.url.includes('/018/018001.m4a'))?.time! - target.__translationSelectedAt!;
  }), { timeout: 2000 }).toBeLessThan(500);
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
    await expect(dialog.getByRole('alert')).toContainText(/full analysis did not load|Analisis lengkap belum termuat/, { timeout: 13500 });
    await expect(dialog.getByRole('button', { name: /Try again|Coba lagi/ })).toBeVisible();
  } finally {
    releaseRequest();
  }
});
