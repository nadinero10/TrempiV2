import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/otp": {
        target: "https://capi.inforu.co.il",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/otp/, "/api/Otp"),
      },
      "/api/sms": {
        target: "https://capi.inforu.co.il",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api\/sms/, "/api/SMS"),
        configure: (proxy) => {
          proxy.on("error", (err) => { console.log("[proxy] error:", err.message) })
          proxy.on("proxyRes", (proxyRes, req) => { console.log("[proxy]", req.url, "→", proxyRes.statusCode) })
        },
      },
    },
  },
})
