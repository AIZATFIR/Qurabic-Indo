'use client';

import { useId } from 'react';
import { useLanguage, Language } from '@/lib/context/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const id = useId();
  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor={id} className="sr-only">{t('Bahasa', 'Language')}</label>
      <select id={id} aria-label={t('Bahasa', 'Language')} value={language}
        onChange={(event) => setLanguage(event.target.value as Language)}
        className="min-h-10 w-[4.5rem] rounded-full bg-transparent text-ink-primary px-2 py-2 border border-transparent hover:bg-canvas-surface/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:w-auto sm:px-3">
        <option value="id">ID + EN</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
