import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli.ts')
      },
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => `${entryName}.${format}.js`
    },
    rollupOptions: {
      external: ['chalk', 'fs', 'path'],
      output: {
        format: 'cjs'
      }
    }
  },
  plugins: [dts()]
}); 