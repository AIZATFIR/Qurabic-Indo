import test from 'node:test';
import assert from 'node:assert/strict';
import { getWordStudy } from './word-study-service';
import { getQuranicParticleInfo, QURANIC_PARTICLES_DICTIONARY } from './particles-dictionary';
import { getCanonicalWordDetail } from './canonical-service';

test('Particles Dictionary & Zero-Fallback Placeholder Tests', async (t) => {
  await t.test('1. Particles Dictionary covers key Quranic particles', () => {
    const keys = Object.keys(QURANIC_PARTICLES_DICTIONARY);
    assert.ok(keys.length >= 25, `Expected >= 25 particles, got ${keys.length}`);

    const fi = getQuranicParticleInfo('فِي');
    assert.ok(fi, 'Expected particle فِي to be defined');
    assert.equal(fi?.particleCategory, 'Harf Jarr');
    assert.ok(fi?.primaryMeaning.includes('Di dalam'));
    assert.ok(fi?.grammaticalRole.includes('Harf Jarr'));

    const inna = getQuranicParticleInfo('إِنَّ');
    assert.ok(inna, 'Expected particle إِنَّ to be defined');
    assert.equal(inna?.particleCategory, 'Harf Taukid');
    assert.ok(inna?.primaryMeaning.includes('Sesungguhnya'));

    const min = getQuranicParticleInfo('مِنْ');
    assert.ok(min, 'Expected particle مِنْ to be defined');
    assert.ok(min?.primaryMeaning.includes('Dari'));

    const ala = getQuranicParticleInfo('عَلَىٰ');
    assert.ok(ala, 'Expected particle عَلَىٰ to be defined');
    assert.ok(ala?.primaryMeaning.includes('Di atas'));
  });

  await t.test('2. Particle فِي word study has authentic Nahwu breakdown and zero template placeholder', () => {
    const study = getWordStudy('فِي');
    assert.equal(study.morphology.pos, 'Harf');
    assert.ok(study.primaryMeaning.text.includes('Di dalam') || study.primaryMeaning.text.includes('Pada'));
    assert.ok(study.lexical.meanings && study.lexical.meanings.length >= 2);

    // Negative invariant: Zero leaked dummy strings
    for (const m of study.lexical.meanings || []) {
      assert.ok(!m.startsWith('Konsep & Turunan'), `Dummy string leaked: ${m}`);
      assert.ok(!m.startsWith('Gagasan pokok'), `Dummy string leaked: ${m}`);
      assert.ok(!m.startsWith('Ragam makna'), `Dummy string leaked: ${m}`);
    }
    assert.ok(!study.lexical.rootPhilosophy?.includes('memiliki peranan penting dalam kosakata Al-Qur\'an dengan berbagai bentuk turunan verba'));
  });

  await t.test('3. Root ك و ن (k-w-n) has genuine existential philosophy and no dummy template', () => {
    const study = getWordStudy('كَانَ');
    assert.equal(study.lexical.rootArabic, 'ك و ن');
    assert.ok(study.primaryMeaning.text.includes('Adalah') || study.primaryMeaning.text.includes('Wujud'));
    assert.ok(study.lexical.rootPhilosophy?.includes('al-kaun') || study.lexical.rootPhilosophy?.includes('eksistensi'));

    for (const m of study.lexical.meanings || []) {
      assert.notEqual(m, 'Konsep & Turunan Akar كون');
      assert.notEqual(m, 'Gagasan pokok yang terhimpun dalam akar kata كون');
      assert.notEqual(m, 'Ragam makna kontekstual sesuai penggunaan ayat Al-Qur\'an');
    }
  });

  await t.test('4. Canonical detail for كَانُوا (k-w-n) resolves cleanly', () => {
    const detail = getCanonicalWordDetail('كَانُوا');
    assert.equal(detail.lexical.rootArabic, 'ك و ن');
    assert.ok(detail.translation.primaryMeaning.includes('Mereka') || detail.translation.primaryMeaning.includes('Adalah'));
    for (const m of detail.translation.meanings) {
      assert.ok(!m.startsWith('Konsep & Turunan'));
      assert.ok(!m.startsWith('Gagasan pokok'));
      assert.ok(!m.startsWith('Ragam makna'));
    }
  });

  await t.test('5. Uncurated words NEVER leak dummy strings', () => {
    const words = ['شَجَرَة', 'حِجَارَة', 'زَيْتُون'];
    for (const w of words) {
      const study = getWordStudy(w);
      for (const m of study.lexical.meanings || []) {
        assert.ok(!m.startsWith('Konsep & Turunan'), `Dummy string leaked in ${w}: ${m}`);
        assert.ok(!m.startsWith('Gagasan pokok'), `Dummy string leaked in ${w}: ${m}`);
        assert.ok(!m.startsWith('Ragam makna kontekstual'), `Dummy string leaked in ${w}: ${m}`);
      }
      if (study.lexical.rootPhilosophy) {
        assert.ok(!study.lexical.rootPhilosophy.includes('memiliki peranan penting dalam kosakata Al-Qur\'an dengan berbagai bentuk turunan verba'), `Dummy philosophy in ${w}: ${study.lexical.rootPhilosophy}`);
      }
    }
  });
});
