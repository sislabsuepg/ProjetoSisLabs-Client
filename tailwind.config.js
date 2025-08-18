/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      colors: {
        'theme-blue': '#314A73',
        'theme-lightBlue': '#29AFE5',
        'theme-white': '#fff',
        'theme-black': '#000',
        'theme-bg': '#FAFAFA',
        'theme-text': '#5E5E5E',
        'theme-inputBg': '#EAE9E9',
        'theme-container': '#ECECEC',
        'theme-red': '#FF6666',
        'theme-green': '#42AD32',
      },
    },
    screens: {
      xsm: '320px',
      sm: '375px',
      gsm: '410px',
      msm: '480px',
      ltm: '570px',
      lsm: '680px',
      md: '768px',
      lmd: '864px',
      dlg: '1024px',
      lg: '1199px',
      xl: '1280px',
      '1xl': '1367px',
      '2xl': '1536px',
      '3xl': '1875px',
    },
  },
  plugins: [],
};
