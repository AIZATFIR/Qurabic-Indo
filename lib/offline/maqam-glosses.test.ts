import assert from 'node:assert/strict';
import { getOfflineMaqamGlosses } from './maqam-glosses';

async function run() {
  const originalFetch = globalThis.fetch;
  let fetches = 0;
  try {
    globalThis.fetch = (async () => {
      fetches += 1;
      return new Response(JSON.stringify({ '2:2:3': 'no;not;non-', '18:3:2': 'in' }), { status: 200 });
    }) as typeof fetch;
    assert.deepEqual(await getOfflineMaqamGlosses(['2:2:3', '18:3:2', '2:2:3']), {
      '2:2:3': 'no · not · non-',
      '18:3:2': 'in',
    });
    assert.deepEqual(await getOfflineMaqamGlosses(['2:2:3']), { '2:2:3': 'no · not · non-' });
    assert.equal(fetches, 1, 'the downloaded index should only be fetched and parsed once per app session');
  } finally {
    globalThis.fetch = originalFetch;
  }
  console.log('Offline MAQAM gloss checks passed');
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
