import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pitch: "#16281C",
        turf: {
          DEFAULT: "#3F6B34",
          light: "#5C8A4E",
          dark: "#2C4D25",
        },
        chalk: "#EFEAD8",
        clay: {
          DEFAULT: "#A3441C",
          light: "#C25A2E",
        },
        soil: "#201C15",
        moss: "#6E7B5E",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "grain-dark":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.02) 0%, transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
