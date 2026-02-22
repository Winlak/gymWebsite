import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#0f172a",
        mist: "#f1f5f9",
        accent: "#14b8a6",
        warn: "#ef4444"
      },
      keyframes: {
        timerAlert: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.28" }
        },
        buttonBlink: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.72", filter: "brightness(1.2)" }
        },
        discountOut: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-10px) scale(0.96)" }
        },
        priceIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "timer-alert": "timerAlert 0.7s linear infinite",
        "button-blink": "buttonBlink 1.15s step-end infinite",
        "discount-out": "discountOut 0.6s ease forwards",
        "price-in": "priceIn 0.4s ease forwards"
      }
    }
  },
  plugins: []
};

export default config;
