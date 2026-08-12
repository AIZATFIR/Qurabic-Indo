import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Qurabic-Indo | Corpus & Morfologi Akar Kata Al-Qur\'an Bahasa Indonesia',
  description: 'Aplikasi pencarian & eksplorasi akar kata Al-Qur\'an (Quranic Arabic Corpus) berbahasa Indonesia. Cari kata kerja, kata benda, dan etimologi klasik secara cepat.',
  keywords: ['quranic corpus', 'akar kata quran', 'morfologi arab', 'bahasa indonesia', 'sabar', 'kamus al quran', 'sharaf nahwu'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen flex flex-col bg-obsidian-950 text-slate-100 selection:bg-emerald-500 selection:text-obsidian-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="border-t border-slate-800/60 py-8 text-center text-xs text-slate-500 glass-panel mt-12">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="font-medium text-slate-300">Qurabic-Indo Corpus &copy; {new Date().getFullYear()}</p>
            </div>
            <p>Database Akar Kata Al-Qur&apos;an &amp; Etimologi Bahasa Indonesia</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
