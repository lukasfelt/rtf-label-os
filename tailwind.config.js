/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rtf: {
          orange: '#FF762C',
          black: '#181818',
          white: '#FFFFFF',
          offwhite: '#F5F4F0',
          gray: '#888780',
          border: '#E8E7E3',
          green: '#16a34a',
          amber: '#BA7517',
          red: '#E24B4A',
        }
      },
      fontFamily: {
        display: ['Anton', 'HelveticaNeueLTPro-BlkEx', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
