import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCanonicalWordDetail, getCanonicalRootDetail } from '../morphology/canonical-service';
import { getLaneRootRecord, getLaneLemmaRecord, getLaneEntryForLemma } from './lane-loader';
import { getQACAuthoritativeIndex } from '../morphology/qac-parser';

describe('P3 — Full Classical Lexicon Coverage & Preposition/Lemma Resolution', () => {

  it('Case 1: Preposition عِندَ / عِندِنَا resolves authentic Lane classical entry without forced root', () => {
    const wordDetail = getCanonicalWordDetail('عِندِنَا', {
      surahNumber: 2,
      ayahNumber: 54,
      wordIndex: 19
    });

    assert.strictEqual(wordDetail.lexical.lemma, 'Eind');
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.source, "Lane's Arabic-English Lexicon");
    assert.strictEqual(wordDetail.lexicon.volume, 5);
    assert.strictEqual(wordDetail.lexicon.page, 2171);
    assert.ok(wordDetail.lexicon.senses.length > 0);
    assert.ok(wordDetail.lexicon.senses[0].text.length > 10);
  });

  it('Case 2: Preposition عَلَى resolves authentic Lane classical entry', () => {
    const wordDetail = getCanonicalWordDetail('عَلَى');

    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 5);
    assert.strictEqual(wordDetail.lexicon.page, 2144);
    assert.ok(wordDetail.lexicon.senses.length > 0);
  });

  it('Case 3: Preposition مِنْ resolves authentic Lane classical entry', () => {
    const wordDetail = getCanonicalWordDetail('مِنْ');

    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 8);
    assert.strictEqual(wordDetail.lexicon.page, 3024);
    assert.ok(wordDetail.lexicon.senses.length > 0);
  });

  it('Case 4: Particle مَا resolves authentic Lane classical entry', () => {
    const wordDetail = getCanonicalWordDetail('مَا');

    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 8);
    assert.strictEqual(wordDetail.lexicon.page, 3016);
    assert.ok(wordDetail.lexicon.senses.length > 0);
  });

  it('Case 5: Preposition وَعَنِ / عَنْ resolves authentic Lane classical entry without forced root', () => {
    const wordDetail = getCanonicalWordDetail('عَنْ');

    assert.strictEqual(wordDetail.morphology.pos, 'Harf');
    assert.strictEqual(wordDetail.morphology.isParticle, true);
    assert.strictEqual(wordDetail.lexical.root, undefined);
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 5);
    assert.strictEqual(wordDetail.lexicon.page, 2163);
    assert.ok(wordDetail.lexicon.senses.length > 0);
  });

  it('Case 6: Verb نَسْتَعِينُ (1:5:4) joins to QAC root ع و ن and resolves Lane Form X entry', () => {
    const wordDetail = getCanonicalWordDetail('نَسْتَعِينُ', {
      surahNumber: 1,
      ayahNumber: 5,
      wordIndex: 4
    });

    assert.strictEqual(wordDetail.morphology.pos, "Fi'il");
    assert.strictEqual(wordDetail.morphology.verbForm, 'Form X');
    assert.strictEqual(wordDetail.lexical.root, 'Ewn');
    assert.strictEqual(wordDetail.lexical.rootArabic, 'ع و ن');
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 5);
    assert.strictEqual(wordDetail.lexicon.page, 2203);
    assert.strictEqual(wordDetail.lexicon.matchedForm, 'Form 10');
  });

  it('Case 7: Verb فَٱخْتَلَطَ (10:24:9) joins to QAC root خ ل ط and resolves Lane Form VIII entry', () => {
    const wordDetail = getCanonicalWordDetail('فَٱخْتَلَطَ', {
      surahNumber: 10,
      ayahNumber: 24,
      wordIndex: 9
    });

    assert.strictEqual(wordDetail.morphology.pos, "Fi'il");
    assert.strictEqual(wordDetail.morphology.verbForm, 'Form VIII');
    assert.strictEqual(wordDetail.lexical.root, 'xlT');
    assert.strictEqual(wordDetail.lexical.rootArabic, 'خ ل ط');
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 2);
    assert.strictEqual(wordDetail.lexicon.page, 788);
    assert.strictEqual(wordDetail.lexicon.matchedForm, 'Form 8');
  });

  it('Case 8: Noun رَيْبَ (2:2:4) joins to QAC root ر ي ب and resolves Lane entry', () => {
    const wordDetail = getCanonicalWordDetail('رَيْبَ', {
      surahNumber: 2,
      ayahNumber: 2,
      wordIndex: 4
    });

    assert.strictEqual(wordDetail.morphology.pos, 'Isim');
    assert.strictEqual(wordDetail.lexical.root, 'ryb');
    assert.strictEqual(wordDetail.lexical.rootArabic, 'ر ي ب');
    assert.ok(wordDetail.lexicon);
    assert.strictEqual(wordDetail.lexicon.hasLexicalData, true);
    assert.strictEqual(wordDetail.lexicon.volume, 3);
    assert.strictEqual(wordDetail.lexicon.page, 1199);
  });

  it('Case 9: Particle فَلَمَّآ (12:80:1) is strictly classified as Harf with ZERO fake root assignment to ل و م', () => {
    const wordDetail = getCanonicalWordDetail('فَلَمَّآ', {
      surahNumber: 12,
      ayahNumber: 80,
      wordIndex: 1
    });

    assert.strictEqual(wordDetail.morphology.pos, 'Harf');
    assert.strictEqual(wordDetail.morphology.isParticle, true);
    assert.strictEqual(wordDetail.lexical.root, undefined);
    assert.strictEqual(wordDetail.lexical.rootArabic, undefined);
  });

  it('Case 10: Full QAC Lemma Coverage Audit (> 94% total lemmas and > 98% root-bearing lemmas resolved)', () => {
    const qacIndex = getQACAuthoritativeIndex();
    assert.ok(qacIndex.totalRecords > 120000);

    const uniqueLemmas = Array.from(qacIndex.recordsByLemma.keys());
    assert.ok(uniqueLemmas.length >= 4500, `Expected >= 4500 unique lemmas, found ${uniqueLemmas.length}`);

    let resolvedCount = 0;
    let rootBearingCount = 0;
    let rootBearingResolved = 0;

    for (const lem of uniqueLemmas) {
      const records = qacIndex.recordsByLemma.get(lem) || [];
      const hasRoot = records.some(r => r.root);
      if (hasRoot) rootBearingCount++;

      const laneDirect = getLaneLemmaRecord(lem);
      if (laneDirect) {
        resolvedCount++;
        if (hasRoot) rootBearingResolved++;
      } else if (hasRoot) {
        const rootBw = records.find(r => r.root)?.root;
        if (rootBw) {
          const laneRoot = getLaneRootRecord(rootBw);
          if (laneRoot) {
            resolvedCount++;
            rootBearingResolved++;
          }
        }
      }
    }

    const totalCoveragePct = (resolvedCount / uniqueLemmas.length) * 100;
    const rootBearingCoveragePct = (rootBearingResolved / rootBearingCount) * 100;

    console.log('====================================================');
    console.log(`P3 FULL LEXICON COVERAGE REPORT:`);
    console.log(`• Total Unique QAC Lemmas      : ${uniqueLemmas.length}`);
    console.log(`• Total Resolved Lemmas        : ${resolvedCount} (${totalCoveragePct.toFixed(2)}%)`);
    console.log(`• Root-Bearing Lemmas Resolved  : ${rootBearingResolved} / ${rootBearingCount} (${rootBearingCoveragePct.toFixed(2)}%)`);
    console.log('====================================================');

    assert.ok(totalCoveragePct >= 94.0, `Expected >= 94% total lemma coverage, got ${totalCoveragePct}%`);
    assert.ok(rootBearingCoveragePct >= 98.0, `Expected >= 98% root-bearing coverage, got ${rootBearingCoveragePct}%`);
  });
});
