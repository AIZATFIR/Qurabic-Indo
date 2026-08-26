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
        // Vibrant, Fresh, & Elegant Quranic Emerald Palette
        primary: {
          DEFAULT: '#059669', // Vibrant Emerald Green
          deep: '#047857',
          press: '#065F46',
          soft: '#10B981',
          subdued: '#E6F7F0', // Fresh Mint Emerald Tint
          fixed: '#ECFDF5',
          'fixed-dim': '#A7F3D0',
          light: '#34D399',
        },
        ink: {
          primary: '#0F172A', // Crisp Dark Slate
          secondary: '#334155',
          mute: '#64748B',
        },
        canvas: {
          DEFAULT: '#FAFCFA', // Clean fresh white with subtle vitality
          soft: '#F0F7F3',
          surface: '#FFFFFF',
          cream: '#FAF4EC', // Classic Mushaf Bookpaper
          dark: '#0B1410',
          'dark-surface': '#12221B',
        },
        hairline: {
          DEFAULT: '#E2ECE6', // Soft fresh hairline
          input: '#CBDCD2',
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
        sans: ['Inter', 'var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Noto Naskh Arabic', 'Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}
