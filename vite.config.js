import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('node_modules/framer-motion')) return 'framer-motion';
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'react-vendor';
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
