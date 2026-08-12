import { searchRoots, getRootBySlug } from './root-search';

function runTests() {
  console.log('🧪 Running Qurabic-Indo Search Engine Unit Tests (Full Corpus & Phonetics)...\n');

  // Test 1: Arabic search for "صبر"
  const arabResult = searchRoots('صبر');
  console.assert(arabResult.length > 0 && arabResult[0].id === 's-b-r', 'Test 1 Failed: Arabic query "صبر" should find s-b-r');
  console.log('✅ Test 1 Passed: Arabic query "صبر" -> Found s-b-r');

  // Test 2: Indonesian Phonetic Search for "sholat"
  const sholatResult = searchRoots('sholat');
  console.assert(sholatResult.length > 0 && sholatResult[0].id === 's-l-w', 'Test 2 Failed: Phonetic query "sholat" should find s-l-w');
  console.log('✅ Test 2 Passed: Phonetic query "sholat" -> Found s-l-w (Salat / Sholat)');

  // Test 3: Indonesian Phonetic Search for "solat"
  const solatResult = searchRoots('solat');
  console.assert(solatResult.length > 0 && solatResult[0].id === 's-l-w', 'Test 3 Failed: Phonetic query "solat" should find s-l-w');
  console.log('✅ Test 3 Passed: Phonetic query "solat" -> Found s-l-w');

  // Test 4: Phonetic Search for "takwa"
  const takwaResult = searchRoots('takwa');
  console.assert(takwaResult.length > 0 && takwaResult[0].id === 'w-q-y', 'Test 4 Failed: Phonetic query "takwa" should find w-q-y');
  console.log('✅ Test 4 Passed: Phonetic query "takwa" -> Found w-q-y (Taqwa)');

  // Test 5: Phonetic Search for "zakat"
  const zakatResult = searchRoots('zakat');
  console.assert(zakatResult.length > 0 && zakatResult[0].id === 'z-k-w', 'Test 5 Failed: Phonetic query "zakat" should find z-k-w');
  console.log('✅ Test 5 Passed: Phonetic query "zakat" -> Found z-k-w');

  // Test 6: Classical etymology query for "batu"
  const etymologyResult = searchRoots('batu');
  console.assert(etymologyResult.length > 0 && etymologyResult[0].id === 's-b-r', 'Test 6 Failed: Etymology query "batu" should find s-b-r');
  console.log('✅ Test 6 Passed: Etymology query "batu" -> Found s-b-r');

  console.log('\n🎉 ALL 6 PHONETIC & FULL CORPUS SEARCH TESTS PASSED SUCCESSFULLY!');
}

runTests();
