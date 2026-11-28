'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { SOURCES_REGISTRY } from '@/lib/data/sources';

interface TajRootForm {
  sourceId: number;
  word: string;
  unvowelword: string;
  stem: string;
}

interface TajRootIndex {
  sourceRoot: string | null;
  matchType: 'exact' | 'normalized' | null;
  ambiguous: boolean;
  total: number;
  forms: TajRootForm[];
  hasMore: boolean;
}

export default function TajRootFormsPanel({ rootArabic }: { rootArabic: string }) {
  const { language, t } = useLanguage();
  const [index, setIndex] = useState<TajRootIndex | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [open, setOpen] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const formatNumber = (value: number) => value.toLocaleString(language === 'en' ? 'en-US' : 'id-ID');

  useEffect(() => {
    controller.current?.abort();
    controller.current = null;
    setIndex(null);
    setStatus('idle');
    setOpen(false);
    return () => controller.current?.abort();
  }, [rootArabic]);

  const load = (offset: number) => {
    if (controller.current) return;
    const request = new AbortController();
    controller.current = request;
    setStatus('loading');
    fetch(`/api/taj-roots/search?root=${encodeURIComponent(rootArabic)}&offset=${offset}`, { signal: request.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Root form request failed')))
      .then((payload) => {
        if (!Array.isArray(payload.forms)) throw new Error('Invalid root form response');
        setIndex((previous) => ({
          sourceRoot: typeof payload.sourceRoot === 'string' ? payload.sourceRoot : null,
          matchType: payload.matchType === 'exact' || payload.matchType === 'normalized' ? payload.matchType : null,
          ambiguous: payload.ambiguous === true,
          total: Number(payload.total) || 0,
          forms: offset === 0 ? payload.forms : [...(previous?.forms || []), ...payload.forms],
          hasMore: payload.hasMore === true,
        }));
        setStatus('done');
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setStatus('error');
      })
      .finally(() => {
        if (controller.current === request) controller.current = null;
      });
  };

  const heading = t('Bentuk akar di luar Al-Qur’an', 'Root forms beyond the Quran');

  return (
    <section aria-labelledby="taj-root-forms-heading" aria-busy={status === 'loading'} className="scroll-mt-24 space-y-4 border-b border-hairline pb-8">
      <div>
        <h2 id="taj-root-forms-heading" className="text-2xl font-semibold text-ink-primary">{heading}</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-secondary">{t('Indeks ini mencatat bentuk berharakat, bentuk tanpa harakat, dan stem yang dikaitkan dengan akar dalam Tāj al-ʿArūs. Sumber tidak menyediakan definisi atau kelas kata, dan tidak mencakup semua kosakata Arab. Proyek menandai datanya sebagai beta; telaah tiap bentuk tidak didokumentasikan.', 'This index records vocalized forms, unvocalized forms, and stems associated with roots in Tāj al-ʿArūs. It provides no definitions or parts of speech and does not cover all Arabic vocabulary. The project marks the data as beta; item-by-item review is not documented.')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <a href={SOURCES_REGISTRY.tajRootIndex.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          {SOURCES_REGISTRY.tajRootIndex.shortName} · CC BY-SA 3.0 <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
        <a href="https://www.astesj.com/v02/i03/p14/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-ink-secondary underline underline-offset-4 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          {t('Metode ekstraksi (2017)', 'Extraction method (2017)')} <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <button type="button" aria-expanded={open} onClick={() => {
        const nextOpen = !open;
        setOpen(nextOpen);
        if (nextOpen && status === 'idle') load(0);
        if (!nextOpen && status === 'loading') {
          controller.current?.abort();
          controller.current = null;
          setStatus(index?.forms.length ? 'done' : 'idle');
        }
      }} className="min-h-11 text-base font-medium text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        {open ? t('Sembunyikan indeks bentuk', 'Hide form index') : t('Lihat bentuk yang tercatat', 'Browse recorded forms')}
      </button>
      {open && status === 'loading' && !index?.forms.length && <p role="status" className="text-base text-ink-secondary">{t('Memuat indeks bentuk…', 'Loading root form index…')}</p>}
      {open && status === 'error' && <div className="flex flex-wrap items-center gap-3 text-base"><p role="alert" className="text-ink-secondary">{t('Indeks bentuk belum dapat dimuat.', 'The root form index could not be loaded.')}</p><button type="button" className="min-h-11 text-primary underline" onClick={() => load(index?.forms.length || 0)}>{t('Coba lagi', 'Retry')}</button></div>}
      {open && status === 'done' && index?.ambiguous && <p role="status" className="text-base leading-relaxed text-ink-secondary">{t('Ejaan akar ini memiliki lebih dari satu padanan dalam indeks. Bentuk tidak ditampilkan agar tidak tercampur dengan akar lain.', 'This spelling matches more than one root in the index. Forms are hidden to avoid mixing different roots.')}</p>}
      {open && status === 'done' && index && !index.ambiguous && index.forms.length === 0 && <p className="text-base text-ink-secondary">{t('Belum ada bentuk untuk akar ini di indeks.', 'No forms for this root are recorded in the index.')}</p>}
      {open && Boolean(index?.forms.length) && <>
        <p className="text-sm text-ink-secondary">
          <span lang="ar" dir="rtl" className="font-arabic text-lg text-ink-primary">{index?.sourceRoot}</span>
          {' · '}{formatNumber(index?.total || 0)} {t('bentuk tercatat', 'recorded forms')}
          {index?.matchType === 'normalized' && ` · ${t('padanan ejaan', 'normalized match')}`}
        </p>
        <ul className="divide-y divide-hairline border-y border-hairline">
          {index?.forms.map((form) => <li key={form.sourceId} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3">
            <Link href={`/kamus?q=${encodeURIComponent(form.word)}`} prefetch={false} lang="ar" dir="rtl" className="font-arabic text-2xl leading-relaxed text-ink-primary underline-offset-4 hover:text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">{form.word}</Link>
            <p className="text-sm leading-relaxed text-ink-secondary">
              {t('Tanpa harakat', 'Unvocalized')}: <bdi lang="ar" dir="rtl" className="font-arabic">{form.unvowelword}</bdi>
              {form.stem && <> · {t('Dasar kata', 'Stem')}: <bdi lang="ar" dir="rtl" className="font-arabic">{form.stem}</bdi></>}
            </p>
          </li>)}
        </ul>
        {index?.hasMore && status !== 'error' && <button type="button" disabled={status === 'loading'} onClick={() => load(index.forms.length)} className="min-h-11 text-base text-primary underline underline-offset-4 disabled:opacity-60">{status === 'loading' ? t('Memuat…', 'Loading…') : t('Muat 40 bentuk berikutnya', 'Load 40 more forms')}</button>}
      </>}
    </section>
  );
}
