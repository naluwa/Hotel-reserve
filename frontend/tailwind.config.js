/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        heritage: {
          950: "#05080d",
          900: "#0f1115",
          800: "#141b26",
          700: "#1b2140",
        },
        cashmere: {
          950: "#10141e",
          900: "#161922",
          800: "#1f2937",
          700: "#2c3347",
        },
        brand: {
          DEFAULT: "#af8c43",
          soft: "#d6b069",
          dark: "#8c6f35",
        },
        accent: {
          DEFAULT: "#ffd166",
          soft: "#fff4c2",
          dark: "#d7a517",
        },
        brass: {
          DEFAULT: "#af8c43",
          light: "#c9a963",
          muted: "#7a6230",
          subtle: "#d6b069",
        },
        slate: {
          950: "#0f172a",
          900: "#111827",
          800: "#1f2937",
          700: "#374151",
          600: "#4b5563",
          500: "#6b7280",
          400: "#9ca3af",
          300: "#d1d5db",
          200: "#e5e7eb",
          100: "#f3f4f6",
        },
        success: {
          DEFAULT: "#22c55e",
          dark: "#15803d",
        },
        warning: {
          DEFAULT: "#f59e0b",
          dark: "#b45309",
        },
        danger: {
          DEFAULT: "#ef4444",
          dark: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 24px 70px rgba(0, 0, 0, 0.18)",
        panel: "0 20px 60px rgba(0, 0, 0, 0.16)",
        modal: "0 24px 80px rgba(0, 0, 0, 0.55)",
        glow: "0 0 0 1px rgba(79, 153, 255, 0.12), 0 28px 80px rgba(7, 17, 30, 0.22)",
      },
      borderRadius: {
        xl: "1.75rem",
        "2xl": "2rem",
        "3xl": "2.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "fade-in": "fadeIn 0.55s ease-out forwards",
      },
    },
  },
  plugins: [],
};
