/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#0D3B2E',
        },
        gold: {
          500: '#C9A84C',
        },
        cream: {
          50: '#F5F0E8',
          100: '#FFFDF6',
        },
        burnt: {
          950: '#1A1008',
        }
      },
      fontFamily: {
        indopak: ['Scheherazade New', 'Noto Naskh Arabic', 'Amiri', 'serif'],
        nastaliq: ['Noto Nastaliq Urdu', 'Noto Sans Arabic', 'serif'],
        naskh: ['Noto Naskh Arabic', 'Scheherazade New', 'serif'],
      },
    },
  },
  plugins: [],
}
