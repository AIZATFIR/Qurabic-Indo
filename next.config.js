/** @type {import('next').NextConfig} */
const laneCorpusFiles = [
  './lib/quranic-corpus-morphology-0.4.txt',
  './lib/lexicon/data/chunks/chunk_[0-1][0-9].json',
];

const nextConfig = {
  experimental: {
    cpus: 1,
  },
  outputFileTracingRoot: __dirname,
  outputFileTracingExcludes: {
    '*': [
      './lib/data/wbw/**/*',
      './lib/data/wbw-derivative-glosses.json',
      './lib/data/wbw-english-glosses.json',
      './lib/data/wbw-indonesian-glosses.json',
    ],
  },
  outputFileTracingIncludes: {
    '/akar/[slug]': [
      ...laneCorpusFiles,
      './lib/lexicon/data/quran-manifest.json',
    ],
    '/kata/[slug]': [
      ...laneCorpusFiles,
      './lib/lexicon/data/quran-manifest.json',
    ],
    '/api/root-detail': [
      ...laneCorpusFiles,
      './lib/lexicon/data/quran-manifest.json',
    ],
    '/api/word-detail': [
      ...laneCorpusFiles,
      './lib/lexicon/data/manifest.json',
    ],
    '/api/arramooz/search': ['./lib/data/arramooz-full.sqlite'],
    '/api/arabic-stopwords/search': ['./lib/data/arabic-stopwords.sqlite'],
    '/api/taj-roots/search': ['./lib/data/taj-al-arus-roots.sqlite'],
    '/api/taj-roots/lookup': ['./lib/data/taj-al-arus-roots.sqlite'],
    '/api/word-glosses': ['./lib/data/maqam-glosses.sqlite'],
    '/api/search/ayah': ['./lib/db/qurabic.db'],
    '/api/ayah-random': ['./lib/db/qurabic.db'],
  },
  async headers() {
    return [{
      source: '/service-worker.js',
      headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }],
    }];
  },
};

module.exports = nextConfig;
