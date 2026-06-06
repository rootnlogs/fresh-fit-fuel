/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette (from BRIEF.md)
        lime: {
          DEFAULT: '#8BC53F', // primary action / "Fresh"
          400: '#A3D65C',
          500: '#8BC53F',
          600: '#6FA52E',
        },
        navy: {
          DEFAULT: '#3C4A6B', // dark background
          900: '#2A3450',
          800: '#33405E',
          700: '#3C4A6B',
          600: '#4A5A82',
        },
        sun: '#F2E40C', // bright yellow accent
        won: '#E2231A', // WON red (use sparingly)
        ink: '#1A1A1A', // near-black text on light
      },
      fontFamily: {
        display: ['Sora', 'Poppins', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        script: ['"Pacifico"', 'cursive'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.25)',
        card: '0 10px 30px -10px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
