import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './app/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]
export const theme = {
  extend: {
    screens : {
      '3xl': '1920px',
    },
    fontFamily: {
      "black": ["AloeveraDisplay-Black", ...fontFamily.sans],
      "bold": ["AloeveraDisplay-Bold", ...fontFamily.sans],
      "extrabold": ["AloeveraDisplay-ExtraBold", ...fontFamily.sans],
      "extralight": ["AloeveraDisplay-ExtraLight", ...fontFamily.sans],
      "medium": ["AloeveraDisplay-Medium", ...fontFamily.sans],
      "light": ["AloeveraDisplay-Light", ...fontFamily.sans],
      "normal": ["AloeveraDisplay-Regular", ...fontFamily.sans],
      "semibold": ["AloeveraDisplay-SemiBold", ...fontFamily.sans],
      "thin": ["AloeveraDisplay-Thin", ...fontFamily.sans],

      sans: ["AloeveraDisplay-Regular", ...fontFamily.sans],
      heading: ["AloeveraDisplay-bold", ...fontFamily.serif],
    },
    colors: {
      "blue-base": "#221AE9",
      "turqouise-base": "#25ceda",
      "lightsky-blue-base": "#81cff3",
      "success-green": "#00b427",
      "warning-yellow": "#ffbb00",
      "danger-red": "#fd0000",
      // light
      "light-10": "#fafdff",
      "light-40": "#eefafe",
      "light-60": "#C0CED4",
      "light-base": "e6f7fe",
      // dark
      "dark-30": "#585858",
      "dark-base": "#040404",
      // game color
      "briliant-bg": "#27c2a3",
      "great-bg": "#749bbf",
      "best-bg": "#80b64d",
      "mistake-bg": "#ffa459",
      "miss-bg": "#ff7769",
      "blunder-bg": "#fa402d",

      //to be deleted
      "primary-white": "#FCFCFD",
      "primary-gray": "#DEDEDE",
      "gray-placeholder": "#F8F9FC",
      "gray-placeholder-text": "#717375",
      "game-green": "#00B427",
      "game-red": "#FD0000",
      "blue-light": "#E6F7FE",

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
}
export const plugins = [require("tailwindcss-animate")]

