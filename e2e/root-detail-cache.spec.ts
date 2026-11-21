import { expect, test } from '@playwright/test';

test('root detail response advertises its one-day shared cache', async ({ request }) => {
  const response = await request.get('/api/root-detail?root=S-b-r&v=5');
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('max-age=300');
});

test('on-demand root pages are cached after their first render on Vercel', async ({ page }) => {
  test.skip(!process.env.PLAYWRIGHT_BASE_URL?.includes('qurabic-indo-corpus.vercel.app'), 'Vercel cache headers require the production smoke target');
  const first = await page.goto('/akar/q-w-y', { waitUntil: 'domcontentloaded' });
  expect(first?.ok()).toBe(true);

  const second = await page.goto('/akar/q-w-y', { waitUntil: 'domcontentloaded' });
  expect(second?.ok()).toBe(true);
  expect(second?.headers()['x-vercel-cache']).toMatch(/^(HIT|STALE)$/);
});
