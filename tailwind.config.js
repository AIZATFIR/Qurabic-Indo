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
        primary: {
          DEFAULT: '#3904e7',
          deep: '#4434d4',
          press: '#2e2b8c',
          soft: '#665efd',
          subdued: '#b9b9f9',
          fixed: '#e3dfff',
          'fixed-dim': '#c5c0ff',
        },
        ink: {
          primary: '#0d253d',
          secondary: '#273951',
          mute: '#64748d',
        },
        canvas: {
          DEFAULT: '#ffffff',
          soft: '#f6f9fc',
          cream: '#f5e9d4',
        },
        hairline: {
          DEFAULT: '#e3e8ee',
          input: '#a8c3de',
        },
        ruby: '#ea2261',
        magenta: '#f96bee',
        lemon: '#9b6829',
        'shadow-blue': '#003770',
      },
      borderRadius: {
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(0, 55, 112, 0.08)',
        hover: '0 12px 32px -8px rgba(0, 55, 112, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        arabic: ['var(--font-arabic)', 'Amiri', 'Traditional Arabic', 'serif'],
      },
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        huge: '64px',
      }
    },
  },
  plugins: [],
}
