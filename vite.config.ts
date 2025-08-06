import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Deshabilitar en producción
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          utils: ['axios', 'zustand']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Optimizaciones adicionales para producción
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://192.168.100.101:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173,
    host: true
  },
  // Optimizaciones de desarrollo
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mui/material',
      '@mui/icons-material',
      'react-router-dom',
      'chart.js',
      'react-chartjs-2',
      'axios',
      'zustand'
    ]
  }
})
