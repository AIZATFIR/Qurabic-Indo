/**
 * Qurabic Lexicon Integrity & Golden Invariant Test Suite
 * 
 * Implements PRD Section 40 & 41:
 * - Test 1: Every lexical summary has basisSenseIds.
 * - Test 2: Every sense points to existing entry with valid citation.
 * - Test 3: Every entry points to SourceRegistry.
 * - Test 4: No raw placeholder snippet is displayed as verified definition.
 * - Test 5: QAC morphology records are never overwritten (xwf invariant).
 * - Test 6: Golden word tests (صبر, رحم, حزب, بارك, عند) pass with exact data.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getWordStudy } from '../morphology/word-study-service';
import { SOURCES_REGISTRY } from '../data/sources';
import { getQACAuthoritativeIndex } from '../morphology/qac-parser';

describe('PRD Lexicon Integrity & Quality Verification', () => {

  // Test 1: Every lexical summary has basisSenseIds
  it('Test 1: Every lexical summary must possess non-empty basisSenseIds', () => {
    const testWords = ['صَبْرًا', 'الرَّحْمَـٰنِ', 'رَيْبَ', 'عِندِنَا', 'قَوْلٌ'];
    for (const w of testWords) {
      const study = getWordStudy(w);
      if (study.lexical.summary) {
        assert.ok(
          study.lexical.summary.basisSenseIds.length > 0,
          `Word ${w} summary must have basisSenseIds`
        );
        assert.strictEqual(study.lexical.summary.status, 'source-derived');
      }
    }
  });

  // Test 2: Every sense has valid citation (Volume, Page, Source)
  it('Test 2: Every lexical sense contains valid Volume and Page citation', () => {
    const study = getWordStudy('رَيْبَ');
    assert.strictEqual(study.lexical.status, 'verified');
    assert.ok(study.lexical.senses.length > 0);

    for (const sense of study.lexical.senses) {
      assert.ok(sense.citation.volume > 0, 'Volume must be > 0');
      assert.ok(sense.citation.page > 0, 'Page must be > 0');
      assert.ok(sense.text.length > 5, 'Sense text must be substantial');
    }
  });

  // Test 3: Provenance connects to registered SourceRegistry
  it('Test 3: Every WordStudy references valid SourceRegistry records', () => {
    const study = getWordStudy('صَبْرًا');
    assert.ok(study.provenance.length >= 3, 'Must contain at least Quran text, QAC, and translation');
    
    const sourceIds = study.provenance.map(s => s.id);
    assert.ok(sourceIds.includes(SOURCES_REGISTRY.quranText.id));
    assert.ok(sourceIds.includes(SOURCES_REGISTRY.morphology.id));
    assert.ok(sourceIds.includes(SOURCES_REGISTRY.translation.id));
    assert.ok(sourceIds.includes(SOURCES_REGISTRY.laneLexicon.id));
  });

  // Test 4: No raw snippet placeholder displayed as primary definition
  it('Test 4: Primary definitions contain clean lexical meaning, not raw placeholder', () => {
    const study = getWordStudy('رَيْبَ');
    assert.ok(!study.primaryMeaning.text.includes('see above'));
    assert.ok(!study.primaryMeaning.text.includes('undefined'));
    assert.ok(study.primaryMeaning.text.length > 3);
  });

  // Test 5: QAC Golden xwf invariant remains 100% untouched
  it('Test 5: QAC morphology records for root xwf (خ و ف) are strictly preserved', () => {
    const qacIndex = getQACAuthoritativeIndex();
    const xwfRecords = qacIndex.recordsByRoot.get('xwf');
    assert.ok(xwfRecords, 'xwf records must exist');
    assert.strictEqual(xwfRecords.length, 124, 'xwf must have exactly 124 segments');

    const uniqueAyahs = new Set(xwfRecords.map(r => `${r.surah}:${r.ayah}`));
    assert.strictEqual(uniqueAyahs.size, 112, 'xwf must appear in exactly 112 unique ayahs');
  });

  // Test 6: Golden Word Fixtures (صبر, رحم, حزب, بارك, عند)
  describe('Test 6: Golden Word Benchmark Fixtures (PRD Section 41)', () => {
    
    it('Fixture 1: صَبْرًا / ص ب ر', () => {
      const study = getWordStudy('صَبْرًا');
      assert.strictEqual(study.lexical.rootArabic, 'ص ب ر');
      assert.strictEqual(study.morphology.pos, 'Isim');
      assert.ok(study.occurrences.totalCount > 90);
      assert.ok(study.wordFamily.length > 0);
      assert.strictEqual(study.lexical.status, 'verified');
    });

    it('Fixture 2: الرَّحْمَـٰنِ / ر ح م', () => {
      const study = getWordStudy('الرَّحْمَـٰنِ');
      assert.strictEqual(study.lexical.rootArabic, 'ر ح م');
      assert.strictEqual(study.morphology.pos, 'Isim');
      assert.ok(study.occurrences.totalCount > 300);
      assert.strictEqual(study.lexical.status, 'verified');
    });

    it('Fixture 3: حِزْبٌ / ح ز ب', () => {
      const study = getWordStudy('حِزْبٌ');
      assert.strictEqual(study.lexical.rootArabic, 'ح ز ب');
      assert.strictEqual(study.morphology.pos, 'Isim');
      assert.ok(study.occurrences.totalCount >= 18);
      assert.strictEqual(study.lexical.status, 'verified');
    });

    it('Fixture 4: بَارَكَ / ب ر ك', () => {
      const study = getWordStudy('بَارَكَ');
      assert.strictEqual(study.lexical.rootArabic, 'ب ر ك');
      assert.strictEqual(study.morphology.pos, "Fi'il");
      assert.ok(study.occurrences.totalCount >= 20);
      assert.strictEqual(study.lexical.status, 'verified');
    });

    it('Fixture 5: عِندِنَا / عِندَ (Preposition with exact lemma)', () => {
      const study = getWordStudy('عِندِنَا');
      assert.strictEqual(study.identity.cleanArabic, 'عندنا');
      assert.strictEqual(study.lexical.lemma, 'Eind');
      assert.strictEqual(study.lexical.status, 'verified');
      assert.strictEqual(study.lexical.volume, 5);
      assert.strictEqual(study.lexical.page, 2171);
      assert.strictEqual(study.lexical.isRootEntry, false, 'Preposition must be exact lemma, not root fallback');
    });

  });

});
