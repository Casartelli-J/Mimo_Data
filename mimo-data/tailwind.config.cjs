/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Utilitários presentes no Tailwind 4, adicionados para preservar o visual no v3.
      spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        25: '6.25rem',
        26: '6.5rem',
        55: '13.75rem',
      },
    },
  },
  plugins: [],
};
