/*
 * Browser media regression with full, decoded human recordings retrieved from
 * their credited source URLs. The remote files are served locally to keep the
 * browser check repeatable; playback uses Chromium's real MP3 decoder and media
 * clock, without mocking HTMLAudioElement methods or playback events.
 * Run after build + start: node scripts/qa/real-media-smoke.cjs
 */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const mediaDir = process.env.QA_MEDIA_DIR || '/tmp/qurabic-qa/real-media';
const media = {
  arabic: fs.readFileSync(path.join(mediaDir, 'arabic-001001.mp3')),
  english: fs.readFileSync(path.join(mediaDir, 'en-018001.mp3')),
  indonesian: fs.readFileSync(path.join(mediaDir, 'id-001001.mp3')),
};
const audioRequests = [];
const fixtureDir = process.env.QA_OUTPUT || '/tmp/qurabic-qa';

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      if (!localStorage.getItem('qurabic_language')) localStorage.setItem('qurabic_language', 'en');
    });
    await context.route('**/api.quran.com/api/v4/verses/by_chapter/**', async route => {
      const url = new URL(route.request().url());
      const surah = Number(url.pathname.split('/').at(-1));
      const language = url.searchParams.get('language') || 'en';
      const pageNo = Number(url.searchParams.get('page') || '1');
      const filename = path.join(fixtureDir, `${surah}-${language}-${pageNo}.json`);
      assert.ok(fs.existsSync(filename), `missing Quran.com source fixture ${filename}`);
      await route.fulfill({
        body: JSON.stringify(JSON.parse(fs.readFileSync(filename, 'utf8'))),
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
      });
    });
    await context.route(/\.(?:mp3|wav)(?:\?|$)/, route => route.fulfill({ status: 404, body: '' }));
    await context.route(/https:\/\/(?:everyayah\.com\/data\/Alafasy_128kbps\/(?:001001|018001)\.mp3|audio\.qurancdn\.com\/Alafasy\/mp3\/001001\.mp3|verses\.quran\.com\/Alafasy\/mp3\/001001\.mp3|archive\.org\/download\/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab\/001001\.mp3|everyayah\.com\/data\/English\/Sahih_Intnl_Ibrahim_Walk_192kbps\/018001\.mp3)/, async route => {
      const url = route.request().url();
      audioRequests.push(url);
      const bytes = url.includes('/English/') ? media.english : url.includes('archive.org') ? media.indonesian : media.arabic;
      await route.fulfill({ status: 200, body: bytes, contentType: 'audio/mpeg', headers: { 'access-control-allow-origin': '*', 'accept-ranges': 'bytes' } });
    });

    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/baca?surah=18`, { waitUntil: 'networkidle' });
    await page.locator('#ayah-1').waitFor({ timeout: 60000 });
    await page.getByRole('button', { name: 'Play verse 1', exact: true }).click();
    const player = page.getByRole('complementary', { name: 'Quran audio player' });
    await player.waitFor();
    await player.getByLabel('Handsfree mode').selectOption('reverse');
    await page.waitForFunction(() => Array.from(document.querySelectorAll('aside')).some(el => el.innerText.includes('Human English translation')), undefined, { timeout: 8000 }).catch(async error => { console.log('DEBUG English handsfree', await player.innerText(), audioRequests, errors); throw error; });
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('aside')).some(el => /Human English translation\s+·\s+0:0[1-9] \/ 0:09/.test(el.innerText));
    }, undefined, { timeout: 20000 });
    assert.ok(audioRequests.includes('https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/018001.mp3'));
    console.log('PASS English handsfree plays decoded Sahih International human recording for Al-Kahf 18:1');

    await page.evaluate(() => localStorage.setItem('qurabic_language', 'id'));
    await page.goto(`${base}/baca?surah=1`, { waitUntil: 'networkidle' });
    await page.locator('#ayah-1').waitFor({ timeout: 60000 });
    await page.getByRole('button', { name: 'Putar Tilawah Ayat 1', exact: true }).click();
    const idPlayer = page.getByRole('complementary', { name: 'Pemutar audio Al-Qur’an' });
    await idPlayer.waitFor();
    await idPlayer.getByLabel('Mode handsfree').selectOption('reverse');
    await page.waitForFunction(() => Array.from(document.querySelectorAll('aside')).some(el => el.innerText.includes('Rekaman terjemahan Indonesia')));
    await page.waitForFunction(() => {
      return Array.from(document.querySelectorAll('aside')).some(el => /Rekaman terjemahan Indonesia\s+·\s+0:0[1-9] \/ 0:0[4-7]/.test(el.innerText));
    }, undefined, { timeout: 12000 });
    assert.ok(audioRequests.includes('https://archive.org/download/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab/001001.mp3'));
    assert.equal(errors.length, 0, errors.join('\n'));
    console.log('PASS Indonesian reverse handsfree plays decoded human translation recording for Al-Fatihah 1:1');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exit(1); });
