import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/entix-web-client/',
  build: {
    outDir: 'dist',
  },
  plugins: [react()],
})
