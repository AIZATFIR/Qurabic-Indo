import assert from 'node:assert/strict';
import { formatLexiconSenseText, parseLexiconSenseTokens } from './lexicon-formatter';
const source = 'Hence, He removed himself. This is an English source. aor. inf. n. (tropical:) soap';
assert.equal(formatLexiconSenseText(source), source, 'Source English must not be guessed as Buckwalter or translated silently');
assert.equal(parseLexiconSenseTokens(source).map(t => t.content).join(''), source);
assert.deepEqual(parseLexiconSenseTokens('He said بَرَاءَةٌ in the Kur.'), [
  { type: 'text', content: 'He said ' }, { type: 'arabic', content: 'بَرَاءَةٌ' }, { type: 'text', content: ' in the Kur.' },
]);
console.log('Lane source text preserved');
