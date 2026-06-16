import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        surface: '#F8FAFC',
        navy: '#0F172A',
        slate: '#334155',
        accent: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      },
      boxShadow: {
        glass: '0 30px 80px rgba(15, 23, 42, 0.12)'
      },
      backdropBlur: {
        xl: '40px'
      }
    }
  },
  plugins: []
} satisfies Config;
