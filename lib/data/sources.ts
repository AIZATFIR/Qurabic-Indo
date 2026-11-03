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
  'quranText' | 'translation' | 'wordTranslation' | 'morphology' | 'lexicon' | 'laneLexicon' | 'recitation',
  SourceMetadata
> = {
  quranText: {
    id: 'quran-text',
    name: 'Quran.com — Teks Utsmani',
    nameEnglish: 'Quran.com — Uthmani text',
    descriptionEnglish: 'Arabic Uthmani text from Quran.com API v4 text_uthmani. This does not certify the Qurabic digital layout as approved by LPMQ.',
    shortName: 'Mushaf Utsmani',
    authority: 'Quran.com API v4',
    url: 'https://quran.com',
    version: 'API v4 · text_uthmani',
    language: 'ar',
    description: 'Teks Arab Utsmani dari field text_uthmani Quran.com API v4. Sumber ini tidak menyatakan bahwa tampilan digital Qurabic telah ditashih LPMQ.',
  },
  translation: {
    id: 'kemenag-translation',
    name: "Al-Qur'an dan Terjemahannya (Kementerian Agama RI)",
    shortName: 'Terjemahan Kemenag RI',
    nameEnglish: 'Indonesian Ministry of Religious Affairs — Verse translation',
    descriptionEnglish: 'Indonesian verse translation (Quran.com resource 33, with API mirrors for fallback). This is separate from word-by-word translations.',
    authority: "Lajnah Pentashihan Mushaf Al-Qur'an (LPMQ), Kementerian Agama Republik Indonesia",
    url: 'https://quran.kemenag.go.id',
    version: 'Quran.com translation resource 33; salinan API eQuran untuk cadangan',
    license: 'Hak Cipta Kementerian Agama Republik Indonesia',
    language: 'id',
    description: "Terjemahan resmi berbahasa Indonesia yang diterbitkan dan ditashih oleh Tim Pakar Al-Qur'an Kementerian Agama RI.",
  },
  wordTranslation: {
    id: 'quran-com-wbw',
    name: 'Quran.com — Word-by-word translation',
    shortName: 'Quran.com WBW',
    descriptionEnglish: 'Indonesian and English word translations from Quran.com API v4, matched by surah, verse and word number. The local export does not identify the individual translator, so word glosses are not attributed to Kemenag. This is not a root dictionary definition.',
    authority: 'Quran.com API v4',
    url: 'https://qul.tarteel.ai/resources/translation',
    language: 'id',
    description: 'Terjemahan per kata Indonesia dan Inggris dari Quran.com API v4, dipasangkan berdasarkan nomor surah, ayat, dan kata. Nama penerjemah tidak disertakan dalam ekspor lokal; tidak diatribusikan sebagai terjemahan Kemenag. Berbeda dari terjemahan utuh ayat dan definisi kamus akar.',
  },
  morphology: {
    id: 'quranic-arabic-corpus',
    name: 'The Quranic Arabic Corpus (Morphological & Syntactic Database)',
    shortName: 'Quranic Corpus',
    descriptionEnglish: 'QAC v0.4 morphology annotations supply part of speech, roots, lemmas and word features. Indonesian grammar labels are interface translations of corpus tags.',
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
    name: 'Quranic Arabic Corpus — Quran Dictionary',
    shortName: 'QAC Dictionary',
    authority: 'Quranic Arabic Corpus',
    url: 'https://corpus.quran.com/qurandictionary.jsp',
    language: 'ar',
    description: 'Indeks akar dan penggunaan kata dalam Quranic Arabic Corpus. Ini bukan kutipan dari Hans Wehr, Lisan al-Arab, atau Al-Mufradat.',
  },
  laneLexicon: {
    id: 'lane-arabic-english-lexicon',
    name: "Edward William Lane: An Arabic-English Lexicon (8 Volumes)",
    shortName: "Lane's Lexicon",
    descriptionEnglish: 'Edward William Lane’s Arabic-English lexicon, digitized by Perseus and corrected by Alpheios; the local index was processed from LexiconDatabase. References follow source part and page numbers. Digital transcription and root matching may contain errors; a root match does not prove that every sense applies to the current word.',
    authority: 'Edward William Lane (London: Williams and Norgate, 1863-1893) / Perseus Digital Library (Tufts University) & Alpheios Project',
    url: 'https://github.com/alpheios-project/lan',
    version: 'Book I, Parts 1-8 (Unabridged Perseus XML Transcription)',
    edition: 'London 1863-1893 (Perseus/Alpheios Digitized)',
    license: 'Teks digital Alpheios: CC BY-SA 3.0 US',
    language: 'en',
    description: 'Transkripsi Inggris-Arab leksikon Edward William Lane, didigitalkan Perseus dan dikoreksi Alpheios; indeks lokal diolah dari LexiconDatabase. Kutipan jilid dan halaman mengikuti data sumber. Transkripsi dan pemetaan akar dapat mengandung kesalahan; padanan akar bukan jaminan bahwa setiap sense berlaku untuk kata ini.',
  },
  recitation: {
    id: 'alafasy-recitation',
    name: 'Tilawah Al-Qur\'an Per-Ayat Syaikh Mishary Rashid Al-Afasy',
    shortName: 'Tilawah Al-Afasy',
    authority: 'EveryAyah Project & QuranCDN (High-Availability Audio Repository)',
    url: 'https://everyayah.com',
    version: '128kbps HQ Murattal',
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
