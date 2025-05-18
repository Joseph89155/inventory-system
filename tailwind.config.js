// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enables class-based dark mode (which your context uses)
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Ensure all JSX/TSX files are covered
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
