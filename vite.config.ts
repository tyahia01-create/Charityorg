import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Important: This makes all asset paths relative.
  build: {
    outDir: 'dist',
  },
<<<<<<< HEAD
  // Tauri configuration
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ['VITE_', 'TAURI_'],
})
=======
})
>>>>>>> b1fbf46c003fb4d099b7af607824fabd37368f0f
