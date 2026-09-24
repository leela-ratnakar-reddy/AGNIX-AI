/**
 * Centralized Design System & Theme Tokens for AGNIX AI
 * 
 * Philosophy:
 * - 70-80% Black / Deep Carbon
 * - 10-15% Precision Red (#EF2B2D / #FF3B30)
 * - 5-10% Fire Orange (#FF6A00 / #FF8A00)
 * - Clean neutral typography (#F5F5F5, #A1A1AA, #71717A)
 */

export const THEME = {
  colors: {
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
  brand: {
    name: "AGNIX AI",
    tagline: "Think. Build. Execute.",
    version: "0.1.0",
    modelName: "AGNIX 1.0 Core",
  },
} as const;
