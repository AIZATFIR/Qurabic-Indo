import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchSurahWithWBW } from './quran-corpus-api';

test('reader fetches requested source language and keeps its caches separate', async () => {
  const original = globalThis.fetch;
  const calls: string[] = [];
  globalThis.fetch = async (input) => {
    const url = String(input); calls.push(url);
    const en = url.includes('language=en');
    assert.ok(url.includes(en ? 'translations=20' : 'translations=33'));
    return Response.json({ verses: [{ verse_number: 1, verse_key: '18:1', translations: [{ text: en ? 'All praise is due to Allah' : 'Segala puji bagi Allah' }], words: [{ id: 1, position: 1, char_type_name: 'word', text_uthmani: 'ٱلْحَمْدُ', translation: { text: en ? 'All Praise' : 'segala puji' } }] }], pagination: { total_pages: 1 } });
  };
  try {
    const id = await fetchSurahWithWBW(18, 'id');
    const en = await fetchSurahWithWBW(18, 'en');
    assert.equal(id[0].textIndo, 'Segala puji bagi Allah');
    assert.equal(en[0].textIndo, 'All praise is due to Allah');
    assert.equal(en[0].words[0].meaningIndo, 'All Praise');
    assert.equal((await fetchSurahWithWBW(18, 'id'))[0].textIndo, 'Segala puji bagi Allah');
    assert.equal(calls.length, 2);
  } finally { globalThis.fetch = original; }
});
