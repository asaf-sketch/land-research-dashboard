import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  plugins: isGitHubPages ? [react()] : [react(), viteSingleFile()],
  base: isGitHubPages ? "/land-research-dashboard/" : "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
