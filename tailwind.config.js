/** @type {import('tailwindcss').Config} */
// Charte Dekel Agri-Vision (DKL / DekelOil / Capro)
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // MUI fournit déjà son CssBaseline : on désactive le reset Tailwind
  // pour ne pas casser les écrans existants.
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#174E26', // Dekel Green
          50: '#EEF5EF',
          100: '#D5E7D9',
          200: '#A9CFB2',
          300: '#73AF83',
          400: '#3F8A54',
          500: '#236A36',
          600: '#174E26',
          700: '#123F1F',
          800: '#0E3018',
          900: '#092010'
        },
        leaf: {
          DEFAULT: '#8DBE48', // Agri Green
          50: '#F3F9EA',
          100: '#E3F0CF',
          500: '#8DBE48',
          600: '#76A336',
          700: '#5C7F2A'
        },
        harvest: {
          DEFAULT: '#F0A020', // Harvest Orange
          50: '#FEF6E7',
          100: '#FCE7C2',
          500: '#F0A020',
          600: '#D68A10',
          700: '#A86A0B'
        }
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif']
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.10)',
        pop: '0 12px 32px -8px rgba(16,24,40,.25)'
      },
      keyframes: {
        'fade-in': { from: { opacity: 0, transform: 'translateY(4px)' }, to: { opacity: 1, transform: 'none' } }
      },
      animation: {
        'fade-in': 'fade-in .18s ease-out'
      }
    }
  },
  plugins: []
}
