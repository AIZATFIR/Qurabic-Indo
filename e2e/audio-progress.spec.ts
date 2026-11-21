import { expect, test } from '@playwright/test';

test('audio progress stays continuous between media updates and freezes when paused', async ({ page }) => {
  await page.route((url) => {
    const requestUrl = new URL(url);
    return requestUrl.hostname === 'api.quran.com' && requestUrl.pathname === '/api/v4/verses/by_chapter/18';
  }, (route) => route.fulfill({
    json: {
      pagination: { total_pages: 1 },
      verses: [{
        verse_number: 1,
        verse_key: '18:1',
        text_uthmani: 'ٱلْحَمْدُ لِلَّهِ',
        translations: [{ text: 'Segala puji bagi Allah.' }],
        words: [
          { id: 1, position: 1, text_uthmani: 'ٱلْحَمْدُ', transliteration: { text: 'al-ḥamdu' }, translation: { text: 'segala puji' }, char_type_name: 'word', location: '18:1:1' },
          { id: 2, position: 2, text_uthmani: 'لِلَّهِ', transliteration: { text: 'lillāhi' }, translation: { text: 'bagi Allah' }, char_type_name: 'word', location: '18:1:2' },
          { id: 3, position: 3, text_uthmani: '١', transliteration: { text: '' }, translation: { text: '' }, char_type_name: 'end', location: '18:1:3' },
        ],
      }],
    },
  }));
  await page.addInitScript(() => {
    type MockAudio = HTMLMediaElement & {
      __mockPlaying?: boolean;
      __mockBase?: number;
      __mockStartedAt?: number;
      __mockTime?: number;
      __mockTimer?: number;
    };
    const media = HTMLMediaElement.prototype as MockAudio;
    Object.defineProperties(media, {
      currentTime: {
        configurable: true,
        get(this: MockAudio) { return this.__mockPlaying ? this.__mockBase! + (performance.now() - this.__mockStartedAt!) / 1000 : this.__mockTime || 0; },
        set(this: MockAudio, value: number) { this.__mockTime = value; this.__mockBase = value; this.__mockStartedAt = performance.now(); },
      },
      duration: { configurable: true, get() { return 8; } },
      paused: { configurable: true, get(this: MockAudio) { return !this.__mockPlaying; } },
      ended: { configurable: true, get() { return false; } },
    });
    media.load = () => {};
    media.play = function (this: MockAudio) {
      this.__mockPlaying = true;
      this.__mockBase = this.__mockTime || 0;
      this.__mockStartedAt = performance.now();
      if (!this.__mockTimer) this.__mockTimer = window.setInterval(() => this.dispatchEvent(new Event('timeupdate')), 1_000);
      queueMicrotask(() => this.dispatchEvent(new Event('playing')));
      return Promise.resolve();
    };
    media.pause = function (this: MockAudio) {
      if (!this.__mockPlaying) return;
      this.__mockTime = this.currentTime;
      this.__mockPlaying = false;
      window.clearInterval(this.__mockTimer);
      this.__mockTimer = undefined;
      this.dispatchEvent(new Event('pause'));
    };
  });
  await page.goto('/baca?surah=18', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: /Surah Al-Kahf/ }).waitFor();
  const playButton = page.getByRole('button', { name: /Putar Tilawah/ }).first();
  await page.getByRole('button', { name: /Bedah kata:/ }).first().waitFor();
  await playButton.click();

  const player = page.locator('[data-audio-progress]');
  await expect(player).toBeVisible();
  await expect(page.getByRole('button', { name: /Jeda Tilawah/ })).toBeVisible({ timeout: 12000 });
  const playingFrames = await page.evaluate(async () => {
    const fill = document.querySelector('[data-audio-progress] > span:first-child > span');
    if (!fill) throw new Error('Audio progress fill is missing');
    const samples: Array<{ time: number; value: number }> = [];
    const startedAt = performance.now();
    return await new Promise<{ frames: number; first: number; last: number; backwards: number; largestStep: number; longestStallMs: number }>((resolve) => {
      const sample = () => {
        const transform = new DOMMatrixReadOnly(getComputedStyle(fill).transform);
        samples.push({ time: performance.now(), value: transform.a });
        if (performance.now() - startedAt < 1_200) {
          requestAnimationFrame(sample);
          return;
        }
        const steps = samples.slice(1).map((sample, index) => sample.value - samples[index].value);
        let longestStallMs = 0;
        let stallStartedAt = samples[0]?.time;
        for (let index = 1; index < samples.length; index++) {
          if (Math.abs(steps[index - 1]) < 0.000001) {
            longestStallMs = Math.max(longestStallMs, samples[index].time - (stallStartedAt ?? samples[index].time));
          } else {
            stallStartedAt = samples[index].time;
          }
        }
        resolve({
          frames: samples.length,
          first: samples[0]?.value ?? 0,
          last: samples.at(-1)?.value ?? 0,
          backwards: steps.filter((step) => step < -0.00001).length,
          largestStep: Math.max(0, ...steps),
          longestStallMs,
        });
      };
      requestAnimationFrame(sample);
    });
  });
  expect(playingFrames.frames).toBeGreaterThan(30);
  expect(playingFrames.last).toBeGreaterThan(playingFrames.first);
  expect(playingFrames.backwards).toBe(0);
  expect(playingFrames.largestStep).toBeLessThan(0.01);
  expect(playingFrames.longestStallMs).toBeLessThan(250);

  await page.getByRole('button', { name: /Jeda Tilawah/ }).click();
  const pausedFrames = await page.evaluate(async () => {
    const fill = document.querySelector('[data-audio-progress] > span:first-child > span');
    if (!fill) throw new Error('Audio progress fill is missing');
    const samples: number[] = [];
    return await new Promise<number>((resolve) => {
      const sample = () => {
        samples.push(new DOMMatrixReadOnly(getComputedStyle(fill).transform).a);
        if (samples.length < 12) requestAnimationFrame(sample);
        else resolve(Math.max(...samples) - Math.min(...samples));
      };
      requestAnimationFrame(sample);
    });
  });
  expect(pausedFrames).toBeLessThan(0.0001);
});
