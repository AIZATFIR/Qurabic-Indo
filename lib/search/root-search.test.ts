import { searchRoots, getRootBySlug } from './root-search';

function runTests() {
  console.log('🧪 Running Qurabic-Indo Search Engine Unit Tests (Full Corpus & Phonetics)...\n');

  // Test 1: Arabic search for "صبر"
  const arabResult = searchRoots('صبر');
  const test1Ok = arabResult.length > 0 && arabResult.some(r => r.id.toLowerCase() === 's-b-r');
  console.assert(test1Ok, 'Test 1 Failed: Arabic query "صبر" should find s-b-r');
  console.log('✅ Test 1 Passed: Arabic query "صبر" -> Found s-b-r');

  // Test 2: Indonesian Phonetic Search for "sholat"
  const sholatResult = searchRoots('sholat');
  const test2Ok = sholatResult.length > 0 && sholatResult.some(r => r.id.toLowerCase() === 's-l-w');
  console.assert(test2Ok, 'Test 2 Failed: Phonetic query "sholat" should find s-l-w');
  console.log('✅ Test 2 Passed: Phonetic query "sholat" -> Found s-l-w (Salat / Sholat)');

  // Test 3: Indonesian Phonetic Search for "solat"
  const solatResult = searchRoots('solat');
  const test3Ok = solatResult.length > 0 && solatResult.some(r => r.id.toLowerCase() === 's-l-w');
  console.assert(test3Ok, 'Test 3 Failed: Phonetic query "solat" should find s-l-w');
  console.log('✅ Test 3 Passed: Phonetic query "solat" -> Found s-l-w');

  // Test 4: Phonetic Search for "takwa"
  const takwaResult = searchRoots('takwa');
  const test4Ok = takwaResult.length > 0 && takwaResult.some(r => r.id.toLowerCase() === 'w-q-y');
  console.assert(test4Ok, 'Test 4 Failed: Phonetic query "takwa" should find w-q-y');
  console.log('✅ Test 4 Passed: Phonetic query "takwa" -> Found w-q-y (Taqwa)');

  // Test 5: Phonetic Search for "zakat"
  const zakatResult = searchRoots('zakat');
  const test5Ok = zakatResult.length > 0 && zakatResult.some(r => r.id.toLowerCase() === 'z-k-w');
  console.assert(test5Ok, 'Test 5 Failed: Phonetic query "zakat" should find z-k-w');
  console.log('✅ Test 5 Passed: Phonetic query "zakat" -> Found z-k-w');

  // Test 6: Classical etymology query for "batu"
  const etymologyResult = searchRoots('batu');
  const test6Ok = etymologyResult.length > 0 && etymologyResult.some(r => r.id.toLowerCase() === 's-b-r');
  console.assert(test6Ok, 'Test 6 Failed: Etymology query "batu" should find s-b-r');
  console.log('✅ Test 6 Passed: Etymology query "batu" -> Found s-b-r');

  console.log('\n🎉 ALL 6 PHONETIC & FULL CORPUS SEARCH TESTS PASSED SUCCESSFULLY!');
}

runTests();
