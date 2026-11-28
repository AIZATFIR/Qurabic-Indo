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

const maqamSource = getSourceInfo('maqamGloss');
if (!maqamSource.url.includes('aclanthology.org/2026.arabicnlp-main.11') ||
    !maqamSource.description.includes('Glos Inggris') ||
    !maqamSource.descriptionEnglish.includes('English stem glosses')) {
  throw new Error('MAQAM must be attributed and explicitly labeled as an English-only lexical gloss fallback');
}
console.log('✅ Test passed: MAQAM is registered as a sourced English lexical-gloss fallback.');
const maqamTextBasis = getSourceInfo('maqamTextBasis');
if (!maqamTextBasis.url.includes('tanzil.net/docs/Text_License') ||
    !maqamTextBasis.license?.includes('CC BY 3.0')) {
  throw new Error('The source-text basis cited by MAQAM must retain its Tanzil attribution and license link.');
}

// Root glosses from Quran bil-Quran have source-level attribution but no
// Lane page citation; keep that limitation attached to the registered source.
const rootGlossSource = getSourceInfo('quranBilQuran');
if (!rootGlossSource.url.includes('github.com/R3GENESI5/quran-bil-quran') ||
    !rootGlossSource.description.includes('Maqāyīs al-Lugha') ||
    !rootGlossSource.description.includes('tidak memberi rujukan halaman per akar') ||
    !rootGlossSource.description.includes('ditelaah manusia maupun AI') ||
    !rootGlossSource.descriptionEnglish.includes('no page citation per root') ||
    !rootGlossSource.descriptionEnglish.includes('does not document whether summaries were written or reviewed by people or AI')) {
  throw new Error('Quran bil-Quran root glosses must retain their upstream link and disclose missing entry citations and review history');
}
console.log('✅ Test passed: root gloss source and citation limitation are registered.');

console.log('🎉 ALL SOURCE REGISTRY & AUTHENTICITY TESTS PASSED SUCCESSFULLY!');
