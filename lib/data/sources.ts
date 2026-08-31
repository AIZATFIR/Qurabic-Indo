/**
 * Qurabic Central Source Registry (Source of Truth)
 * 
 * Every factual user-facing content item in Qurabic must map to an authoritative,
 * traceable, and verified data source registered here.
 * 
 * Invariant: AI is an engineering orchestration tool, NOT a content authority.
 */

export interface SourceMetadata {
  id: string;
  name: string;
  shortName: string;
  authority: string;
  url: string;
  version?: string;
  license?: string;
  description: string;
}

export const SOURCES_REGISTRY: Record<
  'quranText' | 'translation' | 'morphology' | 'lexicon' | 'recitation',
  SourceMetadata
> = {
  quranText: {
    id: 'quran-text',
    name: 'Mushaf Al-Qur\'an Standar Indonesia & Tanzil Uthmani',
    shortName: 'Mushaf Utsmani',
    authority: 'Lajnah Pentashihan Mushaf Al-Qur\'an (LPMQ) & Quran.com API v4 / Tanzil Project',
    url: 'https://quran.com',
    version: 'Rasm Utsmani Standar Madinah & Standar Kemenag RI (6.236 Ayat)',
    license: 'Open Access for Non-Commercial Quranic Research',
    description: 'Teks ayat suci Al-Qur\'an digital dengan rasm Utsmani berharakat lengkap, terverifikasi sesuai mushaf standar resmi.',
  },
  translation: {
    id: 'kemenag-translation',
    name: 'Al-Qur\'an dan Terjemahannya (Kementerian Agama RI)',
    shortName: 'Terjemahan Kemenag RI',
    authority: 'Lajnah Pentashihan Mushaf Al-Qur\'an (LPMQ), Kementerian Agama Republik Indonesia',
    url: 'https://quran.kemenag.go.id',
    version: 'Edisi Penyempurnaan Resmi Kemenag RI',
    license: 'Hak Cipta Kementerian Agama Republik Indonesia',
    description: 'Terjemahan resmi berbahasa Indonesia yang diterbitkan dan ditashih oleh Tim Pakar Al-Qur\'an Kementerian Agama RI.',
  },
  morphology: {
    id: 'quranic-arabic-corpus',
    name: 'The Quranic Arabic Corpus (Morphological & Syntactic Database)',
    shortName: 'Quranic Corpus',
    authority: 'Language Research Group, School of Computing, University of Leeds (Dr. Kais Dukes et al.)',
    url: 'https://corpus.quran.com',
    version: 'Corpus Morphology v0.4',
    license: 'GNU General Public License (GPL)',
    description: 'Anotasi tata bahasa komputasional, penandaan kelas kata (Part-of-Speech/POS), dan dekomposisi morfologi Sharaf per kata.',
  },
  lexicon: {
    id: 'classical-arabic-lexicon',
    name: 'Leksikografi Bahasa Arab Klasik & Mu\'jam Al-Mufahras',
    shortName: 'Kamus Leksikografi Klasik',
    authority: 'Hans Wehr (ed. J. Milton Cowan), Muhammad Fu\'ad Abdul Baqi, Ibn Faris, & Ibn Manzhur',
    url: 'https://corpus.quran.com/qurandictionary.jsp',
    version: 'Mu\'jam Maqayis al-Lughah, Lisan al-Arab, Al-Mufradat, & Hans Wehr 4th Ed.',
    license: 'Academic & Scholarly Domain',
    description: 'Indeks akar kata Al-Qur\'an (154 akar kata terindeks), medan semantik klasik, dan penjelasan morfologi Sharaf.',
  },
  recitation: {
    id: 'alafasy-recitation',
    name: 'Tilawah Al-Qur\'an Per-Ayat Syaikh Mishary Rashid Al-Afasy',
    shortName: 'Tilawah Al-Afasy',
    authority: 'EveryAyah Project & QuranCDN (High-Availability Audio Repository)',
    url: 'https://everyayah.com',
    version: '128kbps HQ Murattal',
    license: 'Public Islamic Resource',
    description: 'Rekaman audio tilawah Al-Qur\'an otentik berkualitas tinggi yang disinkronisasikan per ayat untuk mendukung tadabbur bacaan.',
  },
};

/**
 * Returns metadata for a specific content domain
 */
export function getSourceInfo(domain: keyof typeof SOURCES_REGISTRY): SourceMetadata {
  return SOURCES_REGISTRY[domain];
}
