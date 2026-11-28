/**
 * Qurabic Central Source Registry (Source of Truth)
 * 
 * User-facing source claims and editorial notes are registered here.
 * A citation records provenance; it does not certify that every record was independently verified.
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
  'quranText' | 'translation' | 'wordTranslation' | 'maqamGloss' | 'maqamTextBasis' | 'morphology' | 'particleGloss' | 'editorialWordGloss' | 'lexicon' | 'laneLexicon' | 'quranBilQuran' | 'tajRootIndex' | 'recitation' | 'offlineContent',
  SourceMetadata
> = {
  offlineContent: {
    id: 'quran-foundation-content-sync',
    name: 'Quran Foundation Content Sync',
    nameEnglish: 'Quran Foundation Content Sync',
    shortName: 'QF Content Sync',
    authority: 'Quran Foundation',
    url: 'https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/',
    version: 'quran_core:1 · translations:20,33 · recitations:7',
    license: 'Subject to Quran Foundation Developer Terms',
    language: 'ar',
    description: 'Kanal resmi untuk menyinkronkan teks Al-Qur’an, terjemahan, serta metadata tilawah Al-Afasy untuk pemutaran offline yang diminta pengguna.',
    descriptionEnglish: 'The approved source for syncing Quran text, verse translations, and Al-Afasy recitation metadata for user-requested offline playback.',
  },
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
    name: 'Quran.com — terjemahan per kata',
    nameEnglish: 'Quran.com — word-by-word translation',
    shortName: 'Quran.com WBW',
    descriptionEnglish: 'Indonesian and English contextual word translations requested from Quran.com API v4 by verse and word location. The API response does not identify the individual translator, so word glosses are not attributed to Kemenag. This is not a root dictionary definition.',
    authority: 'Quran.com API v4',
    url: 'https://api-docs.quran.com/docs/content_apis_versioned/4.0.0/verses-by-chapter-number',
    language: 'id',
    description: 'Terjemahan kontekstual per kata Indonesia dan Inggris diminta dari Quran.com API v4 berdasarkan koordinat surah, ayat, dan kata. Respons API tidak mencantumkan nama penerjemah; glos ini tidak diatribusikan sebagai terjemahan Kemenag. Berbeda dari terjemahan utuh ayat dan definisi kamus akar.',
  },
  maqamGloss: {
    id: 'maqam-quranic-corpus-gloss',
    name: 'MAQAM — glos leksikal Inggris',
    nameEnglish: 'MAQAM — English lexical gloss',
    shortName: 'MAQAM gloss',
    authority: 'CAMeL Lab · MAQAM Quranic Corpus',
    url: 'https://aclanthology.org/2026.arabicnlp-main.11/',
    version: 'ArabicNLP 2026 · CC BY 4.0',
    license: 'CC BY 4.0 · attribution required',
    language: 'en',
    description: 'Glos Inggris untuk bentuk dasar dari MAQAM (Saeed dkk., 2026; dataset CC BY 4.0). Ditampilkan sebagai cadangan saat makna kontekstual Quran.com tidak tersedia; imbuhan atau kata ganti yang melekat mungkin tidak tercakup. Bukan terjemahan ayat, tafsir, atau definisi akar kata.',
    descriptionEnglish: 'English stem glosses from MAQAM (Saeed et al., 2026; dataset CC BY 4.0). Shown as a fallback when Quran.com contextual word meaning is unavailable; attached prefixes or pronouns may not be included. Not a verse translation, tafsir, or root definition.',
  },
  maqamTextBasis: {
    id: 'tanzil-text-basis-for-maqam',
    name: 'Tanzil Project — teks sumber yang dirujuk MAQAM',
    nameEnglish: 'Tanzil Project — source text cited by MAQAM',
    shortName: 'Tanzil source basis',
    authority: 'Tanzil Project',
    url: 'https://tanzil.net/docs/Text_License',
    version: 'CC BY 3.0 · basis teks MAQAM',
    license: 'CC BY 3.0',
    language: 'ar',
    description: 'MAQAM menyatakan datasetnya berdasarkan teks Tanzil. Indeks Qurabic tidak menyalin teks ayat; teks Utsmani yang ditampilkan berasal dari Quran.com API.',
    descriptionEnglish: 'MAQAM states that its dataset is based on Tanzil text. Qurabic’s index does not copy Quran verses; displayed Uthmani text comes from Quran.com API.',
  },
  morphology: {
    id: 'quranic-arabic-corpus',
    name: 'Quranic Arabic Corpus — anotasi morfologi dan sintaksis',
    nameEnglish: 'The Quranic Arabic Corpus (Morphological & Syntactic Database)',
    shortName: 'Quranic Corpus',
    descriptionEnglish: 'QAC v0.4 supplies Quranic roots, lemmas and grammatical annotations. Its download page permits app use with attribution, while its FAQ describes downloaded annotations as non-commercial research data; obtain written clarification before monetized distribution.',
    authority: 'Language Research Group, School of Computing, University of Leeds (Dr. Kais Dukes et al.)',
    url: 'https://corpus.quran.com',
    version: 'Corpus Morphology v0.4',
    edition: 'Leeds QAC Computational Treebank',
    license: 'GNU General Public License; commercial-download terms require written clarification',
    language: 'ar',
    description: 'QAC v0.4 menyediakan akar, lemma, dan anotasi tata bahasa Al-Qur’an. Halaman unduh mengizinkan penggunaan aplikasi dengan atribusi, sementara FAQ menyebut data unduhan untuk riset nonkomersial; perlu klarifikasi tertulis sebelum distribusi yang dimonetisasi.',
  },
  particleGloss: {
    id: 'qurabic-editorial-particle-gloss',
    name: 'Qurabic — catatan partikel berbantuan AI',
    nameEnglish: 'Qurabic — AI-assisted particle notes',
    shortName: 'Catatan partikel AI',
    descriptionEnglish: 'Particle meanings and grammar notes are AI-assisted editorial drafts informed by Quranic Arabic Corpus tags. They have no recorded subject-matter review and are not authoritative dictionary quotations.',
    authority: 'Qurabic AI-assisted editorial draft; no scholar review recorded',
    url: 'https://corpus.quran.com/documentation/morphologicalfeatures.jsp',
    version: 'Concise bilingual particle glossary',
    language: 'id',
    description: 'Catatan makna dan tata bahasa partikel merupakan draf editorial berbantuan AI berdasarkan tag Quranic Arabic Corpus. Belum tercatat ditelaah ahli; bukan kutipan kamus atau terjemahan resmi.',
  },
  editorialWordGloss: {
    id: 'qurabic-editorial-word-gloss',
    name: 'Qurabic — glos kata lama, sumber tidak tercatat',
    nameEnglish: 'Qurabic — legacy editorial word gloss',
    shortName: 'Editorial note · provenance unknown',
    authority: 'Qurabic legacy content; per-entry authorship and source are unrecorded',
    url: '',
    version: 'Legacy word glosses; not independently reviewed',
    language: 'id',
    description: 'Sebagian fallback lama Qurabic tidak memiliki catatan penulis, sumber, atau penelaah per entri. Keterlibatan AI tidak dapat dipastikan. Catatan ini bukan definisi kamus terverifikasi; utamakan glos ayat Quran.com atau kutipan Lane yang tersedia.',
    descriptionEnglish: 'Some legacy Qurabic fallbacks have no per-entry author, source, or reviewer record. AI authorship cannot be determined. These notes are not verified dictionary definitions; prefer the Quran.com verse gloss or a cited Lane entry when available.',
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
  quranBilQuran: {
    id: 'quran-bil-quran-root-index',
    name: 'Quran bil-Quran · root index',
    shortName: 'Quran bil-Quran',
    authority: 'R3GENESI5 project contributors',
    url: 'https://github.com/R3GENESI5/quran-bil-quran',
    version: 'Root index and Mufradat excerpt export',
    license: 'MIT (repository); third-party dataset rights need separate review',
    language: 'en',
    description: 'Repositori menyatakan lisensi MIT. README mengaitkan ringkasan akar dengan Lane dan keluarga semantik dengan Lane serta Maqāyīs al-Lugha, tetapi lisensi repositori tidak dengan sendirinya membuktikan hak atas setiap sumber pihak ketiga yang disertakan. Ekspor lokal tidak memberi rujukan halaman per akar atau menjelaskan apakah ringkasan ditulis atau ditelaah manusia maupun AI. Pernyataan bahwa analisis tematik tidak memakai LLM hanya berlaku untuk pipeline tematik. Kutipan al-Mufradat dicatat sebagai sumber terpisah.',
    descriptionEnglish: 'The repository declares an MIT license. Its README credits root summaries to Lane and semantic families to Lane and Maqāyīs al-Lugha, but the repository license alone does not establish rights to every third-party source it includes. The local export provides no page citation per root and does not document whether summaries were written or reviewed by people or AI. The no-LLM statement applies only to thematic analysis. Al-Mufradat excerpts are listed as a separate source.',
  },
  tajRootIndex: {
    id: 'khorsi-taj-al-arus-roots',
    name: 'Arabic Roots and Derivatives · Tāj al-ʿArūs',
    nameEnglish: 'Arabic Roots and Derivatives · Tāj al-ʿArūs',
    shortName: 'Tāj al-ʿArūs form index',
    authority: 'Ahmed Khorsi project on SourceForge',
    url: 'https://sourceforge.net/projects/arabicrootsandderivatives/',
    version: 'KhorsiCorpus · 142,786 records · Beta · updated 2013-10-23',
    license: 'Creative Commons Attribution-ShareAlike 3.0',
    language: 'ar',
    description: 'Indeks turunan bentuk berharakat, tanpa harakat, stem, dan akar yang diekstrak dari Tāj al-ʿArūs. Tidak berisi definisi atau kelas kata; proyek menandai kumpulan datanya sebagai beta.',
    descriptionEnglish: 'A derived index of vocalized forms, unvocalized forms, stems, and roots extracted from Tāj al-ʿArūs. It contains no definitions or part-of-speech labels; the project marks the dataset as beta.',
    retrievalDate: '2026-11-28',
  },
  recitation: {
    id: 'alafasy-recitation',
    name: 'Tilawah Al-Qur\'an Per-Ayat Syaikh Mishary Rashid Al-Afasy',
    shortName: 'Tilawah Al-Afasy',
    authority: 'Quran Foundation',
    url: 'https://api-docs.quran.com/docs/tutorials/content-sync/getting-started/',
    version: 'Production recitation catalog · Quran Foundation recitation 7',
    license: 'Quran Foundation Developer Terms; maintain required attribution and Content Sync updates.',
    language: 'ar',
    description: 'Build publik memakai katalog qari dan host tilawah Quran Foundation. Audio terjemahan lisan dinonaktifkan sampai rekaman dan hak distribusinya diverifikasi. Sumber qari lain hanya dipakai dalam development; izin distribusinya belum tercatat.',
    descriptionEnglish: 'Public builds use Quran Foundation’s reciter catalog and recitation hosts. Spoken translation audio is disabled until the recordings and distribution rights are verified. Other reciter sources are development-only; their distribution permissions are not recorded.',
  },
};

/**
 * Returns metadata for a specific content domain
 */
export function getSourceInfo(domain: keyof typeof SOURCES_REGISTRY): SourceMetadata {
  return SOURCES_REGISTRY[domain];
}
