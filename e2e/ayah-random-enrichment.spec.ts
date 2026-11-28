import { expect, test } from '@playwright/test';

test('random ayah API returns root and grammar enrichment without client-only lookup', async ({ request }) => {
  const response = await request.get('/api/ayah-random?surah=1&ayah=2');
  expect(response.ok()).toBeTruthy();

  const payload = await response.json();
  const hamd = payload.words.find((word: { location: string }) => word.location === '1:2:1');
  expect(hamd).toMatchObject({
    arabic: 'ٱلْحَمْدُ',
    meaningIndo: 'pujian',
    rootLetters: 'ح م د',
    rootSlug: 'H-m-d',
    posTag: 'Isim',
    posDetail: 'Isim (Kata Benda / Nomina)',
  });
});

test('random ayah page displays the server-provided Indonesian word meaning', async ({ page }) => {
  await page.route('**/api/ayah-random', (route) => route.fulfill({
    json: {
      surahNumber: 1,
      surahNameIndo: 'Al-Fatihah',
      surahNameArabic: 'الفاتحة',
      ayahNumber: 2,
      verseArabic: 'ٱلْحَمْدُ لِلَّهِ',
      verseIndo: 'Segala puji bagi Allah.',
      words: [{
        id: 5,
        position: 1,
        arabic: 'ٱلْحَمْدُ',
        transliteration: 'al-ḥamdu',
        meaningIndo: 'pujian',
        meaningEnglish: 'praise',
        charType: 'word',
        rootLetters: 'ح م د',
        rootSlug: 'H-m-d',
        posTag: 'Isim',
        posDetail: 'Isim (Kata Benda / Nomina)',
      }],
    },
  }));

  await page.goto('/ayat-random', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('pujian', { exact: true })).toBeVisible();
  await expect(page.locator('.translation-kemenag')).toContainText('Segala puji bagi Allah.');
});
