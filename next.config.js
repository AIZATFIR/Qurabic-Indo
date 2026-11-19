/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  outputFileTracingIncludes: {
      '/akar/[slug]': [
        './lib/quranic-corpus-morphology-0.4.txt',
        './lib/lexicon/data/chunks/chunk_[0-1][0-9].json',
      ],
      '/kata/[slug]': [
        './lib/quranic-corpus-morphology-0.4.txt',
        './lib/lexicon/data/chunks/chunk_[0-1][0-9].json',
      ],
      '/api/**/*': [
        './lib/quranic-corpus-morphology-0.4.txt',
        './lib/lexicon/data/manifest.json',
        './lib/lexicon/data/chunks/**/*',
      ],
    },
};

module.exports = nextConfig;
