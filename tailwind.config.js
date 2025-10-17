/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    'font-body',
    'font-heading',
  ],
  theme: {
    extend: {
      colors: {
        casaBeige: '#F5EBDC', // 👈 agrega tu color personalizado aquí
        casaCoffee: '#5C4033',
        casaOlive: '#8B9556',
        casaCream: '#FAF8F3',
      },
        fontFamily: {
          heading: ['Cormorant Garamond', 'serif'],
          body: ['Inter', 'sans-serif'], // existing body font
          // add other custom fonts if needed
        },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
