const theme = require('./src/theme.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Source of truth imported from shared directory
        ...theme,
        // Legacy colors (kept for backward compatibility during migration)
        "warm-bg": theme.champagne,
        "terracotta": theme.gold,
        "espresso": theme.bronze,
        "dark-archive": theme.chocolate,
      },
      fontFamily: {
        "editorial": ["'Fraunces'", "serif"],
        "body": ["'Inter'", "sans-serif"],
        "barcode": ["'Libre Barcode 39'", "cursive"]
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'rotate': 'rotate-slow 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'rotate-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}

