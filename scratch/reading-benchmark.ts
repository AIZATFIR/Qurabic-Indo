import { fetchSurahWithWBW } from '../lib/api/quran-corpus-api';
import { getSurahByNumber } from '../lib/data/surah-list';

async function runBenchmark() {
  console.log('📊 RUNNING QURABIC READING ENGINE PERFORMANCE BENCHMARK\n');

  const testSurahs = [1, 36, 2]; // Small (7), Medium (83), Large (286)
  const results: Array<{
    surahNumber: number;
    name: string;
    ayahsCount: number;
    totalWords: number;
    fetchDurationMs: number;
    searchKataDurationMs: number;
    searchAyahDurationMs: number;
  }> = [];

  for (const sNum of testSurahs) {
    const meta = getSurahByNumber(sNum)!;
    const startFetch = performance.now();
    const ayahs = await fetchSurahWithWBW(sNum);
    const fetchDuration = performance.now() - startFetch;

    const totalWords = ayahs.reduce((acc, a) => acc + a.words.length, 0);

    // Benchmark Search Kata (Word filter)
    const query = 'الله';
    const startSearchKata = performance.now();
    const qLower = query.toLowerCase();
    const filtered = ayahs.filter(a => 
      a.textArabic.includes(query) || 
      a.textIndo.toLowerCase().includes(qLower) ||
      a.words.some(w => w.transliteration?.toLowerCase().includes(qLower))
    );
    const searchKataDuration = performance.now() - startSearchKata;

    // Benchmark Search Ayat Context Extraction (Target Ayah + Context Window 7 ayahs)
    const target = Math.min(meta.ayahsCount, 150);
    const startSearchAyat = performance.now();
    const contextStart = Math.max(1, target - 3);
    const contextEnd = Math.min(meta.ayahsCount, target + 3);
    const contextAyahs = ayahs.filter(a => a.ayahNumber >= contextStart && a.ayahNumber <= contextEnd);
    const searchAyatDuration = performance.now() - startSearchAyat;

    results.push({
      surahNumber: sNum,
      name: meta.nameIndo,
      ayahsCount: meta.ayahsCount,
      totalWords,
      fetchDurationMs: Math.round(fetchDuration),
      searchKataDurationMs: Number(searchKataDuration.toFixed(3)),
      searchAyahDurationMs: Number(searchAyatDuration.toFixed(3))
    });
  }

  console.table(results);
}

runBenchmark().catch(console.error);
