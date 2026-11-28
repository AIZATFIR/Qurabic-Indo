'use client';

import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function TermsContent() {
  const { language, t } = useLanguage();
  const isEnglish = language === 'en';

  const sections = isEnglish
    ? [
        {
          title: 'What Qurabic provides',
          body: [
            'Qurabic is an independent reading and study tool for exploring Quranic Arabic. Its word glosses, morphology, root summaries, and dictionary excerpts come from different sources and have different levels of coverage. Qurabic is not a fatwa service or a substitute for a qualified teacher, scholar, or printed mushaf.',
            'A Quran.com word gloss describes a word in its verse. It is not a complete dictionary definition of the root, and a dictionary sense does not necessarily fit every Quranic occurrence.',
          ],
        },
        {
          title: 'Content and sources',
          body: [
            'Arabic Quran text and word coordinates are identified in the app’s source notes. Whole-verse Indonesian translation is attributed to Kemenag RI; the English translation is Saheeh International. Quran.com word-by-word glosses are shown separately because the local export does not identify a translator for every word.',
            'Quranic Arabic Corpus supplies Quranic roots, lemmas, and grammatical annotations. Lane’s Arabic-English Lexicon is shown in its original English with printed citations when an indexed entry is available. Arramooz and Arabic Stop Words provide Arabic forms and classifications; Qurabic does not turn those classifications into dictionary definitions.',
            'Some root summaries come from the Quran bil-Quran dataset. Its project credits its lexical sources, but the export does not give a page citation for each root or document individual review of every summary. Treat those summaries as pointers and compare the cited source text when available.',
            'Tafsir, audio, and other linked material retain the attribution shown beside each item. Availability and source terms can differ by edition or provider. See the source notes for dataset versions, attribution, and known limits.',
          ],
        },
        {
          title: 'Using and sharing content',
          body: [
            'You may use Qurabic’s reading and study features for personal learning. Content remains subject to the terms of its named source. Quran Foundation content is provided within the app experience; its raw data is not offered as a separate dataset, feed, or download. Do not copy or redistribute third-party content unless its source terms allow it.',
            'When an offline text pack is available, it stores Quran text and the Kemenag RI and Saheeh International verse translations on your device. Recitation audio is downloaded separately. Word study, root entries, dictionary search, and tafsir require an internet connection. A first successful online visit is needed before the reader shell can open offline.',
          ],
        },
        {
          title: 'Accuracy and corrections',
          body: [
            'Corpus annotations, digital dictionary text, and translations can contain omissions or errors. Source labels describe where a record came from; they are not a claim that Qurabic independently verified every record. Check the cited source for questions about a specific entry, and consult qualified scholarship for religious rulings.',
            'To report a content or technical issue, use the Qurabic repository. GitHub issues are public, so do not include private or sensitive information.',
          ],
        },
        {
          title: 'Privacy and changes',
          body: [
            'The Privacy Policy explains device storage, network requests, and third-party services. Qurabic may update these terms when the app’s sources or behavior change; the date at the top identifies the latest revision.',
          ],
        },
      ]
    : [
        {
          title: 'Tentang Qurabic',
          body: [
            'Qurabic adalah alat baca dan belajar mandiri untuk menelusuri bahasa Arab Al-Qur’an. Glos kata, morfologi, ringkasan akar, dan kutipan kamus berasal dari sumber berbeda dengan cakupan yang berbeda. Qurabic bukan layanan fatwa dan tidak menggantikan guru, ulama, atau mushaf cetak.',
            'Glos Quran.com menjelaskan kata dalam konteks ayat. Glos itu bukan definisi kamus lengkap untuk akarnya; makna kamus juga tidak otomatis berlaku untuk setiap pemakaian kata dalam Al-Qur’an.',
          ],
        },
        {
          title: 'Konten dan sumber',
          body: [
            'Sumber teks Arab Al-Qur’an dan koordinat kata dijelaskan di catatan sumber aplikasi. Terjemahan ayat bahasa Indonesia diatribusikan kepada Kemenag RI; terjemahan bahasa Inggris kepada Saheeh International. Glos per kata dari Quran.com ditampilkan terpisah karena ekspor lokal tidak mencantumkan penerjemah untuk setiap kata.',
            'Quranic Arabic Corpus menyediakan akar, lemma, dan anotasi tata bahasa Al-Qur’an. Lane’s Arabic-English Lexicon ditampilkan dalam bahasa Inggris aslinya beserta rujukan cetak ketika entri tersedia di indeks. Arramooz dan Arabic Stop Words menyediakan bentuk serta klasifikasi berbahasa Arab; Qurabic tidak mengubah klasifikasi tersebut menjadi definisi kamus.',
            'Sebagian ringkasan akar berasal dari dataset Quran bil-Quran. Proyek itu menyebut sumber leksikalnya, tetapi ekspor tidak memberi nomor halaman untuk setiap akar atau menjelaskan telaah tiap ringkasan. Gunakan ringkasan sebagai petunjuk dan cocokkan dengan teks sumber yang dirujuk jika tersedia.',
            'Tafsir, audio, dan materi tautan lain tetap memakai atribusi yang ditampilkan di sampingnya. Ketersediaan dan ketentuan sumber dapat berbeda menurut edisi atau penyedia. Catatan sumber menjelaskan versi dataset, atribusi, dan batas yang diketahui.',
          ],
        },
        {
          title: 'Penggunaan dan pembagian konten',
          body: [
            'Anda dapat memakai fitur baca dan belajar Qurabic untuk pembelajaran pribadi. Setiap konten tetap mengikuti ketentuan sumber yang disebutkan. Konten Quran Foundation ditampilkan sebagai bagian dari pengalaman aplikasi; data mentahnya tidak disediakan sebagai dataset, feed, atau unduhan terpisah. Jangan menyalin atau membagikan ulang konten pihak ketiga kecuali ketentuan sumber mengizinkannya.',
            'Jika paket teks offline tersedia, paket itu menyimpan teks Al-Qur’an serta terjemahan ayat Kemenag RI dan Saheeh International di perangkat. Audio tilawah diunduh secara terpisah. Bedah kata, entri akar, pencarian kamus, dan tafsir memerlukan internet. Pembaca perlu dibuka online dengan berhasil sebelum dapat dimuat tanpa koneksi.',
          ],
        },
        {
          title: 'Ketepatan dan koreksi',
          body: [
            'Anotasi korpus, teks kamus digital, dan terjemahan dapat memiliki bagian yang hilang atau keliru. Label sumber menunjukkan asal data; label itu bukan klaim bahwa Qurabic telah memeriksa sendiri setiap entri. Periksa sumber yang dirujuk jika ada pertanyaan tentang entri tertentu, dan rujuk ulama yang kompeten untuk penetapan hukum agama.',
            'Untuk melaporkan masalah konten atau teknis, gunakan repositori Qurabic. Issue GitHub bersifat publik, jadi jangan sertakan informasi pribadi atau sensitif.',
          ],
        },
        {
          title: 'Privasi dan perubahan',
          body: [
            'Kebijakan Privasi menjelaskan penyimpanan di perangkat, permintaan jaringan, dan layanan pihak ketiga. Qurabic dapat memperbarui ketentuan ini saat sumber atau perilaku aplikasi berubah; tanggal di bagian atas menunjukkan revisi terbaru.',
          ],
        },
      ];

  const sources = [
    { label: 'Quran Foundation · Developer Terms', href: 'https://api-docs.quran.com/legal/developer-terms/' },
    { label: 'Quranic Arabic Corpus · license and FAQ', href: 'https://corpus.quran.com/faq.jsp' },
    { label: 'Quran bil-Quran · source project', href: 'https://github.com/R3GENESI5/quran-bil-quran' },
    { label: 'Qurabic · source notes', href: '/tentang' },
  ];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-20 pt-8 font-sans sm:px-8 sm:pt-12">
      <Link href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 text-base text-ink-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('Kembali ke beranda', 'Back to home')}
      </Link>

      <header className="border-b border-hairline pb-6">
        <p className="text-sm text-ink-secondary">Qurabic</p>
        <h1 className="mt-2 text-3xl font-semibold text-ink-primary sm:text-4xl">
          {t('Ketentuan penggunaan', 'Terms of use')}
        </h1>
        <p className="mt-3 text-sm text-ink-secondary">
          {t('Terakhir diperbarui 28 November 2026', 'Last updated 28 November 2026')}
        </p>
      </header>

      <div className="divide-y divide-hairline">
        {sections.map((section, index) => (
          <section key={section.title} className="space-y-3 py-6">
            <h2 className="text-lg font-semibold text-ink-primary">{index + 1}. {section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-ink-secondary">{paragraph}</p>
            ))}
          </section>
        ))}
      </div>

      <section aria-labelledby="terms-sources-heading" className="border-t border-hairline pt-6">
        <h2 id="terms-sources-heading" className="text-lg font-semibold text-ink-primary">
          {t('Rujukan dan kebijakan terkait', 'Sources and related policies')}
        </h2>
        <ul className="mt-3 divide-y divide-hairline">
          {sources.map((source) => (
            <li key={source.href}>
              {source.href.startsWith('/') ? (
                <Link href={source.href} className="inline-flex min-h-11 items-center gap-2 text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  {source.label}<ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : (
                <a href={source.href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  {source.label}<ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/privacy" className="inline-flex min-h-11 items-center text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {t('Kebijakan Privasi', 'Privacy Policy')}
          </Link>
          <Link href="/tentang" className="inline-flex min-h-11 items-center text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {t('Tentang dan metodologi', 'About and methodology')}
          </Link>
          <a href="https://github.com/AIZATFIR/Qurabic-Indo/issues" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-base text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
            {t('Laporkan masalah di GitHub', 'Report an issue on GitHub')}
          </a>
        </div>
        <p className="mt-2 text-sm text-ink-secondary">
          {isEnglish
            ? 'GitHub reports are public. Do not include private or sensitive information.'
            : 'Laporan GitHub bersifat publik. Jangan sertakan informasi pribadi atau sensitif.'}
        </p>
      </section>
    </main>
  );
}
