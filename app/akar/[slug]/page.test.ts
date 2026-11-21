import assert from 'node:assert/strict';
import React from 'react';
import RootDetailPage from './page';

(globalThis as typeof globalThis & { React: typeof React }).React = React;

async function main() {
  const page = await RootDetailPage({ params: Promise.resolve({ slug: 'S-b-r' }) });
  const root = (page as { props: { root: { occurrences: unknown[]; statistics: { uniqueAyahs: number }; lexicon?: unknown } } }).props.root;

  assert.equal(root.occurrences.length, 0, 'root pages load the verse list from the dedicated static resource');
  assert.ok(root.statistics.uniqueAyahs > 0, 'root summary statistics remain available in the initial response');
  assert.ok(root.lexicon, 'sourced Lane entries remain available in the initial response');
  console.log('Root page starts with compact root data and preserves sourced entry metadata.');
}

void main();
