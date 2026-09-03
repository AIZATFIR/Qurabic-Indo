import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getQACAuthoritativeIndex } from './qac-parser';
import { getCanonicalWordDetail, getCanonicalRootDetail } from './canonical-service';
import { isQuranicParticle, stripArabicHarakat } from '../search/root-search';

describe('PRD 02 — Stage 2: Adversarial Fuzzing & Negative Testing', () => {
  it('Fuzz 100 Random Quranic Words: Canonical resolution strictly matches QAC ground truth', () => {
    const index = getQACAuthoritativeIndex();
    const wordLocations = Array.from(index.recordsByWordLocation.keys());

    // Deterministic pseudo-random seed generator for reproducible fuzzing
    let seed = 42;
    function pseudoRandom() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }

    const samplesCount = 100;
    for (let i = 0; i < samplesCount; i++) {
      const randIdx = Math.floor(pseudoRandom() * wordLocations.length);
      const locKey = wordLocations[randIdx];
      const recs = index.recordsByWordLocation.get(locKey)!;
      const [sStr, aStr, wStr] = locKey.split(':');
      const surahNumber = parseInt(sStr, 10);
      const ayahNumber = parseInt(aStr, 10);
      const wordIndex = parseInt(wStr, 10);

      const surfaceArabic = recs.map(r => r.formArabic).join('');
      const stemRec = recs.find(r => r.root || r.pos === 'V' || r.pos === 'N' || r.pos === 'ADJ') || recs[0];

      const detail = getCanonicalWordDetail(surfaceArabic, {
        surahNumber,
        ayahNumber,
        wordIndex
      });

      // Verify POS alignment
      if (stemRec.pos === 'V') {
        assert.strictEqual(detail.morphology.pos, "Fi'il", `Word at ${locKey} (${surfaceArabic}) must be Fi'il`);
      } else if (stemRec.pos === 'N' || stemRec.pos === 'PN' || stemRec.pos === 'ADJ') {
        assert.strictEqual(detail.morphology.pos, 'Isim', `Word at ${locKey} (${surfaceArabic}) must be Isim`);
      } else if (['P', 'CONJ', 'SUB', 'NEG', 'RES', 'T', 'REM'].includes(stemRec.pos)) {
        assert.strictEqual(detail.morphology.pos, 'Harf', `Word at ${locKey} (${surfaceArabic}) must be Harf`);
        assert.strictEqual(detail.morphology.isParticle, true, `Word at ${locKey} must be marked as particle`);
        assert.strictEqual(detail.lexical.root, undefined, `Particle at ${locKey} must have no root`);
      }

      // Verify Root alignment when stem has a root
      if (stemRec.root) {
        assert.strictEqual(detail.lexical.root, stemRec.root, `Root mismatch at ${locKey} for ${surfaceArabic}`);
      }
    }
  });

  it('Particle Matrix: 30 particles must all resolve to Harf / Mabni with 0 fake roots', () => {
    const particles = [
      'ثُمَّ', 'إِنَّ', 'أَنَّ', 'لَعَلَّ', 'كَلَّا', 'حَتَّى', 'بَلْ', 'أَمْ',
      'لَوْ', 'لَوْلَا', 'كَيْ', 'إِذْ', 'إِذَا', 'عَسَى', 'مَا', 'لَا',
      'لَمْ', 'لَنْ', 'إِلَّا', 'مِنْ', 'عَنْ', 'فِي', 'عَلَى', 'إِلَى',
      'هَلْ', 'بَلَى', 'أَيْنَ', 'كَيْفَ', 'مَتَى', 'سَوْفَ'
    ];

    for (const p of particles) {
      const detail = getCanonicalWordDetail(p);
      assert.strictEqual(detail.morphology.pos, 'Harf', `Particle ${p} must have POS Harf`);
      assert.strictEqual(detail.morphology.isParticle, true, `Particle ${p} must have isParticle: true`);
      assert.strictEqual(detail.lexical.root, undefined, `Particle ${p} must have no root`);
      assert.strictEqual(detail.lexical.rootArabic, undefined, `Particle ${p} must have no rootArabic`);
      assert.strictEqual(detail.morphology.wazanOrForm, 'Mabni (Tetap)', `Particle ${p} must have wazan Mabni`);
    }
  });

  it('Compound Clitics Matrix: Multi-segment words resolve stems and roots accurately', () => {
    // بِالْحَقِّ (bi + Al + Haqq) -> Root: Hqq
    const bilHaqq = getCanonicalWordDetail('بِالْحَقِّ');
    assert.strictEqual(bilHaqq.morphology.pos, 'Isim');
    assert.strictEqual(bilHaqq.lexical.root, 'Hqq');
    assert.strictEqual(bilHaqq.lexical.rootArabic, 'ح ق ق');

    // لِلَّهِ (li + Allah) -> Root: Alh
    const lillah = getCanonicalWordDetail('لِلَّهِ');
    assert.strictEqual(lillah.morphology.pos, 'Isim');
    assert.strictEqual(lillah.lexical.root, 'Alh');
    assert.strictEqual(lillah.lexical.rootArabic, 'ا ل ه');

    // فَسَيَكْفِيكَهُمُ (fa + sa + yakfiy + ka + hum) -> Root: kfy
    const yakfika = getCanonicalWordDetail('فَسَيَكْفِيكَهُمُ');
    assert.strictEqual(yakfika.morphology.pos, "Fi'il");
    assert.strictEqual(yakfika.lexical.root, 'kfy');
    assert.strictEqual(yakfika.lexical.rootArabic, 'ك ف ي');
  });

  it('Negative Leakage: Unrelated roots never cross-contaminate occurrences', () => {
    const rootQwl = getCanonicalRootDetail('q-w-l');
    const rootSmw = getCanonicalRootDetail('s-m-w');
    const rootXwf = getCanonicalRootDetail('x-w-f');

    assert.ok(rootQwl && rootSmw && rootXwf, 'Roots must exist');

    // q-w-l occurrences must never contain smw words (e.g. السماء / اسم)
    const qwlLeaksSmw = rootQwl.occurrences.some(o => 
      o.matchedWordArabic?.includes('سماء') || o.matchedWordArabic?.includes('اسم')
    );
    assert.strictEqual(qwlLeaksSmw, false, 'Root q-w-l must not leak smw occurrences');

    // smw occurrences must never contain xwf words (e.g. يخاف / خوف)
    const smwLeaksXwf = rootSmw.occurrences.some(o => 
      o.matchedWordArabic?.includes('خوف') || o.matchedWordArabic?.includes('يخاف')
    );
    assert.strictEqual(smwLeaksXwf, false, 'Root s-m-w must not leak xwf occurrences');
  });
});
