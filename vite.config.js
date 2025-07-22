// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',              // Root is the project folder
  publicDir: 'public',    // Where index.html is
  build: {
    outDir: 'dist',       // Default output
  }
})