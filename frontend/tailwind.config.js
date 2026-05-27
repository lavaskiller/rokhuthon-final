/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gowun: ['"Gowun Batang"', 'serif'],
      },
      colors: {
        accent: '#76d4ff',
        fortune: {
          relationship: '#aff3ff',
          money: '#afceff',
          work: '#bfafff',
        },
      },
    },
  },
  plugins: [],
}
