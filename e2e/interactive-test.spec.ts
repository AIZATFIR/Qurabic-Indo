import { test, expect } from '@playwright/test';

test.describe('Qurabic Interactive Tour & Screenshots', () => {
  test('Capture landing, baca surah, and word study modal', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('http://localhost:3005');
    await expect(page).toHaveTitle(/Qurabic/i);
    await page.screenshot({ path: 'public/test-landing.png', fullPage: false });

    // 2. Navigate to Baca Al-Fatihah
    await page.goto('http://localhost:3005/baca');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'public/test-baca.png', fullPage: false });

    // 3. Find and click word 'نَسْتَعِينُ' or any word in Al-Fatihah
    // Let's inspect words or click on word button
    const wordBtn = page.locator('text=نَسْتَعِينُ').first();
    if (await wordBtn.isVisible()) {
      await wordBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: 'public/test-word-modal.png' });
    } else {
      // Fallback: click first arabic word button
      const anyWord = page.locator('button:has-text("الرَّحْمَٰنِ")').first();
      if (await anyWord.isVisible()) {
        await anyWord.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: 'public/test-word-modal.png' });
      }
    }
  });
});
