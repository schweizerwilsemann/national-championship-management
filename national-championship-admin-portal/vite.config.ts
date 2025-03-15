import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1": {
        target: process.env.VITE_ADMIN_BACKEND_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ""), // Nếu cần loại bỏ /api/v1
      },
    },
  },
});
