import { test, expect } from '@playwright/test';

test.describe('Word Study (Qurabic Indo) Polish & Visual Regression', () => {
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
