import fs from 'fs';
import path from 'path';

console.log('Checking legal and source transparency routes...');

const projectRoot = process.cwd();

// Test 1: Verify the bilingual terms page and its source boundaries
const termsPath = path.join(projectRoot, 'app/terms/page.tsx');
if (!fs.existsSync(termsPath)) {
  throw new Error('Terms page missing at app/terms/page.tsx');
}
const termsPage = fs.readFileSync(termsPath, 'utf8');
const termsContent = fs.readFileSync(path.join(projectRoot, 'app/terms/TermsContent.tsx'), 'utf8');
if (!termsPage.includes('TermsContent')
  || !termsContent.includes('Ketentuan penggunaan')
  || !termsContent.includes('Terms of use')
  || !termsContent.includes('Quranic Arabic Corpus')
  || !termsContent.includes('Quran Foundation · Developer Terms')
  || !termsContent.includes('not a claim that Qurabic independently verified every record')) {
  throw new Error('Terms page is missing bilingual copy or accurate source boundaries');
}
console.log('Passed: /terms includes bilingual copy and named source boundaries');

// Test 2: Verify /privacy page exists and has content
const privacyPath = path.join(projectRoot, 'app/privacy/page.tsx');
if (!fs.existsSync(privacyPath)) {
  throw new Error('Privacy Policy page missing at app/privacy/page.tsx');
}
const privacyPage = fs.readFileSync(privacyPath, 'utf8');
const privacyContent = fs.readFileSync(path.join(projectRoot, 'app/privacy/PrivacyPolicyContent.tsx'), 'utf8');
if (!privacyPage.includes('PrivacyPolicyContent')
  || !privacyContent.includes('Informasi yang disimpan di perangkat')
  || !privacyContent.includes('Information stored on your device')
  || !privacyContent.includes('tidak disinkronkan ke akun Qurabic')) {
  throw new Error('Privacy Policy is missing bilingual local-storage disclosures');
}
console.log('Passed: /privacy documents local storage in Indonesian and English');

// Test 3: Verify /tentang page exists and has dependencies table
const tentangPath = path.join(projectRoot, 'app/tentang/page.tsx');
if (!fs.existsSync(tentangPath)) {
  throw new Error('About & Methodology page missing at app/tentang/page.tsx');
}
const tentangContent = fs.readFileSync(tentangPath, 'utf8');
if (!tentangContent.includes('THIRD_PARTY_DEPENDENCIES') || !tentangContent.includes('React Virtuoso')) {
  throw new Error('About page missing software attribution list');
}
console.log('Passed: /tentang includes software source acknowledgements');

console.log('Legal and source transparency checks passed.');
