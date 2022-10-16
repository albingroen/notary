const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      ...fontFamily,
      sans: [
        "Inter var",
        "Inter",
        "sans-serif",
        "-apple-system",
        "BlinkMacSystemFont",
        "sans-serif",
      ],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
