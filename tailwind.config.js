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
        // 3-Tone Seamless Terra Palette
        // Tone 1: Terra Deep Forest (Primary Accent)
        primary: {
          DEFAULT: '#1B3B2B', // Deep Forest Terra
          deep: '#143022',
          press: '#0E2419',
          soft: '#2D5540',
          subdued: '#E8F0EB', // Soft Mineral Sage Tint
          fixed: '#F2F7F4',
          'fixed-dim': '#C8DCD0',
          light: '#A7F3D0',
        },
        // Tone 2: Terra Mineral Charcoal (Ink & Typography)
        ink: {
          primary: '#1C1917', // Warm Deep Charcoal
          secondary: '#44403C', // Warm Stone
          mute: '#78716C', // Soft Stone
        },
        // Tone 3: Terra Neutral Canvas & Sand (Surface & Background)
        canvas: {
          DEFAULT: '#FAF8F5', // Warm Terra Paper
          soft: '#F4F0EA', // Soft Sand
          surface: '#FFFFFF', // Clean Surface
          cream: '#F5EBE1', // Warm Bookpaper
          dark: '#11171D', // Deep Obsidian
          'dark-surface': '#182129',
        },
        hairline: {
          DEFAULT: '#E7E2D8', // Seamless Warm Sand Hairline
          input: '#D3CCC0',
          dark: '#222D37',
        },
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(28, 25, 23, 0.04)',
        hover: '0 8px 24px -4px rgba(28, 25, 23, 0.08)',
        subtle: '0 1px 4px 0 rgba(28, 25, 23, 0.03)',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Noto Naskh Arabic', 'Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}
