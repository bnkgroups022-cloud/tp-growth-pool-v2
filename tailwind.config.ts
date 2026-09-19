import type { Config } from 'tailwindcss';

// TP Growth Pool design tokens — premium dark-blue fintech palette.
// Kept centralized here so every future module (Investing, Real Estate,
// AI Business, Digital Marketing, Reports, Referral...) inherits the same
// look without redefining colors.
const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#02040a',
          900: '#050a17',
          850: '#070d1e',
          800: '#0b1226',
          700: '#101a33',
          600: '#16223f',
        },
        accent: {
          DEFAULT: '#3b82f6',
          50: '#eef6ff',
          100: '#d9ebff',
          200: '#b8dbff',
          300: '#86c2ff',
          400: '#4ea1ff',
          500: '#2f7bff',
          600: '#1e5aef',
          700: '#1a46c7',
          800: '#1c3b9d',
          900: '#1c357c',
        },
        cyan: {
          DEFAULT: '#22d3ee',
        },
        success: {
          DEFAULT: '#22c55e',
          soft: 'rgba(34,197,94,0.15)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          soft: 'rgba(245,158,11,0.15)',
        },
        danger: {
          DEFAULT: '#ef4444',
          soft: 'rgba(239,68,68,0.15)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 15% 0%, rgba(59,130,246,0.20), transparent 45%), radial-gradient(circle at 85% 10%, rgba(34,211,238,0.14), transparent 40%), linear-gradient(180deg, #02040a 0%, #050a17 60%, #070d1e 100%)',
        'card-sheen': 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)',
      },
      boxShadow: {
        glass: '0 1px 1px rgba(255,255,255,0.06) inset, 0 8px 30px rgba(2,4,10,0.55)',
        'glow-accent': '0 0 0 1px rgba(59,130,246,0.35), 0 8px 24px rgba(47,123,255,0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'fade-up': 'fade-up 0.4s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
