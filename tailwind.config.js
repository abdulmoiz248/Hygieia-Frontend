/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class', // <- key line here
    theme: {
      extend: {
        colors: {
          softBlue: '#4A90E2',
          mintGreen: '#A8E6CF',
          softCoral: '#FF6F61',
          snowWhite: '#FAFAFA',
          darkSlate: '#2C3E50',
          coolGray: '#7F8C8D',
        },
      },
    },
    plugins: [],
  }
  