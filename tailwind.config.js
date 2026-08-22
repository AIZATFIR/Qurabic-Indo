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
          DEFAULT: '#059669', // Emerald Green Primary
          deep: '#047857',
          press: '#065f46',
          soft: '#10b981',
          subdued: '#d1fae5',
          fixed: '#ecfdf5',
          'fixed-dim': '#a7f3d0',
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
        soft: '0 4px 24px -6px rgba(5, 150, 105, 0.08)',
        hover: '0 12px 32px -8px rgba(5, 150, 105, 0.14)',
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
