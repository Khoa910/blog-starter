/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite', // quay chậm 10 giây 1 vòng
        'spin-slower': 'spin 20s linear infinite', // tuỳ chọn quay cực chậm
      },
    },
  },
  plugins: [],
};