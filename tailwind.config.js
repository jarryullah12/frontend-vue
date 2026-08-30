/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Bodoni Moda"', 'serif'],
      },
      colors: {
        ink: {
          50: '#f6f5f1',
          100: '#e9e7e0',
          200: '#d3cfc3',
          300: '#b5b0a0',
          400: '#969080',
          500: '#7c7768',
          600: '#635f53',
          700: '#4a4740',
          800: '#2e2c28',
          900: '#1a1917',
          950: '#0d0c0b',
        },
        accent: {
          50: '#fdf6f0',
          100: '#fae8d8',
          200: '#f4d0b0',
          300: '#ecb080',
          400: '#e08a50',
          500: '#d06a30',
          600: '#b85420',
          700: '#973f18',
          800: '#7a3318',
          900: '#5e2a16',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'shimmer': 'shimmer 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
