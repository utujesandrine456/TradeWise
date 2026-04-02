import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 2016
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['redux', '@reduxjs/toolkit', 'react-redux'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
});
=======
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
