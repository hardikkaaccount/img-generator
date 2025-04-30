/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary))',
        'primary-light': 'rgb(var(--primary-light))',
        'primary-dark': 'rgb(var(--primary-dark))',
        secondary: 'rgb(var(--secondary))',
        'secondary-light': 'rgb(var(--secondary-light))',
        'secondary-dark': 'rgb(var(--secondary-dark))',
        danger: 'rgb(var(--danger))',
        warning: 'rgb(var(--warning))',
        success: 'rgb(var(--success))',
        background: 'rgb(var(--background))',
        card: 'rgb(var(--card))',
        text: 'rgb(var(--text))',
        'text-secondary': 'rgb(var(--text-secondary))',
        border: 'rgb(var(--border))'
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'smooth': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 