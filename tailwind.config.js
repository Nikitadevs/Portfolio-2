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
      colors: {
        primary: '#2563eb',  // blue-600
        accent: '#F59E0B',   // amber-400
      },
      transitionDuration: {
        300: '300ms',
        500: '500ms',
      },
      // Add custom colors, spacing, etc.
    },
  },
  variants: {},
  plugins: [],
}