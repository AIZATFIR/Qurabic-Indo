'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { BookOpen, ShieldCheck, Heart, ExternalLink, Compass } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

  if (pathname === '/baca') {
    return null;
  }

  return (
    <footer className="border-t border-hairline bg-canvas-surface/80  text-ink-secondary text-sm font-sans mt-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-sans font-bold text-base text-ink-primary tracking-tight">
                Qurabic
              </span>
            </Link>
            <p className="text-ink-secondary leading-relaxed text-sm">
              {t('Baca Al-Qur’an dan telusuri kata, akar, serta rujukannya.', 'Read the Quran and explore its words, roots, and sources.')}
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="font-semibold text-ink-primary text-sm">
              {t('Eksplorasi', 'Explore')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/baca" className="hover:text-primary transition-colors">
                  {t('Baca Qur’an Per Kata', 'Read Quran word by word')}
                </Link>
              </li>
              <li>
                <Link href="/morfologi" className="hover:text-primary transition-colors">
                  {t('Katalog Akar & Morfologi', 'Roots and morphology')}
                </Link>
              </li>
              <li>
                <Link href="/ayat-random" className="hover:text-primary transition-colors">
                  {t('Ayat Acak & Murottal', 'Random verse and recitation')}
                </Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="hover:text-primary transition-colors">
                  {t('Rekomendasi Kajian & Apps', 'Learning resources')}
                </Link>
              </li>
              <li><Link href="/latihan" className="hover:text-primary">{t('Latihan', 'Practice')}</Link></li>
              <li><Link href="/rahm" className="hover:text-primary">Rahm</Link></li>
            </ul>
          </div>

          {/* Sumber & Metodologi */}
          <div className="space-y-3">
            <h4 className="font-semibold text-ink-primary text-sm">
              {t('Rujukan & Data', 'Sources and data')}
            </h4>
            <ul className="space-y-2 text-ink-secondary">
              <li>LPMQ Kementerian Agama RI</li>
              <li>Quranic Arabic Corpus (Univ. of Leeds)</li>
              <li>Lane’s Arabic–English Lexicon</li>
              <li>Quran.com word-by-word translations</li>
            </ul>
          </div>

          {/* Legalitas & {t('Transparansi', 'Transparency')} */}
          <div className="space-y-3">
            <h4 className="font-semibold text-ink-primary text-sm">
              {t('Transparansi', 'Transparency')}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang" className="hover:text-primary transition-colors">
                  {t('Tentang & Metodologi', 'About and sources')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  {t('Ketentuan Layanan (Terms)', 'Terms of service')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  {t('Kebijakan Privasi (Privacy)', 'Privacy policy')}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-ink-secondary text-[11px]">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>&copy; {new Date().getFullYear()} Qurabic</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/tentang" className="hover:underline">
              {t('Lisensi Dependensi', 'Source acknowledgements')}
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:underline">
              {t('Privasi Data', 'Privacy')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
