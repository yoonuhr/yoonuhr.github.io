/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purdue: {
          gold: '#B1810B',
          black: '#000000',
        }
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  // Enable experimental features for Tailwind v4 compatibility
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
}