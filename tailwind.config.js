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
        'farm-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'farm-brown': {
          100: '#fdf8f0',
          200: '#f5e6d3',
          300: '#e6c9a8',
          400: '#d4a574',
          500: '#c2884a',
          600: '#a86c2f',
          700: '#8b5217',
        },
        'farm-gray': {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
        }
      },
      fontFamily: {
        'heading': ['Georgia', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'leaf-fall': 'leafFall 10s ease-in-out infinite',
        'grow': 'grow 1s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'wave': 'wave 3s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
        'sway': 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        leafFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        grow: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.4)' },
          '50%': { boxShadow: '0 0 0 15px rgba(34, 197, 94, 0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        wave: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg) translateX(0)' },
          '50%': { transform: 'rotate(5deg) translateX(5px)' },
        },
      },
      backgroundImage: {
        'nature-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        'hero-gradient': 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
        'card-shimmer': 'linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.6) 50%, transparent 75%)',
      },
      boxShadow: {
        'nature': '0 10px 40px rgba(34, 197, 94, 0.15)',
        'product': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 20px rgba(34, 197, 94, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
