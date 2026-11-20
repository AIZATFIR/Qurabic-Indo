import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { filterOtherArabicForms, type ArramoozForm } from './arramooz-shared';
import { getArramoozForms } from './arramooz';

describe('Arramooz supplemental forms', () => {
  it('removes forms already listed in the Quranic family regardless of diacritics', () => {
    const records: ArramoozForm[] = [
      { arabic: 'صَبْرٌ', pos: 'noun', wordType: 'مصدر', wazn: 'فَعْل', definition: 'الحبس' },
      { arabic: 'صَابِرٌ', pos: 'noun', wordType: 'اسم', wazn: 'فَاعِل', definition: 'الصابر' },
    ];
    assert.deepEqual(filterOtherArabicForms(records, ['صبر']), [records[1]]);
  });

  it('provides non-Quranic forms from the cited root dictionary', () => {
    const records = getArramoozForms('S-b-r');
    assert.ok(records.some((record) => record.pos === 'verb' && record.arabic === 'صَبَرَ'));
    assert.ok(records.some((record) => record.pos === 'noun' && record.wazn && record.definition));
  });

  it('caps visible results without losing the full result count', () => {
    const records = Array.from({ length: 20 }, (_, index) => ({ arabic: `كلمة${index}`, pos: 'noun' as const }));
    assert.equal(filterOtherArabicForms(records, []).slice(0, 12).length, 12);
    assert.equal(filterOtherArabicForms(records, []).length, 20);
  });
});
