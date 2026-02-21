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
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "aurora-gradient":
          "linear-gradient(135deg, var(--color-aurora-start), var(--color-aurora-mid), var(--color-aurora-end))",
        "radial-glow":
          "radial-gradient(circle at center, var(--color-aurora-mid), transparent 70%)",
      },
      boxShadow: {
        "glow-purple": "0 0 60px rgba(124, 58, 237, 0.3)",
        "glow-pink": "0 0 40px rgba(244, 114, 182, 0.2)",
        "glow-cyan": "0 0 40px rgba(34, 211, 238, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        card: "var(--card-radius)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
