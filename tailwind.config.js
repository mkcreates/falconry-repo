/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // background theme colors for dark mode
        darkBg1: '#161D27',
        darkBg2: '#272E3A',
        darkBg3: '#0e1218',

        // background theme colors for light mode
        lightBg1: '#F1F1F1',
        lightBg2: '#FFFFFF',
        lightBg3: '#dddddd',

        // others
        whitish: 'rgba(255,255,255,0.9)'
      },
      fontSize: {
        sm2: ['1rem', '1.3rem']
      },
      screens: {
        mic: '360px',
        xs: '540px',
        scr900: '900px',
        scr1440: '1440px'
      }
    },
  },
  plugins: [],
}
