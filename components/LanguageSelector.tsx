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
        className="min-h-11 max-w-full bg-canvas-surface text-ink-primary px-2 py-2 border border-hairline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <option value="id">Indonesia–English</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
