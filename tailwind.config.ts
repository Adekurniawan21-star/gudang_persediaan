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
        bps: {
          blue: {
            DEFAULT: '#005AA9',
            50: '#E6F0FA',
            100: '#CCE0F5',
            200: '#99C1EB',
            300: '#66A2E0',
            400: '#3383D6',
            500: '#005AA9',
            600: '#004887',
            700: '#003665',
            800: '#002444',
            900: '#001222',
          },
          teal: {
            DEFAULT: '#00A6B4',
            50: '#E6F8F9',
            100: '#CCF0F3',
            200: '#99E1E7',
            300: '#66D2DB',
            400: '#33C3CF',
            500: '#00A6B4',
            600: '#008590',
            700: '#00646C',
            800: '#004248',
            900: '#002124',
          },
          green: {
            DEFAULT: '#6DBE45',
            50: '#F0F9EB',
            100: '#E1F3D7',
            200: '#C3E7AF',
            300: '#A5DB87',
            400: '#87CF5F',
            500: '#6DBE45',
            600: '#579837',
            700: '#417229',
            800: '#2B4C1C',
            900: '#16260E',
          },
          orange: {
            DEFAULT: '#F5821F',
            50: '#FEF3E8',
            100: '#FDE7D1',
            200: '#FBCFA3',
            300: '#F9B775',
            400: '#F79F47',
            500: '#F5821F',
            600: '#C46819',
            700: '#934E13',
            800: '#62340C',
            900: '#311A06',
          },
        },
        dark: {
          DEFAULT: '#1A2332',
          50: '#F8FAFB',
          100: '#E2E8F0',
          200: '#CBD5E1',
          300: '#94A3B8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#1A2332',
          900: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'sidebar': '2px 0 8px -2px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-up': 'slideInUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'count-up': 'countUp 1s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
