import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f0f0f0",
          100: "#d0d0d0",
          200: "#a0a0a0",
          300: "#707070",
          400: "#404040",
          500: "#202020",
          600: "#161616",
          700: "#111111",
          800: "#0a0a0a",
          900: "#050505",
        },
        crimson: {
          400: "#ff4d6d",
          500: "#e63950",
          600: "#c41e3a",
        },
        gold: {
          400: "#ffd700",
          500: "#ffb800",
          600: "#e6a500",
        },
        cyan: {
          400: "#00d4ff",
          500: "#00b8e6",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "manga-grid": "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "speed-lines": "repeating-conic-gradient(from 0deg, transparent 0deg, transparent 5deg, rgba(255,77,109,0.02) 5deg, rgba(255,77,109,0.02) 6deg)",
      },
      animation: {
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,77,109,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(255,77,109,0.6), 0 0 80px rgba(255,77,109,0.2)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
