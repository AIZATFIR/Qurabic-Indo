import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';
import { getQACAuthoritativeIndex } from './qac-parser';

describe('PRD 02 — Stage 1: Corpus Inventory & Loss Audit', () => {
  it('Inventory: QAC raw file matches parsed in-memory index counts exactly', () => {
    const qacPath = path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt');
    assert.ok(fs.existsSync(qacPath), 'QAC morphology raw file must exist');

    const content = fs.readFileSync(qacPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('LOCATION'));

    const rawTotalRecords = lines.length;
    assert.strictEqual(rawTotalRecords, 128219, 'Raw QAC file must contain exactly 128,219 records');

    const index = getQACAuthoritativeIndex();
    assert.strictEqual(index.totalRecords, 128219, 'Parsed index totalRecords must be 128,219');
    assert.strictEqual(index.rootBearingRecordsCount, 49968, 'Root bearing records must be exactly 49,968');
    assert.strictEqual(index.uniqueRootsCount, 1642, 'Unique roots count must be exactly 1,642');
    assert.strictEqual(index.uniqueLemmasCount, 4832, 'Unique lemmas count must be exactly 4,832');
  });

  it('Loss Audit: Sample 100 records and verify zero field loss across parser pipeline', () => {
    const qacPath = path.join(process.cwd(), 'lib/quranic-corpus-morphology-0.4.txt');
    const content = fs.readFileSync(qacPath, 'utf8');
    const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('LOCATION'));

    const index = getQACAuthoritativeIndex();

    // Pick 100 deterministic sample indices spanning the entire Quran
    const step = Math.floor(lines.length / 100);
    for (let i = 0; i < 100; i++) {
      const line = lines[i * step].trim();
      const parts = line.split('\t');
      const locRaw = parts[0].replace(/[()]/g, '');
      const [sStr, aStr, wStr, segStr] = locRaw.split(':');
      const locationKey = `${parseInt(sStr, 10)}:${parseInt(aStr, 10)}:${parseInt(wStr, 10)}:${parseInt(segStr, 10)}`;

      const indexedRecord = index.recordsByLocation.get(locationKey);
      assert.ok(indexedRecord, `Record at ${locationKey} must exist in index`);

      // Verify form and tag
      assert.strictEqual(indexedRecord.form, parts[1], `Form mismatch at ${locationKey}`);
      assert.strictEqual(indexedRecord.tag, parts[2], `Tag mismatch at ${locationKey}`);

      // Verify root extraction if present
      const rootMatch = parts[3].match(/ROOT:([^|]+)/);
      if (rootMatch) {
        assert.strictEqual(indexedRecord.root, rootMatch[1], `Root mismatch at ${locationKey}`);
        assert.ok(indexedRecord.rootArabic, `Arabic root must be generated at ${locationKey}`);
      }

      // Verify lemma extraction if present
      const lemMatch = parts[3].match(/LEM:([^|]+)/);
      if (lemMatch) {
        assert.strictEqual(indexedRecord.lemma, lemMatch[1], `Lemma mismatch at ${locationKey}`);
        assert.ok(indexedRecord.lemmaArabic, `Arabic lemma must be generated at ${locationKey}`);
      }
    }
  });

  it('Index Lookup: Word location records are grouped without collision or data drop', () => {
    const index = getQACAuthoritativeIndex();
    
    // Al-Fatihah 1:1:1 (bi [P] + somi [N])
    const bismillahWord = index.recordsByWordLocation.get('1:1:1');
    assert.ok(bismillahWord, 'Word 1:1:1 must exist');
    assert.strictEqual(bismillahWord.length, 2, 'Word 1:1:1 must have 2 segments');
    assert.strictEqual(bismillahWord[0].tag, 'P');
    assert.strictEqual(bismillahWord[1].tag, 'N');
    assert.strictEqual(bismillahWord[1].root, 'smw');

    // Al-Fatihah 1:1:3 (Al-Rahman -> Al [DET] + raHoma`n [ADJ])
    const rahmanWord = index.recordsByWordLocation.get('1:1:3');
    assert.ok(rahmanWord, 'Word 1:1:3 must exist');
    assert.strictEqual(rahmanWord.length, 2, 'Word 1:1:3 must have 2 segments');
    assert.strictEqual(rahmanWord[1].root, 'rHm');
    assert.strictEqual(rahmanWord[1].lemma, 'r~aHoma`n');
  });
});
