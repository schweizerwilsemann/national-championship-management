import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api/v1": {
          target: env.VITE_ADMIN_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: {
            "*": "",
          },
          configure: (proxy, _options) => {
            proxy.on("proxyRes", (proxyRes) => {
              // Log cookies for debugging
              const cookies = proxyRes.headers["set-cookie"];
              if (cookies) {
                console.log("Received cookies from backend:", cookies);
              }
            });
          },
        },
      },
    },
  };
});
