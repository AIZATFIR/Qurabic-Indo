'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, ExternalLink } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { useLanguage } from '@/lib/context/LanguageContext';
import OmniSearch from '@/components/OmniSearch';
import IlluminatedQuranHero from '@/components/IlluminatedQuranHero';

const STARTING_ROOT_IDS = ['S-l-w', 'S-b-r', 'E-l-m', 'r-H-m', 'k-t-b', 'q-w-l'];
const STARTING_ROOTS = STARTING_ROOT_IDS.flatMap((id) => {
  const root = ROOT_DATABASE.find((entry) => entry.id === id);
  return root ? [root] : [];
});

const EXPLORE_LINKS = [
  { href: '/ayat-random', title: ['Ayat acak', 'Random verse'], description: ['Baca satu ayat dan pelajari kata-katanya.', 'Read a verse and explore its words.'] },
  { href: '/morfologi', title: ['Indeks akar kata', 'Root index'], description: ['Telusuri akar, bentuk kata, dan ayat tempatnya digunakan.', 'Browse roots, word forms, and the verses where they occur.'] },
  { href: '/rekomendasi', title: ['Bahan belajar', 'Learning resources'], description: ['Temukan video dan aplikasi untuk melanjutkan belajar.', 'Find videos and apps for further study.'] },
];

export default function HomePage() {
  const { language, t } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [lastSearch, setLastSearch] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    try {
      setLastSearch(localStorage.getItem('qurabic_last_search'));
    } catch {
      // Reading and search remain available when browser storage is disabled.
    }
  }, [isSearchOpen]);

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 pb-16 sm:pb-24 font-sans">
      <IlluminatedQuranHero
        onOpenSearch={() => setIsSearchOpen(true)}
        lastSearch={lastSearch || undefined}
      />

      <nav aria-label={t('Jelajahi Qurabic', 'Explore Qurabic')} className="border-y border-hairline divide-y divide-hairline">
        {EXPLORE_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group grid grid-cols-[1fr_auto] sm:grid-cols-[13rem_1fr_auto] gap-x-6 gap-y-1 items-center py-4 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset hover:bg-canvas-soft transition-colors"
          >
            <span className="text-lg font-medium text-ink-primary group-hover:text-primary">{t(item.title[0], item.title[1])}</span>
            <span className="row-start-2 sm:row-start-auto text-base leading-relaxed text-ink-secondary">{t(item.description[0], item.description[1])}</span>
            <ArrowRight className="col-start-2 sm:col-start-3 row-start-1 h-5 w-5 text-primary" aria-hidden="true" />
          </Link>
        ))}
      </nav>

      <section aria-labelledby="roots-heading" className="pt-12 sm:pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="roots-heading" className="text-2xl font-semibold tracking-tight text-ink-primary">{t('Mulai dari akar kata', 'Start with a root')}</h2>
          <Link href="/morfologi" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">
            {t('Lihat semua akar', 'Browse all roots')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-secondary">
          {t("Lihat berbagai bentuk dari satu akar beserta kemunculannya dalam Al-Qur'an.", 'Explore the forms of a root and where they occur in the Quran.')}
        </p>
        <ul className="mt-6 divide-y divide-hairline border-y border-hairline">
          {STARTING_ROOTS.map((root) => {
            const bookmarked = isBookmarked(root.id);
            return (
              <li key={root.id} className="flex items-center gap-3 sm:gap-5 py-2">
                <Link
                  href={`/akar/${root.id}`}
                  aria-label={t(`Pelajari akar ${root.rootArabic}, ${root.totalOccurrences} kemunculan`, `Explore root ${root.rootArabic}, ${root.totalOccurrences} occurrences`)}
                  className="group grid min-w-0 flex-1 grid-cols-[1fr_auto] sm:grid-cols-[11rem_1fr_auto] gap-x-5 gap-y-1 items-center py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:text-primary"
                >
                  <span lang="ar" dir="rtl" className="justify-self-start font-arabic text-3xl leading-loose text-ink-primary group-hover:text-primary">{root.rootArabic}</span>
                  <span className="col-start-1 row-start-2 sm:col-start-2 sm:row-start-1 text-base text-ink-secondary">{root.rootLatin}</span>
                  <span className="col-start-2 sm:col-start-3 row-start-1 row-span-2 sm:row-span-1 text-right text-base tabular-nums text-ink-secondary">
                    {root.totalOccurrences.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')}<span className="hidden sm:inline">{t(' kemunculan', ' occurrences')}</span><span className="block sm:hidden text-sm">{t('kemunculan', 'occurrences')}</span>
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label={`${bookmarked ? t('Hapus simpanan', 'Remove saved root') : t('Simpan akar', 'Save root')} ${root.rootArabic}`}
                  aria-pressed={bookmarked}
                  onClick={() => toggleBookmark(root.id, root.rootArabic)}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-primary hover:bg-canvas-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="sources-heading" className="pt-12 sm:pt-16">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="sources-heading" className="text-2xl font-semibold tracking-tight text-ink-primary">{t('Kenali rujukannya', 'Know the sources')}</h2>
          <Link href="/tentang" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">
            {t('Tentang data', 'About the data')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <dl className="mt-5 space-y-5 text-base leading-relaxed">
          <div className="sm:grid sm:grid-cols-[13rem_1fr] gap-x-6">
            <dt className="font-medium text-ink-primary">{t('Teks dan terjemahan', 'Text and translation')}</dt>
            <dd className="mt-1 sm:mt-0 text-ink-secondary">{t('Terjemahan Indonesia Kemenag RI melalui Quran.com. Makna kata dibaca bersama konteks ayatnya.', 'Verse translations: Kemenag RI (Indonesian) and Saheeh International (English), via Quran.com. Word-by-word glosses are a separate resource.')}</dd>
          </div>
          <div className="sm:grid sm:grid-cols-[13rem_1fr] gap-x-6">
            <dt className="font-medium text-ink-primary">{t('Akar dan morfologi', 'Roots and morphology')}</dt>
            <dd className="mt-1 sm:mt-0 text-ink-secondary">
              {t('Anotasi kata dari', 'Word annotations from')}{' '}
              <a href="https://corpus.quran.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 focus-visible:outline-primary">
                Quranic Arabic Corpus<ExternalLink className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" /><span className="sr-only">{t(' (buka tab baru)', ' (opens a new tab)')}</span>
              </a>.
            </dd>
          </div>
          <div className="sm:grid sm:grid-cols-[13rem_1fr] gap-x-6">
            <dt className="font-medium text-ink-primary">{t('Leksikon klasik', 'Classical lexicon')}</dt>
            <dd className="mt-1 sm:mt-0 text-ink-secondary">{t("Lane's Arabic-English Lexicon ditampilkan dalam bahasa Inggris aslinya, dengan rujukan jilid dan halaman pada entri yang tersedia.", "Lane's Arabic-English Lexicon is shown in its original English, with volume and page references for available entries.")}</dd>
          </div>
        </dl>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Makna terjemahan, catatan morfologi, dan definisi kamus menjelaskan hal yang berbeda. Periksa label sumber pada setiap entri.', 'Translations, morphology notes, and dictionary definitions serve different purposes. Check the source label on each entry.')}</p>
      </section>

      <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
