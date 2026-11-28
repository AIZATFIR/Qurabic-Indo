const LOCATIVE_BASES = [
  'dalam', 'antara', 'atas', 'bawah', 'belakang', 'hadapan', 'samping', 'sisi',
  'sekitar', 'sekeliling', 'sana', 'sini', 'situ', 'tengah', 'dunia', 'akhirat',
  'bumi', 'surga', 'neraka', 'rumah', 'negeri', 'tempat', 'laut', 'kota',
];

const FUSED_LOCATIVE_PREPOSITION = new RegExp(`\\bdi(?=${LOCATIVE_BASES.join('|')})`, 'gi');

/** Fixes a common Quran.com Indonesian WBW spelling issue without changing the gloss. */
export function normalizeIndonesianWbwGloss(gloss: string): string {
  return gloss.replace(FUSED_LOCATIVE_PREPOSITION, (preposition) => `${preposition} `);
}
