const konstaConfig = require("konsta/config");
module.exports = konstaConfig({
  konsta: {
    colors: {
      "brand-green": "#027c43",
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "coffee-primary": "#cc9c68",
        "coffee-secondary": "#372e1c",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
