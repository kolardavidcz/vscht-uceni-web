import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const plugins = [react(), tailwindcss()];
  if (command === 'build') {
    plugins.push(viteSingleFile() as any);
  }
  return {
    plugins,
  };
});
