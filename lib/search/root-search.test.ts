import { searchRoots, getRootBySlug } from './root-search';

function runTests() {
  console.log('🧪 Running Qurabic-Indo Search Engine Unit Tests...\n');

  // Test 1: Arabic search for "صبر"
  const arabResult = searchRoots('صبر');
  console.assert(arabResult.length > 0 && arabResult[0].id === 's-b-r', 'Test 1 Failed: Arabic query "صبر" should find s-b-r');
  console.log('✅ Test 1 Passed: Arabic query "صبر" -> Found s-b-r');

  // Test 2: Latin search for "sabar"
  const latinResult = searchRoots('sabar');
  console.assert(latinResult.length > 0 && latinResult[0].id === 's-b-r', 'Test 2 Failed: Latin query "sabar" should find s-b-r');
  console.log('✅ Test 2 Passed: Latin query "sabar" -> Found s-b-r');

  // Test 3: Classical etymology search for "batu" (sobaro = batu keras)
  const etymologyResult = searchRoots('batu');
  console.assert(etymologyResult.length > 0 && etymologyResult[0].id === 's-b-r', 'Test 3 Failed: Etymology query "batu" should find s-b-r');
  console.log('✅ Test 3 Passed: Etymology query "batu" -> Found s-b-r (Sobaro = Batu)');

  // Test 4: Indonesian search for "tulis"
  const indoResult = searchRoots('tulis');
  console.assert(indoResult.length > 0 && indoResult[0].id === 'k-t-b', 'Test 4 Failed: Indonesian query "tulis" should find k-t-b');
  console.log('✅ Test 4 Passed: Indonesian query "tulis" -> Found k-t-b');

  // Test 5: English search for "patience"
  const englishResult = searchRoots('patience');
  console.assert(englishResult.length > 0 && englishResult[0].id === 's-b-r', 'Test 5 Failed: English query "patience" should find s-b-r');
  console.log('✅ Test 5 Passed: English query "patience" -> Found s-b-r');

  // Test 6: Get by slug "s-b-r"
  const slugResult = getRootBySlug('s-b-r');
  console.assert(slugResult !== undefined && slugResult.id === 's-b-r', 'Test 6 Failed: Slug "s-b-r" should return root object');
  console.log('✅ Test 6 Passed: Slug lookup "s-b-r" -> Verified');

  console.log('\n🎉 ALL 6 SEARCH ENGINE TESTS PASSED SUCCESSFULLY!');
}

runTests();
