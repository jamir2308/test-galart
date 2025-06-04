// tailwind.config.ts
import type { Config } from "tailwindcss";

export default <Config>{
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4fd1c5",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
};
