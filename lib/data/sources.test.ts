import { SOURCES_REGISTRY, getSourceInfo } from './sources';

console.log('🧪 Running Qurabic Data Authenticity & Source Registry Unit Tests...');

// Test 1: Verify all 5 core content domains are registered with real authoritative sources
const domains = ['quranText', 'translation', 'morphology', 'lexicon', 'recitation'] as const;

for (const d of domains) {
  const info = getSourceInfo(d);
  if (!info || !info.name || !info.authority || !info.url) {
    throw new Error(`Source domain "${d}" is missing required metadata (name, authority, url)`);
  }
  console.log(`✅ Test passed for domain [${d}]: ${info.name} (${info.authority})`);
}

// Test 2: Verify Kemenag RI is explicitly registered for Indonesian translation
const translationSource = getSourceInfo('translation');
if (!translationSource.authority.includes('Kementerian Agama') && !translationSource.authority.includes('Kemenag')) {
  throw new Error(`Expected Kemenag RI in translation authority but got ${translationSource.authority}`);
}
console.log('✅ Test passed: Indonesian translation is correctly attributed to Kemenag RI');

// Test 3: Verify Quranic Arabic Corpus (Leeds Univ) is registered for Morphology
const morphSource = getSourceInfo('morphology');
if (!morphSource.authority.includes('Leeds') && !morphSource.name.includes('Quranic Arabic Corpus')) {
  throw new Error(`Expected Leeds / Quranic Corpus in morphology source but got ${morphSource.name}`);
}
console.log('✅ Test passed: Morphology is correctly attributed to Quranic Arabic Corpus (University of Leeds)');

console.log('🎉 ALL SOURCE REGISTRY & AUTHENTICITY TESTS PASSED SUCCESSFULLY!');
