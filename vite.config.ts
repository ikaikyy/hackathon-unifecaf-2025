import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@public": path.resolve(__dirname, "public"),
    },
  },
  plugins: [react(), tailwindcss()],
});
