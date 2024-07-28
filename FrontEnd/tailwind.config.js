/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        layer: {
          "100%": { left: "0%" },
        },
      },
      animation: {
        layer: "layer 6s ease-in-out forwards",
      },
    },
  },
};
