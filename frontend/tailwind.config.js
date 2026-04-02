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
        50: '#FFF7F0',
        100: '#FFF0E5',
        200: '#FFDDC2',
        300: '#FCBE8A',
        400: '#FB9B42',
        500: '#FC9E4F', // Core brand color
        600: '#E8893A',
        700: '#D47526',
        800: '#BF6111',
        900: '#AB4D00',
        950: '#2D1500',
      },
      gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
        950: '#030712',
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


