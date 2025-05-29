import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Determine the base URL based on the environment
const getBase = () => {
  // Check if we're building for Netlify
  if (process.env.NETLIFY === "true") {
    return "/"; // Use root path for Netlify
  }
  return "/vienna-bike-stations/"; // Use repository name for GitHub Pages
};

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  base: getBase(),
});
