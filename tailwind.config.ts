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
        agnix: {
          bg: "#050505",
          sidebar: "#080808",
          secondary: "#0A0A0A",
          surface: "#101010",
          elevated: "#161616",
          hover: "#1F1F1F",
          border: "#222222",
          borderLight: "#2E2E2E",
          red: "#EF2B2D",
          redBright: "#FF3B30",
          orange: "#FF6A00",
          orangeFire: "#FF8A00",
          text: {
            primary: "#F5F5F5",
            secondary: "#A1A1AA",
            muted: "#71717A",
          },
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "fire-subtle": "0 0 15px -3px rgba(239, 43, 45, 0.15)",
        "fire-glow": "0 0 25px -4px rgba(239, 43, 45, 0.3), 0 0 10px -2px rgba(255, 106, 0, 0.2)",
        "fire-border": "0 0 0 1px rgba(239, 43, 45, 0.35)",
      },
      keyframes: {
        pulseFire: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-fire": "pulseFire 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
