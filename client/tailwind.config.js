/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    animations: {
      'bounce': {
        'from': {
          transform: 'translate3d(0,0,0)'
        },
        'to': {
          transform: 'translate3d(0,-10px,0)'
        }
      },
    },
    extend: {
      animation: {
        'bounce': 'bounce 1s infinite'
      },
      fontFamily: {
        epilogue: ['Epilogue', 'sans-serif'],
      },
      boxShadow: {
        secondary: '10px 10px 20px rgba(2, 2, 2, 0.25)',
      },
    },
  },
  plugins: [],
}
