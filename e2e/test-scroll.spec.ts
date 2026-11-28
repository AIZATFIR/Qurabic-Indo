import { test, expect } from '@playwright/test';

test.describe('Scroll and capture full word modal', () => {
  test('Inspect Word Modal and Scroll to Root & Family', async ({ page }, testInfo) => {
    // Set large viewport so we see everything clearly
    await page.setViewportSize({ width: 1280, height: 1200 });
    await page.goto('/baca');
    await page.waitForTimeout(2000);

    const wordBtn = page.locator('text=نَسْتَعِينُ').first();
    await wordBtn.click();
    await page.waitForTimeout(1000);

    // Screenshot initial modal view
    await page.screenshot({ path: testInfo.outputPath('modal-open.png') });

    // Scroll down inside the modal dialog
    const modal = page.locator('div[role="dialog"]');
    await modal.evaluate((el) => {
      el.scrollTop = 500;
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: testInfo.outputPath('modal-scrolled.png') });

    // Scroll further down to family
    await modal.evaluate((el) => {
      el.scrollTop = 1200;
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: testInfo.outputPath('modal-bottom.png') });
  });
});
