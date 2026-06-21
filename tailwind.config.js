/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          teal: '#008080',
          blue: '#1A5F7A',
          lightBlue: '#E6F3F5',
          lightGray: '#F5F7FA',
          white: '#FFFFFF',
        },
        role: {
          nephrologist: '#9333EA', // Purple
          inCharge: '#1E3A8A', // Dark Blue
          rn: '#0EA5E9', // Light Blue / Cyan
          pn: '#16A34A', // Green
        }
      }
    },
  },
  plugins: [],
}
