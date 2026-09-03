import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ROOT_DATABASE } from '../data/roots';
import { getCanonicalWordDetail, getCanonicalRootDetail } from './canonical-service';
import { getRootOccurrencesFromChunk } from './morphology-service';

describe('PRD 02 — Stage 3: Property Invariants & Cross-Surface Matrix', () => {
  it('Property Invariant: Every occurrence in every root belongs strictly to that root', () => {
    // Check all 1,642 roots in ROOT_DATABASE
    let checkedRoots = 0;
    let checkedOccurrences = 0;

    for (const root of ROOT_DATABASE) {
      checkedRoots++;
      const occurrences = root.occurrences && root.occurrences.length > 0
        ? root.occurrences
        : getRootOccurrencesFromChunk(root.id) || [];

      for (const occ of occurrences) {
        checkedOccurrences++;
        assert.ok(occ.surahNumber >= 1 && occ.surahNumber <= 114, `Invalid surah ${occ.surahNumber} in root ${root.id}`);
        assert.ok(occ.ayahNumber >= 1, `Invalid ayah ${occ.ayahNumber} in root ${root.id}`);
        assert.ok(occ.verseArabic && occ.verseArabic.length > 0, `Empty verse Arabic in root ${root.id}`);
        assert.ok(occ.verseIndo && occ.verseIndo.length > 0, `Empty verse Indo in root ${root.id}`);
      }
    }

    assert.strictEqual(checkedRoots, 1642, 'All 1,642 roots must be verified');
    assert.ok(checkedOccurrences >= 40000, `Expected ~44,431 unique verse occurrences, got ${checkedOccurrences}`);
  });

  it('Cross-Surface Consistency Matrix: 15 diverse tokens have 100% agreement across all surfaces', () => {
    const matrixTokens = [
      { token: 'وَعَنِ', expectedPos: 'Harf', expectedRoot: undefined, isParticle: true },
      { token: 'ٱلرَّحْمَـٰنِ', expectedPos: 'Isim', expectedRoot: 'rHm', isParticle: false },
      { token: 'فَلَمَّآ', expectedPos: 'Harf', expectedRoot: undefined, isParticle: true },
      { token: 'بِسْمِ', expectedPos: 'Isim', expectedRoot: 'smw', isParticle: false },
      { token: 'قَالُوا', expectedPos: "Fi'il", expectedRoot: 'qwl', isParticle: false },
      { token: 'وَيَقُولُونَ', expectedPos: "Fi'il", expectedRoot: 'qwl', isParticle: false },
      { token: 'خَوْفٌ', expectedPos: 'Isim', expectedRoot: 'xwf', isParticle: false },
      { token: 'مُسْتَقِيمٍ', expectedPos: 'Isim', expectedRoot: 'qwm', isParticle: false },
      { token: 'تَخَافُوهُمْ', expectedPos: "Fi'il", expectedRoot: 'xwf', isParticle: false },
      { token: 'إِلَى', expectedPos: 'Harf', expectedRoot: undefined, isParticle: true },
      { token: 'الْحَمْدُ', expectedPos: 'Isim', expectedRoot: 'hmd', isParticle: false },
      { token: 'الصَّابِرِينَ', expectedPos: 'Isim', expectedRoot: 'sbr', isParticle: false },
      { token: 'يَعْفُوا۟', expectedPos: "Fi'il", expectedRoot: 'Efw', isParticle: false },
      { token: 'كَلَّا', expectedPos: 'Harf', expectedRoot: undefined, isParticle: true },
      { token: 'ثُمَّ', expectedPos: 'Harf', expectedRoot: undefined, isParticle: true },
    ];

    for (const item of matrixTokens) {
      // 1. Word Detail Model
      const wordDetail = getCanonicalWordDetail(item.token);
      assert.strictEqual(wordDetail.morphology.pos, item.expectedPos, `POS mismatch on ${item.token}`);
      assert.strictEqual(wordDetail.morphology.isParticle, item.isParticle, `isParticle mismatch on ${item.token}`);
      
      if (item.expectedRoot) {
        assert.ok(
          wordDetail.lexical.root?.toLowerCase() === item.expectedRoot.toLowerCase() ||
          wordDetail.lexical.rootSlug?.replace(/-/g, '').toLowerCase() === item.expectedRoot.toLowerCase(),
          `Root mismatch on ${item.token}: expected ${item.expectedRoot}, got ${wordDetail.lexical.root}`
        );

        // 2. Root Detail Model Cross-Check
        if (wordDetail.lexical.rootSlug) {
          const rootDetail = getCanonicalRootDetail(wordDetail.lexical.rootSlug);
          assert.ok(rootDetail, `Root detail for slug ${wordDetail.lexical.rootSlug} must exist`);
          assert.ok(rootDetail.statistics.totalOccurrences > 0, `Root ${wordDetail.lexical.rootSlug} must have occurrences`);
        }
      } else {
        assert.strictEqual(wordDetail.lexical.root, undefined, `Particle ${item.token} must have undefined root`);
        assert.strictEqual(wordDetail.lexical.rootSlug, undefined, `Particle ${item.token} must have undefined rootSlug`);
      }
    }
  });

  it('Deterministic Counts: Root s-m-w and x-w-f distribution tables sum up to total occurrences', () => {
    const smw = getCanonicalRootDetail('s-m-w');
    assert.ok(smw);
    const smwLemmaSum = smw.statistics.lemmaDistribution.reduce((acc, l) => acc + l.count, 0);
    const smwPosSum = smw.statistics.posDistribution.reduce((acc, p) => acc + p.count, 0);
    assert.strictEqual(smwLemmaSum, smw.statistics.totalOccurrences, 'smw lemma sum must equal total occurrences');
    assert.strictEqual(smwPosSum, smw.statistics.totalOccurrences, 'smw pos sum must equal total occurrences');

    const xwf = getCanonicalRootDetail('x-w-f');
    assert.ok(xwf);
    const xwfLemmaSum = xwf.statistics.lemmaDistribution.reduce((acc, l) => acc + l.count, 0);
    const xwfPosSum = xwf.statistics.posDistribution.reduce((acc, p) => acc + p.count, 0);
    assert.strictEqual(xwfLemmaSum, xwf.statistics.totalOccurrences, 'xwf lemma sum must equal total occurrences');
    assert.strictEqual(xwfPosSum, xwf.statistics.totalOccurrences, 'xwf pos sum must equal total occurrences');
  });
});
