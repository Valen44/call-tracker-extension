import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/content.ts'),
        background: resolve(__dirname, 'src/background/background.ts'),
        themeDetector: resolve(__dirname, 'src/content/themeDetector.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist/assets',
    emptyOutDir: false,
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
