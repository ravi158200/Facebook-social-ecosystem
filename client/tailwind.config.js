/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        facebookBlue: '#1877F2',
        backgroundGray: '#F0F2F5',
      }
    },
  },
  plugins: [],
}
