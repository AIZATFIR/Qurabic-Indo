import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qurabic.indo',
  appName: 'Qurabic',
  webDir: 'public',
  server: {
    // Open the cached-capable reader first; the service worker keeps its shell on this origin.
    url: 'https://qurabic-indo-corpus.vercel.app/baca',
    errorPath: 'offline.html',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#FAF6EF',
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
      style: 'LIGHT',
    },
  },
};

export default config;
