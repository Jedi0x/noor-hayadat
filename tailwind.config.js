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
        // Traditional Mushaf-inspired palette
        sage: {
          50: '#F8FAF7',
          100: '#F0F5ED',
          200: '#E3EBE0',
          300: '#C8D6C2',
          400: '#A8BDA0',
          500: '#879E7E',
          600: '#6B8062',
          700: '#52624B',
          800: '#3D4937',
          900: '#2A3226',
          950: '#1A1F18',
        },
        sand: {
          50: '#FDFBF7',
          100: '#FAF6EF',
          200: '#F5EEE1',
          300: '#EDE0CB',
          400: '#E0CAAA',
          500: '#D1B48C',
          600: '#B89968',
          700: '#9A7D4F',
          800: '#7A6340',
          900: '#5C4930',
          950: '#3D2F20',
        },
        bronze: {
          50: '#FAF8F5',
          100: '#F3EEE5',
          200: '#E8DCC9',
          300: '#D4BD9B',
          400: '#BB9C6F',
          500: '#A8824F',
          600: '#8E6C42',
          700: '#755739',
          800: '#5E4630',
          900: '#4A3725',
          950: '#2E2216',
        },
        ink: {
          50: '#F6F6F5',
          100: '#E8E7E6',
          200: '#D3D1CE',
          300: '#B4B0AC',
          400: '#918C86',
          500: '#75706A',
          600: '#5E5A55',
          700: '#4E4A46',
          800: '#433F3C',
          900: '#3A3734',
          950: '#1E1C1A',
        },
      },
      fontFamily: {
        // Indo-Pak Quranic fonts (priority order)
        quran: [
          'Al Qalam Quran',
          'PDMS Saleem QuranFont',
          'Al Majeed Quranic',
          'Hafs',
          'Amiri Quran',
          'Scheherazade New',
          'Lateef',
          'Noto Naskh Arabic',
          'serif'
        ],
        // Alternative decorative Quranic font
        qurannabi: [
          'Nabi',
          'Al Majeed Quranic',
          'Amiri Quran',
          'serif'
        ],
        // Urdu Nastaliq calligraphy
        nastaliq: [
          'Nafees Nastaleeq',
          'Noto Nastaliq Urdu',
          'Jameel Noori Nastaleeq',
          'serif'
        ],
        // Standard Arabic Naskh
        naskh: [
          'Hafs',
          'Amiri',
          'Noto Naskh Arabic',
          'Scheherazade New',
          'serif'
        ],
        // English UI
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
        // English serif (for transliteration)
        serif: [
          'Georgia',
          'Palatino',
          'Times New Roman',
          'serif'
        ],
      },
      fontSize: {
        'display': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
        '7xl': '3.5rem',
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'soft': '0 2px 20px -5px rgba(42, 47, 36, 0.08), 0 10px 30px -5px rgba(42, 47, 36, 0.06)',
        'soft-lg': '0 10px 50px -10px rgba(42, 47, 36, 0.12), 0 25px 60px -15px rgba(42, 47, 36, 0.08)',
        'inner-soft': 'inset 0 2px 12px 0 rgba(42, 47, 36, 0.04)',
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noise\"%3E%3CfeTurbulence baseFrequency=\"0.9\" /%3E%3C/filter%3E%3Crect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.03\" /%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
