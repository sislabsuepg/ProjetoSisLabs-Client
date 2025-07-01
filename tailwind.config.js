/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: '#314A73',       
      'light-blue': '#29AFE5',    
        white: '#ffffff',      
        black: '#000000',     
        background: '#FAFAFA',
      }
    },
  },
  plugins: [],
};
