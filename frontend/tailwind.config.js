/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Noto Sans Khmer", "sans-serif"],
      },
      colors: {
        bank: {
          emerald: "#059669",
          slate: "#0f172a",
          mist: "#f8fafc",
        },
      },
      boxShadow: {
        "soft-xl": "0 20px 40px -24px rgba(2, 6, 23, 0.35)",
      },
    },
  },
  plugins: [],
};

