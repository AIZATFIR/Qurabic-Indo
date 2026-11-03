'use client';

import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import Link from 'next/link';
import { Bookmark, BookOpen, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function FavoritPage() {
  const { bookmarkedIds, isLoaded } = useBookmarks();
  const { t } = useLanguage();
  const savedRoots = ROOT_DATABASE.filter(root => bookmarkedIds.includes(root.id));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 font-sans">
      <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-secondary hover:text-primary">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />{t('Kembali ke beranda', 'Back to home')}
      </Link>
      <header className="border-b border-hairline py-8">
        <h1 className="text-3xl font-medium tracking-tight text-ink-primary sm:text-4xl">{t('Akar kata tersimpan', 'Saved roots')}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-secondary">{t('Akar kata yang Anda tandai untuk dipelajari. Simpanan disimpan di peramban ini.', 'Roots you saved for further study. Your saved list is stored in this browser.')}</p>
      </header>
      {!isLoaded ? <p role="status" className="py-12 text-ink-secondary">{t('Memuat simpanan…', 'Loading saved roots…')}</p>
        : savedRoots.length === 0 ? <section className="py-12 sm:py-16">
          <Bookmark className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="mt-5 text-xl font-medium text-ink-primary">{t('Belum ada akar tersimpan', 'No saved roots yet')}</h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-ink-secondary">{t('Pilih ikon penanda di samping akar kata untuk menambahkannya ke daftar belajar Anda.', 'Select the bookmark beside a root to add it to your study list.')}</p>
          <Link href="/morfologi" className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-primary text-base font-medium text-primary"><BookOpen className="h-4 w-4" aria-hidden="true" />{t('Jelajahi akar kata', 'Explore roots')}</Link>
        </section>
        : <section aria-labelledby="saved-roots-heading" className="pt-6">
          <h2 id="saved-roots-heading" className="text-sm text-ink-secondary">{savedRoots.length} {t('akar kata tersimpan', 'saved roots')}</h2>
          <div className="mt-2">{savedRoots.map(root => <RootCard key={root.id} root={root} />)}</div>
        </section>}
    </main>
  );
}
