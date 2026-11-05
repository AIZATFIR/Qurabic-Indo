'use client';

import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, ExternalLink } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useTheme } from '@/lib/context/ThemeContext';
import OmniSearch from '@/components/OmniSearch';
import IlluminatedQuranHero from '@/components/IlluminatedQuranHero';
import RootCard from '@/components/RootCard';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { transliterateRootArabic } from '@/lib/morphology/transliteration';

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
  const { theme, layoutMode } = useTheme();
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

  if (layoutMode === 'classic') {
    const featuredRoot = STARTING_ROOTS[0];
    const sampleForms = featuredRoot
      ? [...featuredRoot.nouns, ...featuredRoot.verbs].sort((a, b) => b.frequency - a.frequency).slice(0, 4)
      : [];

    return (
      <div className="pb-16 sm:pb-24 font-sans">
        <IlluminatedQuranHero onOpenSearch={() => setIsSearchOpen(true)} lastSearch={lastSearch || undefined} />

        {featuredRoot && <section aria-labelledby="root-showcase-heading" className="mx-auto max-w-7xl px-4 sm:px-8">
          <ContainerScroll
            compact
            titleComponent={
              <div className="mb-6 space-y-3">
                <h2 id="root-showcase-heading" className="text-3xl font-semibold tracking-tight text-ink-primary sm:text-5xl">
                  {t('Satu akar, banyak kata.', 'One root, many words.')}
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink-secondary sm:text-lg">
                  {t('Bandingkan bentuk dan frekuensinya di dalam korpus.', 'Compare forms and frequencies in the corpus.')}
                </p>
              </div>
            }
          >
            <div className="flex h-full flex-col bg-[#edf2ed] p-5 text-[#1c2b22] sm:p-8" data-ui="root-corpus-preview">
              <div className="flex items-center justify-between border-b border-[#d9ddd4] pb-4 text-sm">
                <span className="font-semibold">Qurabic · {t('Indeks akar', 'Root index')}</span>
                <span className="text-[#657168]">Quranic Arabic Corpus</span>
              </div>
              <div className="flex flex-1 flex-col justify-center py-5 sm:flex-row sm:items-center sm:gap-10">
                <div className="text-center sm:min-w-56">
                  <p lang="ar" dir="rtl" className="font-arabic text-6xl leading-relaxed text-[#205b43] sm:text-7xl">{featuredRoot.rootArabic}</p>
                  <p className="mt-1 text-lg font-semibold">{transliterateRootArabic(featuredRoot.rootArabic)}</p>
                  <p className="mt-2 text-sm text-[#657168]">{featuredRoot.totalOccurrences.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')} {t('kemunculan', 'occurrences')}</p>
                </div>
                <div className="mt-5 flex-1 border-t border-[#d9ddd4] pt-4 sm:mt-0 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                  <h3 className="mb-3 text-sm font-semibold text-[#526057]">{t('Contoh bentuk dalam korpus', 'Examples in the corpus')}</h3>
                  <ul className="divide-y divide-[#d9ddd4]">
                    {sampleForms.map((form, index) => (
                      <li key={form.id} className={`items-center justify-between gap-4 py-2.5 ${index < 2 ? 'flex' : 'hidden sm:flex'}`}>
                        <span lang="ar" dir="rtl" className="font-arabic text-2xl">{form.arabic}</span>
                        <span className="text-right text-sm text-[#657168]">{form.frequency}×</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#d9ddd4] pt-4">
                <p className="text-xs leading-relaxed text-[#657168]">{t('Frekuensi dan anotasi morfologi bersumber dari Quranic Arabic Corpus.', 'Frequency and morphology annotations are from the Quranic Arabic Corpus.')}</p>
                <Link href={`/akar/${featuredRoot.id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#205b43] hover:underline underline-offset-4 focus-visible:outline-primary">
                  {t('Bedah akar ini', 'Explore this root')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </ContainerScroll>
        </section>}

        <section aria-labelledby="roots-heading" className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 sm:pt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-hairline pb-4">
            <div>
              <h2 id="roots-heading" className="text-2xl font-semibold tracking-tight text-ink-primary sm:text-3xl">{t('Akar kata populer', 'Popular roots')}</h2>
              <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Buka satu akar untuk melihat bentuk korpus, entri leksikon, dan ayat pemakaiannya.', 'Open a root to explore corpus forms, lexicon entries, and verse occurrences.')}</p>
            </div>
            <Link href="/morfologi" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">
              {t('Lihat semua akar', 'Browse all roots')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STARTING_ROOTS.slice(0, 6).map((root) => <RootCard key={root.id} root={root} />)}
          </div>
        </section>

        <nav aria-label={t('Jelajahi Qurabic', 'Explore Qurabic')} className="mx-auto mt-14 max-w-7xl divide-y divide-hairline border-y border-hairline px-5 sm:px-8">
          {EXPLORE_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-4 transition-colors hover:bg-canvas-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:grid-cols-[13rem_1fr_auto] sm:py-5">
              <span className="text-lg font-medium text-ink-primary group-hover:text-primary">{t(item.title[0], item.title[1])}</span>
              <span className="row-start-2 text-base leading-relaxed text-ink-secondary sm:row-start-auto">{t(item.description[0], item.description[1])}</span>
              <ArrowRight className="col-start-2 row-start-1 h-5 w-5 text-primary sm:col-start-3" aria-hidden="true" />
            </Link>
          ))}
        </nav>

        <section aria-labelledby="sources-heading" className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="sources-heading" className="text-2xl font-semibold tracking-tight text-ink-primary">{t('Sumber data', 'Sources')}</h2>
            <Link href="/tentang" className="inline-flex min-h-11 items-center gap-2 text-base font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">{t('Tentang data', 'About the data')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Teks dan terjemahan ayat dari Quran.com (Kemenag RI dan Saheeh International). Akar serta morfologi dari Quranic Arabic Corpus. Definisi klasik ditampilkan sebagai kutipan Lane dengan rujukan volume dan halaman.', 'Verse text and translations from Quran.com (Kemenag RI and Saheeh International). Roots and morphology from the Quranic Arabic Corpus. Classical definitions appear as Lane quotations with volume and page references.')}</p>
        </section>
        <OmniSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    );
  }

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
            className="group grid grid-cols-[1fr_auto] sm:grid-cols-[13rem_1fr_auto] gap-x-6 gap-y-1 items-center py-3 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset hover:bg-canvas-soft transition-colors"
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
        <div className="mt-6">
          {STARTING_ROOTS[0] && (() => {
            const root = STARTING_ROOTS[0];
            const bookmarked = isBookmarked(root.id);
            const featuredStyle: CSSProperties = {
              borderRadius: 'var(--radius-surface)',
              backgroundColor: theme === 'modern' ? 'var(--color-primary)' : theme === 'blend' ? 'var(--color-primary-subdued)' : 'var(--bg-soft)',
              color: theme === 'modern' ? '#fff' : 'var(--color-ink-primary)',
            };
            return (
              <div key={root.id} className="flex items-center gap-4 overflow-hidden px-4 py-4 sm:gap-6 sm:px-7 sm:py-5" style={featuredStyle}>
                <Link
                  href={`/akar/${root.id}`}
                  aria-label={t(`Pelajari akar ${root.rootArabic}, ${root.totalOccurrences} kemunculan`, `Explore root ${root.rootArabic}, ${root.totalOccurrences} occurrences`)}
                  className="group flex min-h-16 min-w-0 flex-1 items-center gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-6"
                >
                  <span lang="ar" dir="rtl" className={`shrink-0 font-arabic text-4xl leading-tight sm:text-5xl ${theme === 'modern' ? 'text-white' : 'text-primary'}`}>{root.rootArabic}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block text-xs font-medium ${theme === 'modern' ? 'text-white/75' : 'text-ink-secondary'}`}>{t('Akar pilihan', 'Featured root')}</span>
                    <span className="mt-1 block text-lg font-semibold group-hover:underline underline-offset-4">{root.rootLatin}</span>
                    <span className={`mt-0.5 block text-sm ${theme === 'modern' ? 'text-white/80' : 'text-ink-secondary'}`}>{root.totalOccurrences.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')}{t(' kemunculan', ' occurrences')}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  aria-label={`${bookmarked ? t('Hapus simpanan', 'Remove saved root') : t('Simpan akar', 'Save root')} ${root.rootArabic}`}
                  aria-pressed={bookmarked}
                  onClick={() => toggleBookmark(root.id, root.rootArabic)}
                  className={`inline-flex h-11 w-11 shrink-0 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${theme === 'modern' ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-canvas-surface/70'}`}
                  style={{ borderRadius: 'var(--radius-control)' }}
                >
                  <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
                </button>
              </div>
            );
          })()}
          <ul className="mt-4 grid grid-cols-1 gap-x-8 border-t border-hairline sm:grid-cols-2">
          {STARTING_ROOTS.slice(1).map((root) => {
            const bookmarked = isBookmarked(root.id);
            return (
              <li key={root.id} className="flex items-center gap-2 border-b border-hairline sm:gap-3">
                <Link
                  href={`/akar/${root.id}`}
                  aria-label={t(`Pelajari akar ${root.rootArabic}, ${root.totalOccurrences} kemunculan`, `Explore root ${root.rootArabic}, ${root.totalOccurrences} occurrences`)}
                  className="group flex min-h-16 min-w-0 flex-1 items-center justify-between gap-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:text-primary"
                >
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span lang="ar" dir="rtl" className="shrink-0 font-arabic text-2xl leading-relaxed text-ink-primary group-hover:text-primary">{root.rootArabic}</span>
                    <span className="truncate text-sm text-ink-secondary">{root.rootLatin}</span>
                  </span>
                  <span className="shrink-0 text-right text-sm tabular-nums text-ink-secondary">{root.totalOccurrences.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')}<span className="hidden lg:inline">{t(' kemunculan', ' occurrences')}</span></span>
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
        </div>
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
