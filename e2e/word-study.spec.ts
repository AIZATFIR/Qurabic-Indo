import { test, expect } from '@playwright/test';

test.describe('Word Study (Qurabic Indo) Polish & Visual Regression', () => {
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
