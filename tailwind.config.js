/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '10xl': '10rem',
        '11xl': '12rem',
      },
      screens: {
        'xs': '475px',
      },
      // Add custom colors, spacing, etc.
    },
  },
  variants: {},
  plugins: [],
}