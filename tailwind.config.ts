import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#1a1a1a',
        'surface-2': '#242424',
        accent: {
          DEFAULT: '#2B6EA0',
          light: '#3a80b8',
          dark: '#1e5278',
        },
        game: {
          DEFAULT: '#F9C84B',
          dark: '#c9a030',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#a0a0a0',
          muted: '#6b7280',
        },
        border: '#2a2a2a',
      },
      screens: {
        xs: '390px', // iPhone 14 / common small phone baseline
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
