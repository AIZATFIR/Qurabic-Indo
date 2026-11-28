import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

const roots = ['كتب', 'علم', 'قول', 'رحم', 'سمع', 'قلب', 'شهد', 'نصر', 'عبد', 'عمل', 'حمد', 'ذكر', 'سلم', 'بين', 'ملك', 'بلغ'];

function rootPage(offset: number) {
  const pageRoots = roots.slice(offset, offset + 8);
  return {
    groups: pageRoots.map((root) => ({ root, total: 0, truncated: false, hasMore: false, forms: [] })),
    totalRoots: roots.length,
    hasMoreRoots: offset + pageRoots.length < roots.length,
    nextRootOffset: offset + pageRoots.length,
  };
}

async function mockDictionaryLookups(page: Page) {
  await page.route('**/api/arabic-stopwords/search?**', (route) => route.fulfill({ status: 200, json: { groups: [] } }));
  await page.route('**/api/taj-roots/lookup?**', (route) => route.fulfill({ status: 200, json: { results: [], truncated: false } }));
}

test('dictionary loads every matching root page and removes paging at the end', async ({ page }) => {
  const offsets: number[] = [];
  await mockDictionaryLookups(page);
  await page.route('**/api/arramooz/search?**', async (route: Route) => {
    const offset = Number(new URL(route.request().url()).searchParams.get('offset')) || 0;
    offsets.push(offset);
    await route.fulfill({ status: 200, json: rootPage(offset) });
  });

  await page.goto('/kamus?q=كتب', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'كتب' })).toBeVisible();
  await page.getByRole('button', { name: 'Muat akar berikutnya' }).click();
  await expect(page.getByRole('heading', { name: 'بلغ' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Muat akar berikutnya' })).toHaveCount(0);
  expect(offsets).toEqual([0, 8]);
});

test('dictionary keeps loaded roots visible when the next page fails', async ({ page }) => {
  let failed = false;
  await mockDictionaryLookups(page);
  await page.route('**/api/arramooz/search?**', async (route: Route) => {
    const offset = Number(new URL(route.request().url()).searchParams.get('offset')) || 0;
    if (offset === 8 && !failed) {
      failed = true;
      await route.fulfill({ status: 503, json: { error: 'unavailable' } });
      return;
    }
    await route.fulfill({ status: 200, json: rootPage(offset) });
  });

  await page.goto('/kamus?q=كتب', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'كتب' })).toBeVisible();
  await page.getByRole('button', { name: 'Muat akar berikutnya' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Akar berikutnya belum termuat' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'كتب' })).toBeVisible();
  await page.getByRole('button', { name: 'Coba lagi' }).click();
  await expect(page.getByRole('heading', { name: 'بلغ' })).toBeVisible();
});
