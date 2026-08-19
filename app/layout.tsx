import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Qurabic (Indo) - Quranic Arabic Corpus & Root Word Explorer',
  description: 'Quranic Arabic Corpus & Root Word Explorer berbahasa Indonesia. Cari akar kata, lemma, morfologi, dan ayat Al-Qur\'an secara mendalam.',
  keywords: ['qurabic', 'quranic corpus', 'akar kata quran', 'morfologi arab', 'bahasa indonesia', 'sabar', 'kamus al quran', 'sharaf nahwu'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-canvas-soft text-ink-primary selection:bg-primary-subdued selection:text-primary-deep font-sans pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 w-full">
          {children}
        </main>
        <footer className="bg-canvas-soft border-t border-hairline text-caption opacity-90 hover:opacity-100 transition-all duration-200 py-12 mt-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="font-bold text-lg text-ink-primary font-sans">
              Qurabic <span className="text-primary font-normal">(Indo)</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-ink-mute">
              <a className="hover:text-primary transition-colors" href="/baca">Baca Qur&apos;an</a>
              <a className="hover:text-primary transition-colors" href="/morfologi">Katalog Morfologi</a>
              <a className="hover:text-primary transition-colors" href="/ayat-random">Ayat Acak</a>
              <a className="hover:text-primary transition-colors" href="/favorit">Akar Tersimpan</a>
              <a className="hover:text-primary transition-colors" href="https://github.com/AIZATFIR/Qurabic-Indo" target="_blank" rel="noreferrer">GitHub Repo</a>
            </div>
            <div className="text-xs text-ink-mute font-mono">
              &copy; {new Date().getFullYear()} Qurabic (Indo). Quranic Arabic Corpus &amp; Root Word Explorer.
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </body>
    </html>
  );
}
