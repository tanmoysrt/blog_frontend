/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        cblue: '#2A3C9F',
        cred: '#FF6B6B'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
}