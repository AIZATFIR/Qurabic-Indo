import test from 'node:test';
import assert from 'node:assert/strict';
import { getWordStudy } from './word-study-service';
import wbw from '../data/wbw-indonesian-glosses.json';

// Source facts remain available when unreviewed narratives and generated tasrif are removed.
test('Word study preserves sourced meaning and QAC facts across diverse coordinates', () => {
  const locations = ['105:2:2', '95:6:7', '1:1:1', '1:2:1', '1:5:2', '1:5:4', '2:2:2', '2:22:11', '2:77:9', '112:1:3', '114:1:3'];
  for (const location of locations) {
    const study = getWordStudy(location);
    assert.ok(study.identity.arabic);
    assert.equal(study.primaryMeaning.text, (wbw.meanings as Record<string, string>)[location]);
    assert.equal(study.primaryMeaning.sourceId, 'quran-com-wbw');
    assert.ok(study.morphology.rawTag, `QAC tag is available for ${location}`);
    assert.equal(study.linguisticExplanation, undefined);
    assert.equal(study.grammarDerivation, undefined);
    assert.equal(study.lexical.rootPhilosophy, undefined);
    for (const sense of study.lexical.senses) {
      assert.ok(sense.citation.page > 0);
      assert.ok(sense.text.length > 0);
    }
  }
});

test('Exact QAC root f-z-z and authentic Lane senses survive caller meaning overrides', () => {
  const study = getWordStudy('17:64:1', { meaningIndo: 'Unverified caller text' });
  assert.equal(study.lexical.root, 'fzz');
  assert.equal(study.lexical.rootArabic, 'ف ز ز');
  assert.equal(study.lexical.rootSlug, 'f-z-z');
  assert.equal(study.primaryMeaning.text, (wbw.meanings as Record<string, string>)['17:64:1']);
  assert.equal(study.morphology.pos, "Fi'il");
  assert.equal(study.morphology.verbType, 'Amr');
  assert.ok(study.lexical.senses.length > 0);
  assert.ok(study.lexical.senses[0].text.includes('unsettled him') || study.lexical.senses[0].text.includes('lightness and unsteadiness'));
});
