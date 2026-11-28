import { expect, test } from '@playwright/test';

test('root entry loads Arramooz forms in pages and keeps loaded rows', async ({ page }) => {
  const requestedOffsets: number[] = [];
  await page.route('**/api/arramooz/search?**', async (route) => {
    const offset = Number(new URL(route.request().url()).searchParams.get('offset')) || 0;
    requestedOffsets.push(offset);
    const forms = Array.from({ length: 60 }, (_, index) => ({
      arabic: `بَابٌ${offset + index}`,
      unvocalized: `باب${offset + index}`,
      pos: 'noun',
      wordType: 'اسم',
      definition: 'تعريف المصدر',
    }));
    await route.fulfill({
      status: 200,
      json: {
        source: 'Arramooz Arabic Morphological Dictionary',
        groups: [{ root: 'صبر', total: 120, offset, hasMore: offset < 60, forms }],
      },
    });
  });

  await page.goto('/akar/S-b-r', { waitUntil: 'networkidle' });
  const section = page.locator('section[aria-labelledby="other-root-forms-heading"]');
  await section.getByRole('button', { name: /Tampilkan bentuk tambahan|Show additional forms/ }).click();
  await expect(section.getByText('60 dari 120 bentuk termuat')).toBeVisible();
  await section.getByRole('button', { name: 'Tampilkan 48 bentuk lagi' }).click();
  await expect(section.getByText('بَابٌ59', { exact: true })).toBeVisible();
  await section.getByRole('button', { name: /Muat 60 bentuk berikutnya|Load 60 more forms/ }).click();
  await expect(section.getByText('بَابٌ119', { exact: true })).toBeVisible();
  await expect(section.getByText(/120 dari 120 bentuk termuat|120 of 120 forms loaded/)).toBeVisible();
  expect(requestedOffsets).toEqual([0, 60]);
});
