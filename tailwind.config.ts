import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: "#f3f4f6",
        "muted-foreground": "#6b7280",
      },
    },
  },
  plugins: [],
};
export default config;
