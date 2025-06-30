import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
 
  base: "/",
  
  // Build configuration
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure proper module format
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'https://classsync-2uzj.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  
  // Preview server configuration (for production builds)
  preview: {
    port: 3000,
    strictPort: true,
  },
})