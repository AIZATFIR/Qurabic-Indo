import assert from 'node:assert/strict';
import { getQuranWordGlosses } from './quran-word-glosses';
import { normalizeIndonesianWbwGloss } from './indonesian-wbw-normalizer';

async function run() {
  assert.equal(normalizeIndonesianWbwGloss('didalamnya'), 'di dalamnya');
  assert.equal(normalizeIndonesianWbwGloss('diantara mereka'), 'di antara mereka');
  assert.equal(normalizeIndonesianWbwGloss('diatasmu'), 'di atasmu');
  assert.equal(normalizeIndonesianWbwGloss('dibelakangnya/kemudian'), 'di belakangnya/kemudian');
  assert.equal(normalizeIndonesianWbwGloss('Dihadapan-Ku'), 'Di hadapan-Ku');
  assert.equal(normalizeIndonesianWbwGloss('diberikan'), 'diberikan');
  assert.equal(normalizeIndonesianWbwGloss('di dalamnya'), 'di dalamnya');

  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = (async () => { throw new Error('Quran.com unavailable'); }) as typeof fetch;
    const fallback = await getQuranWordGlosses(['2:2:3', '18:3:2'], 'id');
    assert.deepEqual(fallback.meanings, { '2:2:3': 'no · not · non-', '18:3:2': 'in' });
    assert.equal(fallback.sources['2:2:3'], 'maqam-english-gloss');
    assert.equal(fallback.sources['18:3:2'], 'maqam-english-gloss');

    globalThis.fetch = (async () => new Response(JSON.stringify({
      verse: { words: [{ location: '2:2:3', translation: { text: 'No doubt' } }] },
    }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch;
    const preferred = await getQuranWordGlosses(['2:2:3', '18:3:2'], 'en');
    assert.equal(preferred.meanings['2:2:3'], 'No doubt');
    assert.equal(preferred.sources['2:2:3'], 'quran-com-wbw');
    assert.equal(preferred.meanings['18:3:2'], 'in');
    assert.equal(preferred.sources['18:3:2'], 'maqam-english-gloss');

    globalThis.fetch = (async () => new Response(JSON.stringify({
      verse: { words: [{ location: '18:3:2', translation: { text: 'didalamnya' } }] },
    }), { status: 200, headers: { 'content-type': 'application/json' } })) as typeof fetch;
    const indonesian = await getQuranWordGlosses(['18:3:2'], 'id');
    assert.equal(indonesian.meanings['18:3:2'], 'di dalamnya');
    assert.equal(indonesian.sources['18:3:2'], 'quran-com-wbw');
  } finally {
    globalThis.fetch = originalFetch;
  }
  console.log('Word gloss source fallback checks passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
