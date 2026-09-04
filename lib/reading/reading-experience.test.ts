import { describe, it } from 'node:test';
import assert from 'node:assert';
import { fetchSurahWithWBW, SURAH_WBW_CACHE, FullAyahWBW } from '../api/quran-corpus-api';
import { getSurahByNumber } from '../data/surah-list';
import { stripArabicHarakat } from '../search/root-search';

describe('PRD 2 — Reading Experience, Performance & Dual Search Matrix', () => {
  it('Data Ingestion & In-Memory Caching: fetchSurahWithWBW caches data cleanly', async () => {
    // Initial fetch of Surah 1 (Al-Fatihah)
    const surah1 = await fetchSurahWithWBW(1);
    assert.strictEqual(surah1.length, 7, 'Surah 1 must have 7 ayahs');
    assert.ok(SURAH_WBW_CACHE.has(1), 'SURAH_WBW_CACHE must contain key 1');

    // Second fetch must hit cache with 0ms overhead and strict identity
    const startCacheHit = performance.now();
    const cachedSurah1 = await fetchSurahWithWBW(1);
    const duration = performance.now() - startCacheHit;

    assert.strictEqual(cachedSurah1, surah1, 'Cached surah must return identical reference');
    assert.ok(duration < 5, `Cache hit duration must be < 5ms (was ${duration.toFixed(2)}ms)`);
  });

  it('Search Mode A (Kata): Filters matching verses without mutating source Quran dataset', async () => {
    const surah2 = await fetchSurahWithWBW(2);
    const originalCount = surah2.length;
    assert.strictEqual(originalCount, 286, 'Surah 2 must have 286 ayahs');

    // Filter by query "صبر" (sabr) with normalized matching
    const query = 'صبر';
    const normQ = stripArabicHarakat(query);
    const filtered = surah2.filter(
      (a) =>
        stripArabicHarakat(a.textArabic).includes(normQ) ||
        a.textIndo.toLowerCase().includes('sabar') ||
        a.words.some((w) => stripArabicHarakat(w.arabic).includes(normQ) || w.transliteration?.toLowerCase().includes('sabr'))
    );

    assert.ok(filtered.length > 0, 'Must find verses containing صبر in Surah 2');
    assert.ok(filtered.length < originalCount, 'Filtered count must be less than total 286 ayahs');

    // Verify source dataset remains completely immutable
    assert.strictEqual(surah2.length, 286, 'Source dataset must remain 286 ayahs');
  });

  it('Search Mode B (Ayat): Computes accurate adaptive context window (7 ayahs) for any target', async () => {
    const surah2 = await fetchSurahWithWBW(2);
    const totalAyahs = surah2.length;
    const CONTEXT_RADIUS = 3;

    // Test 1: First Ayah (1) -> Context [1, 4] (4 ayahs)
    const target1 = 1;
    const start1 = Math.max(1, target1 - CONTEXT_RADIUS);
    const end1 = Math.min(totalAyahs, target1 + CONTEXT_RADIUS);
    const window1 = surah2.filter((a) => a.ayahNumber >= start1 && a.ayahNumber <= end1);
    assert.strictEqual(start1, 1);
    assert.strictEqual(end1, 4);
    assert.strictEqual(window1.length, 4);

    // Test 2: Middle Ayah (150) -> Context [147, 153] (7 ayahs)
    const target150 = 150;
    const start150 = Math.max(1, target150 - CONTEXT_RADIUS);
    const end150 = Math.min(totalAyahs, target150 + CONTEXT_RADIUS);
    const window150 = surah2.filter((a) => a.ayahNumber >= start150 && a.ayahNumber <= end150);
    assert.strictEqual(start150, 147);
    assert.strictEqual(end150, 153);
    assert.strictEqual(window150.length, 7);
    assert.ok(window150.some((a) => a.ayahNumber === 150), 'Window must contain target ayah 150');

    // Test 3: Last Ayah (286) -> Context [283, 286] (4 ayahs)
    const target286 = 286;
    const start286 = Math.max(1, target286 - CONTEXT_RADIUS);
    const end286 = Math.min(totalAyahs, target286 + CONTEXT_RADIUS);
    const window286 = surah2.filter((a) => a.ayahNumber >= start286 && a.ayahNumber <= end286);
    assert.strictEqual(start286, 283);
    assert.strictEqual(end286, 286);
    assert.strictEqual(window286.length, 4);

    // Test 4: Ayat Kursi (2:255) -> Context [252, 258] (7 ayahs)
    const target255 = 255;
    const start255 = Math.max(1, target255 - CONTEXT_RADIUS);
    const end255 = Math.min(totalAyahs, target255 + CONTEXT_RADIUS);
    const window255 = surah2.filter((a) => a.ayahNumber >= start255 && a.ayahNumber <= end255);
    assert.strictEqual(window255.length, 7);
    assert.strictEqual(window255[3].ayahNumber, 255, 'Target ayah 255 must be centered in context window');
  });

  it('Stable Key Invariants: Ayah and Word keys are unique and collision-free', async () => {
    const surah1 = await fetchSurahWithWBW(1);
    const ayahKeys = new Set<string>();
    const wordKeys = new Set<string>();

    for (const a of surah1) {
      const aKey = `1:${a.ayahNumber}`;
      assert.ok(!ayahKeys.has(aKey), `Duplicate ayah key detected: ${aKey}`);
      ayahKeys.add(aKey);

      for (const w of a.words) {
        const wKey = `1:${a.ayahNumber}:${w.position}`;
        assert.ok(!wordKeys.has(wKey), `Duplicate word key detected: ${wKey}`);
        wordKeys.add(wKey);
      }
    }

    assert.strictEqual(ayahKeys.size, 7, 'Must have 7 unique ayah keys for Al-Fatihah');
  });
});
