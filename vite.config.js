import { defineConfig } from 'vite'
import { resolve } from 'path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ResourceNest',
      fileName: (format) => `resourcenest.${format === 'es' ? 'js' : 'umd.cjs'}`,
    },
    rollupOptions: {
      output: {
        // Global variable name for UMD build
        exports: "named",
        name: 'ResourceNest',
      },
    },
  },
})

