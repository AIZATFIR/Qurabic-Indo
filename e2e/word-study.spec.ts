import { test, expect } from '@playwright/test';

test.describe('Word Study (Qurabic Indo) Polish & Visual Regression', () => {
  test('hovering a Quran word warms its entry before opening the study card', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/word-detail?')) requests.push(request.url());
    });
    await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
    await page.getByRole('button', { name: 'Pengaturan Tampilan' }).click();
    await expect(page.getByText('Pengaturan Bacaan', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Tutup pengaturan' }).click();
    const firstWord = page.locator('[role="button"][aria-label^="Bedah kata:"]').first();
    await firstWord.waitFor({ state: 'visible', timeout: 30000 });
    const warmedResponsePromise = page.waitForResponse(response => response.url().includes('/api/word-detail?') && !response.url().includes('excerpt='), { timeout: 2500 });
    await firstWord.hover();
    const warmedResponse = await warmedResponsePromise;
    expect(warmedResponse.ok()).toBe(true);
    expect(new URL(warmedResponse.url()).searchParams.get('location')).toMatch(/^18:\d+:\d+$/);

    await firstWord.click();
    await expect(page.getByRole('dialog').getByText(/Makna Kata|Word meaning/, { exact: true })).toBeVisible();
    expect(requests).toHaveLength(1);
  });

  test('root without a lexical entry does not show a corpus placeholder as its definition', async ({ page }) => {
    const supplementalRequests: string[] = [];
    page.on('request', request => {
      if (request.url().includes('/api/root-detail?')) supplementalRequests.push(request.url());
    });
    const response = await page.goto('/akar/r-A-y', { waitUntil: 'domcontentloaded' });
    const renderedHtml = await response?.text() || '';
    await page.waitForLoadState('networkidle');

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    expect(renderedHtml).not.toContain('Memuat data akar dan kamus');
    expect(supplementalRequests).toHaveLength(0);
    await expect(meaningSection).toContainText('Ringkasan akar belum tersedia dari sumber yang terindeks.');
    await expect(meaningSection).not.toContainText('memiliki peranan penting dalam kosakata Al-Qur’an');
    await expect(meaningSection.getByRole('link', { name: 'Cari kata terkait di Qabas · Birzeit' })).toHaveAttribute('href', 'https://sina.birzeit.edu/qabas');
  });

  test('Indonesian root page shows a sourced English gloss when no Indonesian summary exists', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/d-y-n', { waitUntil: 'domcontentloaded' });

    const meaningSection = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(meaningSection).toContainText('English gloss · Quran bil-Quran');
    await expect(meaningSection.locator('p[lang="en"]').first()).toContainText('The root "dyn" primarily means');
    await expect(meaningSection.getByRole('link', { name: 'Quran bil-Quran' })).toHaveAttribute('href', /quran-bil-quran/);
  });

  test('root gloss stays in English only when English is selected', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto('/akar/m-l-k', { waitUntil: 'domcontentloaded' });
    const indonesianMeaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(indonesianMeaning).toContainText('Kepemilikan hakiki');
    await expect(indonesianMeaning).not.toContainText('The root ملك (mlk) primarily means');

    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    const englishMeaning = page.locator('section[aria-labelledby="root-meaning-heading"]');
    await expect(englishMeaning).toContainText('The root ملك (mlk) primarily means');
    await expect(englishMeaning).toContainText('Quran bil-Quran');
  });

  test('English root entry labels the indexed Lane text accurately', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('qurabic_language', 'en'));
    await page.goto('/akar/r-H-m', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText('Indexed classical dictionary entry · Lane, 1863')).toBeVisible();
    await expect(page.getByText('Original English source excerpt · Lane, 1863')).toHaveCount(0);
    await expect(page.locator('section[aria-labelledby="root-meaning-heading"]')).toContainText('Classical dictionary evidence · Edward William Lane (1863)');
  });

  test('root explanation uses a cited Lane source instead of generic placeholder copy', async ({ page }) => {
    await page.goto('/kata/%D8%A7%D9%84%D8%B1%D9%91%D9%8E%D8%AD%D9%90%D9%8A%D9%85%D9%90?location=1%3A1%3A4', { waitUntil: 'networkidle' });

    await expect(page.getByText('Each form is translated in its sample verse. Words sharing a root can have different meanings.')).toHaveCount(0);
    await expect(page.getByText('Edward William Lane, An Arabic-English Lexicon', { exact: false }).first()).toBeVisible();
    await expect(page.getByText(/He had mercy, or pity, or compassion/).first()).toBeVisible();
  });

  test('halaman نَسْتَعِينُ menampilkan bento akar, filosofi semantik, dan keluarga kata', async ({ page }) => {
    await page.goto('/kata/%D9%86%D9%8E%D8%B3%D9%91%D8%AA%D9%8E%D8%B9%D9%90%D9%8A%D9%86%D9%8F', { waitUntil: 'networkidle' });

    // Cek judul kata & transliterasi
    await expect(page.locator('text=نَسْتَعِينُ').first()).toBeVisible();

    // Cek bento akar kata ع و ن
    await expect(page.locator('text=Akar Kata').first()).toBeVisible();
    await expect(page.locator('text=11× di Al-Qur\'an')).toBeVisible();

    // Cek filosofi & intisari makna akar (mengisi ruang yang sebelumnya bolong)
    await expect(page.locator('text=Filosofi & Intisari Makna Akar')).toBeVisible();
    await expect(page.locator('text=Pertolongan, saling membantu')).toBeVisible();

    // Cek keluarga kata
    await expect(page.locator('text=Keluarga Kata dalam Al-Qur\'an')).toBeVisible();
    await expect(page.locator('text=7 Bentuk')).toBeVisible();
  });

  test('halaman بَشَرٌ menampilkan data leksikal dan akar kata ب ش ر', async ({ page }) => {
    await page.goto('/kata/%D8%A8%D9%8E%D8%B4%D9%8E%D8%B1%D9%8C', { waitUntil: 'networkidle' });

    await expect(page.locator('text=بَشَرٌ').first()).toBeVisible();
    await expect(page.locator('text=123× di Al-Qur\'an')).toBeVisible();
    await expect(page.locator('text=Akar Kata').first()).toBeVisible();
  });
});
