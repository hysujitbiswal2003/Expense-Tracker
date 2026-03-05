/** @type {import('tailwindcss').Config} */
// This file tells Tailwind CSS where to look for your code
// Tailwind scans these files and only includes CSS classes you actually use
// This keeps your final CSS file small!

export default {
  content: [
    "./index.html",           // scan the main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // scan ALL files inside src folder
  ],
  theme: {
    extend: {}, // you can add custom colors/fonts here later
  },
  plugins: [], // extra Tailwind plugins go here later
}