import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET } from '../../app/api/root-detail/route';

async function main() {
  const originalFetch = globalThis.fetch;
  let upstreamRequests = 0;
  globalThis.fetch = async () => {
    upstreamRequests += 1;
    return new Response('unavailable', { status: 503 });
  };
  let response: Response;
  try {
    response = await GET(new NextRequest('https://qurabic.test/api/root-detail?root=s-b-r&v=5'));
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.root.id, 'S-b-r');
  assert.equal(payload.root.occurrences.length, 0, 'root-detail returns the compact root model; occurrences load from their dedicated resource');
  assert(payload.root.statistics.totalOccurrences > 0, 'root counts remain available without occurrence payload');
  assert.equal(upstreamRequests, 0, 'root entry data must not wait for Quran.com word gloss requests');
  const payloadBytes = Buffer.byteLength(JSON.stringify(payload));
  assert(payloadBytes < 110_000, `root metadata excludes the occurrence list (${payloadBytes} bytes)`);
  console.log(`Passed: compact root metadata response (${payloadBytes} bytes).`);
}

void main();
