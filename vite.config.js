import { resolve } from "path"
import { defineConfig } from "vite"

// Static multi-page site (index/about/stock/contact).
// Vite serves these .html files directly in dev and builds them all for production.
export default defineConfig({
  root: ".",
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        stock: resolve(__dirname, "stock.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
})
