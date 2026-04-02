export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#FC9E4F',
      white: '#FFFFFF',
      brand: {
        50: '#FFFFFF',
        100: '#FFF7F0',
        200: '#FFEDDE',
        300: '#FDD6B3',
        400: '#FCBE8A',
        500: '#FC9E4F',
        600: '#FC9E4F',
        700: '#FC9E4F',
        800: '#FC9E4F',
        900: '#FC9E4F',
      },
      gray: {
        50: '#FFFFFF',
        100: '#FFF7F0',
        200: '#FFEDDE',
        300: '#FDD6B3',
        400: '#FCBE8A',
        500: '#FC9E4F',
        600: '#FC9E4F',
        700: '#FC9E4F',
        800: '#FC9E4F',
        900: '#FC9E4F',
      },
      chocolate: {
        50: '#FFFFFF',
        100: '#FFF7F0',
        200: '#FFEDDE',
        300: '#FDD6B3',
        400: '#FCBE8A',
        500: '#FC9E4F',
        600: '#FC9E4F',
        700: '#FC9E4F',
        800: '#FC9E4F',
        900: '#FC9E4F',
      },
      tomato: {
        50: '#FFFFFF',
        100: '#FFF7F0',
        200: '#FFEDDE',
        300: '#FDD6B3',
        400: '#FCBE8A',
        500: '#FC9E4F',
        600: '#FC9E4F',
        700: '#FC9E4F',
        800: '#FC9E4F',
        900: '#FC9E4F',
      },
      almond: {
        50: '#FFFFFF',
        100: '#FFF7F0',
        200: '#FFEDDE',
        300: '#FDD6B3',
        400: '#FCBE8A',
        500: '#FC9E4F',
        600: '#FC9E4F',
        700: '#FC9E4F',
        800: '#FC9E4F',
        900: '#FC9E4F',
      }
    },
    extend: {
      fontFamily: {
        sans: ['Afacad', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(252,158,79,0.25)',
        glow: '0 0 0 8px rgba(252,158,79,0.08)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 1 }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}


