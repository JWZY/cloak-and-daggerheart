/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-gray': '#8E8E93',
        'ios-gray-light': '#F2F2F7',
        'ios-separator': '#C6C6C8',
      },
      fontFamily: {
        'ios': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

