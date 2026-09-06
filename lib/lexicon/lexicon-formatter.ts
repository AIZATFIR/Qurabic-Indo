import { buckwalterToArabic } from '../morphology/buckwalter';

const COMMON_ENGLISH_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'is', 'it', 'its', 'of', 'on', 'onto',
  'or', 'the', 'then', 'there', 'this', 'that', 'these', 'those', 'to', 'with', 'without', 'he', 'she',
  'they', 'we', 'you', 'his', 'her', 'their', 'our', 'your', 'said', 'says', 'saying', 'one', 'two',
  'first', 'second', 'third', 'fourth', 'fifth', 'last', 'latter', 'former', 'other', 'others', 'another',
  'some', 'any', 'all', 'many', 'few', 'only', 'more', 'most', 'very', 'also', 'such', 'like', 'accord',
  'according', 'man', 'men', 'woman', 'women', 'thing', 'things', 'place', 'places', 'time', 'times',
  'signifies', 'signifying', 'meaning', 'means', 'syn', 'contr', 'contrary', 'analogy', 'called', 'named',
  'namely', 'being', 'been', 'having', 'which', 'who', 'whom', 'whose', 'where', 'when', 'what', 'how',
  'not', 'nor', 'neither', 'either', 'both', 'between', 'among', 'through', 'about', 'above', 'below',
  'under', 'over', 'before', 'after', 'against', 'upon', 'within', 'without', 'because', 'although',
  'though', 'even', 'strange', 'measure', 'substantive', 'substantives', 'instances', 'fourteen', 'formed',
  'former', 'form', 'forms', 'putting', 'second', 'vowel', 'vowels', 'case', 'state', 'mind', 'intellect',
  'body', 'soul', 'night', 'day', 'affair', 'true', 'truth', 'false', 'falsehood', 'lie', 'lying', 'lied',
  'liar', 'liars', 'untruth', 'untruths', 'sayer', 'utterer', 'proverb', 'habitual', 'criminal', 'virtue',
  'virtuous', 'weak', 'silent', 'feigning', 'asleep', 'retreat', 'retreated', 'adversary', 'charge',
  'charged', 'cowardly', 'opinion', 'falsified', 'aloud', 'voice', 'voce', 'ex', 'exs', 'see', 'also',
  'pass', 'act', 'part', 'inf', 'aor', 'fem', 'masc', 'pl', 'sing', 'dial', 'kur', 'art', 'ibn', 'al',
  'el', 'abu', 'aboo', 'es', 'ed', 'en', 'er', 'et', 'ez', 'seed', 'seed', 'kz', 'mf', 'ta', 'msb'
]);

function isBuckwalterWord(token: string): boolean {
  const clean = token.replace(/^[^\w*~^`_{}]+|[^\w*~^`_{}]+$/g, '');
  if (!clean || clean.length < 2) return false;

  const lower = clean.toLowerCase();
  if (COMMON_ENGLISH_WORDS.has(lower)) return false;

  // Never match pure English hyphenated names (e.g. Ibn-Es-Seed)
  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.every((p) => COMMON_ENGLISH_WORDS.has(p.toLowerCase()))) return false;
  }

  // 1. Unmistakable Buckwalter-specific characters (never occur in English)
  if (/[*~^`_{}]/.test(clean)) return true;

  // 2. Arabic consonant capitals in Buckwalter: E (ʿayn), D (ḍad), H (ḥa), S (ṣad), T (ṭa), Z (ẓa)
  if (/[EDHSTZ]/.test(clean)) return true;

  // 3. Case endings in Buckwalter: tanwin N (ٌ), F (ً), K (ٍ) preceded by lower letter
  if (/[a-z][NFK]$/.test(clean)) return true;

  // 4. Ta marbutah: ap, apN, apF, apK
  if (/ap[NFK]?$/.test(clean)) return true;

  // 5. Alif denoted by internal capital 'A' (e.g. ki*aAb, SaAdiq, kaA*ib)
  if (/[a-z]A[a-z]/.test(clean)) return true;

  // 6. Definite article with capitalized letter: e.g. AlEayoru, Alka*iba
  if (/^Al[A-Z]/.test(clean)) return true;

  // 7. Alif Maqsura 'Y' at end of word: e.g. ku*obaY
  if (/[a-z]Y$/.test(clean)) return true;

  return false;
}

/**
 * Transforms raw 19th-century Perseus Lane's Lexicon excerpt into clean,
 * readable typography with converted Arabic Unicode and expanded classical citations.
 */
export function formatLexiconSenseText(rawText: string): string {
  if (!rawText) return '';
  let text = rawText.trim();

  // Strip initial punctuation noise
  text = text.replace(/^[,;:\s.]+/, '');

  // Expand standard lexicographical abbreviations
  text = text.replace(/\baor\.\s*,?\s*inf\.\s*n\.\s*/gi, "Mudhari' & Masdar: ");
  text = text.replace(/\binf\.\s*n\.\s*/gi, 'Masdar: ');
  text = text.replace(/\baor\.\s*/gi, "Mudhari': ");
  text = text.replace(/\(assumed tropical:\)/gi, '(Makna Kiasan):');
  text = text.replace(/\(tropical:\)/gi, '(Makna Majas):');
  text = text.replace(/\baccord\.\s*to\s*Kz\./gi, 'menurut Al-Kazzaz');
  text = text.replace(/\b\(S,\s*K\b/g, '(Aṣ-Ṣiḥāḥ & Al-Qāmūs');
  text = text.replace(/\b\(S\b/g, '(Aṣ-Ṣiḥāḥ');
  text = text.replace(/\b\(K\b/g, '(Al-Qāmūs Al-Muḥīṭ');
  text = text.replace(/\b\(L,\s*K\b/g, '(Lisān al-ʿArab & Al-Qāmūs');
  text = text.replace(/\b\(L\b/g, '(Lisān al-ʿArab');
  text = text.replace(/\b\(TA\b/g, '(Tāj al-ʿArūs');
  text = text.replace(/\b\(Msb\b/g, '(Al-Miṣbāḥ al-Munīr)');

  // Tokenize preserving whitespace and delimiters
  const tokens = text.split(/(\s+|[(),;:\[\]"“”]+)/);
  const transformed = tokens.map((token) => {
    if (isBuckwalterWord(token)) {
      const clean = token.replace(/^[^\w*~^`_{}]+|[^\w*~^`_{}]+$/g, '');
      const ar = buckwalterToArabic(clean);
      if (ar && /[\u0600-\u06FF]/.test(ar)) {
        return token.replace(clean, ar);
      }
    }
    return token;
  });

  return transformed
    .join('')
    .replace(/\s+,/g, ',')
    .replace(/\s+;/g, ';')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
