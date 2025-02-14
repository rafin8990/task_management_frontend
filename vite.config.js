import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/images": {
        target: "https://lh3.googleusercontent.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/images/, ""), // Remove /images prefix
      },
    },
  },
  plugins: [react()],
});
