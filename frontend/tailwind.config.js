/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0B0B0B',
        card: '#151515',
        gold: 'var(--color-accent, #D4AF37)',
        muted: '#A3A3A3',
      },
    },
  },
  plugins: [],
};
