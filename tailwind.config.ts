import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        background: "#0f172a", // A deep, dark blue
        foreground: "#e2e8f0", // A light gray for text
        primary: "#3b82f6", // A vibrant blue
        secondary: "#1e293b", // A slightly lighter dark blue for cards
        muted: {
          DEFAULT: "#334155", // A medium gray for less important elements
          foreground: "#94a3b8", // A lighter gray for muted text
        },
        accent: {
          DEFAULT: "#818cf8", // A soft purple
          foreground: "#e0e7ff", // A very light purple
        },
        card: "#1e293b", // Same as secondary
        border: "#334155", // Same as muted
        destructive: {
          DEFAULT: "#f87171", // A soft red
          foreground: "#fef2f2", // A very light red
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
