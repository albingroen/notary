const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      ...colors,
      gray: colors.neutral,
    },
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
