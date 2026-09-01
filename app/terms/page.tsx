import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, BookOpen, ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ketentuan Layanan (Terms of Service) - Qurabic (Indo)',
  description: 'Ketentuan Layanan dan transparansi penggunaan platform Qurabic (Indo).',
};

export default function TermsPage() {
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Legalitas &amp; Ketentuan</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-ink-primary tracking-tight font-sans">
          Ketentuan Layanan <br />
          <span className="font-semibold text-primary">(Terms of Service)</span>
        </h1>
        <p className="text-xs sm:text-sm text-ink-mute">
          Terakhir diperbarui: 1 September 2026 &bull; Versi 1.0.0
        </p>
      </div>

      {/* Content */}
      <div className="space-y-8 text-xs sm:text-sm text-ink-secondary leading-relaxed font-sans">
        
        {/* Section 1: Tujuan Layanan */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            1. Tujuan &amp; Ruang Lingkup Platform
          </h2>
          <p>
            Qurabic (Indo) adalah platform riset independen dan media edukasi digital yang dirancang untuk membantu pembelajar Al-Qur&apos;an memahami struktur tata bahasa Arab (Sharaf dan Nahwu), etimologi akar kata trilateral, dan tafsir kosakata klasik.
          </p>
          <p>
            Platform ini disediakan sebagai sarana penunjang tadabbur dan pembelajaran mandiri, bukan sebagai lembaga penerbit fatwa keagamaan atau pengganti konsultasi langsung dengan ulama dan akademisi bersanad.
          </p>
        </section>

        {/* Section 2: Hak Kekayaan Intelektual & Rujukan Data */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            2. Hak Cipta &amp; Atribusi Sumber Data
          </h2>
          <p>
            Qurabic (Indo) menjunjung tinggi integritas data dan atribusi sumber rujukan resmi:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink-mute">
            <li>
              <strong className="text-ink-secondary">Teks Al-Qur&apos;an &amp; Terjemahan:</strong> Mengikuti standar Mushaf Standar Indonesia dari Kementerian Agama Republik Indonesia (LPMQ) dan Quran.com API v4 / Tanzil Project.
            </li>
            <li>
              <strong className="text-ink-secondary">Data Morfologi &amp; Sintaksis:</strong> Dilisensikan dan dirujuk dari riset komputasi bahasa <em>The Quranic Arabic Corpus</em> (Language Research Group, University of Leeds).
            </li>
            <li>
              <strong className="text-ink-secondary">Leksikografi Klasik:</strong> Bersumber dari kamus-kamus mu&apos;tamad seperti <em>Lisān al-&apos;Arab</em> (Ibn Manzhūr) dan <em>Maqāyīs al-Lughah</em> (Ibn Fāris).
            </li>
            <li>
              <strong className="text-ink-secondary">Audio Tilawah:</strong> Rekaman tilawah Syaikh Mishary Rashid Al-Afasy disediakan melalui repositori publik EveryAyah / QuranCDN untuk tujuan edukasi.
            </li>
          </ul>
        </section>

        {/* Section 3: Penggunaan yang Diperbolehkan */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            3. Ketentuan Penggunaan Pengguna
          </h2>
          <p>
            Anda diperkenankan menggunakan seluruh fitur Qurabic (Indo) untuk keperluan studi pribadi, pengajaran non-komersial, kajian tadabbur, dan riset keilmuan. Anda tidak diperkenankan menyalahgunakan API, melakukan tindakan yang mengganggu kestabilan server, atau memanipulasi konten Al-Qur&apos;an secara sengaja.
          </p>
        </section>

        {/* Section 4: Penafian & Batasan Tanggung Jawab */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            4. Batasan Tanggung Jawab (Disclaimer)
          </h2>
          <p>
            Seluruh data disusun dengan ketelitian tinggi dan verifikasi berbasis leksikografi klasik. Namun demikian, platform ini disediakan apa adanya (&ldquo;as is&rdquo;) tanpa jaminan mutlak atas ketiadaan kekeliruan teknis transmisi API. Pengguna dianjurkan untuk selalu merujuk kembali kepada naskah cetak mushaf resmi dan kitab tafsir mu&apos;tabar.
          </p>
        </section>

        {/* Section 5: Kontak & Pertanyaan */}
        <section className="space-y-3">
          <h2 className="text-base sm:text-lg font-semibold text-ink-primary">
            5. Kontak &amp; Masukan
          </h2>
          <p>
            Jika Anda menemukan koreksi data, saran perbaikan morfologi, atau pertanyaan seputar ketentuan layanan ini, silakan hubungi pengembang melalui repositori publik di GitHub atau kanal kontak resmi.
          </p>
          <a
            href="https://github.com/AIZATFIR/Qurabic-Indo"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 text-primary hover:underline font-medium text-xs pt-1"
          >
            <span>Repositori GitHub Qurabic-Indo</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

      </div>

    </div>
  );
}
