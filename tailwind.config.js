module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["*.html", "./scripts/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#ffe4de",
          200: "#ffc9bd",
          300: "#ffae9c",
          400: "#ff937b",
          500: "#ff785a",
          600: "#cc6048",
          700: "#994836",
          800: "#663024",
          900: "#331812"
        },

        secondary: {
          100: "#e2efe3",
          200: "#c4dfc8",
          300: "#a7ceac",
          400: "#89be91",
          500: "#6cae75",
          600: "#568b5e",
          700: "#416846",
          800: "#2b462f",
          900: "#162317"
        },

        dark: {
          100: "#d6d7d8",
          200: "#adb0b1",
          300: "#83888a",
          400: "#5a6163",
          500: "#31393c",
          600: "#272e30",
          700: "#1d2224",
          800: "#141718",
          900: "#0a0b0c"
        },

        light: {
          100: "#f7f8f8",
          200: "#eff2f1",
          300: "#e7ebea",
          400: "#dfe5e3",
          500: "#d7dedc",
          600: "#acb2b0",
          700: "#818584",
          800: "#565958",
          900: "#2b2c2c"
        },
      },

      minHeight: {
        10: "10vh",
        20: "20vh",
        30: "30vh",
        40: "40vh",
        50: "50vh",
        60: "60vh",
        70: "70vh",
        80: "80vh",
        90: "90vh"
      },
      
      maxHeight: {
        10: "10vh",
        20: "20vh",
        30: "30vh",
        40: "40vh",
        50: "50vh",
        60: "60vh",
        70: "70vh",
        80: "80vh",
        90: "90vh"
      },
    },
  },
  variants: {},
  plugins: [],
};
