import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { Toaster } from 'sonner';

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
    <html lang="id" className="scroll-smooth" data-theme="bookpaper">
      <body className="min-h-screen flex flex-col bg-canvas text-ink-primary selection:bg-primary-subdued selection:text-primary-deep font-sans pb-16 md:pb-0">
        <ThemeProvider>
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </SmoothScroll>

          {/* Sonner Global Notifications */}
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                borderRadius: '16px',
                fontFamily: 'inherit',
                fontSize: '13px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
