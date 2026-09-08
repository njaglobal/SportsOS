import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@domain": path.resolve(__dirname, "src/domain"),
      "@ports": path.resolve(__dirname, "src/ports"),
      "@adapters": path.resolve(__dirname, "src/adapters"),
      "@shared": path.resolve(__dirname, "src/shared"),
    },
  },
});
