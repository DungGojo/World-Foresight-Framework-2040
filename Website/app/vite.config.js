import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static-hostable SPA. `base: './'` makes the built /dist work from any
// sub-path (GitHub Pages, Netlify, or opening over a static server).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5180, host: true, strictPort: false },
  preview: { port: 5181, host: true },
  build: { outDir: 'dist', assetsInlineLimit: 4096 },
})
