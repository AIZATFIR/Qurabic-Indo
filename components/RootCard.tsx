'use client';

import Link from 'next/link';
import { Bookmark, ArrowRight } from 'lucide-react';
import { RootWord } from '@/lib/types/morphology';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { useLanguage } from '@/lib/context/LanguageContext';
import { transliterateRootArabic } from '@/lib/morphology/transliteration';

interface RootCardProps { root: RootWord; }

export default function RootCard({ root }: RootCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { language, t } = useLanguage();
  const bookmarked = isBookmarked(root.id);
  return (
    <article className="flex items-center gap-3 sm:gap-5 border-b border-hairline py-4 font-sans">
      <Link href={`/akar/${root.id}`} className="group flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-2 py-2 focus-visible:outline-primary">
        <h3 lang="ar" dir="rtl" className="min-w-32 font-arabic text-3xl leading-loose text-ink-primary group-hover:text-primary">{root.rootArabic}</h3>
        <div className="min-w-0 flex-1 text-base text-ink-secondary">
          <p>{transliterateRootArabic(root.rootArabic)}</p>
          <p className="mt-1 tabular-nums">{root.totalOccurrences.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')} {t("kemunculan di Al-Qur'an", 'occurrences in the Quran')}</p>
          <p className="mt-1 text-sm">{root.verbsCount} {t("bentuk fi'il", 'verb forms')} · {root.nounsCount} {t('bentuk isim', 'noun forms')}</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-2 text-base font-medium text-primary">{t('Buka akar', 'Explore root')} <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
      </Link>
      <button
        type="button"
        aria-label={`${bookmarked ? t('Hapus simpanan', 'Remove saved root') : t('Simpan akar', 'Save root')} ${root.rootArabic}`}
        aria-pressed={bookmarked}
        onClick={() => toggleBookmark(root.id, root.rootArabic)}
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-primary hover:bg-canvas-soft focus-visible:outline-primary"
      >
        <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
      </button>
    </article>
  );
}
