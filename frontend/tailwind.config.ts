/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
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
      boxShadow: {
        '3xl': '0px 10px 50px 15px rgba(0, 0, 0, 0.1)',
      },
      colors: {
        'text-primary-color': "#6A6A6A",
        'text-secondary-color': '#9B9B9B',
        'text-form-primary-color': '#6A778D',
        'button-primary-color': '#FF60A3',
        'button-secondary-color': '#F17382',
        'link-primary-color': '#FF75AF',
        'text-reg-primary-color': '#F07281',
        'gradient-pink-start': '#FF75AF',
        'gradient-pink-end': '#F17382',
        'reg-gradient-down': '#FA749E',
        'gradient-gray-start': '#F1F1F1',
        'gradient-gray-end': '#F9F9F9',
        'selected-item': '#F17382',
        'historys-background': 'rgba(36, 15, 33, 0.85)',
        'outline history': '#3D2C3A',
        'history-background': '#433040',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--btn-primary-background-color)",
          foreground: "var(--btn-primary-background-color)",
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
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), nextui()], 
};
