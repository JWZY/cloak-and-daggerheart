/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-gradient-knowledge',
    'bg-gradient-war',
    'bg-gradient-default',
    'animate-gradient',
  ],
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-gray': '#8E8E93',
        'ios-gray-light': '#F2F2F7',
        'ios-separator': '#C6C6C8',
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-white-strong': 'rgba(255, 255, 255, 0.15)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        'glass-dark': 'rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        'ios': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-knowledge': 'linear-gradient(135deg, #0a1628 0%, #0f2847 25%, #1e3a5f 50%, #0f2847 75%, #0a1628 100%)',
        'gradient-war': 'linear-gradient(135deg, #451a03 0%, #78350f 25%, #b45309 50%, #d97706 75%, #451a03 100%)',
        'gradient-default': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      },
    },
  },
  plugins: [],
}

