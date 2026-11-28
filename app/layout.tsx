import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import SmoothScroll from '@/components/SmoothScroll';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/lib/context/ThemeContext';
import { Toaster } from 'sonner';
import AdsController from '@/components/AdsController';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import OfflineShellRegistration from '@/components/OfflineShellRegistration';

export const viewport: Viewport = {
  themeColor: '#faf6ef',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://qurabic-indo-corpus.vercel.app'),
  title: {
    default: 'Qurabic — Bedah Kata Al-Qur’an',
    template: '%s | Qurabic',
  },
  description: "Baca ayat, telusuri akar kata Arab, dan bandingkan maknanya dengan rujukan leksikon klasik.",
  keywords: ['qurabic', 'akar kata quran', 'morfologi arab', 'bahasa indonesia', 'leksikon arab klasik', 'lanes lexicon', 'sharaf nahwu', 'mushaf al quran'],
  authors: [{ name: 'Qurabic Team' }],
  openGraph: {
    title: 'Qurabic — Bedah Kata Al-Qur’an',
    description: "Baca ayat, telusuri akar kata Arab, dan bandingkan maknanya dengan rujukan leksikon klasik.",
    siteName: 'Qurabic',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qurabic — Bedah Kata Al-Qur’an',
    description: "Telusuri akar kata, makna, dan ayat Al-Qur’an.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icons/qurabic-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Qurabic',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth" data-theme="blend" data-layout="classic">
      <body className="min-h-screen flex flex-col bg-canvas text-ink-primary selection:bg-primary-subdued selection:text-primary-deep font-sans pt-[var(--qurabic-safe-area-top)] pb-[calc(var(--qurabic-safe-area-bottom)_+_4rem)] md:pb-0">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary font-sans text-sm font-semibold"
        >
          Lewati ke konten utama
        </a>
        <LanguageProvider>
        <ThemeProvider>
          <OfflineShellRegistration />
          <SmoothScroll>
            <Navbar />
            <main className="flex-1 w-full" id="main-content">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </SmoothScroll>
          <AdsController />

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
        </LanguageProvider>
      </body>
    </html>
  );
}
