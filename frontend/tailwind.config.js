export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF8ED',
          100: '#FFE8C7',
          200: '#FFD08F',
          300: '#FFB65A',
          400: '#F59E2E',
          500: '#BE741E',
          600: '#A15F19',
          700: '#844C14',
          800: '#66390F',
          900: '#4D2B0B',
        },
      },
      boxShadow: {
        soft: '0 10px 30px -10px rgba(0,0,0,0.25)',
        glow: '0 0 0 8px rgba(190,116,30,0.08)'
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


