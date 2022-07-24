/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        spotify: {
          50: "#ccefd3",
          100: "#b2ecc2",
          200: "#83e4a8",
          300: "#58da92",
          400: "#36cc77",
          500: "#1db954",
          600: "#0ea12a",
          700: "#0d8307",
          800: "#266205",
          900: "#2e3f04",
        },
        aluminium: {
          50: "#e8e2e6",
          100: "#dddddd",
          200: "#c9c9c9",
          300: "#b4b4b4",
          400: "#9e9e9e",
          500: "#868589",
          600: "#656373",
          700: "#44415d",
          800: "#272447",
          900: "#130f30",
        }
      },
      fontFamily:{
        'main': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
