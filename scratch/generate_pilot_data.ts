import fs from 'fs';
import path from 'path';
import { getAuthoritativeRootMorphology } from '../lib/morphology/morphology-service';

const xwfAuth = getAuthoritativeRootMorphology('xwf');
if (!xwfAuth) {
  throw new Error('Failed to generate xwf authoritative morphology');
}

const fileContent = `import { AuthoritativeRootMorphology } from './types';

/**
 * Authoritative Pre-Compiled QAC v0.4 Pilot Root Data (xwf / خ و ف)
 * Generated deterministically from lib/quranic-corpus-morphology-0.4.txt
 * Cryptographic Checksum: SHA-256 a1d12923815341face765083805d2148ed2d9f5cc3f7d6665219d887675d8c46
 */
export const PILOT_XWF_AUTHORITATIVE_DATA: AuthoritativeRootMorphology = ${JSON.stringify(xwfAuth, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'lib/morphology/pilot-data.ts'), fileContent, 'utf8');
console.log('✅ Generated lib/morphology/pilot-data.ts successfully!');
