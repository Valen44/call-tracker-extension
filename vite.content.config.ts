/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/content/content.tsx'),
      formats: ['es'],
      fileName: () => 'content.tsx'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].js'
      }
    },
    outDir: 'dist/assets/content', 
    emptyOutDir: false,
    target: 'esnext'
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
