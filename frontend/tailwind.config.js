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
      black: '#000000',
      white: '#FFFFFF',
      brand: {
        50: '#F0F2F5',
        100: '#E1E5EB',
        200: '#C2CBD7',
        300: '#A3B1C3',
        400: '#667C9B',
        500: '#09111E',
        600: '#080F1B',
        700: '#060B14',
        800: '#04080D',
        900: '#020407',
        950: '#010203',
      },
      obsidian: {
        50: '#F5F5F7',
        100: '#EBEBEF',
        200: '#D6D6DF',
        300: '#B2B2BF',
        400: '#80808F',
        500: '#09111E',
        600: '#070D17',
        700: '#050A11',
        800: '#03060A',
        900: '#010203',
        950: '#000000',
      },
      gray: {
        50: '#F8F9FA',
        100: '#F1F3F5',
        200: '#E9ECEF',
        300: '#DEE2E6',
        400: '#CED4DA',
        500: '#ADB5BD',
        600: '#6C757D',
        700: '#495057',
        800: '#343A40',
        900: '#212529',
        950: '#0A0A0A',
      }
    },
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(9,17,30,0.05)',
        glow: '0 0 20px 0 rgba(9,17,30,0.15)',
        premium: '0 20px 50px -12px rgba(9,17,30,0.1)',
        glass: '0 8px 32px 0 rgba(9,17,30,0.08)'
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


