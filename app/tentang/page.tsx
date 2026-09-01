import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck, ArrowLeft, Layers, ExternalLink, Compass } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang & Metodologi - Qurabic (Indo)',
  description: 'Metodologi riset linguistik Al-Qur\'an, arsitektur data otentik, dan lisensi dependensi Qurabic (Indo).',
};

const THIRD_PARTY_DEPENDENCIES = [
  {
    name: 'Lucide Icons',
    purpose: 'Sistem Ikonografi Antarmuka',
    license: 'ISC / MIT License',
    url: 'https://lucide.dev/'
  },
  {
    name: 'Sonner',
    purpose: 'Sistem Notifikasi Ringan (Toast)',
    license: 'MIT License',
    url: 'https://sonner.emilkowal.ski/'
  },
  {
    name: 'React Virtuoso',
    purpose: 'Virtualisasi Daftar Pencarian Besar',
    license: 'MIT License',
    url: 'https://virtuoso.dev/'
  },
  {
    name: 'Framer Motion',
    purpose: 'Animasi Scroll & Transisi Sinematik',
    license: 'MIT License',
    url: 'https://www.framer.com/motion/'
  },
  {
    name: 'Quran.com API v4',
    purpose: 'Data Teks Mushaf & Terjemahan Kemenag RI',
    license: 'Open Access / Creative Commons',
    url: 'https://quran.com/'
  },
  {
    name: 'The Quranic Arabic Corpus',
    purpose: 'Anotasi Morfologi Sharaf & Sintaksis',
    license: 'University of Leeds Research License',
    url: 'https://corpus.quran.com/'
  },
  {
    name: 'EveryAyah Project',
    purpose: 'Repositori Audio Tilawah Murottal',
    license: 'Public Educational Access',
    url: 'https://everyayah.com/'
  }
];

export default function TentangPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 space-y-12 font-sans pb-24">
      
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
          <Compass className="w-3.5 h-3.5" />
          <span>Transparansi &amp; Metodologi</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Tentang Qurabic (Indo) <br />
          <span className="font-semibold text-primary">&amp; Metodologi Riset Linguistik</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-mute">
          Menghubungkan pembelajar Indonesia dengan kedalaman bahasa Al-Qur&apos;an berbasis rujukan terverifikasi.
        </p>
      </div>

      {/* Metodologi */}
      <div className="space-y-8 text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
        
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            1. Visi &amp; Misi Platform
          </h2>
          <p>
            Al-Qur&apos;an diturunkan dalam bahasa Arab yang memiliki kekayaan morfologis luar biasa. Satu akar kata trilateral (Tsulatsi Mujarrad) dapat melahirkan puluhan bentuk kata kerja (*Fi&apos;il*) dan kata benda (*Isim*) dengan nuansa makna yang sangat spesifik.
          </p>
          <p>
            Qurabic (Indo) dibangun untuk menjembatani pembelajar bahasa Arab dan pembaca umum di Indonesia agar dapat mengeksplorasi makna setiap kata Al-Qur&apos;an secara struktural, terhubung, dan didukung oleh leksikografi klasik.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            2. Sumber Rujukan &amp; Provenance Data
          </h2>
          <p>
            Seluruh data disusun secara ketat mengacu kepada rujukan resmi dan tidak menggunakan konten halusinasi buatan:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-canvas-surface border border-hairline space-y-2">
              <strong className="text-ink-primary block text-sm">LPMQ Kemenag RI</strong>
              <p className="text-xs text-ink-mute">
                Standar teks Rasm Utsmani dan terjemahan resmi Kementerian Agama Republik Indonesia.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-surface border border-hairline space-y-2">
              <strong className="text-ink-primary block text-sm">Quranic Arabic Corpus</strong>
              <p className="text-xs text-ink-mute">
                Anotasi tata bahasa Sharaf &amp; part-of-speech (POS) dari University of Leeds.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-surface border border-hairline space-y-2">
              <strong className="text-ink-primary block text-sm">Lisān al-&apos;Arab &amp; Maqāyīs</strong>
              <p className="text-xs text-ink-mute">
                Etimologi klasik dari kamus induk Ibn Manzhūr dan Ibn Fāris.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-canvas-surface border border-hairline space-y-2">
              <strong className="text-ink-primary block text-sm">EveryAyah Audio</strong>
              <p className="text-xs text-ink-mute">
                Tilawah murottal per ayat Syaikh Mishary Rashid Al-Afasy.
              </p>
            </div>
          </div>
        </section>

        {/* Tabel Lisensi Dependensi Pihak Ketiga */}
        <section className="space-y-4 pt-4 border-t border-hairline">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            3. Dependensi Pihak Ketiga &amp; Lisensi Perangkat Lunak
          </h2>
          <p className="text-xs text-ink-mute">
            Transparansi pustaka kode dan lisensi perangkat lunak yang digunakan dalam proyek ini:
          </p>

          <div className="overflow-x-auto rounded-2xl border border-hairline bg-canvas-surface">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-hairline bg-canvas-soft text-ink-primary font-semibold">
                  <th className="p-3.5">Dependensi / Layanan</th>
                  <th className="p-3.5">Tujuan Penggunaan</th>
                  <th className="p-3.5">Lisensi / Ketentuan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline text-ink-secondary">
                {THIRD_PARTY_DEPENDENCIES.map((dep, idx) => (
                  <tr key={idx} className="hover:bg-canvas-soft/50 transition-colors">
                    <td className="p-3.5 font-medium text-ink-primary">
                      <a
                        href={dep.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 hover:text-primary transition-colors"
                      >
                        <span>{dep.name}</span>
                        <ExternalLink className="w-3 h-3 text-ink-mute" />
                      </a>
                    </td>
                    <td className="p-3.5">{dep.purpose}</td>
                    <td className="p-3.5 text-ink-mute font-mono text-[11px]">{dep.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

    </div>
  );
}
