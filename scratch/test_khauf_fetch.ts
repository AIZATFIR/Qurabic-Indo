import { fetchLiveQuranOccurrences } from '../lib/api/quran-corpus-api';

async function test() {
  console.log('Testing live occurrences for "خوف" (khauf)...');
  const occurrences = await fetchLiveQuranOccurrences('خوف');
  console.log('Found occurrences:', occurrences.length);
  occurrences.forEach((o, i) => {
    console.log(`[${i + 1}] Q.S. ${o.surahNameIndo} ${o.surahNumber}:${o.ayahNumber}`);
    console.log(`    Arabic: ${o.verseArabic.substring(0, 70)}...`);
    console.log(`    Indo: ${o.verseIndo.substring(0, 70)}...`);
  });
}

test();
