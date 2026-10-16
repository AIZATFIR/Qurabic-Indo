import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NAFS_STAGES,
  MAWATIN_STAGES,
  TRANSMUTATION_SPECTRUM,
  BREATH_PACING_TECHNIQUES,
  DOS_PROGRAM_PRINCIPLES,
  IBN_ARABI_KHALWA_RULES,
} from './lib/spiritual-framework';
import {
  ASMAUL_HUSNA_DATA,
  searchAsmaulHusna,
  CURATED_HADITHS,
  searchHadithByTheme,
  fetchPrayerTimes,
} from './lib/api-expansion';

test('Rahm Spiritual Framework - 7 Nafs Stages', () => {
  assert.equal(NAFS_STAGES.length, 7, 'Must define exactly 7 stages of Nafs');
  
  NAFS_STAGES.forEach((stage, idx) => {
    assert.equal(stage.level, idx + 1);
    assert.ok(stage.arabicName.length > 0);
    assert.ok(stage.transliteration.length > 0);
    assert.ok(stage.quranicReference.surah > 0);
    assert.ok(stage.quranicReference.ayah > 0);
    assert.ok(stage.quranicReference.textArabic.length > 0);
    assert.ok(stage.quranicReference.textIndo.length > 0);
  });

  assert.equal(NAFS_STAGES[0].transliteration, 'Nafs al-Ammarah');
  assert.ok(NAFS_STAGES[6].transliteration.includes('Nafs al-Kamilah'));
});

test('Rahm Spiritual Framework - 6 Mawatin (Ibn Arabi)', () => {
  assert.equal(MAWATIN_STAGES.length, 6, 'Must define 6 Mawatin of Ibn Arabi');
  MAWATIN_STAGES.forEach((m, idx) => {
    assert.equal(m.number, idx + 1);
    assert.ok(m.titleIndo.length > 0);
    assert.ok(m.innerState.length > 0);
  });
});

test('Rahm Spiritual Framework - Ibn Arabi Khalwa Rules', () => {
  assert.ok(IBN_ARABI_KHALWA_RULES.length >= 4);
  IBN_ARABI_KHALWA_RULES.forEach((rule) => {
    assert.ok(rule.principle.length > 0);
    assert.ok(rule.ruleArabic.length > 0);
    assert.ok(rule.ruleIndo.length > 0);
    assert.ok(rule.practicalAction.length > 0);
  });
});

test('Rahm Spiritual Framework - DOS Awakening Principles', () => {
  assert.equal(DOS_PROGRAM_PRINCIPLES.length, 3);
  assert.equal(DOS_PROGRAM_PRINCIPLES[0].step, 'D');
  assert.equal(DOS_PROGRAM_PRINCIPLES[1].step, 'O');
  assert.equal(DOS_PROGRAM_PRINCIPLES[2].step, 'S');
});

test('Rahm Spiritual Framework - Transmutation Spectrum', () => {
  assert.ok(TRANSMUTATION_SPECTRUM.length >= 6);
  TRANSMUTATION_SPECTRUM.forEach((t) => {
    assert.ok(t.shadow.length > 0);
    assert.ok(t.gift.length > 0);
    assert.ok(t.siddhi.length > 0);
    assert.ok(t.asmaulHusna.arabic.length > 0);
    assert.ok(t.quranicAyah.surah > 0);
  });
});

test('Rahm API Expansion - Asmaul Husna 99 Names Engine', () => {
  assert.ok(ASMAUL_HUSNA_DATA.length >= 25);
  
  // Test search
  const rahmanResults = searchAsmaulHusna('rahman');
  assert.ok(rahmanResults.length >= 1);
  assert.equal(rahmanResults[0].arabic, 'الرَّحْمَـٰنُ');

  const rootResults = searchAsmaulHusna('r-h-m');
  assert.ok(rootResults.length >= 2);

  const meaningResults = searchAsmaulHusna('pengasih');
  assert.ok(meaningResults.length >= 1);
});

test('Rahm API Expansion - Curated Hadith Search', () => {
  assert.ok(CURATED_HADITHS.length >= 5);
  const muraqabahHadith = searchHadithByTheme('muraqabah');
  assert.ok(muraqabahHadith.length >= 1);
  assert.equal(muraqabahHadith[0].authenticity, 'Shahih');
});

test('Rahm API Expansion - Prayer Times Fetcher with Fallback', async () => {
  const result = await fetchPrayerTimes();
  assert.ok(result.fajr.includes(':'));
  assert.ok(result.dhuhr.includes(':'));
  assert.ok(result.asr.includes(':'));
  assert.ok(result.maghrib.includes(':'));
  assert.ok(result.isha.includes(':'));
  assert.ok(result.locationName.length > 0);
});
