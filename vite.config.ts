import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Charityorg/', 
  // Important: This makes all asset paths relative.
  build: {
    outDir: 'dist',
  }, })