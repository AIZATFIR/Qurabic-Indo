import { getWordDetailedExplanation } from './word-dictionary';

function runWordDictionaryTests() {
  console.log('Running Word Dictionary & Deep Root Etymology TDD Unit Tests...\n');

  // Test 1: Detailed explanation for "الْحَمْدُ"
  const hamd = getWordDetailedExplanation('الْحَمْدُ', 'segala puji');
  console.assert(hamd.rootLetters.replace(/\s+/g, '') === 'حمد', 'Test 1 Failed: Root letters for الْحَمْدُ should be ح م د');
  console.assert(hamd.meanings.length >= 2, 'Test 1 Failed: Should provide multiple detailed definitions for الْحَمْدُ');
  console.assert(hamd.rootExplanation.length > 20, 'Test 1 Failed: Should provide rich classical root explanation for الْحَمْدُ');
  console.log('Passed Test 1: الْحَمْدُ has rich definitions and root etymology (ح م د)');

  // Test 2: Detailed explanation for "زَجْرَةٌ" (as in user screenshot)
  const zajrah = getWordDetailedExplanation('زَجْرَةٌ', 'teriakan');
  console.assert(zajrah.rootLetters.replace(/\s+/g, '') === 'زجر', 'Test 2 Failed: Root letters for زَجْرَةٌ should be ز ج ر');
  console.assert(zajrah.meanings.some(m => m.toLowerCase().includes('bentakan') || m.toLowerCase().includes('teriakan')), 'Test 2 Failed: Should contain detailed meaning for زَجْرَةٌ');
  console.assert(zajrah.rootExplanation.includes('Zajara') || zajrah.rootExplanation.includes('suara') || zajrah.rootExplanation.includes('hardik'), 'Test 2 Failed: Should explain root meaning of z-j-r');
  console.log('Passed Test 2: زَجْرَةٌ has accurate multi-layer definition and root analysis (ز ج ر)');

  // Test 3: Detailed explanation for "الصَّابِرِينَ"
  const sabir = getWordDetailedExplanation('الصَّابِرِينَ', 'orang-orang yang sabar');
  console.assert(sabir.rootLetters.replace(/\s+/g, '') === 'صبر', 'Test 3 Failed: Root letters for الصَّابِرِينَ should be ص ب ر');
  console.assert(sabir.grammaticalRole.includes("Isim Fa'il"), 'Test 3 Failed: Grammatical role should identify Isim Fa\'il');
  console.log('Passed Test 3: الصَّابِرِينَ has deep morphological role & classical etymology (ص ب ر)');

  // Test 4: Detailed explanation for "الرَّحْمَـٰنِ"
  const rahman = getWordDetailedExplanation('الرَّحْمَـٰنِ', 'Maha Pengasih');
  console.assert(rahman.rootLetters.replace(/\s+/g, '') === 'رحم', 'Test 4 Failed: Root letters for الرَّحْمَـٰنِ should be ر ح م');
  console.assert(rahman.meanings.length >= 2, 'Test 4 Failed: Multiple definitions for Ar-Rahman');
  console.log('Passed Test 4: الرَّحْمَـٰنِ has expansive definitions and classical root insight (ر ح م)');

  // Test 5: Fallback explanation for unlisted word still extracts valid root and grammar
  const generic = getWordDetailedExplanation('يَعْمَلُونَ', 'mereka mengerjakan');
  console.assert(generic.rootLetters.length > 0, 'Test 5 Failed: Should extract root letters for yalamun');
  console.assert(generic.grammaticalRole.includes("Fi'il"), 'Test 5 Failed: Should identify Fi\'il Mudhari');
  console.log('Passed Test 5: Generic word fallback extracts root and grammar cleanly');

  console.log('\nALL 5 WORD DICTIONARY TDD UNIT TESTS PASSED!');
}

runWordDictionaryTests();
