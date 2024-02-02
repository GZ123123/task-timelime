import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: { '.js': 'jsx', },
    },
  }, 
  rollupOptions: {
    output: {
        entryFileNames: 'calendar.js',
        assetFileNames: 'calendar.css',
        chunkFileNames: "chunk.js",
    }
  }
})
