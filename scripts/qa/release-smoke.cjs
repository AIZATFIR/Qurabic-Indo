/* Run after npm run build + npm start. Media lifecycle is controlled to exercise
 * audio transitions without waiting through recitations. Quran text fixtures are
 * fetched from Quran.com unchanged; this does not certify recitation accuracy. */
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.QA_BASE_URL || 'http://localhost:3000';
const out = process.env.QA_OUTPUT || '/tmp/qurabic-qa';
fs.mkdirSync(out, { recursive: true });
const fixtures = new Map();
const mediaDir = '/tmp/qurabic-qa/real-media';
const audioFixtures = {
  arabic: fs.readFileSync(path.join(mediaDir, 'arabic-001001.mp3')),
  english: fs.readFileSync(path.join(mediaDir, 'en-018001.mp3')),
  indonesian: fs.readFileSync(path.join(mediaDir, 'id-001001.mp3')),
};
async function fixture(surah, language, page) {
  const key = `${surah}-${language}-${page}`;
  if (!fixtures.has(key)) {
    const saved = path.join(out, `${key}.json`);
    if (fs.existsSync(saved)) fixtures.set(key, JSON.parse(fs.readFileSync(saved, 'utf8')));
    else {
      const response = await fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surah}?language=${language}&words=true&word_fields=text_uthmani,transliteration,translation,location&translations=${language === 'en' ? 20 : 33}&per_page=50&page=${page}`);
      assert.ok(response.ok, `Quran.com fixture ${key}: ${response.status}`);
      const json = await response.json(); fixtures.set(key, json); fs.writeFileSync(saved, JSON.stringify(json));
    }
  }
  return structuredClone(fixtures.get(key));
}
(async () => {
  const browser = await chromium.launch({ headless: true });
  const errors = [];
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    window.__played = []; window.__activeMedia = null; window.__failTranslation = false;
    HTMLMediaElement.prototype.load = function () {};
    HTMLMediaElement.prototype.pause = function () { Object.defineProperty(this, 'paused', { value: true, configurable: true }); };
    HTMLMediaElement.prototype.play = function () {
      window.__activeMedia = this; window.__played.push(this.src);
      Object.defineProperty(this, 'duration', { value: 10, configurable: true });
      Object.defineProperty(this, 'paused', { value: false, configurable: true });
      if (window.__failTranslation && (this.src.includes('archive.org') || this.src.includes('/English/'))) return Promise.reject(new DOMException('Unavailable recording', 'NotSupportedError'));
      this.dispatchEvent(new Event('loadedmetadata')); this.dispatchEvent(new Event('playing')); return Promise.resolve();
    };
    window.__endTrack = () => window.__activeMedia?.dispatchEvent(new Event('ended'));
  });
  await context.route('**/api.quran.com/api/v4/verses/by_chapter/**', async route => {
    const url = new URL(route.request().url());
    const surah = Number(url.pathname.split('/').at(-1));
    const lang = url.searchParams.get('language') || 'id';
    const page = Number(url.searchParams.get('page') || 1);
    const data = await fixture(surah, lang, page);
    // Keep text absent to prove human-audio sequencing never depends on its text.
    if (surah === 1) for (const verse of data.verses) verse.translations = [];
    await route.fulfill({ json: data, headers: { 'access-control-allow-origin': '*' } });
  });
  await context.route(/https:\/\/(?:api\.alquran\.cloud|equran\.id|api\.quran\.gading\.dev)\//, route => route.fulfill({ json: { data: { ayahs: [], ayat: [], verses: [] } }, headers: { 'access-control-allow-origin': '*' } }));
  await context.route(/https:\/\/.*(?:\.mp3|archive\.org\/download\/)/, route => {
    const url = route.request().url();
    if (['fetch', 'xhr'].includes(route.request().resourceType())) return route.fulfill({ status: 503, body: '' });
    const body = url.includes('/English/') ? audioFixtures.english : url.includes('archive.org') ? audioFixtures.indonesian : audioFixtures.arabic;
    return route.fulfill({ status: 200, body, contentType: 'audio/mpeg', headers: { 'access-control-allow-origin': '*' } });
  });
  const page = await context.newPage();
  page.on('pageerror', err => errors.push(err.message));
  const wait = async condition => { await page.waitForFunction(condition, undefined, { timeout: 15000 }); };
  const log = message => console.log(`PASS ${message}`);
  await page.goto(base, { waitUntil: 'networkidle' });
  assert.equal(await page.getByText('Metode Eksplorasi Terpadu', { exact: true }).count(), 0);
  await page.locator('select').first().selectOption('en');
  await page.getByRole('heading', { level: 1 }).filter({ hasText: 'Read the Quran.' }).waitFor();
  assert.equal(await page.evaluate(() => document.documentElement.lang), 'en');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('heading', { level: 1 }).filter({ hasText: 'Read the Quran.' }).waitFor();
  log('language selection changes visible content and persists after reload');
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `home overflow ${width}`);
    await page.screenshot({ path: path.join(out, `home-${width}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Find a word or root', exact: true }).click();
  const searchInput = page.getByRole('textbox').first(); await searchInput.fill('رحم');
  await page.getByRole('button').filter({ hasText: 'ر ح م' }).first().waitFor({ timeout: 3000 }).catch(() => {});
  await page.keyboard.press('Escape');
  log('search opens, accepts Arabic, and closes with Escape');
  await page.goto(`${base}/morfologi`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /Root index|Roots and morphology/ }).first().waitFor();
  assert.ok(await page.locator('a[href^="/akar/"]').count() > 0);
  log('English catalog renders real root links');
  await page.goto(`${base}/baca?surah=18`, { waitUntil: 'networkidle' });
  await page.locator('#ayah-1').waitFor({ timeout: 60000 });
  assert.ok((await page.locator('#ayah-1').innerText()).includes('praise is'));
  await page.getByRole('button', { name: 'Play verse 1', exact: true }).click();
  const player = page.getByRole('complementary', { name: 'Quran audio player' }); await player.waitFor();
  await player.getByLabel('Handsfree mode').selectOption('reverse');
  await wait(() => Array.from(document.querySelectorAll('aside')).some(el => el.innerText.includes('Human English translation')));
  await wait(() => window.__played.some(src => /English\/Sahih_Intnl_Ibrahim_Walk_192kbps\/018001\.mp3/.test(src)));
  assert.ok((await player.innerText()).includes('Human English translation'));
  await page.evaluate(() => window.__endTrack());
  await wait(() => /018001\.mp3/.test(window.__played.at(-1)) && !window.__played.at(-1).includes('/English/'));
  log('English reverse handsfree plays a human translation recording, then the same verse Arabic');
  await player.getByLabel('Repeat', { exact: true }).selectOption('ayah');
  await page.evaluate(() => window.__endTrack());
  await wait(() => /English\/Sahih_Intnl_Ibrahim_Walk_192kbps\/018001\.mp3/.test(window.__played.at(-1)) && window.__played.length >= 4);
  assert.match(await player.locator('p').first().innerText(), /Verse 1\//);
  await player.getByLabel('Repeat', { exact: true }).selectOption('off');
  await player.getByRole('button', { name: 'Audio settings', exact: true }).click();
  await player.getByRole('checkbox', { name: 'Continue to the next verse automatically' }).uncheck();
  await page.evaluate(() => window.__endTrack());
  await wait(() => /018001\.mp3/.test(window.__played.at(-1)) && !window.__played.at(-1).includes('/English/'));
  const count = await page.evaluate(() => window.__played.length);
  await page.evaluate(() => window.__endTrack());
  await player.getByRole('button', { name: 'Play', exact: true }).waitFor();
  assert.equal(await page.evaluate(() => window.__played.length), count);
  log('explicit verse-repeat and auto-next off control track completion');
  await player.getByRole('button', { name: 'Close player', exact: true }).click();
  assert.equal(await player.count(), 0);
  await page.locator('#ayah-1 [role="button"]').first().click();
  const dialog = page.getByRole('dialog'); await dialog.waitFor();
  await dialog.getByText('All Praise', { exact: false }).first().waitFor({ timeout: 60000 });
  assert.ok(!/Filosofi Dasar Makna|Matriks Tasrif|mengubah potensi/.test(await dialog.innerText()));
  await page.screenshot({ path: path.join(out, 'entry-english.png'), fullPage: true });
  await page.keyboard.press('Escape');
  log('word popup loads English source-backed gloss without generated derivation');
  await page.goto(`${base}/baca?surah=1`, { waitUntil: 'networkidle' });
  await page.locator('#ayah-1').waitFor();
  await page.getByRole('button', { name: 'Play verse 1', exact: true }).click();
  await player.getByLabel('Handsfree mode').selectOption('normal');
  await page.evaluate(() => window.__endTrack());
  await wait(() => window.__played.at(-1).includes('/English/Sahih_Intnl_Ibrahim_Walk_192kbps/001001.mp3'));
  await page.evaluate(() => window.__endTrack());
  await wait(() => /001002\.mp3/.test(window.__played.at(-1)));
  log('human English translation plays with empty Quran.com translation text and then advances');
  await page.evaluate(() => { window.__failTranslation = true; });
  await player.getByLabel('Handsfree mode').selectOption('reverse');
  await wait(() => /001002\.mp3/.test(window.__played.at(-1)));
  await player.getByLabel('Handsfree mode').selectOption('normal');
  await page.evaluate(() => window.__endTrack());
  await wait(() => /001003\.mp3/.test(window.__played.at(-1)));
  log('unavailable human English translation file falls back to same verse Arabic in reverse and next verse in normal');
  const allTracks = await page.evaluate(() => window.__played);
  assert.ok(allTracks.every(src => !/translate_tts|audio-translation|tts/i.test(src)));
  assert.equal((await context.request.get(`${base}/api/audio-translation?text=test`)).status(), 410);
  log('no synthesized audio, including removed endpoint');
  const detail = await (await context.request.get(`${base}/api/word-detail?location=9:1:1`)).json();
  assert.ok(detail.data.study.primaryMeaning.textEnglish);
  assert.ok(!detail.data.study.linguisticExplanation && !detail.data.study.grammarDerivation);
  for (const [word, english] of [['وَ', 'and'], ['فِي', 'in'], ['كَلَّا', 'nay']]) {
    const data = await (await context.request.get(`${base}/api/word-detail?word=${encodeURIComponent(word)}`)).json();
    assert.ok(data.data.study.primaryMeaning.textEnglish.toLowerCase().includes(english));
  }
  log('wa, fi, and kalla have sourced bilingual definitions');
  await page.goto(`${base}/tentang`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'About and sources' }).waitFor();
  assert.ok((await page.locator('article').innerText()).includes('AI assisted software'));
  assert.equal(errors.length, 0, errors.join('\n'));
  fs.writeFileSync(path.join(out, 'release-results.json'), JSON.stringify({ passed: true, browser: await browser.version(), lifecycleMocked: true, screenshots: ['home-1440.png','home-768.png','home-390.png','entry-english.png'], tracks: allTracks, errors }, null, 2));
  await browser.close(); console.log('Release smoke checks passed.');
})().catch(error => { console.error(error); process.exit(1); });
