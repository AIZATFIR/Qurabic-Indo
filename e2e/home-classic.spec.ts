import { test, expect } from '@playwright/test';

test('classic homepage presents popular roots as distinct study cards', async ({ page }) => {
  await page.goto('/');
  const rootCards = page.locator('section[aria-labelledby="roots-heading"] article');
  await expect(rootCards).toHaveCount(6);
  const style = await rootCards.first().evaluate((element) => {
    const computed = getComputedStyle(element);
    return { radius: computed.borderRadius, background: computed.backgroundColor };
  });
  expect(style.radius).not.toBe('0px');
  expect(style.background).not.toBe('rgba(0, 0, 0, 0)');
  const desktopColumns = await rootCards.first().locator('xpath=..').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(desktopColumns).toBe(3);
  await page.screenshot({ path: 'test-results/home-classic-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileColumns = await rootCards.first().locator('xpath=..').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(mobileColumns).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
