import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#d94620",
          dark: "#b93517",
          deep: "#8f2b16",
          light: "#ff7a4f",
          soft: "#fff1ec",
        },
        ink: "#161311",
        slate: "#5f5b57",
        line: "#e7e0dc",
        canvas: "#f8f6f3",
        panel: "#ffffff",
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 48px rgba(22, 19, 17, 0.1)",
        soft: "0 10px 28px rgba(22, 19, 17, 0.055)",
        glow: "0 18px 48px rgba(217, 70, 32, 0.18)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to right, rgba(217,72,31,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(217,72,31,0.08) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
