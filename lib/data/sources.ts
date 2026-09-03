/**
 * Qurabic Central Source Registry (Source of Truth)
 * 
 * Every factual user-facing content item in Qurabic must map to an authoritative,
 * traceable, and verified data source registered here.
 * 
 * Invariant: AI is an engineering orchestration tool, NOT a content authority.
 */

import { SourceRegistry } from '../lexicon/types';

export interface SourceMetadata extends SourceRegistry {
  id: string;
  name: string;
  shortName: string;
  authority: string;
  url: string;
  version?: string;
  license?: string;
  description: string;
  edition?: string;
  language: 'ar' | 'en' | 'id';
  retrievalDate?: string;
}

export const SOURCES_REGISTRY: Record<
  'quranText' | 'translation' | 'morphology' | 'lexicon' | 'laneLexicon' | 'recitation',
  SourceMetadata
> = {
  quranText: {
    id: 'quran-text',
    name: "Mushaf Al-Qur'an Standar Indonesia & Tanzil Uthmani",
    shortName: 'Mushaf Utsmani',
    authority: "Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ) & Quran.com API v4 / Tanzil Project",
    url: 'https://quran.com',
    version: 'Rasm Utsmani Standar Madinah & Standar Kemenag RI (6.236 Ayat)',
    license: 'Open Access for Non-Commercial Quranic Research',
    language: 'ar',
    description: "Teks ayat suci Al-Qur'an digital dengan rasm Utsmani berharakat lengkap, terverifikasi sesuai mushaf standar resmi.",
  },
  translation: {
    id: 'kemenag-translation',
    name: "Al-Qur'an dan Terjemahannya (Kementerian Agama RI)",
    shortName: 'Terjemahan Kemenag RI',
    authority: "Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ), Kementerian Agama Republik Indonesia",
    url: 'https://quran.kemenag.go.id',
    version: 'Edisi Penyempurnaan Resmi Kemenag RI',
    license: 'Hak Cipta Kementerian Agama Republik Indonesia',
    language: 'id',
    description: "Terjemahan resmi berbahasa Indonesia yang diterbitkan dan ditashih oleh Tim Pakar Al-Qur'an Kementerian Agama RI.",
  },
  morphology: {
    id: 'quranic-arabic-corpus',
    name: 'The Quranic Arabic Corpus (Morphological & Syntactic Database)',
    shortName: 'Quranic Corpus',
    authority: 'Language Research Group, School of Computing, University of Leeds (Dr. Kais Dukes et al.)',
    url: 'https://corpus.quran.com',
    version: 'Corpus Morphology v0.4',
    edition: 'Leeds QAC Computational Treebank',
    license: 'GNU General Public License (GPL)',
    language: 'ar',
    description: 'Anotasi tata bahasa komputasional, penandaan kelas kata (Part-of-Speech/POS), dan dekomposisi morfologi Sharaf per kata.',
  },
  lexicon: {
    id: 'classical-arabic-lexicon',
    name: 'Kajian Leksikografi & Kamus Bahasa Arab Klasik',
    shortName: "Leksikografi Mu'jam",
    authority: "Leksikon Bahasa Arab Klasik (Referensi: Hans Wehr, Lisan al-'Arab, & Mu'jam Al-Mufradat karya Ar-Raghib Al-Ashfahani)",
    url: 'https://corpus.quran.com/qurandictionary.jsp',
    version: 'Classical Arabic Lexicography',
    license: 'Academic & Scholarly Domain',
    language: 'ar',
    description: "Catatan makna leksikal dan semantik akar kata berdasarkan rujukan kamus bahasa Arab klasik dan kajian leksikografi Al-Qur'an.",
  },
  laneLexicon: {
    id: 'lane-arabic-english-lexicon',
    name: "Edward William Lane: An Arabic-English Lexicon (8 Volumes)",
    shortName: "Lane's Lexicon",
    authority: 'Edward William Lane (London: Williams and Norgate, 1863-1893) / Perseus Digital Library (Tufts University) & Alpheios Project',
    url: 'https://www.perseus.tufts.edu/hopper/collection?collection=Perseus:collection:Arabic',
    version: 'Book I, Parts 1-8 (Unabridged Perseus XML Transcription)',
    edition: 'London 1863-1893 (Perseus/Alpheios Digitized)',
    license: 'Creative Commons Attribution-ShareAlike 3.0 (CC BY-SA 3.0)',
    language: 'en',
    description: 'Leksikon bahasa Arab-Inggris klasik terlengkap yang merangkum rujukan Taj al-Arus, Lisan al-Arab, As-Sihah, dan Al-Qamus Al-Muhit dengan kutipan jilid dan halaman asli.',
  },
  recitation: {
    id: 'alafasy-recitation',
    name: 'Tilawah Al-Qur\'an Per-Ayat Syaikh Mishary Rashid Al-Afasy',
    shortName: 'Tilawah Al-Afasy',
    authority: 'EveryAyah Project & QuranCDN (High-Availability Audio Repository)',
    url: 'https://everyayah.com',
    version: '128kbps HQ Murattal',
    license: 'Public Islamic Resource',
    language: 'ar',
    description: 'Rekaman audio tilawah Al-Qur\'an otentik berkualitas tinggi yang disinkronisasikan per ayat untuk mendukung tadabbur bacaan.',
  },
};

/**
 * Returns metadata for a specific content domain
 */
export function getSourceInfo(domain: keyof typeof SOURCES_REGISTRY): SourceMetadata {
  return SOURCES_REGISTRY[domain];
}
