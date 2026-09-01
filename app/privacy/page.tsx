import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Lock, Database, Eye } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kebijakan Privasi (Privacy Policy) - Qurabic (Indo)',
  description: 'Kebijakan privasi dan transparansi pengelolaan data lokal di Qurabic (Indo).',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 space-y-10 font-sans pb-24">
      
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-sm text-ink-mute hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 border-b border-hairline pb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary-subdued text-primary text-xs font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>Privasi &amp; Keamanan Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Kebijakan Privasi <br />
          <span className="font-semibold text-primary">(Privacy Policy)</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-mute">
          Terakhir diperbarui: 1 September 2026 &bull; Versi 1.0.0
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
        
        {/* Section 1: Prinsip Privasi */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary flex items-center space-x-2">
            <Eye className="w-4 h-4 text-primary" />
            <span>1. Prinsip Dasar Privasi</span>
          </h2>
          <p>
            Qurabic (Indo) dibangun dengan prinsip <em>privacy-first</em>. Kami tidak menjual data pribadi Anda, tidak menyematkan pelacak iklan pihak ketiga (third-party ad trackers), dan tidak mewajibkan registrasi akun untuk mengakses seluruh korpus Al-Qur&apos;an dan analisis morfologi.
          </p>
        </section>

        {/* Section 2: Penyimpanan Lokal di Perangkat (LocalStorage) */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary flex items-center space-x-2">
            <Database className="w-4 h-4 text-primary" />
            <span>2. Data yang Disimpan di Perangkat Anda (Local Storage)</span>
          </h2>
          <p>
            Untuk memberikan pengalaman membaca yang mulus, Qurabic menyimpan preferensi tertentu secara lokal di browser Anda:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-mute">
            <li>
              <strong className="text-ink-secondary">Preferensi Tema (<code>qurabic-theme</code>):</strong> Menyimpan pilihan tema tampilan Anda (Terang, Bookpaper, Hijau Mushaf, Gelap).
            </li>
            <li>
              <strong className="text-ink-secondary">Daftar Tersimpan (<code>qurabic_indo_bookmarked_roots</code>):</strong> Menyimpan daftar ayat atau akar kata favorit yang Anda tandai.
            </li>
            <li>
              <strong className="text-ink-secondary">Riwayat Pencarian Terakhir (<code>qurabic_search_history</code>):</strong> Menyimpan 5 kata kunci pencarian terakhir Anda di perangkat lokal untuk kemudahan akses ulang. Anda dapat menghapusnya kapan saja melalui tombol hapus riwayat.
            </li>
          </ul>
        </section>

        {/* Section 3: Layanan & API Pihak Ketiga */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>3. Komunikasi dengan API Pihak Ketiga</span>
          </h2>
          <p>
            Saat Anda membaca ayat atau memutar audio murottal, aplikasi melakukan permintaan data langsung ke penyedia layanan publik resmi:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-mute">
            <li>
              <strong className="text-ink-secondary">Quran.com API v4:</strong> Mengambil teks terjemahan bahasa Indonesia dan segmentasi kata live.
            </li>
            <li>
              <strong className="text-ink-secondary">EveryAyah / QuranCDN:</strong> Mengalirkan file audio tilawah per ayat MP3 langsung ke peramban Anda.
            </li>
            <li>
              <strong className="text-ink-secondary">YouTube Embed (Privacy-Enhanced):</strong> Memutar video kajian pilihan hanya ketika Anda membuka pemutar video melalui domain <code>youtube-nocookie.com</code>.
            </li>
          </ul>
        </section>

        {/* Section 4: Hak Pengguna */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            4. Hak Pengguna &amp; Penghapusan Data
          </h2>
          <p>
            Karena seluruh data preferensi tersimpan di peramban Anda (Client-Side LocalStorage), Anda memiliki kendali 100% untuk menghapus riwayat atau bookmarks kapan saja dengan membersihkan cache peramban atau melalui tombol hapus yang tersedia di aplikasi.
          </p>
        </section>

      </div>

    </div>
  );
}
