// import path from "path"
// import react from "@vitejs/plugin-react-swc"
// import { defineConfig } from "vite"

// // https://vite.dev/config/
// export default defineConfig({
//   base: "./",
//   plugins: [react()],  
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      theme: {
        
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})