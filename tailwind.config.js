/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Distance colors for guesses
        'guess-hot': '#FF0000',
        'guess-warm': '#FF6600', 
        'guess-medium': '#FFCC00',
        'guess-cool': '#CC9966',
        'guess-cold': '#EEEEEE',
        'guess-correct': '#00FF00',
        // Texas theme
        'texas-blue': '#002868',
        'texas-red': '#BF0A30',
      }
    },
  },
  plugins: [],
}
