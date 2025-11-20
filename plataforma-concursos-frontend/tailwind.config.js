/** @type {import('tailwindcss').Config} */
const { colors } = require("./src/app/styles/tokens");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        primaryLight: colors.primaryLight,
        primaryDark: colors.primaryDark,
        secondary: colors.secondary,

        background: colors.background,
        backgroundMuted: colors.backgroundMuted,

        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
      },
    },
  },
};