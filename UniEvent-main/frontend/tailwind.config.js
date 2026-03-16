/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonGreen: '#D3FF37',
        darkSection: '#000000',
        lightSection: '#F5F5F5',
        darkGray: '#1C1C1C',
        mediumGray: '#999999',
        primary: { // Keep a primary mapped for any components still using it
          DEFAULT: '#D3FF37',
          50: '#f7fee7',
          100: '#ecfccb',
          500: '#84cc16',
          600: '#65a30d',
          700: '#4d7c0f',
          900: '#365314',
        }
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      borderRadius: {
        'eventry': '16px',
      }
    },
  },
  plugins: [],
}
