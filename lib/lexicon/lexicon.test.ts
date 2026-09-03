import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getLexiconEnrichedWordDetail } from './lexicon-service';
import { getLaneRootRecord, getLaneEntryForLemma } from './lane-loader';
import manifestData from './data/manifest.json';
import fs from 'fs';
import path from 'path';

describe('Qurabic Lexical Ingestion Layer (Mass Lane Lexicon & QAC Join)', () => {
  it('Mass Ingestion Integrity: Manifest contains > 5,000 unique roots and all chunk files exist', () => {
    const rootKeys = Object.keys(manifestData);
    assert.ok(rootKeys.length >= 5000, `Expected >= 5000 roots in manifest, found ${rootKeys.length}`);

    // Verify all chunk files exist and are valid JSON
    const chunkNames = Array.from(new Set(Object.values(manifestData)));
    assert.ok(chunkNames.length >= 15, `Expected >= 15 chunk files, found ${chunkNames.length}`);

    for (const cname of chunkNames) {
      const cpath = path.join(process.cwd(), 'lib', 'lexicon', 'data', 'chunks', `${cname}.json`);
      assert.ok(fs.existsSync(cpath), `Chunk file ${cpath} must exist`);
      const raw = fs.readFileSync(cpath, 'utf-8');
      const parsed = JSON.parse(raw);
      assert.ok(Object.keys(parsed).length > 0, `Chunk ${cname} must contain roots`);
    }
  });

  it('Case 1: Token نَسْتَعِينُ (1:5:4) joins to QAC root ع و ن and retrieves verified Lane Form X entry', () => {
    const detail = getLexiconEnrichedWordDetail('نَسْتَعِينُ', {
      surahNumber: 1,
      ayahNumber: 5,
      wordIndex: 4
    });

    // QAC Invariants
    assert.strictEqual(detail.morphology.pos, "Fi'il");
    assert.strictEqual(detail.lexical.root, 'Ewn');
    assert.strictEqual(detail.lexical.rootArabic, 'ع و ن');
    assert.strictEqual(detail.morphology.verbForm, 'Form X');

    // Lexicon Invariants
    assert.strictEqual(detail.lexicon.hasLexicalData, true);
    assert.strictEqual(detail.lexicon.source, "Lane's Arabic-English Lexicon");
    assert.strictEqual(detail.lexicon.volume, 5);
    assert.strictEqual(detail.lexicon.matchedForm, 'Form 10');
    assert.ok(detail.lexicon.senses.length > 0);
    assert.ok(detail.lexicon.senses[0].text.toLowerCase().includes('aid') || detail.lexicon.senses[0].text.toLowerCase().includes('help'));
    assert.ok(detail.lexicon.senses[0].citation.volume === 5);
  });

  it('Case 2: Token فَٱخْتَلَطَ (10:24:9) joins to QAC root خ ل ط and retrieves verified Lane Form VIII entry', () => {
    const detail = getLexiconEnrichedWordDetail('فَٱخْتَلَطَ', {
      surahNumber: 10,
      ayahNumber: 24,
      wordIndex: 9
    });

    // QAC Invariants
    assert.strictEqual(detail.morphology.pos, "Fi'il");
    assert.strictEqual(detail.lexical.root, 'xlT');
    assert.strictEqual(detail.lexical.rootArabic, 'خ ل ط');
    assert.strictEqual(detail.morphology.verbForm, 'Form VIII');

    // Lexicon Invariants
    assert.strictEqual(detail.lexicon.hasLexicalData, true);
    assert.strictEqual(detail.lexicon.volume, 2);
    assert.strictEqual(detail.lexicon.matchedForm, 'Form 8');
    assert.ok(detail.lexicon.senses[0].text.toLowerCase().includes('mixed') || detail.lexicon.senses[0].text.toLowerCase().includes('mingled'));
  });

  it('Case 3: Token صَبَرُوا / ٱلصَّـٰبِرِينَ (2:153:10) joins to QAC root ص ب ر and retrieves multi-sense Lane entries', () => {
    const detailVerb = getLexiconEnrichedWordDetail('صَبَرُوا');

    // QAC Invariants
    assert.strictEqual(detailVerb.morphology.pos, "Fi'il");
    assert.strictEqual(detailVerb.lexical.root, 'Sbr');
    assert.strictEqual(detailVerb.lexical.rootArabic, 'ص ب ر');

    // Lexicon Invariants
    assert.strictEqual(detailVerb.lexicon.hasLexicalData, true);
    assert.strictEqual(detailVerb.lexicon.volume, 4);
    assert.ok(detailVerb.lexicon.senses.length > 0);

    // Root record contains multiple distinct entries and discrete senses
    const rootRec = getLaneRootRecord('Sbr');
    assert.ok(rootRec);
    assert.ok(rootRec.entries.length > 10, 'Root Sbr must have multiple entries across forms');
    assert.ok(rootRec.entries.some(e => e.itype === '1'));
    assert.ok(rootRec.entries.some(e => e.itype === '8'));

    // Participle test at 2:153:10
    const detailParticiple = getLexiconEnrichedWordDetail('ٱلصَّـٰبِرِينَ', {
      surahNumber: 2,
      ayahNumber: 153,
      wordIndex: 10
    });
    assert.strictEqual(detailParticiple.morphology.pos, 'Isim');
    assert.strictEqual(detailParticiple.lexical.root, 'Sbr');
    assert.strictEqual(detailParticiple.lexicon.hasLexicalData, true);
  });

  it('Case 4: Token رَيْبَ (2:2:4) joins to QAC root ر ي ب and retrieves verified Lane entry', () => {
    const detail = getLexiconEnrichedWordDetail('رَيْبَ', {
      surahNumber: 2,
      ayahNumber: 2,
      wordIndex: 4
    });

    // QAC Invariants
    assert.strictEqual(detail.morphology.pos, 'Isim');
    assert.strictEqual(detail.lexical.root, 'ryb');
    assert.strictEqual(detail.lexical.rootArabic, 'ر ي ب');

    // Lexicon Invariants
    assert.strictEqual(detail.lexicon.hasLexicalData, true);
    assert.strictEqual(detail.lexicon.volume, 3);
    assert.ok(detail.lexicon.senses.length > 0);
  });

  it('Case 5: Weak and Geminate Root Normalization resolves correctly (e.g. hdy -> hdY, Dmm -> Dm)', () => {
    // Weak root hdy -> hdY (هدى)
    const hdyRecord = getLaneRootRecord('hdy');
    assert.ok(hdyRecord, 'Weak root hdy must resolve to hdY in Lane index');
    assert.strictEqual(hdyRecord.rootArabic, 'هدى');

    // Geminate root Dmm -> Dm (ضم)
    const dmmRecord = getLaneRootRecord('Dmm');
    assert.ok(dmmRecord, 'Geminate root Dmm must resolve to Dm in Lane index');
    assert.strictEqual(dmmRecord.rootArabic, 'ضم');
  });

  it('Case 6: Particle فَلَمَّآ (12:80:1) is strictly classified as Harf and NEVER matches root l-w-m (ل و م)', () => {
    const detail = getLexiconEnrichedWordDetail('فَلَمَّآ', {
      surahNumber: 12,
      ayahNumber: 80,
      wordIndex: 1
    });

    assert.strictEqual(detail.morphology.pos, 'Harf');
    assert.strictEqual(detail.morphology.isParticle, true);
    assert.strictEqual(detail.lexical.root, undefined);
    assert.strictEqual(detail.lexical.rootArabic, undefined);
    assert.strictEqual(detail.lexicon.hasLexicalData, false);
    assert.strictEqual(detail.lexicon.message, 'Partikel / Harf (Tidak memiliki akar kata)');
  });

  it('Case 7: Particle وَعَنِ is strictly classified as Harf with no fake root and no lexical entry', () => {
    const detail = getLexiconEnrichedWordDetail('وَعَنِ');

    assert.strictEqual(detail.morphology.pos, 'Harf');
    assert.strictEqual(detail.morphology.isParticle, true);
    assert.strictEqual(detail.lexical.root, undefined);
    assert.strictEqual(detail.lexicon.hasLexicalData, false);
    assert.strictEqual(detail.lexicon.message, 'Partikel / Harf (Tidak memiliki akar kata)');
  });

  it('Case 8: CanonicalService integration delivers verified Lane Lexicon directly in CanonicalWordDetail and CanonicalRootDetail', async () => {
    const { getCanonicalWordDetail, getCanonicalRootDetail } = await import('../morphology/canonical-service');
    
    // Word Detail Integration
    const wordDetail = getCanonicalWordDetail('نَسْتَعِينُ', {
      surahNumber: 1,
      ayahNumber: 5,
      wordIndex: 4
    });
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 5);
    assert.strictEqual(wordDetail.lexicon.matchedForm, 'Form 10');

    // Root Detail Integration with multiple senses & forms
    const rootDetail = getCanonicalRootDetail('Sbr');
    assert.ok(rootDetail);
    assert.ok(rootDetail.lexicon);
    assert.strictEqual(rootDetail.lexicon.rootArabic, 'صبر');
    assert.strictEqual(rootDetail.lexicon.volume, 4);
    assert.ok(rootDetail.lexicon.entries.length >= 10);
    assert.ok(rootDetail.lexicon.entries.some(e => e.itype === '1'));
    assert.ok(rootDetail.lexicon.entries.some(e => e.itype === '8'));
  });
});
