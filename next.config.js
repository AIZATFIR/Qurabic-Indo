/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/**/*': [
        './lib/quranic-corpus-morphology-0.4.txt',
        './lib/lexicon/data/chunks/**/*',
      ],
    },
  },
};

module.exports = nextConfig;
