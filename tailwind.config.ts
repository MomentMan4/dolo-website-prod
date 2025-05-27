import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#003B6F",
          50: "#E6EFF6",
          100: "#CCE0ED",
          200: "#99C1DB",
          300: "#66A2C9",
          400: "#3383B7",
          500: "#003B6F",
          600: "#003059",
          700: "#002543",
          800: "#001A2E",
          900: "#000F18",
        },
        orange: {
          DEFAULT: "#FF6B35",
          50: "#FFF2EC",
          100: "#FFE5D9",
          200: "#FFCBB3",
          300: "#FFB18D",
          400: "#FF9767",
          500: "#FF6B35",
          600: "#FF4A03",
          700: "#D03800",
          800: "#9A2900",
          900: "#641B00",
        },
        teal: {
          DEFAULT: "#007196",
          50: "#E6F3F7",
          100: "#CCE7F0",
          200: "#99CFE1",
          300: "#66B7D2",
          400: "#339FC3",
          500: "#007196",
          600: "#005A78",
          700: "#00435A",
          800: "#002C3C",
          900: "#00151E",
        },
        coral: {
          DEFAULT: "#FF5073",
          50: "#FFF0F3",
          100: "#FFE0E7",
          200: "#FFC1CF",
          300: "#FFA2B7",
          400: "#FF839F",
          500: "#FF5073",
          600: "#FF1D4B",
          700: "#E9002F",
          800: "#B70025",
          900: "#85001B",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "80%": { transform: "scale(1.1)", opacity: "0.8" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 0px rgba(255, 107, 53, 0)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 107, 53, 0.5)" },
          "100%": { boxShadow: "0 0 0px rgba(255, 107, 53, 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in-from-left": "slideInFromLeft 0.8s ease-out forwards",
        "slide-in-from-right": "slideInFromRight 0.8s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "bounce-in": "bounceIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        glow: "glow 2s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
