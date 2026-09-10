import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Amiri, Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { Toaster } from 'sonner';

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  variable: '--font-amiri',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#fbf8f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://qurabic.vercel.app'),
  title: {
    default: 'Qurabic (Indo) — Quranic Arabic Corpus & Root Word Explorer',
    template: '%s | Qurabic',
  },
  description: "Quranic Arabic Corpus & Root Word Explorer berbahasa Indonesia. Analisis morfologi, akar kata, lemma, leksikon klasik Lane's Lexicon, dan konkordansi ayat Al-Qur'an secara mendalam.",
  keywords: ['qurabic', 'quranic corpus', 'akar kata quran', 'morfologi arab', 'bahasa indonesia', 'leksikon arab klasik', 'lanes lexicon', 'sharaf nahwu', 'mushaf al quran'],
  authors: [{ name: 'Qurabic Team' }],
  openGraph: {
    title: 'Qurabic (Indo) — Quranic Arabic Corpus & Root Word Explorer',
    description: "Eksplorasi morfologi, akar kata, dan leksikon Al-Qur'an terpercaya berbasis Quranic Arabic Corpus dan Lane's Lexicon.",
    siteName: 'Qurabic',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qurabic (Indo) — Quranic Arabic Corpus & Root Word Explorer',
    description: "Eksplorasi morfologi, akar kata, dan leksikon Al-Qur'an terpercaya.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`scroll-smooth ${amiri.variable} ${inter.variable}`} data-theme="bookpaper">
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
