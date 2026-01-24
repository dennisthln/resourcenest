import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ResourceNest',
      fileName: (format) => `resourcenest.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      output: {
        // Global variable name for UMD build
        name: 'ResourceNest',
      },
    },
  },
})

