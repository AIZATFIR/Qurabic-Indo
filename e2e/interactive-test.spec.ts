import { test, expect } from '@playwright/test';

test.describe('Qurabic Interactive Tour & Screenshots', () => {
  test('Capture landing, baca surah, and word study modal', async ({ page }, testInfo) => {
    // 1. Visit landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/Qurabic/i);
    await page.screenshot({ path: testInfo.outputPath('landing.png'), fullPage: false });

    // 2. Navigate to Baca Al-Fatihah
    await page.goto('/baca');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: testInfo.outputPath('baca.png'), fullPage: false });

    // 3. Find and click word 'نَسْتَعِينُ' or any word in Al-Fatihah
    // Let's inspect words or click on word button
    const wordBtn = page.locator('text=نَسْتَعِينُ').first();
    if (await wordBtn.isVisible()) {
      await wordBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: testInfo.outputPath('word-modal.png') });
    } else {
      // Fallback: click first arabic word button
      const anyWord = page.locator('button:has-text("الرَّحْمَٰنِ")').first();
      if (await anyWord.isVisible()) {
        await anyWord.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: testInfo.outputPath('word-modal.png') });
      }
    }
  });
});
