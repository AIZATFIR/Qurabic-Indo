import { expect, test } from '@playwright/test';
import type { Page, Route } from '@playwright/test';

function particlePage(offset: number) {
  const forms = Array.from({ length: 60 }, (_, index) => ({
    word: `فِي${offset + index}`,
    vocalized: `فِي${offset + index}`,
    category: 'حرف جر',
    original: 'في',
    procletic: '',
    stem: 'في',
    encletic: '',
    tags: '',
  }));
  return { groups: [{ lemma: 'فِي', total: 120, offset, hasMore: offset < 60, truncated: offset < 60, forms }] };
}

async function mockOtherLookups(page: Page) {
  await page.route('**/api/arramooz/search?**', (route) => route.fulfill({ status: 200, json: { groups: [], totalRoots: 0 } }));
  await page.route('**/api/taj-roots/lookup?**', (route) => route.fulfill({ status: 200, json: { results: [], truncated: false } }));
}

test('particle forms load in pages and retain the first page after a retry', async ({ page }) => {
  let nextPageFailed = false;
  await mockOtherLookups(page);
  await page.route('**/api/arabic-stopwords/search?**', async (route: Route) => {
    const url = new URL(route.request().url());
    const offset = Number(url.searchParams.get('offset')) || 0;
    if (offset === 60 && !nextPageFailed) {
      nextPageFailed = true;
      await route.fulfill({ status: 503, json: { error: 'unavailable' } });
      return;
    }
    await route.fulfill({ status: 200, json: particlePage(offset) });
  });

  await page.goto('/kamus?q=في', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'فِي' })).toBeVisible();
  await expect(page.getByText('فِي11', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Muat bentuk berikutnya' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Bentuk berikutnya belum termuat' })).toBeVisible();
  await expect(page.getByText('فِي11', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Coba lagi' }).click();
  await expect(page.getByText('فِي119', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Muat bentuk berikutnya' })).toHaveCount(0);
});
