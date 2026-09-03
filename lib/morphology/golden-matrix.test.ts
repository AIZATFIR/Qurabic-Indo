import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getCanonicalWordDetail, getCanonicalRootDetail } from './canonical-service';
import { getRootBySlug } from '../search/root-search';

describe('PRD Finalization — Golden Runtime Test Matrix', () => {
  it('Case 1: Token وَعَنِ must resolve to Harf with 0 tri-literal root', () => {
    const detail = getCanonicalWordDetail('وَعَنِ');
    assert.strictEqual(detail.morphology.pos, 'Harf');
    assert.strictEqual(detail.morphology.isParticle, true);
    assert.strictEqual(detail.lexical.root, undefined);
    assert.strictEqual(detail.lexical.rootArabic, undefined);
    assert.strictEqual(detail.morphology.wazanOrForm, 'Mabni (Tetap)');
  });

  it('Case 2: Token ٱلرَّحْمَـٰنِ (Uthmani Wasla) must resolve to root rHm / Lemma r~aHoma`n', () => {
    const detail = getCanonicalWordDetail('ٱلرَّحْمَـٰنِ');
    assert.strictEqual(detail.morphology.pos, 'Isim');
    assert.strictEqual(detail.lexical.root, 'rHm');
    assert.strictEqual(detail.lexical.rootArabic, 'ر ح م');
    assert.strictEqual(detail.lexical.lemma, 'r~aHoma`n');
    assert.strictEqual(detail.lexical.lemmaArabic, 'رَّحْمَٰن');
    assert.ok(detail.translation.primaryMeaning.includes('Maha Pengasih'));
  });

  it('Case 3: Token فَلَمَّآ must resolve to Harf and NEVER match root l-w-m', () => {
    const detail = getCanonicalWordDetail('فَلَمَّآ');
    assert.strictEqual(detail.morphology.pos, 'Harf');
    assert.strictEqual(detail.morphology.isParticle, true);
    assert.notStrictEqual(detail.lexical.root, 'lwm');
    assert.strictEqual(detail.lexical.root, undefined);
  });

  it('Case 4: Token بِسْمِ must resolve to root smw / Lemma {som (Isim)', () => {
    const detail = getCanonicalWordDetail('بِسْمِ');
    assert.strictEqual(detail.morphology.pos, 'Isim');
    assert.strictEqual(detail.lexical.root, 'smw');
    assert.strictEqual(detail.lexical.rootArabic, 'س م و');
    assert.strictEqual(detail.lexical.lemma, '{som');
    assert.strictEqual(detail.lexical.lemmaArabic, 'ٱسْم');
  });

  it('Case 5: Token قَالُوا must resolve to Fi\'il Madhi Form I / Root qwl', () => {
    const detail = getCanonicalWordDetail('قَالُوا');
    assert.strictEqual(detail.morphology.pos, "Fi'il");
    assert.strictEqual(detail.lexical.root, 'qwl');
    assert.strictEqual(detail.lexical.rootArabic, 'ق و ل');
    assert.strictEqual(detail.lexical.lemma, 'qaAla');
    assert.strictEqual(detail.lexical.lemmaArabic, 'قَالَ');
  });

  it('Case 6: Token وَيَقُولُونَ must resolve to Fi\'il Mudhari\' Form I / Root qwl', () => {
    const detail = getCanonicalWordDetail('وَيَقُولُونَ');
    assert.strictEqual(detail.morphology.pos, "Fi'il");
    assert.strictEqual(detail.lexical.root, 'qwl');
    assert.strictEqual(detail.lexical.rootArabic, 'ق و ل');
    assert.strictEqual(detail.lexical.lemma, 'qaAla');
    assert.strictEqual(detail.lexical.lemmaArabic, 'قَالَ');
  });

  it('Case 7: Token خَوْفٌ must resolve to Isim Masdar / Root xwf (kh-w-f)', () => {
    const detail = getCanonicalWordDetail('خَوْفٌ');
    assert.strictEqual(detail.morphology.pos, 'Isim');
    assert.strictEqual(detail.lexical.root, 'xwf');
    assert.strictEqual(detail.lexical.rootArabic, 'خ و ف');
    assert.strictEqual(detail.lexical.lemma, 'xawof');
    assert.strictEqual(detail.lexical.lemmaArabic, 'خَوْف');
  });

  it('Case 8: Token مُسْتَقِيمٍ must resolve to Isim Fa\'il Form X / Root qwm', () => {
    const detail = getCanonicalWordDetail('مُسْتَقِيمٍ');
    assert.strictEqual(detail.morphology.pos, 'Isim');
    assert.strictEqual(detail.lexical.root, 'qwm');
    assert.strictEqual(detail.lexical.rootArabic, 'ق و م');
    assert.strictEqual(detail.lexical.lemma, 'm~usotaqiym');
    assert.strictEqual(detail.lexical.lemmaArabic, 'مُّسْتَقِيم');
    assert.strictEqual(detail.morphology.nounType, "Isim Fa'il");
  });

  it('Case 9: Token تَخَافُوهُمْ must resolve to Fi\'il Mudhari\' + Pronoun / Root xwf', () => {
    const detail = getCanonicalWordDetail('تَخَافُوهُمْ');
    assert.strictEqual(detail.morphology.pos, "Fi'il");
    assert.strictEqual(detail.lexical.root, 'xwf');
    assert.strictEqual(detail.lexical.rootArabic, 'خ و ف');
    assert.strictEqual(detail.lexical.lemma, 'xaAfa');
    assert.strictEqual(detail.lexical.lemmaArabic, 'خَافَ');
  });

  it('Case 10: Token إِلَى must resolve to Harf Jarr without root', () => {
    const detail = getCanonicalWordDetail('إِلَى');
    assert.strictEqual(detail.morphology.pos, 'Harf');
    assert.strictEqual(detail.morphology.isParticle, true);
    assert.strictEqual(detail.lexical.root, undefined);
  });

  it('Concordance Isolation: Root l-w-m contains 0 occurrences of particle فَلَمَّا', () => {
    const lwmRoot = getRootBySlug('l-w-m');
    assert.ok(lwmRoot, 'Root l-w-m must exist in database');
    const hasFalamma = lwmRoot.occurrences?.some(o => o.matchedWordArabic?.includes('فَلَمَّا') || o.matchedWordArabic?.includes('فلما'));
    assert.strictEqual(hasFalamma, false, 'Root l-w-m must not contain particle فَلَمَّا');
  });

  it('Root Detail Statistics: Root s-m-w (س م و) satisfies exact deterministic statistics', () => {
    const smw = getCanonicalRootDetail('s-m-w');
    assert.ok(smw, 'Root s-m-w must exist');
    assert.strictEqual(smw.statistics.totalOccurrences, 381);
    assert.strictEqual(smw.statistics.uniqueAyahs, 352);
    assert.strictEqual(smw.statistics.uniqueSurahs, 81);
    assert.strictEqual(smw.statistics.uniqueLemmas, 6);
    assert.strictEqual(smw.statistics.verbsCount, 8);
    assert.strictEqual(smw.statistics.nounsCount, 373);
  });
});
