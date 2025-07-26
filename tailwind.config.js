/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Luckiest Guy', 'cursive'],
        'sans': ['Rubik', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}