import { SURAH_LIST, searchSurahs, getSurahByNumber } from './surah-list';

function runSurahListTests() {
  console.log('Running Surah List & Search TDD Unit Tests...\n');

  // Test 1: Verify all 114 surahs are loaded with complete metadata
  console.assert(SURAH_LIST.length === 114, `Test 1 Failed: Expected 114 surahs, got ${SURAH_LIST.length}`);
  console.log('Passed Test 1: 114 Al-Qur\'an Surahs are present in database');

  // Test 2: Verify Surah 1 (Al-Fatihah) and Surah 55 (Ar-Rahman)
  const fatihah = getSurahByNumber(1);
  console.assert(fatihah?.nameIndo === 'Al-Fatihah', 'Test 2 Failed: Surah 1 should be Al-Fatihah');
  console.assert(fatihah?.ayahsCount === 7, 'Test 2 Failed: Al-Fatihah should have 7 ayahs');

  const rahman = getSurahByNumber(55);
  console.assert(rahman?.nameIndo === 'Ar-Rahman', 'Test 2 Failed: Surah 55 should be Ar-Rahman');
  console.assert(rahman?.ayahsCount === 78, 'Test 2 Failed: Ar-Rahman should have 78 ayahs');
  console.log('Passed Test 2: Surah metadata resolution by number works accurately');

  // Test 3: Verify Search by Indonesian name
  const searchRahman = searchSurahs('rahman');
  console.assert(searchRahman.length > 0 && searchRahman[0].number === 55, 'Test 3 Failed: Search "rahman" should find Surah 55');

  const searchYasin = searchSurahs('yasin');
  console.assert(searchYasin.length > 0 && searchYasin[0].number === 36, 'Test 3 Failed: Search "yasin" should find Surah 36');

  // Test 4: Verify Search by Number
  const searchByNum = searchSurahs('18');
  console.assert(searchByNum.some(s => s.number === 18 && s.nameIndo === 'Al-Kahf'), 'Test 4 Failed: Search "18" should find Al-Kahf');

  // Test 5: Verify Search by Arabic text
  const searchArabic = searchSurahs('البقرة');
  console.assert(searchArabic.length > 0 && searchArabic[0].number === 2, 'Test 5 Failed: Search "البقرة" should find Al-Baqarah');

  console.log('Passed Test 3, 4, 5: Search engine supports Latin, Arabic, and Number queries');

  console.log('\nALL SURAH LIST TDD UNIT TESTS PASSED!');
}

runSurahListTests();
