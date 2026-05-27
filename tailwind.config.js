/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10212d",
        sand: "#f6efe7",
        coral: "#ff8b6a",
        mint: "#a6e4cf",
        sky: "#9ad7ff",
        gold: "#f7cc73",
      },
      boxShadow: {
        soft: "0 24px 64px rgba(10, 28, 44, 0.12)",
      },
      fontFamily: {
        display: ["'Sora'", "'IBM Plex Sans Thai'", "sans-serif"],
        body: ["'IBM Plex Sans Thai'", "'Noto Sans Thai'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
