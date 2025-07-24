/// <reference types="node" />

import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
        manualChunks: undefined
      }
    },
    outDir: 'dist',
    emptyOutDir: false,
    target: 'esnext'
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
