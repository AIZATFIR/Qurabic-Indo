import { expect, test } from '@playwright/test';
import type { Route } from '@playwright/test';

const roots = Array.from({ length: 24 }, (_, index) => `جذر${index}`);

function lookupPage(offset: number) {
  const pageRoots = roots.slice(offset, offset + 12);
  return {
    results: pageRoots.map((root) => ({ root, totalForms: 1, matchType: 'word-form', wordMatches: 1 })),
    total: roots.length,
    offset,
    hasMore: offset + pageRoots.length < roots.length,
    nextOffset: offset + pageRoots.length,
  };
}

test('dictionary loads all matching Tāj roots in pages', async ({ page }) => {
  const offsets: number[] = [];
  await page.route('**/api/arramooz/search?**', (route) => route.fulfill({ status: 200, json: { groups: [], totalRoots: 0 } }));
  await page.route('**/api/arabic-stopwords/search?**', (route) => route.fulfill({ status: 200, json: { groups: [] } }));
  await page.route('**/api/taj-roots/lookup?**', async (route: Route) => {
    const offset = Number(new URL(route.request().url()).searchParams.get('offset')) || 0;
    offsets.push(offset);
    await route.fulfill({ status: 200, json: lookupPage(offset) });
  });

  await page.goto('/kamus?q=كتب', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('جذر0', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Muat akar berikutnya' }).click();
  await expect(page.getByText('جذر23', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Muat akar berikutnya' })).toHaveCount(0);
  expect(offsets).toEqual([0, 12]);
});
