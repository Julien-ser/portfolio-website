import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "#0a0a0a",
          text: "#00ff00",
          prompt: "#00ff00",
          command: "#00ff00",
          output: "#cccccc",
          error: "#ff4444",
          success: "#44ff44",
        },
      },
    },
  },
  plugins: [],
};
export default config;