import assert from 'node:assert/strict';
import { SURAH_LIST } from '@/lib/data/surah-list';
import { searchOfflineTranslationRows, type OfflineTranslationRow } from './quran-translation-search';

const completeRows: OfflineTranslationRow[] = SURAH_LIST.flatMap((surah) =>
  Array.from({ length: surah.ayahsCount }, (_, index) => {
    const ayah = index + 1;
    const key = `${surah.number}:${ayah}`;
    const text = key === '1:1'
      ? '<sup>1</sup> Mercy is near.'
      : key === '1:2'
        ? 'The mercý of the Lord.'
        : `Verse ${key}.`;
    return { recordType: 'translation', data: { verse_key: key, text } };
  }),
);

const firstPage = searchOfflineTranslationRows(completeRows, 'mercy', 1, 1);
assert.deepEqual(firstPage?.matches.map((match) => match.key), ['1:1']);
assert.equal(firstPage?.matches[0].translation, 'Mercy is near.');
assert.equal(firstPage?.hasMore, true);

const secondPage = searchOfflineTranslationRows(completeRows, 'mercy', 2, 1);
assert.deepEqual(secondPage?.matches.map((match) => match.key), ['1:2']);
assert.equal(secondPage?.hasMore, false);

assert.equal(searchOfflineTranslationRows(completeRows.slice(1), 'mercy'), null);
assert.equal(searchOfflineTranslationRows(completeRows, 'absent phrase')?.matches.length, 0);

console.log('Offline Quran translation search checks passed');
