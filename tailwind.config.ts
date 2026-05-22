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
          soft: "#fff1ec",
        },
        ink: "#141414",
        slate: "#5f6368",
        line: "#e8e8e8",
        canvas: "#f7f7f6",
        panel: "#ffffff",
      },
      fontFamily: {
        sans: ["Aptos", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 42px rgba(20, 20, 20, 0.08)",
        soft: "0 8px 24px rgba(20, 20, 20, 0.05)",
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
