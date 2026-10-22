import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// Relative base so the build works on Netlify, Vercel and GitHub Pages.
export default defineConfig({
  base: "./",
  plugins: [tailwindcss()],
});
