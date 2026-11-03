'use client';

import Link from 'next/link';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/lib/context/LanguageContext';

const THIRD_PARTY_DEPENDENCIES = [
  ['React Virtuoso', 'MIT', 'https://github.com/petyosi/react-virtuoso'],
  ['Lucide React', 'ISC', 'https://lucide.dev/license'],
  ['Sonner', 'MIT', 'https://github.com/emilkowalski/sonner'],
  ['Framer Motion', 'MIT', 'https://github.com/motiondivision/motion'],
];

export default function TentangPage() {
  const { t } = useLanguage();
  const sources = [
    ['Quran.com', 'https://quran.com', t('Teks Arab, terjemahan ayat Kemenag RI (resource 33), Saheeh International (resource 20), serta terjemahan per kata Indonesia dan Inggris. Terjemahan per kata tidak disamakan dengan terjemahan ayat Kemenag.', 'Arabic text, Indonesian Kemenag verse translation (resource 33), Saheeh International (resource 20), and Indonesian and English word-by-word translations. Word-by-word glosses are distinct from the Kemenag verse translation.')],
    ['Quranic Arabic Corpus', 'https://corpus.quran.com/download/', t('Data morfologi v0.4: segmentasi kata, akar, lemma, kelas kata, dan fitur gramatikal. Label Indonesia/Inggris pada aplikasi adalah penyajian data tersebut, bukan kutipan tafsir.', 'Morphology v0.4: word segmentation, roots, lemmas, parts of speech, and grammatical features. Interface labels explain these annotations; they are not tafsir quotations.')],
    ['Lane’s Arabic–English Lexicon', 'https://github.com/alpheios-project/lexicon', t('Kutipan leksikon klasik dalam bahasa Inggris, dengan jilid dan halaman dari transkripsi digital. Satu akar dapat memiliki beberapa makna; kutipan akar tidak otomatis menjadi arti setiap turunannya. Kesalahan transkripsi dapat terjadi.', 'Classical English lexicon excerpts with volume and page references from the digital transcription. A root may have several senses; a root entry does not define every derivative. Digital transcription errors may occur.')],
    ['Tafsir Kemenag · quran-json', 'https://github.com/rioastamal/quran-json', t('Tafsir Indonesia diambil dari arsip quran-json karya Rio Astamal, yang menyebut Kemenag sebagai sumbernya. Jika teks tidak tersedia, aplikasi tidak mengarang penggantinya.', 'Indonesian tafsir is retrieved from Rio Astamal’s quran-json archive, which credits Kemenag. Missing tafsir is not replaced with generated commentary.')],
    ['EveryAyah · English translation audio', 'https://everyayah.com/recitations_ayat.html', t('Terjemahan Sahih International dibacakan Ibrahim Walk, per ayat. Rekaman berbahasa Inggris ini dipakai saat antarmuka memakai bahasa Inggris.', 'Sahih International translation read by Ibrahim Walk, per verse. These English recordings are used when the interface is in English.')],
    ['Internet Archive · Indonesian translation audio', 'https://archive.org/details/AlQuran-terjemahan-indonesia-tanpa-bahasa-arab', t('Arsip rekaman terjemahan Indonesia. Berkas tersedia untuk 76 surat; surat 3–39, 42, serta ayat 69:38–52 tidak ada di koleksi ini. Rekaman yang tidak tersedia dilewati.', 'Archive of Indonesian translation recordings. Files are available for 76 surahs; surahs 3–39 and 42, plus verses 69:38–52, are missing from this collection. Missing recordings are skipped.')],
    ['Quranic Universal Library (QUL)', 'https://qul.tarteel.ai/resources/morphology', t('Rujukan untuk dataset akar, lemma, stem, terjemahan per kata, dan audio. QUL menyediakan unduhan dataset, bukan API umum atau pengganti kamus makna akar. Belum semua resource QUL diimpor ke aplikasi.', 'A resource for root, lemma, stem, word-by-word translation, and audio datasets. QUL offers dataset downloads rather than a public API or a substitute for a root lexicon. Not all QUL resources are imported into this app.')],
  ];
  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-10 sm:py-16 text-base leading-relaxed text-ink-primary">
      <div className="flex items-center justify-between gap-4 mb-10"><Link href="/" className="text-primary hover:underline">{t('Kembali ke beranda', 'Back to home')}</Link><LanguageSelector /></div>
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t('Tentang dan sumber', 'About and sources')}</h1>
      <p className="mt-5">{t('Qurabic membantu pembaca mempelajari kosakata dan struktur bahasa Al-Qur’an. Terjemahan, anotasi morfologi, dan kutipan kamus ditampilkan sebagai jenis rujukan yang berbeda.', 'Qurabic helps readers study Quranic vocabulary and language structure. Translations, morphological annotations, and dictionary excerpts are presented as distinct types of evidence.')}</p>
      <h2 className="text-2xl font-semibold mt-12 mb-5">{t('Asal konten', 'Content sources')}</h2>
      <dl className="space-y-7">{sources.map(([name, url, description]) => <div key={name}><dt className="font-semibold"><a href={url} target="_blank" rel="noreferrer" className="text-primary underline underline-offset-4">{name}</a></dt><dd className="mt-2">{description}</dd></div>)}</dl>
      <h2 className="text-2xl font-semibold mt-12 mb-5">{t('Batas dan tanggung jawab', 'Limits and accountability')}</h2>
      <p>{t('Aplikasi dikembangkan dengan bantuan AI untuk kode dan antarmuka. Teks dari sumber tetap perlu dibedakan dari penjelasan buatan aplikasi. Narasi etimologi dan tasrif otomatis yang belum dapat dibuktikan tidak ditampilkan sebagai fakta kamus dalam entry kata. Ketiadaan data ditandai, bukan diisi dengan dugaan.', 'AI assisted software and interface development. Source text must remain distinct from app-authored explanation. Unverified generated etymology and conjugation are excluded from word entries. Missing data is identified rather than filled with guesses.')}</p>
      <p className="mt-4">{t('Ini alat bantu belajar, bukan pengganti guru, kamus lengkap, atau tafsir. Jika ada kesalahan, sertakan surat, nomor ayat, kata, dan rujukan pembanding saat melaporkannya.', 'This is a learning aid, not a substitute for a teacher, a complete dictionary, or tafsir. To report an error, include the surah, verse, word, and supporting reference.')}</p>
      <a href="https://github.com/AIZATFIR/Qurabic-Indo/issues" target="_blank" rel="noreferrer" className="inline-block text-primary underline underline-offset-4 mt-5 min-h-11 py-2">{t('Laporkan kesalahan data atau aplikasi', 'Report a data or app error')}</a>
      <h2 className="text-2xl font-semibold mt-12 mb-5">{t('Bahasa dan atribusi', 'Language and attribution')}</h2>
      <p>{t('Mode Indonesia–English memakai terjemahan Indonesia dan mempertahankan kutipan Lane dalam bahasa Inggris. Mode English menggunakan terjemahan Inggris dan label berbahasa Inggris pada alur utama. Rekaman terjemahan yang tersedia tetap berbahasa Indonesia dan diberi label. Atribusi serta ketentuan tiap penyedia tetap berlaku; akses publik tidak berarti semua dataset bebas lisensi.', 'Indonesia–English mode uses Indonesian translations and retains Lane excerpts in English. English mode uses English translations and labels for the main reading and word-study flows. Available translation recordings remain in Indonesian and are labeled accordingly. Each provider’s attribution and terms apply; public access does not make every dataset unrestricted.')}</p>
      <h2 className="text-2xl font-semibold mt-12 mb-5">{t('Pustaka perangkat lunak', 'Software acknowledgements')}</h2>
      <ul className="space-y-3">{THIRD_PARTY_DEPENDENCIES.map(([name, license, url]) => <li key={name}><a className="text-primary underline underline-offset-4" href={url} target="_blank" rel="noreferrer">{name}</a> · {license}</li>)}</ul>
    </article>
  );
}
