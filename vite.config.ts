import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
import { localApiPlugin } from "./vite-plugin-local-api";

/**
 * Multi-chunk production build (default).
 * Single-file was previously used via vite-plugin-singlefile but is not needed
 * for Vercel — hashed JS/CSS chunks cache better for the common
 * `/mikrobiologie` entry path.
 */
export default defineConfig({
  server: {
    port: 34020,
    strictPort: true,
  },
  preview: {
    port: 34024,
    strictPort: true,
  },
  plugins: [react(), tailwindcss(), localApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("\\react\\")) {
            return "react-vendor";
          }
          if (
            id.includes("react-markdown") ||
            id.includes("remark") ||
            id.includes("rehype") ||
            id.includes("highlight.js") ||
            id.includes("lowlight") ||
            id.includes("hast") ||
            id.includes("mdast") ||
            id.includes("unist") ||
            id.includes("vfile")
          ) {
            return "markdown-vendor";
          }
          if (id.includes("lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
});
