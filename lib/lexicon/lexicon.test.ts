import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getLexiconEnrichedWordDetail } from './lexicon-service';
import { getLaneRootRecord } from './lane-loader';

describe('Qurabic Lexical Ingestion Layer (Lane\'s Lexicon & QAC Join)', () => {
  it('Case 1: Token نَسْتَعِينُ (1:5:4) joins to QAC root ع و ن and retrieves Lane Form X entry', () => {
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
    assert.strictEqual(detail.lexicon.page, 2202);
    assert.strictEqual(detail.lexicon.matchedForm, 'Form 10');
    assert.ok(detail.lexicon.senses.length > 0);
    assert.ok(detail.lexicon.senses[0].includes('sought, desired, asked, or demanded aid, help, or assistance'));
  });

  it('Case 2: Token فَٱخْتَلَطَ (10:24:9) joins to QAC root خ ل ط and retrieves Lane Form VIII entry', () => {
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
    assert.strictEqual(detail.lexicon.page, 785);
    assert.strictEqual(detail.lexicon.matchedForm, 'Form 8');
    assert.ok(detail.lexicon.senses[0].includes('became mixed, mingled, blended together, or intertwined'));
  });

  it('Case 3: Token صَبَرُوا / ٱلصَّـٰبِرِينَ (2:153:10) joins to QAC root ص ب ر and retrieves Lane Lexicon entries', () => {
    const detailVerb = getLexiconEnrichedWordDetail('صَبَرُوا');

    // QAC Invariants
    assert.strictEqual(detailVerb.morphology.pos, "Fi'il");
    assert.strictEqual(detailVerb.lexical.root, 'Sbr');
    assert.strictEqual(detailVerb.lexical.rootArabic, 'ص ب ر');

    // Lexicon Invariants
    assert.strictEqual(detailVerb.lexicon.hasLexicalData, true);
    assert.strictEqual(detailVerb.lexicon.volume, 4);
    assert.strictEqual(detailVerb.lexicon.page, 1643);
    assert.ok(detailVerb.lexicon.senses[0].includes('restrained, withheld, or confined himself'));

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

  it('Case 4: Token رَيْبَ (2:2:4) joins to QAC root ر ي ب and retrieves Lane Noun entry', () => {
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
    assert.strictEqual(detail.lexicon.page, 1205);
    assert.ok(detail.lexicon.senses[0].includes('Doubt, suspicion, or uncertainty'));
  });

  it('Case 5: Particle فَلَمَّآ (12:80:1) is strictly classified as Harf and NEVER matches root l-w-m (ل و م)', () => {
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

  it('Case 6: Particle وَعَنِ is strictly classified as Harf with no fake root', () => {
    const detail = getLexiconEnrichedWordDetail('وَعَنِ');

    assert.strictEqual(detail.morphology.pos, 'Harf');
    assert.strictEqual(detail.morphology.isParticle, true);
    assert.strictEqual(detail.lexical.root, undefined);
    assert.strictEqual(detail.lexicon.hasLexicalData, false);
    assert.strictEqual(detail.lexicon.message, 'Partikel / Harf (Tidak memiliki akar kata)');
  });

  it('Case 7: Unindexed root returns honest "Makna leksikal belum tersedia." with 0 AI fabrication', () => {
    const detail = getLexiconEnrichedWordDetail('زَجْرَةٌ');

    // Word is valid QAC root zjr, but not in our Lane pilot chunk
    assert.strictEqual(detail.lexical.root, 'zjr');
    assert.strictEqual(detail.lexicon.hasLexicalData, false);
    assert.strictEqual(detail.lexicon.message, 'Makna leksikal belum tersedia.');
    assert.strictEqual(detail.lexicon.senses.length, 0);
  });
});
