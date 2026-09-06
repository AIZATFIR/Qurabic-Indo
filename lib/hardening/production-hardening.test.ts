import { getWordStudy } from '../morphology/word-study-service';
import { getCanonicalRootDetail } from '../morphology/canonical-service';
import { SURAH_LIST } from '../data/surah-list';
import { ROOT_DATABASE } from '../data/roots';
import { GET as wordDetailGet } from '../../app/api/word-detail/route';
import { generateMetadata as generateKataMetadata } from '../../app/kata/[slug]/page';
import { generateMetadata as generateAkarMetadata } from '../../app/akar/[slug]/page';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    failedTests++;
    console.error(`❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ ${message}`);
}

async function runHardeningTests() {
  console.log('====================================================');
  console.log('🛡️  PRD 3 — PRODUCTION HARDENING & INVARIANT TESTS');
  console.log('====================================================\n');

  // 1. Core Quran & QAC Data Invariants
  console.log('📋 1. Core Quran & QAC Invariants:');
  assert(SURAH_LIST.length === 114, 'Total Surah count must equal exactly 114');
  
  const fatihah = SURAH_LIST.find((s) => s.number === 1);
  assert(fatihah !== undefined && fatihah.ayahsCount === 7, 'Surah Al-Fatihah has 7 verses');

  const baqarah = SURAH_LIST.find((s) => s.number === 2);
  assert(baqarah !== undefined && baqarah.ayahsCount === 286, 'Surah Al-Baqarah has 286 verses');

  const nas = SURAH_LIST.find((s) => s.number === 114);
  assert(nas !== undefined && nas.ayahsCount === 6, 'Surah An-Nas has 6 verses');

  assert(ROOT_DATABASE.length >= 1600, `Root database has comprehensive coverage (${ROOT_DATABASE.length} roots)`);

  // 2. Classical Lexicon & Evidence Grounding Invariants
  console.log('\n📚 2. Classical Lexicon & Grounding Invariants:');
  const sbrRoot = getCanonicalRootDetail('sbr');
  assert(sbrRoot !== null, 'Root "sbr" (صبر) resolves canonically');
  assert(sbrRoot?.rootArabic === 'ص ب ر' || sbrRoot?.rootArabicJoined === 'صبر', 'Root "sbr" Arabic rendering is "ص ب ر"');
  assert(sbrRoot?.lexicon?.sourceCitation?.includes("Lane") === true, 'Root "sbr" includes Lane\'s Lexicon source attribution');

  const khwfRoot = getCanonicalRootDetail('x-w-f') || getCanonicalRootDetail('xwf');
  assert(khwfRoot !== null, 'Root "x-w-f" (خ و ف) resolves canonically');
  assert(khwfRoot?.rootArabic === 'خ و ف' || khwfRoot?.rootArabicJoined === 'خوف', 'Root "x-w-f" Arabic rendering is "خ و ف"');

  // Word Study ViewModel Invariant
  const bismiStudy = getWordStudy('بِسْمِ', { surahNumber: 1, ayahNumber: 1, wordIndex: 1 });
  assert(bismiStudy !== null, 'Word study resolves for "بِسْمِ" (1:1:1)');
  assert(bismiStudy?.morphology.pos !== undefined, 'QAC POS facts populated');
  assert(bismiStudy?.provenance.some(p => p.name.includes('Quranic Arabic Corpus')) === true, 'Morphology provenance explicitly attributes QAC');

  // 3. API Route Security, Bounded Input & Caching
  console.log('\n🔒 3. API Route Security & Error Isolation:');
  
  // Test valid request
  const reqValid = new Request('http://localhost:3000/api/word-detail?q=%D8%B5%D9%8E%D8%A8%D9%8E%D8%B1%D9%8F%D9%88%D8%A7&surah=2&ayah=153&wordIndex=3');
  const resValid = await wordDetailGet(reqValid as any);
  assert(resValid.status === 200, 'API returns 200 for valid Quranic word query');
  assert(resValid.headers.get('Cache-Control')?.includes('s-maxage=86400') === true, 'API returns public edge Cache-Control header');
  const bodyValid = await resValid.json();
  assert(bodyValid.success === true && bodyValid.data !== null, 'API body returns success=true and structured data');

  // Test oversized query attack protection (>200 chars)
  const hugePayload = 'A'.repeat(500);
  const reqOversized = new Request(`http://localhost:3000/api/word-detail?q=${hugePayload}`);
  const resOversized = await wordDetailGet(reqOversized as any);
  assert(resOversized.status === 400, 'API rejects oversized query with HTTP 400 Bad Request');
  const bodyOversized = await resOversized.json();
  assert(bodyOversized.error.includes('200 karakter'), 'API explains max length violation without stack trace');

  // Test missing query
  const reqEmpty = new Request('http://localhost:3000/api/word-detail');
  const resEmpty = await wordDetailGet(reqEmpty as any);
  assert(resEmpty.status === 400, 'API rejects missing query with HTTP 400');

  // Test non-existent word (graceful 404)
  const reqNotFound = new Request('http://localhost:3000/api/word-detail?q=nonexistentwordxyz12345');
  const resNotFound = await wordDetailGet(reqNotFound as any);
  assert(resNotFound.status === 404, 'API returns 404 for non-existent word gracefully');

  // 4. Dynamic SEO Metadata Generation
  console.log('\n🔍 4. SEO & Dynamic Metadata Generation:');
  
  const kataMeta = await generateKataMetadata({
    params: { slug: encodeURIComponent('صَبَرُوا') },
    searchParams: { surah: '2', ayah: '153', wordIndex: '3' },
  });
  assert(typeof kataMeta.title === 'string' && kataMeta.title.includes('صَبَرُوا'), 'Kata metadata title contains Arabic word');
  assert(typeof kataMeta.description === 'string' && kataMeta.description.length > 20, 'Kata metadata description is comprehensive');

  const akarMeta = await generateAkarMetadata({
    params: { slug: 'sbr' },
  });
  assert(typeof akarMeta.title === 'string' && akarMeta.title.includes('ص ب ر'), 'Akar metadata title contains Arabic root');
  assert(typeof akarMeta.description === 'string' && akarMeta.description.length > 20, 'Akar metadata description is rich and informative');

  // Summary
  console.log('\n====================================================');
  console.log(`🎉 ALL HARDENING INVARIANTS PASSED!`);
  console.log(`   Passed: ${passedTests} / ${totalTests} (100.0%)`);
  console.log('====================================================\n');
}

runHardeningTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
