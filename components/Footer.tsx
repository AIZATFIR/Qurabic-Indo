'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, Heart, ExternalLink, Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-canvas-surface/80 backdrop-blur-sm text-ink-secondary text-xs font-sans mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 space-y-12">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Purpose */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-sans font-bold text-base text-ink-primary tracking-tight">
                Qurabic <span className="text-primary font-normal">(Indo)</span>
              </span>
            </Link>
            <p className="text-ink-mute leading-relaxed text-xs">
              Platform riset etimologi, morfologi Sharaf, dan eksplorasi linguistik Al-Qur&apos;an berbasis data otentik terverifikasi.
            </p>
          </div>

          {/* Navigasi Utama */}
          <div className="space-y-3">
            <h4 className="font-semibold text-ink-primary uppercase tracking-wider text-[11px]">
              Eksplorasi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/baca" className="hover:text-primary transition-colors">
                  Baca Qur&apos;an Per Kata
                </Link>
              </li>
              <li>
                <Link href="/morfologi" className="hover:text-primary transition-colors">
                  Katalog Akar &amp; Morfologi
                </Link>
              </li>
              <li>
                <Link href="/ayat-random" className="hover:text-primary transition-colors">
                  Ayat Acak &amp; Murottal
                </Link>
              </li>
              <li>
                <Link href="/rekomendasi" className="hover:text-primary transition-colors">
                  Rekomendasi Kajian &amp; Apps
                </Link>
              </li>
            </ul>
          </div>

          {/* Sumber & Metodologi */}
          <div className="space-y-3">
            <h4 className="font-semibold text-ink-primary uppercase tracking-wider text-[11px]">
              Rujukan &amp; Data
            </h4>
            <ul className="space-y-2 text-ink-mute">
              <li>LPMQ Kementerian Agama RI</li>
              <li>Quranic Arabic Corpus (Univ. of Leeds)</li>
              <li>Lisān al-&apos;Arab (Ibn Manzhūr)</li>
              <li>Maqāyīs al-Lughah (Ibn Fāris)</li>
            </ul>
          </div>

          {/* Legalitas & Transparansi */}
          <div className="space-y-3">
            <h4 className="font-semibold text-ink-primary uppercase tracking-wider text-[11px]">
              Transparansi
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tentang" className="hover:text-primary transition-colors">
                  Tentang &amp; Metodologi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Ketentuan Layanan (Terms)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Kebijakan Privasi (Privacy)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-ink-mute text-[11px]">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>&copy; {new Date().getFullYear()} Qurabic (Indo) &bull; Source-Grounded Learning Ecosystem</span>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/tentang" className="hover:underline">
              Lisensi Dependensi
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:underline">
              Privasi Data
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
