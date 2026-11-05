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
    <article className="relative flex h-full flex-col justify-between gap-5 rounded-2xl border border-hairline bg-canvas-surface p-5 font-sans shadow-subtle transition-colors hover:border-primary/40 sm:p-6">
      <Link href={`/akar/${root.id}`} className="group block min-w-0 pr-10 focus-visible:outline-primary">
        <div className="flex items-baseline gap-3">
          <h3 lang="ar" dir="rtl" className="font-arabic text-4xl leading-relaxed text-ink-primary group-hover:text-primary">{root.rootArabic}</h3>
          <span className="text-sm font-medium text-ink-secondary">{transliterateRootArabic(root.rootArabic)}</span>
        </div>
        <p className="mt-3 text-base font-semibold tabular-nums text-ink-primary">{root.totalOccurrences.toLocaleString(language === 'en' ? 'en-US' : 'id-ID')} {t("kemunculan di Al-Qur'an", 'occurrences in the Quran')}</p>
      </Link>
      <button
        type="button"
        aria-label={`${bookmarked ? t('Hapus simpanan', 'Remove saved root') : t('Simpan akar', 'Save root')} ${root.rootArabic}`}
        aria-pressed={bookmarked}
        onClick={() => toggleBookmark(root.id, root.rootArabic)}
        className="absolute right-4 top-4 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-primary hover:bg-canvas-soft focus-visible:outline-primary"
      >
        <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
      </button>
      <div className="flex items-center justify-between gap-3 border-t border-hairline pt-4 text-sm">
        <span className="text-ink-secondary">{root.verbsCount} {t("fi'il", 'verbs')} · {root.nounsCount} {t('isim', 'nouns')}</span>
        <Link href={`/akar/${root.id}`} className="inline-flex min-h-10 items-center gap-2 font-medium text-primary hover:underline underline-offset-4 focus-visible:outline-primary">
          {t('Buka akar', 'Explore root')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
