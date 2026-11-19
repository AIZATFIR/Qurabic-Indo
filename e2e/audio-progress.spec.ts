import { expect, test } from '@playwright/test';

test('audio progress animates between time updates and stops when paused', async ({ page }) => {
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  const playButton = page.getByRole('button', { name: /Putar Tilawah/ }).first();
  await page.waitForFunction((button) => button && Object.keys(button).some((key) => key.startsWith('__reactProps$')), await playButton.elementHandle());
  await playButton.click();

  const player = page.locator('[data-audio-progress]');
  await expect(player).toBeVisible();
  await expect(page.getByRole('button', { name: /Jeda Tilawah/ })).toBeVisible({ timeout: 12000 });
  const fill = player.locator(':scope > span:first-child > span');

  await expect.poll(() => fill.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe('transform');
  await expect.poll(() => fill.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0.5s');

  await page.getByRole('button', { name: /Jeda Tilawah/ }).click();
  await expect.poll(() => fill.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s');
});
