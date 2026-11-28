import type { Page } from '@playwright/test';

export async function mockQuranFoundationAudio(page: Page) {
  await page.route('**/api/qf/recitations*', async (route) => {
    const params = new URL(route.request().url()).searchParams;
    const surah = Number(params.get('surah'));
    if (params.has('recitation')) {
      if (!Number.isInteger(surah) || surah < 1 || surah > 114) {
        await route.fulfill({ status: 400, json: { error: 'Invalid test surah.' } });
        return;
      }
      const surahPrefix = String(surah).padStart(3, '0');
      await route.fulfill({
        json: {
          files: Array.from({ length: 286 }, (_, index) => {
            const ayah = index + 1;
            return {
              verseKey: `${surah}:${ayah}`,
              url: `https://verses.quran.com/Alafasy/mp3/${surahPrefix}${String(ayah).padStart(3, '0')}.mp3`,
            };
          }),
          recitation: Number(params.get('recitation')),
          surah,
        },
      });
      return;
    }
    await route.fulfill({
      json: {
        language: params.get('language') === 'id' ? 'id' : 'en',
        recitations: [{ id: 7, reciterName: 'Mishary Rashid Al-Afasy', style: 'Murattal', name: 'Mishary Rashid Al-Afasy' }],
      },
    });
  });
}
