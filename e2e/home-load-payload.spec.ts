import { expect, test } from '@playwright/test';

test('home does not download a multi-megabyte study-data chunk on first load', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const largeScripts = await page.evaluate(() =>
    performance.getEntriesByType('resource')
      .filter((entry) => (entry as PerformanceResourceTiming).initiatorType === 'script' && entry.name.includes('/_next/static/chunks/'))
      .filter((entry) => (entry as PerformanceResourceTiming).decodedBodySize > 1_000_000)
      .map((entry) => ({ name: entry.name.split('/').pop(), bytes: (entry as PerformanceResourceTiming).decodedBodySize }))
  );
  expect(largeScripts).toEqual([]);
});
