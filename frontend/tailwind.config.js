/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        card: "#0f172a",
        primary: "#22d3ee",
        success: "#22c55e",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
