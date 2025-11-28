/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tci-green': 'var(--tci-green)',
        'tci-dark': 'var(--tci-dark)',
        'tci-light': 'var(--tci-light)',
        'tci-board': 'var(--tci-board)',
      },
    },
  },
  plugins: [],
}




