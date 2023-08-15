const konstaConfig = require("konsta/config");
module.exports = konstaConfig({
  konsta: {
    colors: {
      "brand-green": "#027c43",
      "brand-primary": "#cc9c68",
      "brand-secondary": "#372e1c",
    },
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "brand-primary": "#cc9c68",
        "brand-secondary": "#372e1c",
        "brand-white": "#eee7e1",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
});
