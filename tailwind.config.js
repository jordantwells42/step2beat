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
          50: "#dfe4e4",
          100: "#cacece",
          200: "#9ea3a2",
          300: "#767b7b",
          400: "#525a5a",
          500: "#364040",
          600: "#232f2f",
          700: "#172426",
          800: "#101f22",
          900: "#0a1d23",
        },
        ablue: {
          50: "#e4faff",
          100: "#cff6ff",
          200: "#a7edff",
          300: "#83e2ff",
          400: "#63d6ff",
          500: "#46bff3",
          600: "#2f9dd6",
          700: "#1e77b0",
          800: "#135081",
          900: "#0a2c4e",
        }
      },
      fontFamily:{
        'main': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
