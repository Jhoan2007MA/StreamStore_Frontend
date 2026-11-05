import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// El "proxy" hace que las peticiones a /api se reenvíen al backend (puerto 3000).
// Así el navegador cree que front y back son el mismo sitio y las cookies de sesión funcionan sin problemas.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
})
