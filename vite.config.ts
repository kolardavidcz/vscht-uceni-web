import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
import { localApiPlugin } from "./vite-plugin-local-api";

export default defineConfig(({ command }) => {
  const plugins = [react(), tailwindcss(), localApiPlugin()];
  if (command === "build") {
    plugins.push(viteSingleFile());
  }
  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});

