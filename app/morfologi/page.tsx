'use client';

import { useState } from 'react';
import { Search, X, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { ROOT_DATABASE } from '@/lib/data/roots';
import { searchRoots, stripArabicHarakat } from '@/lib/search/root-search';
import RootCard from '@/components/RootCard';
import { useLanguage } from '@/lib/context/LanguageContext';

const HIJAIYYAH_LETTERS = [
  'أ', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'هـ', 'و', 'ي'
];

type SortOption = 'frequency_desc' | 'alphabet_ar' | 'alphabet_latin' | 'verbs_desc' | 'nouns_desc';

export default function MorfologiPage() {
  const { t } = useLanguage();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'high_verbs' | 'high_nouns'>('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('frequency_desc');
  const [visibleCount, setVisibleCount] = useState(48);

  let filteredRoots = searchRoots(filterQuery);

  if (selectedLetter) {
    const norm = (ch: string) => stripArabicHarakat(ch).replace(/[أإآٱ]/g, 'ا').trim();
    const targetNorm = norm(selectedLetter);

    filteredRoots = filteredRoots.filter((r) => {
      const letters = r.rootArabic.trim().split(/\s+/);
      const joined = stripArabicHarakat(r.rootArabicJoined.replace(/\s+/g, ''));
      const first = letters[0] || joined[0] || '';
      return norm(first) === targetNorm || norm(joined).startsWith(targetNorm);
    });
  }

  if (selectedCategory === 'high_verbs') {
    filteredRoots = filteredRoots.filter((r) => r.verbsCount >= r.nounsCount);
  } else if (selectedCategory === 'high_nouns') {
    filteredRoots = filteredRoots.filter((r) => r.nounsCount > r.verbsCount);
  }

  // Apply Sorting
  filteredRoots = [...filteredRoots].sort((a, b) => {
    switch (sortBy) {
      case 'frequency_desc':
        return b.totalOccurrences - a.totalOccurrences;
      case 'alphabet_ar':
        return a.rootArabicJoined.localeCompare(b.rootArabicJoined, 'ar');
      case 'alphabet_latin':
        return a.rootLatin.localeCompare(b.rootLatin, 'en');
      case 'verbs_desc':
        return b.verbsCount - a.verbsCount;
      case 'nouns_desc':
        return b.nounsCount - a.nounsCount;
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-5">
        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          {t("Indeks akar kata Al-Qur'an", 'Quran root index')}
        </h1>

        <p className="text-base text-ink-secondary max-w-2xl leading-relaxed font-sans">
          {t('Telusuri akar, bentuk kata, dan kemunculannya. Anotasi morfologi menggunakan Quranic Arabic Corpus; definisi kamus tersedia pada sebagian entri.', 'Browse roots, word forms, and their occurrences. Morphology annotations come from Quranic Arabic Corpus; dictionary definitions are available for some entries.')}
        </p>

        {/* Filter & Search Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-sans">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-ink-mute absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              aria-label={t('Cari akar kata', 'Search roots')}
              placeholder={t('Cari akar kata, contoh: sabar, كتب', 'Search a root, for example: كتب, rahman')}
              className="w-full pl-11 pr-4 py-2.5 rounded-sm bg-canvas-surface border border-hairline text-base text-ink-primary placeholder:text-ink-mute focus:outline-none focus:ring-2 focus:ring-primary/20 font-sans"
            />
          </div>

          <div className="flex items-center space-x-1 p-1 rounded-sm bg-canvas-soft border border-hairline text-sm w-full sm:w-auto font-sans">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 min-h-11 py-1.5 rounded-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-canvas-surface text-primary font-semibold'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              {t('Semua', 'All')} ({ROOT_DATABASE.length})
            </button>
            <button
              onClick={() => setSelectedCategory('high_verbs')}
              className={`px-3 min-h-11 py-1.5 rounded-sm font-medium transition-all ${
                selectedCategory === 'high_verbs'
                  ? 'bg-canvas-surface text-primary font-semibold'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              {t("Banyak fi'il", 'Verb dominant')}
            </button>
            <button
              onClick={() => setSelectedCategory('high_nouns')}
              className={`px-3 min-h-11 py-1.5 rounded-sm font-medium transition-all ${
                selectedCategory === 'high_nouns'
                  ? 'bg-canvas-surface text-primary font-semibold'
                  : 'text-ink-mute hover:text-ink-primary'
              }`}
            >
              {t('Banyak isim', 'Noun dominant')}
            </button>
          </div>
        </div>

        {/* Arabic Hijaiyyah Index Filter Bar */}
        <div className="pt-3 border-t border-hairline font-sans">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-ink-secondary">
              {t('Huruf awal akar', 'First root letter')}
            </span>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                className="inline-flex items-center space-x-1 text-sm text-primary hover:underline font-semibold"
              >
                <X className="w-3 h-3" />
                <span>{t('Reset huruf', 'Clear letter')} ({selectedLetter})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 dir-rtl">
            {HIJAIYYAH_LETTERS.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  aria-label={t(`Akar diawali huruf ${letter}`, `Root beginning with ${letter}`)}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedLetter(isSelected ? null : letter)}
                  className={`w-11 h-11 rounded-sm font-arabic text-lg font-bold transition-all flex items-center justify-center ${
                    isSelected
                      ? 'bg-primary text-white scale-105'
                      : 'bg-canvas-soft hover:bg-primary-fixed border border-hairline text-ink-primary'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Root Grid Header with Sort Controls */}
      <section aria-labelledby="katalog-heading" className="space-y-4">
        <h2 id="katalog-heading" className="sr-only">{t('Daftar akar kata', 'Root index results')}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm font-sans border-b border-hairline pb-3">
          <span className="text-ink-secondary">
            {t('Menampilkan', 'Showing')} <strong className="text-ink-primary">{Math.min(visibleCount, filteredRoots.length)}</strong> {t('dari', 'of')} <strong className="text-ink-primary">{filteredRoots.length}</strong> {t('akar kata', 'roots')}
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <span className="text-ink-mute font-medium">{t('Urutkan:', 'Sort by:')}</span>
            <select
              aria-label={t('Urutkan akar', 'Sort roots')}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setVisibleCount(48);
              }}
              className="bg-canvas-surface border border-hairline rounded-sm px-3 py-1.5 text-sm text-ink-primary font-sans font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="frequency_desc">{t('Kemunculan Terbanyak', 'Most occurrences')}</option>
              <option value="alphabet_ar">{t('Abjad Arab (أ - ي)', 'Arabic alphabet (أ - ي)')}</option>
              <option value="alphabet_latin">{t('Abjad Latin (A - Z)', 'Latin alphabet (A - Z)')}</option>
              <option value="verbs_desc">{t('Fi\'il (Kata Kerja) Terbanyak', 'Most verb forms')}</option>
              <option value="nouns_desc">{t('Isim (Kata Benda) Terbanyak', 'Most noun forms')}</option>
            </select>
          </div>
        </div>

        {filteredRoots.length === 0 ? (
          <div className="p-12 text-center bg-canvas-surface border border-hairline rounded-sm text-ink-mute font-sans">
            {t('Tidak ada akar yang cocok. Hapus filter huruf atau coba kata kunci lain.', 'No roots match. Clear the letter filter or try another search.')}
          </div>
        ) : (
          <>
            <div className="space-y-0">
              {filteredRoots.slice(0, visibleCount).map((root) => (
                <RootCard key={root.id} root={root} />
              ))}
            </div>

            {visibleCount < filteredRoots.length && (
              <div className="pt-6 flex justify-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 48)}
                  className="px-6 py-2.5 rounded-sm bg-canvas-surface border border-hairline hover:border-primary/40 text-primary text-sm sm:text-base font-semibold transition-all"
                >
                  {t('Muat lebih banyak', 'Load more')} ({filteredRoots.length - visibleCount} {t('akar tersisa', 'roots remaining')})
                </button>
              </div>
            )}
          </>
        )}

        {/* Subtle Citation Badge */}
        <div className="pt-4 flex justify-end">
          <span className="inline-flex items-center space-x-1 text-sm text-ink-mute font-sans">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>{t('Sumber anotasi morfologi: Quranic Arabic Corpus (University of Leeds).', 'Morphology annotations: Quranic Arabic Corpus (University of Leeds).')}</span>
          </span>
        </div>
      </section>
    </div>
  );
}
