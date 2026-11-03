import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('Qurabic-Indo Comprehensive UX & Feature Exploration', () => {
  test('jelajahi halaman baca, klik kata, popup study modal, morfologi, audio, & navigasi', async ({ page }) => {
    const logs: string[] = [];

    // Tangkap error console bila ada
    page.on('console', msg => {
      if (msg.type() === 'error') logs.push(`[CONSOLE ERROR] ${msg.text()}`);
    });

    // 1. Kunjungi Halaman Baca (/baca)
    await page.goto('/baca', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e-screenshots/01-halaman-baca.png', fullPage: false });

    // Cek header dan pemilihan surah (default Al-Fatihah)
    const surahTitle = await page.locator('h1, h2').first().innerText();
    logs.push(`Halaman Baca loaded. Title: ${surahTitle}`);

    // 2. Interaksi Word-by-Word di Al-Fatihah
    // Cari kata Arab pertama (misal: بِسْمِ atau الرَّحْمَٰنِ atau نَسْتَعِينُ)
    const wordCards = page.locator('button:has-text("بِسْمِ"), span:has-text("بِسْمِ"), div:has-text("بِسْمِ")');
    await page.waitForTimeout(1000);

    // Ambil screenshot area ayat
    await page.screenshot({ path: 'e2e-screenshots/02-ayat-wbw.png' });

    // Klik kata "نَسْتَعِينُ" jika ada di viewport/scroll
    const nastaeen = page.locator('text=نَسْتَعِينُ').first();
    if (await nastaeen.isVisible()) {
      await nastaeen.click();
      logs.push('Clicked kata: نَسْتَعِينُ');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'e2e-screenshots/03-modal-nastaeen.png' });
    } else {
      // Klik kata pertama yang interaktif
      const firstWord = page.locator('[data-word-id], button:has(.font-arabic)').first();
      if (await firstWord.isVisible()) {
        await firstWord.click();
        logs.push('Clicked first available word');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'e2e-screenshots/03-modal-first-word.png' });
      }
    }

    // Periksa apakah modal / drawer kajian kata muncul
    const modalHeader = page.locator('text=Makna Kata, text=Akar Kata, text=Morfologi');
    const modalVisible = await modalHeader.first().isVisible().catch(() => false);
    logs.push(`Modal/Drawer kajian kata visible: ${modalVisible}`);

    // Cek navigasi /morfologi
    await page.goto('/morfologi', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e-screenshots/04-morfologi.png' });

    // Cek fitur Cari (/cari)
    await page.goto('/cari?q=rahmat', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e-screenshots/05-cari-rahmat.png' });

    // Cek halaman detail akar (/akar/r-h-m)
    await page.goto('/akar/r-h-m', { waitUntil: 'networkidle' });
    await page.screenshot({ path: 'e2e-screenshots/06-akar-rhm.png' });

    fs.writeFileSync('e2e-screenshots/ux-summary.json', JSON.stringify(logs, null, 2));
  });
});
