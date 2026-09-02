/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Multi-Theme Dynamic Tokens
        primary: {
          DEFAULT: 'var(--color-primary, #059669)',
          deep: 'var(--color-primary-deep, #047857)',
          press: '#065F46',
          soft: '#10B981',
          subdued: 'var(--color-primary-subdued, #E6F7F0)',
          fixed: 'var(--color-primary-fixed, #ECFDF5)',
          'fixed-dim': '#A7F3D0',
          light: '#34D399',
        },
        ink: {
          primary: 'var(--color-ink-primary, #0F172A)',
          secondary: 'var(--color-ink-secondary, #334155)',
          mute: 'var(--color-ink-mute, #64748B)',
        },
        canvas: {
          DEFAULT: 'var(--bg-page, #FAFCFA)',
          soft: 'var(--bg-soft, #F0F7F3)',
          surface: 'var(--bg-surface, #FFFFFF)',
          cream: '#FAF4EC',
          dark: '#0B1410',
          'dark-surface': '#12221B',
        },
        hairline: {
          DEFAULT: 'var(--color-border, #E2ECE6)',
          input: 'var(--color-border, #CBDCD2)',
          dark: '#1E362B',
        },
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(5, 150, 105, 0.08)',
        hover: '0 12px 30px -6px rgba(5, 150, 105, 0.15)',
        subtle: '0 1px 4px 0 rgba(15, 23, 42, 0.04)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        arabic: ['var(--font-arabic)', '"Amiri Quran"', '"Scheherazade New"', '"Amiri"', '"Noto Naskh Arabic"', 'serif'],
      },
    },
  },
  plugins: [],
}
