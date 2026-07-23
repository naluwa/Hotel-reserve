/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Background (60%) — Midnight Charcoal
        heritage: {
          900: "#0F1115",
          800: "#14171D",
        },
        // Secondary / Cards (30%) — Cashmere Slate
        cashmere: {
          900: "#1B1D22",
          800: "#22252C",
          700: "#2C2F38",
        },
        // Accent (10%) — Antique Brass
        brass: {
          DEFAULT: "#AF8C43",
          light: "#C29C4A",
          muted: "#7A6230",
        },
        // Semantic states
        pine: {
          DEFAULT: "#059669",
          dark: "#065F46",
        },
        crimson: {
          DEFAULT: "#E11D48",
          dark: "#9F1239",
        },
        ochre: {
          DEFAULT: "#D97706",
          dark: "#92400E",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 8px 32px rgba(0,0,0,0.5)",
        "card-hover": "0 12px 48px rgba(0,0,0,0.65)",
        modal: "0 24px 80px rgba(0,0,0,0.7)",
      },
      borderColor: {
        brass: "#AF8C43",
        "brass-subtle": "#3A3020",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "fade-slide-up":
          "fadeSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
