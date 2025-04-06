/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        background: '#F7FFF7',
      },
      fontFamily: {
        'fredoka': ['Fredoka', 'sans-serif'],
        'comic': ['Comic Neue', 'cursive'],
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}