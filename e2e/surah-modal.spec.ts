import { expect, test } from '@playwright/test';

test('surah picker keeps the bookpaper dialog treatment', async ({ page }) => {
  await page.goto('/baca');
  await page.locator('button[title="Ganti Surah"]').click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveClass(/rounded-2xl/);
  await expect(dialog.getByRole('textbox')).toHaveClass(/rounded-xl/);
  await expect(dialog.getByRole('button', { name: '1. Al-Fatihah', exact: true })).toHaveClass(/rounded-md/);
});
