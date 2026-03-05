import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--color-void)",
        cosmos: "var(--color-cosmos)",
        nebula: "var(--color-nebula)",
        stardust: "var(--color-stardust)",
        aurora: {
          start: "var(--color-aurora-start)",
          mid: "var(--color-aurora-mid)",
          end: "var(--color-aurora-end)",
        },
        glow: {
          pink: "var(--color-glow-pink)",
          cyan: "var(--color-glow-cyan)",
          amber: "var(--color-glow-amber)",
        },
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary": "var(--color-text-tertiary)",
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        card: "var(--card-radius)",
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
