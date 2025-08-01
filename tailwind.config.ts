import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

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
      },
    },
  },
  plugins: [forms, typography],
  // darkMode: 'media', // or 'class' if you use a class-based toggle
};

export default config;