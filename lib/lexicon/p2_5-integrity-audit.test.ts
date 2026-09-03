import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCanonicalWordDetail, getCanonicalRootDetail } from '../morphology/canonical-service';
import { getLaneRootRecord, getLaneEntryForLemma } from './lane-loader';
import manifestData from './data/manifest.json';
import { getQACAuthoritativeIndex } from '../morphology/qac-parser';

describe('P2.5 — Qurabic Integrity & Provenance Forensic Audit', () => {

  it('Audit 1: Token نَسْتَعِينُ (1:5:4) exact coordinate resolution and authentic Lane Form X linkage', () => {
    // 1. Resolve via exact coordinate context
    const wordDetail = getCanonicalWordDetail('نَسْتَعِينُ', {
      surahNumber: 1,
      ayahNumber: 5,
      wordIndex: 4
    });

    // Verify QAC morphology invariants
    assert.strictEqual(wordDetail.identity.coordinate, '1:5:4');
    assert.strictEqual(wordDetail.morphology.pos, "Fi'il");
    assert.strictEqual(wordDetail.morphology.verbForm, 'Form X');
    assert.strictEqual(wordDetail.lexical.root, 'Ewn');
    assert.strictEqual(wordDetail.lexical.rootArabic, 'ع و ن');

    // Verify Lane Lexicon linkage
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.rootBw, 'Ewn');
    assert.strictEqual(wordDetail.lexicon.volume, 5);
    assert.strictEqual(wordDetail.lexicon.matchedForm, 'Form 10');
    assert.ok(wordDetail.lexicon.senses.length > 0);

    // Verify sense citation authenticity: entry 'astEAn' on page 2203 of Book I, Part 5
    const primarySense = wordDetail.lexicon.senses[0];
    assert.strictEqual(primarySense.citation.volume, 5);
    assert.strictEqual(primarySense.citation.page, 2203);
    assert.strictEqual(primarySense.citation.itype, '10');
    assert.ok(primarySense.text.toLowerCase().includes('aid') || primarySense.text.toLowerCase().includes('help'));
  });

  it('Audit 2: Root ص ب ر (Sbr) exact coordinate aggregation and Lane entry distinction without duplicates', () => {
    // 1. Resolve Root Detail for Sbr
    const rootDetail = getCanonicalRootDetail('Sbr');
    assert.ok(rootDetail);

    // Verify exact coordinate aggregation
    assert.strictEqual(rootDetail.statistics.totalOccurrences, 103, 'Total occurrences for Sbr must be exactly 103');
    assert.strictEqual(rootDetail.statistics.uniqueAyahs, 93, 'Unique ayahs for Sbr must be exactly 93');
    assert.strictEqual(rootDetail.statistics.uniqueSurahs, 45, 'Unique surahs for Sbr must be exactly 45');
    assert.strictEqual(rootDetail.statistics.verbsCount, 62, 'Verbs count must be 62');
    assert.strictEqual(rootDetail.statistics.nounsCount, 41, 'Nouns count must be 41');

    // Verify occurrences match QAC authoritative index Map exactly
    const qacIndex = getQACAuthoritativeIndex();
    const qacRecordsForSbr = qacIndex.recordsByRoot.get('Sbr') || [];
    assert.strictEqual(qacRecordsForSbr.length, 103);

    // Verify Lane Lexicon entries
    assert.ok(rootDetail.lexicon);
    assert.strictEqual(rootDetail.lexicon.rootArabic, 'صبر');
    assert.strictEqual(rootDetail.lexicon.volume, 4);
    assert.strictEqual(rootDetail.lexicon.page, 1640);

    // Check entry IDs for duplicate uniqueness
    const entryIds = rootDetail.lexicon.entries.map(e => e.entryId);
    const uniqueEntryIds = new Set(entryIds);
    assert.strictEqual(entryIds.length, uniqueEntryIds.size, 'All Lane entries for root Sbr must have unique entry IDs with 0 duplicates');
    assert.strictEqual(rootDetail.lexicon.entries.length, 42, 'Root Sbr must contain 42 distinct Lane entries');
  });

  it('Audit 3: Case-Sensitivity & Phonetic Integrity (Sbr !== sbr)', () => {
    // Sbr (ص ب ر) vs sbr (س ب ر)
    const rootSbrCapital = getLaneRootRecord('Sbr'); // ص ب ر
    const rootSbrLower = getLaneRootRecord('sbr');   // س ب ر

    assert.ok(rootSbrCapital, 'Sbr (ص ب ر) must exist in Lane index');
    assert.ok(rootSbrLower, 'sbr (س ب ر) must exist in Lane index');

    // Verify distinct Arabic roots and page citations
    assert.strictEqual(rootSbrCapital.rootArabic, 'صبر');
    assert.strictEqual(rootSbrLower.rootArabic, 'سبر');
    assert.strictEqual(rootSbrCapital.volume, 4);
    assert.strictEqual(rootSbrCapital.page, 1640);
    assert.strictEqual(rootSbrLower.volume, 4);
    assert.strictEqual(rootSbrLower.page, 1292);

    // Ensure no collisions between upper and lower case Buckwalter
    assert.notStrictEqual(rootSbrCapital.page, rootSbrLower.page);
  });

  it('Audit 4: Explicit Morphological Key Normalization (Weak & Geminate Roots)', () => {
    // 1. Geminate ungeminated mapping: Dmm (ض م م) -> Dm (ضم)
    const dmmRecord = getLaneRootRecord('Dmm');
    assert.ok(dmmRecord, 'Geminate Dmm must normalize to Dm in Lane index');
    assert.strictEqual(dmmRecord.rootArabic, 'ضم');
    assert.strictEqual(dmmRecord.volume, 5);
    assert.strictEqual(dmmRecord.page, 1799);

    // 2. Weak letter Alif Maqsura mapping: hdy (ه د ي) -> hdY (هدى)
    const hdyRecord = getLaneRootRecord('hdy');
    assert.ok(hdyRecord, 'Weak root hdy must normalize to hdY in Lane index');
    assert.strictEqual(hdyRecord.rootArabic, 'هدى');
    assert.strictEqual(hdyRecord.volume, 8);
    assert.strictEqual(hdyRecord.page, 3042);

    // 3. Weak letter wqy (و ق ي) -> wqY (وقى)
    const wqyRecord = getLaneRootRecord('wqy');
    assert.ok(wqyRecord, 'Weak root wqy must normalize to wqY in Lane index');
    assert.strictEqual(wqyRecord.rootArabic, 'وقى');
    assert.strictEqual(wqyRecord.volume, 8);
    assert.strictEqual(wqyRecord.page, 3058);
  });

  it('Audit 5: Particle Guardrail (فَلَمَّآ & وَعَنِ have ZERO fake roots and ZERO fake Lane entries)', () => {
    // 1. Particle فَلَمَّآ (12:80:1)
    const particleFalam = getCanonicalWordDetail('فَلَمَّآ', {
      surahNumber: 12,
      ayahNumber: 80,
      wordIndex: 1
    });
    assert.strictEqual(particleFalam.morphology.pos, 'Harf');
    assert.strictEqual(particleFalam.morphology.isParticle, true);
    assert.strictEqual(particleFalam.lexical.root, undefined);
    assert.strictEqual(particleFalam.lexical.rootArabic, undefined);
    assert.ok(particleFalam.lexicon);
    assert.strictEqual(particleFalam.lexicon.hasLexicalData, false);
    assert.strictEqual(particleFalam.lexicon.senses.length, 0);

    // 2. Particle وَعَنِ
    const particleWaAn = getCanonicalWordDetail('وَعَنِ');
    assert.strictEqual(particleWaAn.morphology.pos, 'Harf');
    assert.strictEqual(particleWaAn.morphology.isParticle, true);
    assert.strictEqual(particleWaAn.lexical.root, undefined);
    assert.ok(particleWaAn.lexicon);
    assert.strictEqual(particleWaAn.lexicon.hasLexicalData, false);
  });

  it('Audit 6: Regression against historical bugs (وَيَعْفُوا۟, حَيَّوْكَ, فَلَمَّآ vs ل و م)', () => {
    // 1. وَيَعْفُوا۟: Root Efw (ع ف و)
    const detailYafu = getCanonicalWordDetail('وَيَعْفُوا۟');
    assert.strictEqual(detailYafu.lexical.root, 'Efw');
    assert.strictEqual(detailYafu.lexical.rootArabic, 'ع ف و');
    assert.ok(detailYafu.lexicon?.hasLexicalData);

    // 2. حَيَّوْكَ: Root Hyy (ح ي ي), not mismatched to q-w-l
    const detailHayyawka = getCanonicalWordDetail('حَيَّوْكَ');
    assert.strictEqual(detailHayyawka.lexical.root, 'Hyy');
    assert.strictEqual(detailHayyawka.lexical.rootArabic, 'ح ي ي');

    // 3. Root l-w-m (ل و م) contains 0 occurrences of particle فَلَمَّآ
    const detailLwm = getCanonicalRootDetail('lwm');
    if (detailLwm) {
      assert.ok(!detailLwm.occurrences.some(o => o.verseArabic.includes('فَلَمَّآ') && o.surahNumber === 12 && o.ayahNumber === 80));
    }
  });

  it('Audit 7: Honest Empty State for Unindexed Roots (Zero AI hallucinations)', () => {
    // A non-existent root must return hasLexicalData: false without throwing or fabricating
    const nonExistentRoot = getLaneRootRecord('xyz999');
    assert.strictEqual(nonExistentRoot, null);

    // Non-existent word lookup
    const wordDetail = getCanonicalWordDetail('كَلِمَةٌ_غَيْرُ_مَوْجُودَةٍ');
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, false);
    assert.strictEqual(wordDetail.lexicon.senses.length, 0);
    assert.strictEqual(wordDetail.lexicon.message, 'Partikel / Harf (Tidak memiliki akar kata)');
  });
});
