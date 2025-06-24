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
    host: "0.0.0.0",
    port: parseInt(process.env.PORT) || 5173,
  },
  preview: {
    host: "0.0.0.0",
    port: parseInt(process.env.PORT) || 5173,
    allowedHosts: ["code-editor-xw43.onrender.com"], // 👈 Add your Render host here
  },
})
