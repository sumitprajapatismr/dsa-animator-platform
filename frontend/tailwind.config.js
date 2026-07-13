/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: 'var(--color-bg)',
          card: 'var(--color-card)',
          border: 'var(--color-border)',
          accent: 'var(--color-accent)',
          teal: '#14B8A6',
          purple: '#A855F7',
          pink: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-teal': '0 0 20px rgba(20, 184, 166, 0.15)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.15)',
      },
    },
  },
  plugins: [],
}
