import { expect, test } from '@playwright/test';

test('root detail response advertises its one-day shared cache', async ({ request }) => {
  const response = await request.get('/api/root-detail?root=S-b-r&v=3');
  expect(response.ok()).toBe(true);
  expect(response.headers()['cache-control']).toContain('s-maxage=86400');
});
