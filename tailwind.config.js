/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        hespor: { dark: "#0a0a0a", light: "#f8f9fb" }
      },
      borderRadius: { xl: "0.75rem", "2xl": "1rem" }
    },
  },
  plugins: [],
};
