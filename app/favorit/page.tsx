'use client';

import React from 'react';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { ROOT_DATABASE } from '@/lib/data/roots';
import RootCard from '@/components/RootCard';
import Link from 'next/link';
import { Bookmark, BookOpen, ArrowLeft } from 'lucide-react';

export default function FavoritPage() {
  const { bookmarkedIds, isLoaded } = useBookmarks();

  const savedRoots = ROOT_DATABASE.filter((root) => bookmarkedIds.includes(root.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-sm text-ink-mute hover:text-primary transition-colors mb-2 font-medium font-sans"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Beranda</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-canvas-surface border border-hairline rounded-2xl p-8 sm:p-10 shadow-subtle space-y-3">
        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Akar Kata <span className="font-semibold text-primary">Tersimpan</span>
        </h1>

        <p className="text-sm text-ink-secondary max-w-2xl leading-relaxed font-sans">
          Koleksi akar kata dan kosakata Al-Qur&apos;an yang telah Anda tandai untuk dipelajari lebih lanjut. Tersimpan secara lokal di peramban Anda.
        </p>
      </div>

      {/* Content */}
      {!isLoaded ? (
        <div className="p-12 text-center text-ink-mute font-sans">Memuat data tersimpan...</div>
      ) : savedRoots.length === 0 ? (
        <div className="p-12 sm:p-16 text-center bg-canvas-surface border border-hairline rounded-2xl space-y-4 shadow-subtle">
          <div className="w-10 h-10 rounded-xl bg-primary-subdued text-primary flex items-center justify-center mx-auto">
            <Bookmark className="w-5 h-5" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-ink-primary font-sans">Belum Ada Kata Tersimpan</h3>
          <p className="text-sm text-ink-mute max-w-md mx-auto font-sans">
            Klik ikon penanda pada kartu akar kata atau kosakata manapun untuk menyimpannya ke daftar belajar Anda.
          </p>
          <div className="pt-2">
            <Link
              href="/morfologi"
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-deep text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-subtle transition-all font-sans"
            >
              <BookOpen className="w-4 h-4" />
              <span>Buka Katalog Morfologi</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-ink-mute font-sans">
            <span>Menampilkan {savedRoots.length} akar kata tersimpan</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRoots.map((root) => (
              <RootCard key={root.id} root={root} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
