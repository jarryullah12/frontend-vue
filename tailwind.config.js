/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#38b2ac',
        accent: '#9561e2',
        dark: '#2d3748',
      },
    },
  },
  plugins: [],
}
