/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ecc71',
        secondary: '#27ae60',
        accent: '#f1c40f',
      },
    },
  },
  plugins: [],
} 