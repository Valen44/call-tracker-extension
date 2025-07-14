/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/content/content.js'),
      formats: ['es'],
      fileName: () => 'content.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true // ✅ flatten all imports
      }
    },
    outDir: 'dist/assets/content', // 👈 keep it tidy
    emptyOutDir: false,
    target: 'esnext'
  }
})
