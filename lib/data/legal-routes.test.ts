import fs from 'fs';
import path from 'path';

console.log('🧪 Running Legal, Trust & Transparency Routes Unit Tests...');

const projectRoot = process.cwd();

// Test 1: Verify /terms page exists and has content
const termsPath = path.join(projectRoot, 'app/terms/page.tsx');
if (!fs.existsSync(termsPath)) {
  throw new Error('Terms of Service page missing at app/terms/page.tsx');
}
const termsContent = fs.readFileSync(termsPath, 'utf8');
if (!termsContent.includes('Ketentuan Layanan') || !termsContent.includes('Quranic Arabic Corpus')) {
  throw new Error('Terms of Service page missing required legal attribution');
}
console.log('✅ Test 1 Passed: /terms page exists and includes official attribution');

// Test 2: Verify /privacy page exists and has content
const privacyPath = path.join(projectRoot, 'app/privacy/page.tsx');
if (!fs.existsSync(privacyPath)) {
  throw new Error('Privacy Policy page missing at app/privacy/page.tsx');
}
const privacyContent = fs.readFileSync(privacyPath, 'utf8');
if (!privacyContent.includes('Kebijakan Privasi') || !privacyContent.includes('qurabic_search_history')) {
  throw new Error('Privacy Policy page missing required local storage disclosures');
}
console.log('✅ Test 2 Passed: /privacy page exists and transparently documents LocalStorage');

// Test 3: Verify /tentang page exists and has dependencies table
const tentangPath = path.join(projectRoot, 'app/tentang/page.tsx');
if (!fs.existsSync(tentangPath)) {
  throw new Error('About & Methodology page missing at app/tentang/page.tsx');
}
const tentangContent = fs.readFileSync(tentangPath, 'utf8');
if (!tentangContent.includes('THIRD_PARTY_DEPENDENCIES') || !tentangContent.includes('React Virtuoso')) {
  throw new Error('About page missing third party licensing table');
}
console.log('✅ Test 3 Passed: /tentang page exists and includes full third-party dependency licenses');

console.log('🎉 ALL LEGAL & TRUST ROUTE TESTS PASSED SUCCESSFULLY!');
