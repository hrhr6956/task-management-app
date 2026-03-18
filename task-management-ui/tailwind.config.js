// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0B0C10',
        'dark-surface': '#1F2833',
        'dark-card': 'rgba(31, 40, 51, 0.8)', // for glass effect
        'primary': '#66FCF1',
        'primary-dark': '#45A29E',
        'secondary': '#C3073F',
        'text-light': '#C5C6C7',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 15px rgba(102, 252, 241, 0.3)',
      },
    },
  },
  plugins: [],
}