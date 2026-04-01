import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 1. Set the base path so React knows it lives in a subfolder
  base: '/Sentri-PRC/', 

  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  // 2. Tell Vite where to put the compiled files so JAL can find them
  build: {
    outDir: 'dist', 
    emptyOutDir: true,
  },
})