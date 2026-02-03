/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#003933', 
        secondary: '#fabf02', 
        tertiary: '#005249',
      },
      fontFamily: {
        oswald: 'var(--font-oswald)',
      },
    },
  },
  plugins: [],
};

export default tailwindConfig;
