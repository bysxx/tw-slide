import type { Config } from 'tailwindcss';

export default {
  content: [
    './demo/**/*.{html,ts}',
    './src/**/*.ts',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
