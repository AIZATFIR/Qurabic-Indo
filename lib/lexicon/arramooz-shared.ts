export interface ArramoozForm {
  arabic: string;
  pos: 'noun' | 'verb';
  wordType?: string;
  wazn?: string;
  definition?: string;
}

export function filterOtherArabicForms(records: ArramoozForm[], quranicForms: string[]): ArramoozForm[] {
  const normalize = (value: string) => value
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, '')
    .replace(/[\u0622\u0623\u0625\u0671]/g, 'ا')
    .trim();
  const known = new Set(quranicForms.map(normalize));
  return records.filter((record) => record.arabic && !known.has(normalize(record.arabic)));
}
