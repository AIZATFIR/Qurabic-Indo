import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.qurabic.indo',
  appName: 'Qurabic',
  webDir: 'public',
  server: {
    // Connect to live production URL with full dynamic SSR and API endpoints
    url: 'https://qurabic-indo-corpus.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#0a100d',
  },
};

export default config;
