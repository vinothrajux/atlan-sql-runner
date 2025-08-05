import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',         // Next.js App Router pages
    './src/components/**/*.{ts,tsx}',  // Atomic Design components
    './src/lib/**/*.{ts,tsx}',         // Utility and logic code
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir', 'Arial', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'red', // blue-600
          light: '#3b82f6',  // blue-500
          dark: '#1e40af',   // blue-800
        },
        accent: {
          DEFAULT: '#f59e42', // orange-400
          light: '#fbbf24',  // yellow-400
          dark: '#b45309',   // yellow-800
        },
        neutral: {
          DEFAULT: '#64748b', // slate-500
          light: '#cbd5e1',  // slate-200
          dark: '#334155',   // slate-800
        },
      },
    },
  },
  plugins: [forms, typography, scrollbar],
  // darkMode: 'media', // or 'class' if you use a class-based toggle
};

export default config;