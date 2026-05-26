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
          dark: "#b73314",
          deep: "#8f2813",
          light: "#ef6a46",
          soft: "#fff2ee",
        },
        ink: "#121110",
        slate: "#5f5b58",
        line: "#e7e2dd",
        canvas: "#f7f5f2",
        panel: "#ffffff",
        mist: "#f4efe8",
        smoke: "#201d1b",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Aptos", "Segoe UI Variable", "Segoe UI", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 24px 64px rgba(22, 19, 17, 0.12)",
        soft: "0 12px 34px rgba(22, 19, 17, 0.065)",
        glow: "0 18px 48px rgba(217, 70, 32, 0.18)",
        glass: "0 22px 70px rgba(22, 19, 17, 0.11)",
        luxe: "0 30px 90px rgba(22, 19, 17, 0.12)",
        tactile: "0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 34px rgba(22,19,17,0.08)",
        insetSoft: "inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -2px 6px rgba(22,19,17,0.04)",
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
