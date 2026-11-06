import { test, expect } from '@playwright/test';

test('restored classic layout takes precedence over the interim saved minimal preference', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('qurabic_layout_preference', 'minimal'));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Membedah Kedalaman|Explore the depth of/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Membedah Kedalaman|Explore the depth of/i })).toHaveCSS('opacity', '1', { timeout: 10000 });
  await expect(page.getByRole('heading', { name: /Akar kata populer|Popular roots/i })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="root-showcase-heading"]')).toBeVisible();
  await expect(page.locator('[data-ui="root-corpus-preview"]')).toHaveCount(0);
  await expect(page.locator('[data-ui="verse-study-preview"]')).toContainText('2:255');
  await expect(page.locator('[data-ui="verse-study-preview"]')).toContainText('الْحَيُّ');
  await expect(page.locator('[data-ui="verse-study-preview"] a[href="/baca?surah=2&ayah=255"]')).toBeVisible();
});

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

test('the restored verse card fits on mobile and follows the English setting', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('combobox', { name: /bahasa|language/i }).selectOption('en');
  const card = page.locator('[data-ui="verse-study-preview"]');
  await expect(card).toContainText('the Ever-Living');
  await expect(card.getByRole('link', { name: 'Open verse' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(await card.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
  await card.screenshot({ path: 'test-results/home-verse-card-mobile.png' });
});
