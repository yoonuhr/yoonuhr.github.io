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
      }
    },
  },
  plugins: [],
}