import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchRootOccurrences } from './root-occurrences';

test('loads full verse context for a root from its public occurrence asset', async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return new Response(JSON.stringify([{
      surahNumber: 2,
      ayahNumber: 45,
      surahNameIndo: 'Al-Baqarah',
      surahNameArabic: 'البقرة',
      verseArabic: 'وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ',
      verseIndo: 'Jadikanlah sabar dan salat sebagai penolongmu.',
      matchedWordArabic: 'بِٱلصَّبْرِ',
      matchedWordIndo: 'dengan sabar',
      wordLocation: '2:45:2',
    }]), { status: 200 });
  };

  try {
    const occurrences = await fetchRootOccurrences('S-b-r');
    assert.equal(requestedUrl, '/data/occurrences/S-b-r.json');
    assert.equal(occurrences.length, 1);
    assert.match(occurrences[0].verseIndo, /Jadikanlah sabar/);
    assert.match(occurrences[0].verseArabic, /بِٱلصَّبْرِ/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rejects unavailable root occurrence assets so the UI can show its empty state', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(null, { status: 404 });

  try {
    await assert.rejects(fetchRootOccurrences('missing-root'), /Root occurrences unavailable/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
